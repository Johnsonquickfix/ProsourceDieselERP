﻿using System;
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

        // GET: User Profile
        public ActionResult UserProfile()
        {
            return View();
        }

        // GET: Assign Role
        public ActionResult AssignRole()
        {
            GetRoles();
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
        
    }
}