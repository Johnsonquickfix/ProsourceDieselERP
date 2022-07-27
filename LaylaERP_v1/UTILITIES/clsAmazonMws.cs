namespace LaylaERP.UTILITIES
{
    using RestSharp;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;

    public class clsAmazonMws
    {
        // Connect to the Amazon MWS REST server.
        // 
        // Make sure to connect to the correct Amazon MWS Endpoint, otherwise
        // you'll get an HTTP 401 response code.
        // 
        // The possible servers are:
        // 
        // North America (NA) 	https://mws.amazonservices.com
        // Europe (EU) 	https://mws-eu.amazonservices.com
        // India (IN) 	https://mws.amazonservices.in
        // China (CN) 	https://mws.amazonservices.com.cn
        // Japan (JP) 	https://mws.amazonservices.jp 
        //https://mws.amazonservices.de
        public static void FetchOrders()
        {
            //string AWSAccessKeyId = "0PB842EXAMPLE7N4ZTR2", SellerId = "A2NEXAMPLETF53",AWSSecretAccessKey="amzn.mws.4ea38b7b-f563-7709-4bae-87aeaEXAMPLE" ;
            string AWSAccessKeyId = "AKIA4AICNF6MDQVABEOM", SellerId = "825175650200", AWSSecretAccessKey = "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";
            //string AWSAccessKeyId = "AKIAJE4IGB5OSLXYVEKA", SellerId = "A2G8SO21DNS4R0", AWSSecretAccessKey = "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";
            RestClient client = new RestClient("https://sellingpartnerapi.amazon.com");
            client.DefaultParameters.Clear();
            client.ClearHandlers();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("AWSAccessKeyId", AWSAccessKeyId);
            parameters.Add("Action", "ListOrders");
            parameters.Add("CreatedAfter", "2018-01-01T11:34:00Z");
            parameters.Add("MarketplaceId.Id.1", "ATVPDKIKX0DER");
            parameters.Add("SellerId", SellerId);
            parameters.Add("SignatureVersion", "2");
            parameters.Add("Timestamp", DateTime.UtcNow.ToString("s") + "Z");
            parameters.Add("Version", "2013-09-01");

            RestRequest request = new RestRequest("orders/v0/orders", Method.GET);

            string signature = AmzLibrary.SignParameters(parameters, AWSSecretAccessKey);
            request.AddParameter("Signature", signature);

            foreach (KeyValuePair<string, string> keyValuePair in parameters)
            {
                request.AddParameter(keyValuePair.Key, keyValuePair.Value);
            }
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            IRestResponse response = client.Execute(request);
            //IRestResponse result = await client.ExecuteTaskAsync(request);
        }



        //public void ordersTest()
        //{
        //    RestClient restClient = new RestClient("https://sellingpartnerapi-na.amazon.com");
        //    IRestRequest restRequest = new RestRequest("orders/v0/orders", Method.GET);
        //    restRequest.AddQueryParameter("MarketplaceIds", "ATVPDKIKX0DER");
        //    DateTime checkDate = DateTime.UtcNow.AddDays(-5);
        //    restRequest.AddQueryParameter("CreatedAfter", checkDate.ToString("yyyy-MM-ddTHH:mm:ssZ"));
        //    restRequest = signRequest(restRequest, restClient);
        //    IRestResponse response = restClient.Get(restRequest);
        //}

        //public void inventoryTest()
        //{
        //    RestClient restClient = new RestClient("https://sellingpartnerapi-na.amazon.com");
        //    IRestRequest restRequest = new RestRequest("/fba/inventory/v1/summaries", Method.GET);
        //    restRequest.AddParameter("MarketplaceIds", "ATVPDKIKX0DER", ParameterType.QueryString);
        //    restRequest.AddParameter("granularityId", "ATVPDKIKX0DER", ParameterType.QueryString);
        //    restRequest.AddParameter("granularityType", "Marketplace", ParameterType.QueryString);
        //    restRequest = signRequest(restRequest, restClient);
        //    IRestResponse response = restClient.Get(restRequest);
        //}

        //private static IRestRequest signRequest(IRestRequest restRequest, RestClient restClient)
        //{
        //    string AccessKeyId = "AKIA4AICNF6MDQVABEOM", SecretKey = "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";

        //    AssumeRoleAccess roleAcccess = new AssumeRoleAccess
        //    {
        //        accessKeyId = AccessKeyId,
        //        secretKey = SecretKey,
        //    };
        //    String accessToken = TokenHandler.getAccessToken();

        //    restRequest.AddHeader("x-amz-access-token", accessToken);

        //    AWSAuthenticationCredentials AWSCredentials = new AWSAuthenticationCredentials();
        //    AWSCredentials.AccessKeyId = roleAcccess.accessKeyId;
        //    AWSCredentials.SecretKey = roleAcccess.secretKey;
        //    AWSCredentials.Region = "us-east-1";

        //    //restRequest.AddHeader("X-Amz-Security-Token", roleAcccess.sessionToken);

        //    return new AWSSigV4Signer(AWSCredentials).Sign(restRequest, restClient.BaseUrl.Host);
        //}
    }

    public static class AmzLibrary
    {
        public static string GetParametersAsString(IDictionary<String, String> parameters)
        {
            StringBuilder data = new StringBuilder();
            foreach (String key in (IEnumerable<String>)parameters.Keys)
            {
                String value = parameters[key];
                if (value != null)
                {
                    data.Append(key);
                    data.Append('=');
                    data.Append(UrlEncode(value, false));
                    data.Append('&');
                }
            }
            String result = data.ToString();
            return result.Remove(result.Length - 1);
        }

        public static String SignParameters(IDictionary<String, String> parameters, String key)
        {
            String signatureVersion = parameters["SignatureVersion"];

            KeyedHashAlgorithm algorithm = new HMACSHA1();

            String stringToSign = null;
            if ("2".Equals(signatureVersion))
            {
                String signatureMethod = "HmacSHA256";
                algorithm = KeyedHashAlgorithm.Create(signatureMethod.ToUpper());
                parameters.Add("SignatureMethod", signatureMethod);
                stringToSign = CalculateStringToSignV2(parameters);
            }
            else
            {
                throw new Exception("Invalid Signature Version specified");
            }

            return Sign(stringToSign, key, algorithm);
        }

        private static String CalculateStringToSignV2(IDictionary<String, String> parameters)
        {
            StringBuilder data = new StringBuilder();
            IDictionary<String, String> sorted =
                  new SortedDictionary<String, String>(parameters, StringComparer.Ordinal);
            data.Append("POST");
            data.Append("\n");
            Uri endpoint = new Uri("https://sellingpartnerapi.amazon.com/orders/v0/orders");

            data.Append(endpoint.Host);
            if (endpoint.Port != 443 && endpoint.Port != 80)
            {
                data.Append(":")
                    .Append(endpoint.Port);
            }
            data.Append("\n");
            String uri = endpoint.AbsolutePath;
            if (uri == null || uri.Length == 0)
            {
                uri = "/";
            }
            data.Append(UrlEncode(uri, true));
            data.Append("\n");
            foreach (KeyValuePair<String, String> pair in sorted)
            {
                if (pair.Value != null)
                {
                    data.Append(UrlEncode(pair.Key, false));
                    data.Append("=");
                    data.Append(UrlEncode(pair.Value, false));
                    data.Append("&");
                }

            }

            String result = data.ToString();
            return result.Remove(result.Length - 1);
        }

        private static String UrlEncode(String data, bool path)
        {
            StringBuilder encoded = new StringBuilder();
            String unreservedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~" + (path ? "/" : "");

            foreach (char symbol in System.Text.Encoding.UTF8.GetBytes(data))
            {
                if (unreservedChars.IndexOf(symbol) != -1)
                {
                    encoded.Append(symbol);
                }
                else
                {
                    encoded.Append("%" + String.Format("{0:X2}", (int)symbol));
                }
            }

            return encoded.ToString();

        }

        private static String Sign(String data, String key, KeyedHashAlgorithm algorithm)
        {
            Encoding encoding = new UTF8Encoding();
            algorithm.Key = encoding.GetBytes(key);
            return Convert.ToBase64String(algorithm.ComputeHash(
                encoding.GetBytes(data.ToCharArray())));
        }
    }

    class AssumeRoleAccess { public String accessKeyId; public String secretKey; public String sessionToken; }
    class AssumeRoleHandler
    {
        //private static AssumeRoleResponse roleResponse = null;

        //public static AssumeRoleAccess getAssumedRoleToken()
        //{
        //    DateTime now = DateTime.Now.AddSeconds(-10);

        //    if (roleResponse == null || DateTime.Compare(now, roleResponse.Credentials.Expiration) > 0)
        //    {
        //        roleResponse = GetAssumeRoleTokenDetail();

        //    }

        //    return new AssumeRoleAccess
        //    {
        //        accessKeyId = roleResponse.Credentials.AccessKeyId,
        //        secretKey = roleResponse.Credentials.SecretAccessKey,
        //        sessionToken = roleResponse.Credentials.SessionToken
        //    };
        //}

        //private static AssumeRoleResponse GetAssumeRoleTokenDetail()
        //{
        //    // AWS IAM user data, NOT seller central dev data
        //    var accessKey = Settings.getSetting(Settings.SettingNames.AmazonLWA_IamAccessKeyId); // get from users access key id from first step
        //    var secretKey = Settings.getSetting(Settings.SettingNames.AmazonLWA_IamSecret);   // get from users secret key from first step


        //    BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        //    AmazonSecurityTokenServiceClient client = new AmazonSecurityTokenServiceClient(credentials);
        //    AssumeRoleRequest assumeRoleRequest = new AssumeRoleRequest()
        //    {
        //        DurationSeconds = 3600,
        //        // role ARN you create here: 
        //        // https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#step-4-create-an-iam-role
        //        RoleArn = Settings.getSetting(Settings.SettingNames.AmazonLWA_IamRole),

        //        RoleSessionName = DateTime.Now.Ticks.ToString()
        //    };
        //    AssumeRoleResponse assumeRoleResponse = null;

        //    assumeRoleResponse = client.AssumeRole(assumeRoleRequest);

        //    //		Console.WriteLine(assumeRoleResponse.HttpStatusCode);

        //    return assumeRoleResponse;
        //}



    }
}