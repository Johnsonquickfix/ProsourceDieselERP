﻿using System;
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
        public string extraparams { get; set; }
        public string ac_type { get; set; }
        public string bs_type { get; set; }
    }
    public class ProductAccountingModel : PaggingModel
    {
        public int ID { get; set; }
        public long fk_product_id { get; set; }
        public string strValue1 { get; set; }
        public string strValue2 { get; set;}
        public string Productfor { get; set; }
        public string option_mode { get; set; }
        public int fk_account_number { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }
    }

    public class PcgtypeModel
    {
        public int rowid { get; set; }
        public int account_parent { get; set; }
        public string pcg_type { get; set; }
    }

    public class ChartAccountEntryModel
    {
        public int rowid { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string detail_type { get; set; }
        public decimal balance { get; set; }
        public decimal bank_balance { get; set; }
        public DateTime entry_date { get; set; }
    }
    public class AccountCategoryModel
    {
        public int rowid { get; set; }
        public string account_category { get; set; }
    }

}
