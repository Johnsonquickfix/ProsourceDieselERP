using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml;

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
                SqlParameter[] para =
                {

                    new SqlParameter("@code", code),
                    new SqlParameter("@order_id", "0"),
                    new SqlParameter("@order_item_id", "0"),
                    new SqlParameter("@recipient", recipient),
                    new SqlParameter("@redeemed_by", "0"),
                    new SqlParameter("@sender", model.sender),
                    new SqlParameter("@sender_email", model.sender_email),
                    new SqlParameter("@message", model.message),
                    new SqlParameter("@balance", model.amount),
                    new SqlParameter("@remaining", model.amount),
                    new SqlParameter("@template_id", "default"),
                    new SqlParameter("@create_date", DateTime.Now.ToString("MM/dd/yyyy")),
                    new SqlParameter("@deliver_date", "0"),
                    new SqlParameter("@delivered", "0"),
                    new SqlParameter("@expire_date", "0"),
                    new SqlParameter("@redeem_date", "0"),
                    new SqlParameter("@is_virtual", "on"),
                    new SqlParameter("@is_active", "on"),
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
                SqlParameter[] para =
                {
                     new SqlParameter("@type", "issued"),
                     new SqlParameter("@user_id", "0"),
                     new SqlParameter("@user_email", model.sender_email),
                     new SqlParameter("@object_id", "0"),
                     new SqlParameter("@gc_id", gcid),
                     new SqlParameter("@gc_code", code),
                    new SqlParameter("@amount", model.amount),
                    new SqlParameter("@date", model.date),
                    new SqlParameter("@note", model.message),
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
                SqlParameter[] para =
                {
                     new SqlParameter("@order_id", "issued"),
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
                SqlParameter[] para =
                {
                     new SqlParameter("@order_item_id", order_item_id),
                     new SqlParameter("@product_id", order_item_id),
                     new SqlParameter("@qty", order_item_id),
                     new SqlParameter("@totalAmount", order_item_id),
                     new SqlParameter("@wc_gc_giftcard_to_multiple", order_item_id),
                     new SqlParameter("@wc_gc_giftcard_from", order_item_id),
                     new SqlParameter("@wc_gc_giftcard_message", model.message),
                     new SqlParameter("@wc_gc_giftcard_amount", model.amount),
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
                string strSql = "Select TOP 1 fn.meta_value as FirstName, fl.meta_value as LastName, bco.meta_value as Country, bs.meta_value as State, bc.meta_value as City, " +
                    "BA1.meta_value as Address1,BA2.meta_value as Address2,Bcomp.meta_value as Company, BP.meta_value as Phone,ZC.meta_value as ZipCode " +
                    "from wp_users u left join wp_usermeta fn on u.id = fn.user_id and fn.meta_key = 'billing_first_name' " +
                    "left join wp_usermeta fl on u.id = fl.user_id and fl.meta_key = 'billing_last_name' " +
                    "left join wp_usermeta bco on u.id = bco.user_id and bco.meta_key = 'billing_country' " +
                    "left join wp_usermeta bs on u.id = bs.user_id and bs.meta_key = 'billing_state' " +
                    "left join wp_usermeta bc on u.id = bc.user_id and bc.meta_key = 'billing_city' " +
                    "left join wp_usermeta BA1 on u.id = BA1.user_id and BA1.meta_key = 'billing_address_1' " +
                    "left join wp_usermeta BA2 on u.id = BA2.user_id and BA2.meta_key = 'billing_address_2' " +
                    "left join wp_usermeta Bcomp on u.id = Bcomp.user_id and Bcomp.meta_key = 'billing_company'" +
                    " left join wp_usermeta ZC on u.id = ZC.user_id and ZC.meta_key='billing_postcode '" +
                    "left join wp_usermeta BP on u.id = BP.user_id and BP.meta_key = 'billing_phone' " +
                    "where u.user_email = '"+ useremail + "'";
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

                SqlParameter[] parameters =
                {
                    new SqlParameter("@post_author", model.post_author),
                    new SqlParameter("@post_date", model.post_date),
                    new SqlParameter("@post_date_gmt", model.post_date_gmt),
                    new SqlParameter("@post_content", model.post_content),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_excerpt", model.post_excerpt),
                    new SqlParameter("@post_status", model.post_status),
                    new SqlParameter("@comment_status", model.comment_status),
                    new SqlParameter("@ping_status", model.ping_status),
                    new SqlParameter("@post_password", model.post_password),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@to_ping", model.to_ping),
                    new SqlParameter("@pinged", model.pinged),
                    new SqlParameter("@post_modified", model.post_modified),
                    new SqlParameter("@post_modified_gmt", model.post_modified_gmt),
                    new SqlParameter("@post_content_filtered", model.post_content_filtered),
                    new SqlParameter("@post_parent", model.post_parent),
                    new SqlParameter("@guid", model.guid),
                    new SqlParameter("@menu_order", model.menu_order),
                    new SqlParameter("@post_type", model.post_type),
                    new SqlParameter("@post_mime_type", model.post_mime_type),
                    new SqlParameter("@comment_count", model.comment_count)
                };
                result = Convert.ToInt64(SQLHelper.ExecuteScalar(strSQL, parameters));
                if (result > 0)
                {
                    AddOrdersPostMeta(result, _list);
                }
            }
            catch (Exception ex)
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

        public static DataTable AddGiftCardOrdersPost(long Pkey, string qFlag, long UserID, string UserName, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@username", UserName),
                    new SqlParameter("@postsXML", postsXML.OuterXml),
                    new SqlParameter("@order_statsXML", order_statsXML.OuterXml),
                    new SqlParameter("@postmetaXML", postmetaXML.OuterXml),
                    new SqlParameter("@order_itemsXML", order_itemsXML.OuterXml),
                    new SqlParameter("@order_itemmetaXML", order_itemmetaXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_order", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
    }
}