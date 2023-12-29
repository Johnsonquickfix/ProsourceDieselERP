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
        public string type { get; set; }

        [JsonProperty("rank", NullValueHandling = NullValueHandling.Include)]
        public int rank { get; set; }

        [JsonProperty("after_seconds", NullValueHandling = NullValueHandling.Include)]
        public int after_seconds { get; set; }

        [JsonProperty("after_seconds_unit", NullValueHandling = NullValueHandling.Include)]
        public string after_seconds_unit { get; set; }

        [JsonProperty("delay_unit_value", NullValueHandling = NullValueHandling.Include)]
        public int delay_unit_value { get; set; }

        [JsonProperty("secondary_value", NullValueHandling = NullValueHandling.Include)]
        public int secondary_value { get; set; }

        [JsonProperty("delay_units", NullValueHandling = NullValueHandling.Include)]
        public string delay_units { get; set; }

        //[JsonProperty("settings", NullValueHandling = NullValueHandling.Include)]
        //public string settings { get; set; }

        [JsonProperty("message", NullValueHandling = NullValueHandling.Include)]
        public ActionMessage message { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Include)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }
    }

    public class ActionMessage
    {
        [JsonProperty("content_id", NullValueHandling = NullValueHandling.Include)]
        public long content_id { get; set; }

        [JsonProperty("action_id", NullValueHandling = NullValueHandling.Include)]
        public long action_id { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Include)]
        public string name { get; set; }

        [JsonProperty("reply_to_email", NullValueHandling = NullValueHandling.Include)]
        public string reply_to_email { get; set; }

        [JsonProperty("bcc_email", NullValueHandling = NullValueHandling.Include)]
        public string bcc_email { get; set; }

        [JsonProperty("cc_email", NullValueHandling = NullValueHandling.Include)]
        public string cc_email { get; set; }

        [JsonProperty("from_label", NullValueHandling = NullValueHandling.Include)]
        public string from_label { get; set; }

        [JsonProperty("from_email", NullValueHandling = NullValueHandling.Include)]
        public string from_email { get; set; }

        [JsonProperty("subject", NullValueHandling = NullValueHandling.Include)]
        public string subject { get; set; }

        [JsonProperty("preview_text", NullValueHandling = NullValueHandling.Include)]
        public string preview_text { get; set; }

        [JsonProperty("is_add_utm", NullValueHandling = NullValueHandling.Include)]
        public bool is_add_utm { get; set; }

        [JsonProperty("is_tracking_opens", NullValueHandling = NullValueHandling.Include)]
        public bool is_tracking_opens { get; set; }

        [JsonProperty("is_tracking_clicks", NullValueHandling = NullValueHandling.Include)]
        public bool is_tracking_clicks { get; set; }

        [JsonProperty("is_ignoring_throttling", NullValueHandling = NullValueHandling.Include)]
        public bool is_ignoring_throttling { get; set; }

        [JsonProperty("is_ignoring_unsubscribes", NullValueHandling = NullValueHandling.Include)]
        public bool is_ignoring_unsubscribes { get; set; }

        [JsonProperty("content_type", NullValueHandling = NullValueHandling.Include)]
        public string content_type { get; set; }

        [JsonProperty("template_id", NullValueHandling = NullValueHandling.Include)]
        public long template_id { get; set; }

        [JsonProperty("data_html", NullValueHandling = NullValueHandling.Include)]
        public string data_html { get; set; }

        [JsonProperty("data_json", NullValueHandling = NullValueHandling.Include)]
        public string data_json { get; set; }

        [JsonProperty("send_time", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? send_time { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Include)]
        public int status { get; set; }

        [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? created { get; set; }

        [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? updated { get; set; }

        [JsonProperty("metadata", NullValueHandling = NullValueHandling.Include)]
        public MessageMeta metadata { get; set; }

        public class MessageMeta
        {
            [JsonProperty("flow_id", NullValueHandling = NullValueHandling.Include)]
            public long flow_id { get; set; }

            [JsonProperty("flow_name", NullValueHandling = NullValueHandling.Include)]
            public string flow_name { get; set; }
        }
    }

}