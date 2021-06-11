namespace LaylaERP.Controllers
{
    using BAL;
    using Models;
    using UTILITIES;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Net;
    using System.Text;

    public class OrdersController : Controller
    {
        // GET: New Orders
        public ActionResult NewOrders()
        {
            //ViewBag.OrderNo = OrderRepository.AddOrdersPost();
            return View();
        }

        // GET: Orders History/View
        public ActionResult OrdersHistory()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetNewOrderNo(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                JSONresult = OrderRepository.AddOrdersPost().ToString();
            }
            catch { }
            return Json(new { status = true, message = JSONresult, url = "" }, 0);
        }
        [HttpPost]
        public JsonResult GetCustomerList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetCustomers(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetCustomerAddress(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable DT = OrderRepository.GetCustomersInfo(id);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetProducts(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetProductInfo(SearchModel model)
        {
            List<OrderProductsModel> obj = new List<OrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    pid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    vid = Convert.ToInt64(model.strValue2);
                //obj = OrderRepository.GetProductDetails(pid, vid);
                obj = OrderRepository.GetProductListDetails(pid, vid);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult GetProductShipping(SearchModel model)
        {
            decimal ShippingAmt = 0;
            try
            {
                long pid = 0, vid = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    pid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    vid = Convert.ToInt64(model.strValue2);
                vid = vid > 0 ? vid : pid;
                OrderShippingModel obj = OrderRepository.GetProductShippingCharge(vid);
                if (model.strValue3 == "AK")
                    ShippingAmt = obj.AK;
                else if (model.strValue3 == "HI")
                    ShippingAmt = obj.HI;
                else if (model.strValue3 == "CA")
                    ShippingAmt = obj.CA;
                else
                    ShippingAmt = 0;
            }
            catch { }
            return Json(new { amount = ShippingAmt }, 0);
        }
        [HttpPost]
        public JsonResult GetTaxRate(SearchModel model)
        {
            decimal JSONresult = 0;
            try
            {
                JSONresult = clsTaxJar.GetTaxCombinedRate(model.strValue1, model.strValue2, model.strValue3);
            }
            catch (Exception ex) { }
            return Json(new { status = true, message = JSONresult, url = "" }, 0);
        }
        [HttpPost]
        public JsonResult GetCouponAmount(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetCouponDiscount(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult SaveCustomerOrder(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                var o = new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_id", meta_value = om.UserID.ToString() };
                model.OrderPostMeta.Add(o);
                o = new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_name", meta_value = om.UserName.ToString() };
                model.OrderPostMeta.Add(o);
                int result = OrderRepository.SaveOrder(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult UpdatePaymentDetail(OrderPostMetaModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                int result = OrderRepository.UpdateOrderStatus(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult GetOrderList(OrderPostStatusModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.status != "")
                    urid = model.status;
                string searchid = model.Search;
                DataTable dt = OrderRepository.OrderList(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult GetPayPalToken(SearchModel model)
        {
            JsonResult result = new JsonResult();
            try
            {
                string clientId = "AcuqRFTJWTspIMomXNjD8qqaY3FYB3POMIKoJOI3P79e85Nluk0b8OME0k-zBnEllg2e03LoBLXbJ0l0", clientSecret = "EA_mO1Ia607bvwcFf5wHMYW-XLx4QST-S41Sr7iG8gCfWkDDzM794mvBjbysx1Nb_5P-MrruKBLWng-u";
                var client = new HttpClient();
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Add("Accept-Language", "en_US");
                //client.DefaultRequestHeaders.Add("Authorization", string.Format("Basic {0}{1}", clientId , clientSecret));
                Encoding encoding = Encoding.GetEncoding("iso-8859-1");
                string usernamePassword = encoding.GetString(Convert.FromBase64String(clientId + ":"+ clientSecret));
                client.DefaultRequestHeaders.Add("Authorization", string.Format("Basic {0}", usernamePassword));
                string json = Newtonsoft.Json.JsonConvert.SerializeObject("{grant_type: 'client_credentials'}");
                StringContent content = new StringContent(json, System.Text.Encoding.UTF8, "application/x-www-form-urlencoded");
                var response = new HttpResponseMessage();
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                response = client.PostAsync("https://api.sandbox.paypal.com/v1/oauth2/token", content).Result;
                client.Dispose();
                if (response != null && response.IsSuccessStatusCode)
                {
                    result = this.Json(response.Content.ReadAsStringAsync().Result, JsonRequestBehavior.AllowGet);
                }           

            }
            catch(Exception ex) { }
            return result;
        }
    }
}