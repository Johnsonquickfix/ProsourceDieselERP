namespace LaylaERP.Models.qfk
{
    using System;

    public class JqDataTableModel : SearchModel
    {
        public string sEcho { get; set; } = string.Empty;

        public string sSearch { get; set; } = string.Empty;
        public int iDisplayLength { get; set; } = 0;
        public int iDisplayStart { get; set; } = 0;

        public int? iColumns { get; set; } = 0;

        public int? iSortingCols { get; set; } = 0;
        public string sColumns { get; set; } = string.Empty;

        public int iSortCol_0 { get; set; } = 0;
        public string sSortColName { get; set; } = string.Empty;
        public string sSortDir_0 { get; set; } = string.Empty;

        public DateTime? date_from { get; set; } = null;
        public DateTime? date_to { get; set; } = null;
        public string strCondition { get; set; } = string.Empty;
    }
}