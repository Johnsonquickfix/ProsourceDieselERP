using LaylaERP.DAL;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace LaylaERP.UTILITIES
{
    public class clsPayPal
    {
        private static string base_url = "https://api.sandbox.paypal.com";
        public static string Paypal_IPNurl = "https://www.sandbox.paypal.com/cgi-bin/webscr";
        //public static string Paypal_IPNurl = "https://paypal.com/cgi-bin/webscr";
        public static string GetToken()
        {
            // string client_id = "AcuqRFTJWTspIMomXNjD8qqaY3FYB3POMIKoJOI3P79e85Nluk0b8OME0k-zBnEllg2e03LoBLXbJ0l0", client_secret = "EA_mO1Ia607bvwcFf5wHMYW-XLx4QST-S41Sr7iG8gCfWkDDzM794mvBjbysx1Nb_5P-MrruKBLWng-u";
            //string client_id = CommanUtilities.Provider.GetCurrent().PaypalClientId, client_secret = CommanUtilities.Provider.GetCurrent().PaypalSecret;
            string client_id = string.Empty, client_secret = string.Empty;
            System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            if (dt.Rows.Count > 0)
            {
                client_id = (dt.Rows[0]["PaypalClientId"] != Convert.DBNull) ? dt.Rows[0]["PaypalClientId"].ToString().Trim() : string.Empty;
                client_secret = (dt.Rows[0]["PaypalSecret"] != Convert.DBNull) ? dt.Rows[0]["PaypalSecret"].ToString().Trim() : string.Empty;
            }

            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsAccessToken result = new clsAccessToken();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/v1/oauth2/token");
                client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{client_id}:{client_secret}"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64String);
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.PostAsync("", content).Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = JsonConvert.DeserializeObject<clsAccessToken>(response.Content.ReadAsStringAsync().Result);
                }
                else { result.access_token = string.Empty; }
            }
            return result.access_token;
        }
        public static string CreateInvoiceNo(string access_token = "")
        {
            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsAccessToken result = new clsAccessToken();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/v2/invoicing/generate-next-invoice-number");
                //client.DefaultRequestHeaders.Add("Content-Type", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.PostAsync("", content).Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = JsonConvert.DeserializeObject<clsAccessToken>(response.Content.ReadAsStringAsync().Result);
                }
                else { result.invoice_number = string.Empty; }
            }
            return result.invoice_number;
        }

        public static string CreatePaypalInvoice(string invoice_id, string json_data)
        {
            string invoice_info = string.Empty;
            string access_token = GetToken();

            if (!string.IsNullOrEmpty(access_token))
            {
                var client_rest = new RestClient(base_url + "/v2/invoicing/invoices");
                var request = new RestRequest(Method.POST);
                if (!string.IsNullOrEmpty(invoice_id))
                {
                    client_rest = new RestClient(base_url + "/v2/invoicing/invoices/" + invoice_id);
                    request = new RestRequest(Method.PUT);
                    request.AddHeader("Accept", "application/json");
                    request.AddHeader("Content-Type", "application/json");
                    request.AddHeader("Authorization", "Bearer " + access_token);
                    request.AddParameter("application/json", json_data, ParameterType.RequestBody);
                    IRestResponse response_rest = client_rest.Execute(request);
                    if (response_rest.StatusCode == HttpStatusCode.OK)
                    {
                        invoice_info = response_rest.Content;
                    }
                }
                else
                {
                    request.AddHeader("Accept", "application/json");
                    request.AddHeader("Content-Type", "application/json");
                    request.AddHeader("Authorization", "Bearer " + access_token);
                    request.AddParameter("application/json", json_data, ParameterType.RequestBody);
                    IRestResponse response_rest = client_rest.Execute(request);
                    string sendURL = string.Empty;
                    if (response_rest.StatusCode == HttpStatusCode.Created)
                    {
                        sendURL = JsonConvert.DeserializeObject<dynamic>(response_rest.Content).href;
                    }
                    // send invoice
                    if (!string.IsNullOrEmpty(sendURL))
                    {
                        client_rest = new RestClient(sendURL + "/send");
                        request = new RestRequest(Method.POST);
                        request.AddHeader("Accept", "application/json");
                        request.AddHeader("Content-Type", "application/json");
                        request.AddHeader("Authorization", "Bearer " + access_token);
                        request.AddParameter("application/json", "{ \"send_to_recipient\": true, \"send_to_invoicer\": true }", ParameterType.RequestBody);
                        response_rest = client_rest.Execute(request);
                        if (response_rest.StatusCode == HttpStatusCode.OK)
                        {
                            invoice_info = response_rest.Content;
                        }
                    }
                }
            }
            return invoice_info;
        }
        public static string PaypalPaymentRefund(string capture_id, string invoice_id, string note_to_payer, decimal amount)
        {
            string invoice_info = string.Empty;
            string access_token = GetToken();

            if (!string.IsNullOrEmpty(access_token))
            {
                var client_rest = new RestClient(base_url + "/v2/payments/captures/" + capture_id + "/refund");
                var request = new RestRequest(Method.POST);
                request.AddHeader("Accept", "application/json");
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", "Bearer " + access_token);
                request.AddParameter("application/json", "{ \"note_to_payer\": \"" + note_to_payer + "\", \"invoice_id\":  \"" + invoice_id + " \", \"amount\": { \"currency_code\": \"USD\", \"value\": " + amount + " } }", ParameterType.RequestBody);
                IRestResponse response_rest = client_rest.Execute(request);

                if (response_rest.StatusCode == HttpStatusCode.OK)
                {
                    invoice_info = response_rest.Content;
                }
            }
            return invoice_info;
        }
        public static string PaypalInvoiceRefund(string invoice_id, string refund_date, decimal amount)
        {
            string invoice_info = string.Empty;
            string access_token = GetToken();

            if (!string.IsNullOrEmpty(access_token))
            {
                var client_rest = new RestClient(base_url + "/v2/invoicing/invoices/" + invoice_id + "/refund");
                var request = new RestRequest(Method.POST);
                request.AddHeader("Accept", "application/json");
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", "Bearer " + access_token);
                request.AddParameter("application/json", "{ \"method\": \"BANK_TRANSFER\", \"refund_date\":  \"" + refund_date + " \", \"amount\": { \"currency_code\": \"USD\", \"value\": " + amount + " } }", ParameterType.RequestBody);
                IRestResponse response_rest = client_rest.Execute(request);

                if (response_rest.StatusCode == HttpStatusCode.OK)
                {
                    invoice_info = response_rest.Content;
                }
            }
            return invoice_info;
        }
    }
    public class clsAccessToken
    {
        public string scope { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string app_id { get; set; }
        public string nonce { get; set; }
        public string invoice_number { get; set; }
    }
}