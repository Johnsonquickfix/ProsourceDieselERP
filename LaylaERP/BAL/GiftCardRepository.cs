using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
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
                     new MySqlParameter("@wc_gc_giftcard_message", model.message),
                     new MySqlParameter("@wc_gc_giftcard_amount", model.amount),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public DataTable GetCustomerAddressByEmail(string useremail)
        {
            try
            {
                string strSql = "Select fn.meta_value as FirstName, fl.meta_value as LastName, bco.meta_value as Country, bs.meta_value as State, bc.meta_value as City, " +
                    "BA1.meta_value as Address1,BA2.meta_value as Address2,Bcomp.meta_value as Company, BP.meta_value as Phone,ZC.meta_value as ZipCode " +
                    "from wp_users u left join wp_usermeta fn on u.id = fn.user_id and fn.meta_key = 'billing_first_name' " +
                    "left join wp_usermeta fl on u.id = fl.user_id and fl.meta_key = 'billing_last_name' " +
                    "left join wp_usermeta bco on u.id = bco.user_id and bco.meta_key = 'billing_country' " +
                    "left join wp_usermeta bs on u.id = bs.user_id and bs.meta_key = 'billing_state' " +
                    "left join wp_usermeta bc on u.id = bc.user_id and bc.meta_key = 'billing_city' " +
                    "left join wp_usermeta BA1 on u.id = BA1.user_id and BA1.meta_key = 'billing_address_1' " +
                    "left join wp_usermeta BA2 on u.id = BA2.user_id and BA2.meta_key = 'billing_address_2' " +
                    "left join wp_usermeta Bcomp on u.id = Bcomp.user_id and Bcomp.meta_key = 'billing_company'" +
                    " left join wp_usermeta ZC on u.id = ZC.user_id and ZC.meta_key='billing_postcode'" +
                    "left join wp_usermeta BP on u.id = BP.user_id and BP.meta_key = 'billing_phone' " +
                    "where u.user_email = '"+ useremail + "' group by u.user_email ";
                DataTable result =SQLHelper.ExecuteDataTable(strSql);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}