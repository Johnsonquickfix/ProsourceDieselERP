using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class SetupRepostiory
    {
        public static DataSet GetProducts()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT COALESCE(ps.id,p.id) id,CONCAT(COALESCE(ps.post_title,p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,') '),''), ' #',ps.id) as text"
                                + " FROM wp_posts as p"
                                + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                + " WHERE p.post_type = 'product' AND p.post_status = 'publish'";
                                    
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetVendor()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT rowid, name from wp_vendor order by rowid";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable Getvendordetails(SearchModel model)
        {

            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT v.rowid as vid, v.name as vname, w.rowid as wid, w.ref as wname,v.fk_state as state, v.fk_country as country FROM wp_VendorWarehouse vs"
                               + " inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid"
                              + " inner join wp_vendor v on v.rowid = vs.VendorID where v.rowid='"+model.strValue1+"'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataSet GetWarehouse(SearchModel model)
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT v.rowid as vid, v.name as vname, w.rowid as wid, w.ref as wname,v.fk_state as state, v.fk_country as country FROM wp_VendorWarehouse vs"
                               + " inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid"
                              + " inner join wp_vendor v on v.rowid = vs.VendorID where v.rowid='" + model.strValue2 + "'";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable GetIdProductWarehouserule()
        {

            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT max(rowid) as id from product_warehouse_rule";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddProductWarehouseRule(SetupModel model)
        {
            try
            {
                string strsql = "INSERT into product_warehouse_rule(product_id, prefix_code, status) values(@product_id, @prefix_code, @status); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@product_id", model.product_id),
                    new SqlParameter("@prefix_code",model.prefix_code),
                    new SqlParameter("@status",'1'),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setup/AddProductWarehouseRule/" + model.rowid + "", "Insert suffix split logic product.");
                throw Ex;
            }
        }

        public static int AddProductWarehouseRuleDetails(SetupModel model)
        {
            try
            {
                string strsql = "INSERT into product_warehouse_rule_details(fk_product_rule, country, state, fk_vendor, fk_warehouse) values(@fk_product_rule, @country, @state, @fk_vendor, @fk_warehouse); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@fk_product_rule", model.fk_product_rule),
                    new SqlParameter("@country",model.country),
                    new SqlParameter("@state",model.state),
                    new SqlParameter("@fk_vendor",model.fk_vendor),
                    new SqlParameter("@fk_warehouse",model.fk_warehouse),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setup/AddProductWarehouseRuleDetails/" + model.rowid + "", "Insert suffix split logic details.");
                throw Ex;
            }
        }

        public static DataTable GetTableWarehouseRule()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT pwrd.rowid as id, COALESCE(ps.id,p.id) id,COALESCE(ps.post_title,p.post_title) as product, ww.ref as warehouse, wv.name as vendor, pwr.prefix_code as code, pwrd.country, pwrd.state "
                                  +" FROM wp_posts as p"
                                  +" LEFT JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                  +" left join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                  +" INNER join product_warehouse_rule pwr on pwr.product_id = ps.id"
                                  +" INNER join product_warehouse_rule_details pwrd on pwrd.fk_product_rule = pwr.rowid"
                                  +" inner join wp_warehouse ww on ww.rowid = pwrd.fk_warehouse"
                                  +" inner join wp_vendor wv on wv.rowid = pwrd.fk_vendor"
                                  +" WHERE p.post_type = 'product' AND p.post_status = 'publish'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable SelectTableWarehouseRule(long id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT pwrd.rowid as id, pwrd.fk_product_rule, COALESCE(ps.id,p.id) pid,COALESCE(ps.post_title,p.post_title) as product, ww.ref as warehouse, ww.rowid as warehouseid, wv.rowid as vendorid, wv.name as vendor, pwrd.country as country, pwrd.state as state, pwr.prefix_code as code"
                                  + " FROM wp_posts as p"
                                  + " LEFT JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                  + " left join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                  + " INNER join product_warehouse_rule pwr on pwr.product_id = ps.id"
                                  + " INNER join product_warehouse_rule_details pwrd on pwrd.fk_product_rule = pwr.rowid"
                                  + " inner join wp_warehouse ww on ww.rowid = pwrd.fk_warehouse"
                                  + " inner join wp_vendor wv on wv.rowid = pwrd.fk_vendor"
                                  + " WHERE pwrd.rowid='"+id+"' AND p.post_type = 'product' AND p.post_status = 'publish'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdateProductWarehouseRule(SetupModel model)
        {

            try
            {
                string strsql = "UPDATE product_warehouse_rule set product_id = @product_id, prefix_code = @prefix_code where product_id = '" + model.searchproductid + "';";
                string strsql1 = "UPDATE product_warehouse_rule_details set country=@country, state=@state, fk_vendor=@fk_vendor, fk_warehouse=@fk_warehouse where rowid = '" + model.searchid + "';";


                SqlParameter[] para =
               {
                    new SqlParameter("@product_id", model.product_id),
                    new SqlParameter("@prefix_code",model.prefix_code),

                    new SqlParameter("@country",model.country),
                    new SqlParameter("@state",model.state),
                    new SqlParameter("@fk_vendor",model.fk_vendor),
                    new SqlParameter("@fk_warehouse",model.fk_warehouse),


            };

                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql+strsql1, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setup/UpdateProductWarehouseRule/" + model.searchid + "", "Update suffix split logic details.");
                throw Ex;
            }
        }
        public static DataTable GetProductCount1(SetupModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT product_id from product_warehouse_rule WHERE product_id = '" + model.product_id + "' ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int GetProductCount(SetupModel model)
        {
            try
            {
                string strquery = "SELECT COUNT(product_id) from product_warehouse_rule WHERE product_id = '" + model.product_id + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
//~~~~~~~~~~~~~~~~~~~~~~~Check prefix code exits or not for product rule
        public static int GetPrefixCount(SetupModel model)
        {
            try
            {
                string strquery = "SELECT COUNT(prefix_code) from product_warehouse_rule WHERE prefix_code = '" + model.prefix_code + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable SelectProductToReUse(long id)
        {
            DataTable dtr = new DataTable();
            try
            {
                SqlParameter[] param = { 
                    new SqlParameter("@product_id", id),
                    new SqlParameter("@flag","ADDMORE"),
                };
                string strquery = "erp_product_warehouse_rule";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery,param);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetState(string strSearch, string country)
        {
            DataTable DT = new DataTable();
            try
            {
                string strwhere = "";
                if (country != null)
                {
                    strwhere = "and Country='" + country + "'";
                }
                //DT = SQLHelper.ExecuteDataTable("SELECT distinct State,StateFullName from ZIPCodes1 where State like '" + strSearch + "%' or StateFullName like '" + strSearch + "%' order by StateFullName");
                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_statelist  where (StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%') " + strwhere + " ;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Check the product rule exixts or not ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        public static DataTable CountRuleForState(SetupModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strsql = "SELECT state FROM product_warehouse_rule_details INNER JOIN dbo.split('" + model.state + "', ',') s ON s.items IN(SELECT items FROM dbo.split(STATE, ',') )"
                               + " WHERE fk_vendor = '" + model.fk_vendor + "' and fk_warehouse = '" + model.fk_warehouse + "' and fk_product_rule = '" + model.fk_product_rule + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strsql);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable CountRuleForUpdateState(SetupModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strsql = "SELECT state FROM product_warehouse_rule_details INNER JOIN dbo.split('" + model.state + "', ',') s ON s.items IN(SELECT items FROM dbo.split(STATE, ',') )"
                               + " WHERE fk_vendor = '" + model.fk_vendor + "' and fk_product_rule = '" + model.fk_product_rule + "' and rowid NOT IN ('"+model.searchid+"') ";
                DataSet ds = SQLHelper.ExecuteDataSet(strsql);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Free product setup~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        public static int GetFreeProductCount(SetupModel model)
        {
            try
            {
                string strquery = "SELECT COUNT(product_id) from wp_product_free WHERE product_id = '" + model.product_id + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetFreeProductCount1(SetupModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT product_id from wp_product_free WHERE product_id = '" + model.product_id + "' ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int AddFreeProduct(SetupModel model)
        {
            try
            {
                string strsql = "INSERT into wp_product_free(product_id, free_product_id, free_quantity) values(@product_id, @free_product_id, @free_quantity);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@product_id", model.on_product_id),
                    new SqlParameter("@free_product_id",model.free_product_id),
                    new SqlParameter("@free_quantity",model.free_quantity),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetFreeProduct()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT wpf.rowid as id,concat(wpf.product_id,' - ',p.post_title) as product,concat(wpf.free_product_id,' - ',ps.post_title) as freeproduct ,free_quantity as quantity,wpf.product_id,wpf.free_product_id from wp_product_free wpf "
                                  + " left outer join wp_posts p on p.id = wpf.product_id"
                                  + " left outer join wp_posts ps on ps.id = wpf.free_product_id";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable SelectFreeProduct(long id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT * from wp_product_free where rowid='" + id + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataSet GetProducts2()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT COALESCE(ps.id,p.id) id,CONCAT(COALESCE(ps.post_title,p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as text"
                                + " FROM wp_posts as p"
                                + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                + " WHERE p.post_type = 'product' AND p.post_status = 'publish'";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int UpdateFreeProduct(SetupModel model)
        {
            try
            {
                string strsql = "UPDATE wp_product_free set free_product_id=@free_product_id, free_quantity=@free_quantity, status=@status where rowid = '" + model.rowid + "';";
                SqlParameter[] para =
               {                    
                    new SqlParameter("@free_product_id",model.free_product_id),
                    new SqlParameter("@free_quantity",model.free_quantity),
                    new SqlParameter("@status",model.status),
                };

                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddProductReturn(ProductReturnModel model)
        {
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@productid", model.productid),
                    new SqlParameter("@returndays", model.returndays),
                    new SqlParameter("@warrantydays", model.warrantydays),
                    new SqlParameter("@remarks", model.remarks),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar("erp_product_return_days_sp", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int UpdateProductReturn(ProductReturnModel model)
        {
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@rowid", model.rowid),
                    new SqlParameter("@productid", model.productid),
                    new SqlParameter("@returndays", model.returndays),
                    new SqlParameter("@warrantydays", model.warrantydays),
                    new SqlParameter("@remarks", model.remarks),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteNonQuery("erp_product_return_days_sp", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetTransactionTypeList(string ID, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid, post_title, returndays, warrantydays, remarks FROM erp_product_return_days eprd Left join wp_posts wp on wp.id = eprd.productid where 1=1 order by productid";
                if (!string.IsNullOrEmpty(searchid))
                {
                    //strWhr += " and (J.code like '%" + searchid + "%' OR N.Nature like '%" + searchid + "%' OR J.label like '%" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                //}
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from erp_product_return_days eprd Left join wp_posts wp on wp.id = eprd.productid where 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetProductReturnById(string id)
        {
            DataTable dt = new DataTable();
            string strQuery = string.Empty;
            try
            {
                strQuery = "SELECT rowid, productid, returndays, warrantydays, remarks FROM erp_product_return_days where rowid =" + id + "";
                dt = SQLHelper.ExecuteDataTable(strQuery);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable SelectProductId(int id)
        {
            DataTable dt = new DataTable();
            string strQuery = string.Empty;
            try
            {
                strQuery = "SELECT productid FROM erp_product_return_days where productid =" + id + "";
                dt = SQLHelper.ExecuteDataTable(strQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}
