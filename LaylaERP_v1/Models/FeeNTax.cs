using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class FeeNTax
    {
        public long id { get; set; }
        public float staterecyclefee { get; set; }

        public Int64 item_parent_id { get; set; }
        public string item_name { get; set; }

        public string city { get; set; }
        public string state { get; set; }
        public string zip { get; set; }
        public string country { get; set; }
        public string recyclefee { get; set; }
        public List<FeeNTax> lst { get; set; }
        public int is_taxable { get; set; }
        public int is_active { get; set; }
        public string taxableshow { get; set; }
        public string activeshow { get; set; }
    }
    public class Fee
    {
        public int rowid { get; set; }
        public string fee_name { get; set; }
        public string fee_type { get; set; }
        public int fee_amt_percentage { get; set; }
    }
}
