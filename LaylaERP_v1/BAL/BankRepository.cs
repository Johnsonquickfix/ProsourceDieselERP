using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using System.Data.SqlClient;
using LaylaERP.DAL;

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
                    " @bic, @bank_address, @owner_name, @accounting_number, @fk_accountancy_journal, @url, @currency_code, @owner_address);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@date_created", model.date_created),
                    new SqlParameter("@date_modified",DateTime.UtcNow),

                    new SqlParameter("@label", model.label),
                    new SqlParameter("@account_type", model.account_type),
                    new SqlParameter("@working_status", model.working_status),
                    new SqlParameter("@country_iban", model.country_iban),
                    new SqlParameter("@state", model.state),
                    new SqlParameter("@comment", model.comment),
                    new SqlParameter("@initial_balance", model.initial_balance),
                    new SqlParameter("@min_allowed", model.min_allowed),
                    new SqlParameter("@min_desired", model.min_desired),
                    new SqlParameter("@bank", model.bank),
                    new SqlParameter("@code_bank", model.code_bank),
                    new SqlParameter("@account_number", model.account_number),
                    new SqlParameter("@iban_prefix",model.iban_prefix),
                    new SqlParameter("@bic",model.bic),
                    new SqlParameter("@bank_address",model.bank_address),
                    new SqlParameter("@owner_name", model.owner_name),
                    new SqlParameter("@accounting_number",model.accounting_number),
                    new SqlParameter("@fk_accountancy_journal",model.fk_accountancy_journal),
                    new SqlParameter("@url",model.url),
                    new SqlParameter("@currency_code",model.currency_code),
                    new SqlParameter("@owner_address",model.owner_address),

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
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

        public static DataTable GetBankAccount()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT eba.rowid as ID,eba.account_number,eba.label, (case WHEN eba.account_type=1 then 'Saving Account' when eba.account_type=2 then 'Current or Credit Card Account' when eba.account_type=3 then 'Cash Account' end) as type,eaa.label as accounting,concat(code,'-',eaj.label) journal,if(working_status=1,'Open','Close') as status from erp_bank_account eba left join erp_accounting_account eaa on eaa.account_number= eba.accounting_number left join erp_accounting_journal eaj on eaj.rowid=eba.fk_accountancy_journal";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
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
                string strSql = "SELECT rowid, DATE_FORMAT(date_created,'%m-%d-%Y') date_created, date_modified, label, account_type, working_status, country_iban, state, " +
                    "comment, initial_balance, min_allowed, min_desired, bank, code_bank, account_number, iban_prefix, bic, bank_address, owner_name, " +
                    "accounting_number, fk_accountancy_journal, url, currency_code, owner_address from erp_bank_account where rowid='" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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
                    "accounting_number=@accounting_number, fk_accountancy_journal=@fk_accountancy_journal, url=@url, currency_code=@currency_code, owner_address=@owner_address"+
                    "  where rowid='" + model.rowid + "'";

                SqlParameter[] para =
                {
                    new SqlParameter("@date_created", model.date_created),
                    new SqlParameter("@date_modified",DateTime.UtcNow),

                    new SqlParameter("@label", model.label),
                    new SqlParameter("@account_type", model.account_type),
                    new SqlParameter("@working_status", model.working_status),
                    new SqlParameter("@country_iban", model.country_iban),
                    new SqlParameter("@state", model.state),
                    new SqlParameter("@comment", model.comment),
                    new SqlParameter("@initial_balance", model.initial_balance),
                    new SqlParameter("@min_allowed", model.min_allowed),
                    new SqlParameter("@min_desired", model.min_desired),
                    new SqlParameter("@bank", model.bank),
                    new SqlParameter("@code_bank", model.code_bank),
                    new SqlParameter("@account_number", model.account_number),
                    new SqlParameter("@iban_prefix",model.iban_prefix),
                    new SqlParameter("@bic",model.bic),
                    new SqlParameter("@bank_address",model.bank_address),
                    new SqlParameter("@owner_name", model.owner_name),
                    new SqlParameter("@accounting_number",model.accounting_number),
                    new SqlParameter("@fk_accountancy_journal",model.fk_accountancy_journal),
                    new SqlParameter("@url",model.url),
                    new SqlParameter("@currency_code",model.currency_code),
                    new SqlParameter("@owner_address",model.owner_address),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
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
                strsql = "insert into erp_BankLinkedFiles(BankID, FileName, FileSize, FileType, FilePath) values(@BankID, @FileName, @FileSize, @FileType, @FilePath); SELECT LAST_INSERT_ID();";
                
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

                string strSql = "select ID,BankID,FileName,concat(FileSize,' KB') FileSize,FileType,FilePath,DATE_FORMAT(CreatedDate, '%m-%d-%Y') Date from erp_BankLinkedFiles where BankID='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (FileName like '%" + searchid + "%' OR FileSize='%" + searchid + "%' OR CreatedDate='%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (FileName='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ID)/" + pagesize.ToString() + ") TotalPage,Count(ID) TotalRecord from erp_BankLinkedFiles  WHERE BankID='" + id + "' and 1 = 1 " + strWhr.ToString();

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
                throw Ex;
            }
        }

        public static DataTable GetEntries(string id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select Date_format(ab.doc_date, '%m-%d-%Y') due_date, ab.doc_ref as description, wv.name third_party, COALESCE(sum(case when ab.senstag = 'C' then ab.credit end), 0) credit, COALESCE(sum(case when ab.senstag = 'D' then ab.debit end), 0) debit, "
                                  + " (COALESCE(sum(CASE WHEN ab.senstag = 'C' then credit end), 0) + invtotal) - (invtotal - COALESCE(sum(CASE WHEN ab.senstag = 'D' then credit end), 0)) as balance from erp_accounting_bookkeeping ab"
                                  + " left join wp_vendor wv on wv.code_vendor = ab.thirdparty_code left join erp_bank_account eba on eba.rowid = ab.fk_bank WHERE eba.rowid='"+id+"'"
                                  + " group by ab.thirdparty_code";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }


        public static DataTable BankEntriesList(string id,string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ep.rowid as id, wpt.PaymentType as paymenttype,eba.account_number as bankaccount, if(epi.type='PR',format(epi.amount,2),'0.00')as credit, if(epi.type='PD',format(epi.amount,2),'0.00') as debit,DATE_FORMAT(ep.datep,'%m-%d-%Y') as datep, ep.num_payment as num_payment, wv.name as thirdparty from erp_bank_account eba"
                                + " INNER JOIN erp_payment ep on ep.fk_bank = eba.rowid"
                                + " INNER JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment"
                                + " INNER JOIN erp_payment_invoice epi on epi.fk_payment=ep.rowid"
                                + " INNER JOIN wp_vendor wv on wv.code_vendor=ep.thirdparty_code"
                                + " where eba.rowid = '"+id+"'";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (wpt.PaymentType like '%" + searchid + "%' OR eba.account_number like '%" + searchid + "%' OR wv.name like '%" + searchid + "%' OR ep.num_payment like '%" + searchid + "%' )";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ep.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ep.rowid) TotalRecord from erp_bank_account eba INNER JOIN erp_payment ep on ep.fk_bank = eba.rowid INNER JOIN wp_PaymentType wpt on wpt.ID = ep.fk_payment INNER JOIN erp_payment_invoice epi on epi.fk_payment=ep.rowid INNER JOIN wp_vendor wv on wv.code_vendor=ep.thirdparty_code WHERE eba.rowid = '" + id+"' " + strWhr.ToString();

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