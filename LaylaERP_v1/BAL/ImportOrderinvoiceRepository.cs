﻿using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
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
    }
}