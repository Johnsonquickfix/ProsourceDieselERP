using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.Models;

namespace LaylaERP.Controllers
{
    public class HrmsController : Controller
    {
        // GET: Employee
        public ActionResult Employee()
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
}