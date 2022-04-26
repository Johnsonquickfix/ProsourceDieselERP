namespace LaylaERP.UTILITIES
{
    using RestSharp;
    using System.Net;

    public class clsFedex
    {
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

            var client = new RestClient("https://apis-sandbox.fedex.com/oauth/token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", grant_type);
            request.AddParameter("client_id", client_id);
            request.AddParameter("client_secret", client_secret);
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