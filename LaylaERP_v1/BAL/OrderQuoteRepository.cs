namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
    using LaylaERP.UTILITIES;
    using MySql.Data.MySqlClient;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Text;
    using System.Web;

    public class OrderQuoteRepository
    {
        public static DataTable AddOrdersQuote(long id, long user_id, string order_quote, string order_quote_details)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "ADD"),
                    new SqlParameter("@user_id", user_id),
                    new SqlParameter("@id", id),
                    new SqlParameter("@quote_json", order_quote),
                    new SqlParameter("@quote_details_json", order_quote_details)
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataTable UpdatePodiumDetails(string flag, long id, long user_id, string order_quote)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@user_id", user_id),
                    new SqlParameter("@id", id),
                    new SqlParameter("@quote_json", order_quote),
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataSet GetOrdersQuote(long id)
        {
            var ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "GETBID"),
                    new SqlParameter("@id", id),
                };
                ds = SQLHelper.ExecuteDataSet("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ds;
        }
        public static DataTable QuoteApproval(long id, string quotestatus, string row_key)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@search", row_key),
                    new SqlParameter("@quote_status", quotestatus),
                    new SqlParameter("@flag", "QUOTMA"),
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return dt;
        }
        public static DataTable QuoteCounts(DateTime? fromdate, DateTime? todate, long UserID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                {
                    UserID = 0;
                }
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    UserID > 0 ? new SqlParameter("@user_id", UserID) : new SqlParameter("@user_id", DBNull.Value),
                    new SqlParameter("@flag", "QUOTEC")
                };
                dt = SQLHelper.ExecuteDataTable("erp_order_quote_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable QuoteList(DateTime? fromdate, DateTime? todate, long customerid, string quote_status, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    customerid > 0 ? new SqlParameter("@customer_id", customerid) : new SqlParameter("@customer_id", DBNull.Value),
                    new SqlParameter("@quote_status", quote_status),
                    new SqlParameter("@search", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "OQTLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_order_quote_search", parameters);
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
        public static long CreateOrder(long quote_no, string host)
        {
            long id = 0;
            try
            {
                string post_password = "wc_order_" + Guid.NewGuid().ToString().Replace("-", "");
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strSql = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)"
                                + " values ('1','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cUTFDate.ToString("yyyy-MM-dd HH:mm:ss") + "','','Order &ndash; " + cUTFDate.ToString("MMMM dd, yyyy @ HH:mm tt") + "','','auto-draft',"
                                + "'open','closed','" + post_password + "','order-" + CommonDate.UtcDate().ToString("MMM-dd-yyyy-HHmm-tt") + "','','','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cUTFDate.ToString("yyyy-MM-dd HH:mm:ss") + "',"
                                + "'','0','" + host + "/~rpsisr/woo/post_type=shop_order&p=','0','shop_order','shop_order_erp','0') ; ";

                strSql += " insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id)";
                strSql += " SELECT LAST_INSERT_ID(),'0','" + cDate.ToString("yyyy-MM-dd HH:mm:ss") + "','" + cUTFDate.ToString("yyyy-MM-dd HH:mm:ss") + "','0','0','0','0','0','0','auto-draft','0' ; SELECT LAST_INSERT_ID();";
                MySqlParameter[] parameters = { };
                id = Convert.ToInt64(DAL.MYSQLHelper.ExecuteScalar(strSql, parameters));
                if (id > 0)
                {
                    strSql = string.Format("update erp_order_quote set order_id = {0},order_status = 'auto-draft',modified_date = '{1}',modified_date_gmt = '{2}' where quote_no = {3};", id, cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), quote_no);
                    strSql += string.Format("insert into erp_order_quote_action (quote_no,action_date,quote_status,remark) select quote_no,'{0}',quote_status,'Create Order ID #{1}' from erp_order_quote where quote_no = {2};", cDate.ToString("yyyy-MM-dd HH:mm:ss"), id, quote_no);

                    var result = DAL.SQLHelper.ExecuteNonQuery(strSql);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return id;
        }
        public static int UpdateOrder(long quote_no)
        {
            int result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                long order_id = 0, customer_id = 0;
                string _giftcard_to = string.Empty, _giftcard_from = string.Empty, _giftcard_from_mail = string.Empty, _giftcard_message = string.Empty, _giftcard_amt = string.Empty;
                StringBuilder strSql = new StringBuilder(""); StringBuilder strProductMeta = new StringBuilder("");
                DataSet ds = GetOrdersQuote(quote_no);
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    order_id = dr["order_id"] != DBNull.Value ? Convert.ToInt64(dr["order_id"]) : 0;
                    customer_id = dr["customer_id"] != DBNull.Value ? Convert.ToInt64(dr["customer_id"]) : 0;
                    _giftcard_from_mail = dr["billing_email"] != DBNull.Value ? dr["billing_email"].ToString() : "";
                    /// step 1 : wp_wc_order_stats
                    strSql.Append(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',status='{5}',customer_id='{6}' where order_id='{7}';", dr["item_qty"], dr["gross_total"].ToString(), dr["tax_total"].ToString(), dr["shipping_total"].ToString(), dr["net_total"].ToString(), "wc-processing", dr["customer_id"].ToString(), order_id));

                    /// step 2 : wp_postmeta 
                    strSql.Append(" insert into wp_postmeta (post_id,meta_key,meta_value)");
                    strSql.Append(string.Format(" select {0},'{1}','{2}'", order_id, "_customer_user", dr["customer_id"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_company", dr["billing_company"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_first_name", dr["billing_first_name"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_last_name", dr["billing_last_name"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_address_1", dr["billing_address_1"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_address_2", dr["billing_address_2"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_city", dr["billing_city"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_state", dr["billing_state"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_country", dr["billing_country"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_postcode", dr["billing_postcode"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_email", dr["billing_email"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_phone", dr["billing_phone"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_billing_address_index", ""));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_company", dr["shipping_company"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_first_name", dr["shipping_first_name"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_last_name", dr["shipping_last_name"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_address_1", dr["shipping_address_1"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_address_2", dr["shipping_address_2"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_city", dr["shipping_city"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_state", dr["shipping_state"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_country", dr["shipping_country"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_postcode", dr["shipping_postcode"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_shipping_address_index", ""));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_key", "wc_order_"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_created_via", "checkout"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_customer_ip_address", ""));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_customer_user_agent", ""));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_recorded_coupon_usage_counts", "yes"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_stock_reduced", "yes"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_currency", "USD"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_cart_discount", dr["discount"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_cart_discount_tax", "0"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_shipping", dr["shipping_total"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_shipping_tax", "0"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_tax", dr["tax_total"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_order_total", dr["net_total"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_gift_amount", dr["giftcard_total"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "total_gcamt", dr["giftcard_total"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "employee_id", dr["created_by"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "employee_name", ""));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_payment_method", dr["payment_method"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_payment_method_title", "Podium"));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'", order_id, "_podium_uid", dr["transaction_id"]));
                    strSql.Append(string.Format(" union all select {0},'{1}','{2}'; ", order_id, "_tax_api", dr["tax_api"]));

                    if (dr["payment_meta"] != DBNull.Value)
                    {
                        dynamic _json = JsonConvert.DeserializeObject<dynamic>(dr["payment_meta"].ToString());
                        foreach (var inputAttribute in _json)
                        {
                            strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select {0},'{1}','{2}';", order_id, inputAttribute.meta_key.Value.ToString(), inputAttribute.meta_value.Value.ToString()));
                        }
                    }
                }
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", dr["item_name"].ToString().Trim(), dr["item_type"].ToString().Trim(), order_id));
                    if (dr["item_type"].ToString().Trim() == "line_item")
                    {
                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount)");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}';", order_id, dr["product_id"], dr["variation_id"], customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), dr["product_qty"], (Convert.ToDecimal(dr["gross_total"]) - Convert.ToDecimal(dr["discount"])), (Convert.ToDecimal(dr["gross_total"]) - Convert.ToDecimal(dr["discount"]) + Convert.ToDecimal(dr["tax_total"])), dr["discount"], dr["tax_total"], dr["shipping_total"], 0));
                        //Insert tax data in serialize format
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax_data','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", dr["tax_data"], order_id, dr["item_type"], dr["item_name"]));
                        if (dr["item_meta"] != DBNull.Value && dr["product_id"].ToString() == "888864")
                        {
                            dynamic _json = JsonConvert.DeserializeObject<dynamic>(dr["item_meta"].ToString());
                            foreach (var inputAttribute in _json)
                            {
                                // strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select {0},'{1}','{2}';", order_id, inputAttribute.meta_key.Value.ToString(), inputAttribute.meta_value.Value.ToString()));
                                strProductMeta.Append(string.Format(" union all select order_item_id,'{0}','{1}' from wp_wc_order_product_lookup where order_id={2} and product_id = 888864", inputAttribute.Name, inputAttribute.Value, order_id));
                                if (inputAttribute.Name.Equals("wc_gc_giftcard_to_multiple")) _giftcard_to = inputAttribute.Value;
                                else if (inputAttribute.Name.Equals("wc_gc_giftcard_from")) _giftcard_from = inputAttribute.Value;
                                else if (inputAttribute.Name.Equals("wc_gc_giftcard_message")) _giftcard_message = inputAttribute.Value;
                                else if (inputAttribute.Name.Equals("wc_gc_giftcard_amount")) _giftcard_amt = inputAttribute.Value;
                            }
                        }
                        //foreach (OrderProductsMetaModel pm_obj in obj.order_itemmeta)
                        //{
                        //    strProductMeta.Append(string.Format(" union all select order_item_id,'{0}','{1}' from wp_wc_order_product_lookup where order_id={2} and product_id = 888864 and order_item_id not in ({3})", pm_obj.key, pm_obj.value, model.OrderPostStatus.order_id, str_oiid));
                        //    if (pm_obj.key.Equals("wc_gc_giftcard_to_multiple")) _giftcard_to = pm_obj.value;
                        //    else if (pm_obj.key.Equals("wc_gc_giftcard_from")) _giftcard_from = pm_obj.value;
                        //    else if (pm_obj.key.Equals("wc_gc_giftcard_message")) _giftcard_message = pm_obj.value;
                        //    else if (pm_obj.key.Equals("wc_gc_giftcard_amount")) _giftcard_amt = pm_obj.value;
                        //}
                    }
                    else if (dr["item_type"].ToString().Trim() == "coupon")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", dr["net_total"], order_id, dr["item_type"], dr["item_name"]));
                    }
                    else if (dr["item_type"].ToString().Trim() == "fee")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}' ", "taxable", order_id, dr["item_type"], dr["item_name"]));
                        strSql.Append(string.Format(" union all select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}' ", dr["net_total"], order_id, dr["item_type"], dr["item_name"]));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", dr["tax_total"], order_id, dr["item_type"], dr["item_name"]));
                    }
                    else if (dr["item_type"].ToString().Trim() == "shipping")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", dr["net_total"], order_id, dr["item_type"]));
                    }
                    else if (dr["item_type"].ToString().Trim() == "tax")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", dr["item_meta"], order_id, "tax", dr["item_name"]));
                        strSql.Append(string.Format(" union all select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", dr["net_total"], order_id, "tax", dr["item_name"]));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", dr["tax_total"], order_id, "tax", dr["item_name"]));
                        strSql.Append(string.Format(" union all select order_item_id,'freighttax_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}';", dr["shipping_total"], order_id, "tax", dr["item_name"]));
                    }
                    else if (dr["item_type"].ToString().Trim() == "gift_card")
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'gift_card_debited','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", "yes", order_id, dr["item_type"]));
                        strSql.Append(string.Format(" union all select order_item_id,'giftcard_id','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", dr["product_id"], order_id, dr["item_type"]));
                        strSql.Append(string.Format(" union all select order_item_id,'code','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", dr["item_name"], order_id, dr["item_type"]));
                        strSql.Append(string.Format(" union all select order_item_id,'amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}';", dr["net_total"], order_id, dr["item_type"]));

                        strSql.Append(string.Format(" insert into wp_woocommerce_gc_activity (type,user_id,user_email,object_id,gc_id,gc_code,amount,date) select 'used','{0}','{1}',order_item_id,'{2}','{3}','{4}',UNIX_TIMESTAMP() from wp_woocommerce_order_items where order_id = {5} and order_item_type = 'gift_card' and order_item_name = '{6}'; ", 0, _giftcard_from_mail, dr["product_id"], dr["item_name"], dr["net_total"], order_id, dr["item_name"]));
                        strSql.Append(string.Format(" Update wp_woocommerce_gc_cards set remaining=(select sum(case type when 'issued' then amount when 'refunded' then amount when 'used' then -amount else 0 end) from wp_woocommerce_gc_activity gc_act where gc_id = wp_woocommerce_gc_cards.id) , modifieddate=current_timestamp() where id = {0}; ", dr["product_id"]));
                    }
                }

                /// step 4 : wp_woocommerce_order_itemmeta
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue + coupon_amount from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id={0}", order_id));
                //strSql.Append(" union all select order_item_id,'_line_tax_data',concat('a:2:{s:5:\"total\";a:1:{i:0;s:',length(tax_amount),':\"',tax_amount,'\";}s:8:\"subtotal\";a:1:{i:0;s:',length(tax_amount),':\"',tax_amount,'\";}}') from wp_wc_order_product_lookup where order_id= " + order_id);
                strSql.Append(string.Format(" union all select order_item_id,'size','' from wp_wc_order_product_lookup where order_id={0}", order_id));
                strSql.Append(strProductMeta);
                strSql.Append(string.Format(" union all select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id={0};", order_id));

                /// step 5 : wp_posts (Coupon used by)
                strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", customer_id, order_id));

                /// step 7 : wp_posts
                strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}',post_excerpt = '{3}' where id = {4}; ", "wc-processing", cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), "", order_id));

                result = DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                if (result > 0)
                {
                    strSql = new StringBuilder("update wp_woocommerce_gc_cards set create_date = UNIX_TIMESTAMP(),expire_date = UNIX_TIMESTAMP(),is_active='off' where order_id = " + order_id + " and order_item_id not in (select order_item_id from wp_wc_order_product_lookup where order_id=" + order_id + " and product_id = 888864);");
                    //strSql = new StringBuilder("delete from wp_woocommerce_gc_activity where gc_id in (select id from wp_woocommerce_gc_cards where order_id = " + model.OrderPostStatus.order_id + ");");
                    //strSql.Append(" delete from wp_woocommerce_gc_cards where order_id = " + model.OrderPostStatus.order_id + ";");
                    foreach (var address in _giftcard_to.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        string _code = Guid.NewGuid().ToString().ToUpper().Replace("-", "");
                        _code = _code.Substring(1, 4) + "-" + _code.Substring(4, 4) + "-" + _code.Substring(8, 4) + "-" + _code.Substring(12, 4);

                        strSql.Append(" insert into wp_woocommerce_gc_cards (code,order_id,order_item_id,recipient,redeemed_by,sender,sender_email,message,balance,remaining,template_id,create_date,deliver_date,delivered,expire_date,redeem_date,is_virtual,is_active,modifieddate)");
                        strSql.Append(" Select '" + _code + "',order_id,order_item_id,'" + address + "',0,'" + _giftcard_from + "','" + _giftcard_from_mail + "','" + _giftcard_message + "','" + _giftcard_amt + "','" + _giftcard_amt + "','default',UNIX_TIMESTAMP(),UNIX_TIMESTAMP(),0,0,0,'on','off',current_timestamp() from wp_wc_order_product_lookup where order_id=" + order_id + " and product_id = 888864;");

                        strSql.Append("insert into wp_woocommerce_gc_activity (type,user_id,user_email,object_id,gc_id,gc_code,amount,date)");
                        strSql.Append(" Select 'issued',0,'" + _giftcard_from_mail + "','" + order_id + "',LAST_INSERT_ID(),'" + _code + "','" + _giftcard_amt + "',UNIX_TIMESTAMP();");
                    }
                    DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                }

            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
    }
}