using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class AccountingJournal
    {
        public int rowid { get; set; }
        public int entity { get; set; }
        public string code { get; set; }
        public string label { get; set; }
        public int nature { get; set; }
        public int active { get; set; }
    }
}