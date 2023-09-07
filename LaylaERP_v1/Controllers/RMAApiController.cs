using System;
using System.Collections.Generic;
using static LaylaERP.Models.Export_Details;
using LaylaERP.BAL;
using System.Data;
using System.Web.Http;
using System.Net;
using Newtonsoft.Json;
using System.Dynamic;
using System.Linq;
using Newtonsoft.Json.Linq;
using QuickfixSearch.Models.Product;
using LaylaERP.Models;
using System.IO;
using System.Drawing;
using System.Web.Hosting;
using LaylaERP.UTILITIES;

namespace LaylaERP_v1.Controllers
{
    [RoutePrefix("rmaapi")]
    public class RMAApiController : ApiController
    {
        [HttpGet, Route("orderdetails/{app_key}/{entity_id}")]
        public IHttpActionResult ProductDetails(string app_key, long entity_id, long order_id = 0)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (order_id == 0)
                {
                    return Ok(new { message = "Required query param 'order_id'", status = 500, code = "Internal Server Error", data = new List<string>() });
                }
                //else if (string.IsNullOrEmpty(email))
                //{
                //    return Ok(new { message = "Required query param 'email'", status = 500, code = "Internal Server Error", data = new List<string>() });
                //}
                else
                {
                    dynamic orderObj = new ExpandoObject();
                    dynamic itemObj = new ExpandoObject();

                    // Lists to hold item details
                    List<dynamic> itemList = new List<dynamic>();

                    DataSet ds = RMARepository.Getorderdetails("ORDINFO", entity_id,order_id,"");
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[1].Rows)
                        {
                            //order
                             
                            orderObj.ID = dr["order_id"];
                            orderObj.order_date = dr["date_created"];
                            orderObj.status = dr["status_desc"];
                            orderObj.payment_method = dr["payment_method"];
                            orderObj.order_total = dr["order_total"];
                            orderObj.order_details = !string.IsNullOrEmpty(dr["order_details"].ToString())
                                ? JsonConvert.DeserializeObject<dynamic>(dr["order_details"].ToString())
                                : JsonConvert.DeserializeObject<dynamic>("{}");
                        }
                        
                        foreach (DataRow dr in ds.Tables[2].Rows)
                         {
                            dynamic item = new ExpandoObject();
                            item.order_item = dr["order_item_id"];
                            item.item_name = dr["order_item_name"];
                            item.item_type = dr["order_item_type"];
                            item.p_id = dr["p_id"];
                            item.v_id = dr["v_id"];
                            item.qty = dr["qty"];
                            item.subtotal = dr["line_subtotal"];
                            item.total = dr["line_total"];
                            item.tax = dr["tax"];
                            item.discount_amount = dr["discount_amount"];
                            item.shipping_amount = dr["shipping_amount"];
                            item.free_itmes = dr["free_itmes"];
                            item.returndays = dr["returndays"];
                            item.warrantydays = dr["warrantydays"];
                            itemList.Add(item);
                        }
                        // Add the list of items to itemObj
                        //itemObj.items = itemList;

