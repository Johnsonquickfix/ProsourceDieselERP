namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using Newtonsoft.Json;

    public class Identify
    {
        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("properties")]
        public Profile Properties { get; set; }
    }
}