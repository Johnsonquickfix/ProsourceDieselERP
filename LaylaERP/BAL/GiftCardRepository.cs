using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class GiftCardRepository
    {
        public static int AddGiftCard(GiftCardModel model)
        {
            try
            {
                string strsql = "insert into wp_woocommerce_gc_cards(code,order_id,order_item_id,recipient,redeemed_by,sender,sender_email,message,balance,remaining,template_id,create_date " +
                    ", deliver_date, delivered, expire_date, redeem_date, is_virtual, is_active) values (@code, @order_id, @order_item_id, @recipient, @redeemed_by, @sender, @sender_email, @message, @balance, @remaining, @template_id, @create_date " +
                    ", @deliver_date, @delivered, @expire_date, @redeem_date, @is_virtual, @is_active)";

                MySqlParameter[] para =
                {

                     new MySqlParameter("@type", "issued"),
                     new MySqlParameter("@user_id", "0"),
                    new MySqlParameter("@amount", model.amount),
                    new MySqlParameter("@recipient", model.recipient),
                    new MySqlParameter("@sender_email", model.sender_email),
                    new MySqlParameter("@message", model.message),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddGiftCardActivity(GiftCardModel model)
        {
            try
            {
                string strsql = "insert into wp_woocommerce_gc_activity(type,user_id,user_email,object_id,gc_id,gc_code,amount,date,note) values(@type, @user_id, @user_email, @object_id, @gc_id, @gc_code, @amount, @date, @note); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                     new MySqlParameter("@type", "issued"),
                     new MySqlParameter("@user_id", "0"),
                    new MySqlParameter("@amount", model.amount),
                    new MySqlParameter("@recipient", model.recipient),
                    new MySqlParameter("@sender_email", model.sender_email),
                    new MySqlParameter("@message", model.message),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}