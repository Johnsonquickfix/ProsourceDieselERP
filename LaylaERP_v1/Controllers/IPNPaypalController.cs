using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class IPNPaypalController : Controller
    {
        // GET: IPNPaypal
        public ActionResult ipnpaypal()
        {
            Receive();
            return View();
        }
        [HttpPost]
        public HttpStatusCodeResult Receive()
        {
            //Store the IPN received from PayPal
            LogRequest(Request);

            //Fire and forget verification task
            Task.Run(() => VerifyTask(Request));

            //Reply back a 200 code
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        private void VerifyTask(HttpRequestBase ipnRequest)
        {
            var verificationResponse = string.Empty;

            try
            {
                var verificationRequest = (HttpWebRequest)WebRequest.Create(clsPayPal.Paypal_IPNurl);

                //Set values for the verification request
                verificationRequest.Method = "POST";
                verificationRequest.ContentType = "application/x-www-form-urlencoded";
                //var param = Request.BinaryRead(ipnRequest.ContentLength);
                //var strRequest = Encoding.ASCII.GetString(param);
                var strRequest = ipnRequest.QueryString.ToString();

                //Add cmd=_notify-validate to the payload
                strRequest = "cmd=_notify-validate&" + strRequest;
                verificationRequest.ContentLength = strRequest.Length;

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                //Attach payload to the verification request
                var streamOut = new StreamWriter(verificationRequest.GetRequestStream(), Encoding.ASCII);
                streamOut.Write(strRequest);
                streamOut.Close();

                //Send the request to PayPal and get the response
                var streamIn = new StreamReader(verificationRequest.GetResponse().GetResponseStream());
                verificationResponse = streamIn.ReadToEnd();
                streamIn.Close();

            }
            catch //(Exception exception)
            {
                //Capture exception for manual investigation
            }

            ProcessVerificationResponse(verificationResponse);
        }

        private void LogRequest(HttpRequestBase request)
        {
            try
            {
                if (!string.IsNullOrEmpty(request.QueryString.ToString()))
                {
                    BAL.OrderRepository.UpdatePaymentLog(request.QueryString.ToString());
                }
            }
            catch //(Exception exception)
            {
                //Capture exception for manual investigation
            }
        }

        private void ProcessVerificationResponse(string verificationResponse)
        {            
            if (verificationResponse.Equals("VERIFIED"))
            {
                //BAL.OrderRepository.UpdatePaymentLog(verificationResponse);
                string id = Request.QueryString["invoice"];
                // check that Payment_status=Completed   -- Request.QueryString["Payment_status"]
                // check that Txn_id has not been previously processed   -- Request.QueryString["txn_id"]
                // check that Receiver_email is your Primary PayPal email  -- Request.QueryString["Receiver_email"]
                // check that Payment_amount/Payment_currency are correct  -- Request.QueryString["Payment_amount"]
                // process payment
                string str = "[{ post_id: 0, meta_key: '_paypal_status', meta_value: '" + Request.QueryString["Payment_status"].ToUpper() + "' }, { post_id: 0, meta_key: '_transaction_id', meta_value: '" + Request.QueryString["txn_id"] + "' },"
                            + "{ post_id: 0, meta_key: 'Payer PayPal address', meta_value: '" + Request.QueryString["payer_email"] + "' }]";

                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + str + "}", "Items");

                BAL.OrderRepository.AddOrdersPost(0, "IPNPU", 0, id, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);

            }
            else if (verificationResponse.Equals("INVALID"))
            {
                string id = Request.QueryString["invoice"];
                string str = "[{ post_id: 0, meta_key: '_paypal_status', meta_value: '" + Request.QueryString["Payment_status"].ToUpper() + "' }, { post_id: 0, meta_key: '_transaction_id', meta_value: '" + Request.QueryString["txn_id"] + "' },"
                            + "{ post_id: 0, meta_key: 'Payer PayPal address', meta_value: '" + Request.QueryString["payer_email"] + "' }]";

                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + str + "}", "Items");

               BAL.OrderRepository.AddOrdersPost(0, "IPNPU", 0, id, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);

            }
            else
            {
                //Log error
            }
        }
    }
}