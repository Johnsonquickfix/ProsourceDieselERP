namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    public class Lists
    {
        [JsonProperty("list_id", NullValueHandling = NullValueHandling.Ignore)]
        public long list_id { get; set; }

        [JsonProperty("list_name", NullValueHandling = NullValueHandling.Ignore)]
        public string list_name { get; set; }

        [JsonProperty("list_slug", NullValueHandling = NullValueHandling.Ignore)]
        public string list_slug { get; set; }

        [JsonProperty("definition", NullValueHandling = NullValueHandling.Ignore)]
        public Definition[] definition { get; set; }

        [JsonProperty("group_type_id", NullValueHandling = NullValueHandling.Ignore)]
        public int group_type_id { get; set; }

        [JsonProperty("is_flagged", NullValueHandling = NullValueHandling.Ignore)]
        public bool is_flagged { get; set; }
    }

    public class ListResponse : Lists
    {
        public long member_count { get; set; }
        public string group_type_name { get; set; }
    }

    public class Definition
    {
        [JsonProperty("criteria", NullValueHandling = NullValueHandling.Ignore)]
        public Criterion[] criteria { get; set; }
    }
    public class Criterion
    {
        [JsonProperty("type", NullValueHandling = NullValueHandling.Ignore)]
        public string Type { get; set; }

        [JsonProperty("operator", NullValueHandling = NullValueHandling.Ignore)]
        public string Operator { get; set; }

        [JsonProperty("timeframe", NullValueHandling = NullValueHandling.Ignore)]
        public string timeframe { get; set; }

        [JsonProperty("value", NullValueHandling = NullValueHandling.Ignore)]
        public object value { get; set; }

        [JsonProperty("useValue", NullValueHandling = NullValueHandling.Ignore)]
        public bool? useValue { get; set; }

        [JsonProperty("statistic", NullValueHandling = NullValueHandling.Ignore)]
        public long? statistic { get; set; }

        [JsonProperty("statistic_filters", NullValueHandling = NullValueHandling.Ignore)]
        public StatisticFilters statisticFilters { get; set; }

        [JsonProperty("timeframe_options", NullValueHandling = NullValueHandling.Ignore)]
        public TimeframeOptions timeframeOptions { get; set; }

        [JsonProperty("region_id", NullValueHandling = NullValueHandling.Ignore)]
        public string regionId { get; set; }

        [JsonProperty("group", NullValueHandling = NullValueHandling.Ignore)]
        public long? group { get; set; }

        [JsonProperty("key_type", NullValueHandling = NullValueHandling.Ignore)]
        public string keyType { get; set; }

        [JsonProperty("key", NullValueHandling = NullValueHandling.Ignore)]
        public string key { get; set; }

        [JsonProperty("units", NullValueHandling = NullValueHandling.Ignore)]
        public string units { get; set; }

        [JsonProperty("country_code", NullValueHandling = NullValueHandling.Ignore)]
        public string countryCode { get; set; }

        [JsonProperty("distance", NullValueHandling = NullValueHandling.Ignore)]
        public int? distance { get; set; }

        [JsonProperty("postal_code", NullValueHandling = NullValueHandling.Ignore)]
        public string postalCode { get; set; }

        public class StatisticFilters
        {
            [JsonProperty("operator", NullValueHandling = NullValueHandling.Ignore)]
            public string Operator { get; set; }

            [JsonProperty("dimension_type", NullValueHandling = NullValueHandling.Ignore)]
            public string dimensionType { get; set; }

            [JsonProperty("dimension", NullValueHandling = NullValueHandling.Ignore)]
            public string dimension { get; set; }

            [JsonProperty("value", NullValueHandling = NullValueHandling.Ignore)]
            public List<string> value { get; set; }
        }

        public class TimeframeOptions
        {
            [JsonProperty("start", NullValueHandling = NullValueHandling.Ignore)]
            public object start { get; set; }

            [JsonProperty("end", NullValueHandling = NullValueHandling.Ignore)]
            public object end { get; set; }

            [JsonProperty("quantity", NullValueHandling = NullValueHandling.Ignore)]
            public int? quantity { get; set; }

            [JsonProperty("units", NullValueHandling = NullValueHandling.Ignore)]
            public string units { get; set; }

            [JsonProperty("value", NullValueHandling = NullValueHandling.Ignore)]
            public DateTime? value { get; set; }
        }
    }
}