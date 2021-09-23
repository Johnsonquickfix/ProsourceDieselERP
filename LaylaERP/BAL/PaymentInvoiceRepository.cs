using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LaylaERP.BAL
{
    public class PaymentInvoiceRepository
    {
        public static DataTable GetPurchaseOrder(string sMonths, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.rowid id, p.ref, p.ref_ext refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.ref_ext <> '' and p.fk_status= 3 and 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.SalesRepresentative)='" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(p.date_creation as date) BETWEEN " + sMonths;
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_order p inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID WHERE p.ref_ext <> '' and p.fk_status= 3 and 1 = 1 " + strWhr.ToString();

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

        public static DataTable GetPartiallyOrderList(string sMonths, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.rowid ids,p.fk_purchase id, p.rowid RicD,(select ref from commerce_purchase_order where rowid = p.fk_purchase) ref, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_receive_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_status= 5 and 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.SalesRepresentative)='" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(p.date_creation as date) BETWEEN " + sMonths;
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_receive_order p inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID WHERE p.fk_status= 5 and 1 = 1 " + strWhr.ToString();

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

        public static DataSet GetPurchaseOrderByID(string id)
        {
            DataSet ds = new DataSet();
            try
            {
                MySqlParameter[] para = { new MySqlParameter("@po_id", id), };
                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref ref_ext,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc, ifnull(epi.amount,0) recieved,ifnull(total_ttc-ifnull(epi.amount,0),0) remaining from commerce_purchase_receive_order cpo"
                                + "   left outer join erp_payment_invoice epi on epi.fk_invoice = cpo.rowid and type = 'PR'"
                                + "  where cpo.rowid in (" + id + ");";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet GetPRPurchaseOrderByID(string id)
        {
            DataSet ds = new DataSet();
            try
            {
                MySqlParameter[] para = { new MySqlParameter("@po_id", id), };
                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref_ext ,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc, ifnull(epi.amount,0) recieved,ifnull(total_ttc-ifnull(epi.amount,0),0) remaining from commerce_purchase_order cpo"
                                + "  left outer join erp_payment_invoice epi on epi.fk_invoice = cpo.rowid and type = 'PO'"
                                + "  where cpo.rowid in (" + id + ");";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataSet GetPaymentType()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select id,PaymentType text from wp_PaymentType order by id;"
                          + " Select rowid id, label text from erp_bank_account order by rowid;";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public long TakePayment(PurchaseReceiceOrderModel model)
        {
            long result = 0;
            try
            {

                string str_oiid = string.Join(",", model.PurchaseOrderProducts.Select(x => x.rowid.ToString()).ToArray());
                string strsql = "";
                string strsqlins = "";
                string strstock = "";
                // string strupdate = "";
                StringBuilder strupdate = new StringBuilder();
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strPOYearMonth = cDate.ToString("yyMM").PadRight(4);
                MySqlParameter[] para = { };
                //if (model.RowID > 0)
                //{
                //    strsql = string.Format("delete from commerce_purchase_receive_order_detail where fk_purchase = '{0}' and rowid not in ({1});", model.RowID, str_oiid);
                //    strsql += string.Format("update commerce_purchase_receive_order set ref_ext='',fk_status='1',ref_supplier='{0}',fk_supplier='{1}',fk_payment_term='{2}',fk_balance_days='{3}',fk_incoterms='{4}',location_incoterms='{5}',"
                //            + "fk_payment_type='{6}',date_livraison='{7}',note_private='{8}',note_public='{9}',discount='{10}',total_tva='{11}',localtax1='{12}',localtax2='{13}',total_ht='{14}',total_ttc='{15}' where rowid='{16}';",
                //            model.VendorBillNo, model.VendorID, model.PaymentTerms, model.Balancedays, model.IncotermType, model.Incoterms, model.PaymentType, model.Planneddateofdelivery, model.NotePrivate, model.NotePublic,
                //            model.discount, model.total_tva, model.localtax1, model.localtax2, model.total_ht, model.total_ttc, model.RowID);
                //}
                //else
                //{

                //strupdate = string.Format("update commerce_purchase_order set fk_status = '{0}' where rowid = '{1}';", model.fk_status, model.IDRec);
                strupdate.Append(string.Format("update commerce_purchase_order set fk_status = '{0}' where rowid = '{1}'; ", model.fk_status, model.IDRec));
                strupdate.Append(string.Format("update commerce_purchase_receive_order set fk_status = '{0}' where fk_purchase = '{1}' ", model.fk_status, model.IDRec));
                SQLHelper.ExecuteNonQueryWithTrans(strupdate.ToString());
                strsqlins = "insert into commerce_purchase_receive_order(ref,ref_ext,ref_supplier,fk_supplier,fk_status,source,fk_payment_term,fk_balance_days,fk_payment_type,date_livraison,fk_incoterms,location_incoterms,note_private,note_public,fk_user_author,date_creation,discount,total_tva,localtax1,localtax2,total_ht,total_ttc,fk_purchase) "
                        + string.Format("select concat('PR" + strPOYearMonth + "-',lpad(coalesce(max(right(ref,5)),0) + 1,5,'0')) ref,'','{0}','{1}','{2}','0','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}' from commerce_purchase_receive_order where lpad(ref,6,0) = 'PR" + strPOYearMonth + "';select LAST_INSERT_ID();",
                                model.VendorBillNo, model.VendorID, model.fk_status, model.PaymentTerms, model.Balancedays, model.PaymentType, model.Planneddateofdelivery, model.IncotermType, model.Incoterms, model.NotePrivate, model.NotePublic, model.LoginID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), model.discount, model.total_tva, model.localtax1, model.localtax2, model.total_ht, model.total_ttc, model.IDRec);

                model.RowID = Convert.ToInt64(SQLHelper.ExecuteScalar(strsqlins, para));
                //}
                /// step 2 : commerce_purchase_receive_order_detail
                foreach (PurchaseReceiceOrderProductsModel obj in model.PurchaseOrderProducts)
                {
                    //if (obj.rowid > 0)
                    //{
                    //    strsql += string.Format("update commerce_purchase_receive_order_detail set ref='{0}',description='{1}',qty='{2}',discount_percent='{3}',discount='{4}',subprice='{5}',total_ht='{6}',total_ttc='{7}',date_start='{8}',date_end='{9}',rang='{10}',"
                    //        + " tva_tx='{11}',localtax1_tx='{12}',localtax1_type='{13}',localtax2_tx='{14}',localtax2_type='{15}',total_tva='{16}',total_localtax1='{17}',total_localtax2='{18}' where rowid='{19}';",
                    //        obj.product_sku, obj.description, obj.qty, obj.discount_percent, obj.discount, obj.subprice, obj.total_ht, obj.total_ttc, obj.date_start, obj.date_end, obj.rang,
                    //        obj.tva_tx, obj.localtax1_tx, obj.localtax1_type, obj.localtax2_tx, obj.localtax2_type, obj.total_tva, obj.total_localtax1, obj.total_localtax2, obj.rowid);
                    //}
                    //else
                    //{
                    strsql += "insert into commerce_purchase_receive_order_detail (fk_purchase_re,fk_purchase,fk_product,ref,description,qty,recqty,discount_percent,discount,subprice,total_ht,total_ttc,product_type,date_start,date_end,rang,tva_tx,localtax1_tx,localtax1_type,localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2) ";
                    strsql += string.Format(" select '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}','{20}','{21}','{22}','{23}';",
                        model.RowID, model.IDRec, obj.fk_product, obj.product_sku, obj.description, obj.qty, obj.Recqty, obj.discount_percent, obj.discount, obj.subprice, obj.total_ht, obj.total_ttc, obj.product_type, obj.date_start, obj.date_end, obj.rang,
                        obj.tva_tx, obj.localtax1_tx, obj.localtax1_type, obj.localtax2_tx, obj.localtax2_type, obj.total_tva, obj.total_localtax1, obj.total_localtax2);
                    //}
                }
                SQLHelper.ExecuteNonQueryWithTrans(strsql);
                //Add Stock
                // strsql += "delete from product_stock_register where tran_type = 'PO' and flag = 'O' and tran_id = " + model.RowID + ";"

                if (model.WarehouseID == model.WarehousepoID)
                {
                    foreach (PurchaseReceiceOrderProductsModel obj in model.PurchaseOrderProducts)
                    {
                        strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                        strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','R' ;",
                              model.RowID, obj.fk_product, model.WarehouseID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                        //+" inner join commerce_purchase_receive_order po on po.rowid = pod.fk_purchase_re where fk_purchase_re = " + model.RowID + ";");
                    }
                }
                else
                {
                    foreach (PurchaseReceiceOrderProductsModel obj in model.PurchaseOrderProducts)
                    {
                        strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                        strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','R' ;",
                              model.RowID, obj.fk_product, model.WarehouseID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                        strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                        strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','O' ;",
                              model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                        strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                        strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','R' ;",
                              model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                        strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                        strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','I' ;",
                              model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                        //+" inner join commerce_purchase_receive_order po on po.rowid = pod.fk_purchase_re where fk_purchase_re = " + model.RowID + ";");
                    }
                }
                // if (SQLHelper.ExecuteNonQueryWithTrans(strstock) > 0)
                // select 'PR',pod.fk_purchase_re,pod.fk_product," + model.WarehouseID + ",po.date_creation,pod.qty,'R' from commerce_purchase_receive_order_detail pod"
                SQLHelper.ExecuteScalar(strstock, para);
                result = model.RowID;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }
    }
}