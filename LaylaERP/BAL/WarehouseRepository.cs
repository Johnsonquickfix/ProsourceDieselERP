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
    public class WarehouseRepository
    {
        public static DataTable GetWarehouseDetail()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT rowid, ref,entity,description,lieu,concat(address,' ',town,' ',country,' ',zip)as address,phone,fax,if(statut=0,'Close','Open')as status FROM wp_warehouse order by rowid desc";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddWarehouse(WarehouseModel model)
        {
            try
            {
                string strsql = "insert into wp_warehouse(ref,datec,lieu,description,address,zip,town,country,phone,fax,statut,address1,city) values(@ref,@datec,@lieu,@description,@address,@zip,@town,@country,@phone,@fax,@statut,@address1,@city);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@datec",Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new MySqlParameter("@lieu", model.lieu),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@address", model.address),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@town", model.town),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@fax", model.fax),
                    new MySqlParameter("@statut", model.statut),
                    new MySqlParameter("@address1", model.address1),
                    new MySqlParameter("@city", model.city)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetWarehouseID(int rowid)
        {
            DataTable dt = new DataTable();

            try
            {

                string strSql = "SELECT rowid,ref,entity,description,lieu,phone,fax,if(statut=0,'Close','Open')as status,address, zip, town, country, address1,city FROM wp_warehouse where rowid=" + rowid + "";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int Updatewarehouses(WarehouseModel model)
        {
            try
            {
                string strsql = "update wp_warehouse set ref=@ref, lieu=@lieu, description=@description, address=@address, zip=@zip, town=@town, country=@country, phone=@phone, fax=@fax, statut=@statut, address1=@address1, city=@city where rowid in(" + model.rowid + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@lieu", model.lieu),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@address", model.address),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@town", model.town),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@fax", model.fax),
                    new MySqlParameter("@statut", model.statut),
                    new MySqlParameter("@address1", model.address1),
                    new MySqlParameter("@city", model.city)
            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetSourceWarehouse()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select rowid, ref from wp_warehouse order by rowid desc";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetProduct()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT DISTINCT post.id,ps.ID pr_id, CONCAT(post.post_title, ' (', COALESCE(psku.meta_value, ''), ') - ', LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt, ''), 'Size:', ''), 'Color:', ''))) as post_title, psr.meta_value as reg_price, pr.meta_value price,"
                              + "  CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                              + "  LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                              + "  left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                              + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                              + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_price'"
                              + "  WHERE post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value, '') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt, ''), 'Size:', ''), 'Color:', ''))) like '%%%'"
                              + " ORDER BY post.ID";
                dtr = SQLHelper.ExecuteDataTable(strquery);

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
    }
}