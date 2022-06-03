using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP_v1.BAL;
using Newtonsoft.Json;
using LaylaERP_v1.Models;

namespace LaylaERP_v1.Controllers
{
    public class PoemailController : Controller
    {
        // GET: Poemail
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AddEmail()
        {
            return View();
        }
        public JsonResult GetUseridList()
        {
            DataSet ds = PoemailRepository.UseridList();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["user_login"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUseremailList(string userid)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = PoemailRepository.UseremailList(userid);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetPoemailList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = PoemailRepository.GetPoemailList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult AddPoemail(PoemailModel model)
        {
            DataTable dt1 = PoemailRepository.Getusercount(model);
            if (dt1.Rows.Count > 0)
            {
                return Json(new { status = false, message = "User email already exists.", url = "" }, 0);
            }
            else
            {   
                int ID = PoemailRepository.AddPoemail(model);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Email saved successfully.", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }

        public JsonResult GetpoemailByID(SearchModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = PoemailRepository.PoemailByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult UpdateEmail(PoemailModel model)
        {
            if (model.rowid > 0)
            {
                PoemailRepository.UpdateEmail(model);
                return Json(new { status = true, message = "Email updated successfully.", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }
        public JsonResult GetRolesType()
        {
            DataTable dt = new DataTable();
            dt = PoemailRepository.GetRolesType();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["ID"].ToString(),
                    Text = dt.Rows[i]["user_type"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }
    }
}