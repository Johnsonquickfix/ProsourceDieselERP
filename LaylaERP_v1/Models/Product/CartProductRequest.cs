using Newtonsoft.Json;

namespace LaylaERP_v1.Models.Product
{
    public class CartProductRequest
    {
        [JsonProperty("id")]
        public long id { get; set; }
        [JsonProperty("variation_id")]
        public long variation_id { get; set; }
        [JsonProperty("quantity")]
        public int quantity { get; set; }
    }
}