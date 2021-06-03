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
        //public static List<SettingModel> settingslist = new List<SettingModel>();
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

            //string strSql = "Select * from wp_system_settings";
            //DataSet ds1 = new DataSet();
            //ds1 = DAL.SQLHelper.ExecuteDataSet(strSql);
            //for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
            //{
            //    SettingModel uobj = new SettingModel();
            //    uobj.PaypalClientId=ds1.Tables[0].Rows[i]["order_id"].ToString();
            //    settingslist.Add(uobj);
            //}

        }

        public static void Updatesetting(SettingModel model, long id,string SenderEmailID)
        {
            try
            {

                //ViewBag.AuthorizeNet = DT.Rows[0]["AuthorizeNet"].ToString();
                //ViewBag.id = DT.Rows[0]["ID"].ToString();
                //ViewBag.Paypal = DT.Rows[0]["Paypal"].ToString();
                //ViewBag.AmazonPay = DT.Rows[0]["AmazonPay"].ToString();
                //ViewBag.CreditCustomer = DT.Rows[0]["AmazonPay"].ToString();
                //ViewBag.SenderEmailID = DT.Rows[0]["SenderEmailID"].ToString();
                //ViewBag.SenderEmailPwd = DT.Rows[0]["SenderEmailPwd"].ToString();
                //ViewBag.SMTPServerName = DT.Rows[0]["SMTPServerName"].ToString();
                //ViewBag.SMTPServerPortNo = DT.Rows[0]["SMTPServerPortNo"].ToString();
                //ViewBag.PaypalClientId = DT.Rows[0]["PaypalClientId"].ToString();
                //ViewBag.PaypalSecret = DT.Rows[0]["PaypalSecret"].ToString();
                //ViewBag.AuthorizeAPILogin = DT.Rows[0]["AuthorizeAPILogin"].ToString();
                //ViewBag.AuthorizeTransKey = DT.Rows[0]["AuthorizeTransKey"].ToString();
                //ViewBag.AuthorizeKey = DT.Rows[0]["AuthorizeKey"].ToString();
                //ViewBag.AmazonAPIId = DT.Rows[0]["AmazonAPIId"].ToString();
                //ViewBag.AmazonUser = DT.Rows[0]["AmazonUser"].ToString();
                //ViewBag.AmazonPwd = DT.Rows[0]["AmazonPwd"].ToString();
                //ViewBag.TaxjarAPIId = DT.Rows[0]["TaxjarAPIId"].ToString();
                //ViewBag.TaxjarUser = DT.Rows[0]["TaxjarUser"].ToString();
                //ViewBag.TaxjarPwd = DT.Rows[0]["TaxjarPwd"].ToString();

                string strsql = "Update wp_system_settings set SenderEmailID=@SenderEmailID, SenderEmailPwd=@SenderEmailPwd, SMTPServerName=@SMTPServerName," +
                    "" +
                    "SMTPServerPortNo=@SMTPServerPortNo, PaypalClientId=@PaypalClientId, PaypalSecret=@PaypalSecret, AuthorizeAPILogin=@AuthorizeAPILogin, " +
                    " AuthorizeTransKey=@AuthorizeTransKey,AmazonAPIId=@AmazonAPIId,AmazonUser=@AmazonUser,AmazonPwd=@AmazonPwd,TaxjarAPIId=@TaxjarAPIId, " +
                    "TaxjarAPIId=@TaxjarAPIId,TaxjarUser=@TaxjarUser,TaxjarPwd=@TaxjarPwd where ID=@user_id";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
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