using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class DaModel
    {
        public int rowid { get; set; }
        public decimal da_rate1 { get; set; }
        public decimal da_rate2 { get; set; }
        public decimal da_rate_others { get; set; }
        public DateTime from_date { get; set; }
    }
}