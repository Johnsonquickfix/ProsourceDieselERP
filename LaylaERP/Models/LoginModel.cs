namespace LaylaERP.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Web;


    public class LoginModel
    {
        public int? userId { get; set; }

        [Display(Name = "User Name")]
        [Required(ErrorMessage = "Please fill valid username !!!")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Please fill Password !!!")]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        public string PassWord { get; set; }

        public string ConfirmPassword { get; set; }
        public int roleid { get; set; }
        public int menu_id { get; set; }
        public string menu_url { get; set; }
    }
    public class ActivityLogModel
    {
        public string ModuleURL { get; set; }
        public string ModuleName { get; set; }
    }
}