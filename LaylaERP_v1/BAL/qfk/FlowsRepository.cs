namespace LaylaERP.BAL.qfk
{
    using LaylaERP.DAL;
    using LaylaERP.Models.qfk.TrackAndIdentify;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web;

    public class FlowsRepository
    {
        public static string FlowAdd(string flag, int company_id, long id, long user_id, string json_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                    id > 0 ? new SqlParameter("@id",id) : new SqlParameter("@id",DBNull.Value),
                    new SqlParameter("@user_id",user_id),
                    ! string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) : new SqlParameter("@json_data",DBNull.Value)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_flows_search", parameters).ToString();
            }
            catch { throw; }
            return str;
        }
        public static DataTable FlowList(long company_id, string search, int pageno, int pagesize, string sortcol = "updated", string sortdir = "desc", string flag = "list")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_flows_search", parameters);
            }
            catch { throw; }
            return dt;
        }
        public static int FlowContentData_Save(long id, long user_id, string html_data, string json_data)
        {
            int i = 0;
            try
            {
                //SqlParameter[] parameters =
                //{
                //    new SqlParameter("@flag", flag),
                //    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                //    id > 0 ? new SqlParameter("@id",id) : new SqlParameter("@id",DBNull.Value),
                //    new SqlParameter("@user_id",user_id),
                //    ! string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) : new SqlParameter("@json_data",DBNull.Value)
                //};
                //str = SQLHelper.ExecuteReaderReturnJSON("qfk_flows_search", parameters).ToString();

                SqlParameter[] parameters =
                {
                    new SqlParameter("@id",id),
                    new SqlParameter("@user_id",user_id),
                    ! string.IsNullOrEmpty(html_data) ? new SqlParameter("@data_html",html_data) : new SqlParameter("@data_html",DBNull.Value),
                    ! string.IsNullOrEmpty(json_data) ? new SqlParameter("@data_json",json_data) : new SqlParameter("@data_json",DBNull.Value)
                };
                i = SQLHelper.ExecuteNonQuery("Update qfk_flow_path_action_content set data_html = @data_html,data_json = @data_json where content_id = @id", parameters);
            }
            catch { throw; }
            return i;
        }

        #region [Flow Mail actions]
        public static async Task StartFlow(string api_key, string json_data)
        {
            await Task.Run(async () =>
            {
                try
                {
                    DataTable dt = ProfileFlowMessage("flow-message-action", api_key, json_data);
                    var utm_para = string.Empty;
                    foreach (DataRow row in dt.Rows)
                    {
                        if (row["status"].ToString().Equals("2"))
                        {
                            MailTracking tracking = new MailTracking()
                            {
                                id = row["id"].ToString(),
                                type = "flow",
                                utm_medium = "email",
                                utm_campaign = row["action_name"].ToString(),
                                utm_source = row["flow_name"].ToString()
                            };

                            string _html = row["data_html"].ToString();
                            Scriban.Template template = Scriban.Template.Parse(_html);
                            var result = template.Render(new
                            {
                                first_name = row["first_name"].ToString(),
                                last_name = row["last_name"].ToString(),
                                person = new { phone_number = row["last_name"].ToString(), organization = row["organization"].ToString(), title = row["title"].ToString() },
                                organization = new { name = row["company_name"].ToString(), full_address = row["full_address"].ToString(), url = row["website_url"].ToString() },
                                unsubscribe = $"<a href=\"/subscriptions/unsubscribe?m={row["id"].ToString()}\" target=\"_blank\">Unsubscribe</a>",
                                unsubscribe_link = $"/subscriptions/unsubscribe?m={row["id"].ToString()}"
                            });

                            string to_name = row["first_name"].ToString(),
                            to_email = row["email"].ToString(),
                            from_name = row["from_label"].ToString(),
                            from_email = row["from_email"].ToString(),
                            reply_to_email = row["reply_to_email"].ToString(),
                            bcc_email = row["bcc_email"].ToString(),
                            cc_email = row["cc_email"].ToString(),
                            sSubject = row["subject"].ToString();
                            //Add traking utm tags
                            if (!string.IsNullOrEmpty(result)) result = MailTrakingRepository.AddMailTrakingURL(result, tracking);

                            int status =await SendEmail.SendEmails(to_name, to_email, from_name, from_email, reply_to_email, bcc_email, cc_email, sSubject, result, true);

                            if (status > 0) { await FlowMailTracking("sent", row["id"].ToString()); }
                            else { await FlowMailTracking("skipped", row["id"].ToString()); }
                        }
                        else
                        {
                            await FlowMailTracking("skipped", row["id"].ToString());
                        }
                        //_html = Regex.Replace(_html, @"(\{\{\s*(?i)\borganization.name\b\s*\}\})", request.organization.name);
                        //_html = Regex.Replace(_html, @"(\{\{\s*(?i)\borganization.full_address\b\s*\}\})", request.organization.full_address);
                        //_html = Regex.Replace(_html, @"(\{\{\s*(?i)\borganization.url\b\s*\}\})", request.organization.url);
                        //_html = Regex.Replace(_html, @"(\{\%\s*(?i)\bunsubscribe\b\s*\%\})", "<a href=\"" + _base_url + "/subscriptions/unsubscribe?m=" + item.profiles_id + "\" target=\"_blank\">Unsubscribe</a>");

                        //CampaignTrackingRequest trackingRequest = new CampaignTrackingRequest() { id = item.id, utm_param = utm_para };
                        //_html = SendEmail.AddMailTrakingURL(_html, trackingRequest);
                        //string status = SendEmail.send(request.content.from_label, request.content.from_email, string.Format("{0} {1}", item.first_name, item.last_name).Trim(), item.email, string.Empty, string.Empty, request.content.subject, _html, true);
                        //if (status.ToLower().Equals("sent")) { TrackAndIdentifyRepository.CampaignTracking("sent", item.id); }
                        //else { TrackAndIdentifyRepository.CampaignTracking("bounced", item.id); }
                    }
                }
                catch { }
            });

        }

        public static DataTable ProfileFlowMessage(string flag, string api_key, string json_data)
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@public_api_key", api_key),
                    ! string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) : new SqlParameter("@json_data",DBNull.Value)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_flows_actions", parameters);
            }
            catch { throw; }
            return dt;
        }

        public static async Task<int> FlowMailTracking(string flag, string id, string json_data = "")
        {
            int i = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@id",id),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) : new SqlParameter("@json_data",DBNull.Value)
                };
                var data = JsonConvert.DeserializeObject<JObject>(await SQLHelper.ExecuteJsonReaderAsync("qfk_flows_actions", parameters));
                if (data["status"] != null)
                {
                    i = data.Value<bool>("status") ? 1 : 0;
                }
            }
            catch { i = 0; }
            return i;
        }
        #endregion
    }
}