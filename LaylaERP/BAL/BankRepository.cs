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
                    new MySqlParameter("@fk_accountancy_journal",model.bic),
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
    }
}