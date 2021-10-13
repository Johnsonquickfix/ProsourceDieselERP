namespace LaylaERP.UTILITIES
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Reflection;
    using System.Web;
    using AmazonPay;
    using AmazonPay.CommonRequests;
    using AmazonPay.StandardPaymentRequests;

    public class clsAmazonPay
    {
        public static string RefundTransaction(string TransactionID, decimal TransactionAmount)
        {
            Configuration clientConfig = new Configuration();
            clientConfig.WithMerchantId("test").WithAccessKey("test").WithSecretKey("test")
                .WithCurrencyCode(Regions.currencyCode.USD)
                .WithClientId("test")
                .WithRegion(Regions.supportedRegions.us).WithSandbox(true)
                .WithPlatformId("test")
                .WithCABundleFile("test")
                .WithApplicationName("Layla ERP")
                .WithApplicationVersion("1.0.0")
                .WithProxyHost("")
                .WithProxyPort(-1)
                .WithAutoRetryOnThrottle(true);

            Dictionary<string, string> expectedParameters = new Dictionary<string, string>()
            {
                {"Action","Refund"},
                {"SellerId","test"},
                {"AmazonCaptureId","test"},
                {"RefundReferenceId","test"},
                {"RefundAmount.Amount","10.05"},
                {"RefundAmount.CurrencyCode","USD"},
                {"SellerRefundNote","test"},
                {"SoftDescriptor","test"},
                {"MWSAuthToken","test"}
            };

            // Test direct call to CalculateSignatureAndParametersToString
            Client client = new Client(clientConfig);
            client.SetTimeStamp("0000");

            //MethodInfo method = GetMethod("CalculateSignatureAndParametersToString");
            //method.Invoke(client, new object[] { expectedParameters }).ToString();

            MethodInfo method = client.GetType().GetMethod("CalculateSignatureAndParametersToString", BindingFlags.NonPublic | BindingFlags.Instance);
            method.Invoke(client, new object[] { expectedParameters }).ToString();
            IDictionary<string, string> expectedParamsDict = client.GetParameters();

            // Test call to the API Refund
            client = new Client(clientConfig);
            client.SetTimeStamp("0000");
            RefundRequest refund = new RefundRequest();
            refund.WithAmazonCaptureId("test")
                .WithAmount(10.05m)
                .WithCurrencyCode(Regions.currencyCode.USD)
                .WithMerchantId("test")
                .WithMWSAuthToken("test")
                .WithRefundReferenceId("test")
                .WithSellerRefundNote("test")
                .WithSoftDescriptor("test");
            client.Refund(refund);
            IDictionary<string, string> apiParametersDict = client.GetParameters();

            //CollectionAssert.AreEqual(apiParametersDict, expectedParamsDict);
            //var apiRequest = new ApiRequest(apiPath, HttpMethod.POST, refundRequest, headers);

            //var result = CallAPI<RefundResponse>(apiRequest);


            //return transId;
            return "";
        }
    }
}