namespace LaylaERP.Controllers
{
    using BAL;
    using Models;
    using UTILITIES;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Net;
    using System.Text;
    using MySql.Data.MySqlClient;

    public class OrdersMySQLController : Controller
    {
        // GET: OrdersMySQL
        public ActionResult Index()
        {
            return View();
        }
        // GET: Order Refund
        public ActionResult OrderRefund(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }

        [HttpPost]
        public JsonResult SaveCustomerOrderRefund(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "_refunded_by", meta_value = om.UserID.ToString() });

                int result = MySQLSaveRefundOrder(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message }, 0); }
            return Json(new { status = status, message = JSONresult }, 0);
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
                result = Convert.ToInt64(DAL.MYSQLHelper.ExecuteScalar(strSQL, parameters));
            }
            catch (MySql.Data.MySqlClient.MySqlException ex)
            {
                throw new Exception(ex.Message);

            }
            return result;
        }
        public static int MySQLSaveRefundOrder(OrderModel model)
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
                        if (obj.product_type == "line_item")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.product_name, "line_item", n_orderid));
                            strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount) ");
                            strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','-{5}','-{6}','-{7}','{8}','-{9}','{10}','{11}'; ", n_orderid, obj.product_id, obj.variation_id, obj.order_item_id, //model.OrderPostStatus.customer_id,
                                    cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), 0, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                        }
                    }
                    /// step 4 : wp_woocommerce_order_itemmeta
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_gross_revenue from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_refunded_item_id',customer_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id = {0};", n_orderid));

                    strSql.Append(string.Format(" update wp_wc_order_product_lookup set customer_id = {0} where order_id = {1};", model.OrderPostStatus.customer_id, n_orderid));
                    /// step 5 : wp_woocommerce_order_items

                    string ID = Guid.NewGuid().ToString("N");
                    string gid = ID.Substring(0, 4) + "-" + ID.Substring(4, 4) + "-" + ID.Substring(8, 4) + "-" + ID.Substring(12, 4);
                    string code = gid.ToUpper();
                    foreach (OrderProductsModel obj in model.OrderProducts)
                    {
                        if (obj.total != 0)
                        {
                            if (obj.product_type != "line_item")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.product_name, obj.product_type, n_orderid));

                                if (obj.product_type == "gift_card")
                                {
                                    strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", code, obj.product_type, n_orderid));

                                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'cost','-{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.total, n_orderid, obj.product_type));
                                    strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.order_item_id, n_orderid, obj.product_type));
                                }
                                else if (obj.product_type == "fee")
                                {
                                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'tax_status','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}'", "taxable", n_orderid, obj.product_type));
                                    strSql.Append(string.Format(" union all select max(order_item_id),'_line_total','-{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}'", obj.total, n_orderid, obj.product_type));
                                    strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}';", obj.order_item_id, n_orderid, obj.product_type));
                                }
                                else if (obj.product_type == "shipping")
                                {
                                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'cost','-{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.total, n_orderid, obj.product_type));
                                    strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.order_item_id, n_orderid, obj.product_type));
                                }
                                else if (obj.product_type == "tax")
                                {
                                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.product_name, n_orderid));
                                    strSql.Append(string.Format(" union all select order_item_id,'tax_amount','-{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.total, n_orderid));
                                    strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.tax_amount, n_orderid));
                                    strSql.Append(string.Format(" union all select order_item_id,'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax';", obj.order_item_id, n_orderid));
                                }
                            }
                        }
                    }

                    result = DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return result;
        }
    }
}