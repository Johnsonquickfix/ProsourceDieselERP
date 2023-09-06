using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using LaylaERP.BAL;
using System.Dynamic;
using Newtonsoft.Json;
using System.Text;
using LaylaERP.UTILITIES;
using System.Text.RegularExpressions;

namespace LaylaERP.Controllers
{
    public class UsersController : Controller
    {
        // GET: Users
        public ActionResult Users()
        {

            //RoleCounter();
            string UserValue = CommanUtilities.Provider.GetCurrent().UserType;
            var numbers = UserValue.Split(',');
            string pattern = @"^\w+"; 
            var firstWord = Regex.Match(UserValue, pattern);

            int s = numbers.Length;
            if (s == 1)
                ViewBag.user_role = CommanUtilities.Provider.GetCurrent().UserType;
            else if (UserValue.Contains("administrator"))
                ViewBag.user_role = "administrator";
            else
                ViewBag.user_role = firstWord.Value;

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

            ViewBag.user_role = Convert.ToInt32(UsersRepositry.GetRoleID(CommanUtilities.Provider.GetCurrent().UserType).ToString());

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

        public JsonResult ShowDataUsersDetails(string rolepass)
        {
            //string urid = "0";
            //urid = details.user_status;
            //string result = Models.UsersRepositry.userslist.ToString();
            //UsersRepositry.userslist.Clear();
            // string role="";
            UsersRepositry.ShowDataUsersDetails(rolepass);
            return Json(new { data = UsersRepositry.userslist }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDetails(CustomerModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = UsersRepositry.GetDetails(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch { }
            //return Json(JSONresult, 0);
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
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
            DataTable dt = new DataTable();
            dt = BAL.Users.GetSystemRoles();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["id"].ToString(),
                    Text = dt.Rows[i]["user_type"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSystemAdminRoles()
        {
            DataTable dt = new DataTable();
            dt = BAL.Users.GetSystemAdminRoles();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["id"].ToString(),
                    Text = dt.Rows[i]["user_type"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRolesType()
        {
            DataTable dt = new DataTable();
            dt = BAL.Users.GetRolesType();
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["user_value"].ToString(),
                    Text = dt.Rows[i]["user_type"].ToString()

                });
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRolesTypeTopBar()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.Users.GetRolesTypeTopBar();
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetMenuNames()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = BAL.Users.GetMenuNames();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetCity()
        {
            string t1 = "";
            DataTable dt = new DataTable();
            dt = BAL.Users.GetCity();
            List<string> usertype = new List<string>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                t1 = dt.Rows[i]["City"].ToString();
                usertype.Add(t1);
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCity(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.Users.GetCity(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult GetState(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.Users.GetState(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetCustState(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable DT = BAL.Users.GetCanadaState(model.strValue1, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetCustStateByCountry(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable DT = BAL.Users.GetStateByCountry(model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetState()
        {
            string t1 = "";
            DataTable dt = new DataTable();
            dt = BAL.Users.GetState();
            List<string> usertype = new List<string>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                t1 = dt.Rows[i]["StateFullName"].ToString();
                usertype.Add(t1);
            }
            return Json(usertype, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //public JsonResult GetAssignRole(UserClassification model)
        //{
        //    string result = string.Empty;
        //    try
        //    {
        //        DataTable dt = BAL.Users.GetMenuByUser(model.User_Type);
        //        result = JsonConvert.SerializeObject(dt);
        //    }
        //    catch(Exception ex) { throw ex; }
        //    return Json(result, 0);
        //}

        public JsonResult Save(UserClassification model)
        {
            JsonResult result = new JsonResult();
            var resultOne = BAL.Users.UpdateUserClassifications(model);
            if (resultOne > 0)
            {
                result = this.Json(resultOne);
            }
            return result;
        }



        [HttpPost]
        public JsonResult UpdateCustomer(CustomerModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    UsersRepositry.EditCustomerStatus(model);
                    return Json(new { status = true, message = "Customer status updated successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid details", url = "" }, 0);
        }

        [HttpPost]
        public JsonResult DeleteUsers(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                UsersRepositry.DeleteUsers(strID);
                return Json(new { status = true, message = "Users status updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        [HttpPost]
        public JsonResult ActiveUsers(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                UsersRepositry.ActiveUsers(strID);
                return Json(new { status = true, message = "Users status updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        [HttpPost]
        public JsonResult changeRole(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                UsersRepositry.changeRoleStatus(model);
                return Json(new { status = true, message = "User role status  updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }


        [HttpPost]
        public JsonResult Grantrole(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                UsersRepositry.GrantroleStatus(model);
                return Json(new { status = true, message = "User role permission changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        [HttpPost]
        public JsonResult Revokerole(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                UsersRepositry.RevokeroleStatus(model);
                return Json(new { status = true, message = "User role permission changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        public ActionResult UserDetails(long id)
        {

            dynamic myModel = new ExpandoObject();
            myModel.user_login = null;
            myModel.user_status = null;
            myModel.user_role = null;
            myModel.first_name = null;
            myModel.last_name = null;
            myModel.country = null;
            myModel.address = null;
            myModel.User_Image = null;
            myModel.user_email = null;
            myModel.phone = null;
            myModel.ID = null;

            //myModel.user_email = null;
            DataTable dt = BAL.Users.GetDetailsUserS(id);
            myModel.ID = id;
            myModel.User_Image = dt.Rows[0]["User_Image"];
            myModel.user_email = dt.Rows[0]["user_email"];
            myModel.user_status = dt.Rows[0]["user_status"];
            myModel.first_name = dt.Rows[0]["first_name"];
            myModel.last_name = dt.Rows[0]["last_name"];
            myModel.country = dt.Rows[0]["country"];
            myModel.address = dt.Rows[0]["address"];
            myModel.user_login = dt.Rows[0]["user_login"];
            //string role = dt.Rows[0]["roletype"].ToString();

            //if (role == "accounting")
            //    role = "Accounting";
            //else if (role == "administrator")
            //    role = "Administrator";
            //else if (role == "author")
            //    role = "Author";
            //else if (role == "contributor")
            //    role = "Contributor";
            //else if (role == "editor")
            //    role = "Editor";
            //else if (role == "modsquad")
            //    role = "Mod Squad";
            //else if (role == "wpseo_editor")
            //    role = "SEO Editor";
            //else if (role == "seo_manager")
            //    role = "SEO Manager";
            //else if (role == "shop_manager")
            //    role = "Shop Manager";
            //else if (role == "shop_manager")
            //    role = "Shop Manager";
            //else if (role == "subscriber")
            //    role = "Subscriber";
            //else if (role == "supplychainmanager")
            //    role = "Supply Chain Manager";
            //else
            string role = "";

            LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
            //var _att = serializer.Deserialize(dt.Rows[0]["user_role"].ToString());
            System.Collections.Hashtable _att = serializer.Deserialize(dt.Rows[0]["user_role"].ToString()) as System.Collections.Hashtable;
            
            foreach (System.Collections.DictionaryEntry att in _att)
            {
                DataTable userdt = BAL.Users.Getuserclassification(att.Key.ToString()); 
                role += userdt.Rows[0]["User_Type"].ToString() + ","; 
            }
            if (!string.IsNullOrEmpty(role) && role.EndsWith(","))
            {
                role = role.Substring(0, role.Length - 1);
            }
            // role = role.Replace("_", " ");    StateFullName       
            myModel.user_role = role;
            myModel.phone = dt.Rows[0]["phone"];
            myModel.State = dt.Rows[0]["State"];
            myModel.StateFullName = dt.Rows[0]["StateFullName"];
            myModel.City = dt.Rows[0]["City"];
            myModel.address2 = dt.Rows[0]["address2"];
            myModel.postcode = dt.Rows[0]["postcode"];

            myModel.user_rolecurrent = CommanUtilities.Provider.GetCurrent().UserType;

            return PartialView("UserDetails", myModel);
            // return myModel;
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
                    int uidID = UsersRepositry.GetUserName(model);
                    if (uidID > 0)
                    {

                        return Json(new { status = false, message = "User name is already exists!!", url = "" }, 0);
                    }
                    else
                    {
                        LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                        //model.user_role = serializer.Serialize(model.user_role);
                        int ID = UsersRepositry.AddNewCustomer(model);
                        if (ID > 0)
                        {
                            UserActivityLog.WriteDbLog(LogType.Submit, "New " + model.user_role + " created in user management.", "/Users/CreateUser" + ", " + Net.BrowserInfo);
                            Adduser_MetaData(model, ID);
                            Adduser_MetaData_More(model, ID);
                            ModelState.Clear();
                            return Json(new { status = true, message = "User record  saved successfully!!", url = "" }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        public JsonResult CreatePassword(clsUserDetails model)
        {

            int length = 8;
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890*$-+?_&=!%{}/";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            if (!(string.IsNullOrEmpty(res.ToString())))
            {
                return Json(new { status = true, message = res.ToString(), url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }


        public JsonResult CityStateZip(clsUserDetails model)
        {
            // model.country
            int ID = UsersRepositry.ZipcodeByCity(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "User record saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public JsonResult GetUserName(clsUserDetails model)
        {

            int ID = UsersRepositry.GetUserName(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "User record saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        public JsonResult GetEmailName(clsUserDetails model)
        {

            int ID = UsersRepositry.GetEmailName(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "User record saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }


        }

        [HttpPost]
        public JsonResult UpdateUser(clsUserDetails model)
        {

            int ID = UsersRepositry.UpdateUsers(model);
            if (ID > 0)
            {
                UserActivityLog.WriteDbLog(LogType.Submit, "user id (" + model.ID + ") updated in user management.", "/Users/UserDetails?id=" + model.ID + "" + ", " + Net.BrowserInfo);
                Updateuser_MetaData(model, model.ID);
                Updateuser_MetaData_More(model, model.ID);
                ModelState.Clear();
                return Json(new { status = true, message = "User record updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

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
            string[] varQueryArr1 = new string[7];
            string[] varFieldsName = new string[7] { "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode" };
            string[] varFieldsValue = new string[7] { model.address, model.country, model.phone, model.billing_address_2, model.billing_city, model.billing_state, model.billing_postcode };
            for (int n = 0; n < 7; n++)
            {
                UsersRepositry.AddUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void Updateuser_MetaData(clsUserDetails model, long id)
        {
            string[] varQueryArr1 = new string[13];
            string[] varFieldsName = new string[13] { "nickname", "first_name", "last_name", "description", "rich_editing", "syntax_highlighting", "comment_shortcuts", "admin_color", "use_ssl", "show_admin_bar_front", "locale", "wp_user_level", "dismissed_wp_pointers" };
            string[] varFieldsValue = new string[13] { model.user_nicename, model.first_name, model.last_name, "", "true", "true", "false", "fresh", "0", "true", "", "", "" };
            for (int n = 0; n < 13; n++)
            {
                UsersRepositry.UpdateUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void Updateuser_MetaData_More(clsUserDetails model, long id)
        {
            string[] varQueryArr1 = new string[7];
            string[] varFieldsName = new string[7] { "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode" };
            string[] varFieldsValue = new string[7] { model.address, model.country, model.phone, model.billing_address_2, model.billing_city, model.billing_state, model.billing_postcode };
            for (int n = 0; n < 7; n++)
            {
                UsersRepositry.UpdateUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        [HttpPost]
        public JsonResult GetUsersCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = UsersRepositry.UsersCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult NewRole(UserClassification model)
        {
            if (ModelState.IsValid)
            {
                int RoleID = new UsersRepositry().CheckDuplicateUserRole(model);
                if (RoleID == 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "New user role " + model.User_Type + " created", "/Users/AssignRole" + ", " + Net.BrowserInfo);
                    int ID = new UsersRepositry().AddNewRole(model);
                    if (ID > 0)
                    {
                        ModelState.Clear();
                        return Json(new { status = true, message = "Role saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Role Can not be duplicate", url = "" }, 0);
                }

            }
            return Json(new { status = false, message = "Invalid details", url = "" }, 0);
        }

        public JsonResult ChangePermission(UserClassification model)
        {
            int role_id = model.role_id;
            string strID = model.strVal;
            string strAdd = model.strAdd;
            string strEdit = model.strEdit;
            string strDel = model.strDel;
            string flag = model.flag;

            if (role_id == 65)
            {
                return Json(new { status = false, message = "You can not change administrator permission", url = "" }, 0);
            }
            else if (strID != "")
            {
                new UsersRepositry().ChangePermission(strID, role_id, flag);
                new UsersRepositry().UpdateAddPermission(role_id, strAdd);
                new UsersRepositry().UpdateEditPermission(role_id, strEdit);
                new UsersRepositry().UpdateDeletePermission(role_id, strDel);
                return Json(new { status = true, message = "User permission changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }
        }
        public JsonResult CopyPermission(UserClassification model)
        {
            int role_id = model.role_id;
            int roletoid = model.roleto;

            if (roletoid > 0)
            {
                new UsersRepositry().CopyPermission(roletoid, role_id);
                return Json(new { status = true, message = "User permission copied successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }
        }
        public JsonResult getUserAuthMenu(LoginModel model)
        {
            List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
            Dictionary<String, Object> row;
            try
            {
                DataTable DT = BAL.Users.GetUserAuth(model.roleid);
                DataRow[] rows = DT.Select("level = 0", "menu_code");
                foreach (DataRow dr in rows)
                {
                    string myhtml = "";
                    string myhtmltext = "";
                    myhtml = "<div class=\"table-row\"><div><span class='menu-names'>" + dr["menu_name"].ToString() + "</span></div><div>&nbsp;</div><div><button><input type=\"checkbox\" id=\"chk_add_" + dr["menu_id"] + "\" onChange=\"checkchange(this);\" data-id=\"" + dr["menu_id"] + "\" " + dr["CheckAdd"] + "></input> <label>Add</label></button></div><div><button><input type=\"checkbox\" id=\"chk_edit_" + dr["menu_id"] + "\" onChange=\"checkchange(this);\" data-id=\"" + dr["menu_id"] + "\" " + dr["CheckEdit"] + "></input> <label>Edit</label></button></div><div><button><input type=\"checkbox\" id =\"chk_del_" + dr["menu_id"] + "\" onChange=\"checkchange(this);\" data-id=\"" + dr["menu_id"] + "\" " + dr["CheckDelete"] + "></input> <label>View</label></button></div></div>";
                    myhtmltext = "<div class=\"table-row\"><div><span class='menu-names'>" + dr["menu_name"].ToString() + "</span></div><div>&nbsp;</div><div></div></div>";
                    row = new Dictionary<String, Object>();
                    row.Add("id", dr["menu_id"]);
                    row.Add("add", dr["RoleAdd"]);
                    row.Add("edit", dr["RoleEdit"]);
                    row.Add("delete", dr["RoleDelete"]);
                    row.Add("CheckAdd", dr["CheckAdd"]);
                    row.Add("CheckEdit", dr["CheckEdit"]);
                    row.Add("CheckDelete", dr["CheckDelete"]);
                    if (dr["menu_url"].ToString().Trim() != "#")
                    {
                        row.Add("url", dr["menu_url"]);
                        row.Add("text", myhtml);
                    }
                    else
                    {
                        row.Add("text", myhtmltext);
                    }
                    row.Add("level", dr["level"]);
                    if (dr["parent_id"] != DBNull.Value)
                        row.Add("parent", dr["parent_id"]);
                    if (dr["checked"] != DBNull.Value)
                        row.Add("checked", dr["checked"]);


                    List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["menu_id"]));
                    row.Add("children", list2);
                    tableRows.Add(row);
                }
            }
            catch (Exception ex) { throw ex; }
            return Json(tableRows, 0);
        }

        public static List<Dictionary<string, object>> Getdata(DataTable DT, int ParentID)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            Dictionary<String, Object> row;
            DataRow[] rows = DT.Select("parent_id = " + ParentID.ToString(), "menu_code");
            foreach (DataRow dr in rows)
            {
                string myhtml = "";
                myhtml = "<div class=\"table-row\"><div><span class='menu-names2'>" + dr["menu_name"].ToString() + "</span></div><div>&nbsp;</div><div><button><input type=\"checkbox\" class=\"checkAdd\" id=\"chk_add_" + dr["menu_id"] + "\" onChange=\"checkchange(this);\" data-id=\"" + dr["menu_id"] + "\" " + dr["CheckAdd"] + "></input> <label>Add</label></button></div><div><button><input type=\"checkbox\"  onChange=\"checkchange(this);\" data-id=\"" + dr["menu_id"] + "\" id=\"chk_edit_" + dr["menu_id"] + "\" " + dr["CheckEdit"] + "></input> <label>Edit</label></button></div><div><button><input type=\"checkbox\"  onChange=\"checkchange(this);\" data-id=\"" + dr["menu_id"] + "\" id =\"chk_del_" + dr["menu_id"] + "\" " + dr["CheckDelete"] + "></input> <label>View</label></button></div></div>";

                row = new Dictionary<String, Object>();
                row.Add("id", dr["menu_id"]);
                row.Add("add", dr["RoleAdd"]);
                row.Add("edit", dr["RoleEdit"]);
                row.Add("delete", dr["RoleDelete"]);
                if (dr["menu_url"].ToString().Trim() != "#")
                    row.Add("url", dr["menu_url"]);
                row.Add("urlType", "none");
                row.Add("targetType", "iframe-tab");
                row.Add("level", dr["level"]);
                row.Add("icon", dr["menu_icon"]);
                if (dr["parent_id"] != DBNull.Value)
                    row.Add("parent", dr["parent_id"]);
                if (dr["checked"] != DBNull.Value)
                    row.Add("checked", dr["checked"]);
                row.Add("text", myhtml);
                List<Dictionary<string, object>> list2 = Getdata(DT, Convert.ToInt32(dr["menu_id"]));
                row.Add("children", list2);
                list.Add(row);
            }
            return list;
        }
    }
}