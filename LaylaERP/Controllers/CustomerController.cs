using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;

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
        public ActionResult NewUser()
        {
            return View();
        }
        [HttpPost]
        public ActionResult NewUser(CustomerModel model)
        {
            var Data = Repo.AddNewCustomer(model);
            if(Data.ID>0)
            {
                Adduser_MetaData(model, Data.ID);
                Adduser_MetaData_BillingAddress(model, Data.ID);
                Adduser_MetaData_ShippingAddress(model, Data.ID);

                ViewBag.Message = "Customer Record has been saved successfully!!";
                ModelState.Clear();
            }
            else
            {
                ViewBag.Message = "Error!!";
            }
            return View();
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
    }
}
