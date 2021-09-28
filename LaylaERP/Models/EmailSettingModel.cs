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
    }
}