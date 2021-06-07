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
    using System.Text;

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
                DT = SQLHelper.ExecuteDataTable("select umeta_id,user_id,meta_key,meta_value from wp_usermeta where user_id= @user_id and (meta_key like 'billing_%' OR meta_key like 'shipping_%') order by meta_key", parameters);
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
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " WHERE post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) like '%" + strSearch + "%' "
                            + " ORDER BY post.ID limit 50;";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static OrderProductsModel GetProductDetails(long product_id, long variation_id)
        {
            OrderProductsModel productsModel = new OrderProductsModel();
            try
            {
                DataTable DT = new DataTable();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id),
                    new MySqlParameter("@variation_id", variation_id)
                };
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , COALESCE(pr.meta_value, 0) price,COALESCE(psr.meta_value, 0) sale_price FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_sale_price'"
                            + " WHERE post.post_type = 'product' and post.id = @product_id and ps.id = @variation_id;";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    if (sdr["id"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["id"]);
                    else
                        productsModel.product_id = 0;
                    if (sdr["pr_id"] != DBNull.Value)
                        productsModel.variation_id = Convert.ToInt64(sdr["pr_id"]);
                    else
                        productsModel.variation_id = 0;
                    if (sdr["post_title"] != DBNull.Value)
                        productsModel.product_name = sdr["post_title"].ToString();
                    else
                        productsModel.product_name = string.Empty;
                    if (sdr["price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["price"].ToString().Trim()))
                        productsModel.price = decimal.Parse(sdr["price"].ToString());
                    else
                        productsModel.price = 0;
                    if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                        productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                    else
                        productsModel.sale_price = productsModel.price;

                }
            }
            catch (Exception ex)
            { throw ex; }
            return productsModel;
        }
        public static OrderShippingModel GetProductShippingCharge(long product_id)
        {
            OrderShippingModel productsModel = new OrderShippingModel();
            try
            {
                DataTable DT = new DataTable();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id)
                };
                string strSQl = "select * from wp_ship_value where productid=@product_id";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    if (sdr["productid"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["productid"]);
                    else
                        productsModel.product_id = 0;
                    if (sdr["AK"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["AK"].ToString().Trim()))
                        productsModel.AK = decimal.Parse(sdr["AK"].ToString());
                    else
                        productsModel.AK = 0;
                    if (sdr["HI"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["HI"].ToString().Trim()))
                        productsModel.HI = decimal.Parse(sdr["HI"].ToString().Trim());
                    else
                        productsModel.HI = 0;
                    if (sdr["CA"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["CA"].ToString().Trim()))
                        productsModel.CA = decimal.Parse(sdr["CA"].ToString().Trim());
                    else
                        productsModel.CA = 0;
                }
            }
            catch (Exception ex)
            { throw ex; }
            return productsModel;
        }
        public static DataTable GetCouponDiscount(string strCoupon)
        {
            DataTable dt = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@strCoupon", strCoupon)
                };
                string strSQl = "select post_title,max(case when pm.meta_key = 'discount_type' then pm.meta_value else '' end) discount_type,max(case when pm.meta_key = 'product_ids' then pm.meta_value else '' end) product_ids,"
                                + "     max(case when pm.meta_key = 'date_expires' then pm.meta_value else '' end) date_expires,max(case when pm.meta_key = 'coupon_amount' then pm.meta_value else '' end) coupon_amount"
                                + " from wp_posts p inner join wp_postmeta pm on pm.post_id = p.id"
                                + " where post_title = @strCoupon And post_name = @strCoupon And post_type = 'shop_coupon' group by pm.post_id";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static int SaveOrder(OrderModel model)
        {
            int result = 0;
            try
            {
                DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                StringBuilder strSql = new StringBuilder(string.Format("delete from wp_postmeta where post_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format("delete from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format("delete from wp_wc_order_stats where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format("delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id = {0}); ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format("delete from wp_woocommerce_order_items where order_id = {0}; ", model.OrderPostStatus.order_id));

                var i = 0;
                /// step 1 : wp_postmeta                
                strSql.Append(" insert into wp_postmeta (post_id,meta_key,meta_value) values ");
                foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                {
                    if (++i == model.OrderPostMeta.Count)
                        strSql.Append(string.Format("('{0}','{1}','{2}') ", obj.post_id, obj.meta_key, obj.meta_value));
                    else
                        strSql.Append(string.Format("('{0}','{1}','{2}'), ", obj.post_id, obj.meta_key, obj.meta_value));
                }
                /// step 2 : wp_wc_order_stats
                strSql.Append("; insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id) value");
                strSql.Append(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}') ;", model.OrderPostStatus.order_id, model.OrderPostStatus.parent_id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), model.OrderPostStatus.num_items_sold,
                                    model.OrderPostStatus.total_sales, model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.returning_customer, model.OrderPostStatus.status, model.OrderPostStatus.customer_id));

                /// step 3 : wp_woocommerce_order_items
                foreach (OrderProductsModel obj in model.OrderProducts)
                {
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.product_name, "line_item", model.OrderPostStatus.order_id));

                    strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount) ");
                    strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}'; ", model.OrderPostStatus.order_id, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                            cDate.ToString("yyyy/MM/dd HH:mm:ss"),obj.quantity,(obj.total - obj.discount), (obj.total - obj.discount +obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                }
                /// step 4 : wp_woocommerce_order_items
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_subtotal',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'size','' from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch { }
            return result;
        }

    }
}