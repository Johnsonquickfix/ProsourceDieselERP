namespace LaylaERP.Models.qfk.MailTracking
{
    using Newtonsoft.Json;

    public class TrackingRequest
    {
        public long company_id { get; set; }
        public long campaign_id { get; set; }
        public string profiles_id { get; set; }
    }
}