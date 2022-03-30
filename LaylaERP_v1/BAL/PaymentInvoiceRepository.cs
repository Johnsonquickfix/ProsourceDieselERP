﻿using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Xml;

namespace LaylaERP.BAL
{
    public class PaymentInvoiceRepository
    {
        public static DataTable GetPurchaseOrder(string flag, DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", flag)
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_payment_search", parameters);
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
        public static DataTable GetPurchaseOrderListSO(string flag, DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", flag)
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_noninvoicedsalespayment_search", parameters);
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
        public static DataTable GetPOOrderDataList(long po_id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@poid", po_id),
                    new SqlParameter("@flag", "POPYD")
                };

                dt = SQLHelper.ExecuteDataTable("erp_payment_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetPOOrderDataListSO(long po_id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@poid", po_id),
                    new SqlParameter("@flag", "POPYD")
                };

                dt = SQLHelper.ExecuteDataTable("erp_noninvoicedsalespayment_search", parameters);
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
                SqlParameter[] para = { new SqlParameter("@po_id", id), };
                //string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref ref_ext,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc, ifnull(epi.amount,0) recieved,ifnull(total_ttc-ifnull(epi.amount,0),0) remaining from commerce_purchase_receive_order cpo"
                //                + "   left outer join erp_payment_invoice epi on epi.fk_invoice = cpo.rowid and type = 'PR'"
                //                + "  where cpo.rowid in (" + id + ");";

                string strSql = "select rowid,ref,ref_ext,ref_supplier,fk_supplier, fk_warehouse from commerce_purchase_order where rowid in (" + id + "); select cpo.rowid,ref ref_ext,DATE_FORMAT(date_creation,'%m/%d/%Y') date_creation,DATE_FORMAT(date_livraison,'%m/%d/%Y') date_livraison,total_ttc,(select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=cpo.rowid and  type = 'PR') recieved,ifnull(total_ttc-(select ifnull(sum(amount),0) from erp_payment_invoice where fk_invoice=cpo.rowid and  type = 'PR'),0) remaining "
                            + "  from commerce_purchase_receive_order cpo"
                            + "  where cpo.rowid in ( select distinct fk_purchase_re from commerce_purchase_receive_order_detail where fk_purchase in (" + id + "));";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet GetPRPurchaseOrderByID(string po_ids)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@searchcriteria", po_ids),
                    new SqlParameter("@flag", "PRPIF")
                };

                ds = SQLHelper.ExecuteDataSet("erp_payment_search", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet GetPurchaseOrderSOByID(string po_ids)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@searchcriteria", po_ids),
                    new SqlParameter("@flag", "PRPIF")
                };

                ds = SQLHelper.ExecuteDataSet("erp_noninvoicedsalespayment_search", parameters);
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
        public static DataSet GetTypePayment()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select id,PaymentType text from wp_PaymentType order by id;"
                          + " SELECT account_number id, label + '-' + account_number text from erp_accounting_account eaa where pcg_type in ('EXPENSE','INCOME');";

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
                SqlParameter[] para = { };
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

        public static DataTable GetCheckDepositList(string bank, string status, DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                     new SqlParameter("@status", status),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@fk_bank", bank),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", "id"),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "CSL")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_checkdeposit_search", parameters);
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

