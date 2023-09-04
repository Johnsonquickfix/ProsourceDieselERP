namespace LaylaERP.Controllers.API
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Models.qfk;
    using Models.qfk.Campaigns;
    using Models.qfk.Content;
    using Models.qfk.MailTracking;
    using BAL.qfk;
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("api/email-templates")]
    public class EmailTemplatesController : ApiController
    {
        [HttpPost, Route("create")]
        public IHttpActionResult create(Template request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                var c = new { template_id = request.template_id, name = request.name, has_amp_template = request.has_amp_template, is_classic_editor_template = request.is_uploaded };
                //if (string.IsNullOrEmpty(request.source_name)) return Content(HttpStatusCode.BadRequest, new { message = "source_name is required. source_name must be between 1 and 255 characters." });
                //if (string.IsNullOrEmpty(request.source_url)) return Content(HttpStatusCode.BadRequest, new { source_url = "source_name is required." });
                //request.status_id = 1;
                //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("create", om.company_id, om.user_id, request.template_id, JsonConvert.SerializeObject(c), request.templates_data.data_html));
                var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("create", 1, om.UserID, request.template_id, JsonConvert.SerializeObject(c), request.templates_data.data_html));

                return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpPost, Route("update/{id}")]
        public IHttpActionResult UpdateTemplate(long id, Template request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("update", om.company_id, om.user_id, id, request.templates_data.data_json, request.templates_data.data_html));
                var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("update", 1, om.UserID, id, request.templates_data.data_json, request.templates_data.data_html));

                return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet, Route("list")]
        public IHttpActionResult GetSourceList([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                int t = 0;
                //var dt = EmailTemplatesRepository.TemplatesList(om.company_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");
                var dt = EmailTemplatesRepository.TemplatesList(1, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");
                if (dt.Rows.Count > 0) t = Convert.ToInt32(dt.Rows[0]["totalcount"].ToString());
                var _json = new { total = t, data = dt };
                return Ok(_json);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("template/{id}")]
        public IHttpActionResult GetTemplateinfo(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //return Ok(EmailTemplatesRepository.Templateinfo(om.company_id, id));
                return Ok(EmailTemplatesRepository.Templateinfo(1, id));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        // PUT: api/lists/5
        [HttpPut, Route("{id}/rename")]
        public IHttpActionResult Rename(long id, Template request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("rename", om.company_id, om.user_id, id, string.Empty, request.name));
                var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("rename", 1, om.UserID, id, string.Empty, request.name));
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

        [HttpDelete, Route("{id}/delete")]
        public IHttpActionResult Delete(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("delete", om.company_id, om.user_id, id, string.Empty, string.Empty));
                var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("delete", 1, om.UserID, id, string.Empty, string.Empty));
                return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost, Route("{id}/clone")]
        public IHttpActionResult Clone(long id, Template request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("clone", om.company_id, om.user_id, id, string.Empty, request.name));
                var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("clone", 1, om.UserID, id, string.Empty, request.name));

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
        [HttpPost, Route("send/{id}")]
        public IHttpActionResult SendTestMail(long id, Template request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //string _html = SendEmail.UpdateAccountVariables(request.templates_data.data_html);
                //CampaignTrackingRequest o = new CampaignTrackingRequest() { id = id.ToString() };
                //_html = SendEmail.AddMailTrakingURL(_html, o);
                //string[] _list = request.thumbnail_url.Split(',');
                //foreach (string r in _list)
                //    SendEmail.send("Quickfix Preview Mailer", om.email, string.Format("{0} {1}", om.first_name, om.last_name).Trim(), r, string.Empty, string.Empty, request.name + " Preview", _html, true);
                return Ok(new { status = true });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
    }
}
