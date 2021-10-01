using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class HrmsConfigurationModel
    {
        public int rowid { get; set; }
        public int emp_type { get; set; }
        public int fk_emp { get; set; }
        public decimal basic { get; set; }
        public int emp_code { get; set; }
        public decimal da { get; set; }
        public decimal hra { get; set; }
        public decimal other_allowance { get; set; }
        public decimal pf { get; set; }
        public decimal loan_amount { get; set; }
        public decimal loan_emi { get; set; }
        public int loan_months { get; set; }
        public decimal adv_amount { get; set; }
        public decimal adv_emi { get; set; }
        public int adv_emi_months { get; set; }
        public decimal tds { get; set; }
        public decimal other_deductions { get; set; }
        public decimal reimbursement { get; set; }
        public int work_type { get; set; }
        public string default_work_hours { get; set; }
        public int prepare_salary { get; set; }
        public int accounting_type { get; set; }
        public int hra_type { get; set; }
        //HRA
        public decimal basic1 { get; set; }
        public decimal basic2 { get; set; }
        public decimal hra_office { get; set; }
        public decimal hra_field { get; set; }
        public DateTime from_date { get; set; }
        //Extra field added

        public string comp_name { get; set; }
	    public string section { get; set; }
        public DateTime salary_date { get; set; }
        public string classemp { get; set; }
        public decimal special_pay { get; set; }
        public decimal wash_allowance { get; set; }
        public decimal incentive { get; set; }
        public decimal cca { get; set; }
        public decimal vpf { get; set; }
        public decimal adv_epf { get; set; }
        public decimal insurance { get; set; }
        public decimal emp_welfare { get; set; }
        public decimal imprest { get; set; }
        public decimal misc_refund { get; set; }
        public decimal fastival_allowance { get; set; }
        public string bank_name { get; set; }
        public string bank_account { get; set; }
        public string epf_account { get; set; }
        public decimal pay_sacle { get; set; }

    }
    public class empconfigsetting
    {
        public int rowid { get; set; }
        public int basic { get; set; }
        public int special_pay { get; set; }
        public int washing_allowance { get; set; }
        public int other_allowance { get; set; }
        public int incentive { get; set; }
        public int cca { get; set; }
        public int epf { get; set; }
        public int vpf { get; set; }
        public int adv_staff { get; set; }
        public int adv_epf { get; set; }
        public int incometax { get; set; }
        public int insurance { get; set; }
        public int loan_emi { get; set; }
        public int emp_walfare { get; set; }
        public int imprest { get; set; }
        public int misc_refund { get; set; }
        public int festival_adv { get; set; }
        public int hra_percent { get; set; }
        public int hra_slab { get; set; }
    }
}