        public static DataTable GetPaymentStatusList(string bank, string status, DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                     new SqlParameter("@status", bank),
                    new SqlParameter("@pageno", pageno),
                    //new SqlParameter("@statustype", status),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "SSPY")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_payment_status_search", parameters);
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

        public static DataTable GetCheckClearedDepositList(string bank, string status, DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                     new SqlParameter("@status", status),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@fk_bank", bank),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", "id"),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "CCL")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_checkdeposit_search", parameters);
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
        public static DataSet GetDataByID(string po_ids)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@searchcriteria", po_ids),
                    new SqlParameter("@flag", "CDBID")
                };

                ds = SQLHelper.ExecuteDataSet("erp_checkdeposit_search", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable Paymenttobank(long Pkey, string qFlag, long UserID, XmlDocument orderXML, XmlDocument orderdetailsXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                    new SqlParameter("@orderdetailsXML", orderdetailsXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("erp_payment_various_iud", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "CheckDeposit/Paymenttobank/" + Pkey + "", "Payment send to bank");
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable  AmountStatusChange(long Pkey, string qFlag)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                };
                dt = SQLHelper.ExecuteDataTable("erp_payment_various_iud", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "CheckDeposit/RejectorClearedAmount/" + Pkey + "", "Update payment bank status");
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable GetClearedDataList(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@searchcriteria", id),
                    new SqlParameter("@Flag", "CCLD")
                };

                dt = SQLHelper.ExecuteDataTable("erp_checkdeposit_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet GetCheckDepositPrint(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", "CDP"), new SqlParameter("@userid", id), };
                ds = SQLHelper.ExecuteDataSet("erp_checkdeposit_search", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";  
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataSet PurchaseSalesPrint(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", "CDP"), new SqlParameter("@userid", id), };
                ds = SQLHelper.ExecuteDataSet("erp_checkdeposit_search", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetGrandTotal(string searchid, DateTime? fromdate, DateTime? todate, string searchcriteria,string statustype)
        {
            DataTable dt = new DataTable();
            try
            {
                //string strWhr = string.Empty;
                //if (!string.IsNullOrEmpty(searchid))
                //{
                //    strWhr += " and thirdparty_code = '" + searchid + "'";
                //}
                //if (sMonths != null)
                //{
                //    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                //}
                //string strSql = "SELECT Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar)  as debit, Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) as credit, Cast(CONVERT(DECIMAL(10,2),sum(debit) -  sum(credit)) as nvarchar) as balance from erp_accounting_bookkeeping"
                //                + " where 1 = 1 ";
                //strSql += strWhr;
                //dt = SQLHelper.ExecuteDataTable(strSql);

                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchcriteria),
                     new SqlParameter("@status", searchid),
                    new SqlParameter("@pageno", "0"),
                    //new SqlParameter("@statustype", statustype),
                    new SqlParameter("@pagesize", "0"),
                    new SqlParameter("@sortcol", "0"),
                    new SqlParameter("@sortdir", "0"),
                    new SqlParameter("@flag", "GTol")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_payment_status_search", parameters);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable Newcheckdeposit(long Pkey, string qFlag, long UserID, XmlDocument orderXML, XmlDocument orderdetailsXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                    new SqlParameter("@orderdetailsXML", orderdetailsXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("erp_check_deposit_iud", parameters);
            }
            catch (Exception ex)
            {                
               UserActivityLog.ExpectionErrorLog(ex, "PaymentInvoice/Newcheckdeposit/" + Pkey + "", "Check Deposit Bank");                 
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataTable AddNewPurchase(long Pkey, string qFlag, long UserID, XmlDocument orderXML, XmlDocument orderdetailsXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                    new SqlParameter("@orderdetailsXML", orderdetailsXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("erp_salespurchase_order_iud", parameters);
            }
            catch (Exception ex)
            {                 
                UserActivityLog.ExpectionErrorLog(ex, "PaymentInvoice/TakePayment/" + Pkey + "", "Payment taken from invoice");                 
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataSet GetSupplierProposalsDetails(long id, string flag = "GETPNT")
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", flag), new SqlParameter("@id", id), };
                ds = SQLHelper.ExecuteDataSet("erp_Proposals_print_search", para);
                ds.Tables[0].TableName = "po";
                if (ds.Tables.Count > 1) ds.Tables[1].TableName = "pod";
                if (ds.Tables.Count > 2) ds.Tables[2].TableName = "sod";
                if (ds.Tables.Count > 3) ds.Tables[3].TableName = "com";
                if (ds.Tables.Count > 4) ds.Tables[4].TableName = "popd";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
    }
}