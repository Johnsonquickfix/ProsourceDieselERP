using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.UTILITIES;
using System.Xml;
using System.Text;

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
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AccountingJournal/" + model.rowid + "", "Insert accounting journal");
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
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AccountingJournal/" + model.rowid + "", "Update accounting journal");
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

                string strSql = "SELECT eaa.rowid as ID, account_number, label, labelshort, account_parent, (case when extraparams='I' then 'Income' when extraparams='E' then 'Expense' else '' end ) extraparams, ac_type, pcg_type, bs_type, eac.account_category, active,(select label from erp_accounting_account where account_number = eaa.Sub_Account) Sub_Account,account_class transaction_class from erp_accounting_account eaa"
                                + " left join erp_accounting_category eac on eac.rowid = eaa.fk_accounting_category left join erp_accounting_class_transaction eact on eact.rowid = eaa.transaction_class where 1=1";
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
                    "where p.post_type in ('product', 'product_variation') and p.post_status != 'draft'  group by p.id,eaa.label,pa.fk_account_number,p.post_type,p.post_title,p.post_parent,p.post_status order by p_id, id;";

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
                else if (optType == "purchase")
                {
                    account = "5";
                    pcg = "COGS";
                }
                else
                {
                    account = "9";
                    pcg = "ASSETS";
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
                strsql = "INSERT into erp_accounting_account(entity, date_modified, fk_pcg_version, pcg_type, account_number, account_parent, label, fk_accounting_category, active, reconcilable, labelshort, extraparams, ac_type, bs_type,Sub_Account,transaction_class) "
                    + " values(@entity, @date_modified, @fk_pcg_version, @pcg_type, @account_number, @account_parent, @label, @fk_accounting_category, @active, @reconcilable, @labelshort, @extraparams, @ac_type, @bs_type,@Sub_Account,@transaction_class); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@entity", "1"),
                    new SqlParameter("@date_modified", DateTime.UtcNow.ToString()),
                    new SqlParameter("@fk_pcg_version", model.fk_pcg_version),
                    new SqlParameter("@pcg_type", model.pcg_type),
                    new SqlParameter("@account_number",model.account_number),
                    new SqlParameter("@account_parent",model.account_parent),
                    new SqlParameter("@label", model.label),
                    //new SqlParameter("@fk_accounting_category","0"),
                    new SqlParameter("@active","1"),
                    new SqlParameter("@reconcilable","0"),
                    new SqlParameter("@labelshort",model.labelshort ?? (object)DBNull.Value),
                    new SqlParameter("@extraparams",model.extraparams ?? (object)DBNull.Value),
                    new SqlParameter("@ac_type",model.ac_type ?? (object)DBNull.Value),
                    new SqlParameter("@bs_type",model.bs_type ?? (object)DBNull.Value),
                    new SqlParameter("@fk_accounting_category",model.fk_accounting_category),
                    new SqlParameter("@Sub_Account",model.Sub_Account),
                    new SqlParameter("@transaction_class",model.transaction_class),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AddAccount/" + model.rowid + "", "Insert charts of account");
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

                string strSql = "SELECT rowid as rowid, account_number, fk_pcg_version, label, labelshort, account_parent, pcg_type, active, extraparams, ac_type, bs_type, fk_accounting_category,Sub_Account,transaction_class from erp_accounting_account "
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
                strsql = "UPDATE erp_accounting_account set fk_pcg_version=@fk_pcg_version, pcg_type=@pcg_type, account_parent=@account_parent, label=@label, account_number=@account_number, labelshort= @labelshort, extraparams=@extraparams, ac_type=@ac_type, bs_type=@bs_type, fk_accounting_category=@fk_accounting_category,Sub_Account = @Sub_Account,transaction_class=@transaction_class where rowid='" + model.rowid + "'";

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
                    new SqlParameter("@bs_type",model.bs_type ?? (object)DBNull.Value),
                    new SqlParameter("@fk_accounting_category",model.fk_accounting_category),
                    new SqlParameter("@Sub_Account",model.Sub_Account),
                    new SqlParameter("@transaction_class",model.transaction_class),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/EditAccount/" + model.rowid + "", "Update charts of account");
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
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AddPcgType/" + model.rowid + "", "Insert general account.");
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
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AddPcgType/" + model.rowid + "", "Update general account");
                throw Ex;
            }
        }

        public static DataTable AccountBalanceList(string account_num, string sMonths, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            string condition = " group by inv_complete, label_complete, aa.label";
            string strSql = String.Empty;
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strSql = "SELECT inv_complete as id, concat(inv_complete,'-', aa.label) as account,(COALESCE(sum(case when senstag = 'C' then credit end), 0)) credit, (COALESCE(sum(case when senstag = 'D' then debit end), 0)) debit, ((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0))) as balance, '' docdate, '' label_operation, '' subledger_label FROM erp_accounting_bookkeeping ab inner join erp_accounting_account aa on aa.account_number = ab.inv_complete where 1=1";
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                if (userstatus != null)
                {
                    strWhr += " and (thirdparty_code ='" + userstatus + "') ";
                }
                if (!String.IsNullOrEmpty(account_num))
                {
                    strSql = "SELECT inv_complete as id, CONVERT(varchar,doc_date,112) as datesort, concat(inv_complete,'-', label_complete) as account,(COALESCE(sum(case when senstag = 'C' then credit end), 0)) credit, (COALESCE(sum(case when senstag = 'D' then debit end), 0)) debit, ((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0))) as balance, CONVERT(varchar,doc_date,101) docdate, label_operation, subledger_label FROM erp_accounting_bookkeeping where 1=1";
                    strWhr += " and (inv_complete ='" + account_num + "') ";
                    condition = " group by subledger_account, inv_complete, label_complete, rowid, doc_date, label_operation, subledger_label order by doc_date desc";
                }

                strSql += strWhr + condition;

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

        public static DataTable AccountBalanceGrandTotal(string sMonths, string account_num)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strSql = "SELECT Format((COALESCE(sum(case when senstag = 'C' then credit end),0)),'#,##0.00') credit,"
                               + " Format(COALESCE(sum(case when senstag = 'D' then debit end), 0), '#,##0.00') debit,"
                               + " Format((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0)),'#,##0.00') as balance FROM erp_accounting_bookkeeping where 1 = 1 and cast(doc_date as date) BETWEEN " + sMonths;
                if (!String.IsNullOrEmpty(account_num))
                {
                    strSql += " and(inv_complete='" + account_num + "')";
                }
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        //Start journals
        public static DataTable AccountJournalList(string account_num, string sMonths, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT eab.rowid as id, CONVERT(varchar,doc_date,112) as datesort, inv_num, PO_SO_ref, inv_complete, code_journal, CONVERT(varchar(12),doc_date,101) as datecreation, (case WHEN senstag='D' and credit='0.000000' and debit='0.000000' then '0.00' when debit='0.000000' then NULL else debit end) as debit, (case WHEN senstag='C' and credit='0.000000' and debit='0.000000' then '0.00' when credit='0.000000' then NULL else credit end) as credit, label_operation, v.name, subledger_label FROM erp_accounting_bookkeeping eab"
                                + " left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 ";
                if (userstatus != null)
                {
                    strWhr += " and (thirdparty_code ='" + userstatus + "') ";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                if (account_num != null)
                {
                    strWhr += " and (inv_complete ='" + account_num + "') ";
                }
                strSql += strWhr + " order by datesort desc, PO_SO_ref,code_journal desc";
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
        public static DataTable AccountJournalList(long account_num, long vendor_id, DateTime fromdate, DateTime todate)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    account_num > 0 ? new SqlParameter("@account_num", account_num) : new SqlParameter("@account_num", DBNull.Value),
                    new SqlParameter("@fromdate", fromdate),
                    new SqlParameter("@todate", todate),
                    new SqlParameter("@flag", "JOUREP"),
                };
                dt = SQLHelper.ExecuteDataTable("erp_account_Journal_report", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable JournalAccountList(string flag, DateTime? fromdate,  DateTime? todate, long account_num, string vendor_id, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    account_num > 0 ? new SqlParameter("@account_num", account_num) : new SqlParameter("@account_num", DBNull.Value),
                    new SqlParameter("@thirdparty_code", vendor_id),
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", flag)
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_Journal_account_report", parameters);
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

        public static DataTable JournalDatewithVendoreTotal(string sMonths, string searchid, string account_num)
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
                if (!string.IsNullOrEmpty(account_num))
                {
                    strWhr += " and inv_complete = '" + account_num + "'";
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
                //string strSql = "select ROW_NUMBER() OVER ( ORDER BY inv_complete ) row_num, concat(max(inv_complete),' : ',max(label_complete)) Acctext,inv_complete rowid,Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar) debit ,Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) credit from erp_accounting_bookkeeping p "
                //+ " where 1 = 1 ";
                string strSql = "select ROW_NUMBER() OVER ( ORDER BY inv_complete ) row_num, concat(max(inv_complete),' : ',max(label)) Acctext,inv_complete rowid,Cast(CONVERT(DECIMAL(10,2),sum(debit)) as nvarchar) debit ,Cast(CONVERT(DECIMAL(10,2),sum(credit)) as nvarchar) credit from erp_accounting_bookkeeping p "
                + " inner join erp_accounting_account eac on eac.account_number = p.inv_complete where 1 = 1 ";
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
                    new SqlParameter("@debit", model.debit),
                   new SqlParameter("@senstag", model.senstag),
                    new SqlParameter("@credit",model.credit),
                    new SqlParameter("@entry_date",model.entry_date),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_chartaccount_entry1", para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/ChartOfAccountEntry/" + model.rowid + "", "Insert chart of account entry.");
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

                string strSql = "SELECT ece.rowid id, eaa.label name, ept.pcg_type type, eaafordetail.labelshort detailtype, convert(numeric(18,2),debit) debit, credit, CONVERT(varchar, entry_date, 101) entrydate, CONVERT(varchar,entry_date,112) as datesort"
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
                string strSql = "SELECT rowid, name, type, detail_type, debit, credit, convert(varchar(12), entry_date, 110 ) entry_date,senstag FROM erp_chartaccount_entry WHERE rowid = @id ";
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
                     new SqlParameter("@senstag", model.senstag),
                     new SqlParameter("@debit", model.debit),
                    new SqlParameter("@credit",model.credit),
                    new SqlParameter("@entry_date",model.entry_date),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery("erp_chartaccount_entry1", para));
                return result;

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/EditChartAccountEntry/" + model.rowid + "", "Update chart of account entry.");
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
                string strQry = "select format(sum(debit),'#,##0.00') debit, format(sum(credit),'#,##0.00') credit from erp_chartaccount_entry";

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

                string strSql = "SELECT ece.name account_number, ece.rowid id, CONCAT(eaa.label,' (',ece.name,')') name, ept.pcg_type type, eaafordetail.labelshort detailtype, convert(numeric(18,2),debit) debit, credit, CONVERT(varchar, entry_date, 101) entrydate, CONVERT(varchar,entry_date,112) as datesort"
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
                    new SqlParameter("@rowid", from_date),
                    new SqlParameter("@flag", "sh")


                };
                ds = SQLHelper.ExecuteDataSet("erp_account_balance_sheet_list", parameters);
                ds.Tables[0].TableName = "ass"; ds.Tables[1].TableName = "libb"; ds.Tables[2].TableName = "assnm"; ds.Tables[3].TableName = "libnm"; ds.Tables[4].TableName = "fincyer";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet GetAccountCategory()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT rowid, account_category from erp_accounting_category");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetAccountCategoryList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT rowid as id, account_category from erp_accounting_category";
                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddAccountCategory(AccountCategoryModel model)
        {
            try
            {
                string strsql = "";
                strsql = "INSERT into erp_accounting_category(account_category) values(@account_category); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@account_category", model.account_category ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AccountCategoryList/" + model.rowid + "", "Insert account category.");
                throw Ex;
            }
        }
        public static DataTable GetAccountCategoryById(string strValue1)
        {
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT rowid, account_category from erp_accounting_category where rowid='" + strValue1 + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static int UpdateAccountCategory(AccountCategoryModel model)
        {
            try
            {
                string strsql = "";
                strsql = "UPDATE erp_accounting_category set account_category=@account_category where rowid='" + model.rowid + "'";
                SqlParameter[] para =
                {
                    new SqlParameter("@account_category", model.account_category),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AccountCategoryList/" + model.rowid + "", "Update account category.");
                throw Ex;
            }
        }
        public static DataSet GetAccountProfitLoss(string from_date, string to_date)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                    {
                     new SqlParameter("@from", to_date),
                       new SqlParameter("@rowid", from_date),
                        new SqlParameter("@to", to_date),
                    new SqlParameter("@flag", "sh")


                };
                ds = SQLHelper.ExecuteDataSet("erp_account_Profit_and_Loss_list", parameters);
                ds.Tables[0].TableName = "inc"; ds.Tables[1].TableName = "exp"; ds.Tables[2].TableName = "incnm"; ds.Tables[3].TableName = "expnm"; ds.Tables[4].TableName = "fincyer";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet Getfinancialyear()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select rowid as ID, label as Name , status from erp_accounting_fiscalyear order by date_start desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }


        public static DataTable GetAccountFiscalYearList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT rowid id,label, REPLACE(label,'-','') sortid, CONVERT(varchar,date_start,112) as datesort, CONVERT(varchar,date_start,101) date_start, CONVERT(varchar, date_end, 101) date_end, (case when status = '1' then 'Active' else 'Inactive' end) status, datec from erp_accounting_fiscalyear";
                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int AddAccountFiscalYear(FiscalYearModel model)
        {
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag","I"),
                    new SqlParameter("@label", model.label),
                    new SqlParameter("@date_start", model.date_start),
                    new SqlParameter("@date_end", model.date_end),
                    new SqlParameter("@status", model.status),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_accounting_fiscal", para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AccountFiscalYearList/" + model.rowid + "", "Insert fiscal year.");
                throw Ex;
            }
        }

        public static DataTable GetAccountFiscalYearById(string id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT rowid id,label, CONVERT(varchar,date_start,110) date_start, CONVERT(varchar, date_end, 110) date_end, status from erp_accounting_fiscalyear where rowid='" + id + "'";
                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateAccountFiscalYear(FiscalYearModel model)
        {
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag","U"),
                    new SqlParameter("@rowid", model.rowid),
                    new SqlParameter("@label", model.label),
                    new SqlParameter("@date_start", model.date_start),
                    new SqlParameter("@date_end", model.date_end),
                    new SqlParameter("@status", model.status),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery("erp_accounting_fiscal", para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/AccountFiscalYearList/" + model.rowid + "", "Update fiscal year.");
                throw Ex;
            }
        }
        public static DataSet ChartofAccountsdropdown()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT account_number as ID, concat(label,' (',account_number,')') as label from erp_accounting_account";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable ChartOfAccountBalanceList(string account_num, string sMonths, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            string condition = String.Empty;
            string strSql = String.Empty;
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (!String.IsNullOrEmpty(account_num))
                {
                    strSql = "SELECT code_journal, inv_num, PO_SO_ref, inv_complete as id, CONVERT(varchar,doc_date,112) as datesort, concat(inv_complete,'-', label_complete) as account,(COALESCE((case when senstag = 'C' then credit end), 0)) credit, (COALESCE((case when senstag = 'D' then debit end), 0)) debit, CONVERT(varchar,doc_date,101) docdate, label_operation FROM erp_accounting_bookkeeping where 1=1";
                    strWhr += " and (inv_complete ='" + account_num + "') ";
                    condition = "order by doc_date desc";
                    //condition = " group by inv_complete, label_complete, rowid, doc_date, label_operation, PO_SO_ref, code_journal, inv_num order by doc_date desc";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(doc_date as date) BETWEEN " + sMonths;
                }
                strSql += strWhr + condition;

                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetAccount()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT  account_number, label  from erp_accounting_account  where pcg_type =  'BANK' and account_number not in (1,1010,1210)";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetBankAccount()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT  account_number, label  from erp_accounting_account  where pcg_type =  'BANK' and account_number not in (1,1210)";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetTotalAmountByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "select convert(numeric(18,2), sum(debit)- sum(credit)) total from erp_accounting_bookkeeping"
                             + " WHERE inv_complete = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable NewBankEntry(string accno, string transaccno, string misleaccno, string total_ttc, string trans_ttc, string misle_ttc, string inv_numval, string flag, DateTime? fundtransferdate, string Description)
        {
            var dt = new DataTable();
            try
            {

                SqlParameter[] parameters =
                {
                    new SqlParameter("@accno", accno),
                    new SqlParameter("@transaccno", transaccno),
                    new SqlParameter("@misleaccno", misleaccno),
                    new SqlParameter("@total_ttc", total_ttc),
                    new SqlParameter("@trans_ttc", trans_ttc),
                    new SqlParameter("@misle_ttc", misle_ttc),
                    new SqlParameter("@inv_numval", inv_numval),
                   // new SqlParameter("@date_creation",fundtransferdate),
                    fundtransferdate.HasValue ? new SqlParameter("@date_creation", fundtransferdate.Value) : new SqlParameter("@date_creation", DBNull.Value),
                    new SqlParameter("@Remark", Description),
                    new SqlParameter("@flag", flag)
                };
                dt = SQLHelper.ExecuteDataTable("erp_banktransfer_iud", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable Banktransferlist(string rowid, string accountno)
        {
            DataTable ds = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                     new SqlParameter("@accountno", accountno),
                     new SqlParameter("@rowid", rowid),
                     new SqlParameter("@flag", "sh")
                };
                ds = SQLHelper.ExecuteDataTable("erp_Banktransfer_list", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetEditDataID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                SqlParameter[] parameters =
                   {

                     new SqlParameter("@inv_num", model.strVal),

                };
                dt = SQLHelper.ExecuteDataTable("erp_Banktransferdatabyid", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable Banktransfergrandtotal(string rowid, string accountno)
        {
            DataTable ds = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                     new SqlParameter("@accountno", accountno),
                     new SqlParameter("@rowid", rowid),
                     new SqlParameter("@flag", "gt")
                };
                ds = SQLHelper.ExecuteDataTable("erp_Banktransfer_list", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static int AddTranscationType(TranscationType model)
        {
            try
            {
                SqlParameter[] parm =
                {
                new SqlParameter("@qflag",'I'),
                new SqlParameter("@transaction_type", model.transaction_type),
                new SqlParameter("@account_type", model.account_type)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_transaction_type_sp", parm));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static DataTable GetTransactionTypeList(string ID, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "select ett.rowid id ,(CASE WHEN ett.transaction_type=1 THEN 'Bill' WHEN ett.transaction_type=2 THEN 'Expense' WHEN ett.transaction_type=3 THEN 'Check' WHEN ett.transaction_type=4 THEN 'Pay Down Credit Card' WHEN ett.transaction_type=5 THEN 'Vendor Credit' WHEN ett.transaction_type=6 THEN 'Bill Payment (check)' else '' end) transaction_type,"
                                + " eaa.label account_type from erp_transaction_type ett Left join erp_accounting_account eaa on eaa.account_number = ett.account_type where 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    //strWhr += " and (J.code like '%" + searchid + "%' OR N.Nature like '%" + searchid + "%' OR J.label like '%" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                //}
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(ett.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ett.rowid) TotalRecord from erp_transaction_type ett Left join erp_accounting_account eaa on eaa.account_number = ett.account_type where 1 = 1 " + strWhr.ToString();

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

        public static DataTable TranscationTypeById(string id)
        {
            DataTable dt = new DataTable();
            string strQuery = string.Empty;
            try
            {
                strQuery = "SELECT rowid, transaction_type, account_type  FROM erp_transaction_type where rowid ='" + id + "'";
                dt = SQLHelper.ExecuteDataTable(strQuery);
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateTranscationType(TranscationType model)
        {
            try
            {
                SqlParameter[] parm =
                {
                new SqlParameter("@qflag",'U'),
                new SqlParameter("@rowid", model.rowid),
                new SqlParameter("@transaction_type", model.transaction_type),
                new SqlParameter("@account_type", model.account_type)
                };
                int result = SQLHelper.ExecuteNonQuery("erp_transaction_type_sp", parm);
                return result;
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataSet GetAccountingAccount()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select account_number ID, concat(label,' - ',account_number) label from erp_accounting_account order by rowid;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable AccountBalanceTotal(string id)
        {
            DataTable DS = new DataTable();
            try
            {
                string strSQl = "SELECT max(label_complete) label, Format(COALESCE(sum(case when senstag = 'C' then credit end), 0), '#,##0.00') credit,  Format(COALESCE(sum(case when senstag = 'D' then debit end), 0), '#,##0.00') debit,"
                                + " Format((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0)), '#,##0.00') as balance"
                                + " FROM erp_accounting_bookkeeping WHERE  inv_complete = " + id + "";
                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable AccountName(string id)
        {
            DataTable DS = new DataTable();
            try
            {
                string strSQl = "SELECT account_number, label FROM erp_accounting_account WHERE account_number=" + id + "";
                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable AccountReport()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                };
                dt = SQLHelper.ExecuteDataTable("erp_account_report", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetDataByID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;
                SqlParameter[] para = { new SqlParameter("@strVal", model.strVal), };
                string strSql = "erp_getbankreconciliationbyid";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql, para);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet GetBankReconciliationprocess(DateTime? fromdate, DateTime? todate, string ids, string Acids)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@id", ids),new SqlParameter("@Acids", Acids),
                    new SqlParameter("@flag", "SERCH")
                };

                ds = SQLHelper.ExecuteDataSet("erp_bankreconciliationprocess_search", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable BankReconciliationUpdate(string flag,long id, string json_data)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@json_data", json_data),
                };
                dt = SQLHelper.ExecuteDataTable("erp_bankreconciliationprocess_search", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable Reconciliationprocess(long Pkey, string qFlag, XmlDocument orderXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                };
                dt = SQLHelper.ExecuteDataTable("erp_reconciliation_iud", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Accounting/Reconciliationprocess/" + Pkey + "", "Update Reconciliation process");
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataTable AccountBalanceTotalBydate(string id, string sMonths, string search)
        {
            DataTable DS = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (search != "")
                {
                    strWhr += " and PO_SO_ref like '%" + search + "%'";
                }

                string strSQl = "SELECT max(label_complete) label, Format(COALESCE(sum(case when senstag = 'C' then credit end), 0), '#,##0.00') credit,  Format(COALESCE(sum(case when senstag = 'D' then debit end), 0), '#,##0.00') debit,"
                                + " Format((COALESCE(sum(CASE WHEN senstag = 'D' then debit end), 0)) - (COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0)), '#,##0.00') as balance"
                                + " FROM erp_accounting_bookkeeping WHERE inv_complete = " + id + "and cast(doc_date as date) BETWEEN " + sMonths + strWhr;


                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        #region [Report : Trail Balance, Profit & Loss A/C, Profit & Loss A/C, Statement of Cash Flows, Business Snapshot Report, Expense Report]
        public static DataTable GetTrailBalance(DateTime? from_date, DateTime? to_date, int fiscalyear_id, string report_type)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] param = {
                        from_date.HasValue ? new SqlParameter("@from", from_date) :new SqlParameter("@from",DBNull.Value),
                        to_date.HasValue ? new SqlParameter("@to", to_date) :new SqlParameter("@to",DBNull.Value),
                        fiscalyear_id > 0 ? new SqlParameter("@fiscalyear_id", fiscalyear_id) :new SqlParameter("@fiscalyear_id",DBNull.Value),
                        new SqlParameter("@flag", report_type)
                    };

                dt = SQLHelper.ExecuteDataTable("erp_trial_balance_report", param);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetBusinessSnapshotReport(DateTime? from_date, DateTime? to_date, int fiscalyear_id, string report_type)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] param = {
                        from_date.HasValue ? new SqlParameter("@from", from_date) :new SqlParameter("@from",DBNull.Value),
                        to_date.HasValue ? new SqlParameter("@to", to_date) :new SqlParameter("@to",DBNull.Value),
                        fiscalyear_id > 0 ? new SqlParameter("@fiscalyear_id", fiscalyear_id) :new SqlParameter("@fiscalyear_id",DBNull.Value),
                        new SqlParameter("@flag", report_type)
                    };

                dt = SQLHelper.ExecuteDataTable("erp_business_snapshot_report", param);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable ExpenseVoucherList(DateTime? fromdate, DateTime? todate, string search, int pageno, int pagesize, out int totalrows, string SortCol = "doc_date", string SortDir = "ASC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@from", fromdate.Value) : new SqlParameter("@from", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@to", todate.Value) : new SqlParameter("@to", DBNull.Value),
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "EXPLIST")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_business_snapshot_report", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[0].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[0].Rows[0]["total_record"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        #endregion

        public static DataTable AccountjournalvoucherList(DateTime? fromdate, DateTime? todate, int statusid, string userstatus, string salestatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH"),
                  //  !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                    new SqlParameter("@isactive", userstatus),
                    new SqlParameter("@status", statusid),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                     new SqlParameter("@salestatus", salestatus)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_journalvoucher_search", parameters);
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

        public static DataTable Newvoucher(long Pkey, string qFlag, XmlDocument orderXML, XmlDocument orderdetailsXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                   !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                    new SqlParameter("@orderdetailsXML", orderdetailsXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("erp_voucher_iud", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "PaymentInvoiceRepository/NewMiscBill/" + Pkey + "", "New Purchase Order");
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataSet GetvoucherDetailByID(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@id", id), };
                ds = SQLHelper.ExecuteDataSet("erp_voucherdatabyid", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static int FileUploade(int fk_product, string FileName, string Length, string FileType, string FilePath)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("Insert into erp_commerce_journalvoucher_linkedfiles(fk_purchase,FileName,Length,FileType,FilePath) values(" + fk_product + ",'" + FileName + "','" + Length + "','" + FileType + "','" + FilePath + "');select SCOPE_IDENTITY();"));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Accounting/FileUploade/" + fk_product + "", "Add Misc Bills linkedfiles");
                throw Ex;
            }
        }

        public static int Deletefileuploade(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                StringBuilder strSql = new StringBuilder(string.Format("delete from erp_commerce_journalvoucher_linkedfiles where rowid = {0}; ", model.ID));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Accounting/Deletefileuploade/" + model.ID + "", "Delete Misc Bills linkedfiles");
                throw ex;
            }
            return result;
        }

        public static List<ProductModelservices> GetfileuploadData(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        strWhr += " fk_purchase = " + strValue1;
                    string strSQl = "SELECT pw.rowid as ID,fk_purchase,Length,FileType,CONVERT(VARCHAR(12), CreateDate, 107)  CreateDate,FileName"
                                + " from erp_commerce_journalvoucher_linkedfiles pw"
                                + " WHERE " + strWhr;

                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;
                        if (sdr["FileName"] != DBNull.Value)
                            productsModel.product_name = sdr["FileName"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        productsModel.product_label = sdr["Length"].ToString();
                        productsModel.sellingpric = sdr["CreateDate"].ToString();

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static DataTable GetfileCountdata(int fk_product, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select FileName from erp_commerce_journalvoucher_linkedfiles"
                                + " WHERE fk_purchase in (" + fk_product + ") and FileName = '" + FileName + "' "
                                + " ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet Getfillaccount()
        {
            DataSet DS = new DataSet();
            try
            {
   
                   string strSQl = "Select account_number id,label text from erp_accounting_account;"
                          + " Select rowid id, account_class text from erp_accounting_class_transaction;";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetjournalDetails(DateTime? from_date, DateTime? to_date, string vendorid, string report_type, int accountid)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] param = {
                        from_date.HasValue ? new SqlParameter("@from", from_date) :new SqlParameter("@from",DBNull.Value),
                        to_date.HasValue ? new SqlParameter("@to", to_date) :new SqlParameter("@to",DBNull.Value),
                        accountid > 0 ? new SqlParameter("@account_num", vendorid) :new SqlParameter("@account_num",DBNull.Value),
                        new SqlParameter("@flag", report_type),
                        new SqlParameter("@thirdparty_code", vendorid)
                    };

                dt = SQLHelper.ExecuteDataTable("erp_Journalexport_account_report", param);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}