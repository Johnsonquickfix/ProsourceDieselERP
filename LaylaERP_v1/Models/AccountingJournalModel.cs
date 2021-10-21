using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class AccountingJournalModel:PaggingModel
    {
        public int rowid { get; set; }
        public int entity { get; set; }
        public string code { get; set; }
        public string label { get; set; }
        public int nature { get; set; }
        public int active { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }
    }
}