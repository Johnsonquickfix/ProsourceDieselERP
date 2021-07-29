using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class ProductModel
    {
        public long ID { get; set; }
        public string post_title { get; set; }
        public string post_name { get; set; }
        public string regular_price { get; set; }
        public string sale_price { get; set; }
        public string post_content { get; set; }

        public string tax_status { get; set; }
        public string post_status { get; set; }
        public string tax_class { get; set; }
        public string sku { get; set; }
        public string manage_stock { get; set; }
        public string backorders { get; set; }

        public string stock { get; set; }
        public string stock_status { get; set; }
        public string low_stock_amount { get; set; }

        public string sold_individually { get; set; }
        public string weight { get; set; }
        public string length { get; set; }
        public string width { get; set; }
        public string height { get; set; }
        public string upsell_ids { get; set; }
        public string crosssell_ids { get; set; }

        public string _virtual { get; set; }
        public string _downloadable { get; set; }
        public string _download_limit { get; set; }
        public string _download_expiry { get; set; }
        public string price { get; set; }
        public string CategoryID { get; set; }

        public int ProductTypeID { get; set; }
        public int ShippingclassID { get; set; }
        public int updatedID { get; set; }
        public string product_attributes { get; set; }
        public string variation_description { get; set; }
        public int post_parent { get; set; }

    }
}