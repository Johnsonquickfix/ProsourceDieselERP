using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Dynamic;

namespace LaylaERP_v1.Models.Product
{
    public class CartResponse
    {
        [JsonProperty("message")]
        public string message { get; set; }
        [JsonProperty("status")]
        public int status { get; set; }
        [JsonProperty("code")]
        public string code { get; set; }
        [JsonProperty("data")]
        public CartDataResponse data { get; set; }
    }
    public class CartDataResponse
    {
        public string session_id { get; set; }
        public int item_count { get; set; }
        public CartShippingAddressRequest shipping_address { get; set; }
        public CartShippingAddressRequest billing_address { get; set; }
        public CartTotals cart_totals { get; set; }
        public List<Item> items { get; set; }
        public List<Coupon> coupons { get; set; }
        public List<ShippingMethods> shipping_methods { get; set; }
        public ShippingMethods shipping_rate { get; set; }
        public class Item
        {
            public string kit_key { get; set; }
            public long group_id { get; set; }
            public long id { get; set; }
            public long variation_id { get; set; }
            public int quantity { get; set; }
            public string slug { get; set; }
            public string brand { get; set; }
            public string name { get; set; }
            public string sku { get; set; }
            public bool? is_category { get; set; }
            public List<long> categories { get; set; }
            public decimal? price { get; set; }
            public decimal? regular_price { get; set; }
            public decimal? sale_price { get; set; }
            public decimal? line_subtotal { get; set; }
            public decimal? line_subtotal_tax { get; set; }
            public decimal? line_total { get; set; }
            public decimal? line_total_tax { get; set; }
            public double? weight { get; set; }
            public string weight_unit { get; set; }
            public Image image { get; set; }
            public Dimensions dimensions { get; set; }
            public Wholesale wholesale { get; set; }
            public class Image
            {
                public string name { get; set; }
                public decimal height { get; set; } = 0;
                public decimal width { get; set; } = 0;
                public decimal filesize { get; set; } = 0;
            }
            public class Dimensions
            {
                public string unit { get; set; }
                public double length { get; set; } = 0;
                public double width { get; set; } = 0;
                public double height { get; set; } = 0;
            }
            public class Wholesale
            {
                public string role { get; set; }
                public decimal? price { get; set; }
                public string rule_mapping { get; set; }
                public decimal? cat_discount { get; set; }
                public string cat_rule_mapping { get; set; }
            }
        }
        public class CartTotals
        {
            public decimal subtotal { get; set; }
            public decimal subtotal_tax { get; set; }
            public decimal shipping_total { get; set; }
            public decimal shipping_tax { get; set; }
            public List<dynamic> shipping_taxes { get; set; }
            public decimal discount_total { get; set; }
            public decimal discount_tax { get; set; }
            public decimal cart_contents_total { get; set; }
            public decimal cart_contents_tax { get; set; }
            public List<dynamic> cart_contents_taxes { get; set; }
            public decimal fee_total { get; set; }
            public decimal fee_tax { get; set; }
            public List<dynamic> fee_taxes { get; set; }
            public decimal total { get; set; }
            public decimal total_tax { get; set; }
        }
        public class Coupon
        {
            public string coupon_title { get; set; }
            public decimal coupon_amount { get; set; }
            public string discount_type { get; set; }
            public List<long> categories { get; set; }
            public decimal discount_amount { get; set; }

        }
        public class ShippingMethods
        {
            public string method_id { get; set; }
            public string method_title { get; set; }
            public decimal amount { get; set; }
            public bool isactive { get; set; }
        }        
    }

    public class CartProductRequest
    {
        [JsonProperty("kit_key")]
        public string kit_key { get; set; }
        [JsonProperty("group_id")]
        public long group_id { get; set; }
        [JsonProperty("id")]
        public long id { get; set; }
        [JsonProperty("variation_id")]
        public long variation_id { get; set; }
        [JsonProperty("quantity")]
        public int quantity { get; set; }
    }

    public class CartShippingAddressRequest
    {
        [JsonProperty("first_name")]
        public string first_name { get; set; } = string.Empty;
        [JsonProperty("last_name")]
        public string last_name { get; set; } = string.Empty;
        [JsonProperty("company")]
        public string company { get; set; } = string.Empty;
        [JsonProperty("address_1")]
        public string address_1 { get; set; } = string.Empty;
        [JsonProperty("address_2")]
        public string address_2 { get; set; } = string.Empty;
        [JsonProperty("city")]
        public string city { get; set; } = string.Empty;
        [JsonProperty("state")]
        public string state { get; set; } = string.Empty;
        [JsonProperty("postcode")]
        public string postcode { get; set; } = string.Empty;
        [JsonProperty("country")]
        public string country { get; set; } = string.Empty;
    }
}