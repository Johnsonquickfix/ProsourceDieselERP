namespace LaylaERP.Controllers.API
{
    using BAL.qfk;
    using Models.qfk.TrackAndIdentify;
    using Newtonsoft.Json;
    using System;
    using System.Text;
    using System.Web.Http;

    [RoutePrefix("api/identify")]
    public class TrackController : ApiController
    {
        //// GET: api/Track
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET: api/Track/5
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
                TrackProfileActivity obj = JsonConvert.DeserializeObject<TrackProfileActivity>(json);
                if (string.IsNullOrWhiteSpace(obj.CustomerProperties.Email)) return 0;

                return TrackAndIdentifyRepository.ProfileUpdate("track", 2, json);
            }
            catch { return 0; }
        }


        // POST: api/Track
        public int Post([FromBody] FormDataRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Data)) return 0;
            TrackProfileActivity obj = JsonConvert.DeserializeObject<TrackProfileActivity>(request.Data);
            if (string.IsNullOrWhiteSpace(obj.Event)) return 0;
            if (string.IsNullOrWhiteSpace(obj.CustomerProperties.Email)) return 0;
            try
            {
                return TrackAndIdentifyRepository.ProfileUpdate("track", 2, request.Data);
            }
            catch { return 0; }
        }

        //// PUT: api/Track/5
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/Track/5
        //public void Delete(int id)
        //{
        //}
    }
}