                        //// Create a single object that combines orderObj and itemObj
                        //dynamic combinedObj = new ExpandoObject();
                        //combinedObj.order = orderObj;
                        //combinedObj.items = itemObj.items;
                        orderObj.items = itemList;
                        return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = orderObj });
                    }
                    else
                        return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                }
            }
            catch (Exception ex)
            {
               // return InternalServerError(ex);
                return BadRequest("Bad Request");
            }
        }

        [HttpGet, Route("get-order/{app_key}/{entity_id}")]
        public IHttpActionResult Getorder(string app_key, string entity_id, string contact = "christison.quickfix@gmail.com",  string sort = "id", string direction = "desc")
        {
            try
            {
                int per_page = 0;
                int page = 0;
                if (string.IsNullOrEmpty(app_key) || entity_id == "0")
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }             
                else
                    {
                        string msg = string.Empty;
                        var balResult = RMARepository.Getorders(entity_id, contact, per_page.ToString(), page.ToString(), sort, direction, "LIST");                        
                        
                        List<dynamic> orderist = new List<dynamic>();
                        int total = balResult.Rows.Count;
                    if (total > 0)
                    {
                        List<PostModel> ReviewList = new List<PostModel>();
                        for (int i = 0; i < balResult.Rows.Count; i++)
                        {
                            dynamic orderObj = new ExpandoObject();
                            orderObj.id = balResult.Rows[i]["ID"].ToString();
                            orderObj.date_created = balResult.Rows[i]["post_date"].ToString();
                            orderObj.payment_method = balResult.Rows[i]["payment_method"].ToString();
                            //orderObj.total = balResult.Rows[i]["total"].ToString();                                
                            orderist.Add(orderObj);
                        }
                        return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = orderist });

                    }
                    else
                    {
                        return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                    }
                    }
                
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }

        public IHttpActionResult Getorder_Old(string app_key, string entity_id, int per_page = 10, int page = 1, string contact = "christison.quickfix@gmail.com", string sort = "id", string direction = "desc")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == "0")
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else
                {
                    string msg = string.Empty;
                    var balResult = RMARepository.Getorders(entity_id, contact, per_page.ToString(), page.ToString(), sort, direction, "LIST");
                    dynamic orderObj = new ExpandoObject();
                    List<dynamic> orderist = new List<dynamic>();
                    int total = balResult.Rows.Count;
                    if (total > 0)
                    {
                        List<Order> orders = new List<Order>(); // Create a list to store orders

                        for (int i = 0; i < balResult.Rows.Count; i++)
                        {
                            orderObj = new ExpandoObject(); // Create a new dynamic object for each order
                            orderObj.id = balResult.Rows[i]["ID"].ToString();
                            orderObj.date_created = balResult.Rows[i]["post_date"].ToString();
                            orderObj.payment_method = balResult.Rows[i]["payment_method"].ToString();
                            orderObj.total = balResult.Rows[i]["total"].ToString();
                            orderist.Add(orderObj);

                            // Create an Order object and populate it
                            Order order = new Order
                            {
                                Id = orderObj.id,
                                DateCreated = orderObj.date_created,
                                PaymentMethod = orderObj.payment_method
                                //Total = orderObj.total
                            };

                            orders.Add(order);
                        }

                        var responseData = new
                        {
                            orders = orders, // Wrapping the list of orders in an "orders" property
                            count = total // Adding the count property
                        };

                        return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = responseData });
                    }

                    else
                    {
                        return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                    }
                }

            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }

        [HttpGet, Route("send-otp/{app_key}/{entity_id}")]
        public IHttpActionResult Getotp(string app_key, string entity_id, string value = "christison.quickfix@gmail.com", string option = "email",string type = "OTP",long ID= 0, string OTP="123654")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == "0")
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else
                {
                    if (type == "OTP")
                    {
                        //string contact = "";
                        //if (option == "email")
                        //    contact = email;
                        //else
                        //    contact = phone;
                        string msg = string.Empty;
                        var balResult = RMARepository.getotp("I", value, option); 
                        int total = balResult;
                        if (total > 0)
                        {
                            return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = total });
                        }
                        else
                        {
                            return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                        }
                    }
                    else if(type == "verify")
                    {
                        string msg = string.Empty;
                        var balResult = RMARepository.getotpverify("SRH", ID, OTP);
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = OTP });
                        }
                        else
                        {
                            return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                        }
                    }
                    else
                        return Ok(new { message = "Please select valid type", status = 404, code = "Not Found", data = new { } });

                }

            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }


        [HttpPost, Route("orderimage/{app_key}/{entity_id}")]
        public IHttpActionResult UploadedFile(string app_key, long entity_id, string ticket_id, List<CustomerServiceFilesModel> files)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else
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
                            var originalDirectory = new DirectoryInfo(string.Format("{0}Content\\tickets\\", HostingEnvironment.MapPath(@"\")));

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
                                var height = 480; 
                                using (MemoryStream ms = new MemoryStream(bytes))
                                {
                                    var image = new Bitmap(ms);                                    
                                    image.Save(path);
                                }
                            }
                        }

                    }
                    return Ok("Images uploaded successfully.");
                }
            }
            catch (Exception ex)
            {
                return Ok("[]");
            }
        }

        [HttpPost, Route("generate-ticket/{app_key}/{entity_id}")]
        public IHttpActionResult GenerateOrderTicket(string app_key, long entity_id, CustomerServiceModel model)
        {
            try
            {               

                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (model == null)
                {
                    return Ok(new { message = "Required  param 'phone'", status = 500, code = "Unauthorized", data = new List<string>() });
                }
                else if (string.IsNullOrEmpty(model.json_data))
                {
                    return Ok(new { message = "Required param 'json_data'", status = 500, code = "Unauthorized", data = new List<string>() });
                }
                else
                { 
                    model.user_id = 2;
                    DataTable dt = CustomerServiceRepository.GenerateOrderTicket(model.json_data, model.user_id, "GENRMATICKET");
                    //JSONresult = JsonConvert.SerializeObject(dt);
                    if (dt.Rows.Count > 0)
                    {
                        if (dt.Rows[0]["response"].ToString() == "success")
                        {

                            dynamic datam = JsonConvert.DeserializeObject(model.json_data);
                            // Access the chat_history array
                            JArray chatHistorys = datam.chat_history;                            
                            string firstFrom = datam.chat_history[0].from;
                            string _body = $"Hi there {firstFrom}, we're sorry that you are having an issue with your Prosource Diesel product, and thank you for bringing it to our attention with your warranty request.<br/><br/>";
                            _body += "We will work diligently to get this resolved for you as soon as possible, and a Prosource Diesel warranty specialist will get back to you regarding your claim within 3 business days.<br/><br/>";
                            _body += "<b>Here is what happens next:</b><br/><br/>";
                            _body += "Warranty Claim Review: We will review your claim details, photos, and any other evidence submitted pertaining to your claim<br/><br/>";
                            _body += "Request for Additional Information (possible): If deemed necessary, we may reach out to you for further evidence and/or explanation of your warranty issue<br/><br/>";
                            _body += "Decision Rendered: We will inform you of the decision made on your warranty claim and advise you of next steps<br/><br/>";
                            _body += "Corrective Action: Contingent upon the approval of your claim, we will set a course of corrective action which may include replacing the product entirely, repairing the product, or replacing a component, or components, of the product<br/><br/>";
                            _body += "Again, we're sorry you're having a product issue and we are committed to resolving this as quickly and thoroughly as possible.<br/><br/><br/>";
                            _body += "<b>Chat History</b><br/><br/>";
                            foreach (JObject item in chatHistorys)
                            {
                                string from = item.Value<string>("from");
                                string content = item.Value<string>("content");
                                _body += $"<b>{from}:</b> {content}<br/>";
                            }
                            _body += $"<br/><b>Comment:</b> {datam.comment}<br/>";
                            _body += "<br/><b>Help Desk<br/>";
                            SendEmail.SendEmails_outer("david.quickfix1@gmail.com", "Prosource Diesel Warranty Information" + " (#" + dt.Rows[0]["id"].ToString() + ").", _body, string.Empty);
                        }
                    }
                    return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = dt.Rows[0]["id"].ToString() });
                    
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        //private static readonly string UploadDirectory = HostingEnvironment.MapPath("~/Content/tickets/");
        //[HttpPost]
        //public IHttpActionResult UploadImages(List<ImageModel> images)
        //{
        //    if (images == null || images.Count == 0)
        //    {
        //        return BadRequest("No images to upload.");
        //    }

        //    foreach (var image in images)
        //    {
        //        string filePath = Path.Combine(UploadDirectory, image.name);

        //        // You can save the image to the specified file path.
        //        // For simplicity, we'll just add it to a list.
        //        UploadedImages.Add(image);

        //        // You can also save the image data to the file.
        //        File.WriteAllBytes(filePath, image.Data);
        //    }

        //    return Ok("Images uploaded successfully.");
        //}
    }
}