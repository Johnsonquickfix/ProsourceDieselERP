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

    [RoutePrefix("api/profiles")]
    public class ProfilesController : ApiController
    {
        [HttpPost]
        public IHttpActionResult CreateProfile(PeopleRequest model)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string app_key = string.Empty;
                if (headers.Contains("API-Key")) app_key = headers.GetValues("API-Key").First();

                if (string.IsNullOrEmpty(app_key)) return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = "Authentication credentials were not provided. Missing `API-Key` header." });
                else if (string.IsNullOrEmpty(model.Data.Attributes.Email)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "'email' is a required field for this call." });

                //model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("create-profile", app_key, 1, "", JsonConvert.SerializeObject(model)));
                dynamic result = JsonConvert.DeserializeObject<dynamic>(ProfilesRepository.ProfileCreate("create-profile", app_key, 1, "", JsonConvert.SerializeObject(model)));
                if (result.status != null) return Content((HttpStatusCode)result.status, result);
                else return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("{id}")]
        public IHttpActionResult GetProfile(string id = "")
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string app_key = string.Empty;
                if (headers.Contains("API-Key")) app_key = headers.GetValues("API-Key").First();
                if (string.IsNullOrEmpty(app_key)) return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = "Authentication credentials were not provided. Missing `API-Key` header." });
                else if (string.IsNullOrEmpty(id)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "'id' is a required field for this call." });
                //else if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(email) && string.IsNullOrEmpty(phone_number)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "'id' or 'email' or 'phone_number' is a required field for this call." });

                //PeopleRequest model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("get-profile", app_key, 1, id, string.Empty));
                dynamic result = JsonConvert.DeserializeObject<dynamic>(ProfilesRepository.ProfileCreate("get-profile", app_key, 1, id, string.Empty));
                if (result.status != null) return Content((HttpStatusCode)result.status, result);
                else return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpPatch, Route("{id}")]
        public IHttpActionResult UpdateProfile(PeopleRequest model, string id = "")
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string app_key = string.Empty;
                if (headers.Contains("API-Key")) app_key = headers.GetValues("API-Key").First();

                if (string.IsNullOrEmpty(app_key)) return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = "Authentication credentials were not provided. Missing `API-Key` header." });
                else if (string.IsNullOrEmpty(model.Data.PeopleId)) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "'id' is a required field for this call." });
                else if (model.Data.Attributes.Email != null)
                    if (model.Data.Attributes.Email.Trim() == string.Empty) return Content(HttpStatusCode.BadRequest, new { status = 400, code = "invalid", message = "'email' is a required field for this call." });

                //model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("update-profile", app_key, 1, id, JsonConvert.SerializeObject(model)));
                dynamic result = JsonConvert.DeserializeObject<dynamic>(ProfilesRepository.ProfileCreate("update-profile", app_key, 1, id, JsonConvert.SerializeObject(model)));
                if (result.status != null) return Content((HttpStatusCode)result.status, result);
                else return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPatch, Route("add-custom-property")]
        public IHttpActionResult AddCustomProperty(PeopleCustomProperty model)
        {
            try
            {
                //OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                if (string.IsNullOrEmpty(model.PeopleId)) return BadRequest("'profile_id' is a required field.");
                else if (string.IsNullOrEmpty(model.MetaKey)) return BadRequest("'meta_key' is a required field.");
                else if (string.IsNullOrEmpty(model.MetaValue)) return BadRequest("'meta_value' is a required field.");
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(ProfilesRepository.ProfileCreate("add-properties", "", 1, model.PeopleId, JsonConvert.SerializeObject(model)));
                if (obj == null) return BadRequest("Invalid details.");
                else return Ok(new { status = true, data = obj });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete, Route("delete-custom-property")]
        public IHttpActionResult DeletedCustomProperty(PeopleCustomProperty model)
        {
            try
            {
                //OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                if (string.IsNullOrEmpty(model.PeopleId)) return BadRequest("'profile_id' is a required field.");
                else if (model.ID <= 0) return BadRequest("'ID' is a required field.");
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(ProfilesRepository.ProfileCreate("delete-properties", "", 1, model.PeopleId, JsonConvert.SerializeObject(model)));
                if (obj == null) return BadRequest("Invalid details.");
                else return Ok(new { status = true, data = obj });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("group-list")]
        public IHttpActionResult GetGroupsList([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = ProfilesRepository.GroupList(om.company_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");
                var dt = ProfilesRepository.GroupList(1, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("list")]
        public IHttpActionResult GetProfilesList([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = ProfilesRepository.ProfilesList(om.company_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "profiles");
                var dt = ProfilesRepository.ProfilesList(1, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "profiles");

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("activities")]
        public IHttpActionResult GetProfileActivityFeed([FromUri] SearchModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var value = ProfilesRepository.ProfileActivityFeed("profileactivity", om.company_id, model.metric_id, model.profiles_id, 0, 100);
                //var value = ProfilesRepository.ProfileActivityFeed("profileactivity", 1, model.metric_id, model.profiles_id, 0, 100);
                var value = ProfilesRepository.ProfileActivityFeed("profile-activities", 1, model.metric_id, model.profiles_id, 0, 100);

                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
