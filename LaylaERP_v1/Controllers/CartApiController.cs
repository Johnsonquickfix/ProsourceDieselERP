namespace LaylaERP_v1.Controllers
{
    using LaylaERP_v1.BAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Newtonsoft.Json;

    [RoutePrefix("cartapi")]
    public class CartApiController : ApiController
    {
        [HttpPost, Route("add-item/{app_key}/{entity_id}")]
        public IHttpActionResult AddItem(string app_key, long entity_id, string cart)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0;string session_id = string.Empty;
                if (headers.Contains("X-User-Id"))
                {
                    user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                }
                if (headers.Contains("X-Cart-Session-Id"))
                {
                    session_id = headers.GetValues("X-Cart-Session-Id").First();
                }
                return Ok(JsonConvert.DeserializeObject(CartRepository.AddItem(entity_id, user_id, session_id, cart)));

                //return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = new { } });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
