using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class HrmsModel
    {
        //erp_hrms_emp
        public int rowid { get; set; }
        public int entity { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string pwd { get; set; }
        public int emp_type { get; set; }
        public DateTime dob { get; set; }
        public string phone { get; set; }
        public string gender { get; set; }
        public int is_active { get; set; }

        //erp_employee_details
        public int rowid1 { get; set; }
        public int fk_emp { get; set; }
        public string birthplace { get; set; }
        public string maritalstatus { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zipcode { get; set; }
        public string country { get; set; }
        public string emp_number { get; set; }
        public string designation { get; set; }
        public string department { get; set; }
        public string undertaking_emp { get; set; }
        public DateTime joining_date { get; set; }
        public DateTime leaving_date { get; set; }
        public double basic_sal { get; set; }
        public double unpaid_leave_perday { get; set; }
        public string bank_name { get; set; }
        public string bank_account_title { get; set; }
        public string account_number { get; set; }
        public string bank_swift_code { get; set; }
        public string note_public { get; set; }
        public string note_private { get; set; }
    }
}