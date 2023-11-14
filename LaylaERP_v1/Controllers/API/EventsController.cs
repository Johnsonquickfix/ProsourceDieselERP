namespace LaylaERP.Controllers.API
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Models.qfk;
    using Models.qfk.Audience;
    using BAL.qfk;
    using UTILITIES;

    [RoutePrefix("api/events")]
    public class EventsController : ApiController
    {
        [HttpPost]
        public IHttpActionResult CreateProfile(EventRequest model)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string app_key = string.Empty;
                if (headers.Contains("API-Key")) app_key = headers.GetValues("API-Key").First();

                if (string.IsNullOrEmpty(app_key)) return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = "Authentication credentials were not provided. Missing `API-Key` header." });
                else if (model == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. Request bodies are required for POST requests." });
                else if (model.Data == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. An object with data is required." });
                else if (model.Data.Attributes == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. `attributes` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Properties == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. `properties` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Metric == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. `metric` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Metric.Data == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. metric `name` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Metric.Data.Attributes == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. metric `name` is a required field for the resource 'event'." });
                else if (string.IsNullOrEmpty(model.Data.Attributes.Metric.Data.Attributes.Name)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. metric `name` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Profile == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. `profile` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Profile.Data == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. Profile `email` or `id` is a required field for the resource 'event'." });
                else if (model.Data.Attributes.Profile.Data.Attributes == null) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. Profile `email` or `id` is a required field for the resource 'event'." });
                else if (string.IsNullOrEmpty(model.Data.Attributes.Profile.Data.Attributes.Email)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. Profile `email` or `id` is a required field for the resource 'event'." });
                //else if (string.IsNullOrEmpty(model.Data.Attributes.Profile.Data.Attributes.Email) && string.IsNullOrEmpty(model.Data.Attributes.Profile.Data.Attributes.ID)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "Invalid input. Profile `email` or `id` is a required field for the resource 'event'." });

                //else if (string.IsNullOrEmpty(app_key)) return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = "Authentication credentials were not provided. Missing `API-Key` header." });
                //else if (string.IsNullOrEmpty(model.Data.Attributes.Email)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "'email' is a required field for this call." });

                ////model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("create-profile", app_key, 1, "", JsonConvert.SerializeObject(model)));
                dynamic result = JsonConvert.DeserializeObject<dynamic>(ProfilesRepository.ProfileCreate("create-activities", app_key, 1, "", JsonConvert.SerializeObject(model)));
                if (result.status != null) return Content((HttpStatusCode)result.status, result);
                else return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
