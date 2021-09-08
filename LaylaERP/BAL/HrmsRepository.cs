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

        public static int EditEmployee(HrmsModel model, int ID)
        {

            try
            {
                string strsql = "Update erp_hrms_emp set firstname=@firstname,lastname=@lastname,email=@email,emp_type=@emp_type,dob=@dob," +
                   "phone=@phone,gender=@gender,is_active=@is_active where rowid=@rowid";

                MySqlParameter[] para =
                {
                    new MySqlParameter("@rowid", ID),
                    new MySqlParameter("@firstname", model.firstname),
                    new MySqlParameter("@lastname",model.lastname),
                    new MySqlParameter("@email", model.email),
                    new MySqlParameter("@emp_type", model.emp_type),
                    new MySqlParameter("@dob", model.dob),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@gender", model.gender),
                    new MySqlParameter("@is_active", model.is_active),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
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

        public static int EditEmployeeDetails(HrmsModel model, int id)
        {

            try
            {

                string strsql = "update erp_hrms_empdetails set birthplace=@birthplace, maritalstatus=@maritalstatus, address1=@address1, address2=@address2, " +
                    "city = @city, state = @state, zipcode = @zipcode,country = @country, emp_number = @emp_number, " +
                    "designation = @designation, department = @department, undertaking_emp = @undertaking_emp, joining_date = @joining_date, " +
                    "leaving_date = @leaving_date, basic_sal = @basic_sal, unpaid_leave_perday = @unpaid_leave_perday, bank_account_title = @bank_account_title," +
                    "bank_name = @bank_name, account_number = @account_number, bank_swift_code = @bank_swift_code where fk_emp = @fk_emp";


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
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetEmployeeList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select rowid ID, concat(firstname,' ',lastname) as name, email,phone,gender,emp_type,is_active from erp_hrms_emp where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (firstname like '%" + searchid + "%' OR lastname like '%" + searchid + "%' OR email like '%" + searchid + "%' OR phone like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_hrms_emp where 1 = 1 " + strWhr.ToString();

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
        public int UpdateEmployeeStatus(HrmsModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_hrms_emp set is_active=@is_active where rowid=@ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ID", model.rowid),
                    new MySqlParameter("@is_active", model.is_active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetEmployeeByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select e.rowid, e.firstname,e.lastname,e.dob, e.email,e.phone,e.gender,e.emp_type,e.is_active, " +
                    "d.birthplace,d.maritalstatus,d.address1,d.address2,d.city,d.state,d.zipcode,d.country,d.emp_number,d.designation,d.department,d.undertaking_emp," +
                    "d.joining_date,d.leaving_date,d.basic_sal,d.unpaid_leave_perday,d.bank_account_title,d.bank_name,d.account_number, " +
                    "d.bank_swift_code,d.note_public,d.note_private " +
                    "from erp_hrms_emp e left join erp_hrms_empdetails d on d.fk_emp = e.rowid where is_active = 1 and e.rowid = '" + id + "'";
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