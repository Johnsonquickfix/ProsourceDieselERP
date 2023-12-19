namespace LaylaERP.Models.qfk.Flows
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    public class Flow
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public long flow_id { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string flow_name { get; set; }

        [JsonProperty("trigger_type", NullValueHandling = NullValueHandling.Ignore)]
        public int trigger_type { get; set; }

        [JsonProperty("trigger_id", NullValueHandling = NullValueHandling.Ignore)]
        public long trigger_id { get; set; }

        [JsonProperty("has_trigger_filter", NullValueHandling = NullValueHandling.Ignore)]
        public bool has_trigger_filter { get; set; }

        [JsonProperty("trigger_filter", NullValueHandling = NullValueHandling.Ignore)]
        public TrackAndIdentify.Definition[] trigger_filter { get; set; }

        [JsonProperty("has_customer_filter", NullValueHandling = NullValueHandling.Ignore)]
        public bool has_customer_filter { get; set; }

        [JsonProperty("customer_filter", NullValueHandling = NullValueHandling.Ignore)]
        public TrackAndIdentify.Definition[] customer_filter { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Ignore)]
        public int status { get; set; }

        [JsonProperty("paths", NullValueHandling = NullValueHandling.Ignore)]
        public FlowPaths paths { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }

    public class FlowPaths
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Include)]
        public long Path_id { get; set; }

        [JsonProperty("flow", NullValueHandling = NullValueHandling.Include)]
        public long flow_id { get; set; }

        [JsonProperty("parent_path", NullValueHandling = NullValueHandling.Include)]
        public long parent_path_id { get; set; }

        [JsonProperty("actions", NullValueHandling = NullValueHandling.Ignore)]
        public FlowPathAction actions { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Include)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }

    public class FlowPathAction
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Include)]
        public long id { get; set; }

        [JsonProperty("path", NullValueHandling = NullValueHandling.Include)]
        public long path_id { get; set; }

        [JsonProperty("type", NullValueHandling = NullValueHandling.Include)]
        public int type { get; set; }

        [JsonProperty("rank", NullValueHandling = NullValueHandling.Include)]
        public int rank { get; set; }

        [JsonProperty("after_seconds", NullValueHandling = NullValueHandling.Include)]
        public int after_seconds { get; set; }

        //[JsonProperty("settings", NullValueHandling = NullValueHandling.Include)]
        //public string settings { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Include)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }

    //public class ListResponse : Lists
    //{
    //    public long member_count { get; set; }
    //    public string group_type_name { get; set; }
    //}

}