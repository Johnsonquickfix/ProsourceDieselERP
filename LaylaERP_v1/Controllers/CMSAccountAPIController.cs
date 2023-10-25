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
    using LaylaERP_v1.BAL;
    using System.Threading.Tasks;

    [RoutePrefix("cmsaccountapi")]
    public class CMSAccountAPIController : ApiController
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
                var balResult = CartRepository.UserVerify(user_login, user_pass);
                if (balResult == null)
                {
                    return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                }
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "internal_server_error", data = new { } });
            }
        }
        [HttpGet, Route("logout")]
        public IHttpActionResult Login()
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken)) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new { } });

                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.Logout(utoken));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("userdetails")]
        public IHttpActionResult Userdetails(long user_id = 0)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken)) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new { } });
                if (string.IsNullOrEmpty(utoken) && user_id <= 0) return Ok(new { message = "Required query param 'user_id'", status = 403, code = "Forbidden", data = new { } });

                string msg = string.Empty;
                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.UserInfo("UINFO", utoken, user_id));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("updateuser")]
        public IHttpActionResult UpdateUser(long user_id = 0, string first_name = "", string last_name = "", string display_name = "", string user_email = "", string new_password = "")
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken) && user_id <= 0) return Ok(new { message = "Required query param 'user_id'", status = 403, code = "Forbidden", data = new { } });

                //if (!string.IsNullOrEmpty(model.user_new_pass) && !string.IsNullOrEmpty(model.user_conf_pass))
                //{
                //    if (model.user_new_pass != model.user_conf_pass)
                //    {
                //        result.success = false; result.error_msg = "Error! confirm password field should be match with the password field.";
                //        return Ok(result);
                //    }
                //}
                string msg = string.Empty;
                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.UpdateUser(utoken, user_id, first_name, last_name, display_name, user_email, new_password));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("getaddress")]
        public IHttpActionResult GetUserAddress(long user_id = 0)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken)) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new { } });
                if (string.IsNullOrEmpty(utoken) && user_id <= 0) return Ok(new { message = "Required query param 'user_id'", status = 403, code = "Forbidden", data = new { } });

                string msg = string.Empty;
                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.UserInfo("address", utoken, user_id));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("createuser")]
        public async Task<IHttpActionResult> CreateUser(string user_login, string user_email, string user_pass)
        {
            try
            {
                if (string.IsNullOrEmpty(user_login)) return Ok(new { message = "Required query param 'user_login'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(user_email)) return Ok(new { message = "Required query param 'user_email'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(user_pass)) return Ok(new { message = "Required query param 'user_pass'", status = 403, code = "Forbidden", data = new { } });
                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.CreateUser(user_login, user_email, user_pass));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                if (balResult.status == 200)
                {
                    LaylaERP.Models.EmailSettingModel obj = new LaylaERP.Models.EmailSettingModel();
                    obj.recipients = user_login;
                    obj.email_heading = "Welcome to Prosource Diesel";
                    obj.additional_content = balResult.data.user_activation_key;
                    obj.filename = "EmailVerified";
                    string renderedHTML = LaylaERP.Controllers.EmailNotificationsController.RenderViewToString("EmailNotifications", obj.filename, obj);
                    await Task.Run(() =>
                    {
                        LaylaERP.UTILITIES.SendEmail.Sendattachmentemails(user_email, "Welcome to Prosource Diesel", renderedHTML, new List<System.Net.Mail.Attachment>());
                    });
                    return Ok(new { message = "An email has been sent for verification. It may take upto 10 minutes to appear or it may land up in your spam folder.", status = 200, code = "success", data = new { } });
                }
                else return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("email-verify")]
        public IHttpActionResult UserEmailVarify(string verify_code)
        {
            try
            {
                if (string.IsNullOrEmpty(verify_code)) return Ok(new { message = "Required query param 'verify_code'", status = 403, code = "Forbidden", data = new { } });

                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.UserEmailVarify("email-verify", string.Empty, verify_code));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("forgot-password")]
        public async Task<IHttpActionResult> ForgotPassword(string user_email)
        {
            try
            {
                if (string.IsNullOrEmpty(user_email)) return Ok(new { message = "Required query param 'user_email'", status = 403, code = "Forbidden", data = new { } });
                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.UserEmailVarify("forgot-password", user_email, string.Empty));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                if (balResult.status == 200)
                {
                    LaylaERP.Models.EmailSettingModel obj = new LaylaERP.Models.EmailSettingModel();
                    obj.recipients = balResult.data.user_login;
                    obj.option_name = balResult.data.base_url;
                    obj.email_heading = "Prosource Diesel Password Reset";
                    obj.additional_content = balResult.data.user_activation_key;
                    obj.filename = "ForgotPassword";
                    string renderedHTML = LaylaERP.Controllers.EmailNotificationsController.RenderViewToString("EmailNotifications", obj.filename, obj);
                    await Task.Run(() =>
                    {
                        LaylaERP.UTILITIES.SendEmail.Sendattachmentemails(user_email, obj.email_heading, renderedHTML, new List<System.Net.Mail.Attachment>());
                    });
                    return Ok(new { message = "An email has been sent for reset password. It may take upto 10 minutes to appear or it may land up in your spam folder.", status = 200, code = "success", data = new { } });
                }
                else return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("update-password")]
        public IHttpActionResult UpdatePassword(string user_email, string verify_code, string user_pass)
        {
            try
            {
                if (string.IsNullOrEmpty(verify_code)) return Ok(new { message = "Required query param 'verify_code'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(user_email)) return Ok(new { message = "Required query param 'user_email'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(user_pass)) return Ok(new { message = "Required query param 'user_pass'", status = 403, code = "Forbidden", data = new { } });

                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.UserEmailVarify("update-password", user_email, verify_code, user_pass));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }

        [HttpGet, Route("getorders")]
        public IHttpActionResult GetOrders(long user_id = 0, int page = 1, int page_size = 10)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken)) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new { } });
                if (string.IsNullOrEmpty(utoken) && user_id <= 0) return Ok(new { message = "Required query param 'user_id'", status = 403, code = "Forbidden", data = new { } });

                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.GetOrders(utoken, user_id, page, page_size));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message, status = 500, code = "Internal Server Error", data = new { } });
            }
        }
        [HttpGet, Route("getorderdetail")]
        public IHttpActionResult GetOrderDetail(long order_id = 0)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken)) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new { } });
                else if (order_id <= 0) return Ok(new { message = "Required query param 'order_id'", status = 403, code = "Forbidden", data = new { } });

                //var balResult = CommonRepositry.GetOrderDetail(model.user_id, model.order_id);
                var balResult = JsonConvert.DeserializeObject<dynamic>(CartRepository.GetOrderDetail(utoken, order_id));
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("updateaddress")]
        public IHttpActionResult UpdateUserAddress(string flag = "shipping", string first_name = "", string last_name = "", string company = "", string address_1 = "", string address_2 = "", string phone = "", string email = "", string city = "", string state = "", string country = "", string postcode = "")
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string utoken = string.Empty;
                if (headers.Contains("X-Utoken")) utoken = headers.GetValues("X-Utoken").First();
                if (string.IsNullOrEmpty(utoken)) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new { } });

                //if (model.user_id == 0) result.error_msg = "Please provide user id."; return Ok(result);
                if (string.IsNullOrEmpty(first_name)) return Ok(new { message = "Required query param 'first_name'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(last_name)) return Ok(new { message = "Required query param 'last_name'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(company)) return Ok(new { message = "Required query param 'company'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(address_1)) return Ok(new { message = "Required query param 'address_1'", status = 403, code = "Forbidden", data = new { } });
                //else if (string.IsNullOrEmpty(address_2)) return Ok(new { message = "Required query param 'address_2'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(phone)) return Ok(new { message = "Required query param 'phone'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(email)) return Ok(new { message = "Required query param 'email'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(state)) return Ok(new { message = "Required query param 'state'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(city)) return Ok(new { message = "Required query param 'city'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(country)) return Ok(new { message = "Required query param 'country'", status = 403, code = "Forbidden", data = new { } });
                else if (string.IsNullOrEmpty(postcode)) return Ok(new { message = "Required query param 'postcode'", status = 403, code = "Forbidden", data = new { } });
                if (flag.ToLower().Equals("shipping")) flag = "USADU";
                else if (flag.ToLower().Equals("billing")) flag = "UBADU";
                else return Ok(new { message = "Invalid param 'flag'", status = 403, code = "Forbidden", data = new { } });

                var balResult = CartRepository.UpdateUserAddress(flag,utoken, first_name, last_name, company, address_1, address_2, phone, email, city, state, country, postcode);
                if (balResult == null) return Ok(new { message = "Not Found", status = 404, code = "not_found", data = new { } });
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


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