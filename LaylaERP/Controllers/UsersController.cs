using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using LaylaERP.Models;
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

        // GET: Add User
        public ActionResult CreateUser()
        {
            return View();
        }

        // GET: Assign Role
        public ActionResult AssignRole()
        {
            return View();
        }

        public JsonResult GetData(string rolepass)
        {
            //string urid = "0";
            //urid = details.user_status;
            //string result = Models.UsersRepositry.userslist.ToString();
            //UsersRepositry.userslist.Clear();
           // string role="";
            UsersRepositry.ShowUsersDetails(rolepass);
            return Json(new { data = UsersRepositry.userslist }, JsonRequestBehavior.AllowGet);
        }

        private void RoleCounter()
        {
            ViewBag.admin = Convert.ToInt32(UsersRepositry.RoleCount().ToString());
            ViewBag.modsquad = Convert.ToInt32(UsersRepositry.RoleCount(1).ToString());
            //ViewBag.customer = Convert.ToInt32(UsersRepositry.RoleCount(1, 2).ToString());
            ViewBag.shopmanager = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3).ToString());
            ViewBag.subscriber = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4).ToString());
            ViewBag.supplychainmanager = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5).ToString());
            ViewBag.seoeditor = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6).ToString());
            ViewBag.author = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7).ToString());
            ViewBag.norole = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7, 8).ToString());
            ViewBag.accounting = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7, 8, 9).ToString());
            ViewBag.all = Convert.ToInt32(UsersRepositry.RoleCount(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).ToString());

        }

        public JsonResult GetRoles()
        {
            string t1 = "";
            DataTable dt = new DataTable();
            dt = BAL.Users.GetSystemRoles();
            List<string> usertype = new List<string>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                t1 = dt.Rows[i]["user_type"].ToString();
                usertype.Add(t1);
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        //public JsonResult DeleteUsers(clsUserDetails model)
        //{
        //    string strID = model.strVal;
        //    if (strID != "")
        //    {
        //       UsersRepositry.DeleteUsers(strID);
        //        return Json(new { status = true, message = "Users status has been updated successfully!!", url = "" }, 0);
        //    }
        //    else
        //    {
        //        return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
        //    }

        //}

    }
}