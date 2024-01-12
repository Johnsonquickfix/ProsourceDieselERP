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
    using System.Dynamic;
    using System.Data;

    [RoutePrefix("api/lists")]
    public class ListsController : ApiController
    {
        //[HttpPost, Route("create")]
        public IHttpActionResult Post(Lists request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (string.IsNullOrEmpty(request.list_name)) return Content(HttpStatusCode.BadRequest, new { message = "list_name is required. list_name must be between 1 and 255 characters." });
                request.list_slug = Regex.Replace(request.list_name.ToLower(), @"[^a-zA-Z0-9|\-]", "-");
                request.group_type_id = request.group_type_id != 0 ? request.group_type_id : 1;
                request.is_flagged = false;
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("create", om.login_company_id, string.Empty, 0, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else if (json_data["status"].ToString() == "200") return Ok(json_data);
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
        public IHttpActionResult Get(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                //if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { detail = "list_id is required." });
                Lists request = new Lists() { list_id = id };
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("get", om.login_company_id, string.Empty, 0, JsonConvert.SerializeObject(request)).ToString());
                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { status = 401, message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { status = 400, message = json_data["message"] });
                }
                else return Content(HttpStatusCode.OK, new { status = 200, message = "Success!", data = json_data });
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
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("rename", 0, api_key, 0, JsonConvert.SerializeObject(request)).ToString());

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
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("delete", 0, api_key, 0, JsonConvert.SerializeObject(request)).ToString());

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

        [HttpPost, Route("{id}/subscribe")]
        public IHttpActionResult ListSubscribe(long id, Profiles request)
        {
            try
            {
                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                string api_key = string.Empty;
                if (headers.Contains("api-key")) api_key = headers.GetValues("api-key").First().Replace("pk_", "");
                if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = "Authentication credentials were not provided.", });
                if (id <= 0) return Content(HttpStatusCode.NotFound, new { status = 404, code = "not_found", message = "Not found." });
                var json_data = JsonConvert.DeserializeObject<JObject>(TrackAndIdentifyRepository.ProfileListSubscribe("subscribe-list", api_key, id, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { status = 401, code = "not_authenticated", message = json_data["message"] });
                    else if (json_data["status"].ToString() == "200") return Ok(json_data);
                    else return Content(HttpStatusCode.BadRequest, new { status = 400, code = "bad_request", message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { status = 500, code = "InternalServerError", message = ex.Message });
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
                var json_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("deletemember", 0, om.public_api_key, 0, send_data));

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
        public IHttpActionResult StaticGroupList(int type = 1)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //return Ok(ProfilesRepository.GroupList(om.company_id, 1));
                return Ok(ProfilesRepository.GroupList(om.login_company_id, type));
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

        [HttpGet, Route("metrics")]
        public IHttpActionResult GetMetrics()
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //DataTable dt = ProfilesRepository.MetricsList(1, string.Empty, 0, 100000, "metric_name", "asc");
                //dynamic x = new List<dynamic>();
                //foreach (DataRow row in dt.Rows)
                //{
                //    x.Add(new { value = Convert.ToInt64(row["metric_id"].ToString()), label = row["metric_name"].ToString() });
                //}
                //return Ok(x);
                return Ok(ProfilesRepository.MetricsList(1, string.Empty, 0, 100000, "metric_name", "asc"));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        #region [Segment masters]
        [HttpGet, Route("criteria/type")]
        public IHttpActionResult GetCriteriaType()
        {
            try
            {
                dynamic x = new List<dynamic>();
                foreach (var item in LaylaERP.Models.qfk.Enums.Criteria.CriteriaType())
                {
                    x.Add(new { value = item.Key, label = item.Value });
                }
                return Ok(x);
                //return Ok(LaylaERP.Models.qfk.Enums.Criteria.CriteriaType());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("criteria/operator/{type}")]
        public IHttpActionResult GetCriteriaOperator(string type)
        {
            try
            {
                dynamic x = new ExpandoObject();
                x.operators = LaylaERP.Models.qfk.Enums.Criteria.CriteriaOperator(type);
                if (type.ToLower().Trim().Equals("customer-statistic-value") || type.ToLower().Trim().Equals("customer-group-membership"))
                    x.timeframes = LaylaERP.Models.qfk.Enums.Criteria.CriteriaTimeframe(type);
                else if (type.ToLower().Trim().Equals("customer-location"))
                    x.region = LaylaERP.Models.qfk.Enums.Criteria.CriteriaRegion();
                else if (type.ToLower().Trim().Equals("customer-distance"))
                    x.unit = LaylaERP.Models.qfk.Enums.Criteria.CriteriaUnit(type);

                return Ok(x);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("criteria/timeframe")]
        public IHttpActionResult GetCriteriaTimeframe()
        {
            try
            {
                return Ok(LaylaERP.Models.qfk.Enums.Criteria.CriteriaTimeframe());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("criteria/unit")]
        public IHttpActionResult GetCriteriaUnit()
        {
            try
            {
                return Ok(LaylaERP.Models.qfk.Enums.Criteria.CriteriaUnit());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("metric/dimensions")]
        public IHttpActionResult dimensions(int statistic)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                var value = ProfilesRepository.GroupCriteriaMaster("dimensions", 1, statistic, string.Empty, string.Empty);

                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost, Route("metric/dimension-values")]
        public IHttpActionResult DimensionValues(Criterion request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                var value = ProfilesRepository.GroupCriteriaMaster("dimension-values", 1, request.statistic.Value, request.statisticFilters.dimension, JsonConvert.SerializeObject(request.statisticFilters.value));

                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("people/property")]
        public IHttpActionResult PeopleProperty()
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                var value = ProfilesRepository.GroupCriteriaMaster("people-property", 1, 0, string.Empty, string.Empty);

                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost, Route("people/property/values")]
        public IHttpActionResult PeoplePropertyValues(Criterion request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                var value = ProfilesRepository.GroupCriteriaMaster("people-property-values", 1, 0, request.key, request.value?.ToString());
                //var value = ProfilesRepository.GroupCriteriaMaster("people-property-values", 1, 0, property, string.Empty);

                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        #endregion
    }
}
