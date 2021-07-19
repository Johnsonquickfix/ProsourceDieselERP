﻿using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
	public class InventoryRepository
	{
        public static DataSet GetProducts()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT p.id, p.post_title FROM wp_posts AS p, wp_postmeta AS s WHERE p.post_parent = 0 AND p.post_type = 'product' AND p.post_status = 'publish' AND p.id = s.post_id group by p.post_title";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetVarients(string parent, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT p.ID, p.post_title,if(sum(meta_value) is null,0,sum(meta_value)) as Count,s.meta_id FROM wp_posts AS p, wp_postmeta AS s WHERE p.post_parent ='" + parent + "' AND p.post_type = 'product_variation' AND p.post_status = 'publish' AND p.id = s.post_id AND s.meta_key = '_stock' group by p.post_title";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (User_Email like '%" + searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR um.meta_value like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ur.user_status='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, (pageno * pagesize).ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ur.id)/" + pagesize.ToString() + ") TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

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

        public int EditInventoryStock(string meta_id, string meta_value)
        {
            try
            {
                int result = 0;
                string[] ID = meta_id.Split(',');
                string[] value = meta_value.Split(',');

                for (int i = 0; i <= value.Length - 1; i++)
                {
                    meta_id = ID[i].ToString();
                    meta_value = value[i].ToString();

                    string strsql = "Update wp_postmeta set meta_value=@meta_value where meta_id=@meta_id AND meta_key = '_stock';";
                    MySqlParameter[] para =
                    {
                    new MySqlParameter("@meta_id", meta_id),
                    new MySqlParameter("@meta_value", meta_value)
                    };
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}