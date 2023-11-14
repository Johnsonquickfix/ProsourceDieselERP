using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using LaylaERP_v1.BAL;
using LaylaERP_v1.Models.Product;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class QuickorderController : Controller
    {
        // GET: Quickorder
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ProductDetails(CartResponse objs, long product_id, long vendor_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    pid = Convert.ToInt64(model.strValue1);
                //if (!string.IsNullOrEmpty(model.strValue2))
                //    vid = Convert.ToInt64(model.strValue2);
                obj = QuickorderRepository.ProductDetails(objs, product_id, vendor_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult getshipping(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.getshipping(objs, product_id, vendor_id, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult getshippingdetails(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.getshippingdetails(objs, product_id, vendor_id, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult addproduct(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.addproduct(objs, product_id, vendor_id, session_id);
            }
            catch (Exception ex)
            { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult addproductitem(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                //long pid = 0, vid = 0;
                //obj = QuickorderRepository.addproductitem(objs, product_id, vendor_id, session_id);
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/items/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));

                if (!string.IsNullOrEmpty(session_id) || session_id.Trim() != "0") request.Headers.Add("X-Cart-Session-Id", session_id);
                //List<Ordershipping> shippingData = getdetail(obj, 1, 1);
                // Serialize the list to JSON
                string json = JsonConvert.SerializeObject(objs.data.items);
                // Serialize the dynamicData array to a JSON string
                var content = new StringContent(json, null, "application/json");
                request.Content = content;
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                HttpResponseMessage response = client.SendAsync(request).Result; // Block and wait 
                if (response.IsSuccessStatusCode)
                {
                    //return Json(JsonConvert.DeserializeObject<dynamic>(response.Content.ReadAsStringAsync().Result), 0) ;
                    return Json(JsonConvert.DeserializeObject<CartResponse>(response.Content.ReadAsStringAsync().Result));
                }
            }
            catch (Exception ex)
            { return Json(new { message = ex.Message, status = 500, code = "InternalServerError", data = new List<string>() }, 0); }
            return Json(new { message = "Not Found.", status = 404, code = "not_found", data = new List<string>() }, 0);
        }
        [HttpPost]
        public JsonResult getshippingmethod(string methodId, string methodTitle, decimal amount, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.getshippingmethod(methodId, methodTitle, amount, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult applycoupon(string code, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.applycoupon(code, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult deletecoupon(string code, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.deletecoupon(code, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = QuickorderRepository.GetProductList(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetvariationProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = QuickorderRepository.GetvariationProductList(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult paymentorder(CartPaymentController objs, long product_id, long vendor_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.paymentorder(objs, product_id, vendor_id);
            }
            catch { }
            return Json(obj, 0);
        }

    }
}