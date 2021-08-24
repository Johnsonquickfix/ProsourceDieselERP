using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace LaylaERP.UTILITIES
{
    public class clsPayPal
    {
        private static string base_url = "https://api.sandbox.paypal.com";
        public static string GetToken()
        {
            // string clientId = "AcuqRFTJWTspIMomXNjD8qqaY3FYB3POMIKoJOI3P79e85Nluk0b8OME0k-zBnEllg2e03LoBLXbJ0l0", clientSecret = "EA_mO1Ia607bvwcFf5wHMYW-XLx4QST-S41Sr7iG8gCfWkDDzM794mvBjbysx1Nb_5P-MrruKBLWng-u";
            string clientId = CommanUtilities.Provider.GetCurrent().PaypalClientId, clientSecret = CommanUtilities.Provider.GetCurrent().PaypalSecret;
            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsAccessToken result = new clsAccessToken();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/v1/oauth2/token");
                client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64String);
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.PostAsync("", content).Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = JsonConvert.DeserializeObject<clsAccessToken>(response.Content.ReadAsStringAsync().Result);
                }
                else { result.access_token = string.Empty; }
            }
            return result.access_token;
        }
        public static string CreateInvoiceNo(string access_token = "")
        {
            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsAccessToken result = new clsAccessToken();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/v2/invoicing/generate-next-invoice-number");
                //client.DefaultRequestHeaders.Add("Content-Type", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.PostAsync("", content).Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = JsonConvert.DeserializeObject<clsAccessToken>(response.Content.ReadAsStringAsync().Result);
                }
                else { result.invoice_number = string.Empty; }
            }
            return result.invoice_number;
        }
    }
    public class clsAccessToken
    {
        public string scope { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string app_id { get; set; }
        public string nonce { get; set; }
        public string invoice_number { get; set; }
    }
}