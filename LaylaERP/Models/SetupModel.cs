using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class SetupModel
    {
        public int rowid { get; set; }
        public int product_id { get; set; }
        public string prefix_code { get; set; }
        public string country { get; set; }
        public string state { get; set; }
        public int fk_warehouse { get; set; }
        public int fk_vendor { get; set; }
        public int status { get; set; }
        public int searchid { get; set; }
        public int fk_product_rule { get; set; }


    }
}