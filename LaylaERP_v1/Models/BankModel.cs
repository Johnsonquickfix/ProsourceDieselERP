using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class BankModel
    {
        public DateTime date_created { get; set; }
        public DateTime date_modified { get; set; }
        public string bank { get; set; }
        public string label { get; set; }
        public int fk_user_loginID { get; set; }
        public int fk_user_modif { get; set; }
        public string code_bank { get; set; }
        public string account_number { get; set; }
        public string bic { get; set; }
        public string iban_prefix { get; set; }
        public string country_iban { get; set; }
        public string domiciliation { get; set; }
        public string state { get; set; }
        public string owner_address { get; set; }
        public int working_status { get; set; }
        public string url { get; set; }
        public string accounting_number { get; set; }
        public string account_type { get; set; }
        public int fk_accountancy_journal { get; set; }
        public int min_allowed { get; set; }
        public int min_desired { get; set; }
        public string comment { get; set; }
        public string bank_address { get; set; }
        public int initial_balance { get; set; }
        public string owner_name { get; set; }
        public int rowid { get; set; }
        public string currency_code { get; set; }
        public string BankLinkedID { get; set; }

        //Linked file
        public byte[] ImageFiledata { get; set; }
        public string ImagePath { get; set; }
        public HttpPostedFileBase ImageFile { get; set; }
        
    }
    public class BankVoucherModel
    {
        public long id { get; set; }
        public string vtype { get; set; }
        public string voucher_header { get; set; }
        public string voucher_details { get; set; }
    }
}

