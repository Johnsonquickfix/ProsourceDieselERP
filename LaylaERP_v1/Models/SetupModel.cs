using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class SetupModel
    {
        public int rowid { get; set; }
        public int product_id { get; set; }
        public string prefix_code { get; set; }
        public string country { get; set; }
        public string state { get; set; }
        public int fk_warehouse { get; set; }
        public int fk_vendor { get; set; }
        public int status { get; set; }
        public int searchid { get; set; }
        public int fk_product_rule { get; set; }
        public int searchproductid { get; set; }

        //Free Product
        public int on_product_id { get; set; }
        public int free_product_id { get; set; }
        public int free_quantity { get; set; }
    }

    public class ProductReturnModel
    {
        public int rowid { get; set; }
        public int productid { get; set; }
        public int returndays { get; set; }
        public int warrantydays { get; set; }
        public string remarks {get; set;}
    }
    public class ProductTypeModel
    {
        public int rowid { get; set; }
        public string flag { get; set; }
        public string product_type_name { get; set; }
        public string product_type_code { get; set; }
    }
    public class AccountingClassTransaction
    {
        public int rowid { get; set; }
        public string flag { get; set; }
        public string account_class { get; set; }
        public string account_tag { get; set; }
        public string department { get; set; }
        public string location { get; set; }
        public string events { get; set; }
        public string others { get; set; }

    }
    public class MerchantfeeModel
    {
        public int rowid { get; set; }
        public string flag { get; set; }
        public string merchant_name { get; set; }
        public string threshold { get; set; }
    }
}