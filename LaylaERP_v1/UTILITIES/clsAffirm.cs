namespace LaylaERP.UTILITIES
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Web;

    public class clsAffirm
    {
        //private static string base_url = "https://api.affirm.com";
        private static string base_url = "https://sandbox.affirm.com";
        public static string AffirmRefund(string charge_id, decimal amount)
        {
            var result = string.Empty;
            //string public_api_key = "D7J2UM97ED9GWHG0", private_api_key = "axIXMr5R67kwYw3uWv2nZzr5XB01uMH3";
            string public_api_key = string.Empty, private_api_key = string.Empty;
            System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            if (dt.Rows.Count > 0)
            {
                public_api_key = (dt.Rows[0]["affirm_api_key"] != Convert.DBNull) ? dt.Rows[0]["affirm_api_key"].ToString().Trim() : string.Empty;
                private_api_key = (dt.Rows[0]["affirm_private_api_key"] != Convert.DBNull) ? dt.Rows[0]["affirm_private_api_key"].ToString().Trim() : string.Empty;
            }
            var request_json = "{\"amount\": "+ (amount * 100).ToString() + "}";
            var content = new StringContent(request_json, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(base_url + "/api/v2/charges/" + charge_id + "/refund");
                client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));
                var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{public_api_key}:{private_api_key}"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64String);

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                var response = client.PostAsync("", content).Result;

                if (response != null && response.IsSuccessStatusCode)
                {
                    result = response.Content.ReadAsStringAsync().Result;
                }
            }
            return result;
        }
    }
}