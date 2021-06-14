using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.BAL;
using System.Data;
using Newtonsoft.Json;

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
                DataTable dt = CustomerRepository.CustomerList(urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol,model.SortDir);
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
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    Repo.EditCustomer(model, model.ID);
                    Updateuser_MetaData(model, model.ID);
                    Updateuser_MetaData_BillingAddress(model, model.ID);
                    Updateuser_MetaData_ShippingAddress(model, model.ID);
                    return Json(new { status = true, message = "Customer Record has been updated successfully!!", url = "" }, 0);
                }
                else
                {
                    int ID = Repo.AddNewCustomer(model);
                    if (ID > 0)
                    {
                        Adduser_MetaData(model, ID);
                        Adduser_MetaData_BillingAddress(model, ID);
                        Adduser_MetaData_ShippingAddress(model, ID);
                        ModelState.Clear();
                        return Json(new { status = true, message = "Customer Record has been saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }
        [HttpPost]
        public JsonResult UpdateCustomer(CustomerModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.ID > 0)
                {
                    Repo.EditCustomerStatus(model);
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
        public JsonResult DeleteCustomer(CustomerModel model)
        {
            string strID = model.strVal;
                if (strID != "")
                {
                    Repo.DeleteCustomer(strID);
                    return Json(new { status = true, message = "Customer Status has been Deleted successfully!!", url = "" }, 0);
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
                Repo.ChangeCustomerStatus(model,strID);
                return Json(new { status = true, message = "Customer Status has been Changed successfully!!", url = "" }, 0);
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
                Repo.UpdateUserMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
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
                Repo.UpdateUserMetaDataBillingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Adduser_MetaData_ShippingAddress(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[11];
            string[] varFieldsName = new string[11] { "shipping_first_name", "shipping_last_name", "shipping_company", "shipping_address_1", "shipping_address_2", "shipping_city", "shipping_postcode", "shipping_country", "shipping_state", "shipping_phone", "shipping_email" };
            string[] varFieldsValue = new string[11] { model.first_name, model.last_name, "", model.billing_address_1, model.billing_address_2, model.billing_city, model.billing_postcode, model.billing_country, model.billing_state, model.billing_phone, model.user_email };

            for (int n = 0; n < 11; n++)
            {
                Repo.AddUserMetaDataShippingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
        private void Updateuser_MetaData_ShippingAddress(CustomerModel model, long id)
        {
            string[] varQueryArr1 = new string[10];
            string[] varFieldsName = new string[10] { "billing_first_name", "billing_last_name", "billing_address_1", "billing_address_2", "billing_city", "billing_postcode", "billing_country", "billing_state", "billing_phone", "billing_email" };
            string[] varFieldsValue = new string[10] { model.first_name, model.last_name, model.billing_address_1, model.billing_address_2, model.billing_city, model.billing_postcode, model.billing_country, model.billing_state, model.billing_phone, model.user_email };
            for (int n = 0; n < 10; n++)
            {
                Repo.UpdateUserMetaDataShippingAddress(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
    }
}
