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

        public static DataSet GetPurchaseOrderByID(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                MySqlParameter[] para = { new MySqlParameter("@po_id", id), };
                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier,fk_warehouse,fk_status,source,fk_payment_term,fk_balance_days,fk_payment_type,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,"
                                + " fk_incoterms,location_incoterms,note_private,note_public,fk_user_author,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation from commerce_purchase_order where rowid = @po_id;"
                                + " select rowid,fk_purchase,fk_product,ref product_sku,description,qty, (select IFNULL(sum(recqty),0) from  commerce_purchase_receive_order_detail  where fk_purchase = cprd.fk_purchase and fk_product =  cprd.fk_product ) recbal,discount_percent,discount,subprice,total_ht,tva_tx,localtax1_tx,localtax1_type,"
                                + " localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_ttc,product_type,date_start,date_end,rang"
                                + " from commerce_purchase_order_detail cprd where fk_purchase = @po_id;";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
    }
}