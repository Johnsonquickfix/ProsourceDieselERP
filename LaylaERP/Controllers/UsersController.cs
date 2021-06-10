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

        // GET: Add User
        //public ActionResult CreateUser()
        //{
        //    return View();
        //}

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

        [HttpPost]
        public JsonResult UpdateCustomer(CustomerModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                   UsersRepositry.EditCustomerStatus(model);
                    return Json(new { status = true, message = "Customer Status has been updated successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        [HttpPost]
        public JsonResult DeleteUsers(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                UsersRepositry.DeleteUsers(strID);
                return Json(new { status = true, message = "Users status has been updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }


        public ActionResult CreateUser(long id = 0)
        {
            clsUserDetails model = new clsUserDetails();
            ViewBag.id = id;
            return View(model);
        }
        [HttpPost]
        public JsonResult CreateUser(clsUserDetails model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    
                }
                else
                {
                    int ID = UsersRepositry.AddNewCustomer(model);
                    if (ID > 0)
                    {
                        Adduser_MetaData(model, ID);
                        Adduser_MetaData_More(model, ID);
                        ModelState.Clear();
                        return Json(new { status = true, message = "User record has been saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }


        private void Adduser_MetaData(clsUserDetails model, long id)
        {
            string[] varQueryArr1 = new string[14];
            string[] varFieldsName = new string[14] { "nickname", "first_name", "last_name", "description", "rich_editing", "syntax_highlighting", "comment_shortcuts", "admin_color", "use_ssl", "show_admin_bar_front", "locale", "wp_capabilities", "wp_user_level", "dismissed_wp_pointers" };
            string[] varFieldsValue = new string[14] { model.user_nicename, model.first_name, model.last_name, "", "true", "true", "false", "fresh", "0", "true", "", model.user_role, "", "" };
            for (int n = 0; n < 14; n++)
            {
               UsersRepositry.AddUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void Adduser_MetaData_More(clsUserDetails model, long id)
        {
            string[] varQueryArr1 = new string[3];
            string[] varFieldsName = new string[3] { "user_address", "user_country", "user_phone" };
            string[] varFieldsValue = new string[3] { model.address, model.country, model.phone};
            for (int n = 0; n < 2; n++)
            {
                UsersRepositry.AddUserMoreMeta(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

    }
}