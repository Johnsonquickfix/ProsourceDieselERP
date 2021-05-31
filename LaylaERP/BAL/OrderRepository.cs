namespace LaylaERP.BAL
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Data;
    using DAL;
    using Models;
    using MySql.Data.MySqlClient;

    public class OrderRepository
    {
        public static DataTable GetCustomers(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("select id,CONCAT(User_Login, ' [ ', user_email, ']') as displayname from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' and meta_value like '%customer%' where CONCAT(User_Login, ' [ ', user_email, ']') like '%" + strSearch + "%' limit 50;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetCustomersInfo(long id)
        {
            DataTable DT = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@user_id", id),
                };
                DT = SQLHelper.ExecuteDataTable("select umeta_id,user_id,meta_key,meta_value from wp_usermeta where user_id= @user_id and (meta_key like 'billing_%' OR meta_key like 'shipping_%')", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static long AddOrdersPost()
        {
            long result = 0;
            try
            {
                OrderPostModel model = new OrderPostModel();
                model.ID = 0;
                model.post_author = "1";
                model.post_date = DateTime.Now;
                model.post_date_gmt = DateTime.UtcNow;
                model.post_content = string.Empty;
                model.post_title = "Order &ndash; " + model.post_date.ToString("MMMM dd, yyyy @ HH:mm tt");
                model.post_excerpt = string.Empty;
                model.post_status = "auto-draft";
                model.comment_status = "open";
                model.ping_status = "closed";
                model.post_password = string.Empty;
                model.post_name = string.Empty;
                model.to_ping = string.Empty;
                model.pinged = string.Empty;
                model.post_modified = model.post_date;
                model.post_modified_gmt = model.post_date_gmt;
                model.post_content_filtered = string.Empty;
                model.post_parent = "0";
                model.guid = "http://173.247.242.204/~rpsisr/woo/?post_type=shop_order&p=";
                model.menu_order = "0";
                model.post_type = "shop_order";
                model.post_mime_type = string.Empty;
                model.comment_count = "0";



                string strSQL = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,"
                                    + " to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)"
                                    + " VALUES(@post_author,@post_date,@post_date_gmt,@post_content,@post_title,@post_excerpt,@post_status,@comment_status,@ping_status,@post_password,@post_name,"
                                    + " @to_ping,@pinged,@post_modified,@post_modified_gmt,@post_content_filtered,@post_parent,@guid,@menu_order,@post_type,@post_mime_type,@comment_count)";

                strSQL = strSQL + "; SELECT LAST_INSERT_ID();";
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
            }
            catch (MySql.Data.MySqlClient.MySqlException ex)
            {
                throw new Exception(ex.Message);

            }
            return result;
        }
        public static DataTable GetProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title,COALESCE(meta_value,0) sale_price"
                            + " ,CONCAT(post.id,'$',COALESCE(ps.id,0)) r_id,CONCAT(post.id,'$',COALESCE(ps.id,0),'$',COALESCE(pr.meta_value,0)) rd_id FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta pr on pr.post_id = COALESCE(ps.id, post.id) and pr.meta_key = '_sale_price'"
                            + " WHERE post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(post.post_title, ' - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) like '%" + strSearch + "%' "
                            + " ORDER BY post.ID limit 50;";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
    }
}