using LaylaERP.DAL;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.BAL
{
    public class ImportOrderinvoiceRepository
    {
        public static DataTable GetImportPoList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();

            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT cp.rowid,document_id, CONVERT(varchar,doc_date,112) podatesort, CONVERT(varchar,doc_date, 101) po_date, CONVERT(varchar,doc_date,112) poduedatesort,payer_id,payer_name,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol,net_amount,freight_charge,sales_tax,total_amount,cmir,tracking_number,cp.name,street,city,state,zipcode,destination_country,cr_dr_memo_text,wv.name vendorname"
                               + " from commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(document_id,payer_id,CONVERT(varchar,doc_date, 101), payer_name, material_description, po_number,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol, net_amount, total_amount, cp.name, wv.name) like '%" + searchid + "%')";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(cp.rowid)/" + pagesize.ToString() + ") TotalPage,Count(cp.rowid) TotalRecord FROM commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1" + strWhr.ToString();

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
        public static DataTable GetCompareSalesPO(string filter, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();

            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = string.Empty;

                //string strSql = "SELECT cp.rowid,document_id, CONVERT(varchar,doc_date,112) podatesort, CONVERT(varchar,doc_date, 101) po_date, CONVERT(varchar,doc_date,112) poduedatesort,payer_id,payer_name,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol,net_amount,freight_charge,sales_tax,total_amount,cmir,tracking_number,cp.name,street,city,state,zipcode,destination_country,cr_dr_memo_text,wv.name vendorname"
                //               + " ,case when invoicestatus = 'Y' then 'Good to Pay' else 'Review' end as Applied from commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1";

              
                if (filter == "1")
                {
                    strSql = "SELECT cp.rowid,document_id, CONVERT(varchar,doc_date,112) podatesort, CONVERT(varchar,doc_date, 101) po_date, CONVERT(varchar,doc_date,112) poduedatesort,payer_id,payer_name,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol,net_amount,freight_charge,sales_tax,total_amount,cmir,tracking_number,cp.name,street,city,state,zipcode,destination_country,cr_dr_memo_text,wv.name vendorname"
                           + " ,  'Good to Pay' as Applied from commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1";

                    //// strWhr += " and invoicestatus is null and cp.rowid in (Select cpoi.rowid from commerce_purchase_enquiry p inner join  commerce_purchase_enquiry_detail  cped on cped.fk_purchase = p.rowid inner join commerce_purchase_order_invoice_import cpoi on cpoi.po_number = convert(varchar, fk_projet) + '-' + cped.ref and convert(numeric(18,2),cpoi.total_amount) = convert(numeric(18,2),cped.total_ht) and cpoi.vendor_id = p.fk_supplier inner join erp_payment_settlement_vendor psv on psv.order_id = p.fk_projet and delivery_status = 1 and payment_stauts in ('paid','settledSuccessfully') and ref_ext = '' )";
                    strWhr += " and invoicestatus is null and cp.rowid in (Select cpoi.rowid from commerce_purchase_enquiry p inner join  commerce_purchase_enquiry_detail  cped on cped.fk_purchase = p.rowid inner join commerce_purchase_order_invoice_import cpoi on cpoi.cmir =  cped.ref and convert(numeric(18,2),cpoi.total_amount) = convert(numeric(18,2),cped.total_ht) and cpoi.vendor_id = p.fk_supplier inner join erp_payment_settlement_vendor psv on psv.order_id = p.fk_projet and delivery_status = 1 and payment_stauts in ('paid','settledSuccessfully') and ref_ext = '' )";

                    // strWhr += " and cp.rowid in (Select cpoi.rowid from commerce_purchase_enquiry p inner join  commerce_purchase_enquiry_detail  cped on cped.fk_purchase = p.rowid inner join commerce_purchase_order_invoice_import cpoi on cpoi.po_number = convert(varchar, fk_projet) + '-' + cped.ref and convert(numeric(18,2),cpoi.total_amount) = convert(numeric(18,2),cped.total_ht) and cpoi.vendor_id = p.fk_supplier inner join erp_payment_settlement_vendor psv on psv.order_id = p.fk_projet and delivery_status = 1 and payment_stauts in ('paid','settledSuccessfully') )";
                    // strWhr += " and cp.rowid in (Select cpoi.rowid from commerce_purchase_enquiry p inner join  commerce_purchase_enquiry_detail  cped on cped.fk_purchase = p.rowid inner join commerce_purchase_order_invoice_import cpoi on cpoi.po_number = convert(varchar, fk_projet) + '-' + cped.ref and convert(numeric(18,2),cpoi.total_amount) = convert(numeric(18,2),cped.total_ht) and cpoi.vendor_id = p.fk_supplier )";
                }
                else if (filter == "2")
                {
                    strSql = "SELECT cp.rowid,document_id, CONVERT(varchar,doc_date,112) podatesort, CONVERT(varchar,doc_date, 101) po_date, CONVERT(varchar,doc_date,112) poduedatesort,payer_id,payer_name,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol,net_amount,freight_charge,sales_tax,total_amount,cmir,tracking_number,cp.name,street,city,state,zipcode,destination_country,cr_dr_memo_text,wv.name vendorname"
                           + " , 'Review' as Applied from commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1";

                    strWhr += " and cp.rowid not in (Select cpoi.rowid from commerce_purchase_enquiry p inner join  commerce_purchase_enquiry_detail  cped on cped.fk_purchase = p.rowid inner join commerce_purchase_order_invoice_import cpoi on cpoi.po_number = convert(varchar, fk_projet) + '-' + cped.ref and convert(numeric(18,2),cpoi.total_amount) = convert(numeric(18,2),cped.total_ht) and cpoi.vendor_id = p.fk_supplier inner join erp_payment_settlement_vendor psv on psv.order_id = p.fk_projet and delivery_status = 1 and payment_stauts in ('paid','settledSuccessfully') )";
                }
                else
                {
                    strSql = "SELECT cp.rowid,document_id, CONVERT(varchar,doc_date,112) podatesort, CONVERT(varchar,doc_date, 101) po_date, CONVERT(varchar,doc_date,112) poduedatesort,payer_id,payer_name,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol,net_amount,freight_charge,sales_tax,total_amount,cmir,tracking_number,cp.name,street,city,state,zipcode,destination_country,cr_dr_memo_text,wv.name vendorname"
                           + " , 'Review' as Applied from commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1";

                }
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(document_id,payer_id,CONVERT(varchar,doc_date, 101), payer_name, material_description, po_number,ref_doc,sales_doc,item,material_number,material_description,pint,po_number,bol, net_amount, total_amount, cp.name, wv.name) like '%" + searchid + "%')";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(cp.rowid)/" + pagesize.ToString() + ") TotalPage,Count(cp.rowid) TotalRecord FROM commerce_purchase_order_invoice_import cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1" + strWhr.ToString();

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
        public static int updateinvoice(string val)
        {
            try
            {
                string strsql = "erp_updateinvoice_invoicePOcsv";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@id", val)
                    
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "ImportOrderinvoiceRepository/updateinvoice/" + 0 + "", "Update invoice");
                throw Ex;
            }
        }

        public static DataTable GetBankcheckList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();

            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT cp.rowid,check_no, CONVERT(varchar,doc_date,112) chkdatesort, CONVERT(varchar,doc_date, 101) chkdate,check_amount"
                               + " from erp_import_bank_check_statement cp  WHERE 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(check_no,CONVERT(varchar,doc_date, 101), check_amount) like '%" + searchid + "%')";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(cp.rowid)/" + pagesize.ToString() + ") TotalPage,Count(cp.rowid) TotalRecord FROM erp_import_bank_check_statement cp WHERE 1=1" + strWhr.ToString();

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