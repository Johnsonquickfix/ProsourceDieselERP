using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CustomerModel : PaggingModel
    {
        public long ID { get; set; }
        public string user_login { get; set; }
        [Display(Name = "Nick Name")]
        [Required]
        public string user_nicename { get; set; }
        [Display(Name = "Email")]
        [Required]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Please enter a valid e-mail adress")]
        public string user_email { get; set; }
        [Required]
        [Display(Name = "First Name")]
        public string first_name { get; set; }
        [Required]
        [Display(Name = "Last Name")]
        public string last_name { get; set; }
        [Required]
        [Display(Name = "Address 1")]
        public string billing_address_1 { get; set; }
        
        [Display(Name = "Address 2")]
        public string billing_address_2 { get; set; }

        [Required]
        [Display(Name = "City")]
        public string billing_city { get; set; }
        [Required]
        [Display(Name = "Post/Zip Code")]
        public string billing_postcode { get; set; }
        [Required]
        [Display(Name = "Country/Region")]
        public string billing_country { get; set; }
        [Required]
        [Display(Name = "State/Country")]
        public string billing_state { get; set; }
        [Required]
        [Display(Name = "Contact No.")]
        [DataType(DataType.PhoneNumber)]
        public string billing_phone { get; set; }
        [Display(Name = "Billing Email")]
        public string billing_email { get; set; }

        [Required]
        [Display(Name = "Shipping First Name")]
        public string shipping_first_name { get; set; }
        [Required]
        [Display(Name = "Shipping Last Name")]
        public string shipping_last_name { get; set; }
        [Required]
        [Display(Name = "Shipping Address 1")]
        public string shipping_address_1 { get; set; }

        [Display(Name = "Shipping Address 2")]
        public string shipping_address_2 { get; set; }

        [Required]
        [Display(Name = "Shipping City")]
        public string shipping_city { get; set; }
        [Required]
        [Display(Name = "Shipping Post/Zip Code")]
        public string shipping_postcode { get; set; }
        [Required]
        [Display(Name = "Shipping Country/Region")]
        public string shipping_country { get; set; }
        [Required]
        [Display(Name = "Shipping State/Country")]
        public string shipping_state { get; set; }
        [Required]
        [Display(Name = "Shipping Contact No.")]
        [DataType(DataType.PhoneNumber)]
        public string shipping_phone { get; set; }

        public DateTime? user_registered { get; set; }
        public string display_name { get; set; }
        public string user_image { get; set; }
        public string user_url { get; set; }
        public string user_activation_key { get; set; }
        public string user_status { get; set; }
        public string user_pass { get; set; }
        public string meta_key { get; set; }
        public string meta_value { get; set; }
        public long umeta_id { get; set; }
        public long user_id { get; set; }
        public string Search { get; set; }
        public string strVal { get; set; }
        public byte[] myimage { get; set; }
    }
}