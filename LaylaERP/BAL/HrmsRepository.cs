using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;

namespace LaylaERP.BAL
{
    public class HrmsRepository
    {
        public static DataSet GetDesignation()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, designation from erp_hrms_designation order by rowid limit 50;");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetDepartment()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, department from erp_hrms_department order by rowid limit 50;");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddEmployee(HrmsModel model)
        {

            try
            {
                string strsql = "INSERT into erp_hrms_emp(firstname, lastname, email, emp_type, dob, phone, gender, is_active )" +
                    " values(@firstname, @lastname, @email, @emp_type, @dob, @phone, @gender, @is_active );SELECT LAST_INSERT_ID();";


                MySqlParameter[] para =
                {
                    new MySqlParameter("@firstname", model.firstname),
                    new MySqlParameter("@lastname",model.lastname),
                    new MySqlParameter("@email", model.email),
                    new MySqlParameter("@emp_type", model.emp_type),
                    new MySqlParameter("@dob", model.dob),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@gender", model.gender),
                    new MySqlParameter("@is_active", model.is_active),

               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddEmployeeDetails(HrmsModel model, int id)
        {

            try
            {
                
                string strsql = "INSERT into erp_hrms_empdetails(fk_emp,birthplace, maritalstatus, address1, address2, city, state, zipcode,country, emp_number, designation, department, undertaking_emp, joining_date, leaving_date, basic_sal, unpaid_leave_perday, bank_account_title,bank_name, account_number, bank_swift_code  )" +
                                 " values(@fk_emp, @birthplace, @maritalstatus, @address1, @address2, @city, @state, @zipcode, @country, @emp_number, @designation, @department, @undertaking_emp, @joining_date, @leaving_date, @basic_sal, @unpaid_leave_perday, @bank_account_title, @bank_name, @account_number, @bank_swift_code); SELECT LAST_INSERT_ID();";


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
                    new MySqlParameter("@emp_number", model.emp_number),
                    new MySqlParameter("@designation", model.designation),
                    new MySqlParameter("@department", model.department),
                    new MySqlParameter("@undertaking_emp", model.undertaking_emp),
                    new MySqlParameter("@joining_date", model.joining_date),
                    new MySqlParameter("@leaving_date", model.leaving_date),
                    new MySqlParameter("@basic_sal", model.basic_sal),
                    new MySqlParameter("@unpaid_leave_perday", model.unpaid_leave_perday),
                    new MySqlParameter("@bank_account_title", model.bank_account_title),
                    new MySqlParameter("@bank_name", model.bank_name),
                    new MySqlParameter("@account_number", model.account_number),
                    new MySqlParameter("@bank_swift_code", model.bank_swift_code),

               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

    }
}