using LaylaERP.DAL;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using LaylaERP.UTILITIES;

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

                SqlParameter[] para =
                {
                    new SqlParameter("@emp_type", model.emp_type),
                    new SqlParameter("@fk_emp", model.fk_emp),
                    new SqlParameter("@basic",model.basic),
                    new SqlParameter("@emp_code", model.emp_code),
                    new SqlParameter("@da", model.da),
                    new SqlParameter("@hra", model.hra),
                    new SqlParameter("@pf", model.pf),
                    new SqlParameter("@loan_amount", model.loan_amount),
                    new SqlParameter("@loan_emi", model.loan_emi),

                    new SqlParameter("@loan_months", model.loan_months),
                    new SqlParameter("@adv_amount", model.adv_amount),
                    new SqlParameter("@adv_emi",model.adv_emi),
                    new SqlParameter("@adv_emi_months", model.adv_emi_months),
                    new SqlParameter("@tds", model.tds),
                    new SqlParameter("@other_deductions", model.other_deductions),
                    new SqlParameter("@reimbursement", model.reimbursement),
                    new SqlParameter("@work_type", model.work_type),
                    new SqlParameter("@default_work_hours", model.default_work_hours),
                    new SqlParameter("@other_allowance", model.other_allowance),
                    new SqlParameter("@prepare_salary", model.prepare_salary),
                    new SqlParameter("@accounting_type", model.accounting_type),
                    new SqlParameter("@hra_type", model.hra_type),

                    //Extra
                    new SqlParameter("@comp_name", model.comp_name),
                    new SqlParameter("@salary_date", model.salary_date),
                    new SqlParameter("@emp_class", model.classemp),
                    new SqlParameter("@special_pay", model.special_pay),
                    new SqlParameter("@wash_allowance", model.wash_allowance),
                    new SqlParameter("@incentive", model.incentive),
                    new SqlParameter("@cca", model.cca),
                    new SqlParameter("@vpf", model.vpf),
                    new SqlParameter("@adv_epf",model.adv_epf),
                    new SqlParameter("@insurance", model.insurance),
                    new SqlParameter("@emp_welfare", model.emp_welfare),
                    new SqlParameter("@imprest", model.imprest),
                    new SqlParameter("@misc_refund", model.misc_refund),
                    new SqlParameter("@fastival_allowance", model.fastival_allowance),
                    new SqlParameter("@bank_name", model.bank_name),
                    new SqlParameter("@bank_account", model.bank_account),
                    new SqlParameter("@epf_account", model.epf_account),
                    new SqlParameter("@pay_sacle", model.pay_sacle),
                    new SqlParameter("@section", model.section),

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
                string strSql = string.Empty;
                string strWhr = string.Empty;
                long id = CommanUtilities.Provider.GetCurrent().UserID;
                if (CommanUtilities.Provider.GetCurrent().UserType == "Administrator")
                {
                    strSql = "SELECT ehsc.rowid as id, ehed.emp_number as code, concat(ehe.firstname,' ',ehe.lastname) as name, eheg.group_description as discription, Replace(Replace(Replace(Replace(ehe.phone,')',''),'(',''),'-',''),' ','') as phone, ehe.email from erp_hrms_salary_configuration ehsc inner join erp_hrms_emp ehe on ehe.rowid = ehsc.fk_emp inner join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type where 1 = 1 ";
                }
                else
                {
                    strSql = "SELECT ehsc.rowid as id, ehed.emp_number as code, concat(ehe.firstname,' ',ehe.lastname) as name, eheg.group_description as discription, Replace(Replace(Replace(Replace(ehe.phone,')',''),'(',''),'-',''),' ','') as phone, ehe.email from erp_hrms_salary_configuration ehsc inner join erp_hrms_emp ehe on ehe.rowid = ehsc.fk_emp inner join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type where ehe.fk_user ='" + id + "' ";
                }
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(ehe.firstname,' ',ehe.lastname) like '%" + searchid + "%' OR eheg.group_description like '%" + searchid + "%' OR ehed.emp_number like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (ehe.is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} OFFSET {2} ROWS FETCH NEXT {3} ROWS ONLY", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                if (CommanUtilities.Provider.GetCurrent().UserType == "Administrator")
                {
                    strSql += "; SELECT (Count(ehsc.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehsc.rowid) TotalRecord from erp_hrms_salary_configuration ehsc inner join erp_hrms_emp ehe on ehe.rowid = ehsc.fk_emp inner join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type where 1 = 1 " + strWhr.ToString();
                }
                else
                {
                    strSql += "; SELECT (Count(ehsc.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehsc.rowid) TotalRecord from erp_hrms_salary_configuration ehsc inner join erp_hrms_emp ehe on ehe.rowid = ehsc.fk_emp inner join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid inner join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type where ehe.fk_user ='" + id + "' " + strWhr.ToString();
                }

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
                string strquery = "SELECT ehsc.rowid,emp_type,fk_emp,Replace(Convert(decimal(18,2),basic),',','') basic,emp_code, Replace(Convert(decimal(18, 2), da), ',', '') as da, Replace(Convert(decimal(18, 2), hra), ',', '') as hra, " +
                    "Replace(Convert(decimal(18, 2), other_allowance), ',', '') as other_allowance,Replace(Convert(decimal(18, 2), pf), ',', '') as pf , Replace(Convert(decimal(18, 2), loan_amount), ',', '') as loan_amount, Replace(Convert(decimal(18, 2), loan_emi), ',', '') as loan_emi,loan_months, " +
                    "Replace(Convert(decimal(18, 2), adv_amount), ',', '') as adv_amount, Replace(Convert(decimal(18, 2), adv_emi), ',', '') as adv_emi, adv_emi_months,Replace(Convert(decimal(18, 2), tds), ',', '') as tds, Replace(Convert(decimal(18, 2), other_deductions), ',', '') as other_deductions, " +
                    "Replace(Convert(decimal(18, 2), reimbursement), ',', '') as reimbursement,work_type,default_work_hours,prepare_salary,accounting_type,hra_type, comp_name,section, FORMAT(salary_date, 'MM-dd-yy') as salary_date,emp_class,Replace(Convert(decimal(18, 2), special_pay), ',', '') as special_pay, " +
                    "Replace(Convert(decimal(18, 2), wash_allowance), ',', '') as wash_allowance,Replace(Convert(decimal(18, 2), incentive), ',', '') as incentive, Replace(Convert(decimal(18, 2), cca), ',', '') as cca, Replace(Convert(decimal(18, 2), vpf), ',', '') as vpf,Replace(Convert(decimal(18, 2), adv_epf), ',', '') as adv_epf, " +
                    "Replace(Convert(decimal(18, 2), insurance), ',', '') as insurance,Replace(Convert(decimal(18, 2), emp_welfare), ',', '') as emp_welfare,Replace(Convert(decimal(18, 2), imprest), ',', '') as imprest, Replace(Convert(decimal(18, 2), misc_refund), ',', '') as misc_refund,Replace(Convert(decimal(18, 2), fastival_allowance), ',', '') as fastival_allowance,bank_name,bank_account, " +
                    "epf_account,Replace(Convert(decimal(18, 2), pay_sacle), ',', '') as pay_sacle, eheg.group_description as type from erp_hrms_salary_configuration ehsc left join erp_hrms_employee_group eheg on eheg.rowid = ehsc.emp_type WHERE ehsc.rowid='" + id + "'";

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
                SqlParameter[] para =
                 {
                    new SqlParameter("@emp_type", Convert.ToInt32(model.emp_type)),
                    new SqlParameter("@fk_emp",  Convert.ToInt32(model.fk_emp)),
                    new SqlParameter("@basic", Convert.ToDecimal(model.basic)),
                    new SqlParameter("@emp_code", Convert.ToInt32(model.emp_code)),
                    new SqlParameter("@da",Convert.ToDecimal(model.da)),
                    new SqlParameter("@hra", Convert.ToDecimal(model.hra)),
                    new SqlParameter("@pf", Convert.ToDecimal(model.pf)),
                    new SqlParameter("@loan_amount", Convert.ToDecimal(model.loan_amount)),
                    new SqlParameter("@loan_emi",Convert.ToDecimal(model.loan_emi)),

                    new SqlParameter("@loan_months",  Convert.ToInt32(model.loan_months)),
                    new SqlParameter("@adv_amount",Convert.ToDecimal(model.adv_amount)),
                    new SqlParameter("@adv_emi",Convert.ToDecimal(model.adv_emi)),
                    new SqlParameter("@adv_emi_months", Convert.ToInt32(model.adv_emi_months)),
                    new SqlParameter("@tds", Convert.ToDecimal(model.tds)),
                    new SqlParameter("@other_deductions", Convert.ToDecimal(model.other_deductions)),
                    new SqlParameter("@reimbursement", Convert.ToDecimal(model.reimbursement)),
                    new SqlParameter("@work_type", Convert.ToInt32(model.work_type)),
                    new SqlParameter("@default_work_hours", model.default_work_hours),
                    new SqlParameter("@other_allowance", Convert.ToDecimal(model.other_allowance)),
                    new SqlParameter("@prepare_salary", Convert.ToInt32(model.prepare_salary)),
                    new SqlParameter("@accounting_type", Convert.ToInt32(model.accounting_type)),
                    new SqlParameter("@hra_type", Convert.ToInt32(model.hra_type)),
                    //Extra
                    new SqlParameter("@comp_name", model.comp_name),
                    new SqlParameter("@salary_date", Convert.ToDateTime(model.salary_date)),
                    new SqlParameter("@emp_class", model.classemp ?? (object)DBNull.Value),
                    new SqlParameter("@special_pay",Convert.ToDecimal(model.special_pay)),
                    new SqlParameter("@wash_allowance",Convert.ToDecimal(model.wash_allowance)),
                    new SqlParameter("@incentive", Convert.ToDecimal(model.incentive)),
                    new SqlParameter("@cca", Convert.ToDecimal(model.cca)),
                    new SqlParameter("@vpf", Convert.ToDecimal(model.vpf)),
                    new SqlParameter("@adv_epf",Convert.ToDecimal(model.adv_epf)),
                    new SqlParameter("@insurance", Convert.ToDecimal(model.insurance)),
                    new SqlParameter("@emp_welfare",Convert.ToDecimal(model.emp_welfare)),
                    new SqlParameter("@imprest", Convert.ToDecimal(model.imprest)),
                    new SqlParameter("@misc_refund", Convert.ToDecimal(model.misc_refund)),
                    new SqlParameter("@fastival_allowance", Convert.ToDecimal(model.fastival_allowance)),
                    new SqlParameter("@bank_name", model.bank_name),
                    new SqlParameter("@bank_account", model.bank_account),
                    new SqlParameter("@epf_account", model.epf_account),
                    new SqlParameter("@pay_sacle", Convert.ToDecimal(model.pay_sacle)),
                    new SqlParameter("@section", model.section ?? (object)DBNull.Value),
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


                SqlParameter[] para =
                {
                    new SqlParameter("@basic1",model.basic1),
                    new SqlParameter("@basic2", model.basic2),
                    new SqlParameter("@hra_office",model.hra_office),
                    new SqlParameter("@hra_field", model.hra_field),
                    new SqlParameter("@from_date", model.from_date),
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
                SqlParameter[] para =
                 {
                    new SqlParameter("@basic1",model.basic1),
                    new SqlParameter("@basic2", model.basic2),
                    new SqlParameter("@hra_office",model.hra_office),
                    new SqlParameter("@hra_field", model.hra_field),
                    new SqlParameter("@from_date", model.from_date),
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
                SqlParameter[] para =
                 {
                    new SqlParameter("@basic",model.basic),
                    new SqlParameter("@special_pay", model.special_pay),
                    new SqlParameter("@washing_allowance",model.washing_allowance),
                    new SqlParameter("@other_allowance", model.other_allowance),
                    new SqlParameter("@incentive", model.incentive),

                    new SqlParameter("@cca",model.cca),
                    new SqlParameter("@epf", model.epf),
                    new SqlParameter("@vpf",model.vpf),
                    new SqlParameter("@adv_staff", model.adv_staff),
                    new SqlParameter("@adv_epf", model.adv_epf),

                    new SqlParameter("@incometax",model.incometax),
                    new SqlParameter("@insurance", model.insurance),
                    new SqlParameter("@loan_emi",model.loan_emi),
                    new SqlParameter("@emp_walfare", model.emp_walfare),
                    new SqlParameter("@imprest", model.imprest),

                    new SqlParameter("@misc_refund",model.misc_refund),
                    new SqlParameter("@festival_adv", model.festival_adv),
                    new SqlParameter("@hra_percent",model.hra_percent),
                    new SqlParameter("@hra_slab", model.hra_slab),
                    new SqlParameter("@hra_percent_value", model.hra_percent_value),
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