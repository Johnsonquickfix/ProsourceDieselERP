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
        public static DataTable SearchVenderProducts(long vendor_id)
        {
            DataTable DT = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@vendor_id", vendor_id)
                };
                string strSQl = "SELECT p.id id,CONCAT(p.post_title, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as text"
                                + " FROM wp_posts as p"
                                + " inner join Product_Purchase_Items ir on ir.fk_product = p.id and ir.fk_vendor=@vendor_id"
                                + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                                + " WHERE p.post_type in ('product', 'product_variation') AND p.post_status = 'publish' ORDER BY id; ";
                DT = SQLHelper.ExecuteDataTable(strSQl, parameters);
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
                string strSQl = "SELECT p.id,p.post_title,psku.meta_value sku,ir.fk_vendor,purchase_price,salestax,shipping_price,discount"
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
                    if (sdr["salestax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["salestax"].ToString().Trim()))
                        productsModel.localtax1_tx = decimal.Parse(sdr["salestax"].ToString().Trim());
                    else
                        productsModel.localtax1_tx = 0;
                    productsModel.localtax1_type = "F";
                    if (sdr["shipping_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["shipping_price"].ToString().Trim()))
                        productsModel.localtax2_tx = decimal.Parse(sdr["shipping_price"].ToString().Trim());
                    else
                        productsModel.localtax2_tx = 0;
                    productsModel.localtax2_type = "F";
                    if (sdr["discount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount"].ToString().Trim()))
                        productsModel.discount_percent = decimal.Parse(sdr["discount"].ToString().Trim());
                    else
                        productsModel.discount_percent = 0;
                    productsModel.qty = 1;
                    productsModel.total_ht = productsModel.localtax1_tx * productsModel.qty;
                    productsModel.discount = productsModel.total_ht * (productsModel.discount_percent / 100);
                    productsModel.total_localtax1 = productsModel.localtax1_tx * productsModel.qty;
                    productsModel.total_localtax2 = productsModel.localtax2_tx * productsModel.qty;
                    productsModel.total_ttc = productsModel.total_ht - productsModel.discount + productsModel.total_localtax1 + productsModel.total_localtax2;
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
                MySqlParameter[] parameters = { new MySqlParameter("@rowid", VendorID) };
                string strSQl = "select rowid,vendor_type,name,name_alias,code_vendor,address,town,fk_country,fk_state,zip,phone,fax,email,url,fk_incoterms,location_incoterms,PaymentTermsID,BalanceID,Paymentmethod from wp_vendor v left outer join wp_VendorPaymentDetails vpd on vpd.VendorID = v.rowid where rowid=@rowid;";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        //Save and update Purchase order
        public long AddNewPurchase(PurchaseOrderModel model)
        {
            long result = 0;
            try
            {
                string str_oiid = string.Join(",", model.PurchaseOrderProducts.Select(x => x.rowid.ToString()).ToArray());
                string strsql = "";
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strPOYearMonth = cDate.ToString("yyMM").PadRight(4);
                MySqlParameter[] para = { };
                if (model.RowID > 0)
                {
                    strsql = string.Format("delete from commerce_purchase_order_detail where fk_purchase = '{0}' and rowid not in ({1});", model.RowID, str_oiid);
                    strsql += string.Format("update commerce_purchase_order set ref_supplier='{0}',fk_supplier='{1}',fk_payment_term='{2}',fk_balance_days='{3}',fk_incoterms='{4}',location_incoterms='{5}',"
                            + "fk_payment_type='{6}',date_livraison='{7}',note_private='{8}',note_public='{9}',discount='{10}',total_tva='{11}',localtax1='{12}',localtax2='{13}',total_ht='{14}',total_ttc='{15}' where rowid='{16}';",
                            model.VendorBillNo, model.VendorID, model.PaymentTerms, model.Balancedays, model.IncotermType, model.Incoterms, model.PaymentType, model.Planneddateofdelivery, model.NotePrivate, model.NotePublic,
                            model.discount, model.total_tva, model.localtax1, model.localtax2, model.total_ht, model.total_ttc, model.RowID);
                }
                else
                {
                    strsql = "insert into commerce_purchase_order(ref,ref_ext,ref_supplier,fk_supplier,fk_status,source,fk_payment_term,fk_balance_days,fk_payment_type,date_livraison,fk_incoterms,location_incoterms,note_private,note_public,fk_user_author,date_creation,discount,total_tva,localtax1,localtax2,total_ht,total_ttc) "
                        + string.Format("select concat('PO" + strPOYearMonth + "-',lpad(coalesce(max(right(ref,5)),0) + 1,5,'0')) ref,'','{0}','{1}','1','0','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}' from commerce_purchase_order where lpad(ref,6,0) = 'PO" + strPOYearMonth + "';select LAST_INSERT_ID();",
                                model.VendorBillNo, model.VendorID, model.PaymentTerms, model.Balancedays, model.PaymentType, model.Planneddateofdelivery, model.IncotermType, model.Incoterms, model.NotePrivate, model.NotePublic, model.LoginID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), model.discount, model.total_tva, model.localtax1, model.localtax2, model.total_ht, model.total_ttc);

                    model.RowID = Convert.ToInt64(SQLHelper.ExecuteScalar(strsql, para));
                }
                /// step 2 : commerce_purchase_order_detail
                foreach (PurchaseOrderProductsModel obj in model.PurchaseOrderProducts)
                {
                    if (obj.rowid > 0)
                    {
                        strsql += string.Format("update commerce_purchase_order_detail set ref='{0}',description='{1}',qty='{2}',discount_percent='{3}',discount='{4}',subprice='{5}',total_ht='{6}',total_ttc='{7}',date_start='{8}',date_end='{9}',rang='{10}',"
                            + " tva_tx='{11}',localtax1_tx='{12}',localtax1_type='{13}',localtax2_tx='{14}',localtax2_type='{15}',total_tva='{16}',total_localtax1='{17}',total_localtax2='{18}' where rowid='{19}';",
                            obj.product_sku, obj.description, obj.qty, obj.discount_percent, obj.discount, obj.subprice, obj.total_ht, obj.total_ttc, obj.date_start, obj.date_end, obj.rang,
                            obj.tva_tx, obj.localtax1_tx, obj.localtax1_type, obj.localtax2_tx, obj.localtax2_type, obj.total_tva, obj.total_localtax1, obj.total_localtax2, obj.rowid);
                    }
                    else
                    {
                        strsql += "insert into commerce_purchase_order_detail (fk_purchase,fk_product,ref,description,qty,discount_percent,discount,subprice,total_ht,total_ttc,product_type,date_start,date_end,rang,tva_tx,localtax1_tx,localtax1_type,localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2) ";
                        strsql += string.Format(" select '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}','{20}','{21}';",
                            model.RowID, obj.fk_product, obj.product_sku, obj.description, obj.qty, obj.discount_percent, obj.discount, obj.subprice, obj.total_ht, obj.total_ttc, obj.product_type, obj.date_start, obj.date_end, obj.rang,
                            obj.tva_tx, obj.localtax1_tx, obj.localtax1_type, obj.localtax2_tx, obj.localtax2_type, obj.total_tva, obj.total_localtax1, obj.total_localtax2);
                    }
                }
                if (SQLHelper.ExecuteNonQueryWithTrans(strsql) > 0)
                    result = model.RowID;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }
        public long UpdatePurchaseStatus(PurchaseOrderModel model)
        {
            long result = 0;
            try
            {
                string strsql = "";
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strPOYearMonth = cDate.ToString("yyMM").PadRight(4);
                if (model.Status == 3)
                    strsql += string.Format("update commerce_purchase_order set fk_status='{0}',ref_ext=REPLACE(ref,'PO','PI') where rowid in ({1});", model.Status, model.Search);
                else
                    strsql += string.Format("update commerce_purchase_order set fk_status='{0}' where rowid in ({1});", model.Status, model.Search);
                result = SQLHelper.ExecuteNonQueryWithTrans(strsql);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }
        //Get Purchase order
        public static DataSet GetPurchaseOrderByID(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                MySqlParameter[] para = { new MySqlParameter("@po_id", id), };
                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier,fk_status,source,fk_payment_term,fk_balance_days,fk_payment_type,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,"
                                + " fk_incoterms,location_incoterms,note_private,note_public,fk_user_author,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation from commerce_purchase_order where rowid = @po_id;"
                                + " select rowid,fk_purchase,fk_product,ref product_sku,description,qty,discount_percent,discount,subprice,total_ht,tva_tx,localtax1_tx,localtax1_type,"
                                + " localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_ttc,product_type,date_start,date_end,rang"
                                + " from commerce_purchase_order_detail where fk_purchase = @po_id;";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        //Get Purchase order
        public static DataSet GetPurchaseOrder(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                MySqlParameter[] para = { new MySqlParameter("@po_id", id), };
                string strSql = "select po.rowid,po.ref,po.ref_ext,po.ref_supplier,po.fk_supplier,po.fk_status,po.fk_payment_term,pt.PaymentTerm,po.fk_balance_days,bd.Balance,po.fk_payment_type,"
                                + " DATE_FORMAT(po.date_livraison, '%m/%d/%Y') date_livraison,po.fk_incoterms,po.location_incoterms,po.note_private,po.note_public,DATE_FORMAT(po.date_creation, '%m/%d/%Y') date_creation,"
                                + " v.name vendor_name,v.address,COALESCE(v.town,'') town,v.fk_country,v.fk_state,v.zip,COALESCE(v.phone,''),COALESCE(v.email,'') vendor_email"
                                + " from commerce_purchase_order po inner join wp_vendor v on po.fk_supplier = v.rowid"
                                + " left outer join PaymentTerms pt on pt.id = po.fk_payment_term"
                                + " left outer join BalanceDays bd on bd.id = po.fk_balance_days where po.rowid = @po_id;"
                                + " select rowid,fk_purchase,fk_product,ref product_sku,description,qty,discount_percent,discount,subprice,total_ht,tva_tx,localtax1_tx,localtax1_type,"
                                + " localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_ttc,product_type,date_start,date_end,rang"
                                + " from commerce_purchase_order_detail where fk_purchase = @po_id;";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetPurchaseOrder(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.rowid id, p.ref, p.ref_ext refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.ref like '" + searchid + "%' OR p.ref_ext='" + searchid + "%' OR v.SalesRepresentative='" + searchid + "%' OR v.name like '" + searchid + "%' OR v.fk_state like '" + searchid + "%' OR v.zip like '" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_order p inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID WHERE 1 = 1 " + strWhr.ToString();

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