using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.BAL
{
    public class ImportPoModel
    {
        public int rowid { get; set; }
        public string po_date { get; set; }
        public string po_due_date { get; set; }
        public string po_invoice_number { get; set; }
        public string customer_requisition { get; set; }
        public string po_currency { get; set; }
        public decimal original_invoice_amt { get; set; }
        public decimal remain_invoice_amt { get; set; }
        //public string vendorid { get; set; }
    }
}