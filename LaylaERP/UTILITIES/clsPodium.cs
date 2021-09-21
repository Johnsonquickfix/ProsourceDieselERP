using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
namespace LaylaERP.UTILITIES
{
    public class clsPodium
    {
        private static string base_url = "https://accounts.podium.com";
        public static string GetToken()
        {
            string client_id = "2f936404-dabc-4cf7-a61b-80e6bef42f66", client_secret = "fd4b08be31c507860517f1f411b216d2beea25076348fe4fb0311073080e94df", refresh_token = "703ddfb54f8f811bdfdc77356a6a9d66168ce97865ab029557dbbf7e15ded85f";
            string clientId = CommanUtilities.Provider.GetCurrent().PaypalClientId, clientSecret = CommanUtilities.Provider.GetCurrent().PaypalSecret;
            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("client_id", client_id));
            tokenServerPairs.Add(new KeyValuePair<string, string>("client_secret", client_secret));
            tokenServerPairs.Add(new KeyValuePair<string, string>("refresh_token", refresh_token));
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "refresh_token"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsPodiumAccessToken result = new clsPodiumAccessToken();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/oauth/token");
                client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.PostAsync("", content).Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = JsonConvert.DeserializeObject<clsPodiumAccessToken>(response.Content.ReadAsStringAsync().Result);
                }
                else { result.access_token = string.Empty; }
            }
            return result.access_token;
        }
    }
    public class clsPodiumAccessToken
    {
        public string access_token { get; set; }
        public string refresh_token { get; set; }
        public string expires_in { get; set; }
    }
}