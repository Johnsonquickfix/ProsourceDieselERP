﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.BAL;
using System.Data;
using Newtonsoft.Json;
using LaylaERP.UTILITIES;

namespace LaylaERP.Controllers
{

    public class CustomerController : Controller
    {
        CustomerRepository Repo = null;
        public CustomerController()
        {
            Repo = new CustomerRepository();
        }
        // GET: Customer
        public ActionResult Customer()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetCustomerList(CustomerModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = CustomerRepository.CustomerList(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch { }
            //return Json(JSONresult, 0);
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetCustomerByID(CustomerModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CustomerRepository.CustomerByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public ActionResult NewUser(long id = 0)
        {
            CustomerModel model = new CustomerModel();
            ViewBag.id = id;
            return View(model);
        }
        [HttpPost]
        public JsonResult NewUser(CustomerModel model)
        {
            //if (ModelState.IsValid)
            //{
                if (model.ID > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "customer id ("+ model.ID + ") updated in manage customer.", "/Customer/NewUser/" + model.ID + "" + ", " + Net.BrowserInfo);
                    Repo.EditCustomer(model, model.ID);
                    Updateuser_MetaData(model, model.ID);
                    Updateuser_MetaData_BillingAddress(model, model.ID);
                    Updateuser_MetaData_ShippingAddress(model, model.ID);
                    return Json(new { status = true, message = "Customer record updated successfully!!", url = "Manage", id = model.ID }, 0);
                }
                else
                {
                    int ID = Repo.AddNewCustomer(model);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "New customer "+ model.billing_email+" created in manage customer.", "/Customer/NewUser" + ", " + Net.BrowserInfo);
                        Adduser_MetaData(model, ID);
                        Adduser_MetaData_BillingAddress(model, ID);
                        Adduser_MetaData_ShippingAddress(model, ID);
                        ModelState.Clear();
                        return Json(new { status = true, message = "Customer record saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
            //}
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        [HttpPost]
        public JsonResult UpdateCustomer(CustomerModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    Repo.EditCustomerStatus(model);
                    return Json(new { status = true, message = "Customer status updated successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        [HttpPost]
        public JsonResult DeleteCustomer(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                Repo.DeleteCustomer(strID);
                return Json(new { status = true, message = "Customer status deleted successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
        public JsonResult ChangeCustomerStatus(CustomerModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                Repo.ChangeCustomerStatus(model, strID);
                return Json(new { status = true, message = "Customer status changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
        private void Adduser_MetaData(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[14];
            string[] varFieldsName = new string[14] { "nickname", "first_name", "last_name", "description", "rich_editing", "syntax_highlighting", "comment_shortcuts", "admin_color", "use_ssl", "show_admin_bar_front", "locale", "wp_capabilities", "wp_user_level", "dismissed_wp_pointers" };
            string[] varFieldsValue = new string[14] { model.user_nicename, model.first_name, model.last_name, "", "true", "true", "false", "fresh", "0", "true", "", "customer", "2", "" };
            for (int n = 0; n < 14; n++)
            {
                Repo.AddUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Updateuser_MetaData(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[14];
            string[] varFieldsName = new string[14] { "nickname", "first_name", "last_name", "description", "rich_editing", "syntax_highlighting", "comment_shortcuts", "admin_color", "use_ssl", "show_admin_bar_front", "locale", "wp_capabilities", "wp_user_level", "dismissed_wp_pointers" };
            string[] varFieldsValue = new string[14] { model.user_nicename, model.first_name, model.last_name, "", "true", "true", "false", "fresh", "0", "true", "", "customer", "2", "" };
            for (int n = 0; n < 14; n++)
            {
               // Repo.UpdateUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
                Repo.UpdatecustomerMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Adduser_MetaData_BillingAddress(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[11];
            string[] varFieldsName = new string[11] { "billing_first_name", "billing_last_name", "billing_company", "billing_address_1", "billing_address_2", "billing_city", "billing_postcode", "billing_country", "billing_state", "billing_phone", "billing_email" };
            string[] varFieldsValue = new string[11] { model.first_name, model.last_name, "", model.billing_address_1, model.billing_address_2, model.billing_city, model.billing_postcode, model.billing_country, model.billing_state, model.billing_phone, model.user_email };
            for (int n = 0; n < 11; n++)
            {
                Repo.AddUserMetaDataBillingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Updateuser_MetaData_BillingAddress(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[10];
            string[] varFieldsName = new string[10] { "billing_first_name", "billing_last_name", "billing_address_1", "billing_address_2", "billing_city", "billing_postcode", "billing_country", "billing_state", "billing_phone", "billing_email" };
            string[] varFieldsValue = new string[10] { model.first_name, model.last_name, model.billing_address_1, model.billing_address_2, model.billing_city, model.billing_postcode, model.billing_country, model.billing_state, model.billing_phone, model.user_email };
            for (int n = 0; n < 10; n++)
            {
                //  Repo.UpdateUserMetaDataBillingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
                Repo.UpdatecustomerMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Adduser_MetaData_ShippingAddress(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[11];
            string[] varFieldsName = new string[11] { "shipping_first_name", "shipping_last_name", "shipping_company", "shipping_address_1", "shipping_address_2", "shipping_city", "shipping_postcode", "shipping_country", "shipping_state", "shipping_phone", "shipping_email" };
            string[] varFieldsValue = new string[11] { model.shipping_first_name, model.shipping_last_name, "", model.shipping_address_1, model.shipping_address_2, model.shipping_city, model.shipping_postcode, model.shipping_country, model.shipping_state, model.shipping_phone, model.user_email };

            for (int n = 0; n < 11; n++)
            {
                Repo.AddUserMetaDataShippingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Updateuser_MetaData_ShippingAddress(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[10];
            //string[] varFieldsName = new string[10] { "billing_first_name", "billing_last_name", "billing_address_1", "billing_address_2", "billing_city", "billing_postcode", "billing_country", "billing_state", "billing_phone", "billing_email" };
            //string[] varFieldsValue = new string[10] { model.first_name, model.last_name, model.billing_address_1, model.billing_address_2, model.billing_city, model.billing_postcode, model.billing_country, model.billing_state, model.billing_phone, model.user_email };
            string[] varFieldsName = new string[10] { "shipping_first_name", "shipping_last_name", "shipping_address_1", "shipping_address_2", "shipping_city", "shipping_postcode", "shipping_country", "shipping_state", "shipping_phone", "shipping_email" };
            string[] varFieldsValue = new string[10] { model.shipping_first_name, model.shipping_last_name, model.shipping_address_1, model.shipping_address_2, model.shipping_city, model.shipping_postcode, model.shipping_country, model.shipping_state, model.shipping_phone, model.user_email };

            for (int n = 0; n < 10; n++)
            {
                // Repo.UpdateUserMetaDataShippingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
                Repo.UpdatecustomerMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        [HttpGet]
        public JsonResult GetCustomersAddresssList(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                //DataTable dt = CustomerRepository.SearchCustomerAddress(model.strValue1);
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);

                string id = "0";
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = model.strValue1;
                DataSet ds = CustomerRepository.SearchCustomerAddress(id);
                result = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult fillCustomersAddresssList(SearchModel model)
        {
            string result = string.Empty;
            try
            {

                string id = "0";
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = model.strValue1;
                DataSet ds = CustomerRepository.fillCustomersAddresssList(id);
                result = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(result, 0);
        }


        public JsonResult Getrelatedcustomer(SearchModel model)
        {
            DataTable ds = CustomerRepository.Getrelatedcustomer(model.strValue1, model.strValue2);
            string JSONresult = JsonConvert.SerializeObject(ds);
            return Json(JSONresult, 0);
        }
        public JsonResult CustomerAddressByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CustomerRepository.CustomerAddressByID(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

    }
   
}
