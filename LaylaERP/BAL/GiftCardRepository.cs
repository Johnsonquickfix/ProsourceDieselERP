using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
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

        public static long AddOrdersPost(List<OrderPostMetaModel> _list)
        {
            long result = 0;
            try
            {
                OrderPostModel model = new OrderPostModel();
                model.ID = 0;
                model.post_author = "1";
                model.post_date = CommonDate.CurrentDate();
                model.post_date_gmt = CommonDate.UtcDate();
                model.post_content = string.Empty;
                model.post_title = "Order &ndash; " + model.post_date_gmt.ToString("MMMM dd, yyyy @ HH:mm tt");
                model.post_excerpt = string.Empty;
                model.post_status = "auto-draft";// "draft";
                model.comment_status = "open";
                model.ping_status = "closed";
                model.post_password = string.Empty;
                model.post_name = "order-" + model.post_date_gmt.ToString("MMM-dd-yyyy-HHmm-tt").ToLower();
                model.to_ping = string.Empty;
                model.pinged = string.Empty;
                model.post_modified = model.post_date;
                model.post_modified_gmt = model.post_date_gmt;
                model.post_content_filtered = string.Empty;
                model.post_parent = "0";
                model.post_type = "shop_order";
                //model.guid = string.Format("{0}?{1}={2}", Net.Host, "post_type=shop_order&p", "");
                model.guid = string.Format("{0}?{1}={2}", "http://173.247.242.204/~rpsisr/woo/", "post_type=shop_order&p", "");
                model.menu_order = "0";
                model.post_mime_type = string.Empty;
                model.comment_count = "0";

                string strSQL = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,"
                                    + " to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)"
                                    + " VALUES(@post_author,@post_date,@post_date_gmt,@post_content,@post_title,@post_excerpt,@post_status,@comment_status,@ping_status,@post_password,@post_name,"
                                    + " @to_ping,@pinged,@post_modified,@post_modified_gmt,@post_content_filtered,@post_parent,@guid,@menu_order,@post_type,@post_mime_type,@comment_count)";

                strSQL += "; insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id)";
                strSQL += " SELECT LAST_INSERT_ID(),'0',@post_date,@post_date_gmt,'0','0','0','0','0','0',@post_status,'0' ; SELECT LAST_INSERT_ID();";

                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@post_author", model.post_author),
                    new MySqlParameter("@post_date", model.post_date),
                    new MySqlParameter("@post_date_gmt", model.post_date_gmt),
                    new MySqlParameter("@post_content", model.post_content),
                    new MySqlParameter("@post_title", model.post_title),
                    new MySqlParameter("@post_excerpt", model.post_excerpt),
                    new MySqlParameter("@post_status", model.post_status),
                    new MySqlParameter("@comment_status", model.comment_status),
                    new MySqlParameter("@ping_status", model.ping_status),
                    new MySqlParameter("@post_password", model.post_password),
                    new MySqlParameter("@post_name", model.post_name),
                    new MySqlParameter("@to_ping", model.to_ping),
                    new MySqlParameter("@pinged", model.pinged),
                    new MySqlParameter("@post_modified", model.post_modified),
                    new MySqlParameter("@post_modified_gmt", model.post_modified_gmt),
                    new MySqlParameter("@post_content_filtered", model.post_content_filtered),
                    new MySqlParameter("@post_parent", model.post_parent),
                    new MySqlParameter("@guid", model.guid),
                    new MySqlParameter("@menu_order", model.menu_order),
                    new MySqlParameter("@post_type", model.post_type),
                    new MySqlParameter("@post_mime_type", model.post_mime_type),
                    new MySqlParameter("@comment_count", model.comment_count)
                };
                result = Convert.ToInt64(SQLHelper.ExecuteScalar(strSQL, parameters));
                if (result > 0)
                {
                    AddOrdersPostMeta(result, _list);
                }
            }
            catch (MySql.Data.MySqlClient.MySqlException ex)
            {
                throw new Exception(ex.Message);

            }
            return result;
        }
        public static int AddOrdersPostMeta(long post_id, List<OrderPostMetaModel> model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder("update wp_posts set guid=concat(guid,'" + post_id.ToString() + "') where id=" + post_id.ToString() + ";insert into wp_postmeta (post_id,meta_key,meta_value) values ");
                var i = 0;
                foreach (OrderPostMetaModel obj in model)
                {
                    if (++i == model.Count)
                        strSql.Append(string.Format("('{0}','{1}','{2}') ", post_id, obj.meta_key, obj.meta_value));
                    else
                        strSql.Append(string.Format("('{0}','{1}','{2}'), ", post_id, obj.meta_key, obj.meta_value));
                }
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return result;
        }
    }
}