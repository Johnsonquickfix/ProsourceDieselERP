using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class AccountingModel
    {
        public int rowid { get; set; }
        public int entity { get; set; }
        public DateTime date_created { get; set; }
        public DateTime date_modified { get; set; }
        public string fk_pcg_version { get; set; }
        public string pcg_type { get; set; }
        public string account_number { get; set; }
        public int account_parent { get; set; }
        public string label { get; set; }
        public string labelshort { get; set; }
        public int fk_accounting_category { get; set; }
        public int active { get; set; }
        public int reconcilable { get; set; }
    }
    public class ProductAccountingModel
    {
        public int ID { get; set; }
        public long fk_product_id { get; set; }
        public string strValue1 { get; set; }
        public string strValue2 { get; set;}
        public string Productfor { get; set; }
        public int fk_account_number { get; set; }
    }

}
