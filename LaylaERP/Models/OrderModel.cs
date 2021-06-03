namespace LaylaERP.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;


    public class OrderModel
    {
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
    public class OrderProductsModel
    {
        public long product_id { get; set; }
        public long variation_id { get; set; }
        public string product_name { get; set; }
        public decimal quantity { get; set; }
        public decimal price { get; set; }
        public decimal sale_price { get; set; }
        public decimal total { get; set; }
        public decimal discount { get; set; }
        public decimal tax_amount { get; set; }
    }
}