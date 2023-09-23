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