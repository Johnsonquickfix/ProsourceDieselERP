using LaylaERP.DAL;
using LaylaERP.UTILITIES;
using LaylaERP_v1.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.BAL
{
    public class EventsRepository
    {
        public static DataSet GetUsers()
        {
            DataSet DS = new DataSet();
            try
            {
              
                string strSQl = "SELECT ID, user_login, user_status, iif(user_status = '0', 'Active', 'InActive') as status,user_email, user_registered as created_date, " +
                                "um.meta_value as meta_value FROM wp_users u INNER JOIN wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%' WHERE u.user_status = '0' ORDER BY ID DESC";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddEvents(EventsModel model)
        {
            try
            {
                long user = CommanUtilities.Provider.GetCurrent().UserID;
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@event_label", model.event_label),
                    new SqlParameter("@start_date", model.start_date),
                    new SqlParameter("@end_date", model.end_date),
                    new SqlParameter("@assigned_to", model.assigned_to),
                    new SqlParameter("@related_user",user),
                    new SqlParameter("@related_contacts",model.related_contacts),
                    new SqlParameter("@related_company",model.related_company),
                    new SqlParameter("@status",model.status),
                    new SqlParameter("@task",model.task),
                    new SqlParameter("@description",model.description),
                    new SqlParameter("@assigned_user",model.assigned_user),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_event", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetEventsList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ee.rowid id,event_label, convert(varchar,start_date,101) startdate,convert(varchar,end_date,101) enddate, related_company, (case when ee.status = 1 then 'Active' else 'Inactive' end) status, task, assigned_user, wv.name, related_contacts from erp_events ee"
                               + " left join wp_vendor wv on wv.rowid = ee.related_company where 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (event_label like '%" + searchid + "%' OR assigned_user like '%" + searchid + "%' OR start_date like '%" + searchid + "%' OR end_date like '%" + searchid + "%' OR task like '%" + searchid + "%' OR related_contacts like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ee.status='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(ee.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ee.rowid) TotalRecord from erp_events ee inner join wp_vendor wv on wv.rowid = ee.related_company where 1 = 1 " + strWhr.ToString();

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

    }
}