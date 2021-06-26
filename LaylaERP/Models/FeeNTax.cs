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
        public Int64 zip { get; set; }
        public string country { get; set; }
        public List<FeeNTax> lst { get; set; }
    }
}