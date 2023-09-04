namespace LaylaERP.Controllers.API
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Models.qfk.TrackAndIdentify;
    using BAL.qfk;
    using Newtonsoft.Json;
    using System.Text;

    [RoutePrefix("api/identify")]
    public class IdentifyController : ApiController
    {
        // GET: api/identify
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET: api/identify/5
        public int Get([FromUri] FormDataRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Data)) return 0;
                // Convert the Base64 string to a byte array
                byte[] bytes = Convert.FromBase64String(request.Data);

                // Convert the byte array to a string
                string json = Encoding.UTF8.GetString(bytes);
                if (string.IsNullOrWhiteSpace(json)) return 0;
                Identify obj = JsonConvert.DeserializeObject<Identify>(json);
                if (string.IsNullOrWhiteSpace(obj.Properties.Email)) return 0;

                return TrackAndIdentifyRepository.ProfileUpdate("identify", 2, request.Data);
            }
            catch { return 0; }
        }

        // POST: api/identify
        public int Post([FromBody] FormDataRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Data)) return 0;
            Identify obj = JsonConvert.DeserializeObject<Identify>(request.Data);
            if (string.IsNullOrWhiteSpace(obj.Properties.Email)) return 0;
            try
            {
                return TrackAndIdentifyRepository.ProfileUpdate("identify", 2, request.Data);
            }
            catch { return 0; }
        }

        //// PUT: api/identify/5
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/identify/5
        //public void Delete(int id)
        //{
        //}
    }
}
