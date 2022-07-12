namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

 
    public class DonationHaulRepository
    {
        public static DataTable GetCustmerDonationHaulList(string flag, string batchno, DateTime? fromdate, DateTime? todate, string searchcriteria, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@batchno", batchno),
                    new SqlParameter("@userid", 0)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_CustmerDonationHaul_search", parameters);
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

        public static DataSet donationcusmail(long id)
        {
            var ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "MAIL"),
                    new SqlParameter("@id", id),
                };
                ds = SQLHelper.ExecuteDataSet("erp_donation_mail", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ds;
        }
        public static DataTable GetfileCountdata(int fk_customerid, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select FileName from erp_donation_haul"
                                + " WHERE fk_customerid in (" + fk_customerid + ") and FileName = '" + FileName + "' "
                                + " ;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int FileUploade(int fk_product, string FileName, string Length, string FileType, string FilePath,string desc)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("Insert into erp_donation_haul(fk_customerid,FileName,Length,FileType,FilePath,discription) values(" + fk_product + ",'" + FileName + "','" + Length + "','" + FileType + "','" + FilePath+ "','" + desc + "');"));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "DonationHaul/FileUploade/" + fk_product + "", "Uploade product linked files");
                throw Ex;
            }
        }
        public static DataTable Uploaddatalist(SearchModel model)
        {
            //string strWhr = " where fk_pcg_version='" + model.strValue1 + "'";
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT edh.fk_customerid id,user_nicename, user_email,filepath,right(filepath, Datalength(filepath)-1) urlfile,CONCAT(umfn.meta_value,' ',umln.meta_value) name ,umph.meta_value  billing_phone,discription FROM erp_donation_haul  edh"
                                + " INNER JOIN wp_users ur on  ur.ID = edh.fk_customerid  LEFT OUTER JOIN  wp_usermeta umfn on umfn.user_id = ur.ID  and umfn.meta_key='first_name' LEFT OUTER JOIN  wp_usermeta umph on umph.user_id = ur.ID  and umph.meta_key='billing_phone' LEFT OUTER JOIN wp_usermeta umln on umln.user_id = ur.ID  and umln.meta_key='last_name' where 1=1";
                //if (!string.IsNullOrEmpty(model.strValue1))
                //{
                //    strSql += strWhr;
                //}

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

    }
}