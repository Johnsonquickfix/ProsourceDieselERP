namespace LaylaERP.Models.qfk
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    public class SearchModel : BaseModel
    {
        public long company_id { get; set; } = 0;
        public long metric_id { get; set; } = 0;
        public string profiles_id { get; set; } = string.Empty;
        public string period { get; set; } = string.Empty;
        public DateTime? date_from { get; set; } = null;
        public DateTime? date_to { get; set; } = null;
    }
}