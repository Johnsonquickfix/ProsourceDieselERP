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
        public static int AddGiftCard(GiftCardModel model, string code, string recipient)
        {
            try
            {

                string strsql = "insert into wp_woocommerce_gc_cards(code,order_id,order_item_id,recipient,redeemed_by,sender,sender_email,message,balance,remaining,template_id,create_date " +
                    ", deliver_date, delivered, expire_date, redeem_date, is_virtual, is_active) values (@code, @order_id, @order_item_id, @recipient, @redeemed_by, @sender, @sender_email, @message, @balance, @remaining, @template_id, UNIX_TIMESTAMP(STR_TO_DATE(@create_date, '%m/%d/%Y')) " +
                    ", @deliver_date, @delivered, @expire_date, @redeem_date, @is_virtual, @is_active); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {

                    new MySqlParameter("@code", code),
                    new MySqlParameter("@order_id", "0"),
                    new MySqlParameter("@order_item_id", "0"),
                    new MySqlParameter("@recipient", recipient),
                    new MySqlParameter("@redeemed_by", "0"),
                    new MySqlParameter("@sender", model.sender),
                    new MySqlParameter("@sender_email", model.sender_email),
                    new MySqlParameter("@message", model.message),
                    new MySqlParameter("@balance", model.amount),
                    new MySqlParameter("@remaining", model.amount),
                    new MySqlParameter("@template_id", "default"),
                    new MySqlParameter("@create_date", DateTime.Now.ToString("MM/dd/yyyy")),
                    new MySqlParameter("@deliver_date", "0"),
                    new MySqlParameter("@delivered", "0"),
                    new MySqlParameter("@expire_date", "0"),
                    new MySqlParameter("@redeem_date", "0"),
                    new MySqlParameter("@is_virtual", "on"),
                    new MySqlParameter("@is_active", "on"),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddGiftCardActivity(GiftCardModel model, int gcid, string code)
        {
            try
            {
                string strsql = "insert into wp_woocommerce_gc_activity(type,user_id,user_email,object_id,gc_id,gc_code,amount,date,note) values(@type, @user_id, @user_email, @object_id, @gc_id, @gc_code, @amount, @date, @note); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                     new MySqlParameter("@type", "issued"),
                     new MySqlParameter("@user_id", "0"),
                     new MySqlParameter("@user_email", model.sender_email),
                     new MySqlParameter("@object_id", "0"),
                     new MySqlParameter("@gc_id", gcid),
                     new MySqlParameter("@gc_code", code),
                    new MySqlParameter("@amount", model.amount),
                    new MySqlParameter("@date", model.date),
                    new MySqlParameter("@note", model.message),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddOrderItems(GiftCardModel model)
        {
            try
            {
                string strsql = "insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) values('Layla E-Gift Card','line_item',@order_id); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                     new MySqlParameter("@order_id", "issued"),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int AddOrderItemmeta(GiftCardModel model, int order_item_id)
        {
            try
            {
                string strsql = "insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) values " +
                    "(@order_item_id, '_product_id', '@product_id'), " +
                    "(@order_item_id, '_variation_id', '0'), " +
                    "(@order_item_id, '_qty', '@qty'), " +
                    "(@order_item_id, '_tax_class', ''), " +
                    "(@order_item_id, '_line_subtotal', '@totalAmount'), " +
                    "(@order_item_id, '_line_subtotal_tax', '0'), " +
                    "(@order_item_id, '_line_total', '@totalAmount'), " +
                    "(@order_item_id, '_line_tax', '0'), " +
                    "(@order_item_id, '_line_tax_data', ''), " +
                    "(@order_item_id, 'wc_gc_giftcard_to_multiple', '@wc_gc_giftcard_to_multiple'), " +
                    "(@order_item_id, 'wc_gc_giftcard_from', '@wc_gc_giftcard_from'), " +
                    "(@order_item_id, 'wc_gc_giftcard_message', '@wc_gc_giftcard_message'), " +
                    "(@order_item_id, 'wc_gc_giftcard_amount', '@wc_gc_giftcard_amount'), " +
                    "(@order_item_id, 'wc_gc_giftcards', ''); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                     new MySqlParameter("@order_item_id", order_item_id),
                     new MySqlParameter("@product_id", order_item_id),
                     new MySqlParameter("@qty", order_item_id),
                     new MySqlParameter("@totalAmount", order_item_id),
                     new MySqlParameter("@wc_gc_giftcard_to_multiple", order_item_id),
                     new MySqlParameter("@wc_gc_giftcard_from", order_item_id),
                     new MySqlParameter("@wc_gc_giftcard_message", order_item_id),
                     new MySqlParameter("@wc_gc_giftcard_amount", order_item_id),
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