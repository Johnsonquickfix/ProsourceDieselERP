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

namespace LaylaERP.Controllers
{
    public class ThirdPartyController : Controller
    {
        // GET: ThirdParty
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NewVendor(long id = 0)
        {
            //ThirdPartyModel model = new ThirdPartyModel();
            ViewBag.id = id;
            DataTable dt = ThirdPartyRepository.SelectVendorCode(id);
            if (dt.Rows.Count > 0)
            {
                ViewBag.vendor = dt.Rows[0]["code_vendor"];
            }
            return View();
        }
        [HttpPost]
        public JsonResult AddVendorBasicInfo(ThirdPartyModel model)
        {
            byte[] image = System.IO.File.ReadAllBytes(Server.MapPath("~/Content/EmployeeProfileImage/default.png"));
            //if (ModelState.IsValid)
            //{
                if (model.rowid > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") updated in vendors basic info", "/ThirdParty/NewVendor" + ", " + Net.BrowserInfo);
                    new ThirdPartyRepository().EditVendorBasicInfo(model);
                    if (model.fk_user > 0)
                    {
                        UpdateUserVendorMetaData(model, model.fk_user);
                    }
                    //new ThirdPartyRepository().EditJournal(model);
                    return Json(new { status = true, message = "Vendor basic info updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    DataTable dt = ThirdPartyRepository.AddNewVendorUser(model, image);
                    if (Convert.ToInt32(dt.Rows[0]["userid"]) > 0)
                    {
                        AddUserVendorMetaData(model, Convert.ToInt32(dt.Rows[0]["userid"]));
                        int ID = new ThirdPartyRepository().AddNewVendorBasicInfo(model,Convert.ToInt32(dt.Rows[0]["userid"]));
                        if (ID > 0)
                        {
                            UserActivityLog.WriteDbLog(LogType.Submit, "New vendor " + model.vendor_type + ", " + model.Name + " created in manage vendors.", "/ThirdParty/NewVendor" + ", " + Net.BrowserInfo);
                            //new ThirdPartyRepository().AddJournal(model,ID);
                            return Json(new { status = true, message = "Vendor basic info saved successfully!!", url = "", id = ID }, 0);
                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = dt.Rows[0]["ErrorMessage"], url = "", id = 0 }, 0);
                    }
                }
            //}
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        public JsonResult AddVendorAdditionalInfo(ThirdPartyModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {

                    int ID = new ThirdPartyRepository().AddVendorAdditionalInfo(model);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") updated in vendors Additional info", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);

                        return Json(new { status = true, message = "Vendor Additional info saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        public JsonResult AddVendorPaymentTerms(ThirdPartyModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "vendor id ("+ model.rowid + ") updated in vendor payment terms", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);
                    int ID = new ThirdPartyRepository().AddVendorPaymentTerms(model);
                    if (ID > 0)
                    {
                        int id = new ThirdPartyRepository().GetPaymentVendorID(model.rowid);
                        if (id != model.rowid)
                        {
                            new ThirdPartyRepository().AddPaymentMethods(model);
                        }
                        else
                        {
                            new ThirdPartyRepository().EditPaymentMethods(model);
                        }
                        return Json(new { status = true, message = "Vendor payment terms saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        public JsonResult AddVendorShipping(ThirdPartyModel model)
        {
            if (model.rowid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") updated in vendor shipping", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);

                int id = new ThirdPartyRepository().GetShippingVendorID(model.rowid);
                if (id != model.rowid)
                {
                    new ThirdPartyRepository().UpdateVendorShipping(model);
                    int ID = new ThirdPartyRepository().AddVendorShipping(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Vendor shipping saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
                else
                {
                    new ThirdPartyRepository().UpdateVendorShipping(model);
                    int ID = new ThirdPartyRepository().EditVendorShipping(model);
                    return Json(new { status = true, message = "Vendor shipping updated successfully!!", url = "", id = ID }, 0);
                }
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult AddVendorTaxes(ThirdPartyModel model)
        {
            if (model.rowid > 0)
            {
            UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") updated in vendor taxes", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);
                int ID = new ThirdPartyRepository().AddVendorTaxes(model);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Vendor Taxes saved successfully!!", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                }
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult AddVendorDiscount(ThirdPartyModel model)
        {
            if (model.rowid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") updated in vendor discount", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);

                int ID = new ThirdPartyRepository().AddVendorDiscount(model);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Vendor Discount saved successfully!!", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                }
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }
        //public JsonResult AddPaymentMethods(ThirdPartyModel model)
        //{

        //        if (model.rowid > 0)
        //        {
        //            int id = new ThirdPartyRepository().GetPaymentVendorID(model.rowid);
        //            if (id != model.rowid)
        //            {
        //                int ID = new ThirdPartyRepository().AddPaymentMethods(model);
        //                if (ID > 0)
        //                {
        //                    return Json(new { status = true, message = "Vendor Details has been saved successfully!!", url = "", id = ID }, 0);
        //                }
        //                else
        //                {
        //                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        //                }
        //            }
        //            else
        //            {
        //                int ID = new ThirdPartyRepository().EditPaymentMethods(model);
        //                return Json(new { status = true, message = "Vendor Details has been updated successfully!!", url = "", id = ID }, 0);
        //            }
        //        }
        //        else
        //        {
        //            return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
        //        }

        //    //return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        //}
        public JsonResult AddContacts(ThirdPartyModel model)
        {
            UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") updated in add contact", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);
            if (model.rowid > 0)
            {
                if (model.ContactID > 0)
                {
                    new ThirdPartyRepository().EditVendorContacts(model);
                    return Json(new { status = true, message = "Contact updated successfully!!", url = "", id = model.ContactID }, 0);

                }
                else
                {
                    int ID = new ThirdPartyRepository().AddContacts(model);
                    if (ID > 0)
                        return Json(new { status = true, message = "Contacts saved successfully!!", url = "", id = ID }, 0);
                    else
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                }
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }

        public JsonResult LinkWarehouse(ThirdPartyModel model)
        {
            if (model.rowid > 0)
            {
                //if (model.ContactID > 0)
                //{
                //    new ThirdPartyRepository().EditVendorContacts(model);
                //    return Json(new { status = true, message = "Warehouse has been updated successfully!!", url = "", id = model.ContactID }, 0);

                //}
                //else
                //{
                int ID = new ThirdPartyRepository().LinkWarehouse(model);
                if (ID > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") Link warehouse id("+model.WarehouseID+") in vendor", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);
                    return Json(new { status = true, message = "Warehouse Linked successfully!!", url = "", id = ID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                //}
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult DeleteWarehouse(ThirdPartyModel model)
        {
            if (model.rowid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") delete vendor warehouse", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);
                int ID = new ThirdPartyRepository().DeleteWarehouse(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Warehouse deleted successfully!!", url = "", id = ID }, 0);
                else
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult DeleteVendorLinkedFiles(ThirdPartyModel model)
        {
            if (model.rowid > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + model.rowid + ") delete vendor linked files", "/ThirdParty/NewVendor/" + model.rowid + "" + ", " + Net.BrowserInfo);
                int ID = new ThirdPartyRepository().DeleteVendorLinkedFiles(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Vendor linked files deleted successfully!!", url = "", id = ID }, 0);
                else
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetState(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.ThirdPartyRepository.GetState(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetIncoterm(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetIncoterm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["IncoTerm"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetWarehouse(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetWarehouse();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Warehouse"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetVendorType(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetVendorType();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["vendor_type"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetShippingMethod(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetShippingMethod();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["ShippingMethod"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetIncotermByID(ThirdPartyModel model)
        {
            int id = model.IncotermsTypeID;
            string result = string.Empty;
            try
            {
                DataTable dt = ThirdPartyRepository.GetIncotermByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        public JsonResult GetPaymentTerm(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetPaymentTerm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["PaymentTerm"].ToString(), Value = dr["ID"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetBalanceDays(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetBalanceDays();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["Balance"].ToString(), Value = dr["ID"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDiscountType(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetDiscountType();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["DiscountType"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPaymentMethod(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetPaymentMethod();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["PaymentType"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRelatedProducts(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetRelatedProducts();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["PaymentType"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVendorCode(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.ThirdPartyRepository.GetVendorCode();
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public ActionResult VendorList()
        {
            return View();
        }
        public JsonResult GetVendorList(ThirdPartyModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = ThirdPartyRepository.GetVendor(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetProductList(ThirdPartyModel model)
        {
            int id = model.VendorID;
            long rowid = model.rowid;
            string result = string.Empty;
            try
            {
                DataTable dt = ThirdPartyRepository.GetProduct(id, rowid);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { aaData = result }, 0);
        }
        public JsonResult GetVendorByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = ThirdPartyRepository.VendorByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetVendorContactByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = ThirdPartyRepository.VendorContactByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetVendorContactList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {

                DataTable dt = ThirdPartyRepository.GetVendorContact(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetVendorWarehouseList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ThirdPartyRepository.GetVendorWarehouseList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetVendorRelatedProductList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ThirdPartyRepository.GetVendorRelatedProduct(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpPost]
        public ActionResult FileUpload(int VendorID, HttpPostedFileBase ImageFile)
        {
            try
            {
                ThirdPartyModel model = new ThirdPartyModel();
                if (ImageFile != null)
                {
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    string FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension.ToLower() == ".xlsx" || FileExtension.ToLower() == ".xls" || FileExtension.ToLower() == ".pdf" || FileExtension.ToLower() == ".doc" || FileExtension.ToLower() == ".docx" || FileExtension.ToLower() == ".png" || FileExtension.ToLower() == ".jpg" || FileExtension.ToLower() == ".jpeg")
                    {
                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;
                        DataTable dt = ThirdPartyRepository.GetfileCountdata(VendorID, FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already exist in table", url = "" }, 0);
                        }
                        else
                        {
                            string UploadPath = Path.Combine(Server.MapPath("~/Content/VendorLinkedFiles"));
                            UploadPath = UploadPath + "\\";
                            model.ImagePath = UploadPath + FileName;
                            var ImagePath = "~/Content/VendorLinkedFiles/" + FileName;
                            ImageFile.SaveAs(model.ImagePath);
                            int resultOne = ThirdPartyRepository.FileUpload(VendorID, FileName, ImagePath, FileExtension, size);
                            if (resultOne > 0)
                            {
                                UserActivityLog.WriteDbLog(LogType.Submit, "vendor id (" + VendorID + ") attached a document in linked files", "/ThirdParty/NewVendor/" + VendorID + "" + ", " + Net.BrowserInfo);

                                return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
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
            catch (Exception)
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        public JsonResult GetVendorLinkedFiles(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ThirdPartyRepository.GetVendorLinkedFiles(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetPurchaseOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue3))
                    fromdate = Convert.ToDateTime(model.strValue3);
                if (!string.IsNullOrEmpty(model.strValue4))
                    todate = Convert.ToDateTime(model.strValue4);

                DataTable dt = ThirdPartyRepository.GetPurchaseOrder(model.strValue1, model.strValue2, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult AmountsView(string vendorcode1)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = ThirdPartyRepository.AmountsView(vendorcode1);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult DateWiseAmountsView(string vendorcode1, string vendorcode2, string vendorcode3)
        {
            string JSONresult = string.Empty;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(vendorcode1))
                    fromdate = Convert.ToDateTime(vendorcode1);
                if (!string.IsNullOrEmpty(vendorcode2))
                    todate = Convert.ToDateTime(vendorcode2);
                DataTable dt = ThirdPartyRepository.DateWiseAmountsView(fromdate, todate, vendorcode3);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult ActivityDbLog(ActivityLogModel model)
        {
            string strmsg = "Log done";
            try
            {
                UserActivityLog.WriteDbLog(LogType.Visit, model.ModuleName, model.ModuleURL + ", " + Net.BrowserInfo);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message }, 0);
            }
            return Json(new { message = strmsg }, 0);
        }
        private void AddUserVendorMetaData(ThirdPartyModel model, long id)
        {
            string[] varQueryArr1 = new string[10];
            string[] varFieldsName = new string[10] { "first_name", "last_name", "wp_capabilities", "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode" };
            string[] varFieldsValue = new string[10] { model.Name, model.Name, "vendor", model.Address, model.Country, model.Phone, model.Address1, model.City, model.State, model.ZipCode };
            for (int n = 0; n < 10; n++)
            {
                ThirdPartyRepository.AddUserVendorMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void UpdateUserVendorMetaData(ThirdPartyModel model, long id)
        {
            string[] varQueryArr1 = new string[9];
            string[] varFieldsName = new string[9] { "first_name", "last_name", "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode" };
            string[] varFieldsValue = new string[9] { model.Name, model.Name, model.Address, model.Country, model.Phone, model.Address1, model.City, model.State, model.ZipCode };
            for (int n = 0; n < 9; n++)
            {
                ThirdPartyRepository.UpdateUserVendorMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        public JsonResult GetVendorPurchaseOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int postatus =0;
            int TotalRecord = 0;
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    postatus = Convert.ToInt32(model.strValue3);
                DataTable dt = ThirdPartyRepository.GetVendorPurchaseOrderList(model.strValue4, postatus, fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetProposalsList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long supplierid = 0; bool IsBilled = false;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue4))
                    IsBilled = model.strValue4.Equals("1") ? true : false;
                if (!string.IsNullOrEmpty(model.strValue3))
                    supplierid = Convert.ToInt32(model.strValue3);
                DataTable dt = ThirdPartyRepository.GetProposals(fromdate, todate, supplierid, IsBilled, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
    }
}