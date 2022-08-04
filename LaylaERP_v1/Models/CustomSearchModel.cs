using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CustomSearchModel
    {
        public string flag { get; set; }
        public string order_types { get; set; }
        public string order_status { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public List<CustomDisplayFieldModel> display_field { get; set; }
        public List<CustomWhereFieldModel> where_field { get; set; }
        public string sEcho { get; set; }
        public int iDisplayStart { get; set; }
        public int iDisplayLength { get; set; }
        public string sSortColName { get; set; }
        public string sSortDir_0 { get; set; }

        public CustomSearchModel()
        {
            flag = order_types = order_status = sEcho = sSortColName = sSortDir_0 = String.Empty;
            start_date = end_date = null;
            display_field = new List<CustomDisplayFieldModel>();
            where_field = new List<CustomWhereFieldModel>();
            iDisplayStart = 0; iDisplayLength = 10;
        }
    }

    public class CustomDisplayFieldModel
    {
        public string strType { get; set; }
        public string strKey { get; set; }
        public string strValue { get; set; }
    }

    public class CustomWhereFieldModel
    {
        public string strType { get; set; }
        public string strKey { get; set; }
        public string strOperator { get; set; }
        public string strValue { get; set; }
    }
}