using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class PaymentInvoiceModel
    {
        public long rowid { get; set; }
        public string refp  { get; set; }
        public string ref_ext { get; set; }  
        public int entity { get; set; } 
        public double amount { get; set; }
        public int fk_payment { get; set; }
        public string num_payment { get; set; }
        public string note { get; set; }
        public string bankcheck { get; set; }
        public string comments { get; set; }
        public int fk_bank { get; set; }
        public int fk_user_creat { get; set; }
        public int status { get; set; }
        public List<PaymentInvoiceDetailsModel> PaymentInvoiceDetails { get; set; }
    }
    public class PaymentInvoiceDetailsModel
    {
        public long rowid { get; set; } 
        public long fk_payment { get; set; }
        public long fk_invoice { get; set; }       
        public decimal payamount { get; set; }        
        public string type { get; set; }
        public string thirdparty_code { get; set; }
    }
}