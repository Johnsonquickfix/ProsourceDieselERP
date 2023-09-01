namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class TrackProfileActivity
    {
        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("event")]
        public string Event { get; set; }

        [JsonProperty("customer_properties")]
        public Profile CustomerProperties { get; set; }

        [JsonProperty("properties")]
        public Dictionary<string, object> Properties { get; set; }
    }
}