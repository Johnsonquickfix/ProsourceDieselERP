using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
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
                MySqlParameter[] para =
                {
                    new MySqlParameter("@date_created", model.date_created),
                    new MySqlParameter("@date_modified",DateTime.UtcNow),

                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@account_type", model.account_type),
                    new MySqlParameter("@working_status", model.working_status),
                    new MySqlParameter("@country_iban", model.country_iban),
                    new MySqlParameter("@state", model.state),
                    new MySqlParameter("@comment", model.comment),
                    new MySqlParameter("@initial_balance", model.initial_balance),
                    new MySqlParameter("@min_allowed", model.min_allowed),
                    new MySqlParameter("@min_desired", model.min_desired),
                    new MySqlParameter("@bank", model.bank),
                    new MySqlParameter("@code_bank", model.code_bank),
                    new MySqlParameter("@account_number", model.account_number),
                    new MySqlParameter("@iban_prefix",model.iban_prefix),
                    new MySqlParameter("@bic",model.bic),
                    new MySqlParameter("@bank_address",model.bank_address),
                    new MySqlParameter("@owner_name", model.owner_name),
                    new MySqlParameter("@accounting_number",model.accounting_number),
                    new MySqlParameter("@fk_accountancy_journal",model.fk_accountancy_journal),
                    new MySqlParameter("@url",model.url),
                    new MySqlParameter("@currency_code",model.currency_code),
                    new MySqlParameter("@owner_address",model.owner_address),

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

                MySqlParameter[] para =
                {
                    new MySqlParameter("@date_created", model.date_created),
                    new MySqlParameter("@date_modified",DateTime.UtcNow),

                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@account_type", model.account_type),
                    new MySqlParameter("@working_status", model.working_status),
                    new MySqlParameter("@country_iban", model.country_iban),
                    new MySqlParameter("@state", model.state),
                    new MySqlParameter("@comment", model.comment),
                    new MySqlParameter("@initial_balance", model.initial_balance),
                    new MySqlParameter("@min_allowed", model.min_allowed),
                    new MySqlParameter("@min_desired", model.min_desired),
                    new MySqlParameter("@bank", model.bank),
                    new MySqlParameter("@code_bank", model.code_bank),
                    new MySqlParameter("@account_number", model.account_number),
                    new MySqlParameter("@iban_prefix",model.iban_prefix),
                    new MySqlParameter("@bic",model.bic),
                    new MySqlParameter("@bank_address",model.bank_address),
                    new MySqlParameter("@owner_name", model.owner_name),
                    new MySqlParameter("@accounting_number",model.accounting_number),
                    new MySqlParameter("@fk_accountancy_journal",model.fk_accountancy_journal),
                    new MySqlParameter("@url",model.url),
                    new MySqlParameter("@currency_code",model.currency_code),
                    new MySqlParameter("@owner_address",model.owner_address),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}