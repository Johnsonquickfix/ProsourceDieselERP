using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class ProductCategoryModel
    {
        public long term_id { get; set; }
        public string name { get; set; }
        public string slug { get; set; }
        public long term_group { get; set; }
        public int term_order { get; set; }
        public long term_taxonomy_id { get; set; }
        public string taxonomy { get; set; }
        public string description { get; set; }
        public long parent { get; set; }
        public long count { get; set; }
    }
}