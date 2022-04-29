using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using System.Data.SqlClient;
using LaylaERP.DAL;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public static class BankRepository
    {
        public static int AddBankAccount(BankModel model)
        {
            try
            {
                string strsql = "INSERT into erp_bank_account(date_created, date_modified, label, account_type, working_status, country_iban, state, " +
                    "comment, initial_balance, min_allowed, min_desired, bank, code_bank, account_number, iban_prefix, bic, bank_address, owner_name, " +
                    "accounting_number, fk_accountancy_journal, url, currency_code, owner_address)" +
                    " values(@date_created, @date_modified, @label, @account_type, @working_status, @country_iban, @state," +
                    " @comment, @initial_balance, @min_allowed, @min_desired, @bank, @code_bank, @account_number, @iban_prefix," +
                    " @bic, @bank_address, @owner_name, @accounting_number, @fk_accountancy_journal, @url, @currency_code, @owner_address); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@date_created", model.date_created),
                    new SqlParameter("@date_modified",DateTime.UtcNow),
                    new SqlParameter("@label", model.label ?? (object)DBNull.Value),
                    new SqlParameter("@account_type", model.account_type ?? (object)DBNull.Value),
                    new SqlParameter("@working_status", model.working_status),
                    new SqlParameter("@country_iban", model.country_iban ?? (object)DBNull.Value),
                    new SqlParameter("@state", model.state ?? (object)DBNull.Value),
                    new SqlParameter("@comment", model.comment ?? (object)DBNull.Value),
                    new SqlParameter("@initial_balance", model.initial_balance),
                    new SqlParameter("@min_allowed", model.min_allowed),
                    new SqlParameter("@min_desired", model.min_desired),
                    new SqlParameter("@bank", model.bank ?? (object)DBNull.Value),
                    new SqlParameter("@code_bank", model.code_bank ?? (object)DBNull.Value),
                    new SqlParameter("@account_number", model.account_number ?? (object)DBNull.Value),
                    new SqlParameter("@iban_prefix",model.iban_prefix ?? (object)DBNull.Value),
                    new SqlParameter("@bic",model.bic ?? (object)DBNull.Value),
                    new SqlParameter("@bank_address",model.bank_address ?? (object)DBNull.Value),
                    new SqlParameter("@owner_name", model.owner_name ?? (object)DBNull.Value),
                    new SqlParameter("@accounting_number",model.accounting_number ?? (object)DBNull.Value),
                    new SqlParameter("@fk_accountancy_journal",model.fk_accountancy_journal),
                    new SqlParameter("@url",model.url ?? (object)DBNull.Value),
                    new SqlParameter("@currency_code",model.currency_code ?? (object)DBNull.Value),
                    new SqlParameter("@owner_address",model.owner_address ?? (object)DBNull.Value),

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Bank/newfinaccount/" + model.rowid + "", "Insert bank details");
                throw Ex;
            }
        }

        public static DataSet GetAccountingAccount()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select account_number ID, concat(account_number,' - ',label) label from erp_accounting_account order by rowid;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet Getjournal()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select rowid ID, concat(code,' - ',label) label from erp_accounting_journal order by rowid;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable GetBankAccountList()
        {
            DataTable dtr = new DataTable();
            try
            {
                SqlParameter[] parm = {new SqlParameter("@flag", "BANKLIST") };
                string strquery = "erp_bank";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery,parm);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        //public static DataTable GetAccountByID(long id)
        //{
        //    DataTable dt = new DataTable();

        //    try
        //    {
        //        string strSql = "SELECT eba.rowid as ID,eba.account_number,eba.label, (case WHEN eba.account_type=1 then 'Saving Account' when eba.account_type=2 then 'Current or Credit Card Account' when eba.account_type=3 then 'Cash Account' end) as type," +
        //            "eaa.label as accounting,concat(code,'-',eaj.label) journal,if(working_status=1,'Open','Close') as status, " +
        //            "eba.min_allowed,eba.min_desired,eba.bank,eba.code_bank,eba.iban_prefix,eba.bic,eba.bank_address,eba.owner_name,eba.owner_address "+
        //            "from erp_bank_account eba left join erp_accounting_account eaa on eaa.account_number= eba.accounting_number left join erp_accounting_journal eaj on eaj.rowid=eba.fk_accountancy_journal where eba.rowid='" + id+"'";
        //        DataSet ds = SQLHelper.ExecuteDataSet(strSql);
        //        dt = ds.Tables[0];


        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return dt;
        //}

        public static DataTable GetAccountByID(long id)
        {
            DataTable dt = new DataTable();

            try
            {
                SqlParameter[] pram = { new SqlParameter("@flag","ABYID"), new SqlParameter("@id", id) };
                /*string strSql = "SELECT rowid, convert(varchar(12),date_created, 110) date_created, date_modified, label, account_type, working_status, country_iban, state, " +
                    "comment, initial_balance, min_allowed, min_desired, bank, code_bank, account_number, iban_prefix, bic, bank_address, owner_name, " +
                    "accounting_number, fk_accountancy_journal, url, currency_code, owner_address from erp_bank_account where rowid='" + id + "'";*/
                string strSql = "erp_bank";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, pram);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateBankAccount(BankModel model)
        {
            try
            {
                string strsql = "";
                strsql = "UPDATE erp_bank_account set date_created=@date_created, label=@label, account_type=@account_type, working_status=@working_status," +
                            "country_iban=@country_iban, state=@state, comment=comment," +
                            " initial_balance=@initial_balance, min_allowed=@min_allowed, min_desired=@min_desired, bank=@bank, code_bank=@code_bank, account_number=@account_number," +
                    " iban_prefix=@iban_prefix, bic=@bic, bank_address=@bank_address, owner_name=@owner_name, " +
                    "accounting_number=@accounting_number, fk_accountancy_journal=@fk_accountancy_journal, url=@url, currency_code=@currency_code, owner_address=@owner_address" +
                    "  where rowid='" + model.rowid + "'";

                SqlParameter[] para =
                {
                    new SqlParameter("@date_created", model.date_created),
                    new SqlParameter("@date_modified",DateTime.UtcNow),
                    new SqlParameter("@label", model.label ?? (object)DBNull.Value),
                    new SqlParameter("@account_type", model.account_type ?? (object)DBNull.Value),
                    new SqlParameter("@working_status", model.working_status),
                    new SqlParameter("@country_iban", model.country_iban ?? (object)DBNull.Value),
                    new SqlParameter("@state", model.state ?? (object)DBNull.Value),
                    new SqlParameter("@comment", model.comment ?? (object)DBNull.Value),
                    new SqlParameter("@initial_balance", model.initial_balance),
                    new SqlParameter("@min_allowed", model.min_allowed),
                    new SqlParameter("@min_desired", model.min_desired),
                    new SqlParameter("@bank", model.bank ?? (object)DBNull.Value),
                    new SqlParameter("@code_bank", model.code_bank ?? (object)DBNull.Value),
                    new SqlParameter("@account_number", model.account_number ?? (object)DBNull.Value),
                    new SqlParameter("@iban_prefix",model.iban_prefix ?? (object)DBNull.Value),
                    new SqlParameter("@bic",model.bic ?? (object)DBNull.Value),
                    new SqlParameter("@bank_address",model.bank_address ?? (object)DBNull.Value),
                    new SqlParameter("@owner_name", model.owner_name ?? (object)DBNull.Value),
                    new SqlParameter("@accounting_number",model.accounting_number ?? (object)DBNull.Value),
                    new SqlParameter("@fk_accountancy_journal",model.fk_accountancy_journal),
                    new SqlParameter("@url",model.url ?? (object)DBNull.Value),
                    new SqlParameter("@currency_code",model.currency_code ?? (object)DBNull.Value),
                    new SqlParameter("@owner_address",model.owner_address ?? (object)DBNull.Value),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Bank/EditBankAccount/" + model.rowid + "", "Update bank details");
                throw Ex;
            }
        }

        public static DataTable GetfileCountdata(int BankID, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "SELECT FileName from erp_BankLinkedFiles"
                                + " WHERE BankID in (" + BankID + ") and FileName = '" + FileName + "' ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int FileUpload(int BankID, string FileName, string FilePath, string FileType, string size)
        {
            try
            {
                string strsql = "";
                strsql = "insert into erp_BankLinkedFiles(BankID, FileName, FileSize, FileType, FilePath) values(@BankID, @FileName, @FileSize, @FileType, @FilePath); SELECT SCOPE_IDENTITY();";

                SqlParameter[] para =
               {
                    new SqlParameter("@BankID", BankID),
                    new SqlParameter("@FileName", FileName),
                    new SqlParameter("@FileSize", size),
                    new SqlParameter("@FileType", FileType),
                    new SqlParameter("@FilePath", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;


            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Bank/FileUpload/" + BankID + "", "Upload file for bank");
                throw Ex;
            }
        }


        public static DataTable GetBankLinkedFiles(long id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "select ID,BankID,FileName,concat(FileSize,' KB') FileSize,FileType,FilePath, convert(varchar(12),CreatedDate,101) Date from erp_BankLinkedFiles where BankID='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (FileName like '%" + searchid + "%' OR FileSize='%" + searchid + "%' OR CreatedDate='%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (FileName='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(ID)/" + pagesize.ToString() + ") TotalPage,Count(ID) TotalRecord from erp_BankLinkedFiles  WHERE BankID='" + id + "' and 1 = 1 " + strWhr.ToString();

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

        public static int DeleteBankLinkedFiles(BankModel model)
        {
            try
            {
                string strsql = "";
                strsql = "DELETE from erp_BankLinkedFiles where ID=@BankLinkedFilesID and BankID=@BankID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@BankID", model.rowid),
                    new SqlParameter("@BankLinkedFilesID", model.BankLinkedID),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Bank/FileUpload/" + model.rowid + "", "Delete file form bank");
                throw Ex;
            }
        }

        public static DataTable GetEntries(string id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT convert(varchar(12),ab.doc_date,101) due_date, ab.doc_ref as description, wv.name third_party, COALESCE(sum(case when ab.senstag = 'C' then ab.credit end), 0) credit, COALESCE(sum(case when ab.senstag = 'D' then ab.debit end), 0) debit, "
                                  + " (COALESCE(sum(CASE WHEN ab.senstag = 'C' then credit end), 0) + sum(invtotal)) - (sum(invtotal) - COALESCE(sum(CASE WHEN ab.senstag = 'D' then credit end), 0)) as balance from erp_accounting_bookkeeping ab"
                                  + " left join wp_vendor wv on wv.code_vendor = ab.thirdparty_code left join erp_bank_account eba on eba.rowid = ab.fk_bank WHERE eba.rowid='" + id + "'"
                                  + " group by ab.thirdparty_code, ab.doc_date, ab.doc_ref, wv.name";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }


        public static DataTable BankEntriesList(string id, string userstatus, string sMonths, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                /*string strSql = "SELECT ep.rowid as id, wpt.PaymentType as paymenttype,eba.account_number as bankaccount, iif(epi.type='PR',(epi.amount),'0.00')as credit, iif(epi.type='PD',(epi.amount),'0.00') as debit, convert(varchar(12),ep.datep,101) as datep, ep.num_payment as num_payment, wv.name as thirdparty from erp_bank_account eba"
                                + " INNER JOIN erp_payment ep on ep.fk_bank = eba.rowid"
                                + " INNER JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                                + " INNER JOIN erp_payment_invoice epi on epi.fk_payment=ep.rowid"
                                + " INNER JOIN wp_vendor wv on wv.code_vendor=ep.thirdparty_code"
                                + " where eba.rowid = '"+id+"'"; */
                string strSql = "SELECT epi.fk_invoceso, eba.rowid as bank, ep.rowid as id, wpt.PaymentType as paymenttype, eba.account_number as bankaccount, iif (epi.type = 'SO' ,epi.amount,'0')as debit, iif (epi.type = 'PO' or epi.type = 'FT' or epi.type='IP',epi.amount,'0') as credit,"
                               //+ "eba.initial_balance + sum(iif (epi.type = 'SO',epi.amount,'0') - iif (epi.type = 'PO',epi.amount,'0')) over (order by ep.datep rows between unbounded preceding and current row) as balance,"
                               + " (Select eba.initial_balance + sum(iif(epi1.type = 'PO' or epi1.type = 'FT' or epi1.type='IP', epi1.amount, '0') - iif(epi1.type = 'SO', epi1.amount, '0')) from erp_payment ep1 inner JOIN erp_payment_invoice epi1 on epi1.fk_payment = ep1.rowid where ep1.fk_bank = eba.rowid and ep1.datep <= ep.datep and ((ep1.fk_payment = 3 and ep1.status = 2) or (ep1.fk_payment in (1,2,4)))) as balance,"
                               + " convert(varchar(12),ep.datep,101) as operation_date, ep.num_payment as num_payment, wv.name as vendor, convert(varchar(12),ep.datec,101) as value_date from erp_payment ep"
                               + " left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                               + " inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code where eba.rowid = '" + id + "' and ((ep.fk_payment = 3 and ep.status = 2) or (ep.fk_payment in (1,2,4)))";

                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (epi.amount like '%" + searchid + "%' OR wpt.PaymentType like '%" + searchid + "%' OR eba.account_number like '%" + searchid + "%' OR wv.name like '%" + searchid + "%' OR ep.num_payment like '%" + searchid + "%' )";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(ep.datep as date) BETWEEN " + sMonths;
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(ep.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ep.rowid) TotalRecord " +
                    "from erp_payment ep " +
                    "left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code WHERE eba.rowid = '" + id + "' and ((ep.fk_payment = 3 and ep.status = 2) or (ep.fk_payment in (1,2,4)))" + strWhr.ToString();

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

        public static DataTable BankEntriesBalanceForSpecific(long id)
        {
            SqlParameter[] parm = { new SqlParameter("@flag", "GEBFS"), new SqlParameter("@id",id) };
            DataTable dtr = new DataTable();
            try
            {
                /*string strquery = "SELECT convert(numeric(18, 2), sum(CASE WHEN epi.type = 'SO' THEN epi.amount else '0' end)) AS debit, convert(numeric(18, 2), sum(CASE WHEN epi.type = 'PO' THEN epi.amount else '0' end)) AS credit"
                                 + " from erp_payment ep left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code where eba.rowid =" + id + "";*/
                string strquery = "erp_bank";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery,parm);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable AllBankEntriesList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                /*string strSql = "SELECT ep.rowid as id, wpt.PaymentType as paymenttype,eba.account_number as bankaccount, if(epi.type='PO',format(epi.amount,2),'0.00')as credit, if(epi.type='SO',format(epi.amount,2),'0.00') as debit,DATE_FORMAT(ep.datep,'%m-%d-%Y') as datep, ep.num_payment as num_payment, wv.name as vendor from erp_bank_account eba"
                                + " LEFT JOIN erp_payment ep on ep.fk_bank = eba.rowid"
                                + " LEFT JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                                + " LEFT JOIN erp_payment_invoice epi on epi.fk_payment=ep.rowid"
                                + " LEFT JOIN wp_vendor wv on wv.code_vendor=ep.thirdparty_code"
                                + " where 1=1";*/

                string strSql = "SELECT eba.rowid as bank, ep.rowid as id, wpt.PaymentType as paymenttype, eba.account_number as bankaccount, iif (epi.type = 'SO',epi.amount,'0')as debit, iif (epi.type = 'PO',epi.amount,'0') as credit,"
                                + " convert(varchar(12), ep.datep, 101) as operation_date, ep.num_payment as num_payment, wv.name as vendor, convert(varchar(12), ep.datec, 101) as value_date from erp_payment ep"
                                + " left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                                + " inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code where 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (epi.amount like '%" + searchid + "%' OR wpt.PaymentType like '%" + searchid + "%' OR eba.account_number like '%" + searchid + "%' OR wv.name like '%" + searchid + "%' OR ep.num_payment like '%" + searchid + "%' )";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(ep.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ep.rowid) TotalRecord from erp_payment ep left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code WHERE 1=1 " + strWhr.ToString();

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
        public static DataTable BankEntriesBalance()
        {
            DataTable dtr = new DataTable();
            try
            {
                /*string strquery = "SELECT if (epi.type = 'SO',replace(format(sum(epi.amount), 2),',',''),'0.00')as debit, if (epi.type = 'PO',replace(format(sum(epi.amount), 2),',',''),'0.00') as credit, (if (epi.type = 'PO', sum(epi.amount), '0') - if (epi.type = 'SO', sum(epi.amount),'0')) as balance from erp_payment ep"
                                  + " left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                                  + " inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code where 1 = 1"; */
                string strquery = "SELECT iif (epi.type = 'SO',sum(epi.amount),'0.00')as debit, iif(epi.type = 'PO', sum(epi.amount), '0.00') as credit, (iif(epi.type = 'PO', sum(epi.amount), '0') - iif(epi.type = 'SO', sum(epi.amount), '0')) as balance from erp_payment ep "
                                 +" left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                                 +" inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code where 1 = 1 group by epi.type";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable PendingBankEntriesList(string id, string userstatus, string sMonths, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "SELECT eba.rowid as bank, ep.rowid as id, wpt.PaymentType as paymenttype, eba.account_number as bankaccount, iif (epi.type = 'SO',epi.amount,'0')as debit, iif (epi.type = 'PO',epi.amount,'0') as credit,"
                               //+ "eba.initial_balance + sum(iif (epi.type = 'SO',epi.amount,'0') - iif (epi.type = 'PO',epi.amount,'0')) over (order by ep.datep rows between unbounded preceding and current row) as balance,"
                               + " (Select sum(iif(epi1.type = 'SO', epi1.amount, '0') - iif(epi1.type = 'PO', epi1.amount, '0')) from erp_payment ep1 inner JOIN erp_payment_invoice epi1 on epi1.fk_payment = ep1.rowid where ep1.fk_bank = eba.rowid and ep1.datep <= ep.datep and ((ep1.fk_payment = 3 and ep1.status in (0,7)))) as balance,"
                               + " convert(varchar(12),ep.datep,101) as operation_date, ep.num_payment as num_payment, wv.name as vendor, convert(varchar(12),ep.datec,101) as value_date from erp_payment ep"
                               + " left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                               + " inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code where eba.rowid = '" + id + "' and ((ep.fk_payment = 3 and ep.status in(0,7)))";

                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (epi.amount like '%" + searchid + "%' OR wpt.PaymentType like '%" + searchid + "%' OR eba.account_number like '%" + searchid + "%' OR wv.name like '%" + searchid + "%' OR ep.num_payment like '%" + searchid + "%' )";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                if (sMonths != null)
                {
                    strWhr += " and cast(ep.datep as date) BETWEEN " + sMonths;
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(ep.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ep.rowid) TotalRecord " +
                    "from erp_payment ep " +
                    "left JOIN erp_bank_account eba on eba.rowid = ep.fk_bank left JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment inner JOIN erp_payment_invoice epi on epi.fk_payment = ep.rowid left JOIN wp_vendor wv on wv.code_vendor = epi.thirdparty_code WHERE eba.rowid = '" + id + "' and ((ep.fk_payment = 3 and ep.status in (0,7)))" + strWhr.ToString();

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

        public static DataTable PendingBankEntriesBalance(long id)
        {
            SqlParameter[] parm = { new SqlParameter("@flag", "PENDING"), new SqlParameter("@id", id) };
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "erp_bank";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery, parm);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable Fundtransferlist(string accountno, string bank_id, string sMonth)
        {
            string strWhr = string.Empty;
            string sqlQuery = "select rowid,inv_num,sort_no,doc_date,CONVERT(varchar,doc_date,112) as datesort,CONVERT(varchar(12), doc_date, 101) as datecreation, inv_complete," +
                              "label_operation,debit,credit, doc_type from erp_accounting_bookkeeping where doc_type = 'FT' and inv_complete = '" + accountno + "' and inv_num not in (select subledger_account from erp_payment where fk_bank = " + bank_id + ")";
            if(!string.IsNullOrEmpty(sMonth))
            {
                strWhr = " and doc_date between " + sMonth + "";
            }
            sqlQuery += strWhr;
            DataTable ds = new DataTable();
            try
            {
                
                ds = SQLHelper.ExecuteDataTable(sqlQuery);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable FundTransfer(string accountno)
        {
            string sqlQuery = "select rowid,inv_num,sort_no,doc_date,CONVERT(varchar,doc_date,112) as datesort,CONVERT(varchar(12), doc_date, 101) as datecreation, inv_complete," +
                              "label_operation,debit,credit, doc_type from erp_accounting_bookkeeping where doc_type = 'FT' and inv_complete = '" + accountno + "'";
            DataTable ds = new DataTable();
            try
            {
                ds = SQLHelper.ExecuteDataTable(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static int BankFundTransfer(string bank, string inv_complete, string inv_num)
        {
            //var dt = new DataTable();
            string strQuery = "INSERT INTO erp_payment (ref, entity, datec, tms, datep, amount, fk_payment, num_payment, accountancy_code , subledger_account, fk_bank, status)"
                             + " SELECT '', 1 , GETDATE(), GETDATE(), GETDATE(), debit, '4', inv_num, inv_complete, inv_num, @bank , '0'"
                             + " from erp_accounting_bookkeeping where doc_type = 'FT' and inv_complete = @inv_complete and inv_num in ("+ inv_num + "); ";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@QFlag", "FT"),
                    new SqlParameter("@bank", bank),
                    new SqlParameter("@inv_complete", inv_complete),
                    //new SqlParameter("@inv_num", inv_num)
                };

                int dt = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strQuery, parameters));
                return dt;
            }
            catch (SqlException ex)
            { throw ex; }
            
        }
        public static DataTable SelectFundTransfer(string bank, string inv_num)
        {
            string sqlQuery = "select * from erp_payment where fk_bank= " + bank + " and subledger_account in(" + inv_num + ")";
            DataTable ds = new DataTable();
            try
            {
                ds = SQLHelper.ExecuteDataTable(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static int FundTransferInvoice(string bank, string inv_complete)
        {
            //var dt = new DataTable();
            string strQuery = "INSERT into erp_payment_invoice (fk_payment, fk_invoice, amount, type, thirdparty_code)"
                             + " SELECT rowid, subledger_account, amount, 'FT' type, '' thirdparty from erp_payment where fk_bank = @bank and accountancy_code = @inv_complete and rowid not in (select fk_payment from erp_payment_invoice)";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@bank", bank),
                    new SqlParameter("@inv_complete", inv_complete),
                };

                int dt = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strQuery, parameters));
                return dt;
            }
            catch (SqlException ex)
            { throw ex; }

        }
    }
}