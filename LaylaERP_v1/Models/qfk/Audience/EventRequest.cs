namespace LaylaERP.Models.qfk.Audience
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class EventRequest
    {
        [JsonProperty("data")]
        public Events Data { get; set; }

        public class Events
        {
            [JsonProperty("type", NullValueHandling = NullValueHandling.Ignore)]
            public string type { get; set; }

            [JsonProperty("attributes", NullValueHandling = NullValueHandling.Ignore)]
            public EventAttributes Attributes { get; set; }

            public class EventAttributes
            {
                [JsonProperty("properties")]
                public IDictionary<string, object> Properties { get; set; }

                [JsonProperty("value", NullValueHandling = NullValueHandling.Ignore)]
                public double value { get; set; }

                [JsonProperty("unique_id", NullValueHandling = NullValueHandling.Ignore)]
                public string UniqueID { get; set; }

                [JsonProperty("metric")]
                public MetricRequest Metric { get; set; }

                [JsonProperty("profile")]
                public PeopleRequest Profile { get; set; }
            }
        }        
    }
}