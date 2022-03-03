using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.BAL
{
    public class ImportOrderinvoiceModel
    {
        public int rowid { get; set; }
        public string document_id { get; set; }
        public string doc_date { get; set; }
        public string payer_id { get; set; }
        public string payer_name { get; set; }
        public string ref_doc { get; set; }
        public string sales_doc { get; set; }
        public string item { get; set; }
        public string material_number { get; set; }
        public string material_description { get; set; }
        public string pint { get; set; }
        public string po_number { get; set; }
        public string bol { get; set; }
        public decimal net_amount { get; set; }
        public decimal freight_charge { get; set; }
        public decimal sales_tax { get; set; }
        public decimal total_amount { get; set; }
        public string cmir { get; set; }
        public string tracking_number { get; set; }
        public string name { get; set; }
        public string street { get; set; }
        public string city { get; set; }
        public string state { get; set; } 
        public string zipcode { get; set; }
        public string destination_country { get; set; }
        public string cr_dr_memo_text { get; set; }
        public string vendor_id { get; set; }
    }
}