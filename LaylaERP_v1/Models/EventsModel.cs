using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.Models
{
    public class EventsModel
    {
        public int rowid { get; set; }
        public string event_label { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public string assigned_to { get; set; }
        public string related_user { get; set; }
        public string related_contacts { get; set; }
        public string related_company { get; set; }
        public int status { get; set; }
        public string task { get; set; }
        public string description { get; set; }
        public string assigned_user { get; set; }

    }

}