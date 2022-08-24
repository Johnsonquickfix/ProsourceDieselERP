using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class BudgetModel 
    {
        public int budget_id { get; set; }
        public string budget_name { get; set; }
        public int fiscalyear_id { get; set; }
        public string interval { get; set; }
        public DateTime? fromdate { get; set; }
        public DateTime? todate { get; set; }
    }
}