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

        [HttpPost]
        [Route("userdetails")]
        public IHttpActionResult Userdetails(LoginModel model)
        {
            ResultModel result = new ResultModel();
            if (!model.id.HasValue)
            {
                return BadRequest("Please provide valid details.");
            }
            try
            {
                string msg = string.Empty;
                var balResult = UsersRepositry.UserInfo(model.id.Value);
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
        [Route("editaccountdetails")]
        public IHttpActionResult UserdetailsUpdate(LoginModel model)
        {
            ResultModel result = new ResultModel();
            if (model.id == 0)
            {
                result.success = false; result.error_msg = "Please provide valid details.";
                return Ok(result);
            }
            if (!string.IsNullOrEmpty(model.user_new_pass) && !string.IsNullOrEmpty(model.user_conf_pass))
            {
                if (model.user_new_pass != model.user_conf_pass)
                {
                    result.success = false; result.error_msg = "Error! confirm password field should be match with the password field.";
                    return Ok(result);
                }
            }
            try
            {
                string msg = string.Empty;
                var balResult = UsersRepositry.UserUpdate(model);
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
        public object GetOrders(SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0 && model.order_id == 0)
            {
                return BadRequest("Please provide valid details.");
            }
            try
            {
                var balResult = CommonRepositry.GetOrders(model.user_id, model.offset);
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
        public object GetUserOrderDetail(SearchModel model)
        {
            ResultModel result = new ResultModel();
            if (model.user_id == 0)
            {
                return BadRequest("Please provide valid details.");
            }
            try
            {
                var balResult = CommonRepositry.GetOrderDetail(model.user_id, model.order_id);
                balResult.Tables[0].TableName = "order_data";
                if (balResult.Tables.Count > 1) balResult.Tables[1].TableName = "order_items";
                if (balResult.Tables.Count > 2) balResult.Tables[2].TableName = "order_coupons";
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
    }
}