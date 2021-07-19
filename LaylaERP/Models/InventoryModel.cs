using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class InventoryModel : PaggingModel
    {
        public int ID { get; set; }
        public string post_title { get; set; }
        public string Count { get; set; }
        public string strValue1 { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }
        public string meta_id { get; set; }
        public string meta_value { get; set; }
    }
}