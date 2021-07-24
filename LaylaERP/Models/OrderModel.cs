namespace LaylaERP.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;


    public class OrderModel
    {
        public List<OrderPostMetaModel> OrderPostMeta { get; set; }
        public List<OrderProductsModel> OrderProducts { get; set; }
        public OrderPostStatusModel OrderPostStatus { get; set; }
        public List<OrderOtherItemsModel> OrderOtherItems { get; set; }
        public List<OrderTaxItemsModel> OrderTaxItems { get; set; }
    }
    public class OrderPostModel
    {
        public long ID { get; set; }

        public string post_author { get; set; }

        public DateTime post_date { get; set; }

        public DateTime post_date_gmt { get; set; }

        public string post_content { get; set; }

        public string post_title { get; set; }

        public string post_excerpt { get; set; }

        public string post_status { get; set; }

        public string comment_status { get; set; }

        public string ping_status { get; set; }

        public string post_password { get; set; }

        public string post_name { get; set; }

        public string to_ping { get; set; }

        public string pinged { get; set; }

        public DateTime post_modified { get; set; }

        public DateTime post_modified_gmt { get; set; }

        public string post_content_filtered { get; set; }

        public string post_parent { get; set; }

        public string guid { get; set; }

        public string menu_order { get; set; }

        public string post_type { get; set; }

        public string post_mime_type { get; set; }

        public string comment_count { get; set; }
    }
    public class OrderPostMetaModel
    {
        public long post_id { get; set; }

        public string meta_key { get; set; }

        public string meta_value { get; set; }
    }
    public class OrderPostStatusModel : PaggingModel
    {
        public long order_id { get; set; }
        public long parent_id { get; set; }
        public long returning_customer { get; set; }
        public long customer_id { get; set; }
        public DateTime date_created { get; set; }
        public DateTime date_created_gmt { get; set; }
        public int num_items_sold { get; set; }
        public double total_sales { get; set; }
        public double tax_total { get; set; }
        public double shipping_total { get; set; }
        public double net_total { get; set; }
        public string status { get; set; }
        public string Search { get; set; }
        public string strVal { get; set; }
    }
    public class OrderProductsModel
    {
        public long order_item_id { get; set; }
        public string product_type { get; set; }
        public long product_id { get; set; }
        public long variation_id { get; set; }
        public string product_name { get; set; }
        public string meta_data { get; set; }
        public bool is_free { get; set; }
        public long group_id { get; set; }
        public decimal quantity { get; set; }
        public decimal reg_price { get; set; }
        public decimal price { get; set; }
        public decimal sale_price { get; set; }
        public decimal total { get; set; }
        public decimal discount { get; set; }
        public decimal tax_amount { get; set; }
        public decimal shipping_amount { get; set; }
        public decimal shipping_tax_amount { get; set; }
    }
    public class OrderShippingModel
    {
        public long product_id { get; set; }
        public decimal AK { get; set; }
        public decimal HI { get; set; }
        public decimal CA { get; set; }
    }
    public class OrderOtherItemsModel
    {
        public long order_item_id { get; set; }
        public long order_id { get; set; }
        public string item_name { get; set; }
        public string item_type { get; set; }
        public decimal amount { get; set; }
    }
    public class OrderTaxItemsModel
    {
        public long order_item_id { get; set; }
        public long tax_rate_id { get; set; }
        public string tax_rate_country { get; set; }
        public string tax_rate_state { get; set; }
        public string tax_rate_name { get; set; }
        public decimal tax_rate { get; set; }
        public decimal amount { get; set; }
    }
    public class SplitOrderItemsModel
    {
        public string product_id { get; set; }
        public string variation_id { get; set; }
        public string order_prefix { get; set; }
    }
}