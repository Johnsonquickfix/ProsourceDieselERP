using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class Appearance
    {
        public int menu_id { get; set; }
        public string menu_code { get; set; }
        public string menu_name { get; set; }
        public string menu_url { get; set; }
        public string menu_icon { get; set; }
        public int? parent_id { get; set; }

    }
}