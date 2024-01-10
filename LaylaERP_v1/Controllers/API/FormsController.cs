namespace LaylaERP.Controllers.API
{
    using LaylaERP.BAL.qfk;
    using LaylaERP.Models.qfk.Forms;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    [RoutePrefix("api/form")]
    public class FormsController : ApiController
    {
        [HttpGet, Route("list")]
        public IHttpActionResult GetFormList([FromUri] FormFilter filter)
        {
            try
            {
                int total_items = 0;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                //if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                DataTable dt = FormsRepository.FormList(om.login_company_id, string.Empty, filter.page, filter.size, filter.order_by, (filter.order_asc ? "asc" : "desc"));
                if (dt.Rows.Count > 0)
                {
                    total_items = dt.Rows[0]["total_items"] != DBNull.Value ? Convert.ToInt32(dt.Rows[0]["total_items"].ToString()) : 0;
                }
                dt.Columns.Remove("total_items");
                return Content(HttpStatusCode.OK, new { total_items = total_items, forms = dt });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message, total_items = 0, flows = new List<object>() });
            }
        }

        [Route("{id}")]
        public IHttpActionResult Get(long id = 0)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                //if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { detail = "id is required." });
                var json_data = JsonConvert.DeserializeObject<JObject>(FormsRepository.FormAdd("get", om.login_company_id, id, om.UserID, string.Empty));
                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "200") return Content(HttpStatusCode.OK, json_data);
                    else if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, json_data);
                    else if (json_data["status"].ToString() == "404") return Content(HttpStatusCode.NotFound, json_data);
                    else return Content(HttpStatusCode.BadRequest, json_data);
                }
                else return Content(HttpStatusCode.OK, new { status = 200, message = "Success!", data = json_data });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("create")]
        public IHttpActionResult FormCreate(Form request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (string.IsNullOrEmpty(request.name)) return Content(HttpStatusCode.BadRequest, new { message = "'name' is required. name must be between 1 and 255 characters." });
                else if (request.list_id < 0) return Content(HttpStatusCode.BadRequest, new { message = "'list_id' is required." });
                else if (string.IsNullOrEmpty(request.form_type)) return Content(HttpStatusCode.BadRequest, new { message = "'form_type' is required." });
                var json_data = JsonConvert.DeserializeObject<JObject>(FormsRepository.FormAdd("create", om.login_company_id, request.form_id, om.UserID, JsonConvert.SerializeObject(request)).ToString());

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

        [HttpPost, Route("{id}/delete")]
        public IHttpActionResult FormDelete(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "id is required." });

                var json_data = JsonConvert.DeserializeObject<JObject>(FlowsRepository.FlowAdd("delete", om.login_company_id, id, om.UserID, string.Empty));

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

        [HttpPost, Route("{id}/content/update")]
        public IHttpActionResult MessageContentData_update(long id, FormMessage request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "id is required." });

                request.form_id = id; request.content_type = "email";
                int i = FormsRepository.FormContentData_Save(id, om.UserID, request.data_html, request.data_json);
                if (i > 0) return Content(HttpStatusCode.OK, new { status = 200, message = "success" });
                else return Content(HttpStatusCode.OK, new { status = 400, message = "success" });

                //var json_data = JsonConvert.DeserializeObject<JObject>(FormsRepository.FormAdd("content-update", om.login_company_id, request.form_id, om.UserID, JsonConvert.SerializeObject(request).ToString(), request.data_html));
                //if (json_data["status"] != null)
                //{
                //    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                //    else if (json_data["status"].ToString() == "200") return Ok(json_data);
                //    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                //}
                //else return Content(HttpStatusCode.BadRequest, new { message = "Bad request." });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("form-templates")]
        public IHttpActionResult GetFormTemplatesList([FromUri] FormFilter filter)
        {
            try
            {
                int total_items = 0;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                //if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                DataTable dt = FormsRepository.FormList(om.login_company_id, string.Empty, filter.page, filter.size, filter.order_by, (filter.order_asc ? "asc" : "desc"), "form-templates");
                if (dt.Rows.Count > 0)
                {
                    total_items = dt.Rows[0]["total_items"] != DBNull.Value ? Convert.ToInt32(dt.Rows[0]["total_items"].ToString()) : 0;
                }
                dt.Columns.Remove("total_items");
                return Content(HttpStatusCode.OK, new { total_items = total_items, templates = dt });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message, total_items = 0, flows = new List<object>() });
            }
        }
    }
}
