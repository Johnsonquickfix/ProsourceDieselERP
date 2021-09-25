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
    public class DaRepository
    {
        public static int AddDaDetails(DaModel model)
        {
            try
            {
               
                string strsql = "INSERT into erp_hrms_DA(da_rate1, da_rate2, da_rate_others, from_date) values(@da_rate1, @da_rate2, @da_rate_others, @from_date); SELECT LAST_INSERT_ID();";


                MySqlParameter[] para =
                {
                    new MySqlParameter("@da_rate1",model.da_rate1),
                    new MySqlParameter("@da_rate2", model.da_rate2),
                    new MySqlParameter("@da_rate_others",model.da_rate_others),
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

       public static DataTable GetDaList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
       {
           DataTable dt = new DataTable();
           totalrows = 0;
           try
           {
               string strWhr = string.Empty;

                string strSql = "SELECT rowid as id, da_rate1,da_rate2,da_rate_others,DATE_FORMAT(from_date,'%m-%d-%Y') as from_date from erp_hrms_DA where 1=1";
               if (!string.IsNullOrEmpty(searchid))
               {
                   strWhr += " and (rowid like '%" + searchid + "%' OR da_rate1 like '%" + searchid + "%' OR da_rate2 like '%" + searchid + "%' OR da_rate_others like '%" + searchid + "%')";
               }
               if (userstatus != null)
               {
                   //strWhr += " and (ehe.is_active='" + userstatus + "') ";
               }
               strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

               strSql += "; SELECT ceil(Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_hrms_DA where 1=1 " + strWhr.ToString();

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

        public static DataTable SelectDa(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT rowid as id, da_rate1,da_rate2,da_rate_others,DATE_FORMAT(from_date,'%m-%d-%Y') as from_date from erp_hrms_DA where rowid='" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateDA(DaModel model)
        {
            try
            {
                string strsql = "UPDATE erp_hrms_DA set da_rate1=@da_rate1, da_rate2=@da_rate2, da_rate_others=@da_rate_others, from_date=@from_date where rowid = '" + model.rowid + "';";
                MySqlParameter[] para =
                 {
                    new MySqlParameter("@da_rate1",model.da_rate1),
                    new MySqlParameter("@da_rate2", model.da_rate2),
                    new MySqlParameter("@da_rate_others",model.da_rate_others),
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

    }

}