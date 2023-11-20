using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class WarehouseController : Controller
    {
        // GET: Warehouse
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AddNewWarehouse()
        {
            WarehouseModel model = new WarehouseModel();

            return View(model);
        }
        public ActionResult Warehouse()
        {
            ViewBag.user_role = CommanUtilities.Provider.GetCurrent().UserType;
            return View();
        }
        public ActionResult DamageProduct()
        {
            return View();
        }
        public ActionResult DamageProductList()
        {
            return View();
        }
        public ActionResult UpdateDamageProduct()
        {
            return View();
        }
        public ActionResult DamageStockReport()
        {
            return View();
        }
        public JsonResult GetWarehouse(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetWarehouseDetail(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult AddWarehouse(WarehouseModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {

                }
                else
                {
                    int ID = WarehouseRepository.AddWarehouse(model);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "New warehouse " + model.reff + " created in manage warehouses.", "/Warehouse/AddNewWarehouse" + ", " + Net.BrowserInfo);
                        return Json(new { status = true, message = "Warehouse data saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        public ActionResult UpdateWarehouse(int rowid)
        {

            dynamic myModel = new ExpandoObject();

            myModel.rowid = null;
            myModel.reff = null;
            myModel.description = null;
            myModel.lieu = null;
            myModel.phone = null;
            myModel.fax = null;
            //myModel.statut = null;
            myModel.address = null;
            myModel.zip = null;
            myModel.town = null;
            myModel.country = null;
            myModel.address1 = null;
            myModel.city = null;
            myModel.status = null;
            myModel.warehouse_type = null;
            //Additional Info
            myModel.cor_phone = null;
            myModel.cor_address = null;
            myModel.cor_address1 = null;
            myModel.cor_city = null;
            myModel.cor_state = null;
            myModel.cor_zip = null;
            myModel.cor_country = null;
            myModel.note_public = null;
            myModel.note_private = null;
            myModel.email = null;
            DataTable dt = WarehouseRepository.GetWarehouseID(rowid);
            myModel.rowid = rowid;
            myModel.reff = dt.Rows[0]["ref"];
            myModel.description = dt.Rows[0]["description"];
            myModel.lieu = dt.Rows[0]["lieu"];
            myModel.phone = dt.Rows[0]["phone"];
            myModel.fax = dt.Rows[0]["fax"];
            //myModel.statut = dt.Rows[0]["statut"];
            myModel.address = dt.Rows[0]["address"];
            myModel.zip = dt.Rows[0]["zip"];
            myModel.town = dt.Rows[0]["town"];
            myModel.country = dt.Rows[0]["country"];
            myModel.address1 = dt.Rows[0]["address1"];
            myModel.city = dt.Rows[0]["city"];
            myModel.status = dt.Rows[0]["status"];
            myModel.warehouse_type = dt.Rows[0]["warehouse_type"];
            myModel.cor_phone = dt.Rows[0]["cor_phone"];
            myModel.cor_address = dt.Rows[0]["cor_address"];
            myModel.cor_address1 = dt.Rows[0]["cor_address1"];
            myModel.cor_city = dt.Rows[0]["cor_city"];
            myModel.cor_state = dt.Rows[0]["cor_state"];
            myModel.cor_zip = dt.Rows[0]["cor_zip"];
            myModel.cor_country = dt.Rows[0]["cor_country"];
            myModel.note_public = dt.Rows[0]["note_public"];
            myModel.note_private = dt.Rows[0]["note_private"];
            myModel.email = dt.Rows[0]["email"];
            return PartialView("UpdateWarehouse", myModel);
        }

        [HttpPost]
        public JsonResult Updatewarehouses(WarehouseModel model)
        {
            //int menu_id = 0;
            //AppearanceRepository.UpdateUsers(model);
            if (model.rowid > 0)
            {
                WarehouseRepository.Updatewarehouses(model);
                UserActivityLog.WriteDbLog(LogType.Submit, "Warehouse id ("+ model.rowid + ") updated in manage warehouses.", "/Warehouse/UpdateWarehouse?rowid="+ model.rowid + "" + ", " + Net.BrowserInfo);
                ModelState.Clear();
                return Json(new { status = true, message = "Warehouse data updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public ActionResult MasStockTransfer()
        {

            return View();
        }

        public JsonResult Gettargetwarehouse(string id)
        {
            DataTable dt = new DataTable();
            dt = WarehouseRepository.GetSourceWarehouse(id);
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                warehouselist.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["rowid"].ToString(),
                    Text = dt.Rows[i]["ref"].ToString()

                });
            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProduct()
        {
            DataTable dt = new DataTable();
            dt = WarehouseRepository.GetProduct();
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                warehouselist.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["pr_id"].ToString(),
                    Text = dt.Rows[i]["post_title"].ToString()

                });
            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddMouvment(WarehouseModel model)
        {
            int ID = WarehouseRepository.AddMouvement(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        [HttpPost]
        public JsonResult GetProductInfo(WarehouseModel model, int id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetProductDetails(id);
                //model.price = Convert.ToInt32(dt.Rows[0]["sale_price"].ToString());
                //ViewBag.price = model.price;
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult StockMouvementList()
        {
            return View();
        }

        public JsonResult GetStockMouvement()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetStockMouvment();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult GetStockAtDate()
        {
            return View();
        }

        public JsonResult ListStockAtDate(WarehouseModel model)
        {
            //int id = model.fk_product;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetStockAtDate(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult ListWarehouseByVendor()
        {
            return View();
        }
        public JsonResult GetWarehouseByVendor(WarehouseModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = WarehouseRepository.GetWarehouseByVendor(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        public JsonResult Getvendorwarehouse(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.Getvendorwarehouse(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetWarehousename(SearchModel model)
        {
            DataSet ds = WarehouseRepository.GetWarehouse();
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                warehouselist.Add(new SelectListItem { Text = dr["ref"].ToString(), Value = dr["rowid"].ToString() });

            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Updatewarehousesinfo(WarehouseModel model)
        {
            //int menu_id = 0;
            //AppearanceRepository.UpdateUsers(model);
            if (model.rowid > 0)
            {
                WarehouseRepository.Updatewarehousesinfo(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Warehouse data updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        [HttpPost]
        public JsonResult AddCurrentstock(WarehouseModel model)
        {
            int ID = 1;
            //int ID = WarehouseRepository.AddCurrentstock(model);
            if (ID > 0)
            {
                WarehouseRepository.AddCurrentstock(model);
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult GetCurrentStock(WarehouseModel model)
        {
            //int id = model.fk_product;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetCurrentStock(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetTransferStock(WarehouseModel model)
        {
            //int id = model.fk_product;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetTransferStock(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult AddTransferStock(WarehouseModel model)
        {
            int ID = 1;
            //int ID = WarehouseRepository.AddTransferStock(model);
            if (ID > 0)
            {
                WarehouseRepository.AddTransferStock(model);
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult GetCurrentStock1(SearchModel model)
        {
            //int id = model.fk_product;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetCurrentStock1(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult UpdateCorrectstock(WarehouseModel model)
        {
            if (model.searchid > 0)
            {
                WarehouseRepository.UpdateCorrectstock(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult UpdateTranferstock(WarehouseModel model)
        {
            if (model.searchtransferid > 0)
            {
                WarehouseRepository.UpdateTranferstock(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetProductWarehouse(int getwarehouseid)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetProductWarehouse(getwarehouseid);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult GetProductForWarehouse(int warehouseid, SearchModel model)
        {
            DataTable dt = new DataTable();
            dt = WarehouseRepository.GetProductForWarehouse(warehouseid);
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                warehouselist.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["pr_id"].ToString(),
                    Text = dt.Rows[i]["post_title"].ToString()

                });
            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductStock(int warehouseid, int productid)
        {
            //DataTable dt = new DataTable();
            //dt = WarehouseRepository.GetProductForWarehouse(warehouseid);
            //List<SelectListItem> warehouselist = new List<SelectListItem>();
            //for (int i = 0; i < dt.Rows.Count; i++)
            //{
            //    warehouselist.Add(new SelectListItem
            //    {
            //        Value = dt.Rows[i]["pr_id"].ToString(),
            //        Text = dt.Rows[i]["post_title"].ToString()

            //    });
            //}
            //return Json(warehouselist, JsonRequestBehavior.AllowGet);

            string JSONresult = string.Empty;
            try
            {
                DataTable DT = WarehouseRepository.GetProductStock(warehouseid, productid);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);

        }

        public JsonResult Getwarehousesbytrans(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = WarehouseRepository.Getwarehousesbytrans(model.strValue5);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);

        }

        public JsonResult GetTransferStockDetails(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = WarehouseRepository.GetTransferStockDetails(model);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);

        }


        [HttpPost]
        public ActionResult FileUpload(int WarehouseID, HttpPostedFileBase ImageFile)
        {
            try
            {
                WarehouseModel model = new WarehouseModel();
                if (ImageFile != null)
                {
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    string FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension == ".xlsx" || FileExtension == ".XLSX" || FileExtension == ".xls" || FileExtension == ".XLS" || FileExtension == ".pdf" || FileExtension == ".PDF" || FileExtension == ".doc" || FileExtension == ".DOC" || FileExtension == ".docx" || FileExtension == ".DOCX" || FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".jpg" || FileExtension == ".JPG" || FileExtension == ".jpeg" || FileExtension == ".JPEG")
                    {
                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;
                        DataTable dt = WarehouseRepository.GetfileCountdata(WarehouseID, FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already exist in table", url = "" }, 0);
                        }
                        else
                        {
                            string UploadPath = Path.Combine(Server.MapPath("~/Content/WarehouseLinkedFiles"));
                            UploadPath = UploadPath + "\\";
                            model.ImagePath = UploadPath + FileName;
                            var ImagePath = "~/Content/WarehouseLinkedFiles/" + FileName;
                            ImageFile.SaveAs(model.ImagePath);
                            int resultOne = WarehouseRepository.FileUpload(WarehouseID, FileName, ImagePath, FileExtension, size);
                            if (resultOne > 0)
                            {
                                UserActivityLog.WriteDbLog(LogType.Submit, "Warehouse id (" + model.rowid + ") attached a file in manage warehouses.", "/Warehouse/UpdateWarehouse?rowid=" + model.rowid + "" + ", " + Net.BrowserInfo);
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
        [HttpPost]
        public JsonResult GetBankLinkedFiles(ThirdPartyModel model)
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
                DataTable dt = WarehouseRepository.GetBankLinkedFiles(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult DeleteBankLinkedFiles(WarehouseModel model)
        {
            if (model.rowid > 0)
            {
                int ID = WarehouseRepository.DeleteBankLinkedFiles(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Warehouse linked files deleted successfully!!", url = "", id = ID }, 0);
                else
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Warehouse info not Found", url = "", id = 0 }, 0);
            }
        }

        public JsonResult GetWarehouseByProduct(int productid, int id)
        {
            DataSet ds = WarehouseRepository.GetWarehouseByProduct(productid, id);
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                warehouselist.Add(new SelectListItem { Text = dr["ref"].ToString(), Value = dr["rowid"].ToString() });

            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult AddDamagestock(WarehouseModel model)
        {
            int ID = WarehouseRepository.AddDamagestock(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Data saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }


        public JsonResult GetDamageStock(WarehouseModel model)
        {
            //int id = model.fk_product;
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetDamageStock(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult SelectDamageStock(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.SelectDamageStock(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult UpdateDamagestock(WarehouseModel model)
        {
            if (model.tran_id > 0)
            {
                WarehouseRepository.UpdateDamagestock(model);
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetWarehouseDetailNew(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = WarehouseRepository.GetWarehouseDetailNew(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        public JsonResult WarehouseAddressInfoList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = WarehouseRepository.WarehouseAddressInfoList(model.strValue2, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult Addwarehousesinfo(WarehouseModel model)
        {
            int ID = WarehouseRepository.Addwarehousesinfo(model);
            if (ID > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "Warehouse additional info id ("+ model.warehouse_id + ") updated in manage warehouses.", "/Setup/productrule" + ", " + Net.BrowserInfo);
                return Json(new { status = true, message = "Warehouse additional info saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult SelectAddressByID(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.SelectAddressByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult Editwarehousesinfo(WarehouseModel model)
        {
            if (model.address_id > 0)
            {
                WarehouseRepository.Editwarehousesinfo(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Warehouse additional info updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult GetVendor()
        {
            DataSet ds = WarehouseRepository.GetVendor();
            List<SelectListItem> vendorlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                vendorlist.Add(new SelectListItem { Text = dr["name"].ToString(), Value = dr["rowid"].ToString() });

            }
            return Json(vendorlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWarehouserByVendor(string rowid)
        {
            DataSet ds = WarehouseRepository.GetWarehouserByVendor(rowid);
            List<SelectListItem> warehouselist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                warehouselist.Add(new SelectListItem { Text = dr["name"].ToString(), Value = dr["WarehouseID"].ToString() });

            }
            return Json(warehouselist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductPrice(int productid)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetProductPrice(productid);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult GetDamageStockList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = WarehouseRepository.GetDamageStockList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetDamageProductById(string strValue1)
        {
            string result = string.Empty;
            try 
            {
                DataTable dt = WarehouseRepository.GetDamageProductById(strValue1);
                result = JsonConvert.SerializeObject(dt);
                return Json(result, 0);
            }
            catch(Exception ex) { throw ex; }
        }
        public JsonResult DamageProductReport(string sMonth)
        {
            string JSONResult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.DamageProductReport(sMonth);
                JSONResult = JsonConvert.SerializeObject(dt, Formatting.Indented);
                return Json(JSONResult, 0);
            }
            catch(Exception e) { throw e; }
        }

        public ActionResult DamageFileUpload(int tran_id, HttpPostedFileBase ImageFile)
        {
            try
            {
                WarehouseModel model = new WarehouseModel();
                if (ImageFile != null)
                {
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    string FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension == ".xlsx" || FileExtension == ".xls" || FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".XLSX" || FileExtension == ".XLS" || FileExtension == ".PDF" || FileExtension == ".DOC" || FileExtension == ".DOCX" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".JPEG")
                    {
                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;
                        string UploadPath = Path.Combine(Server.MapPath("~/Content/DamageProductFiles"));
                        UploadPath = UploadPath + "\\";
                        model.ImagePath = UploadPath + FileName;
                        var ImagePath = "~/Content/DamageProductFiles/" + FileName;
                        ImageFile.SaveAs(model.ImagePath);
                        if (tran_id > 0)
                        {
                            WarehouseRepository.DamageFileUpload(FileName, tran_id);
                            return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
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

        public ActionResult DamageFileList(int tran_id)
        {
            string JSONResult = string.Empty;
            DataTable dt = new DataTable();
            dt = WarehouseRepository.DamageFileList(tran_id);
            JSONResult = JsonConvert.SerializeObject(dt, Formatting.Indented);
            return Json(JSONResult, 0);
        }
        //public JsonResult GetProductStockList(int ID)
        //{
        //    string result = string.Empty;
        //    try
        //    {
        //        DataTable dt = WarehouseRepository.GetProductStockList(ID);
        //        result = JsonConvert.SerializeObject(dt, Formatting.Indented);
        //    }
        //    catch { }
        //    return Json(result, 0);
        //}

        [HttpGet]
        public JsonResult GetProductStockList(JqDataTableModel model)
        {
            string optType = model.strValue1;
            string result = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetProductStockList(30);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
    }
}