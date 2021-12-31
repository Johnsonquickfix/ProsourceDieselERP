namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel;

    public class ResultModel
    {
        [DefaultValue(false)]
        public bool success { get; set; }
        public dynamic user_data { get; set; }
        public string error_msg { get; set; }
        public ResultModel()
        {
            error_msg = string.Empty; user_data = null;
        }
    }

    public class SearchModel
    {
        public long user_id { get; set; }
        public int offset { get; set; }
        public long order_id { get; set; }
        public SearchModel()
        {
            user_id = order_id = 0; offset = 0;
        }
    }
}