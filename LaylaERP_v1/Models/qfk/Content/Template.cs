namespace LaylaERP.Models.qfk.Content
{
    using Newtonsoft.Json.Linq;
    using System;

    public class Template
    {
        public long template_id { get; set; }
        public long company_id { get; set; }
        public string name { get; set; } = string.Empty;
        public bool has_amp_template { get; set; } = false;
        public bool is_uploaded { get; set; } = false;
        public string thumbnail_url { get; set; } = string.Empty;
        public TemplatesData templates_data { get; set; }
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
    }
    public class TemplatesData
    {
        public string data_json { get; set; } = string.Empty;
        public string data_html { get; set; } = string.Empty;
        public JObject _json { get; set; }
    }
}