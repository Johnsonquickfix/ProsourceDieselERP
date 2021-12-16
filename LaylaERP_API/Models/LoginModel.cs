namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class LoginModel
    {
        public Int64? id { get; set; }

        [Display(Name = "User Name")]
        [Required(ErrorMessage = "Please fill valid username !!!")]
        public string user_login { get; set; }

        [Required(ErrorMessage = "Please fill Password !!!")]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        public string user_pass { get; set; }

        public string user_nicename { get; set; }
        public string user_email { get; set; }
        public string display_name { get; set; }
        public string billing_phone { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string nickname { get; set; }
        public DateTime user_registered { get; set; }
        public string role { get; set; }
        public bool is_active { get; set; }
    }
}