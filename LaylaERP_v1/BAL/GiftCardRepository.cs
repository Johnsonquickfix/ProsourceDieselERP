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
        public DataTable GetOrderInfoByGCID(long id)
        {
            try
            {
                string strSql = "SELECT  post_id, Recipient,Amount,Qty,[Message],_billing_first_name FirstName,_billing_last_name LastName,_billing_country Country,_billing_state [State],_billing_city City, " +
                    "_billing_address_1 Address, _billing_address_2 Address2,_billing_company Company, _billing_postcode ZipCode,_billing_phone PhoneNumber, " +
                    "employee_id, employee_name, _billing_email sender_email FROM(SELECT  post_id, meta_key, meta_value, (Select top 1 Rlist.meta_value as Recipient from wp_woocommerce_order_items oi inner " +
                    "join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id left join wp_woocommerce_order_itemmeta Rlist on oi.order_item_id = Rlist.order_item_id and Rlist.meta_key = 'wc_gc_giftcard_to_multiple' where order_id = meta.post_id) Recipient," +
                    "(Select top 1 amt.meta_value as Recipient from wp_woocommerce_order_items oi inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id left join " +
                    "wp_woocommerce_order_itemmeta amt on oi.order_item_id = amt.order_item_id and amt.meta_key = 'wc_gc_giftcard_amount' where order_id = meta.post_id) Amount, " +
                    "(Select top 1 qty.meta_value from wp_woocommerce_order_items oi inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id " +
                    "left join wp_woocommerce_order_itemmeta qty on oi.order_item_id = qty.order_item_id and qty.meta_key = '_qty' where order_id = meta.post_id) Qty, " +
                    "(Select top 1 msg.meta_value as Recipient from wp_woocommerce_order_items oi inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id left " +
                    "join wp_woocommerce_order_itemmeta msg on oi.order_item_id = msg.order_item_id and msg.meta_key = 'wc_gc_giftcard_message' where order_id = meta.post_id) [Message] " +
                    "FROM wp_postmeta meta where post_id = (select order_id from wp_woocommerce_gc_cards where id = '" + id + "') ) AS SourceTable PIVOT(MIN([meta_value]) FOR[meta_key] IN " +
                    "(_billing_first_name, _billing_last_name, _billing_country, _billing_state, _billing_city, _billing_address_1, _billing_address_2, _billing_company, _billing_postcode, _billing_phone, employee_id, employee_name, _billing_email)) " +
                    "AS PivotOutput";
                DataTable result = SQLHelper.ExecuteDataTable(strSql);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public DataTable GetCustomerAddressByEmail(string useremail)
        //{
        //    try
        //    {
        //        string strSql = "Select TOP 1 fn.meta_value as FirstName, fl.meta_value as LastName, bco.meta_value as Country, bs.meta_value as State, bc.meta_value as City, " +
        //            "BA1.meta_value as Address1,BA2.meta_value as Address2,Bcomp.meta_value as Company, BP.meta_value as Phone,ZC.meta_value as ZipCode " +
        //            "from wp_users u left join wp_usermeta fn on u.id = fn.user_id and fn.meta_key = 'billing_first_name' " +
        //            "left join wp_usermeta fl on u.id = fl.user_id and fl.meta_key = 'billing_last_name' " +
        //            "left join wp_usermeta bco on u.id = bco.user_id and bco.meta_key = 'billing_country' " +
        //            "left join wp_usermeta bs on u.id = bs.user_id and bs.meta_key = 'billing_state' " +
        //            "left join wp_usermeta bc on u.id = bc.user_id and bc.meta_key = 'billing_city' " +
        //            "left join wp_usermeta BA1 on u.id = BA1.user_id and BA1.meta_key = 'billing_address_1' " +
        //            "left join wp_usermeta BA2 on u.id = BA2.user_id and BA2.meta_key = 'billing_address_2' " +
        //            "left join wp_usermeta Bcomp on u.id = Bcomp.user_id and Bcomp.meta_key = 'billing_company'" +
        //            " left join wp_usermeta ZC on u.id = ZC.user_id and ZC.meta_key='billing_postcode '" +
        //            " left join wp_usermeta BP on u.id = BP.user_id and BP.meta_key = 'billing_phone' left join wp_usermeta wc on u.id = wc.user_id and wc.meta_key = 'wp_capabilities' " +
        //            "where u.user_email = '" + useremail + "' and wc.meta_value='customer'";
        //        DataTable result = SQLHelper.ExecuteDataTable(strSql);
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
        //public static DataTable AddGiftCardOrdersPost(long Pkey, string qFlag, long UserID, string UserName, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
        //{
        //    var dt = new DataTable();
        //    try
        //    {
        //        long id = Pkey;
        //        SqlParameter[] parameters =
        //        {
        //            new SqlParameter("@pkey", Pkey),
        //            new SqlParameter("@qflag", qFlag),
        //            new SqlParameter("@userid", UserID),
        //            new SqlParameter("@username", UserName),
        //            new SqlParameter("@postsXML", postsXML.OuterXml),
        //            new SqlParameter("@order_statsXML", order_statsXML.OuterXml),
        //            new SqlParameter("@postmetaXML", postmetaXML.OuterXml),
        //            new SqlParameter("@order_itemsXML", order_itemsXML.OuterXml),
        //            new SqlParameter("@order_itemmetaXML", order_itemmetaXML.OuterXml)
        //        };
        //        dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_order", parameters);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //    return dt;
        //}
        public static DataTable AddGiftCardOrders(long Pkey, string qFlag, long UserID, string UserName, string UserEmail, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
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
                    new SqlParameter("@useremail", UserEmail),
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
        public static DataSet AddGiftCardMailOrders(long Pkey, string qFlag, long UserID, string UserName, string UserEmail, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
        {
            var dt = new DataSet();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@username", UserName),
                    new SqlParameter("@useremail", UserEmail),
                    new SqlParameter("@postsXML", postsXML.OuterXml),
                    new SqlParameter("@order_statsXML", order_statsXML.OuterXml),
                    new SqlParameter("@postmetaXML", postmetaXML.OuterXml),
                    new SqlParameter("@order_itemsXML", order_itemsXML.OuterXml),
                    new SqlParameter("@order_itemmetaXML", order_itemmetaXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataSet("wp_posts_giftcard_order", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
        //gift card
        public static DataTable GetPodiumGiftOrdersList()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", "PGPLS") };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GiftCardOrderList(DateTime? fromdate, DateTime? todate, string customerid, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@customer_id", customerid),
                    new SqlParameter("@post_status", userstatus),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "SGCOL")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("wp_posts_giftcard_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int ChangeGiftCardStatus(SearchModel model, string ID)
        {
            try
            {
                string strsql = string.Format("Update wp_woocommerce_gc_cards set is_active=@status where id in ({0}); ", ID);
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.strValue2)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));

                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public DataTable ChangeGiftCardOrderStatus(string ID)
        {
            try
            {
                //string strsql = string.Format("Update wp_woocommerce_gc_cards set is_active='off' where order_id in ({0}); ", ID);
                string strsql = "wp_posts_giftcard_search";
                SqlParameter[] para =
               {
                    new SqlParameter("@Flag","DGC"),
                    new SqlParameter("@order_id", ID)
                };
                DataTable result = SQLHelper.ExecuteDataTable(strsql,para);
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataSet TodayGiftCardsList()
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", "SGCOD") };
                ds = SQLHelper.ExecuteDataSet("wp_posts_giftcard_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return ds;
        }
        public static DataTable GetGiftCardDetails(long OrderID)
        {
            DataTable dt = new DataTable();
            try
            {


                SqlParameter[] parameters = {
                    new SqlParameter("@order_id", OrderID),
                    new SqlParameter("@flag", "RSGCO")
                        };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GetRedeemedCustomers(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {

                string strWhr = "Select id,user_email displayname from (select id,user_email, ROW_NUMBER() OVER(PARTITION BY user_email order by id desc) rn from wp_woocommerce_gc_activity where type = 'used' and id> 109 and user_email like  '%" + strSearch + "%')a where rn = 1";
                DT = SQLHelper.ExecuteDataTable(strWhr);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static int UpdatePaymentInvoice(List<OrderPostMetaModel> model)
        {
            int result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strSql_insert = string.Empty, Payment_method = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (OrderPostMetaModel obj in model)
                {
                    strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                    if (obj.meta_key.ToLower() == "_payment_method") Payment_method = obj.meta_value;
                }
                strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model[0].post_id.ToString() + ");";
                strSql.Append(strSql_insert);
                if (Payment_method.ToLower() == "podium")
                {
                    //strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1};", "wc-pendingpodiuminv", model[0].post_id));
                    strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1} and post_status != 'wc-on-hold';", "wc-pendingpodiuminv", model[0].post_id));
                    //// step 3 : Add Order Note
                    strSql.Append("insert into wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) ");
                    strSql.Append(string.Format("values ({0}, 'WooCommerce', 'woocommerce@laylasleep.com', '', '', '{1}', '{2}', '{3}', '0', '1', 'WooCommerce', 'order_note', '0', '0');", model[0].post_id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), "Order status changed from Pending payment to Pending Podium Invoice."));
                }
                else
                {
                    strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1} and post_status != 'wc-on-hold';", "wc-pending", model[0].post_id));
                }

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }

        public static string GetSendEmailHTML(GiftCardModel model)
        {
            string dt = "";
            try
            {
                SqlParameter[] parameters = {
                    new SqlParameter("@qflag", "SNGCM"),
                    new SqlParameter("@pkey", model.order_id),
                    new SqlParameter("@sender", model.sender),
                    new SqlParameter("@message", model.message),
                    new SqlParameter("@balance", model.balance),
                    new SqlParameter("@code", model.code),
                };
                dt = SQLHelper.ExecuteScalar("usp_SendEmailTemplate", parameters).ToString();
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GiftCardActivity(string id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@flag", "SGCAH")
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        
        public static DataTable GiftCardActivityList(string id, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "SGCAL")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("wp_posts_giftcard_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static void OrderInvoiceMail(long OrderID)
        {
            try
            {
                OrderModel order_obj = GiftCardRepository.OrderInvoice(OrderID);
                String renderedHTML = Controllers.EmailNotificationsController.RenderViewToString("EmailNotifications", "GiftCardOrder", order_obj);
                SendEmail.SendEmails_outer(order_obj.b_email, "Your order #" + OrderID + " has been received", renderedHTML, string.Empty);
            }
            catch { }
        }

        public static OrderModel OrderInvoice(long OrderID)
        {
            OrderModel obj = new OrderModel();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID),
                    new SqlParameter("@Flag", "GGCOD"),

                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("wp_posts_giftcard_search", parameters);
                while (sdr.Read())
                {
                    obj.order_id = (sdr["order_id"] != Convert.DBNull) ? Convert.ToInt64(sdr["order_id"]) : 0;
                    obj.order_date = (sdr["date_created"] != Convert.DBNull) ? sdr["date_created"].ToString() : "";
                    obj.payment_method = (sdr["payment_method"] != Convert.DBNull) ? sdr["payment_method"].ToString() : "";
                    obj.payment_method_title = (sdr["payment_method_title"] != Convert.DBNull) ? sdr["payment_method_title"].ToString() : "";
                    obj.b_first_name = (sdr["b_first_name"] != Convert.DBNull) ? sdr["b_first_name"].ToString() : "";
                    obj.b_last_name = (sdr["b_last_name"] != Convert.DBNull) ? sdr["b_last_name"].ToString() : "";
                    obj.b_company = (sdr["b_company"] != Convert.DBNull) ? sdr["b_company"].ToString() : "";
                    obj.b_address_1 = (sdr["b_address_1"] != Convert.DBNull) ? sdr["b_address_1"].ToString() : "";
                    obj.b_address_2 = (sdr["b_address_2"] != Convert.DBNull) ? sdr["b_address_2"].ToString() : "";
                    obj.b_postcode = (sdr["b_postcode"] != Convert.DBNull) ? sdr["b_postcode"].ToString() : "";
                    obj.b_city = (sdr["b_city"] != Convert.DBNull) ? sdr["b_city"].ToString() : "";
                    obj.b_country = (sdr["b_country"] != Convert.DBNull) ? sdr["b_country"].ToString() : "";
                    obj.b_state = (sdr["b_state"] != Convert.DBNull) ? sdr["b_state"].ToString() : "";
                    obj.b_email = (sdr["b_email"] != Convert.DBNull) ? sdr["b_email"].ToString() : "";
                    obj.b_phone = (sdr["b_phone"] != Convert.DBNull) ? sdr["b_phone"].ToString() : "";
                    obj.s_first_name = (sdr["s_first_name"] != Convert.DBNull) ? sdr["s_first_name"].ToString() : "";
                    obj.s_last_name = (sdr["s_last_name"] != Convert.DBNull) ? sdr["s_last_name"].ToString() : "";
                    obj.s_company = (sdr["s_company"] != Convert.DBNull) ? sdr["s_company"].ToString() : "";
                    obj.s_address_1 = (sdr["s_address_1"] != Convert.DBNull) ? sdr["s_address_1"].ToString() : "";
                    obj.s_address_2 = (sdr["s_address_2"] != Convert.DBNull) ? sdr["s_address_2"].ToString() : "";
                    obj.s_postcode = (sdr["s_postcode"] != Convert.DBNull) ? sdr["s_postcode"].ToString() : "";
                    obj.s_city = (sdr["s_city"] != Convert.DBNull) ? sdr["s_city"].ToString() : "";
                    obj.s_country = (sdr["s_country"] != Convert.DBNull) ? sdr["s_country"].ToString() : "";
                    obj.s_state = (sdr["s_state"] != Convert.DBNull) ? sdr["s_state"].ToString() : "";
                    obj.paypal_id = (sdr["paypal_id"] != Convert.DBNull) ? sdr["paypal_id"].ToString() : "";
                    obj.GrassAmount = Convert.ToDecimal(sdr["GrassAmount"]);
                    obj.TotalTax = Convert.ToDecimal(sdr["TotalTax"]);
                    obj.NetTotal = Convert.ToDecimal(sdr["NetTotal"]);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return obj;
        }
    }
}