using Newtonsoft.Json;
using System.Collections.Generic;

namespace QuickfixSearch.Models.Product
{
    public class ProductFilterRequest
    {
        [JsonProperty("taxonomy")]
        public ProductTaxonomyRequest taxonomy { get; set; }
        [JsonProperty("postmeta")]
        public ProductPostmetaRequest postmeta { get; set; }
        [JsonProperty("sort_by")]
        public string sort_by { get; set; } = string.Empty;
        public int limit { get; set; } = 12;
        public int page { get; set; } = 1;
    }
    public class ProductTaxonomyRequest
    {
        [JsonProperty("cat_slug")]
        public string cat_slug { get; set; }
        [JsonProperty("product_cat")]
        public List<string> product_cat { get; set; }
        [JsonProperty("product_tag")]
        public List<string> product_tag { get; set; }
        [JsonProperty("product_type")]
        public List<string> product_type { get; set; }
    }
    public class ProductPostmetaRequest
    {
        [JsonProperty("_stock_status")]
        public List<string> stock_status { get; set; }
        [JsonProperty("_price")]
        public List<int> price { get; set; }
        //[JsonProperty("product_tag")]
        //public List<string> product_tag { get; set; }
        //[JsonProperty("product_type")]
        //public List<string> product_type { get; set; }
    }
}