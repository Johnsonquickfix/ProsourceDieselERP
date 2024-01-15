namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using Newtonsoft.Json;

    public class MailTracking
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public string id { get; set; }

        [JsonProperty("type", NullValueHandling = NullValueHandling.Ignore)]
        public string type { get; set; }

        [JsonProperty("utm_campaign", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_campaign { get; set; }

        [JsonProperty("utm_medium", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_medium { get; set; }

        [JsonProperty("utm_source", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_source { get; set; }

        [JsonProperty("utm_term", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_term { get; set; } = string.Empty;

        [JsonProperty("utm_content", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_content { get; set; }

        [JsonProperty("utm_id", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_id { get; set; }

        [JsonProperty("utm_source_platform", NullValueHandling = NullValueHandling.Ignore)]
        public string utm_source_platform { get; set; }

        [JsonProperty("url", NullValueHandling = NullValueHandling.Ignore)]
        public string url { get; set; }

        //public string utm_param { get; set; } = string.Empty;
    }
}