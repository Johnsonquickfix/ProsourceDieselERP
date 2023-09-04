namespace LaylaERP.Models.qfk.Content
{
    using System;
    using System.Collections.Generic;

    public class Product
    {
        public long product_id { get; set; }
        public long company_id { get; set; }
        public string id { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string link { get; set; } = string.Empty;
        public string image_link { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public float price { get; set; } = 0;
        public float inventory_quantity { get; set; } = 0;
        public float inventory_policy { get; set; } = 0;
        public string status { get; set; } = string.Empty;
        public List<string> categories { get; set; }
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
    }

    public class ProductsRequest : JqDataTableModel
    {
        public long id { get; set; } = 0;
        public string json_condition { get; set; } = string.Empty;
    }
}