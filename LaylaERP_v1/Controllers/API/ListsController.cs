namespace LaylaERP.Controllers.API
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text.RegularExpressions;
    using System.Web.Http;
    using Models.qfk;
    using Models.qfk.TrackAndIdentify;
    using UTILITIES;
    using BAL.qfk;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [RoutePrefix("api/lists")]
    public class ListsController : ApiController
    {
        //[HttpPost, Route("create")]
        public IHttpActionResult Post([FromUri] string api_key, Lists request)
        {
            try
            {
                if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                //if (om.user_id <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (string.IsNullOrEmpty(request.list_name)) return Content(HttpStatusCode.BadRequest, new { message = "list_name is required. list_name must be between 1 and 255 characters." });
                request.list_slug = Regex.Replace(request.list_name.ToLower(), @"[^a-zA-Z0-9|\-]", "-");
                request.group_type_id = request.group_type_id != 0 ? request.group_type_id : 1;
                request.is_flagged = false;
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("create", api_key, 0, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        // Get: api/lists/5
        public IHttpActionResult Get([FromUri] string api_key, long id)
        {
            try
            {
                if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { detail = "list_id is required." });
                Lists request = new Lists() { list_id = id };
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("get", api_key, 0, JsonConvert.SerializeObject(request)).ToString());
                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        // PUT: api/lists/5
        public IHttpActionResult Put([FromUri] string api_key, long id, Lists request)
        {
            try
            {
                if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                //if (om.user_id <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (string.IsNullOrEmpty(request.list_name)) return Content(HttpStatusCode.BadRequest, new { message = "list_name is required. list_name must be between 1 and 255 characters." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "list_id is required." });
                request.list_id = id;
                request.list_slug = Regex.Replace(request.list_name.ToLower(), @"[^a-zA-Z0-9|\-]", "-");
                request.group_type_id = 1;
                request.is_flagged = false;
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("rename", api_key, 0, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        // DELETE: api/lists/5
        public IHttpActionResult Delete([FromUri] string api_key, long id)
        {
            try
            {
                if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { detail = "list_id is required." });
                Lists request = new Lists() { list_id = id };
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("delete", api_key, 0, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("{id}/member_count")]
        public IHttpActionResult MemberCount(long id)
        {
            try
            {
                return Ok(ProfilesRepository.GroupMemberCount(id));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet, Route("member_count")]
        public IHttpActionResult MemberCount(string ids)
        {
            try
            {
                return Ok(ProfilesRepository.GroupMemberCount(ids));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("{id}/members")]
        public IHttpActionResult GroupMembers(long id, [FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = ProfilesRepository.GroupMembers(om.company_id, id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);
                var dt = ProfilesRepository.GroupMembers(1, id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet, Route("{id}/member/delete")]
        public IHttpActionResult GroupMemberDelete(long id, string profile_id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                string send_data = "{\"list_id\":" + id + ",\"profiles_id\":\"" + profile_id + "\"}";
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("deletemember", om.public_api_key, 0, send_data));

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpPost, Route("{id}/convert-to-list")]
        public IHttpActionResult ConvertTolist(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //return Ok(ProfilesRepository.ConvertTolist(om.company_id, id, om.UserID));
                return Ok(ProfilesRepository.ConvertTolist(1, id, om.UserID));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet, Route("static-group")]
        public IHttpActionResult StaticGroupList()
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //return Ok(ProfilesRepository.GroupList(om.company_id, 1));
                return Ok(ProfilesRepository.GroupList(1, 1));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet, Route("countries")]
        public IHttpActionResult GetCountries()
        {
            try
            {
                return Ok(ProfilesRepository.GetCountries());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
    }
}
