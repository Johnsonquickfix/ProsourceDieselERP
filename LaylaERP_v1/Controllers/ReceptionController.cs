using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Net.Mail;
using System.Configuration;


namespace LaylaERP.Controllers
{
    public class ReceptionController : Controller
    {
        // GET: Reception
        public ActionResult NewReceiveOrder(long id = 0)
        {
            ViewBag.id = id;
            //Session["ROPO"] = "";
            return View();
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ReceiveOrder()
        {
            return View();
        }

        public ActionResult PartiallyOrder()
        {
            return View();
        }
        public ActionResult POClosureOrder()
        {
            return View();
        }
        public ActionResult SalesPO()
        {
            return View();
        }

        public ActionResult POInventorySheet()
        {
            return View();
        }

        public JsonResult Getwarehouse(SearchModel model)
        {
            DataSet ds = BAL.ReceptionRepository.Getwarehouse(model.strValue1);
            List<SelectListItem> productlist = new List<SelectListItem>();
            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
                }
                return Json(productlist, JsonRequestBehavior.AllowGet);
            }
            else
            {
                productlist.Add(new SelectListItem { Text = "ReSurge", Value = "3" });
                return Json(productlist, JsonRequestBehavior.AllowGet);

            }


        }

        [HttpPost]
        public JsonResult ReceptionPurchase(PurchaseReceiceOrderModel model)
        {
            string JSONstring = string.Empty; bool b_status = false; long ID = 0;
            try
            {
                long rid = model.RowID;
                ID = new ReceptionRepository().ReceptionPurchase(model);
                if (ID > 0)
                {
                    b_status = true; JSONstring = "Purchase record  updated successfully!!";
                    UserActivityLog.WriteDbLog(LogType.Submit, "Update Reception PO,s Receive Order id(" + rid + ")", "/Reception/NewReceiveOrder/" + model.RowID + "" + ", " + Net.BrowserInfo);
                }
                else
                {
                    b_status = false; JSONstring = "Invalid details.";
                }
            }
            catch (Exception Ex)
            {
                b_status = false; JSONstring = Ex.Message;
            }
            return Json(new { status = b_status, message = JSONstring, id = ID }, 0);
        }

