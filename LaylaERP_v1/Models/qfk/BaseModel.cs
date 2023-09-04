namespace LaylaERP.Models.qfk
{
    public class BaseModel
    {
        public string api_key { get; set; } = string.Empty;
        public string utoken { get; set; } = string.Empty;
        public long user_id { get; set; } = 0;
    }
}