namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel;

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