namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel;

    public class OrderDetailModel
    {
        [DefaultValue(false)]
        public bool success { get; set; }
        public dynamic order_data { get; set; }
        public dynamic order_items { get; set; }
        public dynamic order_coupons { get; set; }
        public string err_msg { get; set; }
        public OrderDetailModel()
        {
            err_msg = string.Empty; order_data = order_items = order_coupons = null;
        }
    }
    public class OrderModel
    {
        [DefaultValue(false)]
        public int id { get; set; }
        public string post_date { get; set; }
        public string post_status { get; set; }
        public decimal order_total { get; set; }
        public decimal shipstation_shipped_item_count { get; set; }
    }

    public class PostMetaModel
    {
        public long post_id { get; set; }

        public string meta_key { get; set; }

        public string meta_value { get; set; }
    }
    public class OrderStatsModel
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
    }
    public class CartItemsModel
    {
        public long order_item_id { get; set; }
        public long order_id { get; set; }
        public string product_type { get; set; }
        public long product_id { get; set; }
        public long variation_id { get; set; }
        public string product_name { get; set; }
        public decimal quantity { get; set; }
        public decimal sale_rate { get; set; }
        public decimal total { get; set; }
        public decimal discount { get; set; }
        public decimal tax_amount { get; set; }
        public decimal shipping_amount { get; set; }
        public decimal shipping_tax_amount { get; set; }
        public CartItemsModel()
        {
            order_item_id = order_id = product_id= variation_id=0;
            product_type = product_name = string.Empty;
            quantity = sale_rate = total = discount = tax_amount = shipping_amount = shipping_tax_amount = 0;
        }
    }
}