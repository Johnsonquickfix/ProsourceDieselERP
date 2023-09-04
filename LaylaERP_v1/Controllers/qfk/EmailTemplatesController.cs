namespace LaylaERP.Controllers.qfk
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Models.qfk.Content;
    using BAL.qfk;
    using UTILITIES;

    [RoutePrefix("emailtemplates")]
    public class EmailTemplatesController : Controller
    {
        [Route("list")]
        public ActionResult List()
        {
            return View();
        }
        [Route("create")]
        public ActionResult Create(Template template)
        {
            return View(template);
        }
        [Route("editor/{id}")]
        public ActionResult EmailEditor(long id)
        {
            Template template = new Template();
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (id > 0)
                {
                    //DataTable dataTable = EmailTemplatesRepository.Templateinfo(om.company_id, id);
                    DataTable dataTable = EmailTemplatesRepository.Templateinfo(1, id);
                    foreach (DataRow row in dataTable.Rows)
                    {
                        template.template_id = row["template_id"] != DBNull.Value ? Convert.ToInt64(row["template_id"].ToString()) : 0;
                        template.name = row["name"].ToString();
                        template.thumbnail_url = row["thumbnail_url"].ToString();
                        template.is_uploaded = row["is_classic_editor_template"] != DBNull.Value ? Convert.ToBoolean(row["is_classic_editor_template"].ToString()) : false;
                    }
                }
            }
            catch { }
            if (template.is_uploaded) return View(template);
            else return Redirect("~/emailtemplates/template-editor/" + id);
        }
        [Route("template-editor"), Route("template-editor/{id}")]
        public ActionResult TemplateEditor(long id = 0)
        {
            Template template = new Template();
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (id <= 0)
                {
                    template.name = string.Format("Template {0:yyyy-MM-dd}", DateTime.UtcNow);
                    var c = new { template_id = 0, name = template.name, has_amp_template = false, is_classic_editor_template = false };
                    //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("create", om.company_id, om.user_id, 0, JsonConvert.SerializeObject(c), string.Empty));
                    var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("create", 1, om.UserID, 0, JsonConvert.SerializeObject(c), string.Empty));
                    if (!string.IsNullOrEmpty(json_data["id"].ToString()))
                    {
                        template.template_id = Convert.ToInt64(json_data["id"].ToString());
                    }
                }
                else
                {
                    //DataTable dataTable = EmailTemplatesRepository.Templateinfo(om.company_id, id);
                    DataTable dataTable = EmailTemplatesRepository.Templateinfo(1, id);
                    foreach (DataRow row in dataTable.Rows)
                    {
                        template.template_id = row["template_id"] != DBNull.Value ? Convert.ToInt64(row["template_id"].ToString()) : 0;
                        template.name = row["name"].ToString();
                        template.thumbnail_url = row["thumbnail_url"].ToString();
                        //template.templates_data = new TemplatesData();
                        //template.templates_data._json = row["data_json"] != DBNull.Value ? JsonConvert.DeserializeObject<JObject>(row["data_json"].ToString()) : JsonConvert.DeserializeObject<JObject>("{}");
                        //template.templates_data.data_html = row["data_html"] != DBNull.Value ? row["data_html"].ToString() : string.Empty;
                    }
                }
            }
            catch { }
            return View(template);
        }

        [Route("template-use/{id}")]
        public ActionResult TemplateUse(long id = 0)
        {
            Template template = new Template();
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                template.name = string.Format("Template {0:yyyy-MM-dd}", DateTime.UtcNow);

                //var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("clone", om.company_id, om.user_id, id, string.Empty, template.name));
                var json_data = JsonConvert.DeserializeObject<JObject>(EmailTemplatesRepository.TemplateAdd("clone", 1, om.UserID, id, string.Empty, template.name));
                if (!string.IsNullOrEmpty(json_data["id"].ToString()))
                {
                    template.template_id = Convert.ToInt64(json_data["id"].ToString());
                }
            }
            catch { }
            return Redirect("~/emailtemplates/template-editor/" + template.template_id);
        }
    }
}