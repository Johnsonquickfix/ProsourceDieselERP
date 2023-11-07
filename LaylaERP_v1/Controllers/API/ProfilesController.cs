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
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                if (string.IsNullOrEmpty(model.Data.Attributes.Email)) return Content(HttpStatusCode.BadRequest, "Invalid email address.");
                model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("create-profile", 1, "", JsonConvert.SerializeObject(model)));
                return Ok(model);
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
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                PeopleRequest model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("get-profile", 1, id, string.Empty));
                return Ok(model);
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
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                if (string.IsNullOrEmpty(model.Data.PeopleId)) return BadRequest("'id' is a required field for this call.");
                if (model.Data.Attributes.Email != null)
                    if (model.Data.Attributes.Email.Trim() == string.Empty) return BadRequest("Invalid email address.");
                model = JsonConvert.DeserializeObject<PeopleRequest>(ProfilesRepository.ProfileCreate("update-profile", 1, id, JsonConvert.SerializeObject(model)));
                return Ok(model);
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
