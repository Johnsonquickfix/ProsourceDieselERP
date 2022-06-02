using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class CustomerServiceController : Controller
    {
        [Route("customer-service/search-customer")]
        public ActionResult CustomerSearch()
        {
            return View();
        }
        [HttpGet]
        [Route("customer-service/order-list")]
        public JsonResult GetOrderList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long customer_id = 0, order_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    customer_id = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    order_id = Convert.ToInt64(model.strValue2);

                DataTable dt = CustomerServiceRepository.CustomerOrders(customer_id, order_id, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        [Route("customer-service/customer-list")]
        public JsonResult GetCustomer(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                string flag = "CUSTUSERS";
                if (model.strValue1.Equals("USER")) flag = "CUSTUSERS";
                else if (model.strValue1.Equals("EMAIL")) flag = "CUSTBMAIL";
                DataTable dt = CustomerServiceRepository.GetCustomers(flag, model.strValue2);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        [Route("customer-service/customer-info")]
        public JsonResult GetCustomerInfo(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                long customer_id = 0, order_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    customer_id = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    order_id = Convert.ToInt64(model.strValue2);
                DataTable dt = CustomerServiceRepository.GetCustomerInfo(customer_id, order_id, model.strValue3, model.strValue4);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost]
        [Route("customer-service/order")]
        public JsonResult GetOrderInfo(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long oid = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                DataSet ds = CustomerServiceRepository.GetOrderInfo(oid);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        [Route("customer-service/generate-ticket")]
        public JsonResult GenerateOrderTicket(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(model.strValue1))
                {
                    DataTable dt = CustomerServiceRepository.GenerateOrderTicket(model.strValue1);
                    JSONresult = JsonConvert.SerializeObject(dt);
                    if (dt.Rows.Count > 0)
                    {
                        if (dt.Rows[0]["response"].ToString() == "success")
                        {
                            SendEmail.SendEmails_outer(model.strValue2, "Layla Sleep Warranty Information (#" + dt.Rows[0]["id"].ToString() + ").", model.strValue3, string.Empty);
                        }
                    }
                }
                else { JSONresult = "[{\"id\":0,\"response\":\"Please select product.\"}]"; }
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [Route("customer-service/search-ticket")]
        public ActionResult CustomerTicketSearch()
        {
            return View();
        }
        [HttpGet]
        [Route("customer-service/ticket-list")]
        public JsonResult GetTicketList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long ticket_id = 0, customer_id = 0, order_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    ticket_id = Convert.ToInt64(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    customer_id = Convert.ToInt64(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    order_id = Convert.ToInt64(model.strValue3);

                DataTable dt = CustomerServiceRepository.CustomerTickets(ticket_id, customer_id, order_id, model.strValue4, model.strValue5, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        [Route("customer-service/ticket-info")]
        public JsonResult GetTicketInfo(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                long ticket_id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    ticket_id = Convert.ToInt64(model.strValue1);

                DataTable dt = CustomerServiceRepository.CustomerTicketInfo(ticket_id);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
    }
}