using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System.Data;
using System.Configuration;

namespace LaylaERP.Controllers
{
    public class UsersController : Controller
    {
        // GET: Users
        public ActionResult Users()
        {
            
               return View();
        }

        // GET: Assign Role
        public ActionResult AssignRole()
        {
            return View();
        }

        public JsonResult GetData()
        {
           
            Models.UsersRepositry.ShowUsersDetails();
            return Json(new { data =Models.UsersRepositry.userslist }, JsonRequestBehavior.AllowGet);
        }
    }
}