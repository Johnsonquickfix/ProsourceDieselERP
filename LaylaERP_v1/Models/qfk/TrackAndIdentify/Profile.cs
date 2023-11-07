namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class Profile
    {
        [JsonProperty("$email")]
        public string Email { get; set; }

        [JsonProperty("$phone_number")]
        public string PhoneNumber { get; set; }

        [JsonProperty("$first_name")]
        public string FirstName { get; set; }

        [JsonProperty("$last_name")]
        public string LastName { get; set; }

        [JsonProperty("$organization")]
        public string Organization { get; set; }

        [JsonProperty("$title")]
        public string title { get; set; }

        [JsonProperty("$address1")]
        public string Address1 { get; set; }

        [JsonProperty("$address2")]
        public string Address2 { get; set; }

        [JsonProperty("$city")]
        public string City { get; set; }

        [JsonProperty("$region")]
        public string Region { get; set; }

        [JsonProperty("$country")]
        public string Country { get; set; }

        [JsonProperty("$zip")]
        public string Zip { get; set; }

        [JsonProperty("$image")]
        public string Image { get; set; }
        [JsonProperty("$timezone")]
        public string Timezone { get; set; }
        [JsonProperty("$ip")]
        public string IP { get; set; }

        [JsonProperty("$consent")]
        public List<string> Consent { get; set; }
    }
}