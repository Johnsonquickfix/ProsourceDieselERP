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
        public ActionResult NewOrders(long id = 0)
        {
            ViewBag.id = id;
            string pay_method = CommanUtilities.Provider.GetCurrent().AuthorizeNet ? "{\"id\":\"amazon_payments_advanced\" ,\"text\":\"Amazon Pay\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().AmazonPay ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"authorize_net_cim_credit_card\" ,\"text\":\"Authorize Net\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Podium ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Paypal ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"ppec_paypal\" ,\"text\":\"PayPal\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            return View();
        }
        // GET: Order Refund
        public ActionResult OrderRefund(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }

        //\
        [HttpPost]
        public JsonResult GetCity(SearchModel model)
        {
            ZipCodeModel obj = new ZipCodeModel();
            try
            {
                if (string.IsNullOrEmpty(model.strValue1))
                {
                    throw new Exception("Invalid Data");
                }
                obj = OrderRepository.GetCityByZip(model.strValue1);
            }
            catch { }
            return Json(obj, 0);
        }

        // GET: Orders History/View
        public ActionResult OrdersHistory()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetOrderInfo(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long oid = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                DataTable DT = OrderRepository.GetOrders(oid);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetOrderProductList(SearchModel model)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                long oid = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                _list = OrderRepository.GetOrderProductList(oid);
            }
            catch { }
            return Json(_list, 0);
        }
        [HttpPost]
        public JsonResult GetOrderNotesList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long oid = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                DataTable DT = OrderRepository.GetOrderNotes(oid);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult OrderNoteAdd(OrderNotesModel model)
        {
            string JSONresult = string.Empty; bool b_status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.comment_author = om.UserName; model.comment_author_email = om.EmailID;
                int res = OrderRepository.AddOrderNotes(model);
                if (res > 0)
                {
                    JSONresult = "Order note added successfully."; b_status = true;
                }
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = b_status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult OrderNoteDelete(OrderNotesModel model)
        {
            string JSONresult = string.Empty; bool b_status = false;
            try
            {
                int res = OrderRepository.RemoveOrderNotes(model);
                if (res > 0)
                {
                    JSONresult = "Order note deleted successfully."; b_status = true;
                }
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = b_status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult GetNewOrderNo(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                JSONresult = OrderRepository.AddOrdersPost(model.OrderPostMeta).ToString();
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
            List<OrderShippingModel> _list = new List<OrderShippingModel>();
            try
            {
                _list = OrderRepository.GetProductShippingCharge(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(_list, 0);
        }
        [HttpPost]
        public JsonResult GetTaxRate(SearchModel model)
        {
            decimal JSONresult = 0;
            try
            {
                JSONresult = clsTaxJar.GetTaxCombinedRate(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.strValue5);
            }
            catch { JSONresult = 0; }
            return Json(new { status = true, rate = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult GetTaxAmounts(TaxJarModel model)
        {
            try
            {
                model = clsTaxJar.GetTaxes(model);
            }
            catch { }
            return Json(model, 0);
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
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult AddFee(OrderOtherItemsModel model)
        {
            long id = 0;
            try
            {
                id = OrderRepository.AddOrderFee(model);
            }
            catch { }
            return Json(new { status = true, order_item_id = id }, 0);
        }
        [HttpPost]
        public JsonResult RemoveFee(OrderOtherItemsModel model)
        {
            string result = "Invalid Details.";
            bool state = false;
            try
            {
                int res = OrderRepository.RemoveOrderFee(model);
                if (res > 0)
                {
                    result = "Fee successfuly removed.";
                    state = true;
                }
            }
            catch { state = false; result = "Invalid Details."; }
            return Json(new { status = state, message = result }, 0);
        }
        [HttpPost]
        public JsonResult SaveCustomerOrder(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_id", meta_value = om.UserID.ToString() });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_name", meta_value = om.UserName.ToString() });

                int result = OrderRepository.SaveOrder(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult SaveCustomerOrderRefund(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_refunded_by", meta_value = om.UserID.ToString() });

                int result = OrderRepository.SaveRefundOrder(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { status = false; JSONresult = "Something went wrong! Please try again."; }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult UpdatePaymentDetail(OrderPostMetaModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                int result = OrderRepository.UpdatePodiumStatus(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult GetOrdersCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = OrderRepository.OrderCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = OrderRepository.OrderList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public JsonResult GetCustomersOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = OrderRepository.SearchCustomersOrders(model.strValue1);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult GetCustomersAddresssList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = OrderRepository.SearchCustomerAddress(model.strValue1);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
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
        public JsonResult GetPayPalToken(OrderModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                int res = OrderRepository.UpdatePayPalStatus(model.OrderPostMeta);
                if (res > 0)
                {
                    result = clsPayPal.GetToken();
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult UpdatePayPalID(OrderModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                int res = OrderRepository.UpdatePayPalStatus(model.OrderPostMeta);
                if (res > 0)
                {
                    result = "Success.";
                    status = true;
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult SendMailInvoice(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                result = SendEmail.SendEmails(model.strValue1, model.strValue2, model.strValue3);
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }

        [HttpPost]
        public JsonResult SplitOrderByStatus(OrderPostStatusModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                int result = OrderRepository.SplitOrder(model);
                if (result > 0)
                { status = true; JSONresult = "Order splited successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = status, message = JSONresult }, 0);
        }

        // GET: Mines of Moria (Quick Orders)
        public ActionResult minesofmoria(long id = 0)
        {
            return View();
        }
    }
}