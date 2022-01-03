namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel;

    public class LoginModel
    {
        public Int64? id { get; set; }
        public string user_login { get; set; }
        public string user_pass { get; set; }
        public string user_conf_pass { get; set; }
        public string user_new_pass { get; set; }
        public string user_nicename { get; set; }
        public string user_email { get; set; }
        public string display_name { get; set; }
        public string billing_phone { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string nickname { get; set; }
        public string user_registered { get; set; }
        public string role { get; set; }
        [DefaultValue(false)]
        public bool is_active { get; set; }

        public LoginModel()
        {
            id = 0;
            user_login = user_pass = user_conf_pass = user_new_pass = user_nicename = user_email = display_name = billing_phone = first_name = last_name = nickname = user_registered = role = string.Empty;
        }
    }
}