using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.Models
{
    public class PoemailModel
    {
        public string user_id { get; set; }
        public string user_email { get; set; }
        public int status { get; set; }
        public int rowid { get; set; }
        public int fk_usertypeid { get; set; }
    }
}