namespace LaylaERP.Models.qfk.Flows
{
    using Newtonsoft.Json;
    using System;

    public class FlowFilter
    {
        [JsonProperty("archived", NullValueHandling = NullValueHandling.Ignore)]
        public bool archived { get; set; }

        [JsonProperty("order_asc", NullValueHandling = NullValueHandling.Ignore)]
        public bool order_asc { get; set; }

        [JsonProperty("order_by", NullValueHandling = NullValueHandling.Ignore)]
        public string order_by { get; set; }

        [JsonProperty("page", NullValueHandling = NullValueHandling.Ignore)]
        public int page { get; set; }

        [JsonProperty("size", NullValueHandling = NullValueHandling.Ignore)]
        public int size { get; set; }
    }
}