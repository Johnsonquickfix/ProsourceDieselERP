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
        [HttpPost]
        public ActionResult Users(FormCollection dt)
        {

            //FormCollection fm = new FormCollection();
            //var j = fm["UserStatus"].ToString();
            //Models.UsersRepositry.ShowUsersDetails(j);
            //return Json(new { data = Models.UsersRepositry.userslist }, JsonRequestBehavior.AllowGet);
            return View();
        }

        // GET: Assign Role
        public ActionResult AssignRole()
        {
            return View();
        }

        public JsonResult GetData(clsUserDetails details)
        {
            string status = "0";
            if (details.user_status != "0")
                status = details.user_status.ToString();
            Models.UsersRepositry.ShowUsersDetails(status);
            return Json(new { data = Models.UsersRepositry.userslist }, JsonRequestBehavior.AllowGet);
        }
        
    }
}