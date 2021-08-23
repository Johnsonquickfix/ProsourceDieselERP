using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;

namespace LaylaERP.BAL
{
    public class SettingRepository
    {
        
        public static DataTable DisplaySettings()
        {
            DataTable DT = new DataTable();
            try
            {
                string strquery = "Select * from wp_system_settings";
                DT = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;

            
        }

        public static void Updatesetting(SettingModel model, long id,string SenderEmailID)
        {
            try
            {
                string strsql = "Update wp_system_settings set AuthorizeNet=@AuthorizeNet,Paypal=@Paypal,AmazonPay=@AmazonPay,CreditCustomer=@CreditCustomer,Podium=@Podium, SenderEmailID=@SenderEmailID, SenderEmailPwd=@SenderEmailPwd, SMTPServerName=@SMTPServerName," +
                    "SMTPServerPortNo=@SMTPServerPortNo, PaypalClientId=@PaypalClientId, PaypalSecret=@PaypalSecret, AuthorizeAPILogin=@AuthorizeAPILogin, " +
                    " AuthorizeTransKey=@AuthorizeTransKey,AmazonAPIId=@AmazonAPIId,AmazonUser=@AmazonUser,AmazonPwd=@AmazonPwd,TaxjarAPIId=@TaxjarAPIId, " +
                    "TaxjarAPIId=@TaxjarAPIId,TaxjarUser=@TaxjarUser,TaxjarPwd=@TaxjarPwd,podiumAPIKey=@podiumAPIKey,podiumSecretKey=@podiumSecretKey where ID=@user_id";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@AuthorizeNet",model.AuthorizeNet),
                    new MySqlParameter("@Paypal", model.Paypal),
                    new MySqlParameter("@AmazonPay",model.AmazonPay),
                    new MySqlParameter("@CreditCustomer",model.CreditCustomer),
                    new MySqlParameter("@Podium",model.Podium),
                    new MySqlParameter("@SenderEmailID", SenderEmailID),
                    new MySqlParameter("@SenderEmailPwd", model.SenderEmailPwd),
                    new MySqlParameter("@SMTPServerName", model.SMTPServerName),
                    new MySqlParameter("@SMTPServerPortNo",model.SMTPServerPortNo),
                    new MySqlParameter("@PaypalClientId",model.PaypalClientId),
                    new MySqlParameter("@PaypalSecret", model.PaypalSecret),
                    new MySqlParameter("@AuthorizeAPILogin",model.AuthorizeAPILogin),
                    new MySqlParameter("@AuthorizeTransKey", model.AuthorizeTransKey),
                    new MySqlParameter("@AmazonAPIId", model.AmazonAPIId),
                    new MySqlParameter("@AmazonUser", model.AmazonUser),
                    new MySqlParameter("@AmazonPwd", model.AmazonPwd),
                    new MySqlParameter("@TaxjarAPIId",model.TaxjarAPIId),
                    new MySqlParameter("@TaxjarUser", model.TaxjarUser),
                    new MySqlParameter("@TaxjarPwd", model.TaxjarPwd),
                    new MySqlParameter("@podiumAPIKey",model.podiumAPIKey),
                    new MySqlParameter("@podiumSecretKey",model.podiumSecretKey),
                    
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}