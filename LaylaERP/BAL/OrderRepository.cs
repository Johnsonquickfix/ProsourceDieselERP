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
        public static ZipCodeModel GetCityByZip(string zipcode)
        {
            ZipCodeModel obj = new ZipCodeModel();
            try
            {
                string strquery = "select distinct ZipCode,State,StateFullName,City from ZIPCodes1 where ZipCode = '" + zipcode.Trim() + "' ";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strquery);
                while (sdr.Read())
                {
                    if (sdr["ZipCode"] != DBNull.Value)
                        obj.ZipCode = sdr["ZipCode"].ToString().Trim();
                    else
                        obj.ZipCode = string.Empty;
                    if (sdr["State"] != DBNull.Value)
                        obj.state = sdr["State"].ToString().Trim();
                    else
                        obj.state = string.Empty;
                    if (sdr["City"] != DBNull.Value)
                        obj.city = sdr["City"].ToString().Trim();
                    else
                        obj.city = string.Empty;

                    obj.country = string.Empty;
                }
            }
            catch (Exception ex)
            { throw ex; }
            return obj;
        }
        public static DataTable GetCustomers(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strWhr = "select id,CONCAT(User_Login, ' [ ', user_email, ']') as displayname,replace(replace(replace(replace(ump.meta_value, '-', ''), ' ', ''), '(', ''), ')', '')  billing_phone"
                                + " from wp_users as ur"
                                + " inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value like '%customer%'"
                                + " left outer join wp_usermeta ump on ur.id = ump.user_id and ump.meta_key = 'billing_phone'";
                strWhr += " where User_Login  like '%" + strSearch + "%' or user_email like '%" + strSearch + "%' ";
                strWhr += " OR replace(replace(replace(replace(ump.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + strSearch + "%' limit 50;";

                DT = SQLHelper.ExecuteDataTable(strWhr);
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
                model.post_status = "auto-draft";// "draft";
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
                            + " , COALESCE(pr.meta_value, 0) reg_price,COALESCE(psr.meta_value, 0) sale_price FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_price'"
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
                    if (sdr["reg_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["price"].ToString().Trim()))
                        productsModel.price = decimal.Parse(sdr["reg_price"].ToString());
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
        public static List<OrderProductsModel> GetProductListDetails(long product_id, long variation_id)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                string free_products = string.Empty;
                if (product_id == 118)
                    free_products = "632713";
                else if (product_id == 611172)
                    free_products = "78676";
                else
                    free_products = "";

                OrderProductsModel productsModel = new OrderProductsModel();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id),
                    new MySqlParameter("@variation_id", variation_id)
                };
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , COALESCE(pr.meta_value, 0) reg_price,COALESCE(psr.meta_value, 0) sale_price FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_price'"
                            + " WHERE post.post_type = 'product' and post.id = @product_id and ps.id = @variation_id ";
                if (product_id == 611172 && !string.IsNullOrEmpty(free_products))
                    strSQl += " OR (post.id in (" + free_products + ") and COALESCE(ps.id,0) = 0);";
                else if (product_id == 118 && !string.IsNullOrEmpty(free_products))
                    strSQl += " OR (post.id in (" + free_products + ") and COALESCE(ps.id,0) = 0);";
                else
                    strSQl += ";";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    productsModel = new OrderProductsModel();
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
                    if (sdr["reg_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["reg_price"].ToString().Trim()))
                        productsModel.reg_price = decimal.Parse(sdr["reg_price"].ToString());
                    else
                        productsModel.reg_price = 0;
                    if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                        productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                    else
                        productsModel.sale_price = productsModel.reg_price;
                    productsModel.price = productsModel.sale_price;
                    productsModel.quantity = 1;
                    /// free item
                    if (productsModel.product_id == 78676) { productsModel.is_free = true; productsModel.quantity = 2; }
                    else if (productsModel.product_id == 632713) { productsModel.is_free = true; productsModel.quantity = 2; }
                    else productsModel.is_free = false;

                    /// 
                    if (productsModel.product_id == 611172) productsModel.group_id = 78676;
                    else if (productsModel.product_id == 118) productsModel.group_id = 632713;
                    else productsModel.group_id = 0;

                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderShippingModel> GetProductShippingCharge(string variation_ids, string shipping_state)
        {
            List<OrderShippingModel> _list = new List<OrderShippingModel>();
            try
            {
                DataTable DT = new DataTable();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", variation_ids)
                };
                string strSQl = "select * from wp_ship_value where productid in (@product_id) ";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    OrderShippingModel productsModel = new OrderShippingModel();
                    if (sdr["productid"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["productid"]);
                    else
                        productsModel.product_id = 0;

                    if (sdr[shipping_state] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr[shipping_state].ToString().Trim()))
                        productsModel.AK = decimal.Parse(sdr[shipping_state].ToString());
                    else
                        productsModel.AK = 0;

                    //if (sdr["AK"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["AK"].ToString().Trim()))
                    //    productsModel.AK = decimal.Parse(sdr["AK"].ToString());
                    //else
                    //    productsModel.AK = 0;
                    //if (sdr["HI"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["HI"].ToString().Trim()))
                    //    productsModel.HI = decimal.Parse(sdr["HI"].ToString().Trim());
                    //else
                    //    productsModel.HI = 0;
                    //if (sdr["CA"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["CA"].ToString().Trim()))
                    //    productsModel.CA = decimal.Parse(sdr["CA"].ToString().Trim());
                    //else
                    //    productsModel.CA = 0;

                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
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
                string strSQl = "select post_title,post_title title,max(case when pm.meta_key = 'discount_type' then pm.meta_value else '' end) discount_type,max(case when pm.meta_key = 'product_ids' then pm.meta_value else '' end) product_ids,max(case when pm.meta_key = 'exclude_product_ids' then pm.meta_value else '' end) exclude_product_ids,"
                                + "     max(case when pm.meta_key = 'date_expires' then pm.meta_value else '' end) date_expires,max(case when pm.meta_key = 'coupon_amount' then pm.meta_value else '' end) coupon_amount,"
                                + "     max(case when pm.meta_key = 'individual_use' then pm.meta_value else '' end) individual_use,max(case when pm.meta_key = '_wjecf_products_and' then pm.meta_value else 'no' end) and_or,"
                                + "     max(case when pm.meta_key = 'limit_x_items' then pm.meta_value else '' end) limit_x_items,max(case when pm.meta_key = 'cus_email' then pm.meta_value else '' end) cus_email,"
                                + "     max(case when pm.meta_key = 'usage_limit' then pm.meta_value else '' end) usage_limit,max(case when pm.meta_key = 'usage_limit_per_user' then pm.meta_value else '' end) usage_limit_per_user,"
                                + "     max(case when pm.meta_key = '_wjecf_is_auto_coupon' then(case when pm.meta_value = 'yes' then 'auto_coupon' else 'add_coupon' end) else 'add_coupon' end) type"
                                + " from wp_posts p inner join wp_postmeta pm on pm.post_id = p.id"
                                + " where lower(post_title) = @strCoupon And post_type = 'shop_coupon' group by pm.post_id";
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
                            cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                }
                /// step 4 : wp_woocommerce_order_itemmeta
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_subtotal',product_net_revenue + coupon_amount from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'size','' from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id = {0}; ", model.OrderPostStatus.order_id));

                /// step 3 : wp_woocommerce_order_items
                foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                {
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.item_name, obj.item_type, model.OrderPostStatus.order_id));
                    if (obj.item_type == "coupon")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type, obj.item_name));
                    }
                    else if (obj.item_type == "fee")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", "taxable", model.OrderPostStatus.order_id, obj.item_type));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type));
                    }
                    else if (obj.item_type == "shipping")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type));
                    }
                }
                /// step 4 : wp_posts (Coupon used by)
                strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));

                /// step 5 : wp_woocommerce_order_items (Tax)
                foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                {
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}-{1}-{2} TAX-1','tax','{3}'); ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, model.OrderPostStatus.order_id));

                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_rate_state, model.OrderPostStatus.order_id, "tax"));
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, "tax"));
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_rate, model.OrderPostStatus.order_id, "tax"));
                }

                /// step 6 : wp_posts
                strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception Ex) { }
            return result;
        }
        public static int UpdateOrderStatus(OrderPostMetaModel model)
        {
            int result = 0;
            try
            {
                DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                StringBuilder strSql = new StringBuilder(string.Format("delete from wp_postmeta where post_id = {0} and meta_key = 'taskuidforsms'; ", model.post_id));
                strSql.Append(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value) values ('{0}','{1}','{2}') ", model.post_id, "taskuidforsms", model.meta_value));

                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch { }
            return result;
        }
        public static int UpdatePayPalStatus(List<OrderPostMetaModel> model)
        {
            int result = 0;
            try
            {
                var i = 0;
                StringBuilder strSql = new StringBuilder();
                foreach (OrderPostMetaModel obj in model)
                {
                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }

                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch { }
            return result;
        }
        public int ChangeOrderStatus(OrderPostStatusModel model, string ID)
        {
            try
            {
                string strsql = string.Format("update wp_wc_order_stats set status=@status where order_id  in ({0}); ", ID)
                    + string.Format("update wp_posts set post_status=@status,post_modified=@post_modified,post_modified_gmt=@post_modified_gmt where id  in ({0}); ", ID);
                MySqlParameter[] para =
                {
                    new MySqlParameter("@status", model.status),
                    new MySqlParameter("@post_modified", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                    new MySqlParameter("@post_modified_gmt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                if (result > 0 && model.status == "wc-processing")
                {
                    var orders = ID.Split(',');
                    for (int i = 0; i < orders.Length; i++)
                    {
                        try
                        {
                            OrderPostStatusModel o = new OrderPostStatusModel();
                            o.order_id = Convert.ToInt64(orders[i]);
                            SplitOrder(o);
                        }
                        catch { }
                    }
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetOrders(long OrderID)
        {
            DataTable dt = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@order_id", OrderID)
                };
                string strSQl = "select os.order_id,DATE_FORMAT(os.date_created,'%d/%m/%Y') date_created,os.customer_id,CONCAT(COALESCE(u.User_Login,''), ' [ ', COALESCE(u.user_email,''), ']') as customer_name,os.status,"
                            + " os.shipping_total,max(case meta_key when '_payment_method_title' then meta_value else '' end) payment_method,"
                            + " max(case meta_key when '_customer_ip_address' then meta_value else '' end) ip_address,max(case meta_key when '_created_via' then meta_value else '' end) created_via,"
                            + " max(case meta_key when '_billing_first_name' then meta_value else '' end) b_first_name,max(case meta_key when '_billing_last_name' then meta_value else '' end) b_last_name,"
                            + " max(case meta_key when '_billing_address_1' then meta_value else '' end) b_address_1,max(case meta_key when '_billing_address_2' then meta_value else '' end) b_address_2,"
                            + " max(case meta_key when '_billing_postcode' then meta_value else '' end) b_postcode,max(case meta_key when '_billing_city' then meta_value else '' end) b_city,"
                            + " max(case meta_key when '_billing_country' then meta_value else '' end) b_country,max(case meta_key when '_billing_state' then meta_value else '' end) b_state,"
                            + " max(case meta_key when '_billing_email' then meta_value else '' end) b_email,max(case meta_key when '_billing_phone' then meta_value else '' end) b_phone,"
                            + " max(case meta_key when '_shipping_first_name' then meta_value else '' end) s_first_name,max(case meta_key when '_shipping_last_name' then meta_value else '' end) s_last_name,"
                            + " max(case meta_key when '_shipping_address_1' then meta_value else '' end) s_address_1,max(case meta_key when '_shipping_address_2' then meta_value else '' end) s_address_2,"
                            + " max(case meta_key when '_shipping_postcode' then meta_value else '' end) s_postcode,max(case meta_key when '_shipping_city' then meta_value else '' end) s_city,"
                            + " max(case meta_key when '_shipping_country' then meta_value else '' end) s_country,max(case meta_key when '_shipping_state' then meta_value else '' end) s_state"
                            + " from wp_wc_order_stats os"
                            + " inner join wp_postmeta pm on pm.post_id = os.order_id"
                            + " left outer join wp_users u on u.id = os.customer_id"
                            + " where os.order_id = @order_id "
                            + " group by os.order_id,os.date_created,os.customer_id,u.User_Login,u.user_email,os.status";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static List<OrderProductsModel> GetOrderProductList(long OrderID)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                OrderProductsModel productsModel = new OrderProductsModel();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("order_id", OrderID)
                };
                string strSQl = "select oi.order_id,oi.order_item_name,oi.order_item_type,"
                            + " max(case meta_key when '_product_id' then meta_value else '' end) p_id,max(case meta_key when '_variation_id' then meta_value else '' end) v_id,"
                            + " max(case meta_key when '_qty' then meta_value else '' end) qty,max(case meta_key when '_line_subtotal' then meta_value else '' end) line_subtotal,"
                            + " max(case meta_key when '_line_total' then meta_value else '' end) line_total,max(case meta_key when '_line_tax' then meta_value else '' end) tax,"
                            + " max(case meta_key when 'discount_amount' then meta_value else '' end) discount_amount,max(case meta_key when 'cost' then meta_value else '' end) shipping_amount"
                            + " from wp_woocommerce_order_items oi"
                            + " inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id"
                            + " where oi.order_id = @order_id"
                            + " group by oi.order_id,oi.order_item_name,oi.order_item_type ";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    productsModel = new OrderProductsModel();
                    if (sdr["order_item_type"] != DBNull.Value)
                        productsModel.product_type = sdr["order_item_type"].ToString().Trim();
                    else
                        productsModel.product_type = "line_item";
                    if (sdr["order_item_name"] != DBNull.Value)
                        productsModel.product_name = sdr["order_item_name"].ToString();
                    else
                        productsModel.product_name = string.Empty;

                    if (productsModel.product_type == "line_item")
                    {
                        if (sdr["p_id"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["p_id"].ToString().Trim()))
                            productsModel.product_id = Convert.ToInt64(sdr["p_id"]);
                        else
                            productsModel.product_id = 0;
                        if (sdr["v_id"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["v_id"].ToString().Trim()))
                            productsModel.variation_id = Convert.ToInt64(sdr["v_id"]);
                        else
                            productsModel.variation_id = 0;

                        //if (sdr["price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["price"].ToString().Trim()))
                        //    productsModel.price = decimal.Parse(sdr["price"].ToString());
                        //else
                        //    productsModel.price = 0;
                        if (sdr["qty"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["qty"].ToString().Trim()))
                            productsModel.quantity = decimal.Parse(sdr["qty"].ToString().Trim());
                        else
                            productsModel.quantity = 0;
                        if (sdr["line_subtotal"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_subtotal"].ToString().Trim()))
                            productsModel.sale_price = decimal.Parse(sdr["line_subtotal"].ToString().Trim());
                        else
                            productsModel.sale_price = productsModel.price;
                        productsModel.reg_price = productsModel.sale_price;
                        productsModel.total = productsModel.sale_price;
                        productsModel.reg_price = productsModel.sale_price / productsModel.quantity;
                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        productsModel.discount = productsModel.discount <= productsModel.total ? productsModel.total - productsModel.discount : 0;

                        if (sdr["tax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["tax"].ToString().Trim()))
                            productsModel.tax_amount = decimal.Parse(sdr["tax"].ToString().Trim());
                        else
                            productsModel.tax_amount = productsModel.price;


                        ///// free item
                        //if (productsModel.product_id == 78676) { productsModel.is_free = true; productsModel.quantity = 2; }
                        //else if (productsModel.product_id == 632713) { productsModel.is_free = true; productsModel.quantity = 2; }
                        //else productsModel.is_free = false;

                        ///// 
                        //if (productsModel.product_id == 611172) productsModel.group_id = 78676;
                        //else if (productsModel.product_id == 118) productsModel.group_id = 632713;
                        //else productsModel.group_id = 0;
                    }
                    else if (productsModel.product_type == "coupon")
                    {
                        if (sdr["discount_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount_amount"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["discount_amount"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                    }
                    else if (productsModel.product_type == "fee")
                    {
                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    else if (productsModel.product_type == "shipping")
                    {
                        if (sdr["shipping_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["shipping_amount"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["shipping_amount"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static DataTable OrderCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;

                string strSql = "select sum(case when post_status != 'auto-draft' then 1 else 0 end) AllOrder,sum(case when post_author = 8 and post_status != 'auto-draft' then 1 else 0 end) Mine,"
                            + " sum(case when post_author != 8 and post_status = 'draft' then 1 else 0 end) Drafts,sum(case post_status when 'wc-pending' then 1 else 0 end) Pending,"
                            + " sum(case post_status when 'wc-processing' then 1 else 0 end) Processing,sum(case post_status when 'wc-on-hold' then 1 else 0 end) OnHold,"
                            + " sum(case post_status when 'wc-completed' then 1 else 0 end) Completed,sum(case post_status when 'wc-cancelled' then 1 else 0 end) Cancelled,"
                            + " sum(case post_status when 'wc-refunded' then 1 else 0 end) Refunded,sum(case post_status when 'wc-failed' then 1 else 0 end) Failed"
                            + " from wp_posts p where p.post_type = 'shop_order' ";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable OrderList(string sMonths, string CustomerID, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(userstatus))
                {
                    if (userstatus == "mine") { strWhr += " and p.post_author = 8 and p.post_status != 'auto-draft'"; }
                    else { strWhr += " and p.post_status = '" + userstatus + "'"; }
                }
                else
                    strWhr += " and p.post_status != 'auto-draft' ";

                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.id like '%" + searchid + "%' "
                            + " OR os.num_items_sold='%" + searchid + "%' "
                            + " OR os.total_sales='%" + searchid + "%' "
                            + " OR os.customer_id='%" + searchid + "%' "
                            + " OR p.post_status like '%" + searchid + "%' "
                            + " OR p.post_date like '%" + searchid + "%' "
                            + " OR COALESCE(pmf.meta_value, '') like '%" + searchid + "%' "
                            + " OR COALESCE(pml.meta_value, '') like '%" + searchid + "%' "
                            + " OR replace(replace(replace(replace(pmp.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
                            + " )";
                }

                if (!string.IsNullOrEmpty(sMonths))
                {
                    strWhr += " and DATE_FORMAT(p.post_date,'%Y%m') BETWEEN " + sMonths;
                }
                if (!string.IsNullOrEmpty(CustomerID))
                {
                    strWhr += " and os.customer_id= '" + CustomerID + "' ";
                }

                string strSql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
                            + " p.post_status status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,COALESCE(pmf.meta_value, '') FirstName,COALESCE(pml.meta_value, '') LastName,"
                            + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                            + " WHERE p.post_type = 'shop_order' " + strWhr
                            + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id "
                        + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                        + " WHERE p.post_type = 'shop_order' " + strWhr.ToString();
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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


        public static DataTable OrderListDashboard(string from_date, string to_date, string userstatus, string searchid, int pageno, int pagesize, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                fromdate = DateTime.Parse(from_date);
                todate = DateTime.Parse(to_date);
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.id like '%" + searchid + "%' "
                            + " OR os.num_items_sold='%" + searchid + "%' "
                            + " OR os.total_sales='%" + searchid + "%' "
                            + " OR os.customer_id='%" + searchid + "%' "
                            + " OR p.post_status like '%" + searchid + "%' "
                            + " OR p.post_date like '%" + searchid + "%' "
                            + " OR COALESCE(pmf.meta_value, '') like '%" + searchid + "%' "
                            + " OR COALESCE(pml.meta_value, '') like '%" + searchid + "%' "
                            + " OR replace(replace(replace(replace(pmp.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
                            + " )";
                }

                if (!string.IsNullOrEmpty(from_date))
                {
                    strWhr += " and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' ";
                }


                string strSql = "SELECT  p.id order_id, p.id as chkorder,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
                            + " REPLACE(p.post_status, 'wc-', '') status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,COALESCE(pml.meta_value, '') LastName,"
                            + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                            + " WHERE p.post_type = 'shop_order' " + strWhr.ToString()
                            + " limit 10 ";

                strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id "
                        + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                        + " WHERE p.post_type = 'shop_order' " + strWhr.ToString();
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                //if (ds.Tables[1].Rows.Count > 0)
                //    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable SearchCustomersOrders(string CustomerID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(CustomerID))
                {
                    strWhr += " and os.customer_id= '" + CustomerID + "' ";
                }

                string strSql = "SELECT po.ID, DATE_FORMAT(po.post_date, '%M %d %Y') post_date,po.post_status ,os.customer_id,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales,"
                            + " max(case when pm.meta_key = '_billing_first_name' then pm.meta_value else '' end) billing_first_name,max(case when pm.meta_key = '_billing_last_name' then pm.meta_value else '' end) billing_last_name,"
                            + " max(case when pm.meta_key = '_billing_address_1' then pm.meta_value else '' end) billing_address_1,max(case when pm.meta_key = '_billing_address_2' then pm.meta_value else '' end) billing_address_2,"
                            + " max(case when pm.meta_key = '_billing_city' then pm.meta_value else '' end) billing_city,max(case when pm.meta_key = '_billing_state' then pm.meta_value else '' end) billing_state,"
                            + " max(case when pm.meta_key = '_billing_postcode' then pm.meta_value else '' end) billing_postcode,max(case when pm.meta_key = '_billing_country' then pm.meta_value else '' end) billing_country,"
                            + " max(case when pm.meta_key = '_billing_email' then pm.meta_value else '' end) billing_email,max(case when pm.meta_key = '_billing_phone' then replace(replace(replace(replace(pm.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') else '' end) billing_phone,"
                            + " max(case when pm.meta_key = '_shipping_first_name' then pm.meta_value else '' end) shipping_first_name,max(case when pm.meta_key = '_shipping_last_name' then pm.meta_value else '' end) shipping_last_name,"
                            + " max(case when pm.meta_key = '_shipping_address_1' then pm.meta_value else '' end) shipping_address_1,max(case when pm.meta_key = 'shipping_address_2' then pm.meta_value else '' end) shipping_address_2,"
                            + " max(case when pm.meta_key = '_shipping_city' then pm.meta_value else '' end) shipping_city,max(case when pm.meta_key = '_shipping_state' then pm.meta_value else '' end) shipping_state,"
                            + " max(case when pm.meta_key = '_shipping_postcode' then pm.meta_value else '' end) shipping_postcode,max(case when pm.meta_key = '_shipping_country' then pm.meta_value else '' end) shipping_country"
                            + "   FROM wp_posts po inner join wp_wc_order_stats os on po.id = os.order_id"
                            + " LEFT OUTER JOIN wp_postmeta pm on pm.post_id = po.ID "
                            + " WHERE po.post_type = 'shop_order' " + strWhr
                            + " group by po.ID,po.post_date,po.post_status ,os.customer_id,os.total_sales order by ID desc limit 0, 1000";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        //Split Order on Status Change Processing
        public static int SplitOrder(OrderPostStatusModel model)
        {
            int result = 0;
            try
            {
                List<SplitOrderItemsModel> _list = new List<SplitOrderItemsModel>();
                _list.Add(new SplitOrderItemsModel { order_prefix = "-MTE", product_id = "118, 56774, 78676, 106923, 1595, 1610, 1619, 208417, 306817, 611172, 611220, 632713, 611172, 716434, 716425, 716418, 787847", variation_id = "684957" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-PSW", product_id = "124524", variation_id = "684958" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-KP", product_id = "14023", variation_id = "" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-W", product_id = "128244", variation_id = "" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-B", product_id = "31729", variation_id = "684960" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-F", product_id = "20861", variation_id = "684961" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-PB", product_id = "611252", variation_id = "684962" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-FMF", product_id = "727138,612940,727126", variation_id = "684959" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-AJ", product_id = "611286,612995,613207", variation_id = "684963" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-CPB", product_id = "733500", variation_id = "" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-PRO", product_id = "612955,612947,611268", variation_id = "" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-SMF", product_id = "611238", variation_id = "" });
                _list.Add(new SplitOrderItemsModel { order_prefix = "-COM", product_id = "772065,787909", variation_id = "" });

                DataTable dt = SQLHelper.ExecuteDataTable(string.Format("SELECT * FROM split_record WHERE main_order_id={0}; ", model.order_id));
                if (dt.Rows.Count == 0)
                {
                    DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                    string strSql = string.Format("INSERT INTO split_record (main_order_id) values({0});", model.order_id);
                    strSql += string.Format(" INSERT INTO split_meta (split_id,meta_key,meta_value) SELECT split_id,p.meta_key,p.meta_value FROM split_record sr INNER JOIN wp_postmeta p on p.post_id = sr.main_order_id where p.post_id = {0} and (p.meta_key like '_billing_%' or p.meta_key like '_shipping_%') order by p.meta_key; ", model.order_id);

                    foreach (SplitOrderItemsModel o in _list)
                    {
                        strSql += " INSERT INTO split_detail (split_id,order_name) SELECT distinct sr.split_id,CONCAT('#',oi.order_id,'" + o.order_prefix + "') order_id FROM split_record sr ";
                        strSql += " INNER JOIN wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item' INNER JOIN wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id";
                        strSql += " where oi.order_id = " + model.order_id + " group by sr.split_id, oi.order_id, oi.order_item_name, oi.order_item_type";
                        strSql += " having max(case meta_key when '_product_id' then meta_value else '' end) in (" + o.product_id + ") ";
                        if (!string.IsNullOrEmpty(o.variation_id))
                            strSql += " OR max(case meta_key when '_variation_id' then meta_value else '' end) in (" + o.variation_id + "); ";
                        else
                            strSql += " ; ";

                        strSql += " INSERT INTO split_detail_items (split_detail_id,product_id,variation_id,qty,meta_key,meta_value) select sd.split_detail_id,max(case meta_key when '_product_id' then meta_value else '' end) p_id,max(case meta_key when '_variation_id' then meta_value else '' end) v_id,max(case meta_key when '_qty' then meta_value else '' end) qty,'' meta_key,'' meta_value ";
                        strSql += " from split_detail sd inner join wp_woocommerce_order_items oi on CONCAT('#',oi.order_id,'" + o.order_prefix + "') = sd.order_name and oi.order_item_type = 'line_item' and oi.order_id = " + model.order_id;
                        strSql += " inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id group by oi.order_id, oi.order_item_name, oi.order_item_type ";
                        strSql += " having max(case meta_key when '_product_id' then meta_value else '' end) in (" + o.product_id + ") ";
                        if (!string.IsNullOrEmpty(o.variation_id))
                            strSql += " OR max(case meta_key when '_variation_id' then meta_value else '' end) in (" + o.variation_id + "); ";
                        else
                            strSql += " ; ";
                    }
                    result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                }
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
        //Get Shipping Order
        public static DataTable ProcessingOrders(DateTime from_date, DateTime to_date)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT p.ID,p.post_date,p.post_modified,sd.split_detail_id,sd.order_name,max(case meta_key when '_payment_method_title' then meta_value else '' end) pm_title, "
                        + " max(case meta_key when '_billing_first_name' then meta_value else '' end) b_fn,max(case meta_key when '_billing_last_name' then meta_value else '' end) b_ln, "
                        + " max(case meta_key when '_billing_company' then meta_value else 'company name' end) b_com,max(case meta_key when '_billing_email' then meta_value else '' end) b_email, "
                        + " max(case meta_key when '_billing_phone' then meta_value else '' end) b_phone, "
                        + " max(case meta_key when '_shipping_first_name' then meta_value else '' end) s_fn,max(case meta_key when '_shipping_last_name' then meta_value else '' end) s_ln, "
                        + " max(case meta_key when '_shipping_company' then meta_value else 'company name' end) s_com,max(case meta_key when '_shipping_address_1' then meta_value else '' end) s_add1, "
                        + " max(case meta_key when '_shipping_address_2' then meta_value else '' end) s_add2,max(case meta_key when '_shipping_city' then meta_value else '' end) s_city, "
                        + " max(case meta_key when '_shipping_state' then meta_value else '' end) s_state,max(case meta_key when '_shipping_postcode' then meta_value else '' end) s_postcode, "
                        + " max(case meta_key when '_shipping_country' then meta_value else '' end) s_country "
                        + " FROM wp_posts p inner join split_record sr on sr.main_order_id = p.ID inner join split_detail sd on sd.split_id = sr.split_id "
                        + " inner join wp_postmeta pm on pm.post_id = p.ID "
                        + " WHERE post_status = 'wc-processing' AND post_type = 'shop_order' "
                        + " AND DATE_FORMAT(p.post_modified_gmt,'%Y-%m-%d %h:%i:%s') BETWEEN DATE_FORMAT('" + from_date.ToString("yyyy-MM-dd hh:mm:ss") + "','%Y-%m-%d %h:%i:%s') AND DATE_FORMAT('" + to_date.ToString("yyyy-MM-dd hh:mm:ss") + "','%Y-%m-%d %h:%i:%s') "
                        + " group by p.ID,p.post_date,sr.split_id,sd.order_name";
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable ProcessingOrdersItemsDetails(string order_id, string split_detail_id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT sdi.product_id,sdi.variation_id,sdi.qty,pp.post_title,pvp.post_title variation_title,psku.meta_value sku,sdi.meta_key,sdi.meta_value,"
                                + "     (select max(case oim.meta_key when '_line_total' then oim.meta_value else '' end) from wp_woocommerce_order_items oi "
                                + "         inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id"
                                + "         where oi.order_item_type = 'line_item' and oi.order_id = " + order_id.ToString() + " group by oi.order_item_id"
                                + "         having max(case oim.meta_key when '_product_id' then oim.meta_value else '' end) = sdi.product_id"
                                + "             and max(case oim.meta_key when '_variation_id' then oim.meta_value else '' end) = sdi.variation_id) line_total"
                                + " FROM split_detail_items sdi"
                                + " inner join wp_posts pp on pp.ID = sdi.product_id AND pp.post_type = 'product'"
                                + " left outer join wp_posts pvp on pvp.ID = sdi.variation_id"
                                + " left outer join wp_postmeta psku on psku.post_id = pp.id and psku.meta_key = '_sku'"
                                + " where sdi.split_detail_id = " + split_detail_id.ToString();
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}