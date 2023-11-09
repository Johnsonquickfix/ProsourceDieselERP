namespace LaylaERP.Models.qfk.Audience
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class PeopleCustomProperty
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public long ID { get; set; }

        [JsonProperty("profile_id", NullValueHandling = NullValueHandling.Ignore)]
        public string PeopleId { get; set; }

        [JsonProperty("meta_key", NullValueHandling = NullValueHandling.Ignore)]
        public string MetaKey { get; set; }

        [JsonProperty("meta_value", NullValueHandling = NullValueHandling.Ignore)]
        public string MetaValue { get; set; }
    }
}