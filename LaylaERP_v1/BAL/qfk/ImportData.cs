namespace LaylaERP.BAL.qfk
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;

    public class ImportData
    {
        public Task<int> ImportProductFromCustomSources(long company_id, long user_id, long sources_id, string source_url)
        {
            //int i = 0;
            return Task.Run(() =>
            {
                try
                {
                    var result = string.Empty;
                    var content = new StringContent("{}", Encoding.UTF8, "application/json");
                    using (var client = new HttpClient())
                    {
                        //client.BaseAddress = new Uri("https://prosourcediesel.com/prosourceexportdata.php");
                        client.BaseAddress = new Uri(source_url);
                        client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                        //var response = client.PostAsJsonAsync("", content).Result;
                        var response = client.GetAsync("").Result;

                        if (response != null && response.IsSuccessStatusCode)
                        {
                            result = response.Content.ReadAsStringAsync().Result;
                        }
                    }

                    if (!string.IsNullOrEmpty(result) && result != "null")
                    {
                        CatalogRepository.SourceAdd("importproduct", company_id, user_id, sources_id, result);
                    }
                    else
                    {
                        CatalogRepository.SourceAdd("importproduct", company_id, user_id, sources_id, string.Empty);
                    }
                }
                catch { }//{ status = false; }
                return 0;
            });
        }
    }
}