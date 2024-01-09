namespace LaylaERP.Models.qfk.Flows
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

        [JsonProperty("status", NullValueHandling = NullValueHandling.Ignore)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }
}