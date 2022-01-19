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
    public class UserEditModel
    {
        public Int64 user_id { get; set; }
        public string email { get; set; }
        public string current_pwd { get; set; }
        public string new_pwd { get; set; }
        public string conf_pwd { get; set; }
        public string display_name { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public UserEditModel()
        {
            user_id = 0;
            email = current_pwd = new_pwd = conf_pwd = display_name = first_name = last_name = string.Empty;
        }
    }

    public class UserBillingModel
    {
        public Int64 user_id { get; set; }
        public string billing_address_1 { get; set; }
        public string billing_address_2 { get; set; }
        public string billing_city { get; set; }
        public string billing_company { get; set; }
        public string billing_country { get; set; }
        public string billing_email { get; set; }
        public string billing_first_name { get; set; }
        public string billing_last_name { get; set; }
        public string billing_phone { get; set; }
        public string billing_postcode { get; set; }
        public string billing_state { get; set; }

        public UserBillingModel()
        {
            user_id = 0;
            billing_address_1 = billing_address_2 = billing_city = billing_company = billing_country = billing_email = billing_first_name = billing_last_name = billing_phone = billing_postcode = billing_state = string.Empty;
        }
    }

    public class UserShippingModel
    {
        public Int64 user_id { get; set; }
        public string shipping_address_1 { get; set; }
        public string shipping_address_2 { get; set; }
        public string shipping_city { get; set; }
        public string shipping_company { get; set; }
        public string shipping_country { get; set; }
        public string shipping_email { get; set; }
        public string shipping_first_name { get; set; }
        public string shipping_last_name { get; set; }
        public string shipping_phone { get; set; }
        public string shipping_postcode { get; set; }
        public string shipping_state { get; set; }

        public UserShippingModel()
        {
            user_id = 0;
            shipping_address_1 = shipping_address_2 = shipping_city = shipping_company = shipping_country = shipping_email = shipping_first_name = shipping_last_name = shipping_phone = shipping_postcode = shipping_state = string.Empty;
        }
    }
}