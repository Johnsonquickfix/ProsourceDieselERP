using LaylaERP.BAL;
using LaylaERP.Models;
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
            return View();
        }
        [HttpPost]
        public JsonResult AddVendorBasicInfo(ThirdPartyModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {
                    new ThirdPartyRepository().EditVendorBasicInfo(model);
                    new ThirdPartyRepository().EditJournal(model);
                    return Json(new { status = true, message = "Vendor Basic info has been updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    int ID = new ThirdPartyRepository().AddNewVendorBasicInfo(model);
                    if (ID > 0)
                    {
                        new ThirdPartyRepository().AddJournal(model,ID);
                        return Json(new { status = true, message = "Vendor Basic info has been saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
            }
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
                        return Json(new { status = true, message = "Vendor Additional info has been saved successfully!!", url = "", id = ID }, 0);
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
                    int ID = new ThirdPartyRepository().AddVendorPaymentTerms(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Vendor Payment terms has been saved successfully!!", url = "", id = ID }, 0);
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
                int id = new ThirdPartyRepository().GetShippingVendorID(model.rowid);
                if (id != model.rowid)
                {
                    new ThirdPartyRepository().UpdateVendorShipping(model);
                    int ID = new ThirdPartyRepository().AddVendorShipping(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Vendor shipping has been saved successfully!!", url = "", id = ID }, 0);
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
                    return Json(new { status = true, message = "Vendor shipping has been updated successfully!!", url = "", id = ID }, 0);
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
                    int ID = new ThirdPartyRepository().AddVendorTaxes(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Vendor Taxes has been saved successfully!!", url = "", id = ID }, 0);
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
                    int ID = new ThirdPartyRepository().AddVendorDiscount(model);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Vendor Discount has been saved successfully!!", url = "", id = ID }, 0);
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
        public JsonResult AddPaymentMethods(ThirdPartyModel model)
        {
            
                if (model.rowid > 0)
                {
                    int id = new ThirdPartyRepository().GetPaymentVendorID(model.rowid);
                    if (id != model.rowid)
                    {
                        int ID = new ThirdPartyRepository().AddPaymentMethods(model);
                        if (ID > 0)
                        {
                            return Json(new { status = true, message = "Vendor Details has been saved successfully!!", url = "", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                        }
                    }
                    else
                    {
                        int ID = new ThirdPartyRepository().EditPaymentMethods(model);
                        return Json(new { status = true, message = "Vendor Details has been updated successfully!!", url = "", id = ID }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Vendor info not Found", url = "", id = 0 }, 0);
                }
            
            //return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        public JsonResult AddContacts(ThirdPartyModel model)
        {
                if (model.rowid > 0)
                {
                    if (model.ContactID > 0)
                    {
                        new ThirdPartyRepository().EditVendorContacts(model);
                        return Json(new { status = true, message = "Contact has been updated successfully!!", url = "", id = model.ContactID }, 0);
                        
                    }
                    else
                    {
                        int ID = new ThirdPartyRepository().AddContacts(model);
                        if (ID > 0)
                            return Json(new { status = true, message = "Contacts has been saved successfully!!", url = "", id = ID }, 0);
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
                        return Json(new { status = true, message = "Warehouse has been Linked successfully!!", url = "", id = ID }, 0);
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
                int ID = new ThirdPartyRepository().DeleteWarehouse(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Warehouse has been deleted successfully!!", url = "", id = ID }, 0);
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
                int ID = new ThirdPartyRepository().DeleteVendorLinkedFiles(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Vendor Linked Files has been deleted successfully!!", url = "", id = ID }, 0);
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
        public JsonResult GetVendorWarehouseList(ThirdPartyModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.rowid;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = ThirdPartyRepository.GetVendorWarehouseList(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetVendorRelatedProductList(ThirdPartyModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.rowid;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = ThirdPartyRepository.GetVendorRelatedProduct(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
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
                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg")
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
        public JsonResult GetVendorLinkedFiles(ThirdPartyModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.rowid;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                ViewBag.AttachedFiles = "0";
                DataTable dt = ThirdPartyRepository.GetVendorLinkedFiles(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
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
                DataTable dt = ThirdPartyRepository.GetPurchaseOrder(model.strValue1,model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

    }
}