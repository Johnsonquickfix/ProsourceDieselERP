namespace LaylaERP.UTILITIES
{
    using RestSharp;
    using System.Net;

    public class clsFedex
    {
        public static string GetToken()
        {
            string result = string.Empty;
            string client_id = "l7f2a2d1689c5343e7994343d6f75cea49", client_secret = "9b2177da8d684d33a6ad663e2893caf7", grant_type = "client_credentials";
            //string client_id = string.Empty, client_secret = string.Empty, refresh_token = string.Empty;
            //System.Data.DataTable dt = BAL.Users.AppSystemSetting();
            //if (dt.Rows.Count > 0)
            //{
            //    client_id = (dt.Rows[0]["podiumAPIKey"] != Convert.DBNull) ? dt.Rows[0]["podiumAPIKey"].ToString().Trim() : string.Empty;
            //    client_secret = (dt.Rows[0]["podiumSecretKey"] != Convert.DBNull) ? dt.Rows[0]["podiumSecretKey"].ToString().Trim() : string.Empty;
            //    refresh_token = (dt.Rows[0]["podium_refresh_code"] != Convert.DBNull) ? dt.Rows[0]["podium_refresh_code"].ToString().Trim() : string.Empty;
            //}

            var client = new RestClient("https://apis-sandbox.fedex.com/oauth/token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", grant_type, ParameterType.QueryString);
            request.AddParameter("client_id", client_id, ParameterType.QueryString);
            request.AddParameter("client_secret", client_secret, ParameterType.QueryString);
            // 'input' refers to JSON Payload
            //request.AddParameter("undefined", "{}", ParameterType.RequestBody);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                result = response.Content;
            }
            return result;
        }
    }
}