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
}