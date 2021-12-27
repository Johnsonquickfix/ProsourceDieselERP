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

    [RoutePrefix("api/account")]
    public class AccountController : BaseApiController
    {
        // GET api/Account/Login
        //[HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
      
        [HttpGet]
        [Route("login")]
        public IHttpActionResult Login(LoginModel model)
        {
            ResultModel result = new ResultModel();
            if (string.IsNullOrWhiteSpace(model.user_login) || string.IsNullOrWhiteSpace(model.user_pass))
            {
                return BadRequest();
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
        public IHttpActionResult Userdetails(LoginModel model)
        {
            ResultModel result = new ResultModel();
            if (!model.id.HasValue)
            {
                return BadRequest();
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

        [HttpPost]
        [Route("UserLogin")]
        public IHttpActionResult UserLogin([FromBody] LoginModel model, int id)
        {
            //LoginModel obj = UsersRepositry.VerifyUser(model.user_login, model.user_pass);
            //return obj;
            //if (string.IsNullOrWhiteSpace(model.user_login) || string.IsNullOrWhiteSpace(model.user_pass))
            //{
            //    return BadRequest();
            //}
            //try
            //{
                //var balResult = UsersRepositry.VerifyUser(model.user_login, model.user_pass);
               // string username = "", Password = "";
                if (model.user_login=="admin" && model.user_pass == "admin")
                {
                    return Ok("Success "+id+"");
                   
                }
                return BadRequest();
            //}
            //catch (Exception ex)
            //{
            //    return InternalServerError(ex);
            //}
        }
        [Route("getar")]
        public IHttpActionResult Get()
        {
            return Ok("This is a iActionResult");
        }
    }
}