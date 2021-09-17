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
    using LaylaERP.UTILITIES;

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
                string strWhr = "select id,CONCAT(User_Login, ' (#',id,' - ', user_email, ')') as displayname,replace(replace(replace(replace(ump.meta_value, '-', ''), ' ', ''), '(', ''), ')', '')  billing_phone"
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
        //Add New Order With wp_postmeta and wp_wc_order_stats
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

        public static DataTable GetProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(COALESCE(ps.post_title,post.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as post_title"
                            + " , CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation' AND ps.post_status = 'publish'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " WHERE post.id not in (632713,78676) and post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(COALESCE(ps.post_title,post.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%' "
                            + " ORDER BY post.ID limit 50;";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetCategoryWiseProducts()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select wp_t.term_order,wp_t.term_id,wp_t.name,p.id pr_id,p.post_title as post_title,"
                                + " concat('[',group_concat(JSON_OBJECT('vr_id', ps.id, 'vr_title', ps.post_title, pm_rp.meta_key, pm_rp.meta_value, pm_sp.meta_key, pm_sp.meta_value)),']') variation_details"
                                + "        from wp_posts p"
                                + " inner join wp_term_relationships wp_tr on wp_tr.object_id = p.id"
                                + " inner join wp_term_taxonomy wp_ttn on wp_ttn.term_taxonomy_id = wp_tr.term_taxonomy_id and wp_ttn.taxonomy = 'product_cat'"
                                + " inner join wp_terms wp_t on wp_t.term_id = wp_ttn.term_id"
                                + " left outer join wp_termmeta wp_tm on wp_tm.term_id = wp_t.term_id and wp_tm.meta_key = 'is_active'"
                                + " left outer join wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation' and ps.post_status = 'publish'"
                                + " left outer join wp_postmeta pm_rp on pm_rp.post_id = ps.id and pm_rp.meta_key = '_regular_price'"
                                + " left outer join wp_postmeta pm_sp on pm_sp.post_id = ps.id and pm_sp.meta_key = '_price'"
                                + " where p.post_type = 'product' and p.post_status = 'publish' and coalesce(wp_tm.meta_value,'1') = 1"
                                + " group by wp_t.term_id,p.id order by wp_t.term_order,wp_t.term_id;";
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
                _list = GetProductListDetails(product_id, variation_id, "-", "-");
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderProductsModel> GetProductListDetails(long product_id, long variation_id, string countrycode, string statecode)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                OrderProductsModel productsModel = new OrderProductsModel();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@product_id", product_id),
                    new MySqlParameter("@variation_id", variation_id),
                    new MySqlParameter("@countrycode", countrycode),
                    new MySqlParameter("@statecode", statecode)
                };
                string strSQl = "SELECT post.id,ps.ID pr_id,CONCAT(COALESCE(ps.post_title,post.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),''))  as post_title,"
                            + " COALESCE(pr.meta_value, 0) reg_price,COALESCE(psr.meta_value, 0) sale_price,1 quantity,'false' is_free,scd.Shipping_price,scd.type Shipping_type,"
                            + " concat('{', group_concat(concat('\"', free_product_id, '\": \"', free_quantity, '\"') separator ','), '}') free_itmes FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = COALESCE(ps.id, post.id)and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = COALESCE(ps.id, post.id) and pr.meta_key = '_regular_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_price'"
                            + " left outer join wp_product_free free_it on free_it.product_id = post.id or free_it.product_id = ps.id"
                            + " left outer join Shipping_Product sp on sp.fk_productid = COALESCE(ps.id, post.id)"
                            + " left outer join ShippingClass_Details scd on scd.fk_ShippingID = sp.fk_shippingID and countrycode = @countrycode and statecode = @statecode"
                            + " WHERE post.post_type = 'product' and post.id = @product_id and COALESCE(ps.id,0) = @variation_id group by post.id,ps.ID"
                            + " union all"
                            + " SELECT(case when isnull(p.post_parent) = 0 then p.id else p.post_parent end) id,(case when isnull(p.post_parent)= 0 then 0 else p.id end) pr_id,CONCAT(p.post_title, COALESCE(CONCAT(' (', psku.meta_value, ')'), '')) as post_title,"
                            + " 0 reg_price,0 sale_price,free_quantity quantity,'true' is_free,0 Shipping_price,'qty' Shipping_type,'{}' free_itmes FROM wp_product_free free_it"
                            + " inner join wp_posts as p on p.id = free_it.free_product_id"
                            + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                            + " WHERE p.post_type in ('product', 'product_variation') and free_it.product_id = @product_id or free_it.product_id = @variation_id;";

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
                    if (sdr["quantity"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["quantity"].ToString().Trim()))
                        productsModel.quantity = decimal.Parse(sdr["quantity"].ToString().Trim());
                    else
                        productsModel.quantity = 1;
                    if (sdr["is_free"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["is_free"].ToString().Trim()))
                        productsModel.is_free = Convert.ToBoolean(sdr["is_free"].ToString().Trim());
                    else
                        productsModel.is_free = false;
                    if (sdr["free_itmes"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["free_itmes"].ToString().Trim()))
                        productsModel.free_itmes = sdr["free_itmes"].ToString().Trim();
                    else
                        productsModel.free_itmes = string.Empty;
                    productsModel.group_id = 0;
                    if (sdr["Shipping_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["Shipping_price"].ToString().Trim()))
                        productsModel.shipping_amount = decimal.Parse(sdr["Shipping_price"].ToString().Trim());
                    else
                        productsModel.shipping_amount = 0;

                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderShippingModel> GetProductShippingCharge(string variation_ids, string statecode)
        {
            List<OrderShippingModel> _list = new List<OrderShippingModel>();
            try
            {
                _list = GetProductShippingCharge(variation_ids, "US", statecode);
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderShippingModel> GetProductShippingCharge(string variation_ids, string countrycode, string statecode)
        {
            List<OrderShippingModel> _list = new List<OrderShippingModel>();
            try
            {
                DataTable DT = new DataTable();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@countrycode", countrycode),
                    new MySqlParameter("@statecode", statecode)
                };
                string strSQl = "select fk_productid,Shipping_price,fk_productid from Shipping_Product sp"
                            + " inner join ShippingClass_Details scd on scd.fk_ShippingID = sp.fk_shippingID and countrycode = @countrycode and statecode = @statecode"
                            + " where fk_productid in (" + variation_ids + ") ";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    OrderShippingModel productsModel = new OrderShippingModel();
                    if (sdr["fk_productid"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["fk_productid"]);
                    else
                        productsModel.product_id = 0;

                    if (sdr["Shipping_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["Shipping_price"].ToString().Trim()))
                        productsModel.AK = decimal.Parse(sdr["Shipping_price"].ToString());
                    else
                        productsModel.AK = 0;

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
        //Save/Update Order 
        public static int SaveOrder(OrderModel model)
        {
            int result = 0;
            try
            {
                string str_oiid = string.Join(",", model.OrderProducts.Where(f => f.quantity > 0).Select(x => x.order_item_id.ToString()).ToArray()) + "," + string.Join(",", model.OrderOtherItems.Select(x => x.order_item_id.ToString()).ToArray()) + "," + string.Join(",", model.OrderTaxItems.Select(x => x.order_item_id.ToString()).ToArray());
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                /// step 1 : wp_wc_order_stats
                StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',status='{5}',customer_id='{6}' where order_id='{7}';", model.OrderPostStatus.num_items_sold, model.OrderPostStatus.total_sales,
                        model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.status, model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0} and order_item_id not in ({1}));", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" delete from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));

                /// step 2 : wp_postmeta 
                foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                {
                    strSql.Append(string.Format(" update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", obj.meta_value, obj.post_id, obj.meta_key));
                }

                /// step 3 : wp_woocommerce_order_items
                foreach (OrderProductsModel obj in model.OrderProducts)
                {
                    if (obj.order_item_id > 0)
                    {
                        strSql.Append(string.Format(" update wp_wc_order_product_lookup set product_qty='{0}',product_net_revenue='{1}',product_gross_revenue='{2}',coupon_amount='{3}',tax_amount='{4}',shipping_amount='{5}',shipping_tax_amount='{6}' where order_item_id='{7}';",
                            obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key in ('_qty','_reduced_stock');", obj.quantity, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='_line_subtotal';", obj.total, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key in ('_line_subtotal_tax','_line_tax');", obj.tax_amount, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='_line_total';", (obj.total - obj.discount), obj.order_item_id));
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.product_name, "line_item", model.OrderPostStatus.order_id));

                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount)");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}';", model.OrderPostStatus.order_id, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                    }

                    // str_Stock+= string.Format("select 'SO',{0},{1},13 warehouse_id,{2},{3},'I'", model.OrderPostStatus.order_id, obj.variation_id > 0 ? obj.variation_id : obj.product_id, model.OrderPostStatus.date_created.ToString("MMMM dd, yyyy @ HH:mm tt"), obj.quantity);
                }
                /// step 4 : wp_woocommerce_order_itemmeta
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue + coupon_amount from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'size','' from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));

                /// step 5 : wp_woocommerce_order_items
                foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                {
                    if (obj.order_item_id > 0)
                    {
                        if (obj.item_type == "coupon")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "discount_amount"));
                        }
                        else if (obj.item_type == "fee")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "_line_total"));
                        }
                        else if (obj.item_type == "shipping")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "cost"));
                        }
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.item_name, obj.item_type, model.OrderPostStatus.order_id));
                        if (obj.item_type == "coupon")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type, obj.item_name));
                        }
                        else if (obj.item_type == "fee" && obj.amount != 0)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", "taxable", model.OrderPostStatus.order_id, obj.item_type));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type));
                        }
                        else if (obj.item_type == "shipping")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type));
                        }
                    }
                }
                /// step 6 : wp_posts (Coupon used by)
                strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));

                /// step 7 : wp_woocommerce_order_items (Tax)
                //str_oiid = string.Join(",", model.OrderTaxItems.Select(x => x.order_item_id.ToString()).ToArray());
                //strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0} and order_item_type in ('tax') and order_item_id not in ({1}));", model.OrderPostStatus.order_id, str_oiid));
                //strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0} and order_item_type in ('tax') and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));
                foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                {
                    if (obj.order_item_id > 0)
                    {
                        strSql.Append(string.Format(" update wp_woocommerce_order_items set order_item_name='{0}-{1}-{2} TAX-1' where order_item_id={3}; ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_rate_state, obj.order_item_id, "label"));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "tax_amount"));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_rate, obj.order_item_id, "rate_percent"));
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}-{1}-{2} TAX-1','tax','{3}'); ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, model.OrderPostStatus.order_id));

                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.tax_rate_state, model.OrderPostStatus.order_id, "tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.amount, model.OrderPostStatus.order_id, "tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}';", obj.tax_rate, model.OrderPostStatus.order_id, "tax"));
                    }
                }

                /// step 8 : wp_posts
                strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}',post_excerpt = '{3}' where id = {4}; ", model.OrderPostStatus.status, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"), model.OrderPostStatus.Search, model.OrderPostStatus.order_id));

                ///step 9 : Reduce Stock
                strSql.Append("delete from product_stock_register where tran_type ='SO' and tran_id = " + model.OrderPostStatus.order_id + ";");
                strSql.Append("insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)");
                strSql.Append("select 'SO', opl.order_id, (case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) fk_product,");
                strSql.Append("(select wp_w.rowid from wp_warehouse wp_w where wp_w.is_system = 1 limit 1) warehouse_id,p.post_date,opl.product_qty,'I'");
                strSql.Append("from wp_wc_order_product_lookup opl inner join wp_posts p on p.id = opl.order_id where p.id = " + model.OrderPostStatus.order_id + ";");

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
        public static long AddOrderFee(OrderOtherItemsModel obj)
        {
            long result = 0;
            try
            {
                string strSQL = string.Empty;
                if (obj.order_item_id > 0)
                {
                    strSQL = string.Format("update wp_woocommerce_order_items set order_item_name ='{0}' where order_item_id={1};update wp_woocommerce_order_itemmeta set meta_value='{2}' where order_item_id={3} and meta_key in ('_fee_amount','_line_total'); ", obj.item_name, obj.order_item_id, obj.amount, obj.order_item_id);
                    if (SQLHelper.ExecuteNonQuery(strSQL) > 0)
                        result = obj.order_item_id;
                }
                else
                {
                    MySqlParameter[] parameters =
                {
                    new MySqlParameter("@order_item_name", obj.item_name),
                    new MySqlParameter("@order_item_type", obj.item_type),
                    new MySqlParameter("@order_id", obj.order_id)
                };
                    strSQL = "INSERT INTO wp_woocommerce_order_items(order_item_name,order_item_type,order_id) SELECT @order_item_name,@order_item_type,@order_id; SELECT LAST_INSERT_ID();";
                    result = Convert.ToInt64(SQLHelper.ExecuteScalar(strSQL, parameters));
                    if (result > 0)
                    {
                        strSQL = string.Format("insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) values ('{0}','_fee_amount',{1}),('{2}','_tax_class',''),('{3}','tax_status','taxable'),('{4}','_line_total',{5}),('{6}','_line_tax','0') ", result, obj.amount, result, result, result, obj.amount, result);
                        SQLHelper.ExecuteNonQuery(strSQL);
                    }
                }
            }
            catch { }
            return result;
        }
        public static int RemoveOrderFee(OrderOtherItemsModel obj)
        {
            int result = 0;
            try
            {
                string strSQL = string.Format("delete from wp_woocommerce_order_itemmeta where order_item_id={1};delete from wp_woocommerce_order_items where order_item_id={1};", obj.order_item_id, obj.order_item_id);
                result = SQLHelper.ExecuteNonQuery(strSQL);
            }
            catch { }
            return result;
        }
        public static int UpdatePodiumStatus(OrderPostMetaModel model)
        {
            int result = 0;
            try
            {
                DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                StringBuilder strSql = new StringBuilder(string.Format("delete from wp_postmeta where post_id = {0} and meta_key = 'taskuidforsms'; ", model.post_id));
                strSql.Append(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value) values ('{0}','{1}','{2}');", model.post_id, "taskuidforsms", model.meta_value));
                strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", "podium", model.post_id, "_payment_method"));
                strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", "Podium Order", model.post_id, "_payment_method_title"));
                strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1};", "wc-processing", model.post_id));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch { }
            return result;
        }
        //Refund Order
        public static long AddRefundOrderPost(long parent_id)
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
                model.post_title = "Refund &ndash; " + model.post_date_gmt.ToString("MMMM dd, yyyy @ HH:mm tt");
                model.post_excerpt = string.Empty;
                model.post_status = "wc-completed";// "draft";
                model.comment_status = "closed";
                model.ping_status = "closed";
                model.post_password = string.Empty;
                model.post_name = "refund-" + model.post_date_gmt.ToString("MMM-dd-yyyy-HHmm-tt").ToLower();
                model.to_ping = string.Empty;
                model.pinged = string.Empty;
                model.post_modified = model.post_date;
                model.post_modified_gmt = model.post_date_gmt;
                model.post_content_filtered = string.Empty;
                model.post_parent = parent_id.ToString();
                model.post_type = "shop_order_refund";
                //model.guid = string.Format("{0}?{1}={2}", Net.Host, model.post_type, model.post_name);
                model.guid = string.Format("{0}?{1}={2}", "http://173.247.242.204/~rpsisr/woo/", "post_type=shop_order_refund&p", "");
                model.menu_order = "0";
                model.post_mime_type = string.Empty;
                model.comment_count = "0";

                string strSQL = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,"
                                    + " to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)"
                                    + " VALUES(@post_author,@post_date,@post_date_gmt,@post_content,@post_title,@post_excerpt,@post_status,@comment_status,@ping_status,@post_password,@post_name,"
                                    + " @to_ping,@pinged,@post_modified,@post_modified_gmt,@post_content_filtered,@post_parent,@guid,@menu_order,@post_type,@post_mime_type,@comment_count)";

                strSQL += "; insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id)";
                strSQL += " SELECT LAST_INSERT_ID(),@post_parent,@post_date,@post_date_gmt,'0','0','0','0','0','0',@post_status,'0' ; SELECT LAST_INSERT_ID();";
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
        public static int SaveRefundOrder(OrderModel model)
        {
            int result = 0;
            try
            {
                long n_orderid = 0;
                n_orderid = AddRefundOrderPost(model.OrderPostStatus.order_id);
                if (n_orderid > 0)
                {
                    DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                    /// step 1 : wp_wc_order_stats
                    StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',customer_id='{5}' where order_id='{6}';", model.OrderPostStatus.num_items_sold, model.OrderPostStatus.total_sales,
                            model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.customer_id, n_orderid));
                    var i = 0;
                    /// step 2 : wp_postmeta 
                    strSql.Append("insert into wp_postmeta (post_id,meta_key,meta_value) values");
                    foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                    {
                        if (++i == model.OrderPostMeta.Count)
                            strSql.Append(string.Format("('{0}','{1}','{2}'); ", n_orderid, obj.meta_key, obj.meta_value));
                        else
                            strSql.Append(string.Format("('{0}','{1}','{2}'), ", n_orderid, obj.meta_key, obj.meta_value));
                    }
                    /// step 3 : wp_woocommerce_order_items
                    foreach (OrderProductsModel obj in model.OrderProducts)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.product_name, "line_item", n_orderid));
                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount,refunded_item_id) ");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','-{5}','-{6}','-{7}','{8}','-{9}','{10}','{11}','{12}'; ", n_orderid, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), 0, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount, obj.order_item_id));
                    }
                    /// step 4 : wp_woocommerce_order_itemmeta
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_refunded_item_id',refunded_item_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id = {0};", n_orderid));
                    /// step 5 : wp_woocommerce_order_items
                    foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                    {
                        if (obj.amount != 0)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.item_name, obj.item_type, n_orderid));
                            if (obj.item_type == "fee")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'tax_status','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}'", "taxable", n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_line_total','-{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}'", obj.amount, n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}';", obj.order_item_id, n_orderid, obj.item_type));
                            }
                            else if (obj.item_type == "shipping")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'cost','-{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.amount, n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.order_item_id, n_orderid, obj.item_type));
                            }
                        }
                    }
                    /// step 6 : wp_woocommerce_order_items (Tax)
                    foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('','tax','{0}');", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.tax_rate_state, n_orderid));
                        strSql.Append(string.Format(" union all select order_item_id,'tax_amount','-{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.amount, n_orderid));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.tax_rate, n_orderid));
                        strSql.Append(string.Format(" union all select order_item_id,'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax';", obj.order_item_id, n_orderid));
                    }

                    result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                }
            }
            catch { }
            return result;
        }

        public static long AddShopOrderEdit(long parent_id)
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
                model.post_title = "Order Updated &ndash; " + model.post_date_gmt.ToString("MMMM dd, yyyy @ HH:mm tt");
                model.post_excerpt = string.Empty;
                model.post_status = "auto-draft";// "draft";
                model.comment_status = "open";
                model.ping_status = "closed";
                model.post_password = string.Empty;
                model.post_name = "updated-" + model.post_date_gmt.ToString("MMM-dd-yyyy-HHmm-tt").ToLower();
                model.to_ping = string.Empty;
                model.pinged = string.Empty;
                model.post_modified = model.post_date;
                model.post_modified_gmt = model.post_date_gmt;
                model.post_content_filtered = string.Empty;
                model.post_parent = parent_id.ToString();
                model.post_type = "shop_order_updated";
                model.guid = string.Format("{0}?{1}={2}", Net.Host, model.post_type, model.post_name);
                model.menu_order = "0";

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
        public static int UpdateOrder(OrderModel model)
        {
            int result = 0;
            try
            {
                string str_oiid = string.Join(",", model.OrderProducts.Select(x => x.order_item_id.ToString()).ToArray());
                DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                /// step 1 : wp_wc_order_stats
                StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',status='{5}',customer_id='{6}' where order_id='{7}';", model.OrderPostStatus.num_items_sold, model.OrderPostStatus.total_sales,
                        model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.status, model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0} and order_item_type='line_item');", model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" delete from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0} and order_item_type='line_item' and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));

                /// step 2 : wp_postmeta 
                foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                {
                    strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", obj.meta_value, obj.post_id, obj.meta_key));
                }

                /// step 3 : wp_woocommerce_order_items
                foreach (OrderProductsModel obj in model.OrderProducts)
                {
                    if (obj.order_item_id > 0)
                    {
                        strSql.Append(string.Format("update wp_wc_order_product_lookup set product_qty='{0}',product_net_revenue='{1}',product_gross_revenue='{2}',coupon_amount='{3}',tax_amount='{4}',shipping_amount='{5}',shipping_tax_amount='{6}' where order_item_id='{7}';",
                            obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount, obj.order_item_id));
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.product_name, "line_item", model.OrderPostStatus.order_id));

                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount)");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}';", model.OrderPostStatus.order_id, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                    }
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

                /// step 5 : wp_woocommerce_order_items
                foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                {
                    if (obj.order_item_id > 0)
                    {
                        if (obj.item_type == "coupon")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "discount_amount"));
                        }
                        else if (obj.item_type == "fee")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "_line_total"));
                        }
                        else if (obj.item_type == "shipping")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "cost"));
                        }
                    }
                    else
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
                }
                /// step 6 : wp_posts (Coupon used by)
                strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));

                /// step 7 : wp_woocommerce_order_items (Tax)
                foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                {
                    if (obj.order_item_id > 0)
                    {
                        strSql.Append(string.Format(" update wp_woocommerce_order_items set order_item_name='{0}-{1}-{2} TAX-1' where order_item_id={3}; ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_rate_state, obj.order_item_id, "label"));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "tax_amount"));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_rate, obj.order_item_id, "rate_percent"));
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}-{1}-{2} TAX-1','tax','{3}'); ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, model.OrderPostStatus.order_id));

                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_rate_state, model.OrderPostStatus.order_id, "tax"));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, "tax"));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_rate, model.OrderPostStatus.order_id, "tax"));
                    }
                }
                /// step 8 : wp_posts
                strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}',post_excerpt = '{3}' where id = {4} ", model.OrderPostStatus.status, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"), model.OrderPostStatus.Search, model.OrderPostStatus.order_id));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
        public static int UpdateOrder_old(OrderModel model)
        {
            int result = 0;
            try
            {
                long n_orderid = 0;
                if (model.OrderPostStatus.status == "wc-processing" || model.OrderPostStatus.status == "wc-on-hold" || model.OrderPostStatus.status == "wc-completed")
                {
                    n_orderid = AddShopOrderEdit(model.OrderPostStatus.order_id);
                    if (n_orderid > 0)
                    {
                        DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                        var i = 0;
                        /// step 1 : wp_postmeta 
                        StringBuilder strSql = new StringBuilder("insert into wp_postmeta (post_id,meta_key,meta_value) values");
                        foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                        {
                            if (++i == model.OrderPostMeta.Count)
                                strSql.Append(string.Format("('{0}','{1}','{2}') ", n_orderid, obj.meta_key, obj.meta_value));
                            else
                                strSql.Append(string.Format("('{0}','{1}','{2}'), ", n_orderid, obj.meta_key, obj.meta_value));
                        }

                        /// step 2 : wp_wc_order_stats
                        strSql.Append("; insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id) value");
                        strSql.Append(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}') ;", n_orderid, model.OrderPostStatus.order_id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), model.OrderPostStatus.num_items_sold,
                                            model.OrderPostStatus.total_sales, model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.returning_customer, model.OrderPostStatus.status, model.OrderPostStatus.customer_id));

                        /// step 3 : wp_woocommerce_order_items
                        foreach (OrderProductsModel obj in model.OrderProducts)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.product_name, "line_item", model.OrderPostStatus.order_id));

                            strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount) ");
                            strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}'; ", n_orderid, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                    cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                        }

                        /// step 4 : wp_woocommerce_order_itemmeta
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_subtotal',product_net_revenue + coupon_amount from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'size','' from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id = {0}; ", n_orderid));

                        /// step 5 : wp_woocommerce_order_items
                        foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.item_name, obj.item_type, n_orderid));
                            if (obj.item_type == "coupon")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", obj.amount, n_orderid, obj.item_type, obj.item_name));
                            }
                            else if (obj.item_type == "fee")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", "taxable", n_orderid, obj.item_type));
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, n_orderid, obj.item_type));
                            }
                            else if (obj.item_type == "shipping")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, n_orderid, obj.item_type));
                            }
                        }
                        /// step 6 : wp_posts (Coupon used by)
                        strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", model.OrderPostStatus.customer_id, n_orderid));

                        /// step 7 : wp_woocommerce_order_items (Tax)
                        foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}-{1}-{2} TAX-1','tax','{3}'); ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, model.OrderPostStatus.order_id));

                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_rate_state, n_orderid, "tax"));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, n_orderid, "tax"));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_rate, n_orderid, "tax"));
                        }
                        /// step 8 : wp_posts
                        strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}' where id = {3} ", model.OrderPostStatus.status, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"), n_orderid));
                        result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                    }
                }
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }

        public static int UpdatePayPalStatus(List<OrderPostMetaModel> model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (OrderPostMetaModel obj in model)
                {
                    strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                }
                strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model[0].post_id.ToString() + ");";
                strSql.Append(strSql_insert);
                strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1};", "wc-processing", model[0].post_id));

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }
        public static int UpdatePaymentStatus(OrderPostMetaModel model)
        {
            int result = 0;
            try
            {
                string strSql_insert = string.Empty;
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value) SELECT * FROM (SELECT {0},'{1}','{2}') AS tmp WHERE NOT EXISTS (SELECT meta_key FROM wp_postmeta WHERE post_id = {3} and meta_key = '{4}');", model.post_id, model.meta_key, model.meta_value, model.post_id, model.meta_key));
                strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", model.meta_value, model.post_id, model.meta_key));

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                if (model.meta_value.ToUpper() == "COMPLETED") PurchaseOrderRepository.CreateOrders(model.post_id);
            }
            catch (Exception ex) { throw ex; }
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
                //if (result > 0 && model.status == "wc-processing")
                //{
                //    var orders = ID.Split(',');
                //    for (int i = 0; i < orders.Length; i++)
                //    {
                //        try
                //        {
                //            OrderPostStatusModel o = new OrderPostStatusModel();
                //            o.order_id = Convert.ToInt64(orders[i]);
                //            SplitOrder(o);
                //        }
                //        catch { }
                //    }
                //}
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        //Get Order info
        public static DataTable GetOrders(long OrderID)
        {
            DataTable dt = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@order_id", OrderID)
                };
                string strSQl = "select os.id order_id,DATE_FORMAT(os.post_date,'%m/%d/%Y') date_created,max(case meta_key when '_customer_user' then meta_value else '' end) customer_id,max(CONCAT(COALESCE(u.User_Login,''), ' (', COALESCE(u.user_email,''), ')')) as customer_name,os.post_status status,"
                            + " os.post_excerpt,0 shipping_total,max(case meta_key when '_payment_method' then meta_value else '' end) payment_method,max(case meta_key when '_payment_method_title' then meta_value else '' end) payment_method_title,"
                            + " max(case meta_key when '_customer_ip_address' then meta_value else '' end) ip_address,max(case meta_key when '_created_via' then meta_value else '' end) created_via,"
                            + " max(case meta_key when '_billing_first_name' then meta_value else '' end) b_first_name,max(case meta_key when '_billing_last_name' then meta_value else '' end) b_last_name,"
                            + " max(case meta_key when '_billing_company' then meta_value else '' end) b_company,max(case meta_key when '_billing_address_1' then meta_value else '' end) b_address_1,max(case meta_key when '_billing_address_2' then meta_value else '' end) b_address_2,"
                            + " max(case meta_key when '_billing_postcode' then meta_value else '' end) b_postcode,max(case meta_key when '_billing_city' then meta_value else '' end) b_city,"
                            + " max(case meta_key when '_billing_country' then meta_value else '' end) b_country,max(case meta_key when '_billing_state' then meta_value else '' end) b_state,"
                            + " max(case meta_key when '_billing_email' then meta_value else '' end) b_email,max(case meta_key when '_billing_phone' then meta_value else '' end) b_phone,"
                            + " max(case meta_key when '_shipping_first_name' then meta_value else '' end) s_first_name,max(case meta_key when '_shipping_last_name' then meta_value else '' end) s_last_name,"
                            + " max(case meta_key when '_shipping_company' then meta_value else '' end) s_company,max(case meta_key when '_shipping_address_1' then meta_value else '' end) s_address_1,max(case meta_key when '_shipping_address_2' then meta_value else '' end) s_address_2,"
                            + " max(case meta_key when '_shipping_postcode' then meta_value else '' end) s_postcode,max(case meta_key when '_shipping_city' then meta_value else '' end) s_city,"
                            + " max(case meta_key when '_shipping_country' then meta_value else '' end) s_country,max(case meta_key when '_shipping_state' then meta_value else '' end) s_state,"
                            + " max(case meta_key when '_paypal_id' then meta_value else '' end) paypal_id,(SELECT count(split_id) FROM split_record WHERE main_order_id=os.id) is_shiped"
                            + " from wp_posts os inner join wp_postmeta pm on pm.post_id = os.id"
                            + " left outer join wp_users u on u.id = meta_value and meta_key='_customer_user'"
                            + " where os.id = @order_id "
                            + " group by os.id,os.post_date,os.post_status,os.post_excerpt";
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
                string strSQl = "select oi.order_id,oi.order_item_id,oi.order_item_name,oi.order_item_type,max(case meta_key when '_product_id' then meta_value else '' end) p_id,max(case meta_key when '_variation_id' then meta_value else '' end) v_id,"
                            + " max(case meta_key when '_qty' then meta_value else '' end) qty,max(case meta_key when '_line_subtotal' then meta_value else '' end) line_subtotal,"
                            + " max(case meta_key when '_line_total' then meta_value else '' end) line_total,max(case meta_key when '_line_tax' then meta_value else '' end) tax,"
                            + " max(case meta_key when 'discount_amount' then meta_value else '' end) discount_amount,max(case meta_key when 'cost' then meta_value else '' end) shipping_amount,"
                            + " (select COALESCE(psr.meta_value, 0) sale_price from wp_postmeta psr where psr.meta_key = '_price' "
                            + "         and psr.post_id = (case when max(case oim.meta_key when '_variation_id' then oim.meta_value else '' end) != '0' then max(case oim.meta_key when '_variation_id' then oim.meta_value else '' end)"
                            + "             else max(case oim.meta_key when '_product_id' then oim.meta_value else '' end) end)) sale_price,"
                            + " (select concat('{',group_concat(concat('\"',free_product_id,'\": \"',free_quantity,'\"') separator ','),'}') from wp_product_free free_it"
                            + " where free_it.product_id = max(case oim.meta_key when '_product_id' then oim.meta_value else '0' end) or free_it.product_id = max(case oim.meta_key when '_variation_id' then oim.meta_value else '0' end)) as meta_data"
                            + " from wp_woocommerce_order_items oi inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id"
                            + " where oi.order_id = @order_id and oi.order_item_type!='coupon' group by oi.order_id,oi.order_item_id,oi.order_item_name,oi.order_item_type "
                            + " union all "
                            + " Select oi.order_id,oi.order_item_id,oi.order_item_name,oi.order_item_type,0 p_id,0 v_id,0 qty,0 line_subtotal,0 line_total,0 tax,oim.meta_value discount_amount,0 shipping_amount,0 sale_price,concat('{', group_concat(concat('\"', pm.meta_key, '\": \"', pm.meta_value, '\"') separator ','), '}') as meta_data"
                            + " from wp_woocommerce_order_items oi inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id and oim.meta_key = 'discount_amount'"
                            + " left outer join wp_posts p on lower(p.post_title) = lower(oi.order_item_name) and p.post_type = 'shop_coupon'"
                            + " left outer join wp_postmeta pm on pm.post_id = p.id and pm.meta_key in ('coupon_amount','discount_type', 'product_ids', 'exclude_product_ids')"
                            + " where oi.order_id = @order_id and oi.order_item_type = 'coupon' group by oi.order_id,oi.order_item_id,oi.order_item_name,oi.order_item_type,oim.meta_value"
                            + " union all "
                            + " select p.post_parent order_id,p_oim.meta_value order_item_id,oi.order_item_type order_item_name,'refund_items' order_item_type,0 p_id,0 v_id,"
                            + " sum(case oim.meta_key when '_qty' then oim.meta_value else '' end) qty,0 line_subtotal,sum(case oim.meta_key when '_line_total' then oim.meta_value else '' end) line_total,"
                            + " sum(case oim.meta_key when '_line_tax' then oim.meta_value when 'tax_amount' then oim.meta_value else '' end) tax,0 discount_amount,sum(case oim.meta_key when 'cost' then oim.meta_value else '' end) shipping_amount,0 sale_price,'{}' as meta_data"
                            + " from wp_posts p left outer join wp_woocommerce_order_items oi on oi.order_id = p.id"
                            + " left outer join wp_woocommerce_order_itemmeta p_oim on p_oim.order_item_id = oi.order_item_id and p_oim.meta_key = '_refunded_item_id'"
                            + " left outer join wp_woocommerce_order_itemmeta oim on oim.order_item_id = p_oim.order_item_id and oim.meta_key in ('_qty', '_line_total', '_line_tax', 'tax_amount', 'cost')"
                            + " where p.post_parent = @order_id group by p.post_parent,oi.order_item_type,p_oim.meta_key,p_oim.meta_value"
                            + " union all "
                            + " select p.id order_id,p.id order_item_id,concat('Refund #',p.id,' - ',DATE_FORMAT(p.post_date,'%b %e, %Y, %h:%i'),' by ',ur.user_nicename,'</br>',"
                            + " coalesce(group_concat(concat(oi.order_item_name, ' x ', oim.meta_value) ORDER BY oi.order_item_name separator '</br>'),'')) order_item_name,'refund' order_item_type,"
                            + " 0 p_id,0 v_id,0 qty,pm.meta_value line_subtotal, pm.meta_value line_total,0 tax,0 discount_amount,0 shipping_amount,0 sale_price,'{}' as meta_data"
                            + " from wp_posts p inner join wp_postmeta pm on pm.post_id = p.id and pm.meta_key = '_order_total'"
                            + " inner join wp_postmeta pmur on pmur.post_id = p.id and pmur.meta_key = '_refunded_by' inner join wp_users ur on ur.id = pmur.meta_value"
                            + " left outer join wp_woocommerce_order_items oi on oi.order_id = p.id and oi.order_item_type = 'line_item'"
                            + " left outer join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id and oim.meta_key = '_qty'"
                            + " where p.post_parent = @order_id group by p.id,p.post_date,ur.user_nicename,pm.meta_value order by order_id desc";
                MySqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    productsModel = new OrderProductsModel();
                    if (sdr["order_item_id"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["order_item_id"].ToString().Trim()))
                        productsModel.order_item_id = Convert.ToInt64(sdr["order_item_id"]);
                    else
                        productsModel.order_item_id = 0;
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

                        if (sdr["line_subtotal"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_subtotal"].ToString().Trim()))
                            productsModel.price = decimal.Parse(sdr["line_subtotal"].ToString());
                        else
                            productsModel.price = 0;
                        if (sdr["qty"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["qty"].ToString().Trim()))
                            productsModel.quantity = decimal.Parse(sdr["qty"].ToString().Trim());
                        else
                            productsModel.quantity = 0;
                        if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                            productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                        else
                            productsModel.sale_price = 0;
                        if (productsModel.quantity > 0)
                            productsModel.reg_price = productsModel.price / productsModel.quantity;
                        else
                            productsModel.reg_price = 0;
                        productsModel.total = productsModel.price;

                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        productsModel.discount = productsModel.discount <= productsModel.total ? productsModel.total - productsModel.discount : 0;
                        if (sdr["tax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["tax"].ToString().Trim()))
                            productsModel.tax_amount = decimal.Parse(sdr["tax"].ToString().Trim());
                        else
                            productsModel.tax_amount = productsModel.price;

                        productsModel.is_free = productsModel.total > 0 ? false : true; productsModel.group_id = 0;
                        if (sdr["meta_data"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["meta_data"].ToString().Trim()))
                            productsModel.free_itmes = sdr["meta_data"].ToString().Trim();
                        else
                            productsModel.free_itmes = "{}";

                        ///// free item
                        //if (productsModel.product_id == 78676) { productsModel.is_free = true; }
                        //else if (productsModel.product_id == 632713) { productsModel.is_free = true; }
                        //else productsModel.is_free = false;

                        /// 
                        //if (productsModel.product_id == 611172)
                        //{
                        //    productsModel.group_id = 78676;
                        //    productsModel.free_itmes = "{\"78676\":2}";
                        //}
                        //else if (productsModel.product_id == 118)
                        //{
                        //    productsModel.group_id = 632713;
                        //    productsModel.free_itmes = "{\"632713\":2}";
                        //}
                        //else
                        //{
                        //    productsModel.group_id = 0;
                        //    productsModel.free_itmes = string.Empty;
                        //}
                    }
                    else if (productsModel.product_type == "coupon")
                    {
                        if (sdr["discount_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount_amount"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["discount_amount"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        if (sdr["meta_data"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["meta_data"].ToString().Trim()))
                            productsModel.meta_data = sdr["meta_data"].ToString().Trim();
                        else
                            productsModel.meta_data = "{}";
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
                    else if (productsModel.product_type == "refund")
                    {
                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    else if (productsModel.product_type == "refund_items")
                    {
                        productsModel.product_id = 0;
                        productsModel.variation_id = 0;
                        if (sdr["qty"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["qty"].ToString().Trim()))
                            productsModel.quantity = decimal.Parse(sdr["qty"].ToString().Trim());
                        else
                            productsModel.quantity = 0;

                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString());
                        else
                            productsModel.total = 0;
                        if (sdr["tax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["tax"].ToString().Trim()))
                            productsModel.tax_amount = decimal.Parse(sdr["tax"].ToString().Trim());
                        else
                            productsModel.tax_amount = 0;
                        if (sdr["discount_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount_amount"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["discount_amount"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        productsModel.discount = productsModel.discount <= productsModel.total ? productsModel.total - productsModel.discount : 0;
                        if (sdr["shipping_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["shipping_amount"].ToString().Trim()))
                            productsModel.shipping_amount = decimal.Parse(sdr["shipping_amount"].ToString().Trim());
                        else
                            productsModel.shipping_amount = 0;
                    }
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        //Order comments/notes
        public static DataTable GetOrderNotes(long OrderID)
        {
            DataTable DT = new DataTable();
            try
            {
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("order_id", OrderID)
                };
                string strSQl = "select wp_c.comment_ID,DATE_FORMAT(wp_c.comment_date, '%M %d, %Y at %H:%i') comment_date,wp_c.comment_content,wp_cm.meta_value is_customer_note from wp_comments wp_c"
                            + " left outer join wp_commentmeta wp_cm on wp_cm.comment_id = wp_c.comment_ID and wp_cm.meta_key = 'is_customer_note'"
                            + " where comment_type = 'order_note' and comment_approved = '1' and comment_post_ID = @order_id order by wp_c.comment_ID desc;";
                DT = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static int AddOrderNotes(OrderNotesModel obj)
        {
            int result = 0;
            try
            {
                obj.comment_date = DateTime.UtcNow.AddMinutes(-420);
                obj.comment_date_gmt = DateTime.UtcNow;

                string strSQL = "INSERT INTO wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP,comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved,comment_agent, comment_type,comment_parent,user_id)"
                            + " VALUES(@comment_post_ID,@comment_author,@comment_author_email,'','',@comment_date,@comment_date_gmt,@comment_content,'0','1','WooCommerce','order_note','0','0');";
                if (obj.is_customer_note == "customer")
                    strSQL += "insert into wp_commentmeta(comment_id,meta_key,meta_value) select LAST_INSERT_ID(),'is_customer_note','1';";

                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@comment_post_ID", obj.post_ID),
                    new MySqlParameter("@comment_author", obj.comment_author),
                    new MySqlParameter("@comment_author_email", obj.comment_author_email),
                    new MySqlParameter("@comment_date", obj.comment_date),
                    new MySqlParameter("@comment_date_gmt", obj.comment_date_gmt),
                    new MySqlParameter("@comment_content", obj.comment_content)
                };
                result = SQLHelper.ExecuteNonQuery(strSQL, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public static int RemoveOrderNotes(OrderNotesModel obj)
        {
            int result = 0;
            try
            {
                //string strSQL = "delete from wp_comments where comment_ID = @comment_ID;";
                string strSQL = "update wp_comments set comment_approved = '0' where comment_ID = @comment_ID;";
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@comment_ID", obj.comment_ID)
                };
                result = SQLHelper.ExecuteNonQuery(strSQL, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        //Get Order History
        public static DataTable OrderCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                {
                    strWhr += " and (pm_uc.meta_value='" + CommanUtilities.Provider.GetCurrent().UserID + "') ";
                }
                string strSql = "select sum(case when post_status != 'auto-draft' then 1 else 0 end) AllOrder,sum(case when post_author = 8 and post_status != 'auto-draft' then 1 else 0 end) Mine,"
                            + " sum(case when post_author != 8 and post_status = 'draft' then 1 else 0 end) Drafts,sum(case post_status when 'wc-pending' then 1 else 0 end) Pending,"
                            + " sum(case post_status when 'wc-processing' then 1 else 0 end) Processing,sum(case post_status when 'wc-on-hold' then 1 else 0 end) OnHold,"
                            + " sum(case post_status when 'wc-completed' then 1 else 0 end) Completed,sum(case post_status when 'wc-cancelled' then 1 else 0 end) Cancelled,"
                            + " sum(case post_status when 'wc-refunded' then 1 else 0 end) Refunded,sum(case post_status when 'wc-failed' then 1 else 0 end) Failed"
                            + " from wp_posts p left outer join wp_postmeta pm_uc on pm_uc.post_id = p.id and pm_uc.meta_key = 'employee_id' where p.post_type = 'shop_order' " + strWhr;

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
                if (!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                {
                    strWhr += " and (pmf.employee_id='" + CommanUtilities.Provider.GetCurrent().UserID + "') ";
                }
                if (!string.IsNullOrEmpty(userstatus))
                {
                    if (userstatus == "mine") { strWhr += " and p.post_author = 8 and p.post_status != 'auto-draft'"; }
                    else { strWhr += " and p.post_status = '" + userstatus + "'"; }
                }
                else
                    strWhr += " and p.post_status != 'auto-draft' ";

                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.id like '" + searchid + "%' "
                            + " or concat(pmf.first_name,' ',pmf.last_name,' ',p.post_status) like '" + searchid + "%' "
                            //+ " OR os.num_items_sold='%" + searchid + "%' "
                            //+ " OR os.total_sales='%" + searchid + "%' "
                            //+ " OR os.customer_id='%" + searchid + "%' "
                            //+ " OR p.post_status like '" + searchid + "%' "
                            //+ " OR p.post_date like '%" + searchid + "%' "
                            //+ " OR COALESCE(pmf.first_name, '') like '" + searchid + "%' "
                            //+ " OR COALESCE(pmf.last_name, '') like '" + searchid + "%' "
                            + " OR replace(replace(replace(replace(pmf.billing_phone, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
                            + " )";
                }

                if (!string.IsNullOrEmpty(sMonths))
                {
                    strWhr += " and DATE_FORMAT(p.post_date,'%Y%m') BETWEEN " + sMonths;
                }
                if (!string.IsNullOrEmpty(CustomerID))
                {
                    strWhr += " and pmf.customer_id= '" + CustomerID + "' ";
                }

                //string strSql = "SELECT p.id,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
                //            + " p.post_status status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,COALESCE(pmf.meta_value, '') FirstName,COALESCE(pml.meta_value, '') LastName,"
                //            + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone,"
                //            + " (SELECT sum(rpm.meta_value) FROM wp_posts rp JOIN wp_postmeta rpm ON rp.ID = rpm.post_id AND meta_key = '_order_total' WHERE rp.post_parent = p.ID AND rp.post_type = 'shop_order_refund') AS refund_total"
                //            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                //            + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                //            + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                //            + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                //            + " WHERE p.post_type = 'shop_order' " + strWhr
                //            + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                //strSql += "; SELECT sum(1) TotalRecord from wp_posts p"
                //        + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                //        + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                //        + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                //        + " WHERE p.post_type = 'shop_order' " + strWhr.ToString();
                string strSql = "SELECT p.id,p.post_status status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,os.num_items_sold,pmf.total_sales,pmf.customer_id,"
                            + " pmf.first_name,pmf.last_name,pmf.billing_phone,pmf.payment_method,pmf.payment_method_title,pmf.paypal_status,pmf.paypal_id,"
                            + " (SELECT sum(rpm.meta_value) FROM wp_posts rp JOIN wp_postmeta rpm ON rp.ID = rpm.post_id AND meta_key = '_order_total' WHERE rp.post_parent = p.ID AND rp.post_type = 'shop_order_refund') AS refund_total"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " inner join vw_Order_details pmf on p.id = pmf.post_id"
                            + " WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' " + strWhr
                            + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";
                strSql += "; SELECT sum(1) TotalRecord from wp_posts p inner join vw_Order_details pmf on p.id = pmf.post_id "
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
        public static DataTable SearchCustomerAddress(string CustomerID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT 'Default' IsDefault,user_id customer_id,concat('{',group_concat(concat('\"_',meta_key,'\": \"',meta_value,'\"') separator ','),'}') as meta_data"
                                + " FROM wp_usermeta WHERE user_id = '" + CustomerID + "' and (meta_key like 'billing_%' OR meta_key like 'shipping_%') and meta_key not like '%_method' group by user_id"
                                + " UNION ALL"
                                + " select distinct IsDefault, customer_id, meta_data from"
                                + " (SELECT '' IsDefault, pmu.meta_value customer_id, concat('{', group_concat(concat('\"', pm.meta_key, '\": \"', pm.meta_value, '\"') ORDER BY pm.meta_key separator ','), '}') as meta_data"
                                + " FROM wp_posts po inner join wp_postmeta pmu on pmu.post_id = po.ID and pmu.meta_key = '_customer_user' and pmu.meta_value = '" + CustomerID + "'"
                                + " inner join wp_postmeta pm on pm.post_id = pmu.post_id and (pm.meta_key like '_billing%' OR pm.meta_key like '_shipping_%') and pm.meta_key not like '%_method'"
                                + " WHERE po.post_type = 'shop_order' group by po.ID, pmu.meta_value) tt";
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
                //List<SplitOrderItemsModel> _list = new List<SplitOrderItemsModel>();
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-MTE", product_id = "118, 56774, 78676, 106923, 1595, 1610, 1619, 208417, 306817, 611172, 611220, 632713, 611172, 716434, 716425, 716418, 787847", variation_id = "684957" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-PSW", product_id = "124524", variation_id = "684958" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-KP", product_id = "14023", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-W", product_id = "128244", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-B", product_id = "31729", variation_id = "684960" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-F", product_id = "20861", variation_id = "684961" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-PB", product_id = "611252", variation_id = "684962" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-FMF", product_id = "727138,612940,727126", variation_id = "684959" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-AJ", product_id = "611286,612995,613207", variation_id = "684963" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-CPB", product_id = "733500", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-PRO", product_id = "612955,612947,611268", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-SMF", product_id = "611238", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-COM", product_id = "772065,787909", variation_id = "" });

                DataTable dt = SQLHelper.ExecuteDataTable(string.Format("SELECT * FROM split_record WHERE main_order_id={0}; ", model.order_id));
                string strSql = string.Empty;
                if (dt.Rows.Count == 0)
                {
                    DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                    strSql = string.Format("INSERT INTO split_record (main_order_id) values({0});", model.order_id);
                    strSql += string.Format(" INSERT INTO split_meta (split_id,meta_key,meta_value) SELECT split_id,p.meta_key,p.meta_value FROM split_record sr INNER JOIN wp_postmeta p on p.post_id = sr.main_order_id where p.post_id = {0} and (p.meta_key like '_billing_%' or p.meta_key like '_shipping_%') order by p.meta_key; ", model.order_id);
                }
                else
                {
                    strSql += string.Format("delete from split_detail_items where split_detail_id in (SELECT split_detail_id FROM split_detail where split_id in (SELECT split_id FROM split_record WHERE main_order_id={0}));", model.order_id);
                    strSql += string.Format("delete from split_detail where split_id in (SELECT split_id FROM split_record WHERE main_order_id={0});", model.order_id);
                }
                strSql += " INSERT INTO split_detail (split_id,order_name) "
                            + " SELECT distinct sr.split_id,CONCAT('#',oi.order_id,'-',pwr.prefix_code) order_id FROM split_record sr"
                            + " inner join wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                            + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                            + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                            + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                            + " where oi.order_id = " + model.order_id + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

                strSql += " INSERT INTO split_detail_items (split_detail_id,product_id,variation_id,qty,meta_key,meta_value) "
                        + " SELECT sd.split_detail_id,oim_p.meta_value p_id,oim_v.meta_value v_id,oim_qty.meta_value qty,'','' FROM split_record sr"
                        + " INNER JOIN wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                        + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_qty on oim_qty.order_item_id = oi.order_item_id and oim_qty.meta_key = '_qty'"
                        + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                        + " inner join split_detail sd on sd.split_id = sr.split_id and sd.order_name = CONCAT('#', oi.order_id, '-', pwr.prefix_code)"
                        + " where oi.order_id = " + model.order_id + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
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
                string strSql = "SELECT p.ID,p.post_date_gmt,p.post_modified_gmt,sd.split_detail_id,sd.order_name,max(case meta_key when '_payment_method_title' then meta_value else '' end) pm_title, "
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