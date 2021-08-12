using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class PurchaseOrderRepository
    {
        public static DataTable SearchProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "SELECT COALESCE(ps.id,p.id) id,CONCAT(COALESCE(ps.post_title,p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as text"
                                + " FROM wp_posts as p"
                                + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                + " WHERE p.post_type = 'product' AND p.post_status = 'publish'"
                                + " AND CONCAT(COALESCE(ps.post_title, p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%'"
                                + " ORDER BY id limit 50; ";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static List<PurchaseOrderProductsModel> GetProductsDetails(long product_id, long vendor_id)
        {
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();
            try
            {
                PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id),new MySqlParameter("@vendor_id", vendor_id)
                };
                string strSQl = "SELECT p.id,p.post_title,psku.meta_value sku,ir.fk_vendor,purchase_price"
                            + " FROM wp_posts as p"
                            + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                            + " left outer join Product_Purchase_Items ir on ir.fk_product = p.id and(ir.fk_vendor=0 or ir.fk_vendor=@vendor_id)"
                            + " WHERE p.post_type in('product', 'product_variation') AND p.post_status = 'publish'"
                            + " AND p.id = @product_id ORDER BY fk_vendor desc limit 1;";                
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    productsModel = new PurchaseOrderProductsModel();
                    if (sdr["id"] != DBNull.Value)
                        productsModel.fk_product = Convert.ToInt64(sdr["id"]);
                    else
                        productsModel.fk_product = 0;                   
                    if (sdr["post_title"] != DBNull.Value)
                        productsModel.description = sdr["post_title"].ToString();
                    else
                        productsModel.description = string.Empty;
                    if (sdr["sku"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sku"].ToString().Trim()))
                        productsModel.product_sku = sdr["sku"].ToString();
                    else
                        productsModel.product_sku = string.Empty;
                    if (sdr["purchase_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["purchase_price"].ToString().Trim()))
                        productsModel.subprice = decimal.Parse(sdr["purchase_price"].ToString().Trim());
                    else
                        productsModel.subprice = 0;
                    productsModel.qty = 1;
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static DataSet GetAllMasterList()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select id,PaymentTerm text from PaymentTerms order by id;"
                            + " Select id, PaymentType text from wp_PaymentType order by id;"
                            + " Select id, Balance text from BalanceDays order by id;"
                            + " Select rowid id,IncoTerm text,short_description from IncoTerms order by id;";
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
                string strSQl = "select rowid as ID, concat(name,' (',name_alias,')') as Name from wp_vendor where VendorStatus=1 order by rowid desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public string GetPurchaseOrderCode()
        {
            string result = "";
            try
            {
                string strsql = "SELECT CONCAT('PO', DATE_FORMAT(CURDATE(),'%y%m'),'-',max(LPAD(rowid+1 ,5,0)))  as Code from commerce_purchase_order;";
                result = SQLHelper.ExecuteScalar(strsql).ToString();
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public static DataTable GetIncotermByID(int IncotermsTypeID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "Select rowid as ID, IncoTerm, short_description from IncoTerms where rowid=" + IncotermsTypeID + " order by ID;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GetVendorByID(long VendorID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select rowid as ID, concat(name,' (',name_alias,')') as Name, code_vendor as vendor from wp_vendor where rowid=" + VendorID + " and VendorStatus=1 order by ID;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static long AddPurchaseOrder(PurchaseOrderModel model)
        {
            long result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
               

                string strSQL = "insert into commerce_purchase_order(ref,fk_soc,tms,date_creation,fk_user_author,source)"
                            + " select concat('PO',date_format(@date_creation,'%y%m'),'-',LPAD(coalesce(max(right(ref,5)),0) + 1,5,'0')) ref,@fk_soc,@tms,@date_creation,@fk_user_author,@source"
                            + " from commerce_purchase_order where LPAD(ref,6,0) = concat('PO',date_format(@date_creation,'%y%m'));";

                strSQL += "select LAST_INSERT_ID();";

                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@tms", cUTFDate),
                    new MySqlParameter("@date_creation", cDate),
                    new MySqlParameter("@source", "0"),
                    new MySqlParameter("fk_soc", model.VendorID),
                    new MySqlParameter("@fk_user_author", model.user_author)
                };
                result = Convert.ToInt64(SQLHelper.ExecuteScalar(strSQL, parameters));
            }
            catch (MySql.Data.MySqlClient.MySqlException ex)
            {
                throw new Exception(ex.Message);

            }
            return result;
        }






        public int AddNewPurchase(PurchaseOrderModel model)
        {
            try
            {
                 
                string refe = GetPurchaseOrderCode();

                string strsql = "";
                strsql = "insert into commerce_purchase_order(ref,ref_ext,ref_supplier,fk_soc,fk_statut,source,fk_cond_reglement,BalanceDaysID,fk_mode_reglement,date_livraison,fk_incoterms,location_incoterms,note_private,note_public) values(@ref,@ref_ext,@ref_supplier,@fk_soc,@fk_statut,@source,@fk_cond_reglement,@BalanceDaysID,@fk_mode_reglement,@date_livraison,@fk_incoterms,@location_incoterms,@note_private,@note_public); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", refe),
                    new MySqlParameter("@ref_ext", model.VendorCode),
                    new MySqlParameter("@ref_supplier", model.Vendor),
                    new MySqlParameter("@fk_soc", model.VendorID),
                    new MySqlParameter("@fk_statut", "1"),
                    new MySqlParameter("@source", "0"),
                    new MySqlParameter("@fk_cond_reglement", model.PaymentTerms),
                    new MySqlParameter("@BalanceDaysID", model.Balancedays),
                    new MySqlParameter("@fk_mode_reglement", model.PaymentType),
                    new MySqlParameter("@date_livraison", model.Planneddateofdelivery),
                    new MySqlParameter("@fk_incoterms", model.IncotermType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@note_public", model.note_public),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditPurchase(PurchaseOrderModel model, long PurchaseID)
        {
            try
            {
                string strsql = "Update commerce_purchase_order set ref=@ref,ref_supplier=@ref_supplier,fk_soc=@fk_soc,fk_statut=@fk_statut,source=@source,fk_cond_reglement = @fk_cond_reglement,BalanceDaysID = @BalanceDaysID,fk_mode_reglement = @fk_mode_reglement,date_livraison = @date_livraison,fk_incoterms = @fk_incoterms,location_incoterms = @location_incoterms,note_private = @note_private,note_public = @note_public where rowid = " + PurchaseID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref_ext", model.VendorCode),
                    new MySqlParameter("@ref_supplier", model.Vendor),
                    new MySqlParameter("@fk_soc", model.VendorID),
                    new MySqlParameter("@fk_statut", "1"),
                    new MySqlParameter("@source", "0"),
                    new MySqlParameter("@fk_cond_reglement", model.PaymentTerms),
                    new MySqlParameter("@BalanceDaysID", model.Balancedays),
                    new MySqlParameter("@fk_mode_reglement", model.PaymentType),
                    new MySqlParameter("@date_livraison", model.Planneddateofdelivery),
                    new MySqlParameter("@fk_incoterms", model.IncotermType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@note_public", model.note_public),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetPurchaseOrder(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.rowid id, p.ref, p.ref_ext RefOrderVendor,v.SalesRepresentative RequestAuthor, v.name VendorName,v.fk_state City, v.zip,LEFT(CAST(p.date_livraison AS DATE), 10) PlannedDateofDelivery, s.Status from commerce_purchase_order p inner join wp_vendor v on p.fk_soc = v.rowid inner join wp_StatusMaster s on p.fk_statut = s.ID where 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (email like '%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR nom like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_order p inner join wp_vendor v on p.fk_soc = v.rowid inner join wp_StatusMaster s on p.fk_statut = s.ID  WHERE 1 = 1 " + strWhr.ToString();

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

        public static DataTable GetPurchaseOrderByID(string id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select p.rowid id, p.ref, p.ref_ext RefOrderVendor,v.SalesRepresentative RequestAuthor, p.ref_supplier VendorName,v.fk_departement City, v.zip,LEFT(CAST(p.date_livraison AS DATE), 10) PlannedDateofDelivery, s.Status,concat(i.incoterm, ' - ', p.location_incoterms) as incoterms , p.note_public, p.note_private,pt.PaymentTerm,ty.PaymentType,b.Balance from commerce_purchase_order p inner join wp_vendor v on p.fk_soc = v.rowid left join wp_StatusMaster s on p.fk_statut = s.ID left join IncoTerms i on p.fk_incoterms = i.rowid left join PaymentTerms pt on p.fk_cond_reglement = pt.ID left join wp_PaymentType ty on p.fk_mode_reglement = ty.ID left join BalanceDays b on p.BalanceDaysID = b.ID where ref='" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static List<OrderProductsModel> GetProductListDetails(long product_id, long variation_id)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                string free_products = string.Empty;
                if (product_id == 118)
                    free_products = "632713";
                else if (product_id == 611172)
                    free_products = "78676";
                else
                    free_products = "";

                OrderProductsModel productsModel = new OrderProductsModel();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id),
                    new MySqlParameter("@variation_id", variation_id)
                };
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , COALESCE(pr.meta_value, 0) reg_price,COALESCE(psr.meta_value, 0) sale_price FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_price'"
                            + " WHERE post.post_type = 'product' and post.id = @product_id and ps.id = @variation_id ";
                if (product_id == 611172 && !string.IsNullOrEmpty(free_products))
                    strSQl += " OR (post.id in (" + free_products + ") and COALESCE(ps.id,0) = 0);";
                else if (product_id == 118 && !string.IsNullOrEmpty(free_products))
                    strSQl += " OR (post.id in (" + free_products + ") and COALESCE(ps.id,0) = 0);";
                else
                    strSQl += ";";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    productsModel = new OrderProductsModel();
                    if (sdr["id"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["id"]);
                    else
                        productsModel.product_id = 0;
                    if (sdr["pr_id"] != DBNull.Value)
                        productsModel.variation_id = Convert.ToInt64(sdr["pr_id"]);
                    else
                        productsModel.variation_id = 0;
                    if (sdr["post_title"] != DBNull.Value)
                        productsModel.product_name = sdr["post_title"].ToString();
                    else
                        productsModel.product_name = string.Empty;
                    if (sdr["reg_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["reg_price"].ToString().Trim()))
                        productsModel.reg_price = decimal.Parse(sdr["reg_price"].ToString());
                    else
                        productsModel.reg_price = 0;
                    if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                        productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                    else
                        productsModel.sale_price = productsModel.reg_price;
                    productsModel.price = productsModel.sale_price;
                    productsModel.quantity = 1;
                    /// free item
                    if (productsModel.product_id == 78676) { productsModel.is_free = true; productsModel.quantity = 2; }
                    else if (productsModel.product_id == 632713) { productsModel.is_free = true; productsModel.quantity = 2; }
                    else productsModel.is_free = false;

                    /// 
                    if (productsModel.product_id == 611172) productsModel.group_id = 78676;
                    else if (productsModel.product_id == 118) productsModel.group_id = 632713;
                    else productsModel.group_id = 0;

                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
    }
}