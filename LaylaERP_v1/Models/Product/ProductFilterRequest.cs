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
        [JsonProperty("pa_engine")]
        public List<string> pa_engine { get; set; }
        [JsonProperty("pa_make")]
        public List<string> pa_make { get; set; }
        [JsonProperty("pa_brand")]
        public List<string> pa_brand { get; set; }
        [JsonProperty("pa_model")]
        public List<string> pa_model { get; set; }
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