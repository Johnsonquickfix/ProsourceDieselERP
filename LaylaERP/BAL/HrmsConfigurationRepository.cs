using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;

namespace LaylaERP.BAL
{
    public class HrmsConfigurationRepository
    {
        public static DataSet GetEmployeeCode(int rowid)
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT ehd.emp_number, ehd.fk_emp FROM erp_hrms_emp ehe INNER join erp_hrms_empdetails ehd on ehd.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid=ehe.emp_type where eheg.rowid='"+ rowid +"'");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable GetEmployeeName(string id)
        {
            DataTable dt = new DataTable();
            try
            {
                DataSet ds = SQLHelper.ExecuteDataSet("SELECT ehe.rowid, concat(firstname,' ',lastname) as name, ehd.emp_number from erp_hrms_emp ehe inner join erp_hrms_empdetails ehd on ehd.fk_emp = ehe.rowid where ehd.fk_emp = '" + id + "'");
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataSet GetEmployeeType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT rowid, group_description as type from erp_hrms_employee_group where is_status = 1");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetAccountingType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT account_number, label from erp_accounting_account where account_number='1030'");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetWorkType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT rowid, designation from erp_hrms_designation");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddConfiguration(HrmsConfigurationModel model)
        {
            try
            {
                string strsql = "INSERT into erp_hrms_salary_configuration(emp_type, fk_emp, basic, emp_code, da, hra, other_allowance, pf, loan_amount, loan_emi, loan_months, adv_amount, adv_emi, adv_emi_months, tds, other_deductions, reimbursement, work_type, default_work_hours, prepare_salary, accounting_type, hra_type," +
                    "comp_name,section,salary_date,emp_class,special_pay,wash_allowance,incentive,cca,vpf,adv_epf,insurance,emp_welfare,imprest,misc_refund,fastival_allowance,bank_name,bank_account,epf_account,pay_sacle)" +
                                 " values(@emp_type, @fk_emp, @basic, @emp_code, @da, @hra, @other_allowance, @pf, @loan_amount, @loan_emi, @loan_months, @adv_amount, @adv_emi, @adv_emi_months, @tds, @other_deductions, @reimbursement, @work_type, @default_work_hours, @prepare_salary, @accounting_type, @hra_type," +
                                 " @comp_name, @section, @salary_date, @emp_class, @special_pay, @wash_allowance, @incentive, @cca, @vpf, @adv_epf, @insurance, @emp_welfare, @imprest, @misc_refund, @fastival_allowance, @bank_name, @bank_account, @epf_account, @pay_sacle); SELECT LAST_INSERT_ID();";

                MySqlParameter[] para =
                {
                    new MySqlParameter("@emp_type", model.emp_type),
                    new MySqlParameter("@fk_emp", model.fk_emp),
                    new MySqlParameter("@basic",model.basic),
                    new MySqlParameter("@emp_code", model.emp_code),
                    new MySqlParameter("@da", model.da),
                    new MySqlParameter("@hra", model.hra),
                    new MySqlParameter("@pf", model.pf),
                    new MySqlParameter("@loan_amount", model.loan_amount),
                    new MySqlParameter("@loan_emi", model.loan_emi),

                    new MySqlParameter("@loan_months", model.loan_months),
                    new MySqlParameter("@adv_amount", model.adv_amount),
                    new MySqlParameter("@adv_emi",model.adv_emi),
                    new MySqlParameter("@adv_emi_months", model.adv_emi_months),
                    new MySqlParameter("@tds", model.tds),
                    new MySqlParameter("@other_deductions", model.other_deductions),
                    new MySqlParameter("@reimbursement", model.reimbursement),
                    new MySqlParameter("@work_type", model.work_type),
                    new MySqlParameter("@default_work_hours", model.default_work_hours),
                    new MySqlParameter("@other_allowance", model.other_allowance),
                    new MySqlParameter("@prepare_salary", model.prepare_salary),
                    new MySqlParameter("@accounting_type", model.accounting_type),
                    new MySqlParameter("@hra_type", model.hra_type),

                    //Extra
                    new MySqlParameter("@comp_name", model.comp_name),
                    new MySqlParameter("@salary_date", model.salary_date),
                    new MySqlParameter("@emp_class", model.classemp),
                    new MySqlParameter("@special_pay", model.special_pay),
                    new MySqlParameter("@wash_allowance", model.wash_allowance),
                    new MySqlParameter("@incentive", model.incentive),
                    new MySqlParameter("@cca", model.cca),
                    new MySqlParameter("@vpf", model.vpf),
                    new MySqlParameter("@adv_epf",model.adv_epf),
                    new MySqlParameter("@insurance", model.insurance),
                    new MySqlParameter("@emp_welfare", model.emp_welfare),
                    new MySqlParameter("@imprest", model.imprest),
                    new MySqlParameter("@misc_refund", model.misc_refund),
                    new MySqlParameter("@fastival_allowance", model.fastival_allowance),
                    new MySqlParameter("@bank_name", model.bank_name),
                    new MySqlParameter("@bank_account", model.bank_account),
                    new MySqlParameter("@epf_account", model.epf_account),
                    new MySqlParameter("@pay_sacle", model.pay_sacle),
                    new MySqlParameter("@section", model.section),

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DataTable GetConfigList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ehsc.rowid as id, ehed.emp_number as code, concat(ehe.firstname,' ',ehe.lastname) as name, eheg.group_description as discription, ehe.phone, ehe.email from erp_hrms_salary_configuration ehsc inner join erp_hrms_emp ehe on ehe.rowid = ehsc.fk_emp inner join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type where 1 = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(ehe.firstname,' ',ehe.lastname) like '%" + searchid + "%' OR eheg.group_description like '%" + searchid + "%' OR ehed.emp_number like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (ehe.is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ehsc.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehsc.rowid) TotalRecord from erp_hrms_salary_configuration ehsc inner join erp_hrms_emp ehe on ehe.rowid = ehsc.fk_emp inner join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type where 1 = 1 " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable SelectConfiguration(long id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ehsc.rowid,emp_type,fk_emp,Replace(format(basic,2),',','') basic,emp_code,Replace(format(da,2),',','') as da, Replace(format(hra,2),',','') as hra, Replace(format(other_allowance,2),',','') as other_allowance,Replace(format(pf,2),',','') as pf ," +
                    "Replace(format(loan_amount,2),',','') as loan_amount, Replace(format(loan_emi,2),',','') as loan_emi,loan_months, Replace(format(adv_amount,2),',','') as adv_amount, Replace(format(adv_emi,2),',','') as adv_emi,adv_emi_months,Replace(format(tds,2),',','') as tds," +
                    " Replace(format(other_deductions,2),',','') as other_deductions, Replace(format(reimbursement,2),',','') as reimbursement,work_type,default_work_hours,prepare_salary,accounting_type,hra_type," +
                    " comp_name,section,DATE_FORMAT(salary_date,'%m-%d-%Y') as salary_date,emp_class,Replace(format(special_pay,2),',','') as special_pay,Replace(format(wash_allowance,2),',','') as wash_allowance,Replace(format(incentive,2),',','') as incentive,Replace(format(cca,2),',','') as cca,Replace(format(vpf,2),',','') as vpf,Replace(format(adv_epf,2),',','') as adv_epf," +
                    " Replace(format(insurance,2),',','') as insurance,Replace(format(emp_welfare,2),',','') as emp_welfare,Replace(format(imprest,2),',','') as imprest, Replace(format(misc_refund,2),',','') as misc_refund,Replace(format(fastival_allowance,2),',','') as fastival_allowance,bank_name,bank_account,epf_account,Replace(format(pay_sacle,2),',','') as pay_sacle, eheg.group_description as type" +
                    " from erp_hrms_salary_configuration ehsc left join erp_hrms_employee_group eheg on eheg.rowid=ehsc.emp_type WHERE ehsc.rowid='" + id + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdateConfiguration(HrmsConfigurationModel model)
        {
            try
            {
                string strsql = "UPDATE erp_hrms_salary_configuration set emp_type=@emp_type, fk_emp=@fk_emp, basic=@basic, emp_code=@emp_code, da=@da, hra=@hra, other_allowance=@other_allowance, pf=@pf, loan_amount=@loan_amount, loan_emi=@loan_emi, loan_months=@loan_months, adv_amount=@adv_amount," +
                    "adv_emi=@adv_emi, adv_emi_months=@adv_emi_months, tds=@tds, other_deductions=@other_deductions, reimbursement=@reimbursement, work_type=@work_type, default_work_hours=@default_work_hours, prepare_salary=@prepare_salary, accounting_type=@accounting_type, hra_type=@hra_type, " +
            "comp_name=@comp_name, salary_date=@salary_date, emp_class=@emp_class, special_pay=@special_pay, wash_allowance=@wash_allowance, incentive=@incentive,  " +
            "cca=@cca, vpf=@vpf, adv_epf=@adv_epf, insurance=@insurance, emp_welfare=@emp_welfare, imprest=@imprest, misc_refund=@misc_refund, fastival_allowance=@fastival_allowance, bank_name=@bank_name, bank_account=@bank_account, epf_account=@epf_account, pay_sacle=@pay_sacle, section=@section where rowid = '" + model.rowid + "';";
                MySqlParameter[] para =
                 {
                    new MySqlParameter("@emp_type", model.emp_type),
                    new MySqlParameter("@fk_emp", model.fk_emp),
                    new MySqlParameter("@basic",model.basic),
                    new MySqlParameter("@emp_code", model.emp_code),
                    new MySqlParameter("@da", model.da),
                    new MySqlParameter("@hra", model.hra),
                    new MySqlParameter("@pf", model.pf),
                    new MySqlParameter("@loan_amount", model.loan_amount),
                    new MySqlParameter("@loan_emi", model.loan_emi),

                    new MySqlParameter("@loan_months", model.loan_months),
                    new MySqlParameter("@adv_amount", model.adv_amount),
                    new MySqlParameter("@adv_emi",model.adv_emi),
                    new MySqlParameter("@adv_emi_months", model.adv_emi_months),
                    new MySqlParameter("@tds", model.tds),
                    new MySqlParameter("@other_deductions", model.other_deductions),
                    new MySqlParameter("@reimbursement", model.reimbursement),
                    new MySqlParameter("@work_type", model.work_type),
                    new MySqlParameter("@default_work_hours", model.default_work_hours),
                    new MySqlParameter("@other_allowance", model.other_allowance),
                    new MySqlParameter("@prepare_salary", model.prepare_salary),
                    new MySqlParameter("@accounting_type", model.accounting_type),
                    new MySqlParameter("@hra_type", model.hra_type),
                    //Extra
                    new MySqlParameter("@comp_name", model.comp_name),
                    new MySqlParameter("@salary_date", model.salary_date),
                    new MySqlParameter("@emp_class", model.classemp),
                    new MySqlParameter("@special_pay", model.special_pay),
                    new MySqlParameter("@wash_allowance", model.wash_allowance),
                    new MySqlParameter("@incentive", model.incentive),
                    new MySqlParameter("@cca", model.cca),
                    new MySqlParameter("@vpf", model.vpf),
                    new MySqlParameter("@adv_epf",model.adv_epf),
                    new MySqlParameter("@insurance", model.insurance),
                    new MySqlParameter("@emp_welfare", model.emp_welfare),
                    new MySqlParameter("@imprest", model.imprest),
                    new MySqlParameter("@misc_refund", model.misc_refund),
                    new MySqlParameter("@fastival_allowance", model.fastival_allowance),
                    new MySqlParameter("@bank_name", model.bank_name),
                    new MySqlParameter("@bank_account", model.bank_account),
                    new MySqlParameter("@epf_account", model.epf_account),
                    new MySqlParameter("@pay_sacle", model.pay_sacle),
                    new MySqlParameter("@section", model.section),
                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DataTable SelectDAList()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT rowid,da_rate1,da_rate2,da_rate_others,from_date from erp_hrms_DA order by rowid DESC";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddHRADetails(HrmsConfigurationModel model)
        {
            try
            {
                string strsql = "INSERT into erp_hrms_HRA(basic1, basic2, hra_office, hra_field, from_date)" +
                                 " values(@basic1, @basic2, @hra_office, @hra_field, @from_date); SELECT LAST_INSERT_ID();";


                MySqlParameter[] para =
                {
                    new MySqlParameter("@basic1",model.basic1),
                    new MySqlParameter("@basic2", model.basic2),
                    new MySqlParameter("@hra_office",model.hra_office),
                    new MySqlParameter("@hra_field", model.hra_field),
                    new MySqlParameter("@from_date", model.from_date),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        /*
        public static DataTable GetHRAList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid as id, format(basic1,2) as basic1, format(basic2,2) as basic2 , format(hra_office,2) as hra_office, format(hra_field,2) as hra_field, DATE_FORMAT(from_date, '%m%d%y') as from_date from erp_hrms_HRA where 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (rowid like '%" + searchid + "%' OR basic1 like '%" + searchid + "%' OR basic2 like '%" + searchid + "%' OR hra_office like '%" + searchid + "%' OR hra_field like '%" + searchid + "%' OR from_date like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (ehe.is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_hrms_HRA where 1=1 " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }*/
        
        public static DataTable SelectHRAList(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT rowid as id, Replace(format(basic1,2),',','') as basic1, Replace(format(basic2,2),',','') as basic2 , Replace(format(hra_office,2),',','') as hra_office, Replace(format(hra_field,2),',','') as hra_field, DATE_FORMAT(from_date, '%m-%d-%Y') as from_date from erp_hrms_HRA where rowid='" + id +"'"; 
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        
        public static DataTable GetHRAList()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid as id, format(basic1,2) as basic1, format(basic2,2) as basic2 , format(hra_office,2) as hra_office, format(hra_field,2) as hra_field, DATE_FORMAT(from_date, '%m-%d-%Y') as from_date from erp_hrms_HRA where 1=1";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
               
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateHRA(HrmsConfigurationModel model)
        {
            try
            {
                string strsql = "UPDATE erp_hrms_HRA set basic1=@basic1, basic2=@basic2, hra_office=@hra_office, hra_field=@hra_field, from_date=@from_date where rowid = '" + model.rowid + "';";
                MySqlParameter[] para =
                 {
                    new MySqlParameter("@basic1",model.basic1),
                    new MySqlParameter("@basic2", model.basic2),
                    new MySqlParameter("@hra_office",model.hra_office),
                    new MySqlParameter("@hra_field", model.hra_field),
                    new MySqlParameter("@from_date", model.from_date),
                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DataTable HRAValue(long basic)
        {
            DataTable dt = new DataTable();
            try
            {
                if (basic > 0)
                {
                    string strSql = "SELECT * from erp_hrms_HRA where basic1 >='" + basic + "' or basic2 <='" + basic + "' order by rowid DESC";
                    DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                    dt = ds.Tables[0];
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable SelectConfigSetting()
        {
            DataTable dt = new DataTable();
            try
            {

                string strSql = "SELECT * from erp_hrms_config_setting";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateConfigSetting(empconfigsetting model)
        {
            try
            {
                string strsql = "UPDATE erp_hrms_config_setting set basic=@basic, special_pay=@special_pay, washing_allowance=@washing_allowance, other_allowance=@other_allowance, incentive=@incentive, cca=@cca, " +
                    "epf=@epf,vpf=@vpf, adv_staff=@adv_staff, adv_epf=@adv_epf, incometax=@incometax, insurance=@insurance, loan_emi=@loan_emi, emp_walfare=@emp_walfare, imprest=@imprest, misc_refund=@misc_refund, festival_adv=@festival_adv, hra_percent=@hra_percent, hra_slab=@hra_slab, hra_percent_value=@hra_percent_value where rowid ='" + model.rowid + "'";
                MySqlParameter[] para =
                 {
                    new MySqlParameter("@basic",model.basic),
                    new MySqlParameter("@special_pay", model.special_pay),
                    new MySqlParameter("@washing_allowance",model.washing_allowance),
                    new MySqlParameter("@other_allowance", model.other_allowance),
                    new MySqlParameter("@incentive", model.incentive),

                    new MySqlParameter("@cca",model.cca),
                    new MySqlParameter("@epf", model.epf),
                    new MySqlParameter("@vpf",model.vpf),
                    new MySqlParameter("@adv_staff", model.adv_staff),
                    new MySqlParameter("@adv_epf", model.adv_epf),

                    new MySqlParameter("@incometax",model.incometax),
                    new MySqlParameter("@insurance", model.insurance),
                    new MySqlParameter("@loan_emi",model.loan_emi),
                    new MySqlParameter("@emp_walfare", model.emp_walfare),
                    new MySqlParameter("@imprest", model.imprest),

                    new MySqlParameter("@misc_refund",model.misc_refund),
                    new MySqlParameter("@festival_adv", model.festival_adv),
                    new MySqlParameter("@hra_percent",model.hra_percent),
                    new MySqlParameter("@hra_slab", model.hra_slab),
                    new MySqlParameter("@hra_percent_value", model.hra_percent_value),
                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DataTable GetDA()
        {
            DataTable dt = new DataTable();
            try
            {

                string strSql = "SELECT format(da_rate1,2) as da_rate1,format(da_rate2,2) as da_rate2,format(da_rate_others,2) as da_rate_others,DATE_FORMAT(from_date, '%m-%d-%Y') as from_date FROM erp_hrms_DA order by rowid DESC limit 1";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}