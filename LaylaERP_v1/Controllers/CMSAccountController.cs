namespace LaylaERP_v1.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using System.Data;
    using System.Data.SqlClient;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using LaylaERP.BAL;

    [RoutePrefix("cmsaccountapi")]
    public class AccountController : ApiController
    {
        [HttpGet, Route("login")]
        public IHttpActionResult Login(string user_login = "", string user_pass = "")
        {
            if (string.IsNullOrWhiteSpace(user_login) || string.IsNullOrWhiteSpace(user_pass))
            {
                return Ok(new { message = "Please enter Email address and password.", status = 401, code = "Unauthorized", data = new { } });
            }
            try
            {
                string msg = string.Empty;
                var balResult = CMSRepository.UserVerify(user_login, user_pass);
                if (balResult == null)
                {
                    return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                }
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "internal_server_error", data = new { } });
            }
        }

        //[HttpPost]
        //[Route("userdetails")]
        //public IHttpActionResult Userdetails(LoginModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (!model.id.HasValue)
        //    {
        //        return BadRequest("Please provide valid details.");
        //    }
        //    try
        //    {
        //        string msg = string.Empty;
        //        var balResult = UsersRepositry.UserInfo(model.id.Value);
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("editaccountdetails")]
        //public IHttpActionResult UserdetailsUpdate(LoginModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.id == 0)
        //    {
        //        result.success = false; result.error_msg = "Please provide valid details.";
        //        return Ok(result);
        //    }
        //    if (!string.IsNullOrEmpty(model.user_new_pass) && !string.IsNullOrEmpty(model.user_conf_pass))
        //    {
        //        if (model.user_new_pass != model.user_conf_pass)
        //        {
        //            result.success = false; result.error_msg = "Error! confirm password field should be match with the password field.";
        //            return Ok(result);
        //        }
        //    }
        //    try
        //    {
        //        string msg = string.Empty;
        //        var balResult = UsersRepositry.UserUpdate(model);
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("createuser")]
        //public IHttpActionResult CreateUser(LoginModel model)
        //{
        //    if (string.IsNullOrEmpty(model.user_login) || string.IsNullOrEmpty(model.user_pass))
        //    {
        //        return BadRequest("Please enter Email address and password.");
        //    }
        //    try
        //    {
        //        string msg = string.Empty;
        //        var balResult = UsersRepositry.CreateUser(model);
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpPost]
        //[Route("getorders")]
        //public object GetOrders(SearchModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.user_id == 0 && model.order_id == 0)
        //    {
        //        return BadRequest("Please provide valid details.");
        //    }
        //    try
        //    {
        //        var balResult = CommonRepositry.GetOrders(model.user_id, model.offset);
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpPost]
        //[Route("getuserorderdetail")]
        //public object GetUserOrderDetail(SearchModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.user_id == 0)
        //    {
        //        return BadRequest("Please provide valid user detail.");
        //    }
        //    try
        //    {
        //        var balResult = CommonRepositry.GetOrderDetail(model.user_id, model.order_id);
        //        balResult.Tables[0].TableName = "order_data";
        //        if (balResult.Tables.Count > 1) balResult.Tables[1].TableName = "order_items";
        //        if (balResult.Tables.Count > 2) balResult.Tables[2].TableName = "order_coupons";
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("redeemedgiftcards")]
        //public IHttpActionResult GetUserGiftCard(SearchModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.user_id == 0)
        //    {
        //        return BadRequest("Please provide valid details.");
        //    }
        //    try
        //    {
        //        var balResult = CommonRepositry.GetGiftCards(model.user_id);
        //        result.user_data = balResult;
        //        result.success = balResult.Rows.Count > 0 ? true : false;
        //        result.error_msg = "";
        //        if (balResult == null)
        //        {
        //            result.success = false;
        //        }
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("getaddress")]
        //public IHttpActionResult GetUserAddress(SearchModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.user_id == 0)
        //    {
        //        return BadRequest("Please provide valid details.");
        //    }
        //    try
        //    {
        //        var balResult = CommonRepositry.GetUserAddress(model.user_id, "URADS");
        //        result.user_data = balResult;
        //        result.success = balResult.Rows.Count > 0 ? true : false;
        //        result.error_msg = "";
        //        if (balResult == null)
        //        {
        //            result.success = false;
        //        }
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("getbillingaddress")]
        //public IHttpActionResult GetUserBillingAddress(SearchModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.user_id == 0)
        //    {
        //        return BadRequest("Please provide valid details.");
        //    }
        //    try
        //    {
        //        var balResult = CommonRepositry.GetUserAddress(model.user_id, "UBADS");
        //        result.user_data = balResult;
        //        result.success = balResult.Rows.Count > 0 ? true : false;
        //        result.error_msg = "";
        //        if (balResult == null)
        //        {
        //            result.success = false;
        //        }
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("getshippingaddress")]
        //public IHttpActionResult GetUsershippingAddress(SearchModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    if (model.user_id == 0)
        //    {
        //        return BadRequest("Please provide valid details.");
        //    }
        //    try
        //    {
        //        var balResult = CommonRepositry.GetUserAddress(model.user_id, "USADS");
        //        result.user_data = balResult;
        //        result.success = balResult.Rows.Count > 0 ? true : false;
        //        result.error_msg = "";
        //        if (balResult == null)
        //        {
        //            result.success = false;
        //        }
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("updateshippingaddress")]
        //public IHttpActionResult UpdateShippingAddress(UserShippingModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    result.success = false; result.user_data = 0;
        //    if (model.user_id == 0)
        //    {
        //        result.error_msg = "Please provide user id."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_first_name))
        //    {
        //        result.error_msg = "Please provide first_name."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_last_name))
        //    {
        //        result.error_msg = "Please provide last name."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_country))
        //    {
        //        result.error_msg = "Please provide country."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_address_1))
        //    {
        //        result.error_msg = "Please provide shipping address."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_city))
        //    {
        //        result.error_msg = "Please provide city."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_state))
        //    {
        //        result.error_msg = "Please provide state."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.shipping_postcode))
        //    {
        //        result.error_msg = "Please provide postcode."; return Ok(result);
        //    }

        //    try
        //    {
        //        var balResult = CommonRepositry.UpdateShippingAddress(model);
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}

        //[HttpGet]
        //[Route("updatebillingaddress")]
        //public IHttpActionResult UpdateBillingAddress(UserBillingModel model)
        //{
        //    ResultModel result = new ResultModel();
        //    result.success = false; result.user_data = 0;
        //    if (model.user_id == 0)
        //    {
        //        result.error_msg = "Please provide user id."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_first_name))
        //    {
        //        result.error_msg = "Please provide first_name."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_last_name))
        //    {
        //        result.error_msg = "Please provide last name."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_country))
        //    {
        //        result.error_msg = "Please provide country."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_address_1))
        //    {
        //        result.error_msg = "Please provide shipping address."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_city))
        //    {
        //        result.error_msg = "Please provide city."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_state))
        //    {
        //        result.error_msg = "Please provide state."; return Ok(result);
        //    }
        //    else if (string.IsNullOrEmpty(model.billing_postcode))
        //    {
        //        result.error_msg = "Please provide postcode."; return Ok(result);
        //    }

        //    try
        //    {
        //        var balResult = CommonRepositry.UpdateBillingAddress(model);
        //        if (balResult == null)
        //        {
        //            return BadRequest();
        //        }
        //        return Ok(balResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}
    }
}