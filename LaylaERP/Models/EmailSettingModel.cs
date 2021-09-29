using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class EmailSettingModel
    {
        public string option_name { get; set; }

        public string recipients { get; set; }

        public string subject { get; set; }

        public string email_heading { get; set; }

        public string additional_content { get; set; }

        public string email_type { get; set; }

        public int is_active { get; set; }
        public string woocommerce_email_from_name { get; set; }
        public string woocommerce_email_from_address { get; set; }
        public string woocommerce_email_header_image { get; set; }
        public string woocommerce_email_footer_text { get; set; }
    }
    public class EmailNotificationsModel
    {
        public string option_name { get; set; }

        public string recipients { get; set; }

        public string site_title { get; set; }

        public string order_number { get; set; }

        public string site_address { get; set; }

        public string site_url { get; set; }
    }
}