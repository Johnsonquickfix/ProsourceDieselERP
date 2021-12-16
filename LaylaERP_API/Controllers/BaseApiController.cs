namespace LaylaERP_API.Controllers
{
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Web.Configuration;
    using System.Web.Http;

    public class BaseApiController : ApiController
    {
        public string IKEYValue = WebConfigurationManager.AppSettings["IKey"];

        internal static string GetHeader(HttpRequestMessage thisReq)
        {
            var retVal = string.Empty;
            IEnumerable<string> values = new List<string>();
            thisReq.Headers.TryGetValues("userName", out values);
            retVal = ((string[])values)[0];
            return retVal;
        }
    }
}