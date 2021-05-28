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
    public class SettingController : Controller
    {
        // GET: Setting
        public ActionResult Setting()
        {
            return View();
        }
        // GET: Activity Log History
        public ActionResult ActivityLog()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetUserList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = Users.GetUsers(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult GetActivityLogList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long urid = 0; int TotalRecord = 0;
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                if (!string.IsNullOrEmpty(model.strValue1))
                    urid = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    fromdate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    todate = Convert.ToDateTime(model.strValue3);
                DataTable dt = UTILITIES.UserActivityLog.GetActivityLog(urid, fromdate, todate, model.PageNo, model.PageSize, out TotalRecord);
                JSONresult = JsonConvert.SerializeObject(dt);

                //JSONresult = JsonConvert.SerializeObject("{\"sEcho\":" + 1 + ", \"recordsTotal\":" + TotalRecord + ", \"recordsFiltered\":" + TotalRecord + ", \"iTotalRecords\":" + TotalRecord + ", \"iTotalDisplayRecords\":" + TotalRecord + ", \"aaData\":" + JSONresult + "}");
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}