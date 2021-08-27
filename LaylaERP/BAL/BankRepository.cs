using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using MySql.Data.MySqlClient;

namespace LaylaERP.BAL
{
    public static class BankRepository
    {

        // rowid date_created    date_modified NickName    label entity  fk_user_loginID fk_user_modif   bank code_bank
        //account_number bic iban_prefix country_iban    domiciliation state   fk_pays proprio owner_address working_status
        //clos rappro  url accounting_number   account_type fk_accountancy_journal  currency_code min_allowed min_desired 
        //comment note_public model_pdf   import_key bank_address    ics ics_transfer    initial_balance

        public static int AddBankAccount(BankModel model)
        {
            try
            {
                string strsql = "INSERT into wp_warehouse(date_created, date_modified, label, account_type, working_status, country_iban, state, " +
                    "comment, initial_balance, min_allowed, min_desired, bank, code_bank, account_number, iban_prefix, bic, bank_address, owner_name, accounting_number, fk_accountancy_journal)" +
                    " values(@date_created, @date_modified, @label, @account_type, @working_status, @country_iban, @state," +
                    " @comment, @initial_balance, @min_allowed, @min_desired, @bank, @code_bank, @account_number, @iban_prefix, @bic, @bank_address, @owner_name, @accounting_number, @fk_accountancy_journal);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@date_created", DateTime.UtcNow),
                    new MySqlParameter("@date_modified",model.date_modified),
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


                    new MySqlParameter("@owner_name", model.account_number),
                    new MySqlParameter("@accounting_number",model.iban_prefix),
                    new MySqlParameter("@fk_accountancy_journal",model.bic),
                   

                };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

    }
}