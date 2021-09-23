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
    }
}