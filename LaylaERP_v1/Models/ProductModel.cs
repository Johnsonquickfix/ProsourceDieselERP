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
        public float shipping_price { get; set; }
        public float Misc_Costs { get; set; }
        public float salestax { get; set; }
        public float discount { get; set; }
        public int minpurchasequantity { get; set; }
        public string remark { get; set; }

        public string taglotserialno { get; set; }
        public int taxrate { get; set; }

        public string Private_Notes { get; set; }
        public string Public_Notes { get; set; }


        public string Name { get; set; }

        //public string PhoneNumber { get; set; }
        public byte[] ImageFiledata { get; set; }
        public string ImagePath { get; set; }
        public HttpPostedFileBase ImageFile { get; set; }
        public string Shippingclass_Name { get; set; }
        public string countrycode { get; set; }
        public string statecode { get; set; }
        public string Shipping_Method { get; set; }
        public string Shipping_type { get; set; }
        public string taxable { get; set; }
        public int fk_ShippingID { get; set; }
        public float Ship_price { get; set; }
        public float Shipping_taxrate { get; set; }
        public string PublishDate { get; set; }
        public string _gift_card { get; set; }
        public string _gift_card_expiration_days { get; set; }
        public string _gift_card_template_default_use_image { get; set; }
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
        public int status { get; set; }

    }

    public class ProductByingPrice
    {
        public long ID { get; set; }
        public string name { get; set; }
        public string minpurchasequantity { get; set; }
        public string salestax { get; set; }
        public string purchase_price { get; set; }
        public string shipping_price { get; set; }
        public string Misc_Costs { get; set; }
        public string cost_price { get; set; }
        public string discount { get; set; }
        public string date_inc { get; set; }
        public string taglotserialno { get; set; }
        public string Status { get; set; }
        public string is_setprise { get; set; }
        public string date_to { get; set; }
        public string fk_vendor { get; set; }
        public string fk_product { get; set; }

    }
    public class ProductCategoryModel : PaggingModel
    {
        public long term_id { get; set; }
        public long Meta_id { get; set; }
        public string name { get; set; }
        public string slug { get; set; }
        public long term_group { get; set; }
        public int term_order { get; set; }
        public long term_taxonomy_id { get; set; }
        public string taxonomy { get; set; }
        public string description { get; set; }
        public long parent { get; set; }
        public long count { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }
        public string strVal { get; set; }
        public string display_type { get; set; }
        public string thumbnail_id { get; set; }
        public HttpPostedFileBase ImageFile { get; set; }
        public byte[] ImageFiledata { get; set; }
        public string ImagePath { get; set; }
        public string ImagePathOut { get; set; }

    }

    public class ProductOpendingStock
    {
        public long product_id { get; set; }
        public string op_date { get; set; } 
        public int op_qty { get; set; } 
        public decimal op_rate { get; set; }
        public string tag { get; set; } 
    }
}