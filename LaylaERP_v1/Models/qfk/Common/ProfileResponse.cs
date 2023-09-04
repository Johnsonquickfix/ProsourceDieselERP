namespace LaylaERP.Models.qfk.Common
{
    using System;
    using System.Collections.Generic;

    public class ProfileResponse: TrackAndIdentify.Profile
    {
        public string id { get; set; }

        public bool is_suppressed { get; set; }

        public List<Metric> metrics { get; set; }

        public DateTime? created { get; set; }

        public DateTime? updated { get; set; }

        public DateTime? first_active_on { get; set; }

        public DateTime? last_active_on { get; set; }
    }

    public class Metric
    {
        public long metric_id { get; set; }

        public string metric_name { get; set; }

        public string integration { get; set; }

        public long last_30d { get; set; }

        public long all_time { get; set; }

        public DateTime? created { get; set; }

        public DateTime? updated { get; set; }
    }
}