        [HttpPost]
        public JsonResult UpdateStatusReceptionPurchase(PurchaseReceiceOrderModel model)
        {
            string JSONstring = string.Empty; bool b_status = false; long ID = 0;
            try
            {
                ID = new ReceptionRepository().UpdateStatusReceptionPurchase(model);

                if (ID > 0)
                {
                    b_status = true;
                    if (model.fk_status == 6)
                    {
                        //Session["ROPO"] = "PO3";
                        JSONstring = "Purchase record closed successfully!!";
                        UserActivityLog.WriteDbLog(LogType.Submit, "PO id (" + model.IDRec + ")  closed in PO recepion", "/Reception/NewReceiveOrder/" + model.IDRec + "" + ", " + Net.BrowserInfo);

                    }
                    else if (model.fk_status == 5)
                    {
                       // Session["ROPO"] = "PO2";
                        JSONstring = "Purchase record opened successfully!!";
                        UserActivityLog.WriteDbLog(LogType.Submit, "PO id (" + model.IDRec + ") opened in PO recepion", "/Reception/NewReceiveOrder/" + model.IDRec + "" + ", " + Net.BrowserInfo);

                    }
                    else
                    {
                        //Session["ROPO"] = "";
                    }
                }
                else
                {
                    b_status = false; JSONstring = "Invalid details.";
                }
            }
            catch (Exception Ex)
            {
                b_status = false; JSONstring = Ex.Message;
            }
            return Json(new { status = b_status, message = JSONstring, id = ID }, 0);
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
                DataSet ds = ReceptionRepository.GetPurchaseOrderByID(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpGet]
        public JsonResult GetPurchaseHistory(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ReceptionRepository.GetPurchaseHistory(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetPurchaseOrderList(JqDataTableModel model)
        {
            DataTable dt = new DataTable();
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                string usertype = CommanUtilities.Provider.GetCurrent().UserType;
                int userid = Convert.ToInt32(CommanUtilities.Provider.GetCurrent().UserID);
                if (usertype.ToUpper() == "ADMINISTRATOR")
                     dt = ReceptionRepository.GetPurchaseOrder(0,fromdate, todate, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                else
                    dt = ReceptionRepository.GetPurchaseOrder(userid,fromdate, todate, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetPartiallyOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ReceptionRepository.GetPartiallyOrderList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetPoClosureOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ReceptionRepository.GetPoClosureOrderList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpGet]
        public JsonResult GetPurchaseOrderPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ReceptionRepository.GetPurchaseOrder(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { add = om.address, name = om.CompanyName, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }
        [HttpGet]
        public JsonResult GetPurchaseOrder_Rec(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ReceptionRepository.GetPurchaseOrder_Rec(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }

        [HttpGet]
        public JsonResult GetPoClosureOrderDetailsList(JqDataTableModel model)
        {
            DataTable dt = new DataTable();
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                string usertype = CommanUtilities.Provider.GetCurrent().UserType;
                int userid = Convert.ToInt32(CommanUtilities.Provider.GetCurrent().UserID);
                if (usertype.ToUpper() == "ADMINISTRATOR")
                    dt = ReceptionRepository.GetPoClosureOrderDetailsList(0,fromdate, todate,model.sSearch, model.strValue2, model.strValue3);
                else
                    dt = ReceptionRepository.GetPoClosureOrderDetailsList(userid,fromdate, todate, model.sSearch, model.strValue2, model.strValue3);

                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost]
        public JsonResult GetPoClosureOrderDataList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ReceptionRepository.GetPoClosureOrderDataList(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]

        public JsonResult GetPartiallyDetailsList(JqDataTableModel model)
        {
            DataTable dt = new DataTable();
            string result = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);

                string usertype = CommanUtilities.Provider.GetCurrent().UserType;
                int userid = Convert.ToInt32(CommanUtilities.Provider.GetCurrent().UserID);
                if (usertype.ToUpper() == "ADMINISTRATOR")
                    dt = ReceptionRepository.GetPartiallyDetailsList(0,fromdate, todate, model.sSearch, model.strValue2, model.strValue3);
                else
                    dt = ReceptionRepository.GetPartiallyDetailsList(userid,fromdate, todate, model.sSearch, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        //public JsonResult GetPartiallyDetailsList(JqDataTableModel model)
        //{
        //    string result = string.Empty;
        //    int TotalRecord = 0;
        //    try
        //    {
        //        DateTime? fromdate = null, todate = null;
        //        if (!string.IsNullOrEmpty(model.strValue1))
        //            fromdate = Convert.ToDateTime(model.strValue1);
        //        if (!string.IsNullOrEmpty(model.strValue2))
        //            todate = Convert.ToDateTime(model.strValue2);
        //        DataTable dt = ReceptionRepository.GetPartiallyDetailsList(fromdate, todate, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
        //        result = JsonConvert.SerializeObject(dt);
        //    }
        //    catch (Exception ex) { throw ex; }
        //    return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);

        //}
        [HttpPost]
        public JsonResult GetPartiallyOrderDataList(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ReceptionRepository.GetPartiallyOrderDataList(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        public JsonResult GetfileuploadData(SearchModel model)
        {
            List<ProductModelservices> obj = new List<ProductModelservices>();
            try
            {
                obj = ReceptionRepository.GetfileuploadData(model.strValue1, model.strValue2);
            }
            catch { }
            return Json(obj, 0);
        }

        [HttpPost]
        public ActionResult FileUploade(string Name, HttpPostedFileBase ImageFile)
        {
            try
            {

                if (ImageFile != null)
                {

                    ProductModel model = new ProductModel();
                    //Use Namespace called :  System.IO  
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    //To Get File Extension  
                    long filesize = ImageFile.ContentLength / 1024;
                    string FileExtension = Path.GetExtension(ImageFile.FileName);

                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".XLS" || FileExtension == ".pdf" || FileExtension == ".PDF" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".jpg" || FileExtension == ".JPG" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //Add Current Date To Attached File Name  
                        //FileName = DateTime.Now.ToString("yyyyMMdd") + "-" + FileName.Trim() + FileExtension;

                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;


                        DataTable dt = ReceptionRepository.GetfileCountdata(Convert.ToInt32(Name), FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already uploaded", url = "" }, 0);
                        }
                        else
                        {

                            string UploadPath = Path.Combine(Server.MapPath("~/Content/PurchaseFiles"));
                            UploadPath = UploadPath + "\\";
                            //Its Create complete path to store in server.  
                            model.ImagePath = UploadPath + FileName;
                            //To copy and save file into server.  
                            ImageFile.SaveAs(model.ImagePath);
                            var ImagePath = "~/Content/PurchaseFiles/" + FileName;
                            int resultOne = ReceptionRepository.FileUploade(Convert.ToInt32(Name), FileName, filesize.ToString(), FileExtension, ImagePath);

                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File upload successfully!!", url = "Manage" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        }
                    }

                    else
                    {
                        return Json(new { status = false, message = "File Type " + FileExtension + " Not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }

        }

        public JsonResult Deletefileuploade(ProductModel model)
        {
            JsonResult result = new JsonResult();
            //DateTime dateinc = DateTime.Now;
            //DateTime dateinc = UTILITIES.CommonDate.CurrentDate();
            var resultOne = 0;
            // model.ID = model.strVal;
            if (model.ID > 0)
                resultOne = ReceptionRepository.Deletefileuploade(model);
            if (resultOne > 0)
            {
                return Json(new { status = true, message = "deleted successfully!!", url = "Manage" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }
        }

        [HttpGet]
        public JsonResult GetReceveOrderPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ReceptionRepository.GetReceiveOrder(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }

        [HttpPost]
        public JsonResult SendMailReceve(SearchModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                status = true;
                //string strBody = "Hello sir,<br /> Purchase order number <b>#" + model.strValue2 + "</b> is waiting for your approval.<br />Please see below attached file.<br /><br /><br /><br />"
                string strBody = "Hi,<br /> Received purchase order number <b>#" + model.strValue2 + "</b>.<br />Please see below attached file.<br /><br /><br /><br />" + model.strValue5;
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(model.strValue1);
                foreach (var o in obj)
                {
                    string _mail = o.user_email, _uid = o.user_id;
                    if (!string.IsNullOrEmpty(o.user_email.Value))
                    {
                        _uid = "&uid=" + UTILITIES.CryptorEngine.Encrypt(_uid);
                        string _html = model.strValue3.Replace("{_para}", _uid);

                        result = SendEmail.SendEmails_outer(o.user_email.Value, "Received Purchase Order #" + model.strValue2 + ".", strBody, _html);
                    }
                }
            }
            catch { status = false; result = ""; }
            return Json(new { status = status, message = result }, 0);
        }

        [HttpGet]
        public JsonResult getinvoicehistory(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ReceptionRepository.getinvoicehistory(id);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        } 
        public JsonResult Getinventorysheet(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                //DateTime fromdate = DateTime.Today, todate = DateTime.Today;
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    fromdate = Convert.ToDateTime(model.strValue1);
                //if (!string.IsNullOrEmpty(model.strValue2))
                //    todate = Convert.ToDateTime(model.strValue2);
                //long aid = 0, vid = 0;
                //if (!string.IsNullOrEmpty(model.strValue3))
                //    aid = Convert.ToInt64(model.strValue3);
                DataTable dt = ReceptionRepository.Getinventorysheet(model.strValue1);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }


    }
}