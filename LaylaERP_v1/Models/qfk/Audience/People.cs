namespace LaylaERP.Models.qfk.Audience
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class PeopleRequest
    {
        [JsonProperty("data")]
        public People Data { get; set; }
    }

    public class People
    {
        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public string PeopleId { get; set; }
        [JsonProperty("attributes", NullValueHandling = NullValueHandling.Ignore)]
        public PeopleAttributes Attributes { get; set; }

        public class PeopleAttributes
        {
            [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
            public string Email { get; set; }

            [JsonProperty("phone_number", NullValueHandling = NullValueHandling.Ignore)]
            public string PhoneNumber { get; set; }

            [JsonProperty("external_id", NullValueHandling = NullValueHandling.Ignore)]
            public string ExternalId { get; set; }

            [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
            public string FirstNme { get; set; }

            [JsonProperty("last_name", NullValueHandling = NullValueHandling.Ignore)]
            public string LastName { get; set; }

            [JsonProperty("organization", NullValueHandling = NullValueHandling.Ignore)]
            public string Organization { get; set; }

            [JsonProperty("title", NullValueHandling = NullValueHandling.Ignore)]
            public string Title { get; set; }

            [JsonProperty("image", NullValueHandling = NullValueHandling.Ignore)]
            public string Image { get; set; }

            [JsonProperty("created", NullValueHandling = NullValueHandling.Ignore)]
            public string Created { get; set; }

            [JsonProperty("updated", NullValueHandling = NullValueHandling.Ignore)]
            public string Updated { get; set; }

            [JsonProperty("first_event_date", NullValueHandling = NullValueHandling.Ignore)]
            public string first_event_date { get; set; }

            [JsonProperty("last_event_date", NullValueHandling = NullValueHandling.Ignore)]
            public string last_event_date { get; set; }

            [JsonProperty("location", NullValueHandling = NullValueHandling.Ignore)]
            public PeopleLocation Location { get; set; }

            [JsonProperty("properties", NullValueHandling = NullValueHandling.Ignore)]
            public IDictionary<string, object> CustomProperties { get; set; }

            [JsonProperty("patch_properties", NullValueHandling = NullValueHandling.Ignore)]
            public PatchProperties PatchProperties { get; set; }
        }

        public class PeopleLocation
        {
            [JsonProperty("address1", NullValueHandling = NullValueHandling.Ignore)]
            public string Address1 { get; set; }

            [JsonProperty("address2", NullValueHandling = NullValueHandling.Ignore)]
            public string Address2 { get; set; }

            [JsonProperty("city", NullValueHandling = NullValueHandling.Ignore)]
            public string City { get; set; }

            [JsonProperty("country", NullValueHandling = NullValueHandling.Ignore)]
            public string Country { get; set; }

            [JsonProperty("region", NullValueHandling = NullValueHandling.Ignore)]
            public string Region { get; set; }

            [JsonProperty("Zip", NullValueHandling = NullValueHandling.Ignore)]
            public string zip { get; set; }

            [JsonProperty("timezone", NullValueHandling = NullValueHandling.Ignore)]
            public string Timezone { get; set; }

            [JsonProperty("ip", NullValueHandling = NullValueHandling.Ignore)]
            public string IP { get; set; }
        }

        public class PatchProperties
        {
            [JsonProperty("append", NullValueHandling = NullValueHandling.Ignore)]
            public IDictionary<string, object> Append { get; set; }

            [JsonProperty("unappend", NullValueHandling = NullValueHandling.Ignore)]
            public IDictionary<string, object> Unappend { get; set; }

            [JsonProperty("unset", NullValueHandling = NullValueHandling.Ignore)]
            public List<string> Unset { get; set; }
        }
    }
}