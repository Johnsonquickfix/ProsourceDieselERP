using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class ReceptionController : Controller
    {
        // GET: Reception
        public ActionResult NewReceiveOrder(long id = 0)
        {
            ViewBag.id = id;
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

        public JsonResult Getwarehouse(SearchModel model)
        {
            DataSet ds = BAL.ReceptionRepository.Getwarehouse(model.strValue1);
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["Name"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

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
                    b_status = true; JSONstring = "Purchase Record has been updated successfully!!";
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
    }
}