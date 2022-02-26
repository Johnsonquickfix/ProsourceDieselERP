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
        // GET: Mines of Moria (Quick Orders)
        public ActionResult minesofmoria(long id = 0)
        {
            ViewBag.id = id;
            string pay_method = CommanUtilities.Provider.GetCurrent().AuthorizeNet ? "{\"id\":\"amazon_payments_advanced\" ,\"text\":\"Amazon Pay\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().AmazonPay ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"authorize_net_cim_credit_card\" ,\"text\":\"Authorize Net\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Podium ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"podium\" ,\"text\":\"Podium\"}" : "";
            pay_method += CommanUtilities.Provider.GetCurrent().Paypal ? (pay_method.Length > 1 ? "," : "") + "{\"id\":\"ppec_paypal\" ,\"text\":\"PayPal\"}" : "";
            ViewBag.pay_option = "[" + pay_method + "]";
            return View();
        }

        // GET: Orders History/View
        public ActionResult OrdersHistory()
        {
            ViewBag.iseditable = CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? 1 : 0;
            ViewBag.userid = CommanUtilities.Provider.GetCurrent().UserID;
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

        [HttpPost]
        public JsonResult GenerateNewOrderNo(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                string host = Request.ServerVariables["HTTP_ORIGIN"];
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "employee_id", meta_value = om.UserID.ToString() });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "employee_name", meta_value = om.UserName.ToString() });

                JSONresult = AddOrdersPost(host, model.OrderPostMeta).ToString();
            }
            catch (Exception ex) { return Json(new { status = true, message = ex.Message, id = "0" }, 0); }
            return Json(new { status = true, message = "Success.", id = JSONresult }, 0);
        }
        public static long AddOrdersPost(string host, List<OrderPostMetaModel> _list)
        {
            long id = 0;
            try
            {
                StringBuilder strSql = new StringBuilder("INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)");
                strSql.Append("VALUES('1','" + CommonDate.CurrentDate().ToString("yyyy-MM-dd HH:mm:ss") + "','" + CommonDate.UtcDate().ToString("yyyy-MM-dd HH:mm:ss") + "','','Order &ndash; " + CommonDate.UtcDate().ToString("MMMM dd, yyyy @ HH:mm tt") + "','','auto-draft',"
                                   + "'open','closed','','order-" + CommonDate.UtcDate().ToString("MMM-dd-yyyy-HHmm-tt") + "','','','" + CommonDate.CurrentDate().ToString("yyyy-MM-dd HH:mm:ss") + "','" + CommonDate.UtcDate().ToString("yyyy-MM-dd HH:mm:ss") + "',"
                                   + "'','0','" + host + "/~rpsisr/woo/post_type=shop_order&p=','0','shop_order','','0')");

                strSql.Append("; insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id)");
                strSql.Append(" SELECT LAST_INSERT_ID(),'0','" + CommonDate.CurrentDate().ToString("yyyy-MM-dd HH:mm:ss") + "','" + CommonDate.UtcDate().ToString("yyyy-MM-dd HH:mm:ss") + "','0','0','0','0','0','0','auto-draft','0' ; SELECT LAST_INSERT_ID();");

                MySqlParameter[] parameters = { };
                id = Convert.ToInt64(DAL.MYSQLHelper.ExecuteScalar(strSql.ToString(), parameters));
                if (id > 0)
                {
                    strSql = new StringBuilder("update wp_posts set guid=concat(guid,'" + id.ToString() + "') where id=" + id.ToString() + ";insert into wp_postmeta (post_id,meta_key,meta_value) values ");
                    var i = 0;
                    foreach (OrderPostMetaModel obj in _list)
                    {
                        if (++i == _list.Count)
                            strSql.Append(string.Format("('{0}','{1}','{2}') ", id, obj.meta_key, obj.meta_value));
                        else
                            strSql.Append(string.Format("('{0}','{1}','{2}'), ", id, obj.meta_key, obj.meta_value));
                    }
                    var result = DAL.MYSQLHelper.ExecuteNonQuery(strSql.ToString());
                }
            }
            catch (MySql.Data.MySqlClient.MySqlException ex)
            {
                throw new Exception(ex.Message);
            }
            return id;
        }

        [HttpPost]
        public JsonResult SaveCustomerOrder(OrderModel model)
        {
            string JSONresult = string.Empty; bool status = false;
            try
            {
                //OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_ip_address", meta_value = Net.Ip });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "_customer_user_agent", meta_value = Net.BrowserInfo });
                //model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_id", meta_value = om.UserID.ToString() });
                //model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = model.OrderPostStatus.order_id, meta_key = "employee_name", meta_value = om.UserName.ToString() });

                int result = SaveOrder(model);
                if (result > 0)
                { status = true; JSONresult = "Order placed successfully."; }
                //JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(new { status = status, message = JSONresult }, 0);
        }
        public static int SaveOrder(OrderModel model)
        {
            int result = 0;
            int resultG = 0;
            try
            {
                string Userid = CommanUtilities.Provider.GetCurrent().UserID.ToString();
                string str_oiid = string.Join(",", model.OrderProducts.Where(f => f.quantity > 0).Select(x => x.order_item_id.ToString()).ToArray());
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
                        if (obj.product_type == "line_item")
                        {
                            strSql.Append(string.Format(" update wp_wc_order_product_lookup set product_qty='{0}',product_net_revenue='{1}',product_gross_revenue='{2}',coupon_amount='{3}',tax_amount='{4}',shipping_amount='{5}',shipping_tax_amount='{6}' where order_item_id='{7}';",
                                obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount, obj.order_item_id));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key in ('_qty','_reduced_stock');", obj.quantity, obj.order_item_id));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='_line_subtotal';", obj.total, obj.order_item_id));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key in ('_line_subtotal_tax','_line_tax');", obj.tax_amount, obj.order_item_id));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='_line_total';", (obj.total - obj.discount), obj.order_item_id));
                        }
                        else if (obj.product_type == "coupon")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.total, obj.order_item_id, "discount_amount"));
                        }
                        else if (obj.product_type == "gift_card")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.total, obj.order_item_id, "amount"));
                        }
                        else if (obj.product_type == "fee")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.total, obj.order_item_id, "_line_total"));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_amount, obj.order_item_id, "rate_percent"));
                        }
                        else if (obj.product_type == "shipping")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.total, obj.order_item_id, "cost"));
                        }
                        else if (obj.product_type == "tax")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_items set order_item_name='{0} TAX-1' where order_item_id={1}; ", obj.product_name, obj.order_item_id));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.product_name, obj.order_item_id, "label"));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.total, obj.order_item_id, "tax_amount"));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_amount, obj.order_item_id, "rate_percent"));
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.shipping_tax_amount, obj.order_item_id, "freighttax_percent"));
                        }
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.product_name, obj.product_type, model.OrderPostStatus.order_id));
                        if (obj.product_type == "line_item")
                        {
                            strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount)");
                            strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}';", model.OrderPostStatus.order_id, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                    cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                        }
                        else if (obj.product_type == "coupon")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", obj.total, model.OrderPostStatus.order_id, obj.product_type, obj.product_name));
                        }
                        else if (obj.product_type == "fee" && obj.total != 0)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", "taxable", model.OrderPostStatus.order_id, obj.product_type));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.total, model.OrderPostStatus.order_id, obj.product_type));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.tax_amount, model.OrderPostStatus.order_id, obj.product_type));
                        }
                        else if (obj.product_type == "shipping")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.total, model.OrderPostStatus.order_id, obj.product_type));
                        }
                        else if (obj.product_type == "tax")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.product_name, model.OrderPostStatus.order_id, "tax"));
                            strSql.Append(string.Format(" union all select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.total, model.OrderPostStatus.order_id, "tax"));
                            strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.tax_amount, model.OrderPostStatus.order_id, "tax"));
                            strSql.Append(string.Format(" union all select order_item_id,'freighttax_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}';", obj.shipping_tax_amount, model.OrderPostStatus.order_id, "tax"));
                        }
                    }
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

                /// step 5 : wp_posts (Coupon used by)
                strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));

                /// step 7 : wp_posts
                strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}',post_excerpt = '{3}' where id = {4}; ", model.OrderPostStatus.status, cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), model.OrderPostStatus.Search, model.OrderPostStatus.order_id));

                result = DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                //if (result > 0)
                //{
                //    long order_item_id = 0; string order_item_name = ""; string order_item_type = "";
                //    DataTable dt = OrderRepository.GiftCardDetails(model.OrderPostStatus.order_id);

                //    StringBuilder strSqlG = new StringBuilder("");
                //    foreach (DataRow dr in dt.Rows)
                //    {
                //        order_item_id = Convert.ToInt64(dr["order_item_id"]);
                //        order_item_name = dr["order_item_name"].ToString();
                //        order_item_type = dr["order_item_type"].ToString();
                //        var amount = model.OrderOtherItems.Where(f => f.item_name == order_item_name).Select(x => x.amount).ToArray();
                //        var giftcard_id = model.OrderOtherItems.Where(f => f.item_name == order_item_name).Select(x => x.giftcard_id).ToArray();
                //        if (Convert.ToInt64(giftcard_id[0]) > 0)
                //        {
                //            strSqlG.Append("insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) Select " + order_item_id + ", 'giftcard_id', '" + giftcard_id[0] + "';");
                //            strSqlG.Append(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) Select " + order_item_id + ", 'code', '" + order_item_name + "';");
                //            strSqlG.Append(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) Select " + order_item_id + ", 'amount', " + amount[0] + ";");
                //            strSqlG.Append(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) Select " + order_item_id + ",'gift_card_debited','yes';");
                //            strSqlG.Append(string.Format("Update wp_woocommerce_gc_cards set remaining=remaining - {0} where id=({1});", amount[0], giftcard_id[0]));
                //            strSqlG.Append(string.Format("Insert into wp_woocommerce_gc_activity(type,user_id,user_email,object_id,gc_id,gc_code,amount,date,note) " +
                //                "Select 'used', {1}, user_email, {3}, gc_id, gc_code, {2}, UNIX_TIMESTAMP(now()), note from wp_woocommerce_gc_activity where gc_code ='{0}' and type='issued'; ", order_item_name, Userid, amount[0], order_item_id));
                //        }
                //    }
                //    resultG = SQLHelper.ExecuteNonQuery(strSqlG.ToString());
                //}
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }

        [HttpPost]
        public JsonResult AddFee(OrderOtherItemsModel model)
        {
            long id = 0;
            try
            {
                string strSQL = string.Empty;
                if (model.order_item_id > 0)
                {
                    strSQL = string.Format("update wp_woocommerce_order_items set order_item_name ='{0}' where order_item_id={1};update wp_woocommerce_order_itemmeta set meta_value='{2}' where order_item_id={3} and meta_key in ('_fee_amount','_line_total'); ", model.item_name, model.order_item_id, model.amount, model.order_item_id);
                    if (DAL.MYSQLHelper.ExecuteNonQuery(strSQL) > 0) id = model.order_item_id;
                }
                else
                {
                    MySqlParameter[] parameters =
                    {
                        new MySqlParameter("@order_item_name", model.item_name),
                        new MySqlParameter("@order_item_type", model.item_type),
                        new MySqlParameter("@order_id", model.order_id)
                    };
                    strSQL = "INSERT INTO wp_woocommerce_order_items(order_item_name,order_item_type,order_id) SELECT @order_item_name,@order_item_type,@order_id; SELECT SCOPE_IDENTITY();";
                    id = Convert.ToInt64(DAL.MYSQLHelper.ExecuteScalar(strSQL, parameters));
                    if (id > 0)
                    {
                        strSQL = string.Format("insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) values ('{0}','_fee_amount','{1}'),('{2}','_tax_class',''),('{3}','tax_status','taxable'),('{4}','_line_total','{5}'),('{6}','_line_tax','0') ", id, model.amount, id, id, id, model.amount, id);
                        DAL.MYSQLHelper.ExecuteNonQuery(strSQL);
                    }
                }
            }
            catch { Json(new { status = false, order_item_id = 0 }, 0); }
            return Json(new { status = true, order_item_id = id }, 0);
        }
        [HttpPost]
        public JsonResult RemoveFee(OrderOtherItemsModel model)
        {
            string result = "Invalid Details.";
            bool state = false;
            try
            {
                string strSQL = string.Format("delete from wp_woocommerce_order_itemmeta where order_item_id={1};delete from wp_woocommerce_order_items where order_item_id={1};", model.order_item_id, model.order_item_id);
                int res = DAL.MYSQLHelper.ExecuteNonQuery(strSQL);
                if (res > 0)
                {
                    result = "Fee successfully removed.";
                    state = true;
                }
            }
            catch { state = false; result = "Invalid Details."; }
            return Json(new { status = state, message = result }, 0);
        }
        [HttpPost]
        public JsonResult GetOrderItemMeta(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                //JSONresult = OrderRepository.GetOrderItemMeta(id);

                MySqlParameter[] parameters = { new MySqlParameter("@order_id", id) };
                string strSQl = "select concat('[', group_concat(concat('{\"id\":',oim_s.meta_id,',\"item_id\":',oim_s.order_item_id,',\"key\":\"',oim_s.meta_key,'\",\"value\":\"',oim_s.meta_value,'\"}'),','), ']') meta_data"
                                + " from wp_woocommerce_order_itemmeta oim_s where oim_s.order_item_id = @order_id and oim_s.meta_key like '_system_%'";
                JSONresult = DAL.MYSQLHelper.ExecuteScalar(strSQl, parameters).ToString();
                JSONresult = string.IsNullOrEmpty(JSONresult) ? "[]" : JSONresult;
            }
            catch (Exception ex) { return Json("[]", 0); }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult SaveOrderProductMeta(OrderModel model)
        {
            string result = "Invalid Details.";
            bool state = false;
            try
            {
                StringBuilder strSql = new StringBuilder("");
                foreach (OrderProductsMetaModel obj in model.OrderItemMeta)
                {
                    if (obj.id > 0 && !string.IsNullOrEmpty(obj.key))
                    {
                        strSql.Append(string.Format("Update wp_woocommerce_order_itemmeta set meta_key = '{0}', meta_value = '{1}' where meta_id = {2}; ", obj.key, obj.value, obj.id));
                    }
                    else if (obj.id > 0 && string.IsNullOrEmpty(obj.key))
                    {
                        strSql.Append(string.Format("delete from wp_woocommerce_order_itemmeta where meta_id = {0}; ", obj.id));
                    }
                    else if (obj.id == 0 && !string.IsNullOrEmpty(obj.key))
                    {
                        strSql.Append(string.Format("insert into wp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUES({0},'{1}','{2}'); ", obj.item_id, obj.key, obj.value));
                    }
                }
                int res = DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                if (res > 0)
                {
                    result = "Item Meta successfully updated.";
                    state = true;
                }
            }
            catch { state = false; result = "Invalid Details."; }
            return Json(new { status = state, message = result }, 0);
        }
        [HttpPost]
        public JsonResult OrderNoteAdd(OrderNotesModel model)
        {
            string JSONresult = string.Empty; bool b_status = false;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.comment_author = om.UserName; model.comment_author_email = om.EmailID;
                model.comment_date = CommonDate.CurrentDate(); model.comment_date_gmt = CommonDate.UtcDate();

                string strSQL = "INSERT INTO wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP,comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved,comment_agent, comment_type,comment_parent,user_id)"
                            + " VALUES(@comment_post_ID,@comment_author,@comment_author_email,'','',@comment_date,@comment_date_gmt,@comment_content,'0','1','WooCommerce','order_note','0','0');";
                if (model.is_customer_note == "customer")
                    strSQL += "insert into wp_commentmeta(comment_id,meta_key,meta_value) select LAST_INSERT_ID(),'is_customer_note','1';";
                strSQL += "update wp_posts set post_modified = @comment_date, post_modified_gmt = @comment_date_gmt where id = @comment_post_ID; ";

                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@comment_post_ID", model.post_ID),
                    new MySqlParameter("@comment_author", model.comment_author),
                    new MySqlParameter("@comment_author_email", model.comment_author_email),
                    new MySqlParameter("@comment_date", model.comment_date),
                    new MySqlParameter("@comment_date_gmt", model.comment_date_gmt),
                    new MySqlParameter("@comment_content", model.comment_content)
                };
                int res = DAL.MYSQLHelper.ExecuteNonQuery(strSQL, parameters);
                if (res > 0)
                {
                    JSONresult = "Order note added successfully."; b_status = true;
                }
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = b_status, message = JSONresult }, 0);
        }
        [HttpPost]
        public JsonResult OrderNoteDelete(OrderNotesModel model)
        {
            string JSONresult = string.Empty; bool b_status = false;
            try
            {
                model.comment_date = CommonDate.CurrentDate(); model.comment_date_gmt = CommonDate.UtcDate();
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@comment_ID", model.comment_ID),
                    new MySqlParameter("@comment_post_ID", model.post_ID),
                    new MySqlParameter("@comment_date", model.comment_date),
                    new MySqlParameter("@comment_date_gmt", model.comment_date_gmt),
                };
                int res = DAL.MYSQLHelper.ExecuteNonQuery("update wp_comments set comment_approved = '0' where comment_ID = @comment_ID; update wp_posts set post_modified = @comment_date, post_modified_gmt = @comment_date_gmt where id = @comment_post_ID;", parameters);
                if (res > 0)
                {
                    JSONresult = "Order note deleted successfully."; b_status = true;
                }
            }
            catch (Exception ex) { JSONresult = ex.Message; }
            return Json(new { status = b_status, message = JSONresult }, 0);
        }
    }
}