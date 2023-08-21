using Newtonsoft.Json;
using System.Collections.Generic;

namespace QuickfixSearch.Models.Product
{
    public class ProductFilterRequest
    {
        [JsonProperty("taxonomy")]
        public ProductTaxonomyRequest taxonomy { get; set; }
        [JsonProperty("postmeta")]
        public IDictionary<string, object> postmeta { get; set; }
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
    }
}