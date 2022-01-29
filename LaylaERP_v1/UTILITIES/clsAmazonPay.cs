namespace LaylaERP.UTILITIES
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Reflection;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;
    using AmazonPay;
    using AmazonPay.CommonRequests;
    using AmazonPay.StandardPaymentRequests;
    using RestSharp;

    public class clsAmazonPay
    {
        private static string base_url = "https://mws.amazonservices.com";//Demo
        private static string request_url = "OffAmazonPayments_Sandbox/2013-01-01/";//Demo
        //private static string base_url = "https://mws.amazonservices.com/OffAmazonPayments/2013-01-01/";//Online
        public static void RefundTransaction(long order_id, string amazon_capture_id, decimal refund_amount)
        {
            string AWSAccessKeyId = "AKIAJE4IGB5OSLXYVEKA";
            string SellerId = "A2G8SO21DNS4R0";
            string Secret_Key = "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";
            string PlatformId = "A1BVJDFFHQ7US4";
            string Client_id = "amzn1.application-oa2-client.7ab5b60f08b54277b9eda5d573dca98d";
            //var result = string.Empty;


            RestClient client = new RestClient("https://mws.amazonservices.de");
            client.DefaultParameters.Clear();
            client.ClearHandlers();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("AWSAccessKeyId", AWSAccessKeyId);
            parameters.Add("Action", "Refund");
            parameters.Add("AmazonCaptureId", amazon_capture_id);
            parameters.Add("RefundAmount.Amount", refund_amount.ToString());
            parameters.Add("RefundAmount.CurrencyCode", "USD");
            parameters.Add("RefundReferenceId", "SO-" + order_id);
            parameters.Add("SellerRefundNote", "");            
            parameters.Add("Timestamp", DateTime.UtcNow.ToString("s") + "Z");
            parameters.Add("Version", "2013-01-01");
            //parameters.Add("SignatureMethod", "HmacSHA256");
            parameters.Add("SignatureVersion", "2");

            RestRequest request = new RestRequest(request_url, Method.POST);
            string signature = AmzLibrary.SignParameters(parameters, Secret_Key);
            parameters.Add("Signature", signature);

            foreach (KeyValuePair<string, string> keyValuePair in parameters)
            {
                request.AddParameter(keyValuePair.Key, keyValuePair.Value);
            }

            IRestResponse result = client.Execute(request);

            //var content = new FormUrlEncodedContent(parameters);

            //using (var client = new HttpClient())
            //{
            //    client.BaseAddress = new Uri(base_url);
            //    //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
            //    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            //    var response = client.PostAsync("",content).Result;

            //    if (response != null && response.IsSuccessStatusCode)
            //    {
            //        result = response.Content.ReadAsStringAsync().Result;
            //    }
            //}
            //return result;
        }
        public static string RefundTransaction_old(long order_id, string TransactionID, decimal TransactionAmount)
        {
            string AWSAccessKeyId = "AKIAJE4IGB5OSLXYVEKA";
            string SellerId = "A2G8SO21DNS4R0";
            string Secret_Key = "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";
            string PlatformId = "A1BVJDFFHQ7US4";
            string Client_id = "client-id:amzn1.application-oa2-client.7ab5b60f08b54277b9eda5d573dca98d";

            Configuration clientConfig = new Configuration();
            clientConfig.WithMerchantId(SellerId)
                .WithAccessKey(AWSAccessKeyId)
                .WithSecretKey(Secret_Key)
                .WithCurrencyCode(Regions.currencyCode.USD)
                .WithClientId(Client_id)
                .WithRegion(Regions.supportedRegions.us).WithSandbox(true)
                .WithPlatformId(PlatformId)
                //.WithCABundleFile("test")
                //.WithApplicationName("Layla ERP")
                //.WithApplicationVersion("1.0.0")
                .WithProxyHost("")
                .WithProxyPort(-1)
                .WithAutoRetryOnThrottle(true);

            //Dictionary<string, string> expectedParameters = new Dictionary<string, string>()
            //{
            //    {"Action","Refund"},
            //    {"SellerId",SellerId},
            //    {"AmazonCaptureId","test"},
            //    {"RefundReferenceId","test"},
            //    {"RefundAmount.Amount","10.05"},
            //    {"RefundAmount.CurrencyCode","USD"},
            //    {"SellerRefundNote","test"},
            //    {"SoftDescriptor","test"},
            //    {"MWSAuthToken","test"}
            //};

            // Test direct call to CalculateSignatureAndParametersToString
            //Client client = new Client(clientConfig);
            //client.SetTimeStamp("0000");

            //MethodInfo method = GetMethod("CalculateSignatureAndParametersToString");
            //method.Invoke(client, new object[] { expectedParameters }).ToString();

            //MethodInfo method = client.GetType().GetMethod("CalculateSignatureAndParametersToString", BindingFlags.NonPublic | BindingFlags.Instance);
            //method.Invoke(client, new object[] { expectedParameters }).ToString();
            //IDictionary<string, string> expectedParamsDict = client.GetParameters();

            // Test call to the API Refund
            Client client = new Client(clientConfig);
            client.SetTimeStamp("0000");
            RefundRequest refund = new RefundRequest();
            refund.WithAmazonCaptureId(TransactionID)
                .WithAmount(TransactionAmount)
                .WithCurrencyCode(Regions.currencyCode.USD)
                .WithMerchantId(SellerId)
                //.WithMWSAuthToken("test")
                .WithRefundReferenceId("SO-" + order_id)
                .WithSellerRefundNote("")
                .WithSoftDescriptor("");
            client.Refund(refund);
            //IDictionary<string, string> apiParametersDict = client.GetParameters();

            //CollectionAssert.AreEqual(apiParametersDict, expectedParamsDict);
            //var apiRequest = new ApiRequest(apiPath, HttpMethod.POST, refundRequest, headers);

            //var result = CallAPI<RefundResponse>(apiRequest);


            //return transId;
            return "";
        }
    }

    public static class AmzLibrary
    {
        private static string base_url = "https://mws.amazonservices.com/OffAmazonPayments_Sandbox/2013-01-01/";//Demo
        //private static string base_url = "https://mws.amazonservices.com/OffAmazonPayments/2013-01-01/";//Online
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
            Uri endpoint = new Uri(base_url);

            data.Append(endpoint.Host);
            if (endpoint.Port != 443 && endpoint.Port != 80) { data.Append(":").Append(endpoint.Port); }
            data.Append("\n");
            String uri = endpoint.AbsolutePath;
            if (uri == null || uri.Length == 0) { uri = "/"; }
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
            return Convert.ToBase64String(algorithm.ComputeHash(encoding.GetBytes(data.ToCharArray())));
        }
    }
}