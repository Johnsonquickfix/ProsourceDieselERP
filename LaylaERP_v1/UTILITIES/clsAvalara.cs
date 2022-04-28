namespace LaylaERP.UTILITIES
{
    using Newtonsoft.Json;
    using RestSharp;
    using System;
    using System.Net;
    using System.Text;

    public class clsAvalara
    {
        private static string base_url = "https://sandbox-rest.avatax.com";
        public static decimal GetTaxCombinedRate(string varpostcode, string varstreet, string varcity, string varstate, string varcountry)
        {
            string username = "peterb@quickwebsitefix.com", password = "Presto55555!";
            decimal totalRate = 0;
            var client = new RestClient(base_url + "/api/v2/taxrates/byaddress");
            var request = new RestRequest(Method.GET);
            var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}"));
            request.AddHeader("Authorization", "Basic " + base64String);
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("line1", varstreet, ParameterType.QueryString);
            request.AddParameter("city", varcity, ParameterType.QueryString);
            request.AddParameter("region", varstate, ParameterType.QueryString);
            request.AddParameter("postalCode", varpostcode, ParameterType.QueryString);
            request.AddParameter("country", varcountry, ParameterType.QueryString);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                //result = response.Content;
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(response.Content);
                totalRate = obj.totalRate;
            }
            return (totalRate);
        }
        public static TaxJarModel GetTaxes(TaxJarModel taxJarModel)
        {
            string username = "peterb@quickwebsitefix.com", password = "Presto55555!";
            decimal totalRate = 0;
            var client = new RestClient(base_url + "/api/v2/taxrates/byaddress");
            var request = new RestRequest(Method.GET);
            var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}"));
            request.AddHeader("Authorization", "Basic " + base64String);
            //request.AddHeader("Content-Type", "application/json");
            request.AddQueryParameter("line1", taxJarModel.to_street);
            request.AddQueryParameter("city", taxJarModel.to_city);
            request.AddQueryParameter("region", taxJarModel.to_state);
            request.AddQueryParameter("postalCode", taxJarModel.to_zip);
            request.AddQueryParameter("country", taxJarModel.to_country);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                //result = response.Content;
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(response.Content);
                totalRate = obj.totalRate;
            }
            taxJarModel.order_total_amount = 0;
            taxJarModel.taxable_amount = 0;
            taxJarModel.amount_to_collect = 0;
            taxJarModel.rate = totalRate;
            taxJarModel.freight_taxable = false;
            return taxJarModel;
        }
        public static string CreateOrder(string username, string password, string data)
        {
            string result = string.Empty;
            var client = new RestClient(base_url + "/api/v2/transactions/create");
            var request = new RestRequest(Method.POST);
            var base64String = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}"));
            request.AddHeader("Authorization", "Basic " + base64String);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Accept", "application/json");
            request.AddParameter("application/json", data, ParameterType.RequestBody);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == HttpStatusCode.Created)
            {
                result = response.Content;
            }
            return result;
        }
    }
}