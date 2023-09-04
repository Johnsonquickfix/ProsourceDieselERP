namespace LaylaERP.Controllers.API
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Models.qfk;
    using Models.qfk.Campaigns;
    using BAL.qfk;
    using UTILITIES;
    using System;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("api/campaigns")]
    public class CampaignsController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Post(CampaignRequest request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                if (string.IsNullOrEmpty(request.campaign_name)) return Content(HttpStatusCode.BadRequest, new { message = "Campaign name is required. Campaign name must be between 1 and 255 characters." });
                //if (string.IsNullOrEmpty(request.content.subject)) return Content(HttpStatusCode.BadRequest, new { message = "Subject line is required." });
                //if (string.IsNullOrEmpty(request.content.from_label)) return Content(HttpStatusCode.BadRequest, new { message = "Sender name is required." });
                //if (string.IsNullOrEmpty(request.content.from_email)) return Content(HttpStatusCode.BadRequest, new { message = "Sender email address is required." });
                if (request.audiences.group_ids == null) return Content(HttpStatusCode.BadRequest, new { message = "You must select at least one list or segment." });
                if (request.audiences.group_ids.Count <= 0) return Content(HttpStatusCode.BadRequest, new { message = "You must select at least one list or segment." });
                //if (request.content.template_id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "Sender email address is required." });

                //var value = CampaignRepository.CampaignsAdd("create", om.user_id, om.company_id, request.campaign_id, JsonConvert.SerializeObject(request));
                var value = CampaignRepository.CampaignsAdd("create", om.UserID, 1, request.campaign_id, JsonConvert.SerializeObject(request));
                return Ok(JsonConvert.DeserializeObject<JObject>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> Put(CampaignRequest request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                if (request.campaign_id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "Request had invalid campaign." });
                string action = "updatecontent";
                if (request.action == "content") action = "updatecontent";
                else if (request.action == "template") action = "contentdata";
                else if (request.action == "scheduled") action = "scheduled";
                else if (request.action == "sent") action = "sent";
                else if (request.action == "canceled") action = "canceled";
                //action = request
                //var value = CampaignRepository.CampaignsAdd(action, om.user_id, om.company_id, request.campaign_id, JsonConvert.SerializeObject(request));
                var value = CampaignRepository.CampaignsAdd(action, om.UserID, 1, request.campaign_id, JsonConvert.SerializeObject(request));
                if (request.action == "scheduled") { }
                else if (request.action == "sent")
                {
                    await StartCampaign(request.campaign_id);
                }
                return Ok(JsonConvert.DeserializeObject<JObject>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("{id}")]
        public IHttpActionResult GetCampaign(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //if (id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "Sender email address is required." });

                //CampaignRequest o = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", om.user_id, om.company_id, id, string.Empty));
                CampaignRequest o = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", om.UserID, 1, id, string.Empty));
                return Ok(o);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("list")]
        public IHttpActionResult GetCampaignsList([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                //if (id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "Sender email address is required." });

                //CampaignRequest o = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", om.user_id, om.company_id, id, string.Empty));
                //return Ok(o);
                int t = 0;
                //var dt = CampaignRepository.CampaignsList(om.company_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");
                var dt = CampaignRepository.CampaignsList(1, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");
                if (dt.Rows.Count > 0) t = Convert.ToInt32(dt.Rows[0]["totalcount"].ToString());
                dt.Columns.Remove("totalcount");
                var _json = new { total = t, data = dt };
                return Ok(_json);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public static async Task StartCampaign(long id)
        {

            await Task.Run(() =>
            {
                try
                {
                    string _base_url = System.Configuration.ConfigurationManager.AppSettings["TrakingURL"];
                    CampaignRequest request = new CampaignRequest();
                    request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignProfiles(id));
                    var utm_para = string.Empty;
                    if (request.is_add_utm)
                    {
                        utm_para += "utm_source=" + request.utm_source;
                        utm_para += "&utm_medium=" + request.utm_medium;
                        if (!string.IsNullOrEmpty(request.utm_campaign))
                        {
                            switch (request.utm_campaign)
                            {
                                case "campaign_name":
                                    utm_para += "&utm_campaign=" + request.campaign_name; break;
                                case "campaign_id":
                                    utm_para += "&utm_campaign=" + request.campaign_id.ToString(); break;
                                case "campaign_name_and_id":
                                    utm_para += "&utm_campaign=" + request.campaign_name + " (" + request.campaign_id.ToString() + ")"; break;
                            }
                        }
                        if (!string.IsNullOrEmpty(request.utm_id))
                        {
                            switch (request.utm_campaign)
                            {
                                case "campaign_name":
                                    utm_para += "&utm_id=" + request.campaign_name; break;
                                case "campaign_id":
                                    utm_para += "&utm_id=" + request.campaign_id.ToString(); break;
                                case "campaign_name_and_id":
                                    utm_para += "&utm_id=" + request.campaign_name + " (" + request.campaign_id.ToString() + ")"; break;
                            }
                        }
                        if (!string.IsNullOrEmpty(request.utm_term))
                        {
                            switch (request.utm_campaign)
                            {
                                case "campaign_name":
                                    utm_para += "&utm_term=" + request.campaign_name; break;
                                case "campaign_id":
                                    utm_para += "&utm_term=" + request.campaign_id.ToString(); break;
                                case "campaign_name_and_id":
                                    utm_para += "&utm_term=" + request.campaign_name + " (" + request.campaign_id.ToString() + ")"; break;
                                case "profile_id":
                                    utm_para += "&utm_term={profile_id}"; break;
                            }
                        }
                    }
                    foreach (var item in request.profiles)
                    {
                        string _html = request.contentdata.data_html;
                        _html = Regex.Replace(_html, @"(\{\{\s*(?i)\borganization.name\b\s*\}\})", request.organization.name);
                        _html = Regex.Replace(_html, @"(\{\{\s*(?i)\borganization.full_address\b\s*\}\})", request.organization.full_address);
                        _html = Regex.Replace(_html, @"(\{\{\s*(?i)\borganization.url\b\s*\}\})", request.organization.url);
                        _html = Regex.Replace(_html, @"(\{\%\s*(?i)\bunsubscribe\b\s*\%\})", "<a href=\"" + _base_url + "/subscriptions/unsubscribe?m=" + item.profiles_id + "\" target=\"_blank\">Unsubscribe</a>");

                        CampaignTrackingRequest trackingRequest = new CampaignTrackingRequest() { id = item.id, utm_param = utm_para };
                        //_html = SendEmail.AddMailTrakingURL(_html, trackingRequest);
                        //string status = SendEmail.send(request.content.from_label, request.content.from_email, string.Format("{0} {1}", item.first_name, item.last_name).Trim(), item.email, string.Empty, string.Empty, request.content.subject, _html, true);
                        //if (status.ToLower().Equals("sent")) { TrackAndIdentifyRepository.CampaignTracking("sent", item.id); }
                        //else { TrackAndIdentifyRepository.CampaignTracking("bounced", item.id); }
                    }
                }
                catch { }
            });

        }

        [HttpGet, Route("{id}/campaigns-recipients/{status}")]
        public IHttpActionResult GetCampaignsRecipients(long id, [FromUri] JqDataTableModel model, string status = "sent")
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");
                int t = 0;
                //var dt = CampaignRepository.GetCampaignsRecipients(om.company_id, id, status, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "campaign-recipients");
                var dt = CampaignRepository.GetCampaignsRecipients(1, id, status, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "campaign-recipients");
                if (dt.Rows.Count > 0) t = Convert.ToInt32(dt.Rows[0]["totalcount"].ToString());
                dt.Columns.Remove("totalcount");
                var _json = new { total = t, data = dt };
                return Ok(_json);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
