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
        public string strValue7 { get; set; }
        public string strValue8 { get; set; }

    }
    public class PaggingModel
    {
        public int PageNo { get; set; }
        public int PageSize { get; set; }
        public int sEcho { get; set; }
        public string SortCol { get; set; }
        public string SortDir { get; set; }
    }
    public class JqDataTableModel
    {
        public string sEcho { get; set; }

        public string sSearch { get; set; }
        public int iDisplayLength { get; set; }
        public int iDisplayStart { get; set; }

        public int? iColumns { get; set; }

        public int? iSortingCols { get; set; }
        public string sColumns { get; set; }

        public int iSortCol_0 { get; set; }
        public string sSortColName { get; set; }
        public string sSortDir_0 { get; set; }

        public string strValue1 { get; set; }
        public string strValue2 { get; set; }
        public string strValue3 { get; set; }
        public string strValue4 { get; set; }
        public string strValue5 { get; set; }
        public string strValue6 { get; set; }
        public string DateRange { get; set; }
        public string DateRange2 { get; set; }
    }

    public class ZipCodeModel 
    {
        public string country { get; set; }
        public string state { get; set; }
        public string city { get; set; }
        public string ZipCode { get; set; }
    }
}