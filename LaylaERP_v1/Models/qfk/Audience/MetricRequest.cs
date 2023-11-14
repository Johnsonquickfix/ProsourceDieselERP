namespace LaylaERP.Models.qfk.Audience
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class MetricRequest
    {
        [JsonProperty("data")]
        public Metrics Data { get; set; }

        public class Metrics
        {
            [JsonProperty("type", NullValueHandling = NullValueHandling.Ignore)]
            public string type { get; set; }

            [JsonProperty("attributes", NullValueHandling = NullValueHandling.Ignore)]
            public MetricAttributes Attributes { get; set; }

            public class MetricAttributes
            {
                [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
                public string Name { get; set; }
            }
        }


    }
}