using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class AccountingRepository
    {
        public static List<Export_Details> exportorderlist = new List<Export_Details>();
        public static DataSet GetNatureofJournal()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select ID,Nature from erp_NatureofJournal";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public int AddJournal(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Insert into erp_accounting_journal(code,label,nature,active) values(@code,@label,@nature,@active); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@code", model.code),
                    new SqlParameter("@label", model.label),
                    new SqlParameter("@nature", model.nature),
                    new SqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int EditJournal(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_journal set code=@code,label=@label,nature=@nature,active=@active where rowid=@ID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@code", model.code),
                    new SqlParameter("@label", model.label),
                    new SqlParameter("@nature", model.nature),
               new SqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int UpdateJournalStatus(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_journal set active=@active where rowid=@ID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetJournalData(string ID, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select J.rowid ID,J.entity,J.code,J.label,N.Nature,J.active from erp_accounting_journal J left join erp_NatureofJournal N on J.nature = N.ID where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (J.code like '%" + searchid + "%' OR N.Nature like '%" + searchid + "%' OR J.label like '%" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                //}
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(J.rowid)/" + pagesize.ToString() + ") TotalPage,Count(J.rowid) TotalRecord from erp_accounting_journal J left join erp_NatureofJournal N on J.nature = N.ID WHERE 1 = 1 " + strWhr.ToString();

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

        public static DataTable GetJournalByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select rowid,entity,code,label,nature,active from erp_accounting_journal where rowid = '" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int UpdateChartOfAccountStatus(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_account set active=@active where rowid=@ID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }



        public static DataTable GetChartOfAccounts(SearchModel model)
        {
            string strWhr = " where fk_pcg_version='" + model.strValue1 + "'";
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT rowid as ID, account_number, label, labelshort, account_parent, (case when extraparams='I' then 'Income' when extraparams='E' then 'Expense' else '' end ) extraparams, ac_type, pcg_type, active from erp_accounting_account ";
                if (!string.IsNullOrEmpty(model.strValue1))
                {
                    strSql += strWhr;
                }

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetProductStock(string optType)
        {
            DataTable dt = new DataTable();
            try
            {

                string strSql = "select  p.id,eaa.label AccountingAccount,CAST(pa.fk_account_number AS INT) AccountingAccountNumber,p.post_type,p.post_title,max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku, " +
                    "max(case when p.id = s.post_id and s.meta_key = '_regular_price' then s.meta_value else '' end) regular_price, " +
                    "max(case when p.id = s.post_id and s.meta_key = '_price' then s.meta_value else '' end) sale_price, " +
                    "(select coalesce(sum(case when pwr.flag = 'R' then quantity else -quantity end),0) from product_stock_register pwr " +
                    "where pwr.product_id = p.id) stock, (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status " +
                    "FROM wp_posts as p left join wp_postmeta as s on p.id = s.post_id left join product_accounting as pa on p.id = pa.fk_product_id  and pa.option_mode = '" + optType + "'" +
                    "left join erp_accounting_account as eaa on pa.fk_account_number = eaa.account_number " +
                    "where p.post_type in ('product', 'product_variation') and p.post_status != 'draft'  group by p.id,eaa.label,pa.fk_account_number,p.post_type,p.post_title,p.post_parent,p.post_status order by p_id;";

                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet GetNewAccounttoAssign(string optType)
        {
            DataSet DS = new DataSet();
            try
            {
                string account = "";
                string pcg = "";
                if (optType == "sales")
                {
                    account = "4";
                    pcg = "INCOME";
                }
                else
                {
                    account = "5";
                    pcg = "COGS";
                }
                string strSQl = "Select account_number ID, concat(account_number,' - ',label) label from erp_accounting_account where  account_number like '" + account + "%' and pcg_type='" + pcg + "' order by account_number;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddAccount(AccountingModel model)
        {
            try
            {
                string strsql = "";
                strsql = "INSERT into erp_accounting_account(entity, date_modified, fk_pcg_version, pcg_type, account_number, account_parent, label, fk_accounting_category, active, reconcilable, labelshort, extraparams, ac_type) "
                    + " values(@entity, @date_modified, @fk_pcg_version, @pcg_type, @account_number, @account_parent, @label, @fk_accounting_category, @active, @reconcilable, @labelshort, @extraparams, @ac_type); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@entity", "1"),
                    new SqlParameter("@date_modified", DateTime.UtcNow.ToString()),
                    new SqlParameter("@fk_pcg_version", model.fk_pcg_version),
                    new SqlParameter("@pcg_type", model.pcg_type),
                    new SqlParameter("@account_number",model.account_number),
                    new SqlParameter("@account_parent",model.account_parent),
                    new SqlParameter("@label", model.label),
                    new SqlParameter("@fk_accounting_category","0"),
                    new SqlParameter("@active","1"),
                    new SqlParameter("@reconcilable","0"),
                    new SqlParameter("@labelshort",model.labelshort ?? (object)DBNull.Value),
                    new SqlParameter("@extraparams",model.extraparams ?? (object)DBNull.Value),
                    new SqlParameter("@ac_type",model.ac_type ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataSet GetPcgType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT * from erp_pcg_type");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable GetAccountByID(long id)
        {
            DataTable dt = new DataTable();

            try
            {

                string strSql = "SELECT rowid as rowid, account_number, fk_pcg_version, label, labelshort, account_parent, pcg_type, active, extraparams, ac_type from erp_accounting_account "
                + "where rowid=" + id + "";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int AddProductAccount(string ProductID, string option_mode, string ProductAccountNumberID)
        {
            try
            {
                int result = 0;
                string[] ID = ProductID.Split(',');
                string[] value = ProductAccountNumberID.Split(',');

                for (int i = 0; i <= value.Length - 1; i++)
                {
                    ProductID = ID[i].ToString();
                    ProductAccountNumberID = value[i].ToString();
                    if (ProductAccountNumberID != "0")
                    {
                        string strsql = "";
                        string Product = GetAccountNumber(ProductID, option_mode).ToString();
                        if (Product == ProductID)
                        {
                            UserActivityLog.WriteDbLog(LogType.Submit, "set account Product id (" + ProductID + ") and account number (" + ProductAccountNumberID + ") to  " + option_mode + " in Products Account.", "/Accounting/productsaccount" + ", " + Net.BrowserInfo);

                            strsql = "Update product_accounting set fk_product_id=@fk_product_id,option_mode=@option_mode,fk_account_number=@fk_account_number where fk_product_id=@fk_product_id and option_mode=@option_mode";
                        }
                        else
                        {
                            UserActivityLog.WriteDbLog(LogType.Submit, "New account Product id (" + ProductID + ") and account number (" + ProductAccountNumberID + ") to  " + option_mode + " in Products Account.", "/Accounting/productsaccount" + ", " + Net.BrowserInfo);

                            strsql = "insert into product_accounting(fk_product_id,option_mode,fk_account_number) values(@fk_product_id,@option_mode,@fk_account_number); SELECT SCOPE_IDENTITY();";
                        }
                        SqlParameter[] para =
                        {
                            new SqlParameter("@fk_product_id",ProductID),
                            new SqlParameter("@option_mode", option_mode),
                            new SqlParameter("@fk_account_number", ProductAccountNumberID),
                        };
                        result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                    }
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int UpdateAccount(AccountingModel model)
        {
            try
            {
                string strsql = "";
                strsql = "UPDATE erp_accounting_account set fk_pcg_version=@fk_pcg_version, pcg_type=@pcg_type, account_parent=@account_parent, label=@label, account_number=@account_number, labelshort= @labelshort, extraparams=@extraparams, ac_type=@ac_type where rowid='" + model.rowid + "'";

                SqlParameter[] para =
                {
                    new SqlParameter("@fk_pcg_version", model.fk_pcg_version),
                    new SqlParameter("@pcg_type", model.pcg_type),
                    new SqlParameter("@account_parent",model.account_parent),
                    new SqlParameter("@label", model.label),
                    new SqlParameter("@account_number",model.account_number),
                    new SqlParameter("@labelshort",model.labelshort ?? (object)DBNull.Value),
                    new SqlParameter("@extraparams",model.extraparams ?? (object)DBNull.Value),
                    new SqlParameter("@ac_type",model.ac_type ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int GetAccountNumber(string id, string option_mode)
        {
            try
            {
                string strSql = "Select fk_product_id from product_accounting where fk_product_id='" + id + "' and option_mode='" + option_mode + "'";
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strSql));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static int AddPcgTypeDetails(PcgtypeModel model)
        {
            try
            {
                string strsql = "";
                strsql = "INSERT into erp_pcg_type(pcg_type,account_parent) values(@pcg_type,@account_parent); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@pcg_type", model.pcg_type),
                    new SqlParameter("@account_parent", model.account_parent),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetPcgTypeList()
        {
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT id as ID, account_parent, pcg_type from erp_pcg_type ";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetPcgTypeById(string strValue1)
        {
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT id as ID, account_parent, pcg_type from erp_pcg_type where id='" + strValue1 + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdatePcgType(PcgtypeModel model)
        {
            try
            {
                string strsql = "";
                strsql = "UPDATE erp_pcg_type set account_parent=@account_parent, pcg_type=@pcg_type where id='" + model.rowid + "'";

                SqlParameter[] para =
                {
                    new SqlParameter("@account_parent", model.account_parent),
                    new SqlParameter("@pcg_type", model.pcg_type),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable AccountBalanceList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT inv_complete as id, concat(inv_complete,'-', label_complete) as account,(COALESCE(sum(case when senstag = 'C' then credit end), 0)) credit, (COALESCE(sum(case when senstag = 'D' then debit end), 0)) debit, ((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0))) as balance FROM erp_accounting_bookkeeping where 1=1 group by inv_complete, label_complete";
                dt = SQLHelper.ExecuteDataTable(strSql);

                /*string strSql = "SELECT inv_complete as id, concat(inv_complete,'-', label_complete) as account,(COALESCE(sum(case when senstag = 'C' then credit end), 0)) credit, (COALESCE(sum(case when senstag = 'D' then debit end), 0)) debit, ((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0))) as balance FROM erp_accounting_bookkeeping where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (inv_complete like '%" + searchid + "%' OR credit like '%" + searchid + "%' OR debit like '%" + searchid + "%') ";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" group by inv_complete, label_complete  order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(inv_complete)/" + pagesize.ToString() + ") TotalPage,Count(distinct concat(inv_complete,'-', label_complete)) TotalRecord FROM erp_accounting_bookkeeping where 1=1" + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString()); */

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable AccountBalanceGrandTotal()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strSql = "SELECT Format((COALESCE(sum(case when senstag = 'C' then credit end),0)),'#,##0.00') credit,"
                               + " Format(COALESCE(sum(case when senstag = 'D' then debit end), 0), '#,##0.00') debit,"
                               + " Format((COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)),'#,##0.00') as balance FROM erp_accounting_bookkeeping where 1 = 1";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        //Start journals
        public static DataTable AccountJournalList(string sMonths, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT eab.rowid as id, CONVERT(varchar,doc_date,112) as datesort, inv_num, PO_SO_ref, inv_complete, code_journal, CONVERT(varchar(12),doc_date,101) as datecreation, iif(debit=0,NULL,debit) as debit, iif(credit=0,NULL,credit) as credit, label_operation, v.name FROM erp_accounting_bookkeeping"
                                + " eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 ";
                if (userstatus != null)
                {
                    strWhr += " and (thirdparty_code ='" + userstatus + "') ";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                strSql += strWhr;
                dt = SQLHelper.ExecuteDataTable(strSql);

                /*if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (inv_num like '%" + searchid + "%' OR inv_complete like '%" + searchid + "%' OR code_journal like '%" + searchid + "%' OR credit like '%" + searchid + "%' OR debit like '%" + searchid + "%' OR v.name like '%" + searchid + "%') ";
                }
                if (userstatus != null)
                {
                    strWhr += " and (thirdparty_code ='" + userstatus + "') ";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(eab.rowid)/" + pagesize.ToString() + ") TotalPage,Count(eab.rowid) TotalRecord FROM erp_accounting_bookkeeping eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString()); */

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        //End Journals

        public static DataTable AccountLedgerList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT eab.rowid as id, inv_complete, code_journal, CONVERT(VARCHAR(12), date_creation, 107) as datecreation, debit, credit, label_operation, v.name FROM erp_accounting_bookkeeping"
                                + " eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (inv_complete like '%" + searchid + "%' OR code_journal like '%" + searchid + "%' OR credit like '%" + searchid + "%' OR debit like '%" + searchid + "%' OR v.name like '%" + searchid + "%') ";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" group by inv_complete, eab.rowid order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(eab.rowid)/" + pagesize.ToString() + ") TotalPage,Count(eab.rowid) TotalRecord FROM erp_accounting_bookkeeping eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 " + strWhr.ToString();

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

        public static DataTable GrandTotal()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strSql = "SELECT replace(format(sum(debit),2),',','') as debit, replace(format(sum(credit),2),',','') as credit, replace(format(sum(credit)-sum(debit),2),',','') as balance from erp_accounting_bookkeeping";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable JournalDatewithVendoreTotal(string sMonths, string searchid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and thirdparty_code = '" + searchid + "'";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                string strSql = "SELECT format(isnull(sum(debit),0),'#,##0.00') as debit, format(isnull(sum(credit),0), '#,##0.00') as credit, format(isnull(sum(credit)-sum(debit),0),'#,##0.00') as balance from erp_accounting_bookkeeping where 1 = 1";
                strSql += strWhr;
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GetAccountLedgerDetailsList(string sMonths, string searchid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                //if (!string.IsNullOrEmpty(searchid))
                //{
                //    searchid = searchid.ToLower();
                //    strWhr += " and (lower(p.inv_complete) like '" + searchid + "%' OR lower(p.inv_complete) like '" + searchid + "%' OR lower(p.label_complete)='" + searchid + "%' OR lower(p.label_complete) like '" + searchid + "%')";
                //}
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and thirdparty_code = '" + searchid + "'";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(p.doc_date as date) BETWEEN " + sMonths;
                }
                string strSql = "select ROW_NUMBER() OVER ( ORDER BY inv_complete ) row_num, concat(max(inv_complete),' : ',max(label_complete)) Acctext,inv_complete rowid,Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar) debit ,Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) credit from erp_accounting_bookkeeping p "
                + " where 1 = 1 ";
                strSql += strWhr + string.Format(" group by inv_complete  order by inv_complete");
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetDetailsLedger(string searchid, string vid, string sMonths)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                //MySqlParameter[] parameters =
                // {
                //    new MySqlParameter("@inv_complete", searchid)
                //};
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and inv_complete = '" + searchid + "'";
                }
                if (!string.IsNullOrEmpty(vid))
                {
                    strWhr += " and thirdparty_code = '" + vid + "'";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                string strSql = "select inv_complete,inv_num,code_journal,PO_SO_ref,label_operation,case when max(debit) = '0.00000000' then '' else Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar) end debit,case when max(credit) = '0.00000000' then '' else Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) end credit,FORMAT(p.doc_date,'MM/dd/yyyy hh:mm tt') doc_date,convert(varchar,doc_date,101) datecrt,"
                                 + " (select Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar) from erp_accounting_bookkeeping where 1=1 " + strWhr + ") totalDebit, "
                                 + " (select Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) from erp_accounting_bookkeeping where 1=1 " + strWhr + ") totalcredit,(select Cast(CONVERT(DECIMAL(10,2),sum(debit) -  sum(credit)) as nvarchar)  from erp_accounting_bookkeeping where 1=1 " + strWhr + ") totalbal"
                                 + " from erp_accounting_bookkeeping p"
                                      //   + " where inv_complete = @inv_complete ";
                                      + " where 1=1 ";
                strSql += strWhr + string.Format("group by  inv_complete , inv_num, code_journal, PO_SO_ref, label_operation,doc_date order by doc_date desc");
                //dt = SQLHelper.ExecuteDataTable(strSql, parameters);
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataSet GetVendor()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select code_vendor as ID, concat(name,' (',code_vendor,')') as Name from wp_vendor where VendorStatus=1 order by code_vendor desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable DatewithVendoreTotal(string sMonths, string searchid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and thirdparty_code = '" + searchid + "'";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                string strSql = "SELECT Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar)  as debit, Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) as credit, Cast(CONVERT(DECIMAL(10,2),sum(credit) -  sum(debit)) as nvarchar) as balance from erp_accounting_bookkeeping"
                                + " where 1 = 1 ";
                strSql += strWhr;
                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataSet GetName()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT label, account_number from erp_accounting_account");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetDetailType(string id)
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT labelshort, rowid from erp_accounting_account Where account_number ='" + id + "'");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddChartOfAccountEntry(ChartAccountEntryModel model)
        {
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@name", model.name),
                    new SqlParameter("@type", model.type),
                    new SqlParameter("@detail_type", model.detail_type),
                    new SqlParameter("@balance", model.balance),
                    new SqlParameter("@bank_balance",model.bank_balance),
                    new SqlParameter("@entry_date",model.entry_date),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_chartaccount_entry1", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetChartAccountEntryListNotUsed(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ece.rowid id, eaa.label name, ept.pcg_type type, eaafordetail.labelshort detailtype, convert(numeric(18,2),balance) balance, bank_balance, CONVERT(varchar, entry_date, 101) entrydate, CONVERT(varchar,entry_date,112) as datesort"
                               + " FROM erp_chartaccount_entry ece LEFT JOIN erp_pcg_type ept on ept.account_parent = ece.type LEFT JOIN erp_accounting_account eaa on eaa.account_number = ece.name LEFT JOIN erp_accounting_account eaafordetail on eaafordetail.rowid = ece.detail_type WHERE 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (eaa.label like '%" + searchid + "%' OR ept.pcg_type like '%" + searchid + "%' OR eaafordetail.labelshort like '%" + searchid + "%' OR balance like '%" + searchid + "%' OR bank_balance like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ee.status='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT (Count(ece.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ece.rowid) TotalRecord FROM erp_chartaccount_entry ece LEFT JOIN erp_pcg_type ept on ept.account_parent = ece.type LEFT JOIN erp_accounting_account eaa on eaa.rowid = ece.name LEFT JOIN erp_accounting_account eaafordetail on eaafordetail.rowid = ece.detail_type where 1 = 1 " + strWhr.ToString();

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

        public static DataTable GetChartAccountEntryById(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] pram = { new SqlParameter("@id", id) };
                string strSql = "SELECT rowid, name, type, detail_type, balance, bank_balance, convert(varchar(12), entry_date, 110 ) entry_date FROM erp_chartaccount_entry WHERE rowid = @id ";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, pram);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int UpdateChartOfAccountEntry(ChartAccountEntryModel model)
        {
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@rowid", model.rowid),
                    new SqlParameter("@name", model.name),
                    new SqlParameter("@type", model.type),
                    new SqlParameter("@detail_type", model.detail_type),
                    new SqlParameter("@balance", model.balance),
                    new SqlParameter("@bank_balance",model.bank_balance),
                    new SqlParameter("@entry_date",model.entry_date),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery("erp_chartaccount_entry1", para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataSet GetType(string id)
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT pcg_type, account_parent from erp_accounting_account Where account_number ='" + id + "'");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable GetCharofaccountentrygrandtotal()
        {
            DataTable DT = new DataTable();
            try
            {
                string strQry = "select format(sum(balance),'#,##0.00') balance, format(sum(bank_balance),'#,##0.00') bank_balance from erp_chartaccount_entry";

                DT = SQLHelper.ExecuteDataTable(strQry);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetChartAccountEntryList()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ece.name account_number, ece.rowid id, eaa.label name, ept.pcg_type type, eaafordetail.labelshort detailtype, convert(numeric(18,2),balance) balance, bank_balance, CONVERT(varchar, entry_date, 101) entrydate, CONVERT(varchar,entry_date,112) as datesort"
                               + " FROM erp_chartaccount_entry ece LEFT JOIN erp_pcg_type ept on ept.account_parent = ece.type LEFT JOIN erp_accounting_account eaa on eaa.account_number = ece.name LEFT JOIN erp_accounting_account eaafordetail on eaafordetail.rowid = ece.detail_type WHERE 1 = 1 order by account_number";
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable Checkaccountnumber(AccountingModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT account_number from erp_accounting_account where account_number ='" + model.account_number + "'";
                    dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static void AccountProfitLossList(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                decimal discount = 0;
                decimal total = 0;
                DataSet ds1 = new DataSet();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    SqlParameter[] param = {
                        new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date),
                         new SqlParameter("@flag", "sh")
                    };
                    ds1 = DAL.SQLHelper.ExecuteDataSet("erp_account_profit_loss_list", param);
                }
                else
                {
                    ssql = "";
                }
                //DataSet ds1 = new DataSet();
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();

                    //uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["account_number"].ToString());
                    uobj.UID = Convert.ToInt64(ds1.Tables[0].Rows[i]["account_number"].ToString());
                    uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["account_number"].ToString();
                    uobj.shipping_city = ds1.Tables[0].Rows[i]["label"].ToString();
                    uobj.shipping_state = ds1.Tables[0].Rows[i]["pcg_type"].ToString();
                    uobj.country = ds1.Tables[0].Rows[i]["account_number"].ToString();
                    discount = Convert.ToDecimal(ds1.Tables[0].Rows[i]["IncomVal"].ToString());
                    total = Convert.ToDecimal(ds1.Tables[0].Rows[i]["ExpenseVal"].ToString());
                    if (total != (decimal)0.000000)
                        uobj.total = total.ToString();
                    else
                        uobj.total = "";
                    if (discount != (decimal)0.000000)
                        uobj.Discount = discount.ToString();
                    else
                        uobj.Discount = "";

                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }
        public static DataTable AccountProfitLossTotal(string from_date, string to_date)
        {
            DataTable dt = new DataTable();
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                fromdate = DateTime.Parse(from_date);
                todate = DateTime.Parse(to_date);
                SqlParameter[] param = {
                        new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date),
                         new SqlParameter("@flag", "tot")
                    };
                dt = DAL.SQLHelper.ExecuteDataTable("erp_account_profit_loss_list", param);
                //dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GetAccountbalancesheet(string from_date, string to_date)
        {
            DataTable dt = new DataTable();
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                fromdate = DateTime.Parse(from_date);
                todate = DateTime.Parse(to_date);
                SqlParameter[] param = {
                        new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date),
                        new SqlParameter("@pcg_type", "type"),
                         new SqlParameter("@flag", "sh")
                    };
                dt = DAL.SQLHelper.ExecuteDataTable("erp_account_balance sheet", param);
          
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetAccountbalancesheetDetails(string pcg_type, string from_date, string to_date)
        {
            DataTable dt = new DataTable();
            try
            {
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                fromdate = DateTime.Parse(from_date);
                todate = DateTime.Parse(to_date);
                SqlParameter[] param = {
                        new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date),
                        new SqlParameter("@pcg_type", pcg_type),
                         new SqlParameter("@flag", "type")
                    };
                dt = DAL.SQLHelper.ExecuteDataTable("erp_account_balance sheet", param);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet exportbalancesheet(string from_date, string to_date, string searchid)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                   {
                     new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date),
                        new SqlParameter("@pcg_type", "ex"),
                    new SqlParameter("@flag", "ex"),
                    new SqlParameter("@searchcriteria", searchid),

                };
                ds = SQLHelper.ExecuteDataSet("erp_account_balance sheet", parameters);
                ds.Tables[0].TableName = "item"; ds.Tables[1].TableName = "details";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataSet GetAccountBalance(string from_date, string to_date)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                    {
                     new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date),
                    new SqlParameter("@flag", "sh")
               

                };
                ds = SQLHelper.ExecuteDataSet("erp_account_balance_sheet_list", parameters);
                ds.Tables[0].TableName = "ass"; ds.Tables[1].TableName = "libb"; ds.Tables[2].TableName = "assnm"; ds.Tables[3].TableName = "libnm";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
    }
}