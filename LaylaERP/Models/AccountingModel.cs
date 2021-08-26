using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    //AccountingModel not in use
    public class AccountingModel
    {
        public int ID { get; set; }
        public long fk_product_id { get; set; }
        public string Productfor { get; set; }
        public int fk_account_number { get; set; }
    }
    public class ProductAccountingModel
    {
        public int ID { get; set; }
        public long fk_product_id { get; set; }
        public string Productfor { get; set; }
        public int fk_account_number { get; set; }
    }
}