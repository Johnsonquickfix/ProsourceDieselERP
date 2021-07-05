using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CouponsModel
    {
        public long ID { get; set; }
        public string post_title { get; set; }
        public string post_name { get; set; }
        public string discount_type { get; set; }
        public string coupon_amount { get; set; }
        public string individual_use { get; set; }
        public string usage_limit { get; set; }
        public string usage_limit_per_user { get; set; }
        public string limit_usage_to_x_items { get; set; }
        public string usage_count { get; set; }
        public DateTime? date_expires { get; set; }
        public string free_shipping { get; set; }
        public string exclude_sale_items { get; set; }
        public string shareasale_wc_tracker_coupon_upload_enabled { get; set; }
        public string _wjecf_products_and { get; set; }
        public string _wjecf_categories_and { get; set; }
        public string _wjecf_is_auto_coupon { get; set; }
        public string _wjecf_apply_silently { get; set; }
        public string _used_by { get; set; }
    }
}