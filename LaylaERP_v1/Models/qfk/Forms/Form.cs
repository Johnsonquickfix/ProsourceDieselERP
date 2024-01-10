namespace LaylaERP.Models.qfk.Forms
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    public class Form
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public long form_id { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string name { get; set; }

        [JsonProperty("list_id", NullValueHandling = NullValueHandling.Ignore)]
        public long list_id { get; set; }

        [JsonProperty("form_type", NullValueHandling = NullValueHandling.Ignore)]
        public string form_type { get; set; }
       
        [JsonProperty("content", NullValueHandling = NullValueHandling.Ignore)]
        public FormMessage content { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Ignore)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }

    public class FormMessage
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public long form_id { get; set; }

        [JsonProperty("content_type", NullValueHandling = NullValueHandling.Include)]
        public string content_type { get; set; }

        [JsonProperty("template_id", NullValueHandling = NullValueHandling.Include)]
        public long template_id { get; set; }

        [JsonProperty("data_html", NullValueHandling = NullValueHandling.Include)]
        public string data_html { get; set; }

        [JsonProperty("data_json", NullValueHandling = NullValueHandling.Include)]
        public string data_json { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Include)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }
}