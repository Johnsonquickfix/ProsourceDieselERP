namespace LaylaERP.Models.qfk.Content
{
    using Newtonsoft.Json.Linq;
    using System.Web;

    public class AuthModel
    {
        public long projectId { get; set; }
        public string authorization { get; set; } = string.Empty;
        public string domain { get; set; } = string.Empty;
        public string referrer { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public string userId { get; set; } = string.Empty;
    }

    public class EditorResponse
    {
        public bool success { get; set; } = false;
        public JObject data { get; set; }
    }

    public class FontModel
    {
        public string label { get; set; } = string.Empty;
        public string value { get; set; } = string.Empty;
        public string url { get; set; } = string.Empty;
        public bool defaultFont { get; set; } = false;
        public int? weights { get; set; } = null;
    }

    public class FileUploadModel
    {
        public string authorization { get; set; } = string.Empty;
        public string filename { get; set; } = string.Empty;
        public int height { get; set; } = 0;
        public int width { get; set; } = 0;
        public string source { get; set; } = string.Empty;
        public HttpPostedFileBase image { get; set; }
        //public HttpPostedFile image { get; set; }
    }
}