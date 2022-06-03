using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP_v1.Models;
using System.Data.SqlClient;
using LaylaERP.Models;
using LaylaERP.UTILITIES;

namespace LaylaERP_v1.BAL
{
    public class PoemailRepository
    {
        public static DataSet UseridList()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT ID, concat(ID,' ( ',user_login,' )') user_login, user_status, iif(user_status = '0','Active','InActive') as status,user_email, user_registered as created_date, " +
                                "um.meta_value as meta_value FROM wp_users u INNER JOIN wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%' WHERE um.meta_value like '%administrator%' and u.user_status = '0' ORDER BY ID DESC";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable UseremailList(string userid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT ID, user_login, user_status, iif(user_status = '0','Active','InActive') as status,user_email, user_registered as created_date, " +
                                "um.meta_value as meta_value FROM wp_users u INNER JOIN wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%' WHERE um.meta_value like '%administrator%' and u.user_status = '0' and ID='" + userid + "' ORDER BY ID DESC";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetPoemailList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "select rowid id, user_id, user_email, iif(status = '1','Active','InActive') status,User_Type from erp_po_admin_email epae inner join wp_user_classification wuc on wuc.ID = epae.fk_usertypeid WHERE 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (user_id like '%" + searchid + "%' OR user_email like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord FROM erp_po_admin_email WHERE 1=1" + strWhr.ToString();

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
        public static DataTable Getusercount(PoemailModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT rowid,user_id,user_email,status from erp_po_admin_email where user_id ='" + model.user_id + "'";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddPoemail(PoemailModel model)
        {
            try
            {
                string strsql = "Poemail";
                SqlParameter[] para = {
                    new SqlParameter("@flag","I"),
                    new SqlParameter("@userid", model.user_id),
                    new SqlParameter("@useremail",model.user_email),
                    new SqlParameter("@status", model.status),
                    new SqlParameter("@fk_usertypeid", model.fk_usertypeid),
                };
                int result = Convert.ToInt32(LaylaERP.DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Poemail/AddPoemail/" + model.rowid + "", "Insert poemail details.");
                throw Ex;
            }
        }

        public static DataTable PoemailByID(SearchModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT rowid,user_id,user_email,status,fk_usertypeid from erp_po_admin_email where rowid='" + model.strValue1 + "'";


                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdateEmail(PoemailModel model)
        {
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@flag","U"),
                    new SqlParameter("@rowid",model.rowid),
                    new SqlParameter("@userid", model.user_id),
                    new SqlParameter("@useremail",model.user_email),
                    new SqlParameter("@status", model.status),
                    new SqlParameter("@fk_usertypeid", model.fk_usertypeid),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery("Poemail", para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Poemail/UpdateEmail/" + model.rowid + "", "Update poemail details.");
                throw Ex;
            }
        }
        public static DataTable GetRolesType()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select ID, user_type from wp_user_classification order by user_type";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
    }
}