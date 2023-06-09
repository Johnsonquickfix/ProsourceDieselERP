﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;

namespace LaylaERP.BAL
{
    public class HrmsRepository
    {
        private static string itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        //Password----------------

        public static string EncryptedPwd(string varPassword)
        {
            string expected = "$P$BPGbwPLs6N6VlZ7OqRUvIY1Uvo/Bh9/";
            return MD5Encode(varPassword, expected);
        }
        static string MD5Encode(string password, string hash)
        {
            string output = "*0";
            if (hash == null) return output;
            if (hash.StartsWith(output)) output = "*1";

            string id = hash.Substring(0, 3);
            // We use "$P$", phpBB3 uses "$H$" for the same thing
            if (id != "$P$" && id != "$H$") return output;

            // get who many times will generate the hash
            int count_log2 = itoa64.IndexOf(hash[3]);
            if (count_log2 < 7 || count_log2 > 30)
                return output;

            int count = 1 << count_log2;

            string salt = hash.Substring(4, 8);
            if (salt.Length != 8)
                return output;

            byte[] hashBytes = { };
            using (MD5 md5Hash = MD5.Create())
            {
                hashBytes = md5Hash.ComputeHash(Encoding.ASCII.GetBytes(salt + password));
                byte[] passBytes = Encoding.ASCII.GetBytes(password);
                do
                {
                    hashBytes = md5Hash.ComputeHash(hashBytes.Concat(passBytes).ToArray());
                } while (--count > 0);
            }

            output = hash.Substring(0, 12);
            string newHash = Encode64(hashBytes, 16);

            return output + newHash;
        }
        static string Encode64(byte[] input, int count)
        {
            StringBuilder sb = new StringBuilder();
            int i = 0;
            do
            {
                int value = (int)input[i++];
                sb.Append(itoa64[value & 0x3f]); // to uppercase
                if (i < count)
                    value = value | ((int)input[i] << 8);
                sb.Append(itoa64[(value >> 6) & 0x3f]);
                if (i++ >= count)
                    break;
                if (i < count)
                    value = value | ((int)input[i] << 16);
                sb.Append(itoa64[(value >> 12) & 0x3f]);
                if (i++ >= count)
                    break;
                sb.Append(itoa64[(value >> 18) & 0x3f]);
            } while (i < count);

            return sb.ToString();
        }
        //Password End--------------
        public static DataSet GetDesignation()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, designation from erp_hrms_designation order by rowid;");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet GetGroup()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, group_description as Text from erp_hrms_employee_group where is_status=1 order by rowid;");

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
                DS = SQLHelper.ExecuteDataSet("Select rowid, department from erp_hrms_department order by rowid;");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetEmployeeCode()
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("SELECT ('EMP' + RIGHT('00000'+CAST(coalesce(max(rowid + 1),'1') AS VARCHAR(5)),5)) as Code from erp_hrms_emp;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static int AddEmployeeBasicInfo(HrmsModel model, int UserID)
        {
            try
            {
                model.pwd = EncryptedPwd(model.pwd);
                string strsql = "INSERT into erp_hrms_emp(firstname, lastname, email,pwd, emp_type, dob, phone, gender, is_active,fk_user,insperity_id)" +
                    " values(@firstname, @lastname, @email,@pwd, @emp_type, @dob, @phone, @gender, @is_active,@fk_user,@insperity_id);SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@firstname", model.firstname),
                    new SqlParameter("@lastname",model.lastname),
                    new SqlParameter("@email", model.email),
                    new SqlParameter("@pwd", model.pwd),
                    new SqlParameter("@emp_type", model.emp_type),
                    new SqlParameter("@dob", model.dob),
                    new SqlParameter("@phone", model.phone),
                    new SqlParameter("@gender", model.gender),
                    new SqlParameter("@is_active", model.is_active),
                    new SqlParameter("@fk_user", UserID),
                    new SqlParameter("@insperity_id",model.insperity_id),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + model.rowid + "", "Insert employee basic details");
                throw Ex;
            }
        }

        public static int EditEmployeeBasicInfo(HrmsModel model, int ID)
        {
            try
            {
                //model.pwd = EncryptedPwd(model.pwd);
                string strsql = "Update erp_hrms_emp set firstname=@firstname,lastname=@lastname,email=@email,emp_type=@emp_type,dob=@dob," +
                   "phone=@phone,gender=@gender,is_active=@is_active,insperity_id=@insperity_id where rowid=@rowid";
                SqlParameter[] para =
                {
                    new SqlParameter("@rowid", ID),
                    new SqlParameter("@firstname", model.firstname),
                    new SqlParameter("@lastname",model.lastname),
                    new SqlParameter("@email", model.email),
                    //new SqlParameter("@pwd", model.pwd),
                    new SqlParameter("@emp_type", model.emp_type),
                    new SqlParameter("@dob", model.dob),
                    new SqlParameter("@phone", model.phone),
                    new SqlParameter("@gender", model.gender),
                    new SqlParameter("@is_active", model.is_active),
                    new SqlParameter("@insperity_id",model.insperity_id),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + model.rowid + "", "Update employee basic details");
                throw Ex;
            }
        }
        //Add customers
        public static DataTable AddNewEmployeeasUser(HrmsModel model, byte[] image)
        {
            try
            {
                model.pwd = EncryptedPwd(model.pwd);
                string username = model.firstname + " " + model.lastname;
                //string strsql = "insert into wp_users(user_login,user_pass,user_nicename, user_email, user_registered, display_name, user_image) values(@user_login,@user_pass,@user_nicename, @user_email, @user_registered, @display_name, @user_image);SELECT SCOPE_IDENTITY();";
                string strsql = "erp_Employee";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_login", model.email),
                    new SqlParameter("@user_pass", model.pwd),
                    new SqlParameter("@user_nicename", username),
                    new SqlParameter("@user_email", model.email),
                    new SqlParameter("@user_registered", Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new SqlParameter("@display_name", username),
                    new SqlParameter("@user_image", image),
                    new SqlParameter("@qflag", "I"),
                };
                DataTable result = SQLHelper.ExecuteDataTable(strsql, para);
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + model.rowid + "", "Insert employee basic details in user");
                throw Ex;
            }
        }
        public static void AddEmployeeUserMetaData(long id)
        {
            try
            {
                string varFieldsName = "wp_capabilities", varFieldsValue = "employee";
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value); select SCOPE_IDENTITY() as ID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + id + "", "Insert employee meta details");
                throw Ex;
            }
        }

        public static void AddUserEmployeeMetaData(HrmsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value); select SCOPE_IDENTITY() as ID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + id + "", "Insert employee meta details");
                throw Ex;
            }
        }

        public static void UpdateUserEmployeeMetaData(HrmsModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "UPDATE wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + id + "", "Update employee meta details");
                throw Ex;
            }
        }

        public static int AddEmployeeBasicDetails(HrmsModel model, int id)
        {
            try
            {
                string strsql = "INSERT into erp_hrms_empdetails(fk_emp,birthplace, maritalstatus, address1, address2, city, state, zipcode,country,emp_number   )" +
                                 " values(@fk_emp, @birthplace, @maritalstatus, @address1, @address2, @city, @state, @zipcode, @country,('EMP' + RIGHT('00000'+CAST(coalesce(" + id + ",'1') AS VARCHAR(5)),5))); SELECT SCOPE_IDENTITY();";

                SqlParameter[] para =
                {
                    //2nd table
                    new SqlParameter("@fk_emp", id),

                    new SqlParameter("@birthplace", model.birthplace ?? (object)DBNull.Value),
                    new SqlParameter("@maritalstatus",model.maritalstatus ?? (object)DBNull.Value),
                    new SqlParameter("@address1", model.address1),
                    new SqlParameter("@address2", model.address2 ?? (object)DBNull.Value),
                    new SqlParameter("@city", model.city),
                    new SqlParameter("@state", model.state),
                    new SqlParameter("@zipcode", model.zipcode),
                    new SqlParameter("@country", model.country),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + model.rowid + "", "Insert employee details");
                throw Ex;
            }
        }

        public static int EditEmployeeBasicDetails(HrmsModel model, int id)
        {

            try
            {

                string strsql = "update erp_hrms_empdetails set birthplace=@birthplace, maritalstatus=@maritalstatus, address1=@address1, address2=@address2, " +
                    "city = @city, state = @state, zipcode = @zipcode,country = @country where fk_emp = @fk_emp";


                SqlParameter[] para =
                {
                    //2nd table
                    new SqlParameter("@fk_emp",id),
                    new SqlParameter("@birthplace", model.birthplace ?? (object)DBNull.Value),
                    new SqlParameter("@maritalstatus",model.maritalstatus ?? (object)DBNull.Value),
                    new SqlParameter("@address1", model.address1),
                    new SqlParameter("@address2", model.address2 ?? (object)DBNull.Value),
                    new SqlParameter("@city", model.city),
                    new SqlParameter("@state", model.state),
                    new SqlParameter("@zipcode", model.zipcode),
                    new SqlParameter("@country", model.country),
                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + model.rowid + "", "Update employee details");
                throw Ex;
            }
        }

        public static int EditEmployeeAdditionalInfo(HrmsModel model, int id)
        {
            try
            {

                string strsql = "update erp_hrms_empdetails set " +
                    "designation = @designation, department = @department, undertaking_emp = @undertaking_emp, joining_date = @joining_date, " +
                    "leaving_date = @leaving_date,bloodgroup=@bloodgroup,education=@education,professionalqualification=@professionalqualification,otherdetails=@otherdetails," +
                    "alternateaddress1 = @alternateaddress1,alternateaddress2 = @alternateaddress2,alternatecity = @alternatecity,alternatestate = @alternatestate," +
                    "alternatezipcode = @alternatezipcode,alternatecountry = @alternatecountry,alternatecontactNumber = @alternatecontactNumber where fk_emp = @fk_emp";
                SqlParameter[] para =
                {
                    //2nd table("@fk_emp", System.Data.SqlDbType.Int) { Value = id }
                    new SqlParameter("@fk_emp", System.Data.SqlDbType.Int) { Value = id },
                    //new SqlParameter("@emp_number", model.emp_number),
                    new SqlParameter("@designation", model.designation ?? (object)DBNull.Value),
                    new SqlParameter("@department", model.department ?? (object)DBNull.Value),
                    new SqlParameter("@undertaking_emp", model.undertaking_emp ?? (object)DBNull.Value),
                    new SqlParameter("@joining_date", model.joining_date ?? (object)DBNull.Value),
                    new SqlParameter("@leaving_date", model.leaving_date ?? (object)DBNull.Value),
                    new SqlParameter("@bloodgroup", model.bloodgroup ?? (object)DBNull.Value),
                    new SqlParameter("@education", model.education ?? (object)DBNull.Value),
                    new SqlParameter("@professionalqualification", model.professionalqualification ?? (object)DBNull.Value),
                    new SqlParameter("@otherdetails", model.otherdetails ?? (object)DBNull.Value),
                    new SqlParameter("@alternateaddress1", model.alternateaddress1 ?? (object)DBNull.Value),
                    new SqlParameter("@alternateaddress2", model.alternateaddress2 ?? (object)DBNull.Value),
                    new SqlParameter("@alternatecity", model.alternatecity ?? (object)DBNull.Value),
                    new SqlParameter("@alternatestate", model.alternatestate ?? (object)DBNull.Value),
                    new SqlParameter("@alternatezipcode", model.alternatezipcode ?? (object)DBNull.Value),
                    new SqlParameter("@alternatecountry", model.alternatecountry ?? (object)DBNull.Value),
                    new SqlParameter("@alternatecontactNumber", model.alternatecontactNumber ?? (object)DBNull.Value),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditSalaryInfo(HrmsModel model, int id)
        {
            try
            {
                string strsql = "update erp_hrms_empdetails set basic_sal = @basic_sal, unpaid_leave_perday = @unpaid_leave_perday where fk_emp = @fk_emp";
                SqlParameter[] para =
                {
                    //2nd table
                    new SqlParameter("@fk_emp", id),
                    new SqlParameter("@basic_sal", model.basic_sal),
                    new SqlParameter("@unpaid_leave_perday", model.unpaid_leave_perday),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + id + "", "Update employee salary details");
                throw Ex;
            }
        }
        public static int EditBankInfo(HrmsModel model, int id)
        {

            try
            {

                string strsql = "update erp_hrms_empdetails set bank_account_title = @bank_account_title," +
                    "bank_name = @bank_name, account_number = @account_number, bank_swift_code = @bank_swift_code where fk_emp = @fk_emp";
                SqlParameter[] para =
                {
                    //2nd table
                    new SqlParameter("@fk_emp", id),
                    new SqlParameter("@bank_account_title", model.bank_account_title ?? (object)DBNull.Value),
                    new SqlParameter("@bank_name", model.bank_name ?? (object)DBNull.Value),
                    new SqlParameter("@account_number", model.account_number ?? (object)DBNull.Value),
                    new SqlParameter("@bank_swift_code", model.bank_swift_code ?? (object)DBNull.Value),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + id + "", "Update employee account details");
                throw Ex;
            }
        }

        public static DataTable GetEmployeeList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strSql = string.Empty;
                string strWhr = string.Empty;

                long id = CommanUtilities.Provider.GetCurrent().UserID;

                //if (CommanUtilities.Provider.GetCurrent().UserType == "Administrator")
                //{
                    strSql = "Select rowid ID, concat(firstname,' ',lastname) as name, email,Replace(Replace(Replace(Replace(phone,')',''),'(',''),'-',''),' ','') as phone,gender,emp_type,is_active from erp_hrms_emp where 1=1 ";
                //}
                //else
                //{
                //    strSql = "Select rowid ID, concat(firstname,' ',lastname) as name, email,Replace(Replace(Replace(Replace(phone,')',''),'(',''),'-',''),' ','') as phone,gender,emp_type,is_active from erp_hrms_emp where fk_user='" + id + "' ";
                //}
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(firstname,' ',lastname) like '%" + searchid + "%' OR email like '%" + searchid + "%' OR phone like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} OFFSET {2} ROWS FETCH NEXT {3} ROWS ONLY", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                if (CommanUtilities.Provider.GetCurrent().UserType == "Administrator")
                {
                    strSql += "; SELECT (Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_hrms_emp where 1 = 1 " + strWhr.ToString();
                }
                else
                {
                    strSql += "; SELECT (Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_hrms_emp where fk_user='" + id + "' " + strWhr.ToString();
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
        public static DataTable GetEmployeeAttendenceList(string userstatus, string fromdate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(fromdate, us);
                //DateTime endDate = DateTime.Parse(todate, us);
                string strWhr = string.Empty;
                string strAdd = string.Empty;
                if (CommanUtilities.Provider.GetCurrent().UserType != "Administrator")
                {
                    long user = CommanUtilities.Provider.GetCurrent().UserID;
                    strWhr += " and fk_user = '" + user + "'";
                    strAdd = "'1' as Is_Employee,";
                }
                string strSql = "Select e.rowid ID, concat(e.firstname,' ',e.lastname) as name,d.designation, " + strAdd.ToString() + " e.email,e.phone,e.gender,e.emp_type," +
                    "DATE_FORMAT(s.in_time, '%m-%d-%Y %T') as in_time, DATE_FORMAT(s.out_time, '%m-%d-%Y %T') out_time,SUBTIME(Time(s.out_time),Time(s.in_time)) as WorkingHours,s.is_approved,e.is_active from erp_hrms_emp e left join erp_hrms_attendance_sheet s on s.fk_emp = e.rowid " +
                    " and (date(in_time) >= '" + startDate.ToString("yyyy-MM-dd") + "' and date(in_time) <= '" + startDate.ToString("yyyy-MM-dd") + "' or date(out_time) >= '" + startDate.ToString("yyyy-MM-dd") + "' and date(out_time) <= '" + startDate.ToString("yyyy-MM-dd") + "')" +
                    " left join erp_hrms_empdetails ed on ed.fk_emp = e.rowid left join erp_hrms_designation d on d.rowid = ed.designation where 1 = 1 " +
                    "and e.is_active = 1  ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(e.firstname,' ',e.lastname) like '%" + searchid + "%' OR d.designation like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (e.is_active='" + userstatus + "') ";
                }
                strWhr += " and e.rowid not in (Select fk_emp from erp_hrms_leave where (date('" + startDate.ToString("yyyy-MM-dd") + "') between Date(from_date) and Date(to_date)) and is_approved=1 ) ";
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(e.rowid)/" + pagesize.ToString() + ") TotalPage,Count(e.rowid) TotalRecord from erp_hrms_emp e left join erp_hrms_attendance_sheet s on s.fk_emp = e.rowid " +
                    " and date(in_time) >= '" + startDate.ToString("yyyy-MM-dd") + "' and date(out_time) <= '" + startDate.ToString("yyyy-MM-dd") + "'" +
                    "left join erp_hrms_empdetails ed on ed.fk_emp = e.rowid left join erp_hrms_designation d on d.rowid = ed.designation where 1 = 1 and e.is_active = 1 " + strWhr.ToString();

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

        public static DataTable GetAttendanceReport(string fromdate, string todate)
        {
            DataTable dt = new DataTable();

            try
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(fromdate, us);
                DateTime endDate = DateTime.Parse(todate, us);
                //DateTime startDate = DateTime.Parse("2021-09-24", us);
                //DateTime endDate = DateTime.Parse("2021-09-30", us);
                string strWhr = string.Empty;
                string strAdd = string.Empty;
                if (CommanUtilities.Provider.GetCurrent().UserType != "Administrator")
                {
                    long user = CommanUtilities.Provider.GetCurrent().UserID;
                    strWhr += " and fk_user = '" + user + "'";
                    strAdd = "'1' as Is_Employee,";
                }
                string strSql = "get_AttendanceReport";
                SqlParameter[] para =
               {
                    //2nd table
                    new SqlParameter("@StartDate", startDate.ToString("yyyy-MM-dd")),
                    new SqlParameter("@EndDate", endDate.ToString("yyyy-MM-dd")),
               };
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];
                //if (ds.Tables[1].Rows.Count > 0)
                //    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
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
                SqlParameter[] para =
                {
                    new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@is_active", model.is_active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Employee/AddEmployeeBasicInfo/" + model.rowid + "", "Update employee status");
                throw Ex;
            }
        }
        public static DataTable GetEmployeeByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select e.rowid, e.firstname,e.lastname,e.dob, e.email,e.phone,e.gender,e.emp_type,e.is_active,e.insperity_id,e.fk_user, " +
                    "d.birthplace,d.maritalstatus,d.address1,d.address2,d.city,d.state,d.zipcode,d.country,d.emp_number,d.designation,d.department,d.undertaking_emp," +
                    "d.joining_date,d.leaving_date,d.basic_sal,d.unpaid_leave_perday,d.bank_account_title,d.bank_name,d.account_number, " +
                    "d.bank_swift_code,d.note_public,d.note_private,d.bloodgroup,d.education,d.professionalqualification,d.otherdetails,d.alternateaddress1,d.alternateaddress2,d.alternatecity,d.alternatestate," +
                    "d.alternatezipcode,d.alternatecountry,d.alternatecontactNumber," +
                    "(select cast(User_Image as varbinary(max)) from wp_users ui where ui.id = e.fk_user) ProfileImageName,d.ProfileImagePath " +
                    "from erp_hrms_emp e left join erp_hrms_empdetails d on d.fk_emp = e.rowid where  e.rowid = '" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int EmployeeFileUpload(int fk_emp, string FileName, string FilePath, string FileType, string size)
        {
            try
            {
                string strsql = "";
                strsql = "insert into erp_EmployeeLinkedFiles(fk_emp, filename, filesize, filetype, filepath) values(@fk_emp, @filename, @filesize, @filetype, @filepath); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
               {
                    new SqlParameter("@fk_emp", fk_emp),
                    new SqlParameter("@filename", FileName.ToLower()),
                    new SqlParameter("@filesize", size),
                    new SqlParameter("@filetype", FileType),
                    new SqlParameter("@filepath", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EmployeeProfileUpload(HrmsModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update wp_users set user_image=@user_image where ID=(Select fk_user from erp_hrms_emp where rowid=@fk_emp)";
                SqlParameter[] para =
               {
                    new SqlParameter("@fk_emp", model. fk_emp),
                     new SqlParameter("@user_image", model.User_Image),
                    //new SqlParameter("@ProfileImageName", FileName.ToLower()),
                    //new SqlParameter("@ProfileImagePath", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetfileCountdata(int fk_emp, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select filename from erp_EmployeeLinkedFiles"
                                + " WHERE fk_emp in (" + fk_emp + ") and filename = '" + FileName.ToLower() + "' ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetProfileCountdata(int fk_emp, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select ProfileImageName from erp_hrms_empdetails"
                                + " WHERE fk_emp in (" + fk_emp + ") and ProfileImageName = '" + FileName.ToLower() + "' ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetEmployeeLinkedFiles(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "select rowid ID,fk_emp,filename,concat(filesize,' KB') filesize,filetype,filepath,FORMAT(createddate, 'MM-dd-yy') Date from erp_EmployeeLinkedFiles where fk_emp='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (filename like '%" + searchid + "%' OR filesize like '%" + searchid + "%' OR createddate like '%" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (is_active='" + userstatus + "') ";
                //}
                strSql += strWhr + string.Format(" order by {0} {1} OFFSET {2} ROWS FETCH NEXT {3} ROWS ONLY", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT (Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_EmployeeLinkedFiles where fk_emp='" + id + "' and 1=1 " + strWhr.ToString();

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

        public int DeleteEmployeeLinkedFiles(HrmsModel model)
        {
            try
            {
                string strsql = "";
                strsql = "delete from erp_EmployeeLinkedFiles where rowid=@EmployeeLinkedFilesID and fk_emp=@fk_emp;";
                SqlParameter[] para =
                {
                    new SqlParameter("@fk_emp", model.rowid),
                    new SqlParameter("@EmployeeLinkedFilesID", model.EmployeeLinkedFilesID),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddAttendence(string Empid, string intime, string outtime, string month, string year)
        {
            try
            {
                int result = 0;
                CultureInfo us = new CultureInfo("en-US");
                string[] ID = Empid.Split(',');

                string[] invalue = { };
                if (intime != null) { invalue = intime.Split(','); }

                string[] outvalue = { };
                if (outtime != null) { outvalue = outtime.Split(','); }
                for (int i = 0; i <= ID.Length - 1; i++)
                {
                    Empid = ID[i].ToString();
                    if (intime != null) { intime = invalue[i].ToString(); }
                    if (outtime != null) { outtime = outvalue[i].ToString(); }
                    if (Empid != "0")
                    {
                        string strsql = "";
                        string IsAvailable = GetPresentEmp(Empid, intime, outtime).ToString();
                        if (IsAvailable != "0")
                        {
                            string inout = "";
                            if (intime == "" || intime == null)
                            {
                                inout = ",out_time=@out_time";
                            }
                            else if (outtime == "" || outtime == null)
                            {
                                inout = ",in_time=@in_time";
                            }
                            else
                            {
                                inout = ",in_time=@in_time,out_time=@out_time";
                            }
                            strsql = "Update erp_hrms_attendance_sheet set fk_emp=@fk_emp " + inout + ",month=@month,year=@year where rowid=" + IsAvailable + "";
                        }
                        else
                        {
                            strsql = "insert into erp_hrms_attendance_sheet(fk_emp,in_time,out_time,month,year) values(@fk_emp,@in_time,@out_time,@month,@year); SELECT LAST_INSERT_ID();";
                        }
                        SqlParameter[] para =
                        {

                            new SqlParameter("@fk_emp", Empid),
                            new SqlParameter("@in_time",string.IsNullOrEmpty(intime) ? (DateTime?)null : DateTime.Parse(intime, us)),
                            new SqlParameter("@out_time",string.IsNullOrEmpty(outtime) ? (DateTime?)null : DateTime.Parse(outtime, us)),
                            new SqlParameter("@month",month),
                            new SqlParameter("@year",year),
                        };
                        result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                    }
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AbsentEmployee(List<AttendenceModel> _list)
        {
            try
            {
                int result = 0;
                string strsql = "";
                foreach (AttendenceModel list in _list)
                {
                    string EmpID = list.strValue1;
                    string intime = list.strValue2;
                    string outtime = list.strValue3;
                    string IsAvailable = GetPresentEmp(EmpID, intime, outtime).ToString();
                    if (IsAvailable != "0")
                    {
                        strsql = "delete from erp_hrms_attendance_sheet where rowid=" + IsAvailable + " and fk_emp=" + EmpID + "";
                    }
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int GetPresentEmp(string id, string intime, string outtime)
        {
            try
            {
                CultureInfo us = new CultureInfo("en-US");
                string strSql = "";
                if (outtime == null)
                {
                    DateTime Empintime = DateTime.Parse(intime, us);
                    strSql = "Select rowid from erp_hrms_attendance_sheet where fk_emp='" + id + "' and  (Date(out_time) >= Date('" + Empintime.ToString("yyyy-MM-dd") + "') and Date(out_time) <= Date('" + Empintime.ToString("yyyy-MM-dd") + "'))";

                }
                else if (intime == null)
                {
                    DateTime Empouttime = DateTime.Parse(outtime, us);
                    strSql = "Select rowid from erp_hrms_attendance_sheet where fk_emp='" + id + "' and  (Date(in_time) >= Date('" + Empouttime.ToString("yyyy-MM-dd") + "') and Date(in_time) <= Date('" + Empouttime.ToString("yyyy-MM-dd") + "'))";

                }
                else
                {
                    DateTime Empintime = DateTime.Parse(intime, us);
                    strSql = "Select rowid from erp_hrms_attendance_sheet where fk_emp='" + id + "' and  (Date(in_time) >= Date('" + Empintime.ToString("yyyy-MM-dd") + "') and Date(in_time) <= Date('" + Empintime.ToString("yyyy-MM-dd") + "'))";

                }
                //string strSql = "Select rowid from erp_hrms_attendance_sheet where fk_emp='" + id + "' and ((Date(in_time) or Date(out_time))>=Date('" + Empintime.ToString("yyyy-MM-dd") + "') or (in_time or out_time)>=Date('" + Empouttime+ "'))";
                //SqlParameter[] para =
                //       {
                //             new SqlParameter("@in_time",string.IsNullOrEmpty(intime) ? (DateTime?)null : DateTime.Parse(intime, us)),
                //            new SqlParameter("@out_time",string.IsNullOrEmpty(outtime) ? (DateTime?)null : DateTime.Parse(outtime, us)),

                //        };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strSql));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //My code
        public static DataSet GetLeaveType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, leave_type from erp_hrms_leave_type order by rowid");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetEmployee(string fkuser)
        {
            DataSet DS = new DataSet();
            try
            {
                if (!string.IsNullOrEmpty(fkuser))
                {
                    DS = SQLHelper.ExecuteDataSet("Select rowid, firstname from erp_hrms_emp where is_active=1 and fk_user='" + fkuser + "' order by rowid");
                }
                else
                {
                    DS = SQLHelper.ExecuteDataSet("Select rowid, firstname from erp_hrms_emp where is_active=1 order by rowid");
                }

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddLeave(LeaveModel model)
        {

            try
            {
                string strsql = "INSERT into erp_hrms_leave(fk_emp, leave_code, description, leave_type, is_paid, from_date, to_date, is_approved, note_public, note_private, days, apply_date)" +
                    " values(@fk_emp, @leave_code, @description, @leave_type, @is_paid, @from_date, @to_date, @is_approved, @note_public, @note_private, @days, @apply_date);SELECT LAST_INSERT_ID();";

                SqlParameter[] para =
              {
                    new SqlParameter("@fk_emp", model.fk_emp),
                    new SqlParameter("@leave_code",model.leave_code),
                    new SqlParameter("@description", model.description),
                    new SqlParameter("@leave_type", model.leave_type),
                    new SqlParameter("@is_paid", "0"),
                    new SqlParameter("@from_date", model.from_date),
                    new SqlParameter("@to_date", model.to_date),
                    new SqlParameter("@is_approved","0"),
                    new SqlParameter("@note_public", model.note_public),
                    new SqlParameter("@note_private", model.note_private),
                    new SqlParameter("@days", model.days),
                    new SqlParameter("@apply_date",Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetLeaveList(string fkuser)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = string.Empty;
                if (!string.IsNullOrEmpty(fkuser))
                {
                    strquery = "SELECT ehl.rowid , CONCAT(ehe.firstname, ' ', ehe.lastname) as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to,FORMAT(ehl.days,2) as days,(case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=2 then 'Rejected' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE ehe.fk_user='" + fkuser + "' ";
                }
                else
                {
                    strquery = "SELECT ehl.rowid , CONCAT(ehe.firstname, ' ', ehe.lastname) as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to,FORMAT(ehl.days,2) as days,(case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=2 then 'Rejected' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE 1 = 1 ";
                }
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdateLeave(LeaveModel model)
        {

            try
            {
                string strsql = "UPDATE erp_hrms_leave set fk_emp = @fk_emp, leave_code = @leave_code, description=@description, leave_type=@leave_type, from_date=@from_date, to_date=@to_date," +
                    "note_public=@note_public, note_private=@note_private, days=@days where rowid = '" + model.rowid + "';";
                SqlParameter[] para =
               {
                    new SqlParameter("@fk_emp", model.fk_emp),
                    new SqlParameter("@leave_code",model.leave_code),
                    new SqlParameter("@description", model.description),
                    new SqlParameter("@leave_type", model.leave_type),
                    new SqlParameter("@from_date", model.from_date),
                    new SqlParameter("@to_date", model.to_date),
                    new SqlParameter("@note_public", model.note_public),
                    new SqlParameter("@note_private", model.note_private),
                    new SqlParameter("@days", model.days),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetLeaveListSelect(LeaveModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT rowid, fk_emp,leave_code,description,leave_type,is_paid,DATE_FORMAT(from_date,'%m-%d-%Y') as from_date,DATE_FORMAT(to_date,'%m-%d-%Y') as to_date,note_public,note_private,is_approved, FORMAT(days,2) as days FROM erp_hrms_leave WHERE rowid='" + model.searchid + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        #region Payroll
        public static DataTable GetEmployeePayrollList(string department, string month, string year, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                
                string strWhr = string.Empty;
                string strAdd = string.Empty;
              
                string strSql = "Select e.rowid as ID, concat(firstname,' ', lastname) as name, design.designation from erp_hrms_emp e " +
                    "inner join erp_hrms_empdetails ed on e.rowid = ed.fk_emp " +
                    "left join erp_hrms_designation design on ed.department = design.rowid where 1=1 and e.is_active = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(e.firstname,' ',e.lastname) like '%" + searchid + "%' OR design.designation like '%" + searchid + "%')";
                }
                if (!string.IsNullOrEmpty(department))
                {
                    strWhr += " and ed.department = " + department + " and e.is_active = 1 ";
                }
              
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(e.rowid)/" + pagesize.ToString() + ") TotalPage,Count(e.rowid) TotalRecord from erp_hrms_emp e " +
                    "inner join erp_hrms_empdetails ed on e.rowid = ed.fk_emp " +
                    "left join erp_hrms_designation design on ed.department = design.rowid where 1=1 and e.is_active = 1 " + strWhr.ToString();

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

        #endregion
        public static int AddConfiguration(HrmsModel model, int id)
        {
            try
            {
                string strsql = "INSERT into erp_hrms_salary_configuration(emp_type, fk_emp, basic, emp_code, da, hra, other_allowance, pf, loan_amount, loan_emi, loan_months, adv_amount, adv_emi, adv_emi_months, tds, other_deductions, reimbursement, work_type, default_work_hours, prepare_salary, accounting_type, hra_type," +
                    "comp_name,section,salary_date,emp_class,special_pay,wash_allowance,incentive,cca,vpf,adv_epf,insurance,emp_welfare,imprest,misc_refund,fastival_allowance,bank_name,bank_account,epf_account,pay_sacle)" +
                                 " values(@emp_type, @fk_emp, @basic, @emp_code, @da, @hra, @other_allowance, @pf, @loan_amount, @loan_emi, @loan_months, @adv_amount, @adv_emi, @adv_emi_months, @tds, @other_deductions, @reimbursement, @work_type, @default_work_hours, @prepare_salary, @accounting_type, @hra_type," +
                                 " @comp_name, @section, @salary_date, @emp_class, @special_pay, @wash_allowance, @incentive, @cca, @vpf, @adv_epf, @insurance, @emp_welfare, @imprest, @misc_refund, @fastival_allowance, @bank_name, @bank_account, @epf_account, @pay_sacle); SELECT SCOPE_IDENTITY();";

                SqlParameter[] para =
                {
                    new SqlParameter("@emp_type", model.emp_type),
                    new SqlParameter("@fk_emp", id),
                    new SqlParameter("@basic","0"),
                    new SqlParameter("@emp_code", id),
                    new SqlParameter("@da", "0"),
                    new SqlParameter("@hra","0"),
                    new SqlParameter("@pf","0"),
                    new SqlParameter("@loan_amount","0"),
                    new SqlParameter("@loan_emi","0"),

                    new SqlParameter("@loan_months","0"),
                    new SqlParameter("@adv_amount","0"),
                    new SqlParameter("@adv_emi","0"),
                    new SqlParameter("@adv_emi_months","0"),
                    new SqlParameter("@tds","0"),
                    new SqlParameter("@other_deductions","0"),
                    new SqlParameter("@reimbursement","0"),
                    new SqlParameter("@work_type", "1"),
                    new SqlParameter("@default_work_hours","0"),
                    new SqlParameter("@other_allowance","0"),
                    new SqlParameter("@prepare_salary","1"),
                    new SqlParameter("@accounting_type","1"),
                    new SqlParameter("@hra_type","1"),

                    //Extra
                    new SqlParameter("@comp_name",""),
                    new SqlParameter("@salary_date",Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new SqlParameter("@emp_class",""),
                    new SqlParameter("@special_pay","0"),
                    new SqlParameter("@wash_allowance","0"),
                    new SqlParameter("@incentive","0"),
                    new SqlParameter("@cca","0"),
                    new SqlParameter("@vpf", "0"),
                    new SqlParameter("@adv_epf","0"),
                    new SqlParameter("@insurance", "0"),
                    new SqlParameter("@emp_welfare", "0"),
                    new SqlParameter("@imprest","0"),
                    new SqlParameter("@misc_refund","0"),
                    new SqlParameter("@fastival_allowance","0"),
                    new SqlParameter("@bank_name",""),
                    new SqlParameter("@bank_account",""),
                    new SqlParameter("@epf_account",""),
                    new SqlParameter("@pay_sacle","0"),
                    new SqlParameter("@section",""),

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static int UpdateNewEmployeeasUser(HrmsModel model)
        {
            try
            {
                string username = model.firstname + " " + model.lastname;

                string strsql = "UPDATE wp_users set user_nicename = @user_nicename, user_email = @user_email, display_name=@display_name where ID = '" + model.userid + "';";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_nicename", username),
                    new SqlParameter("@user_email", model.email),
                    new SqlParameter("@display_name", username),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}