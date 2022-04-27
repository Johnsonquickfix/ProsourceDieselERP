namespace LaylaERP.UTILITIES
{
    using RestSharp;
    using System.Net;

    public class clsFedex
    {
        private static string base_url = "https://apis-sandbox.fedex.com";
        public static string GetToken()
        {
            string result = string.Empty;
            string client_id = "l7e40e1dfda4e04c958f688ad2b071535f", client_secret = "b1d2efec8b344ac3a205ef2b2f1301be", grant_type = "client_credentials", shipping_account = "740561073";
            //string client_id = string.Empty, client_secret = string.Empty, refresh_token = string.Empty;
            //System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            //if (dt.Rows.Count > 0)
            //{
            //    client_id = (dt.Rows[0]["podiumAPIKey"] != Convert.DBNull) ? dt.Rows[0]["podiumAPIKey"].ToString().Trim() : string.Empty;
            //    client_secret = (dt.Rows[0]["podiumSecretKey"] != Convert.DBNull) ? dt.Rows[0]["podiumSecretKey"].ToString().Trim() : string.Empty;
            //    refresh_token = (dt.Rows[0]["podium_refresh_code"] != Convert.DBNull) ? dt.Rows[0]["podium_refresh_code"].ToString().Trim() : string.Empty;
            //}

            var client = new RestClient(base_url + "/oauth/token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", grant_type);
            request.AddParameter("client_id", client_id);
            request.AddParameter("client_secret", client_secret);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                result = response.Content;
            }
            return result;
        }
        public static string ShipTrack(string access_token, string trackingNumber)
        {
            var result = string.Empty;
            var client = new RestClient(base_url + "/track/v1/trackingnumbers");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", "Bearer " + access_token);
            request.AddHeader("X-locale", "en_US");
            request.AddHeader("Content-Type", "application/json");
            var body = "{\"trackingInfo\": [{\"trackingNumberInfo\": {\"trackingNumber\": \"" + trackingNumber + "\"}}],\"includeDetailedScans\": true}";
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                result = response.Content;
            }
            return result;
        }
    }
}