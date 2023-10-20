namespace LaylaERP.UTILITIES
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Dynamic;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;

    public class clsKlaviyo
    {
        private static string base_url = "https://a.klaviyo.com", token = "S44maZ", revision = "2023-10-15";
        public static async Task<string> TrackProfileActivity(clsKlaviyoData data)
        {
            string result = string.Empty;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/client/events/?company_id=" + token);
                //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //client.DefaultRequestHeaders.Add("Accept", "application/json");
                //client.DefaultRequestHeaders.Add("Content-Type", "application/json");
                client.DefaultRequestHeaders.Add("REVISION", revision);
                StringContent _json = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = await client.PostAsync("", _json);
                if (response != null && response.IsSuccessStatusCode)
                {
                    result = response.Content.ReadAsStringAsync().Result;
                }
            }
            return result;
        }
    }
    public class clsKlaviyoData
    {
        public clsPodiumEvent data { get; set; }

        public class clsPodiumEvent
        {
            public string type { get; set; }
            public IDictionary<string,object> attributes { get; set; }
        }
    }
}