namespace LaylaERP.UTILITIES
{
    using Amazon.Pay.API;
    using Amazon.Pay.API.Types;
    using Amazon.Pay.API.WebStore;

    public class clsAmazonPay
    {
        public static string RefundTransaction(string order_id, string amazon_capture_id, decimal refund_amount)
        {
            string result = string.Empty;
            string _privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRBkzTZiMcBZWzVZMmTAXmQZhyQhwYw5D4xptiPd+Dy3NPwnXamOiVr6BrzMmzL/aZan8omFgyAvm2iE/LIxGlCgUn4OsfW4h19RkJCR6vwJzoITMLCXD3mf+npM1B39pTnpWiusN6hT0UlYyGYEKcNWxP/G/6Grg77pXxlpVEUaAgsCEJddcVmMiGjG/Gpnzl705p9qptEuvFVTg/e3UjyzPoo8NHgL3c4U56DjW5t3z+XutsTauR+IJLNmHYP5FnXZ/fqUsKsNeeJG9WrF/WQUG9+hCgdZkYGveYobBp1evtFU2NgfIVQK8hRzZWFA8mJIxNLGlhoBiGQgrhiyxvAgMBAAECggEAQmygnGtwS9bggEl5BioRk98TjXfBywLW/p/KwDkOXykXv2h6IFoIS40wyyEcleNvl8hWmXV0TYxRg7akuNavpEVfZxFcVq41WtrlNlBeHpb0pfXq7R52dlDLhCBklAMJtBoIzlpQhY5y3yg5LHjJoi99+JstkIrOMkl6//eM/tToovzZmgGHk630EHLy8audJPeNQi+P7jZ+o/v2G4ce3zRNuYm91Kzd75xzPFehts0ZpZdPZexBHzAVr16ZcWufBHZ2oxvf/pV4EUIYhG/E1ruKtgwX9nUnrQh/lTQ4VXiNF/y2mnARyFKsQo3kpiyRONPxRJwwkVLNzF93ysO9oQKBgQDsC5eXIn341Q102js+bR+UKMkvhNjjva1CmDN/BwdqVwNH8MbfRKpfR7Qi1IjFZhX8QBHhssg94w7y8gNO0JMFrs4Xsu33ThdxsG6ReUFIf1SFBqJwmpfKWKpRld83cgWjLTkTXCxGR2NNAQr+OwKrVrwXgFjKX0imdhIRNXfmTwKBgQDise+qpNEqaskSp9YoMNCoTya4YGOfyJvmt3PlBfeUmINYaqcELJjdaxcFqq9+ygFjNZugkdQPXgDvUBmTqnTjYv1r5WHrc52f8CFD0IuIWKjOUsu93HcmKQhX0AIexdw2ehStZ3EqadUwjKMD0hywAoEFTGZnfGJ1LVWt1vrv4QKBgQDhgqGtDpLza/iTLvtyxKZq0hyDfZQI4GnrOaXZMknvWnoT/QDCxcNPjB2ZORwCG2nduQhcbIXKOmdJy9VFMxeDUmIrWhLnNoBHaZv497NbI+sHvDLtCYUDGHp/v4OmYRTptIbW7DSQYBuKsfhistX2A8NnYINztFygTCUus7p9GQKBgQCBGu1vteYZzi8tnMBuqz5qXImkv+B9A3cmcpxidn+F9UX4eOUdj3iPwYmfBJJmFw2rPsCfNe4bwmGt6WRnoNBpH9tMM5sMyQ+gItYPFRoiULvypVy7iG+jIANMX36VoAHGVMip6RueGB/+Qloktuj3pLVuGxDHJyO7sFH3a1QGgQKBgGskU/oveTJCslcQS22STBw5dtVU0njT2/cTG0ahcRKdQwT2rEWk+08pRh29hvKF054UeDT8AGXxSvIYjhecaI8QshHn4YYD0bN4KVdQAqHWejOoWzbYQ5e0r26sj9uhocMy5esCGxPHGHtQ1JG/2Qf26JOZ4HMCAwoaBkHSB8zf\n-----END PRIVATE KEY-----";
            ApiConfiguration payConfig = new ApiConfiguration
            (
                region: Region.UnitedStates,
                environment: Amazon.Pay.API.Types.Environment.Sandbox,
                publicKeyId: "SANDBOX-AGLGP4TYYQIJWX6QFAHSKBCU",
                privateKey: _privateKey
            );
            var client = new WebStoreClient(payConfig);
            var refundRequest = new Amazon.Pay.API.WebStore.Refund.CreateRefundRequest(amazon_capture_id, refund_amount, Currency.USD);
            var createRefund = client.CreateRefund(refundRequest, null);
            // check if API call was successful
            if (createRefund.Success)
            {
                result = createRefund.RefundId;
            }
            return result;
        }
    }
}