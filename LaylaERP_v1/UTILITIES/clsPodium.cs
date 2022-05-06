using Newtonsoft.Json;
using RestSharp;
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
        private static string locationUid = "6c2ee0d4-0429-5eac-b27c-c3ef0c8f0bc7";
        public static string GetToken()
        {
            // string client_id = "2f936404-dabc-4cf7-a61b-80e6bef42f66", client_secret = "fd4b08be31c507860517f1f411b216d2beea25076348fe4fb0311073080e94df", refresh_token = "703ddfb54f8f811bdfdc77356a6a9d66168ce97865ab029557dbbf7e15ded85f";
            string client_id = string.Empty, client_secret = string.Empty, refresh_token = string.Empty;
            System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            if (dt.Rows.Count > 0)
            {
                client_id = (dt.Rows[0]["podiumAPIKey"] != Convert.DBNull) ? dt.Rows[0]["podiumAPIKey"].ToString().Trim() : string.Empty;
                client_secret = (dt.Rows[0]["podiumSecretKey"] != Convert.DBNull) ? dt.Rows[0]["podiumSecretKey"].ToString().Trim() : string.Empty;
                refresh_token = (dt.Rows[0]["podium_refresh_code"] != Convert.DBNull) ? dt.Rows[0]["podium_refresh_code"].ToString().Trim() : string.Empty;
            }

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
        public static string GetPodiumInvoiceDetails(string access_token, string podium_uid)
        {
            var result = string.Empty;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.podium.com/v4/invoices/" + podium_uid + "?locationUid="+ locationUid);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.GetAsync("").Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = response.Content.ReadAsStringAsync().Result;
                }
            }
            return result;
        }
        public static string CreatePodiumInvoice(string channelIdentifier, string customerName, string invoiceNumber, string lineItems, string pay_id)
        {
            string invoice_info = string.Empty;
            // string client_id = "2f936404-dabc-4cf7-a61b-80e6bef42f66", client_secret = "fd4b08be31c507860517f1f411b216d2beea25076348fe4fb0311073080e94df", refresh_token = "703ddfb54f8f811bdfdc77356a6a9d66168ce97865ab029557dbbf7e15ded85f";
            string client_id = string.Empty, client_secret = string.Empty, refresh_token = string.Empty;
            System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            if (dt.Rows.Count > 0)
            {
                client_id = (dt.Rows[0]["podiumAPIKey"] != Convert.DBNull) ? dt.Rows[0]["podiumAPIKey"].ToString().Trim() : string.Empty;
                client_secret = (dt.Rows[0]["podiumSecretKey"] != Convert.DBNull) ? dt.Rows[0]["podiumSecretKey"].ToString().Trim() : string.Empty;
                refresh_token = (dt.Rows[0]["podium_refresh_code"] != Convert.DBNull) ? dt.Rows[0]["podium_refresh_code"].ToString().Trim() : string.Empty;
            }

            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("client_id", client_id));
            tokenServerPairs.Add(new KeyValuePair<string, string>("client_secret", client_secret));
            tokenServerPairs.Add(new KeyValuePair<string, string>("refresh_token", refresh_token));
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "refresh_token"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsPodiumAccessToken result = new clsPodiumAccessToken();
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://accounts.podium.com/oauth/token");
            client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            var response = client.PostAsync("", content).Result;

            if (response != null && response.IsSuccessStatusCode)
            {
                result = JsonConvert.DeserializeObject<clsPodiumAccessToken>(response.Content.ReadAsStringAsync().Result);
            }
            else { result.access_token = string.Empty; }

            if (!string.IsNullOrEmpty(result.access_token))
            {
                if (!string.IsNullOrEmpty(pay_id))
                {
                    var client_cancel = new RestClient("https://api.podium.com/v4/invoices/" + pay_id + "/cancel");
                    var request_cancel = new RestRequest(Method.POST);
                    request_cancel.AddHeader("Accept", "application/json");
                    request_cancel.AddHeader("Content-Type", "application/json");
                    request_cancel.AddHeader("Authorization", "Bearer " + result.access_token);
                    request_cancel.AddParameter("application/json", "{\"locationUid\":\"" + locationUid + "\",\"note\":\"Invoice has been canceled.\"}", ParameterType.RequestBody);
                    IRestResponse response_cancel = client_cancel.Execute(request_cancel);
                }


                var client_rest = new RestClient("https://api.podium.com/v4/invoices");
                var request = new RestRequest(Method.POST);
                request.AddHeader("Accept", "application/json");
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", "Bearer " + result.access_token);
                request.AddParameter("application/json", "{\"channelIdentifier\":\"" + channelIdentifier + "\",\"customerName\":\"" + customerName + "\",\"invoiceNumber\":\"" + invoiceNumber + "\",\"locationUid\":\"" + locationUid + "\",\"lineItems\":" + lineItems + "}", ParameterType.RequestBody);
                IRestResponse response_rest = client_rest.Execute(request);

                if (response_rest.StatusCode == HttpStatusCode.OK)
                {
                    invoice_info = response_rest.Content;
                }
            }
            return invoice_info;
        }
        public static string CancelPodiumInvoice(string pay_id)
        {
            string invoice_info = string.Empty;
            // string client_id = "2f936404-dabc-4cf7-a61b-80e6bef42f66", client_secret = "fd4b08be31c507860517f1f411b216d2beea25076348fe4fb0311073080e94df", refresh_token = "703ddfb54f8f811bdfdc77356a6a9d66168ce97865ab029557dbbf7e15ded85f";
            string client_id = string.Empty, client_secret = string.Empty, refresh_token = string.Empty;
            System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            if (dt.Rows.Count > 0)
            {
                client_id = (dt.Rows[0]["podiumAPIKey"] != Convert.DBNull) ? dt.Rows[0]["podiumAPIKey"].ToString().Trim() : string.Empty;
                client_secret = (dt.Rows[0]["podiumSecretKey"] != Convert.DBNull) ? dt.Rows[0]["podiumSecretKey"].ToString().Trim() : string.Empty;
                refresh_token = (dt.Rows[0]["podium_refresh_code"] != Convert.DBNull) ? dt.Rows[0]["podium_refresh_code"].ToString().Trim() : string.Empty;
            }

            List<KeyValuePair<string, string>> tokenServerPairs = new List<KeyValuePair<string, string>>();
            tokenServerPairs.Add(new KeyValuePair<string, string>("client_id", client_id));
            tokenServerPairs.Add(new KeyValuePair<string, string>("client_secret", client_secret));
            tokenServerPairs.Add(new KeyValuePair<string, string>("refresh_token", refresh_token));
            tokenServerPairs.Add(new KeyValuePair<string, string>("grant_type", "refresh_token"));
            var content = new FormUrlEncodedContent(tokenServerPairs);
            clsPodiumAccessToken result = new clsPodiumAccessToken();
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://accounts.podium.com/oauth/token");
            client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            var response = client.PostAsync("", content).Result;

            if (response != null && response.IsSuccessStatusCode)
            {
                result = JsonConvert.DeserializeObject<clsPodiumAccessToken>(response.Content.ReadAsStringAsync().Result);
            }
            else { result.access_token = string.Empty; }

            if (!string.IsNullOrEmpty(result.access_token))
            {
                var client_cancel = new RestClient("https://api.podium.com/v4/invoices/" + pay_id + "/cancel");
                var request_cancel = new RestRequest(Method.POST);
                request_cancel.AddHeader("Accept", "application/json");
                request_cancel.AddHeader("Content-Type", "application/json");
                request_cancel.AddHeader("Authorization", "Bearer " + result.access_token);
                request_cancel.AddParameter("application/json", "{\"locationUid\":\"" + locationUid + "\",\"note\":\"Invoice has been canceled.\"}", ParameterType.RequestBody);
                IRestResponse response_cancel = client_cancel.Execute(request_cancel);
                if (response_cancel.StatusCode == HttpStatusCode.OK)
                {
                    invoice_info = response_cancel.Content;
                }
            }
            return invoice_info;
        }

        public static string PodiumInvoiceRefund(clsPodiumModal modal)
        {
            string invoice_info = string.Empty;
            string access_token = GetToken();

            if (!string.IsNullOrEmpty(access_token))
            {
                var client_rest = new RestClient("https://api.podium.com/v4/invoices/" + modal.invoiceNumber + "/refund");
                var request = new RestRequest(Method.POST);
                request.AddHeader("Accept", "application/json");
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", "Bearer " + access_token);
                request.AddParameter("application/json", "{\"reason\":\"" + modal.reason + "\",\"note\":\"\",\"amount\":\"" + modal.amount + "\",\"locationUid\":\"" + modal.locationUid + "\",\"paymentUid\":\"" + modal.uid + "\"}", ParameterType.RequestBody);
                IRestResponse response_rest = client_rest.Execute(request);

                if (response_rest.StatusCode == HttpStatusCode.OK)
                {
                    invoice_info = response_rest.Content;
                }
            }
            return invoice_info;
        }
    }
    public class clsPodiumAccessToken
    {
        public string access_token { get; set; }
        public string refresh_token { get; set; }
        public string expires_in { get; set; }
    }

    public class clsPodiumModal
    {
        public string uid { get; set; }
        public int amount { get; set; }
        public string channelIdentifier { get; set; }
        public string customerName { get; set; }
        public string locationUid { get; set; }
        public string reason { get; set; }
        public string invoiceNumber { get; set; }
        public string lineItems { get; set; }
    }
}