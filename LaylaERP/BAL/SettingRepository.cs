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
        
        public static DataSet DisplaySettings()
        {
            DataSet DT = new DataSet();
            try
            {
                string strquery = "Select * from wp_system_settings;"
                               + " Select * from erp_entityinfo;";
                DT = SQLHelper.ExecuteDataSet(strquery);
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
                    "SMTPServerPortNo=@SMTPServerPortNo, PaypalClientId=@PaypalClientId, PaypalSecret=@PaypalSecret,PaypalSellerAccount=@PaypalSellerAccount,AuthorizeAPILogin=@AuthorizeAPILogin, " +
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
                    new MySqlParameter("@PaypalSellerAccount",model.PaypalSellerAccount),
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
        public static void Update_EntityInfo(SettingModel model, long id)
        {
            try
            {
                string strsql = "Update erp_entityinfo set CompanyName=@CompanyName,lastname=@lastname,firstname=@firstname,address=@address,address1=@address1, zip=@zip, town=@town, fk_state=@fk_state," +
                    "fk_country=@fk_country, country_code_phone=@country_code_phone, user_mobile=@user_mobile,email=@email,website=@website, " +
                    " logo_url=@logo_url,additional_notes=@additional_notes " +
                    " where entity=@id";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@id", id),
                    new MySqlParameter("@lastname",model.lastname),
                    new MySqlParameter("@CompanyName", model.CompanyName),
                    new MySqlParameter("@firstname",model.firstname),
                    new MySqlParameter("@address",model.address),
                    new MySqlParameter("@address1",model.address1),              
                    new MySqlParameter("@zip", model.postal_code),
                    new MySqlParameter("@town", model.City),
                    new MySqlParameter("@fk_state",model.State),
                    new MySqlParameter("@fk_country",model.Country),
                    new MySqlParameter("@country_code_phone", model.country_code_phone),
                    new MySqlParameter("@user_mobile",model.user_mobile),
                    new MySqlParameter("@email",model.email),
                    new MySqlParameter("@website", model.website),
                    new MySqlParameter("@logo_url", model.logo_url),
                    new MySqlParameter("@additional_notes", model.additional_notes)       

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