namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using System.Collections.Generic;
    public class Lists
    {
        public long list_id { get; set; }
        public string list_name { get; set; }
        public string list_slug { get; set; }
        public string definition { get; set; }
        public int group_type_id { get; set; }
        public bool is_flagged { get; set; }
    }

    public class ListResponse : Lists
    {
        public long member_count { get; set; }
        public string group_type_name { get; set; }
    }
}