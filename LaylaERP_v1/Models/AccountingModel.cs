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
        public string extraparams { get; set; }
        public string ac_type { get; set; }
        public string bs_type { get; set; }
        public int Sub_Account { get; set; }
        public int transaction_class { get; set; }
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
        public decimal debit { get; set; }
        public decimal credit { get; set; }
        public DateTime entry_date { get; set; }
        public string senstag { get; set; }
    }
    public class AccountCategoryModel
    {
        public int rowid { get; set; }
        public string account_category { get; set; }
    }

    public class FiscalYearModel
    {
        public int rowid { get; set; }
        public string label { get; set; }
        public DateTime date_start { get; set; }
        public DateTime date_end { get; set; }
        public int status { get; set; }

    }

    public class TranscationType
    {
        public int rowid { get; set; }
        public int account_type { get; set; }
        public string transaction_type { get; set; }
    }

    public class AccountingReportSearchModal
    {
        public int fiscalyear_id { get; set; }
        public DateTime? from_date { get; set; }
        public DateTime? to_date { get; set; }
        public string report_type { get; set; }
    }
    public class AccountingReportJournalSearchModal
    {
        public string vendor { get; set; }
        public int account { get; set; }
        public DateTime? from_date { get; set; }
        public DateTime? to_date { get; set; }
        public string report_type { get; set; }
        public string filter { get; set; }
    }
}
