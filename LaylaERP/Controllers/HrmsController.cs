using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
    }
}