using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class LeaveModel
    {
        public int rowid { get; set; }
        public string fk_emp { get; set; }
        public string leave_code { get; set; }
        public string description { get; set; }
        public string leave_type { get; set; }
        public string is_paid { get; set; }
        public DateTime from_date { get; set; }
        public DateTime to_date { get; set; }
        public int is_approved { get; set; }
        public string note_public { get; set; }
        public string note_private { get; set; }
        public float days { get; set; }
        public string searchid { get; set; }
    }
}
