using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;

namespace LaylaERP.Controllers
{
    public class HrmsController : Controller
    {
        // GET: Employee
        public ActionResult Employee(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }
        public ActionResult EmployeeList()
        {
            return View();
        }

        // GET: Attendance
        public ActionResult Attendance()
        {
            return View();
        }

        // GET: Leave
        public ActionResult Leave()
        {
            return View();
        }

        // GET: Payroll
        public ActionResult Payroll()
        {
            return View();
        }

        // GET: Appraisal
        public ActionResult Appraisal()
        {
            return View();
        }

        // GET: Hrms
        public ActionResult RoleMembership()
        {
            return View();
        }

        public JsonResult GetDesignation()
        {
            DataSet ds = HrmsRepository.GetDesignation();
            List<SelectListItem> designationlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                designationlist.Add(new SelectListItem { Text = dr["designation"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(designationlist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetDepartment()
        {
            DataSet ds = HrmsRepository.GetDepartment();
            List<SelectListItem> designationlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                designationlist.Add(new SelectListItem { Text = dr["department"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(designationlist, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult AddEmployee(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditEmployee(model,model.rowid);
                HrmsRepository.EditEmployeeDetails(model, model.rowid);
                return Json(new { status = true, message = "Data has been Updated successfully!!", url = "" }, 0);
            }
            else
            {
                int ID = HrmsRepository.AddEmployee(model);
                if (ID > 0)
                {
                    HrmsRepository.AddEmployeeDetails(model, ID);
                    return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }

        public JsonResult GetEmployeeList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeeList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult UpdateEmployeeStatus(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                new HrmsRepository().UpdateEmployeeStatus(model);
                return Json(new { status = true, message = "Employee status has been changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetEmployeeByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeeByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

    }
}