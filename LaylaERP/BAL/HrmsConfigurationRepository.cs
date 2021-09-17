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
        public static DataSet GetEmployeeCode()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT fk_emp, emp_number from erp_hrms_empdetails order by rowid");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetEmployeeName(string id)
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT ehe.rowid, concat(firstname,' ',lastname) as name, ehd.emp_number from erp_hrms_emp ehe inner join erp_hrms_empdetails ehd on ehd.fk_emp = ehe.rowid where ehd.fk_emp = '"+id+"'");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
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
                DS = SQLHelper.ExecuteDataSet("SELECT account_number, label from erp_accounting_account");

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

        public static int AddEmployeeBasicDetails(HrmsModel model, int id)
        {
            try
            {
                string strsql = "INSERT into erp_hrms_empdetails(fk_emp,birthplace, maritalstatus, address1, address2, city, state, zipcode,country   )" +
                                 " values(@fk_emp, @birthplace, @maritalstatus, @address1, @address2, @city, @state, @zipcode, @country); SELECT LAST_INSERT_ID();";


                MySqlParameter[] para =
                {
                    //2nd table
                    new MySqlParameter("@fk_emp", id),
                    new MySqlParameter("@birthplace", model.birthplace),
                    new MySqlParameter("@maritalstatus",model.maritalstatus),
                    new MySqlParameter("@address1", model.address1),
                    new MySqlParameter("@address2", model.address2),
                    new MySqlParameter("@city", model.city),
                    new MySqlParameter("@state", model.state),
                    new MySqlParameter("@zipcode", model.zipcode),
                    new MySqlParameter("@country", model.country),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddConfiguration(HrmsConfigurationModel model)
        {
            try
            {
                string strsql = "INSERT into erp_hrms_salary_configuration(emp_type, fk_emp, basic, emp_code, da, hra, other_allowance, pf, loan_amount, loan_emi, loan_months, adv_amount, adv_emi, adv_emi_months, tds, other_deductions, reimbursement, work_type, default_work_hours, prepare_salary, accounting_type)" +
                                 " values(@emp_type, @fk_emp, @basic, @emp_code, @da, @hra, @other_allowance, @pf, @loan_amount, @loan_emi, @loan_months, @adv_amount, @adv_emi, @adv_emi_months, @tds, @other_deductions, @reimbursement, @work_type, @default_work_hours, @prepare_salary, @accounting_type); SELECT LAST_INSERT_ID();";
                
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
                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}