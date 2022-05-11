namespace LaylaERP.Controllers
{
    using LaylaERP.BAL;
    using LaylaERP.Models;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;


    public class MiscellaneousBillController : Controller
    {
        public ActionResult AutoBillConfigList()
        {
            return View();
        }

        // GET: Miscellaneous Auto Bill Configuration
        public ActionResult AutoBillConfig()
        {
            return View();
        }

        [HttpPost]
        [Route("miscellaneousbill/autobillconfig-save")]
        public JsonResult AutoBillConfigSave(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, userid = CommanUtilities.Provider.GetCurrent().UserID;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(MiscellaneousBillRepository.AutoBillConfigSave(id, userid, "I", orderXML, orderdetailsXML));

            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [Route("miscellaneousbill/billstatus-update")]
        public JsonResult BillStatusUpdate(SearchModel model)
        {
            string result = string.Empty;
            bool _status = false;
            try
            {
                long id = 0, userid = CommanUtilities.Provider.GetCurrent().UserID;
                bool is_active = false;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2)) is_active = Convert.ToBoolean(model.strValue2);

                if (MiscellaneousBillRepository.BillStatusUpdate(id, userid, is_active) > 0)
                {
                    _status = true; result = "Status updated successfully.";
                }
            }
            catch (Exception ex) { result = ex.Message; _status = false; }
            return Json(new { status = _status, message = result }, 0);
        }
        [HttpGet]
        [Route("miscellaneousbill/autobill-list")]
        public JsonResult AutoBillList(JqDataTableModel model)
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
                DataTable dt = MiscellaneousBillRepository.AutoBillsList(fromdate, todate, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        [Route("miscellaneousbill/get-autobill")]
        public JsonResult GetAutoBillByID(SearchModel model)
        {
            string result = string.Empty;
            bool _status = false;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt32(model.strValue1);
                DataSet ds = MiscellaneousBillRepository.GetAutoBillByID(id);
                result = JsonConvert.SerializeObject(ds); _status = true;
            }
            catch (Exception ex) { result = ex.Message; _status = false; }
            return Json(new { status = _status, data = result }, 0);
        }
    }
}