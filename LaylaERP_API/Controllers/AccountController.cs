namespace LaylaERP_API.Controllers
{
    using Models;
    using BAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Microsoft.AspNet.Identity;
    using System.Data;
    using System.Data.SqlClient;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [RoutePrefix("api/account")]
    public class AccountController : BaseApiController
    {
        // GET api/Account/Login
        //[HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login(LoginModel model)
        {
            if (string.IsNullOrWhiteSpace(model.user_login) || string.IsNullOrWhiteSpace(model.user_pass))
            {
                return BadRequest("Please enter Email address and password.");
            }
            try
            {
                string msg = string.Empty;
                var balResult = UsersRepositry.UserVerify(model.user_login, model.user_pass);
                if (balResult == null)
                {
                    return BadRequest();
                }
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("userdetails")]
        public IHttpActionResult Userdetails([FromUri] SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                return BadRequest("Please provide valid details.");
            }
            try
            {
                string msg = string.Empty;
                var balResult = UsersRepositry.UserInfo(model.user_id);
                if (balResult == null)
                {
                    return BadRequest();
                }
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("editaccountdetails")]
        public IHttpActionResult UserdetailsUpdate(UserEditModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                return Ok(new { success = false, err_msg = "Please provide valid details." });
            }
            if (!string.IsNullOrEmpty(model.new_pwd) && !string.IsNullOrEmpty(model.conf_pwd))
            {
                if (model.new_pwd != model.conf_pwd)
                {
                    return Ok(new { success = false, err_msg = "Error! confirm password field should be match with the password field." });
                }
            }
            try
            {
                var balResult = UsersRepositry.UserUpdate(model);

                if (balResult == null)
                {
                    //return BadRequest();
                    return Ok(new { success = false, err_msg = "Error! something went wrong." });
                }
                return Ok(new { success = balResult.success, err_msg = balResult.error_msg, user_data = balResult.user_data });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("createuser")]
        public IHttpActionResult CreateUser(LoginModel model)
        {
            if (string.IsNullOrEmpty(model.user_login) || string.IsNullOrEmpty(model.user_pass))
            {
                return BadRequest("Please enter Email address and password.");
            }
            try
            {
                string msg = string.Empty;
                var balResult = UsersRepositry.CreateUser(model);
                if (balResult == null)
                {
                    return BadRequest();
                }
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("getorders")]
        public object GetOrders([FromUri] SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                return BadRequest("Please provide valid details.");
            }
            try
            {
                var balResult = CommonRepositry.GetOrders(model.user_id, model.offset, model.pagesize);
                if (balResult == null)
                {
                    return BadRequest();
                }
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("getuserorderdetail")]
        public object GetUserOrderDetail([FromUri] SearchModel model)
        {
            OrderDetailModel result = new OrderDetailModel();
            if (model.user_id == 0)
            {
                return BadRequest("Please provide valid user detail.");
            }
            try
            {
                //var balResult = CommonRepositry.GetOrderDetail(model.user_id, model.order_id);
                //balResult.Tables[0].TableName = "order_data";
                //if (balResult.Tables.Count > 1) balResult.Tables[1].TableName = "order_items";
                //if (balResult.Tables.Count > 2) balResult.Tables[2].TableName = "order_coupons";
                //if (balResult == null)
                //{
                //    return BadRequest();
                //}

                var balResult = CommonRepositry.GetOrderDetail(model.user_id, model.order_id);
                result.order_data = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(balResult.Tables[0]));
                if (balResult.Tables.Count > 1) result.order_items = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(balResult.Tables[1]));
                if (balResult.Tables.Count > 2) result.order_coupons = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(balResult.Tables[2]));

                if (result.order_data.Count > 0)
                {
                    result.success = true;
                    result.err_msg = "";
                }
                else
                {
                    result.success = false;
                    result.err_msg = "Record not found.";
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("redeemedgiftcards")]
        public IHttpActionResult GetUserGiftCard([FromUri] SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                return BadRequest("Please provide valid details.");
            }
            try
            {
                var balResult = CommonRepositry.GetGiftCards(model.user_id);
                result.user_data = balResult;
                result.success = balResult.Rows.Count > 0 ? true : false;
                result.error_msg = "";
                if (balResult == null)
                {
                    result.success = false;
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("getaddress")]
        public IHttpActionResult GetUserAddress([FromUri] SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                //return BadRequest("Please provide valid details.");
                result.user_data = "{}"; result.error_msg = "Please provide valid details.";
                return Ok(result);
            }
            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.GetUserAddress(model.user_id, "URADS")));
                if (balResult.Count > 0)
                {
                    result.user_data = balResult[0];
                    result.success = true;
                    result.error_msg = "";
                }
                else
                {
                    result.user_data = "{}";
                    result.success = false;
                    result.error_msg = "Record not found.";
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("getbillingaddress")]
        public IHttpActionResult GetUserBillingAddress([FromUri] SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                //return BadRequest("Please provide valid details.");
                result.user_data = "{}"; result.error_msg = "Please provide valid details.";
                return Ok(result);
            }
            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.GetUserAddress(model.user_id, "UBADS")));
                return Ok(balResult[0]);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("getshippingaddress")]
        public IHttpActionResult GetUsershippingAddress([FromUri] SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                //return BadRequest("Please provide valid details.");
                result.user_data = "{}"; result.error_msg = "Please provide valid details.";
                return Ok(result);
            }
            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.GetUserAddress(model.user_id, "USADS")));
                return Ok(balResult[0]);
                //if (balResult.Count > 0)
                //{
                //    result.user_data = balResult[0];
                //    result.success = true;
                //    result.error_msg = "";
                //}
                //else
                //{
                //    result.user_data = "{}";
                //    result.success = false;
                //    result.error_msg = "Record not found.";
                //}
                //return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("updateshippingaddress")]
        public IHttpActionResult UpdateShippingAddress(UserShippingModel model)
        {
            if (model.user_id == 0)
            {
                return Ok(new { success = false, msg = "Error! Please provide user id.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.shipping_first_name))
            {
                return Ok(new { success = false, msg = "Error! Please provide first_name.", userdata = "{}" }); 
            }
            else if (string.IsNullOrEmpty(model.shipping_last_name))
            {
                return Ok(new { success = false, msg = "Error! Please provide last name.", userdata = "{}" }); 
            }
            else if (string.IsNullOrEmpty(model.shipping_country))
            {
                return Ok(new { success = false, msg = "Error! Please provide country.", userdata = "{}" }); 
            }
            else if (string.IsNullOrEmpty(model.shipping_address_1))
            {
                return Ok(new { success = false, msg = "Error! Please provide shipping address.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.shipping_city))
            {
                return Ok(new { success = false, msg = "Error! Please provide city.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.shipping_state))
            {
                return Ok(new { success = false, msg = "Error! Please provide state.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.shipping_postcode))
            {
                return Ok(new { success = false, msg = "Error! Please provide postcode.", userdata = "{}" });
            }

            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.UpdateShippingAddress(model)));
                if (balResult == null)
                {
                    return Ok(new { success = false, msg = "Error! something went wrong.", userdata = "{}" });
                }
                return Ok(new { success = true, msg = "Shipping address updated successfully!", userdata = balResult[0] });
            }
            catch (Exception ex)
            {
                //return InternalServerError(ex);
                return Ok(new { success = false, msg = ex.Message, userdata = "{}" });
            }
        }

        [HttpPost]
        [Route("updatebillingaddress")]
        public IHttpActionResult UpdateBillingAddress(UserBillingModel model)
        {
            if (model.user_id == 0)
            {
                return Ok(new { success = false, msg = "Error! Please provide user id.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_first_name))
            {
                return Ok(new { success = false, msg = "Error! Please provide first_name.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_last_name))
            {
                return Ok(new { success = false, msg = "Error! Please provide last name.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_country))
            {
                return Ok(new { success = false, msg = "Error! Please provide country.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_address_1))
            {
                return Ok(new { success = false, msg = "Error! Please provide shipping address.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_city))
            {
                return Ok(new { success = false, msg = "Error! Please provide city.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_state))
            {
                return Ok(new { success = false, msg = "Error! Please provide state.", userdata = "{}" });
            }
            else if (string.IsNullOrEmpty(model.billing_postcode))
            {
                return Ok(new { success = false, msg = "Error! Please provide postcode.", userdata = "{}" });
            }

            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.UpdateBillingAddress(model)));
                if (balResult == null)
                {
                    return Ok(new { success = false, msg = "Error! something went wrong.", userdata = "{}" });
                }
                return Ok(new { success = true, msg = "Billing address updated successfully!", userdata = balResult[0] });
                //var balResult = CommonRepositry.UpdateBillingAddress(model);
                //if (balResult == null)
                //{
                //    return BadRequest();
                //}
                //return Ok(balResult);
            }
            catch (Exception ex)
            {
                //return InternalServerError(ex);
                return Ok(new { success = false, msg = ex.Message, userdata = "{}" });
            }
        }
    }
}