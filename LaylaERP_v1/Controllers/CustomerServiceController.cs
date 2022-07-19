using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
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
                long oid = 0, ticketid = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) { oid = Convert.ToInt64(model.strValue1); }
                if (string.IsNullOrEmpty(model.strValue2)) { model.strValue2 = "ORDINFO"; }
                else if (model.strValue2 == "TICKET")
                {
                    model.strValue2 = "TICKETITEM";
                    ticketid = oid;
                }
                if (oid <= 0)
                {
                    throw new Exception("Invalid Data");
                }
                DataSet ds = CustomerServiceRepository.GetOrderInfo(oid, ticketid, model.strValue2);
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        [Route("customer-service/generate-ticket")]
        public JsonResult GenerateOrderTicket(CustomerServiceModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(model.json_data))
                {
                    model.user_id = CommanUtilities.Provider.GetCurrent().UserID;
                    DataTable dt = CustomerServiceRepository.GenerateOrderTicket(model.json_data, model.user_id, "GENTICKET");
                    JSONresult = JsonConvert.SerializeObject(dt);
                    if (dt.Rows.Count > 0)
                    {
                        if (dt.Rows[0]["response"].ToString() == "success")
                        {
                            UploadedFile(dt.Rows[0]["id"].ToString(), model.files);
                            SendEmail.SendEmails_outer(model.receipient_email, model.subject + " (#" + dt.Rows[0]["id"].ToString() + ").", model.body, string.Empty);
                        }
                    }
                }
                else { JSONresult = "[{\"id\":0,\"response\":\"Please select product.\"}]"; }
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        [Route("customer-service/ticket-action")]
        public JsonResult TicketAction(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(model.strValue1))
                {
                    long user_id = CommanUtilities.Provider.GetCurrent().UserID;
                    DataTable dt = CustomerServiceRepository.GenerateOrderTicket(model.strValue1, user_id, "TICKETACT");
                    JSONresult = JsonConvert.SerializeObject(dt);
                }
                else { JSONresult = "[{\"id\":0,\"response\":\"Please select action.\"}]"; }
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

        #region Order Ticket Action
        [HttpPost]
        [Route("customer-service/create-order-return")]
        public JsonResult CreateOrderReturn(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_refunded_by", meta_value = om.UserID.ToString() });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_ticket_id", meta_value = model.ticket_id.ToString() });

                int result = OrdersMySQLController.MySQLSaveRefundOrder(model);
                if (result > 0)
                {
                    string json_data = "{\"ticket_id\":" + model.ticket_id.ToString() + ",\"new_order_id\":" + model.new_order_id.ToString() + ", \"is_confirmed_by_vendor\":0 , \"ticket_is_open\":0 }";
                    CustomerServiceRepository.GenerateOrderTicket(json_data, om.UserID, "TICKETCLOSE");

                    //DAL.SQLHelper.ExecuteNonQuery("update erp_product_warranty_chats set ticket_is_open = 0 where id = " + model.ticket_id.ToString());
                    status = true; JSONresult = "Order placed successfully.";
                }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message }, 0); }
            return Json(new { status = status, message = JSONresult }, 0);
        }

        [HttpPost]
        [Route("customer-service/create-order-replacement")]
        public JsonResult CreateOrderReplacement(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_order_type", meta_value = "Replacement" });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_refunded_by", meta_value = om.UserID.ToString() });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_ticket_id", meta_value = model.ticket_id.ToString() });

                int result = OrdersMySQLController.MySQLSaveReplacementOrder(model);
                if (result > 0)
                {
                    string json_data = "{\"ticket_id\":" + model.ticket_id.ToString() + ",\"new_order_id\":" + model.new_order_id.ToString() + ", \"is_confirmed_by_vendor\":0 , \"ticket_is_open\":0 }";
                    CustomerServiceRepository.GenerateOrderTicket(json_data, om.UserID, "TICKETCLOSE");

                    //DAL.SQLHelper.ExecuteNonQuery("update erp_product_warranty_chats set ticket_is_open = 0 where id = " + model.ticket_id.ToString());
                    status = true; JSONresult = "Order placed successfully.";
                }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message }, 0); }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        #endregion

        public void UploadedFile(string ticket_id, List<CustomerServiceFilesModel> files)
        {
            try
            {
                //loop through all the files
                foreach (var file in files)
                {
                    var filetype = "png";
                    if (file.dataURL.StartsWith("data:image/jpeg;base64")) filetype = "jpeg";
                    else if (file.dataURL.StartsWith("data:image/png;base64")) filetype = "png";
                    else if (file.dataURL.StartsWith("data:image/jpg;base64")) filetype = "jpg";


                    file.dataURL = file.dataURL.Replace("data:image/jpeg;base64,", "");
                    file.dataURL = file.dataURL.Replace("data:image/png;base64,", "");
                    file.dataURL = file.dataURL.Replace("data:image/jpg;base64,", "");
                    //Save file content goes here
                    //if (file != null && file.ContentLength > 0)
                    {
                        var originalDirectory = new DirectoryInfo(string.Format("{0}Content\\tickets\\", Server.MapPath(@"\")));

                        string pathString = System.IO.Path.Combine(originalDirectory.ToString(), ticket_id);

                        bool isExists = System.IO.Directory.Exists(pathString);

                        if (!isExists)
                            System.IO.Directory.CreateDirectory(pathString);

                        var path = string.Format("{0}\\{1}", pathString, file.name);
                        //file.SaveAs(path);
                        byte[] bytes = Convert.FromBase64String(file.dataURL);

                        if (filetype == "png")
                        {
                            Image image;
                            using (MemoryStream ms = new MemoryStream(bytes))
                            {
                                image = Image.FromStream(ms);
                            }
                            image.Save(path);
                        }
                        else if (filetype == "jpeg" || filetype == "jpg")
                        {
                            int width = 480;
                            var height = 480; //succeeds at 65499, 65500

                            //var image = new Bitmap(width, height);
                            //Image image;
                            using (MemoryStream ms = new MemoryStream(bytes))
                            {
                                var image = new Bitmap(ms);
                                //image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                                //image = Image.FromStream(ms);
                                image.Save(path);
                            }
                            

                            //MemoryStream ms = new MemoryStream(bytes, 0, bytes.Length);

                            //System.Drawing.Bitmap bitmap = (System.Drawing.Bitmap)Image.FromStream(ms);
                            
                            //ms.Close();

                            //bitmap.Save(path, System.Drawing.Imaging.ImageFormat.Jpeg);
                        }
                    }

                }

            }
            catch (Exception ex)
            {
            }
        }

        #region Order Ticket Action [Create New Order]
        [HttpPost]
        [Route("customer-service/product-components")]
        public JsonResult GetProductComponent(CustomerServiceModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable ds = CustomerServiceRepository.CustomerTicketInfo(model.ticket_id, 0, "PROCOMPONENT");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        [Route("customer-service/create-component-order")]
        public JsonResult CreateComponentOrders(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false; long result = 0;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                string host = Request.ServerVariables["HTTP_ORIGIN"];
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_tax_api", meta_value = "avatax" });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_id", meta_value = om.UserID.ToString() });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_name", meta_value = om.UserName.ToString() });

                result = OrdersMySQLController.SaveComponentOrders(host, model);
                if (result > 0)
                {
                    string json_data = "{\"ticket_id\":" + model.ticket_id.ToString() + ",\"new_order_id\":" + result.ToString() + ", \"is_confirmed_by_vendor\":0 , \"ticket_is_open\":0 }";
                    CustomerServiceRepository.GenerateOrderTicket(json_data, om.UserID, "TICKETCLOSE");
                    status = true; JSONresult = "Order placed successfully.";
                }
                //status = true; JSONresult = "Order placed successfully.";
            }
            catch { }
            return Json(new { id = result, status = status, message = JSONresult }, 0);
        }
        #endregion
    }
}