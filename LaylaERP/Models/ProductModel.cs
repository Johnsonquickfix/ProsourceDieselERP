using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class ProductModel
    {
        public List<ProductModelMetaModel> ProductPostMeta { get; set; }
        public List<ProductModelItemModel> ProductPostItemMeta { get; set; }
        public List<ProductModelPostModel> ProductPostPostMeta { get; set; }
        public List<ProductModelPriceModel> ProductPostPriceMeta { get; set; }
        public List<ProductChildModel> ProductChildMeta { get; set; }
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
        public string post_type { get; set; }
        public int post_parent { get; set; }
        public string comment_status { get; set; }

        public int fk_product { get; set; }
        public int fk_vendor { get; set; }
        public float purchase_price { get; set; }
        public float cost_price { get; set; }
        public float salestax { get; set; }
        public float discount { get; set; }
        public int minpurchasequantity { get; set; }
        public string remark { get; set; }
        public int taxrate { get; set; }


    }
    public class ProductModelMetaModel
    {
        public long post_id { get; set; }

        public string meta_key { get; set; }

        public string meta_value { get; set; }
    }
    public class ProductModelItemModel
    {
        public long object_id { get; set; }

        public int  term_taxonomy_id { get; set; }

        public string term_order { get; set; }
    }
    public class  ProductModelPostModel
    {
        public long ID { get; set; }

        public string post_title { get; set; }

        public string post_excerpt { get; set; }
    }

    public class ProductModelPriceModel
    {
        public long post_id { get; set; }

        public string meta_key { get; set; }

        public string meta_value { get; set; }
    }

    public class ProductsModelDetails
    {
        public long ID { get; set; }  
        public string product_name { get; set; }
        public string product_label { get; set; }
        public int Qty { get; set; }
    }
    public class ProductChildModel
    {
        public int fk_product { get; set; }

        public int fk_product_fils { get; set; }

        public int qty { get; set; }

   
    }

    public class ProductModelservices
    {
        public long ID { get; set; }
        public string product_name { get; set; }
        public string product_label { get; set; }
        public string buyingprice { get; set; }
        public string sellingpric { get; set; }
        public string Stock { get; set; }
        public int qty { get; set; }

    }
}