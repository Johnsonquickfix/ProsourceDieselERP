namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel;

    public class ResultModel
    {
        [DefaultValue(false)]
        public bool success { get; set; }
        [DefaultValue("")]
        public dynamic user_data { get; set; }
        [DefaultValue("")]
        public string error_msg { get; set; }
    }
}