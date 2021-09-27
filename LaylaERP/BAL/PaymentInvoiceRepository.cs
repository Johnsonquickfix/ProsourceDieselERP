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
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc, (select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=p.rowid and  type = 'PO') recieved,ifnull(total_ttc - (select ifnull(sum(amount), 0) from erp_payment_invoice where fk_invoice = p.rowid and  type = 'PO'),0) remaining from commerce_purchase_order p"
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
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc, (select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=p.rowid and  type = 'PR') recieved,ifnull(total_ttc - (select ifnull(sum(amount), 0) from erp_payment_invoice where fk_invoice = p.rowid and  type = 'PR'),0) remaining from commerce_purchase_receive_order p"
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
                //string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref ref_ext,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc, ifnull(epi.amount,0) recieved,ifnull(total_ttc-ifnull(epi.amount,0),0) remaining from commerce_purchase_receive_order cpo"
                //                + "   left outer join erp_payment_invoice epi on epi.fk_invoice = cpo.rowid and type = 'PR'"
                //                + "  where cpo.rowid in (" + id + ");";

                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref ref_ext,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc,(select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=cpo.rowid and  type = 'PR') recieved,ifnull(total_ttc-(select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=cpo.rowid and  type = 'PR'),0) remaining "
                            + "  from commerce_purchase_receive_order cpo"
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
                //string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref_ext ,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc, ifnull(epi.amount,0) recieved,ifnull(total_ttc-ifnull(epi.amount,0),0) remaining from commerce_purchase_order cpo"
                //                + "  left outer join erp_payment_invoice epi on epi.fk_invoice = cpo.rowid and type = 'PO'"
                //                + "  where cpo.rowid in (" + id + ");";
                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref_ext ,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc,(select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=cpo.rowid and  type = 'PO') recieved,ifnull(total_ttc-(select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=cpo.rowid and  type = 'PO'),0) remaining "
                + "  from commerce_purchase_order cpo"
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

        public long TakePayment(PaymentInvoiceModel model)
        {
            long result = 0;
            try
            {
                //string str_oiid = string.Join(",", model.PurchaseOrderProducts.Select(x => x.rowid.ToString()).ToArray());
                string strsql = "";
                string strsqlins = "";
                StringBuilder strupdate = new StringBuilder();
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strPOYearMonth = cDate.ToString("yyMM").PadRight(4);
                MySqlParameter[] para = { }; 
                strsqlins = "insert into erp_payment(ref,ref_ext,entity,datec,datep,amount,fk_payment,num_payment,note,bankcheck,fk_bank,status,comments) "
                        + string.Format("select concat('PY" + strPOYearMonth + "-',lpad(coalesce(max(right(ref,5)),0) + 1,5,'0')) ref,'','1','{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}' from erp_payment where lpad(ref,6,0) = 'PY" + strPOYearMonth + "';select LAST_INSERT_ID();",
                                cDate.ToString("yyyy-MM-dd HH:mm:ss"), cDate.ToString("yyyy-MM-dd HH:mm:ss"), model.amount, model.fk_payment, model.num_payment, model.note, model.bankcheck, model.fk_bank, model.status, model.comments);

                model.rowid = Convert.ToInt64(SQLHelper.ExecuteScalar(strsqlins, para));
                //}
                /// step 2 : commerce_purchase_receive_order_detail
                foreach (PaymentInvoiceDetailsModel obj in model.PaymentInvoiceDetails)
                {                    
                    strsql += "insert into erp_payment_invoice(fk_payment,fk_invoice,amount,type) ";
                    strsql += string.Format(" select '{0}','{1}','{2}','{3}';",
                        model.rowid, obj.rowid, obj.payamount, obj.type);
                }
                SQLHelper.ExecuteNonQueryWithTrans(strsql);
           
                result = model.rowid;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }
    }
}