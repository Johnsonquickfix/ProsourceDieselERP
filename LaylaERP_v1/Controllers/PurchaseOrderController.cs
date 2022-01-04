using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class PurchaseOrderController : Controller
    {
        // GET: PurchaseOrder
        public ActionResult NewPurchaseOrder(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }
        public ActionResult PurchaseOrderDetails()
        {
            return View();
        }
        public ActionResult PurchaseOrderList()
        {
            return View();
        }
        [Route("purchaseorder/po-amendment")]
        public ActionResult POAmendment(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }
        [Route("purchaseorder/po-accept")]
        public ActionResult PurchaseOrderApproval(string id, string uid, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                PurchaseOrderModel obj = new PurchaseOrderModel();
                if (!string.IsNullOrEmpty(uid))
                {
                    obj.LoginID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(uid.Replace(" ", "+")));
                }
                if (!string.IsNullOrEmpty(uid))
                    obj.RowID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                else
                    obj.RowID = 0;
                obj.Status = 3;
                obj.Search = key;
                if (obj.LoginID > 0 && obj.RowID > 0)
                {
                    DataTable dt = PurchaseOrderRepository.PurchaseApproval(obj);
                    if (dt.Rows.Count > 0)
                    {
                        ViewBag.status = dt.Rows[0]["Response"].ToString();
                        ViewBag.id = obj.RowID;
                    }
                    else
                    {
                        ViewBag.status = "You don't have permission to access please contact administrator.";
                        ViewBag.id = "0";
                    }
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }
        [Route("purchaseorder/po-reject")]
        public ActionResult PurchaseOrderDisapprove(string id, string uid, string key)
        {
            if (!string.IsNullOrEmpty(id))
            {
                PurchaseOrderModel obj = new PurchaseOrderModel();
                if (!string.IsNullOrEmpty(uid))
                {
                    obj.LoginID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(uid.Replace(" ", "+")));
                }
                if (!string.IsNullOrEmpty(uid))
                    obj.RowID = Convert.ToInt64(UTILITIES.CryptorEngine.Decrypt(id.Replace(" ", "+")));
                else
                    obj.RowID = 0;
                obj.Status = 8;
                obj.Search = key;
                if (obj.LoginID > 0 && obj.RowID > 0)
                {
                    //ViewBag.status = "Success";
                    //ViewBag.id = obj.RowID;
                    DataTable dt = PurchaseOrderRepository.PurchaseApproval(obj);
                    if (dt.Rows.Count > 0)
                    {
                        ViewBag.status = dt.Rows[0]["Response"].ToString();
                        ViewBag.id = obj.RowID;
                    }
                    else
                    {
                        ViewBag.status = "You don't have permission to access please contact administrator.";
                        ViewBag.id = "0";
                    }
                }
                else
                {
                    ViewBag.status = "You don't have permission to access please contact administrator.";
                    ViewBag.id = "0";
                }
            }
            return View();
        }

        [HttpPost]
        public JsonResult SearchProducts(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = PurchaseOrderRepository.SearchProducts(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult GetVenderProducts(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable DT = PurchaseOrderRepository.SearchVenderProducts(id);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult SearchProductDetails(SearchModel model)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    pid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    vid = Convert.ToInt64(model.strValue2);
                obj = PurchaseOrderRepository.GetProductsDetails(pid, vid);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpGet]
        public JsonResult GetAllMaster(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                //model.strValue1 = string.IsNullOrEmpty(model.strValue1) ? "GETMD" : model.strValue1;
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue2)) id = long.Parse(model.strValue2);
                DataSet DS = PurchaseOrderRepository.GetAllMasterList(id, model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DS);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetVendor(SearchModel model)
        {
            DataSet ds = BAL.PurchaseOrderRepository.GetVendor();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetIncotermByID(PurchaseOrderModel model)
        {
            int id = model.IncotermsTypeID;
            string result = string.Empty;
            try
            {
                DataTable dt = PurchaseOrderRepository.GetIncotermByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetVendorByID(SearchModel model)
        {
            long id = 0;
            string result = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable dt = PurchaseOrderRepository.GetVendorByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult NewPurchase(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PurchaseOrderRepository.AddNewPurchase(id, "I", u_id, orderXML, orderdetailsXML));

            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult POAmendment(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, u_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                u_id = CommanUtilities.Provider.GetCurrent().UserID;
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(PurchaseOrderRepository.AddNewPurchase(id, "POAMD", u_id, orderXML, orderdetailsXML));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult UpdatePurchaseOrderStatus(PurchaseOrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                model.LoginID = CommanUtilities.Provider.GetCurrent().UserID;
                JSONresult = JsonConvert.SerializeObject(PurchaseOrderRepository.UpdatePurchaseStatus(model));
            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPurchaseOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                int statusid = 0;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    statusid = Convert.ToInt32(model.strValue3);
                DataTable dt = PurchaseOrderRepository.GetPurchaseOrder(fromdate, todate, statusid, model.strValue4, model.strValue5, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PurchaseOrderRepository.GetPurchaseOrderByID(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            OperatorModel om = new OperatorModel();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = PurchaseOrderRepository.GetPurchaseOrder(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrderPayments(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataTable ds = PurchaseOrderRepository.GetPurchaseOrderPayment(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult SendMailInvoice(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                string strBody = "Dear User,<br /> Please find your attached PO number #" + model.strValue2 + ". If you have any questions please feel free to contact us.<br /><br /><br /><br />" + model.strValue5;
                result = SendEmail.SendEmails_outer(model.strValue1, "Your Purchase order #" + model.strValue2 + " has been received", strBody, model.strValue3);

                if (!string.IsNullOrEmpty(model.strValue4))
                {
                    strBody = "Hi,<br /> Purchase order number <b>#" + model.strValue2 + "</b> approved.<br />Please see below attached file.<br /><br /><br /><br />" + model.strValue5;
                    result = SendEmail.SendEmails_outer(model.strValue4, "Your Purchase order #" + model.strValue2 + " approved.", strBody, model.strValue3);
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult SendMailPOApproval(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                //string strBody = "Hello sir,<br /> Purchase order number <b>#" + model.strValue2 + "</b> is waiting for your approval.<br />Please see below attached file.<br /><br /><br /><br />"
                string strBody = "Hi,<br /> Purchase order number <b>#" + model.strValue2 + "</b> is waiting for your approval.<br />Please see below attached file.<br /><br /><br /><br />" + model.strValue5;
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(model.strValue1);
                foreach (var o in obj)
                {
                    string _mail = o.user_email, _uid = o.user_id;
                    if (!string.IsNullOrEmpty(o.user_email.Value))
                    {
                        _uid = "&uid=" + UTILITIES.CryptorEngine.Encrypt(_uid);
                        string _html = model.strValue3.Replace("{_para}", _uid);

                        result = SendEmail.SendEmails_outer(o.user_email.Value, "Approval for Purchase Order #" + model.strValue2 + ".", strBody, _html);
                    }
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public JsonResult SendMailPOReject(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true; 
                string strBody = "Hi,<br /> Purchase order number <b>#" + model.strValue2 + "</b> disapproved.<br /><br /><br /><br />" + model.strValue5;
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(model.strValue1);
                foreach (var o in obj)
                {
                    string _mail = o.user_email, _uid = o.user_id;
                    if (!string.IsNullOrEmpty(o.user_email.Value))
                    {
                        result = SendEmail.SendEmails_outer(o.user_email.Value, "Your Purchase order #" + model.strValue2 + " disapproved.", strBody, model.strValue3);
                    }
                }

                if (!string.IsNullOrEmpty(model.strValue4))
                {
                    strBody = "Hi,<br /> Purchase order number <b>#" + model.strValue2 + "</b> disapproved.<br /><br /><br /><br />" + model.strValue5;
                    result = SendEmail.SendEmails_outer(model.strValue4, "Your Purchase order #" + model.strValue2 + " disapproved.", strBody, model.strValue3);
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }

    }
}