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

namespace LaylaERP_v1.Controllers
{
    [RoutePrefix("rmaapi")]
    public class RMAApiController : ApiController
    {
        [HttpGet, Route("orderdetails/{app_key}/{entity_id}")]
        public IHttpActionResult ProductDetails(string app_key, long entity_id, long order_id = 0, string email = "christison.quickfix@gmail.com")
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
                else if (string.IsNullOrEmpty(email))
                {
                    return Ok(new { message = "Required query param 'email'", status = 500, code = "Internal Server Error", data = new List<string>() });
                }
                else
                {
                    dynamic orderObj = new ExpandoObject();
                    dynamic itemObj = new ExpandoObject();

                    // Lists to hold item details
                    List<dynamic> itemList = new List<dynamic>();

                    DataSet ds = RMARepository.Getorderdetails("ORDINFO", entity_id,order_id,email);
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
    }
}