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
    //using System.Xml;

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
        // GET: Mines of Moria (Quick Orders)
        public ActionResult minesofmoria(long id = 0)
        {
            ViewBag.id = id;
            string pay_method = CommanUtilities.Provider.GetCurrent().AuthorizeNet ? "{\"id\":\"amazon_payments_advanced\" ,\"text\":\"Amazon Pay\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().AmazonPay ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"authorize_net_cim_credit_card\" ,\"text\":\"Authorize Net\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Podium ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Paypal ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"ppec_paypal\" ,\"text\":\"PayPal\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            ///OrderRepository.OrderInvoiceMail(id);
            return View();
        }
        // GET: Mines of Moria (Quick Orders)
        public ActionResult quickorder(long id = 0)
        {
            ViewBag.id = id;
            string pay_method = ""; //CommanUtilities.Provider.GetCurrent().AuthorizeNet ? "{\"id\":\"authorize_net_cim_credit_card\" ,\"text\":\"Authorize Net\"}" : "";
         
            pay_method += CommanUtilities.Provider.GetCurrent().Podium ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Paypal ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"ppec_paypal\" ,\"text\":\"PayPal\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            ///OrderRepository.OrderInvoiceMail(id);
            return View();
        }
        // GET: Order Refund
        public ActionResult OrderRefund(long id = 0)
        {
            ViewBag.id = id;
            //clsAmazonPay.RefundTransaction(1,"uuuuuu", 4);
            //clsAmazonPay.RefundTransaction_old(1, "uuuuuu", 4);
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
            ViewBag.iseditable = CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? 1 : 0;
            ViewBag.userid = CommanUtilities.Provider.GetCurrent().UserID;
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
                OperatorModel om = CommanUtilities.Provider.GetCurrent();

                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.postsXML + "}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_statsXML + "}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.postmetaXML + "}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");

                JSONresult = JsonConvert.SerializeObject(OrderRepository.AddOrdersPost(model.order_id, "I", om.UserID, om.UserName, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
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
        [HttpGet]
        public JsonResult GetCategoryWiseProducts(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetCategoryWiseProducts();
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
                if (string.IsNullOrEmpty(model.strValue3))
                    model.strValue3 = "-";
                if (string.IsNullOrEmpty(model.strValue4))
                    model.strValue4 = "-";
                //obj = OrderRepository.GetProductDetails(pid, vid);
                obj = OrderRepository.GetProductListDetails(pid, vid, model.strValue3, model.strValue4);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult GetProductShipping(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                //_list = OrderRepository.GetProductShippingCharge(model.strValue1, model.strValue2, model.strValue3);
                DataSet ds = OrderRepository.GetShippingWithRecycling(model.strValue1, model.strValue2, model.strValue3, model.strValue4);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetTaxRate(SearchModel model)
        {
            decimal JSONresult = 0;
            try
            {
                DataTable dt = OrderRepository.GetTaxRate(model.strValue5, model.strValue4, model.strValue3, model.strValue2, "0");
                if (dt.Rows.Count > 0)
                {
                    JSONresult = (dt.Rows[0]["rate"] != Convert.DBNull) ? Convert.ToDecimal(dt.Rows[0]["rate"]) : 0;
                }
                else
                {
                    JSONresult = clsTaxJar.GetTaxCombinedRate(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.strValue5);
                    OrderRepository.SaveTaxRate(model.strValue5, model.strValue4, model.strValue3, model.strValue2, "0", JSONresult, false, string.Empty);
                }
            }
            catch { JSONresult = 0; }
            return Json(new { status = true, rate = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult GetTaxAmounts(TaxJarModel model)
        {
            try
            {
                DataTable dt = OrderRepository.GetTaxRate(model.to_country, model.to_state, model.to_city, model.to_street, model.to_zip);
                if (dt.Rows.Count > 0)
                {
                    model.order_total_amount = 0;
                    model.taxable_amount = 0;
                    model.amount_to_collect = 0;
                    model.rate = (dt.Rows[0]["rate"] != Convert.DBNull) ? Convert.ToDecimal(dt.Rows[0]["rate"]) : 0;
                    model.freight_taxable = (dt.Rows[0]["freight_taxable"] != Convert.DBNull) ? Convert.ToBoolean(dt.Rows[0]["freight_taxable"]) : false;
                    model.tax_meta = (dt.Rows[0]["data"] != Convert.DBNull) ? dt.Rows[0]["data"].ToString() : "[]";

                    //model.rate = (dt.Rows[0]["rate"] != Convert.DBNull) ? Convert.ToDecimal(dt.Rows[0]["rate"]) : 0;
                    //model.freight_taxable = (dt.Rows[0]["freight_taxable"] != Convert.DBNull) ? Convert.ToBoolean(dt.Rows[0]["freight_taxable"]) : false; ;
                }
                else
                {
                    model = clsTaxJar.GetTaxes(model);
                    //model = clsAvalara.GetTaxes(model);
                    OrderRepository.SaveTaxRate(model.to_country, model.to_state, model.to_city, model.to_street, model.to_zip, model.rate, model.freight_taxable, model.tax_meta);
                }
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
        public JsonResult GetOrderItemMeta(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                JSONresult = OrderRepository.GetOrderItemMeta(id);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetGiftCardAmount(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = OrderRepository.GetGiftCardDiscount(model.strValue1);
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
                    result = "Fee successfully removed.";
                    state = true;
                }
            }
            catch { state = false; result = "Invalid Details."; }
            return Json(new { status = state, message = result }, 0);
        }
        [HttpPost]

        public JsonResult SaveOrderProductMeta(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_itemmetaXML + "}", "Items");

                JSONresult = JsonConvert.SerializeObject(OrderRepository.AddOrdersPost(0, "PMU", 0, "", postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveCustomerOrder(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_statsXML + "}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.postmetaXML + "}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_itemsXML + "}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[{ post_id: " + model.order_id + ", meta_key: '_customer_ip_address', meta_value: '" + Net.Ip + "' }, { post_id: " + model.order_id + ", meta_key: '_customer_user_agent', meta_value: '" + Net.BrowserInfo + "' }]}", "Items");

                JSONresult = JsonConvert.SerializeObject(OrderRepository.AddOrdersPost(model.order_id, "U", om.UserID, om.UserName, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveCustomerOrderRefund(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_statsXML + "}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.postmetaXML + "}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_itemsXML + "}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[{ post_id: " + model.order_id + ", meta_key: '_customer_ip_address', meta_value: '" + Net.Ip + "' }, { post_id: " + model.order_id + ", meta_key: '_customer_user_agent', meta_value: '" + Net.BrowserInfo + "' }]}", "Items");

                DataTable dt = OrderRepository.AddOrdersPost(model.order_id, "ORI", om.UserID, om.UserName, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML);
                JSONresult = JsonConvert.SerializeObject(dt);
                long refund_orderid = 0;
                if (dt.Rows.Count > 0)
                {
                    if (dt.Rows[0]["response"].ToString().Trim().ToLower() == "success")
                    {
                        refund_orderid = (dt.Rows[0]["id"] != Convert.DBNull) ? Convert.ToInt64(dt.Rows[0]["id"]) : 0;
                        OrderRepository.OrderRefundInvoiceMail(refund_orderid);
                    }
                }
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdateGitCardPaymentRefund(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                decimal NotesAmount = model.NetTotal;
                int result = OrderRepository.UpdateRefundedGiftCard(model);
                if (result > 0)
                {
                    status = true; JSONresult = "Order placed successfully.";
                    OrderNotesModel note_model = new OrderNotesModel();
                    note_model.post_ID = model.order_id;
                    note_model.comment_content = string.Format("Gift card Issued for ${0:0.00}. The Gift Card will be send on your mail.", NotesAmount);
                    note_model.is_customer_note = string.Empty;
                    note_model.is_customer_note = string.Empty;

                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    note_model.comment_author = om.UserName; note_model.comment_author_email = om.EmailID;
                    int res = OrderRepository.AddOrderNotes(note_model);
                }
                else
                { status = false; JSONresult = "Something went wrong."; }
                JSONresult = JsonConvert.SerializeObject(result);
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = status, message = JSONresult }, 0);
        }

        [HttpPost]
        [Route("order/order-counts")]
        public JsonResult GetOrdersCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1)) fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2)) todate = Convert.ToDateTime(model.strValue2);
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                DataTable dt = OrderRepository.OrderCounts(fromdate, todate, om.UserID);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        [Route("order/order-list")]
        public JsonResult GetOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);

                //DataTable dt = OrderRepository.OrderList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                DataTable dt = OrderRepository.OrderList(fromdate, todate, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        [Route("order/queckorder-list")]
        public JsonResult GetQueckOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);

                //DataTable dt = OrderRepository.OrderList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                DataTable dt = OrderRepository.GetQueckOrderList(fromdate, todate, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        [Route("order/order-sendinvoice")]
        public JsonResult ResentOrderInvoice(OrderModel model)
        {
            bool status = true;
            try
            {
                OrderRepository.OrderInvoiceMail(model.order_id);
                return Json(new { status = status }, 0);
            }
            catch { status = false; }
            return Json(new { status }, 0);
        }
        [HttpGet]
        [Route("order/order-fee")]
        public JsonResult GetFeeList(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                result = JsonConvert.SerializeObject(OrderRepository.GetFeeList(), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
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
                return Json(new { status = true, message = "Order status changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
        [HttpPost]
        public JsonResult OrderCancel(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                DataTable dt = OrderRepository.OrderCancel(model.order_id, om.UserID);
                JSONresult = JsonConvert.SerializeObject(dt);

                if (dt.Rows.Count > 0)
                {
                    if (dt.Rows[0]["response"].ToString().Trim() == "success")
                        OrderRepository.OrderCancelInvoiceMail(model.order_id);
                }
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdatePaymentInvoiceID(OrderModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                int res = OrderRepository.UpdatePaymentInvoice(model.OrderPostMeta);
                if (res > 0)
                {
                    result = "Order placed successfully.";
                    status = true;
                    model.payment_method_title = model.payment_method_title.Replace("{BR}", "<br>");
                    SendEmail.SendEmails(model.b_email, model.payment_method, model.payment_method_title);
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult UpdatePodiumPaymentAccept(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.order_itemmetaXML + "}", "Items");

                JSONresult = JsonConvert.SerializeObject(OrderRepository.AddOrdersPost(model.order_id, "UPP", 0, model.b_first_name, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
                if (model.order_id > 0)
                {
                    OrderRepository.OrderInvoiceMail(model.order_id);
                }
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult UpdateAuthorizeNetPaymentRefund(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                DataTable dt = OrderRepository.OrderPaymentDetails(model.order_id);
                string TransactionID = string.Empty, CardNumber = string.Empty, ExpirationDate = string.Empty, crdtype = string.Empty, ExpirationDatePrint = string.Empty;
                if (dt.Rows.Count > 0)
                {
                    TransactionID = (dt.Rows[0]["authorize_net_trans_id"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_trans_id"].ToString() : "";
                    CardNumber = (dt.Rows[0]["authorize_net_card_account_four"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_card_account_four"].ToString() : "";
                    crdtype = (dt.Rows[0]["authorize_net_cim_credit_card_card_type"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_cim_credit_card_card_type"].ToString() : "";
                    ExpirationDate = (dt.Rows[0]["authorize_net_card_expiry_date"] != Convert.DBNull) ? dt.Rows[0]["authorize_net_card_expiry_date"].ToString() : "";
                    ExpirationDatePrint = ExpirationDate.Split('-')[1] + "/" + ExpirationDate.Split('-')[0];
                    ExpirationDate = ExpirationDate.Split('-')[1] + ExpirationDate.Split('-')[0];
                }
                //var result = clsAuthorizeNet.RefundTransaction("40080413310", "8888", "1223", 1);
                var result = clsAuthorizeNet.RefundTransaction(TransactionID, CardNumber, ExpirationDate, model.NetTotal);
                if (!string.IsNullOrEmpty(result))
                {
                    status = true; JSONresult = "Order placed successfully.";
                    OrderNotesModel note_model = new OrderNotesModel();
                    note_model.post_ID = model.order_id;
                    note_model.comment_content = "Authorize.Net Credit Card Charge Refund Issued: " + crdtype + " ending in " + CardNumber + " (expires " + ExpirationDatePrint + ") (Transaction ID " + result + "). ";
                    note_model.comment_content += string.Format("Refund Issued for ${0:0.00}. The refund should appear on your statement in 5 to 10 days.", model.NetTotal);
                    note_model.is_customer_note = string.Empty;
                    note_model.is_customer_note = string.Empty;

                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    note_model.comment_author = om.UserName; note_model.comment_author_email = om.EmailID;
                    int res = OrderRepository.AddOrderNotes(note_model);
                }
                else
                { status = false; JSONresult = "Something went wrong."; }
                JSONresult = JsonConvert.SerializeObject(result);
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult UpdateAffirmPaymentRefund(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                var result = clsAffirm.AffirmRefund(model.paypal_id, model.NetTotal);
                if (!string.IsNullOrEmpty(result))
                {
                    status = true; JSONresult = "Refund placed successfully.";
                    OrderNotesModel note_model = new OrderNotesModel();
                    note_model.post_ID = model.order_id;
                    //note_model.comment_content = "Authorize.Net Credit Card Charge Refund Issued: " + crdtype + " ending in " + CardNumber + " (expires " + ExpirationDatePrint + ") (Transaction ID " + result + "). ";
                    note_model.comment_content = string.Format("Refund Issued for ${0:0.00}. The refund should appear on your statement in 5 to 10 days.", model.NetTotal);
                    note_model.is_customer_note = string.Empty;
                    note_model.is_customer_note = string.Empty;

                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    note_model.comment_author = om.UserName; note_model.comment_author_email = om.EmailID;
                    int res = OrderRepository.AddOrderNotes(note_model);
                }
                else
                { status = false; JSONresult = "Something went wrong."; }
                JSONresult = JsonConvert.SerializeObject(result);
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult UpdateAmazonPaymentRefund(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                DataTable dt = OrderRepository.OrderPaymentDetails(model.order_id);
                string TransactionID = string.Empty, CardNumber = string.Empty, ExpirationDate = string.Empty, crdtype = string.Empty, ExpirationDatePrint = string.Empty;
                if (dt.Rows.Count > 0)
                {
                    TransactionID = (dt.Rows[0]["amazon_capture_id"] != Convert.DBNull) ? dt.Rows[0]["amazon_capture_id"].ToString() : "";
                }

                var result = clsAmazonPay.RefundTransaction(model.order_id.ToString(), TransactionID, model.NetTotal);
                if (!string.IsNullOrEmpty(result))
                {
                    status = true; JSONresult = "Order placed successfully.";
                    OrderNotesModel note_model = new OrderNotesModel();
                    note_model.post_ID = model.order_id;
                    note_model.comment_content = "Amazon Pay Refund Issued. Transaction ID " + result + ". ";
                    note_model.comment_content += string.Format("Refund Issued for ${0:0.00}. The refund should appear on your statement in 5 to 10 days.", model.NetTotal);
                    note_model.is_customer_note = string.Empty;
                    note_model.is_customer_note = string.Empty;

                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    note_model.comment_author = om.UserName; note_model.comment_author_email = om.EmailID;
                    int res = OrderRepository.AddOrderNotes(note_model);
                }
                else
                { status = false; JSONresult = "Something went wrong."; }
                JSONresult = JsonConvert.SerializeObject(result);
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = status, message = JSONresult }, 0);
        }

        [HttpPost]
        public JsonResult SendMailInvoice(OrderModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                //OrderModel obj = OrderRepository.OrderInvoice(Convert.ToInt64(model.strValue2));

                String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "NewOrder", model);

                result = SendEmail.SendEmails(model.b_email, "Your order #" + model.order_id + " has been received", renderedHTML);
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

        [HttpPost]
        public JsonResult DeleteGiftCard(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();

                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_itemmetaXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");

                JSONresult = JsonConvert.SerializeObject(OrderRepository.AddOrdersPost(model.order_id, "RGC", om.UserID, model.payment_method_title, postsXML, order_statsXML, postmetaXML, order_itemsXML, order_itemmetaXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
    }
}