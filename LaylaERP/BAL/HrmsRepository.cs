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
                DT = SQLHelper.ExecuteDataTable("SELECT CONCAT('EMP', if(max(LPAD(rowid+1 ,5,0)) is null,'00001',max(LPAD(rowid+1 ,5,0))))  as Code from erp_hrms_emp;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static int AddEmployeeBasicInfo(HrmsModel model)
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

        public static int EditEmployeeBasicInfo(HrmsModel model, int ID)
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

        public static int EditEmployeeBasicDetails(HrmsModel model, int id)
        {

            try
            {

                string strsql = "update erp_hrms_empdetails set birthplace=@birthplace, maritalstatus=@maritalstatus, address1=@address1, address2=@address2, " +
                    "city = @city, state = @state, zipcode = @zipcode,country = @country where fk_emp = @fk_emp";


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
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int EditEmployeeAdditionalInfo(HrmsModel model, int id)
        {
            try
            {

                string strsql = "update erp_hrms_empdetails set emp_number = CONCAT('EMP', LPAD("+id+", 5, 0)), " +
                    "designation = @designation, department = @department, undertaking_emp = @undertaking_emp, joining_date = @joining_date, " +
                    "leaving_date = @leaving_date,bloodgroup=@bloodgroup,education=@education,professionalqualification=@professionalqualification,otherdetails=@otherdetails," +
                    "alternateaddress1 = @alternateaddress1,alternateaddress2 = @alternateaddress2,alternatecity = @alternatecity,alternatestate = @alternatestate," +
                    "alternatezipcode = @alternatezipcode,alternatecountry = @alternatecountry,alternatecontactNumber = @alternatecontactNumber where fk_emp = @fk_emp";
                MySqlParameter[] para =
                {
                    //2nd table
                    new MySqlParameter("@fk_emp", id),
                    //new MySqlParameter("@emp_number", model.emp_number),
                    new MySqlParameter("@designation", model.designation),
                    new MySqlParameter("@department", model.department),
                    new MySqlParameter("@undertaking_emp", model.undertaking_emp),
                    new MySqlParameter("@joining_date", model.joining_date),
                    new MySqlParameter("@leaving_date", model.leaving_date),
                    new MySqlParameter("@bloodgroup", model.bloodgroup),
                    new MySqlParameter("@education", model.education),
                    new MySqlParameter("@professionalqualification", model.professionalqualification),
                    new MySqlParameter("@otherdetails", model.otherdetails),
                    new MySqlParameter("@alternateaddress1", model.alternateaddress1),
                    new MySqlParameter("@alternateaddress2", model.alternateaddress2),
                    new MySqlParameter("@alternatecity", model.alternatecity),
                    new MySqlParameter("@alternatestate", model.alternatestate),
                    new MySqlParameter("@alternatezipcode", model.alternatezipcode),
                    new MySqlParameter("@alternatecountry", model.alternatecountry),
                    new MySqlParameter("@alternatecontactNumber", model.alternatecontactNumber),
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
                MySqlParameter[] para =
                {
                    //2nd table
                    new MySqlParameter("@fk_emp", id),
                    new MySqlParameter("@basic_sal", model.basic_sal),
                    new MySqlParameter("@unpaid_leave_perday", model.unpaid_leave_perday),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EditBankInfo(HrmsModel model, int id)
        {

            try
            {

                string strsql = "update erp_hrms_empdetails set bank_account_title = @bank_account_title," +
                    "bank_name = @bank_name, account_number = @account_number, bank_swift_code = @bank_swift_code where fk_emp = @fk_emp";
                MySqlParameter[] para =
                {
                    //2nd table
                    new MySqlParameter("@fk_emp", id),
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
                    strWhr += " and (concat(firstname,' ',lastname) like '%" + searchid + "%' OR email like '%" + searchid + "%' OR phone like '%" + searchid + "%')";
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
        public static DataTable GetEmployeeAttendenceList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select e.rowid ID, concat(e.firstname,' ',e.lastname) as name,d.designation, e.email,e.phone,e.gender,e.emp_type," +
                    "s.in_time,s.out_time,s.is_approved,e.is_active from erp_hrms_emp e left join erp_hrms_attendance_sheet s on s.fk_emp = e.rowid " +
                    "left join erp_hrms_empdetails ed on ed.fk_emp = e.rowid left join erp_hrms_designation d on d.rowid = ed.designation where 1 = 1 and e.is_active = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(e.firstname,' ',e.lastname) like '%" + searchid + "%' OR d.designation like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (e.is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(e.rowid)/" + pagesize.ToString() + ") TotalPage,Count(e.rowid) TotalRecord from erp_hrms_emp e left join erp_hrms_attendance_sheet s on s.fk_emp = e.rowid " +
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
                    "d.bank_swift_code,d.note_public,d.note_private,d.bloodgroup,d.education,d.professionalqualification,d.otherdetails,d.alternateaddress1,d.alternateaddress2,d.alternatecity,d.alternatestate," +
                    "d.alternatezipcode,d.alternatecountry,d.alternatecontactNumber,ifnull(d.ProfileImageName,'default.png') ProfileImageName,d.ProfileImagePath " +
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
                strsql = "insert into erp_EmployeeLinkedFiles(fk_emp, filename, filesize, filetype, filepath) values(@fk_emp, @filename, @filesize, @filetype, @filepath); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@fk_emp", fk_emp),
                    new MySqlParameter("@filename", FileName.ToLower()),
                    new MySqlParameter("@filesize", size),
                    new MySqlParameter("@filetype", FileType),
                    new MySqlParameter("@filepath", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int EmployeeProfileUpload(int fk_emp, string FileName, string FilePath)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_hrms_empdetails set ProfileImageName=@ProfileImageName, ProfileImagePath=@ProfileImagePath where fk_emp=@fk_emp;";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@fk_emp", fk_emp),
                    new MySqlParameter("@ProfileImageName", FileName.ToLower()),
                    new MySqlParameter("@ProfileImagePath", FilePath),
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

                string strSql = "select rowid ID,fk_emp,filename,concat(filesize,' KB') filesize,filetype,filepath,DATE_FORMAT(createddate, '%m-%d-%Y') Date from erp_EmployeeLinkedFiles where fk_emp='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (filename like '%" + searchid + "%' OR filesize like '%" + searchid + "%' OR createddate like '%" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (is_active='" + userstatus + "') ";
                //}
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_EmployeeLinkedFiles where fk_emp='" + id + "' and 1=1 " + strWhr.ToString();

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
                MySqlParameter[] para =
                {
                    new MySqlParameter("@fk_emp", model.rowid),
                    new MySqlParameter("@EmployeeLinkedFilesID", model.EmployeeLinkedFilesID),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddAttendence(string Empid, string intime, string outtime)
        {
            try
            {
                int result = 0;
                string[] ID = Empid.Split(',');
                string[] invalue = intime.Split(',');
                string[] outvalue = outtime.Split(',');
                for (int i = 0; i <= ID.Length - 1; i++)
                {
                    Empid = ID[i].ToString();
                    DateTime in_time = DateTime.Parse(invalue[i]);
                    DateTime out_time = DateTime.Parse(outvalue[i]);
                    if (Empid != "0")
                    {
                        string strsql = "";
                        string Product = GetPresentEmp(Empid).ToString();
                        if (Product == Empid)
                        {
                            strsql = "Update erp_hrms_attendance_sheet set fk_emp=@fk_emp,in_time=@in_time,out_time=@out_time where fk_emp=@fk_emp";
                        }
                        else
                        {
                            strsql = "insert into erp_hrms_attendance_sheet(fk_emp,in_time,out_time) values(@fk_emp,@in_time,@out_time); SELECT LAST_INSERT_ID();";
                        }
                        MySqlParameter[] para =
                        {
                            new MySqlParameter("@fk_emp",Empid),
                            new MySqlParameter("@in_time", in_time),
                            new MySqlParameter("@out_time", out_time),
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
        public int GetPresentEmp(string id)
        {
            try
            {
                string strSql = "Select fk_emp from erp_hrms_attendance_sheet where fk_emp='" + id + "'";
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
                DS = SQLHelper.ExecuteDataSet("Select leave_code, leave_type from erp_hrms_leave_type order by rowid");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetEmployee()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, firstname from erp_hrms_emp where is_active=1 order by rowid");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddLeave(LeaveModel model)
        {

            try
            {
                string strsql = "INSERT into erp_hrms_leave(fk_emp, leave_code, description, leave_type, is_paid, from_date, to_date, is_approved, note_public, note_private, days )" +
                    " values(@fk_emp, @leave_code, @description, @leave_type, @is_paid, @from_date, @to_date, @is_approved, @note_public, @note_private, @days );SELECT LAST_INSERT_ID();";

                MySqlParameter[] para =
              {
                    new MySqlParameter("@fk_emp", model.fk_emp),
                    new MySqlParameter("@leave_code",model.leave_code),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@leave_type", model.leave_type),
                    new MySqlParameter("@is_paid", "0"),
                    new MySqlParameter("@from_date", model.from_date),
                    new MySqlParameter("@to_date", model.to_date),
                    new MySqlParameter("@is_approved","0"),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@days", model.days),

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetLeaveList()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ehl.rowid ,ehe.firstname as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to,FORMAT(ehl.days,2) as days from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE 1 = 1 ";
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
                MySqlParameter[] para =
               {
                    new MySqlParameter("@fk_emp", model.fk_emp),
                    new MySqlParameter("@leave_code",model.leave_code),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@leave_type", model.leave_type),
                    new MySqlParameter("@from_date", model.from_date),
                    new MySqlParameter("@to_date", model.to_date),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@days", model.days),
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
    }
}