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
        public JsonResult ChangeOrderStatus(OrderPostStatusModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                OrderRepository or = new OrderRepository();
                or.ChangeOrderStatus(model, strID);
                return Json(new { status = true, message = "Order Status has been Changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
        [HttpPost]
        public JsonResult GetPayPalToken(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                long oid = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                List<OrderPostMetaModel> _list = new List<OrderPostMetaModel>();
                _list.Add(new OrderPostMetaModel() { post_id = oid, meta_key = "_payment_method", meta_value = "ppec_paypal" });
                _list.Add(new OrderPostMetaModel() { post_id = oid, meta_key = "_payment_method_title", meta_value = "PayPal" });
                _list.Add(new OrderPostMetaModel() { post_id = oid, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                _list.Add(new OrderPostMetaModel() { post_id = oid, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                //_list.Add(new OrderPostMetaModel() { post_id = oid, meta_key = "_paypal_status", meta_value = "pending" });
                //_list.Add(new OrderPostMetaModel() { post_id = oid, meta_key = "Payer PayPal address", meta_value = model.strValue2 });
                int res = OrderRepository.UpdatePayPalStatus(_list);
                if (res > 0)
                {
                    result = clsPayPal.GetToken();
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
    }
}