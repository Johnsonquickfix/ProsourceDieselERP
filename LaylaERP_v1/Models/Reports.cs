using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class Reports
    {
        public List<ReportsModel> ReportsModelMeta { get; set; }
    }
    public class ReportsModel
    {
        public string Month { get; set; }

        public int SalesFigure { get; set; }

 


    }
}