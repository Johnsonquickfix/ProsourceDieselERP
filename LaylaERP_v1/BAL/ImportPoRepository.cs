using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.BAL
{
    public class ImportPoRepository
    {
        public static DataTable GetImportPoList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();

            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT cp.rowid, CONVERT(varchar,po_date,112) podatesort, CONVERT(varchar,po_date, 101)po_date, po_invoice_number, customer_requisition, CONVERT(varchar,po_date,112) poduedatesort, CONVERT(varchar,po_due_date,101) po_due_date, po_currency, original_invoice_amt, remain_invoice_amt, wv.name vendorname"
                               +" from commerce_purchase_order_invoice_balance cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (concat(po_date, customer_requisition, po_invoice_number, po_due_date, po_currency, original_invoice_amt, remain_invoice_amt, wv.name) like '%" + searchid + "%')";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(cp.rowid)/" + pagesize.ToString() + ") TotalPage,Count(cp.rowid) TotalRecord FROM commerce_purchase_order_invoice_balance cp left join wp_vendor wv on wv.rowid = cp.vendor_id WHERE 1=1" + strWhr.ToString();

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