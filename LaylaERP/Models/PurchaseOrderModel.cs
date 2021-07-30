using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class PurchaseOrderModel : PaggingModel
    {
        public int rowid { get; set; }
        public int VendorID { get; set; }
        public string Vendor { get; set; }
        public string VendorCode { get; set; }
        public int PaymentTerms { get; set; }
        public int Balancedays { get; set; }
        public int PaymentType { get; set; }
        public string Planneddateofdelivery { get; set; }
        public int IncotermsTypeID { get; set; }
        public int fk_statut { get; set; }
        public string note_private { get; set; }
        public string note_public { get; set; }
        public int IncotermType { get; set; }
        public string Incoterms { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }
    }
}