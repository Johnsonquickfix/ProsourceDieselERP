using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace LaylaERP.BAL
{
    public class PurchaseProductRepository
    {
        public static DataTable GetCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
               
                string strSql = "select sum(case when post_status not in('auto-draft') then 1 else 0 end) AllOrder,"
                          + " sum(case when post_status = 'publish' then 1 else 0 end) Publish,"
                          + " sum(case when post_status = 'publish' then 1 else 0 end)+sum(case post_status when 'private' then 1 else 0 end) Private,"
                          + " sum(case when post_status = 'trash' then 1 else 0 end) Trash"
                          + " from wp_posts p where p.post_type = 'purchase_product' and post_status != 'draft'"; 
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetProductList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {

                    new SqlParameter("@post_status", userstatus),
                   new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@strValue1", strValue1),
                    new SqlParameter("@strValue3", strValue3),
                    new SqlParameter("@strValue4", strValue4),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "LST")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("cms_purchase_product_search", parameters);
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

        public int UpdateproductcomponentStatus(AccountingJournalModel model)
        { 
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();                
                string res = string.Empty;

            SqlParameter[] parameters =
           {
                     new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@status", model.active),
                 };
                res = SQLHelper.ExecuteScalar("erp_updateproductcomponent", parameters).ToString();
                 if (res.StartsWith("Success"))
                    result = 1; 
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }

        public int Changestatus(OrderPostStatusModel model, string ID)
        {
            try
            {
                string strsql = string.Format("update wp_posts set post_status=@status,post_modified_gmt=@post_modified_gmt where id  in ({0}); ", ID);
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.status),
                     new SqlParameter("@post_modified_gmt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/Changestatus/" + "0" + "", "Update Product Status");
                throw Ex;
            }
        }

        public static DataSet getvariationdetailsbyid(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "cms_getpurchasevariationdetailsbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static int EditProducts(ProductModel model, long ID)
        {
            try
            {
                string strsql = "erp_product_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UPP"),
                    new SqlParameter("@id", ID),
                    new SqlParameter("@post_content", model.post_content),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@post_status", model.post_status),
                    new SqlParameter("@post_modified",model.PublishDate),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Product/CreateProduct/" + ID + "", "Product Update Details");
                throw Ex;
            }
        }

        public static DataSet GetDataByID(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "erp_getpurchaseproductdetailsbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataSet Getlatestattributesbyid(OrderPostStatusModel model)
        {
            DataSet ds = new DataSet();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "cms_getpurvariationattbyid";

                ds = SQLHelper.ExecuteDataSet(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static List<ProductModelservices> GetsaleprodectdataData(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        strWhr += " fk_purchaseproduct = " + strValue1;
                    string strSQl = "SELECT wppp.post_title saleproduct,wpsp.post_title purchaseproduct ,ppp.rowid as ID,fk_saleproduct,fk_purchaseproduct ,case when is_active = 1 then 'Active' else 'InActive' end as Status"
                                + " from product_purchase_product ppp"
                                + " Left outer join wp_posts wppp on wppp.ID = ppp.fk_saleproduct"
                                 + " Left outer join wp_posts wpsp on wpsp.ID = ppp.fk_purchaseproduct"
                                + " WHERE " + strWhr;

                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;
                        if (sdr["saleproduct"] != DBNull.Value)
                            productsModel.product_name = sdr["saleproduct"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        if (sdr["purchaseproduct"] != DBNull.Value)
                            productsModel.product_label = sdr["purchaseproduct"].ToString();
                        else
                            productsModel.product_label = string.Empty;

                        productsModel.Stock = sdr["Status"].ToString();

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static int Addproductsale(ProductModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                strSql.Append(string.Format("insert into product_purchase_product(fk_purchaseproduct,fk_saleproduct) values ({0},{1}) ", model.fk_product, model.fk_vendor));

                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "PurchaseProduct/Addproductsale/" + model.ID + "", "Add warehouse to product");
                throw ex;
            }
            return result;
        }

        public static int Deletsaleprodect(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from product_warehouse where rowid = {0}; ", model.ID));
                StringBuilder strSql = new StringBuilder(string.Format("update product_purchase_product set is_active = 0 where rowid = {0}; ", model.ID));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "PurchaseProduct/DeleteProductwarehouse/" + model.ID + "", "Delete product warehouse");
                throw ex;
            }
            return result;
        }
        public static int Activesaleprodect(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from product_warehouse where rowid = {0}; ", model.ID));
                StringBuilder strSql = new StringBuilder(string.Format("update product_purchase_product set is_active = 1 where rowid = {0}; ", model.ID));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "PurchaseProduct/ActiveProductwarehouse/" + model.ID + "", "Active product warehouse");
                throw ex;
            }
            return result;
        }

        public static DataTable Getproductsaleproduct(ProductModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select fk_saleproduct from product_purchase_product"
                                + " WHERE fk_purchaseproduct = " + model.fk_product + " and fk_saleproduct in (" + model.fk_vendor + ") "
                                + " ;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}