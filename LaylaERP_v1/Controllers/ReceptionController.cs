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
                ID = new ReceptionRepository().ReceptionPurchase(model);

                if (ID > 0)
                {
                    b_status = true; JSONstring = "Purchase record  updated successfully!!";
                }
                else
                {
                    b_status = false; JSONstring = "Invalid Details.";
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
                        Session["ROPO"] = "PO3";
                        JSONstring = "Purchase record closed successfully!!";
                    }
                    else if (model.fk_status == 5)
                    {
                        Session["ROPO"] = "PO2";
                        JSONstring = "Purchase record opened successfully!!";
                    }
                    else
                    {
                        Session["ROPO"] = "";
                    }
                }
                else
                {
                    b_status = false; JSONstring = "Invalid Details.";
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
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ReceptionRepository.GetPurchaseOrder(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
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
            string result = string.Empty;
            try
            {
                DataTable dt = ReceptionRepository.GetPoClosureOrderDetailsList(model.strValue1, model.strValue2, model.strValue3);
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
            string result = string.Empty;
            try
            {
                DataTable dt = ReceptionRepository.GetPartiallyDetailsList(model.strValue1, model.strValue2, model.strValue3);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
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

                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg")
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
                                return Json(new { status = true, message = "File Upload successfully!!", url = "Manage" }, 0);
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
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
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
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

    }
}