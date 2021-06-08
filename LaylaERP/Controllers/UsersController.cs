using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System.Data;
using System.Configuration;
using LaylaERP.BAL;
namespace LaylaERP.Controllers
{
    public class UsersController : Controller
    {
        // GET: Users
        public ActionResult Users()
        {

            RoleCounter();
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
        public ActionResult AddNewUser(FormCollection dt)
        {
            return View();
        }

        // GET: Assign Role
        public ActionResult AssignRole()
        {
            //GetRoles();
            return View();
        }

        public JsonResult GetData(clsUserDetails details)
        {
            //string urid = "0";
            //urid = details.user_status;
            //string result = Models.UsersRepositry.userslist.ToString();
            //UsersRepositry.userslist.Clear();

            UsersRepositry.ShowUsersDetails();
            return Json(new { data = UsersRepositry.userslist }, JsonRequestBehavior.AllowGet);
        }

        private void RoleCounter()
        {
            ViewBag.admin = Convert.ToInt32(UsersRepositry.RoleCount().ToString());
            ViewBag.modsquad = Convert.ToInt32(UsersRepositry.RoleCount(1).ToString());
            ViewBag.customer = Convert.ToInt32(UsersRepositry.RoleCount(1, 2).ToString());
            ViewBag.shopmanager = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3).ToString());
            ViewBag.subscriber = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4).ToString());
            ViewBag.supplychainmanager = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5).ToString());
            ViewBag.seoeditor = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6).ToString());
            ViewBag.author = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7).ToString());
            ViewBag.norole = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7, 8).ToString());
            ViewBag.accounting = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7, 8, 9).ToString());
            ViewBag.all = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).ToString());

        }
    }
}