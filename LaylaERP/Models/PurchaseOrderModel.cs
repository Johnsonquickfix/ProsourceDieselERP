using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class PurchaseOrderModel
    {
        public int rowid { get; set; }
        public int IncotermsTypeID { get; set; }
        public int VendorID { get; set; }
        public int fk_statut { get; set; }
        public string note_private { get; set; }
        public string note_public { get; set; }
        public int IncotermType { get; set; }
        public string Incoterms { get; set; }
    }
}