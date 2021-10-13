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
        public string insperity_id { get; set; }
        //erp_employee_details
        public int rowid1 { get; set; }
        public int fk_emp { get; set; }
        public int fk_user { get; set; }
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
        public string joining_date { get; set; }
        public string leaving_date { get; set; }
        public double basic_sal { get; set; }
        public double unpaid_leave_perday { get; set; }
        public string bank_name { get; set; }
        public string bank_account_title { get; set; }
        public string account_number { get; set; }
        public string bank_swift_code { get; set; }
        public string note_public { get; set; }
        public string note_private { get; set; }
        public string bloodgroup { get; set; }
        public string education { get; set; }
        public string professionalqualification { get; set; }
        public string otherdetails { get; set; }
        public string alternateaddress1 { get; set; }
        public string alternateaddress2 { get; set; }
        public string alternatecity { get; set; }
        public string alternatestate { get; set; }
        public string alternatezipcode { get; set; }
        public string alternatecountry { get; set; }
        public string alternatecontactNumber { get; set; }
        public byte[] ImageFiledata { get; set; }
        public string ImagePath { get; set; }
        public string ProfileImagePath { get; set; }
        public HttpPostedFileBase ImageFile { get; set; }
        public string EmployeeLinkedFilesID { get; set; }
        public string strValue1 { get; set; }
        public string strValue2 { get; set; }
        public string strValue3 { get; set; }
        public string strValue4 { get; set; }
        public string strValue5 { get; set; }
    }

    public class AttendenceModel
    {
        public string strValue1 { get; set; }
        public string strValue2 { get; set; }
        public string strValue3 { get; set; }
        public string strValue4 { get; set; }
        public string strValue5 { get; set; }
    }
}