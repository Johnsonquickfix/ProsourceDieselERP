namespace LaylaERP.Models.qfk.TrackAndIdentify
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class Profile
    {
        [JsonProperty("$email", NullValueHandling = NullValueHandling.Ignore)]
        public string Email { get; set; }

        [JsonProperty("$phone_number", NullValueHandling = NullValueHandling.Ignore)]
        public string PhoneNumber { get; set; }

        [JsonProperty("$first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("$last_name", NullValueHandling = NullValueHandling.Ignore)]
        public string LastName { get; set; }

        [JsonProperty("$organization", NullValueHandling = NullValueHandling.Ignore)]
        public string Organization { get; set; }

        [JsonProperty("$title", NullValueHandling = NullValueHandling.Ignore)]
        public string title { get; set; }

        [JsonProperty("$address1", NullValueHandling = NullValueHandling.Ignore)]
        public string Address1 { get; set; }

        [JsonProperty("$address2", NullValueHandling = NullValueHandling.Ignore)]
        public string Address2 { get; set; }

        [JsonProperty("$city", NullValueHandling = NullValueHandling.Ignore)]
        public string City { get; set; }

        [JsonProperty("$region", NullValueHandling = NullValueHandling.Ignore)]
        public string Region { get; set; }

        [JsonProperty("$country", NullValueHandling = NullValueHandling.Ignore)]
        public string Country { get; set; }

        [JsonProperty("$zip", NullValueHandling = NullValueHandling.Ignore)]
        public string Zip { get; set; }

        [JsonProperty("$image", NullValueHandling = NullValueHandling.Ignore)]
        public string Image { get; set; }
        [JsonProperty("$timezone", NullValueHandling = NullValueHandling.Ignore)]
        public string Timezone { get; set; }
        [JsonProperty("$ip", NullValueHandling = NullValueHandling.Ignore)]
        public string IP { get; set; }

        [JsonProperty("$consent", NullValueHandling = NullValueHandling.Ignore)]
        public List<string> Consent { get; set; }

        [JsonProperty("properties", NullValueHandling = NullValueHandling.Ignore)]
        public List<ProfileCustomProperties> CustomProperties { get; set; }

        public class ProfileCustomProperties
        {
            [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
            public long id { get; set; }
            [JsonProperty("meta_key", NullValueHandling = NullValueHandling.Ignore)]
            public string meta_key { get; set; }
            [JsonProperty("meta_value", NullValueHandling = NullValueHandling.Ignore)]
            public object meta_value { get; set; }
        }
    }

    public class Profiles
    {
        [JsonProperty("profiles", NullValueHandling = NullValueHandling.Ignore)]
        public List<Profile> profiles { get; set; }
    }
}