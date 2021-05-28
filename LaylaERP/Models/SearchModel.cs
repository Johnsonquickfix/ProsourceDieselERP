using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class SearchModel : PaggingModel
    {
        public string strValue1 { get; set; }
        public string strValue2 { get; set; }
        public string strValue3 { get; set; }
        public string strValue4 { get; set; }
        public string strValue5 { get; set; }
        public string strValue6 { get; set; }

    }
    public class PaggingModel
    {
        public int PageNo { get; set; }
        public int PageSize { get; set; }
        public int sEcho { get; set; }
    }
}