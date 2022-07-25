namespace LaylaERP.BAL
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Data;
    using DAL;
    using Models;
    using System.Data.SqlClient;
    using System.Text;


    public class ShipRepository
    {
        public static DataTable GenerateShippingOrder()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@qflag", "SOS") };
                dt = SQLHelper.ExecuteDataTable("erp_order_ship", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        /// <summary>
        /// Get Pending Ship Orders List.
        /// </summary>
        /// <returns></returns>
        public static DataTable GetPendingShipOrdersList()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { };
                string strSQl = "select id,post_date_gmt from wp_posts "
                                + " where post_type = 'shop_order' and post_status = 'wc-processing' and(post_modified_gmt between date_add(UTC_TIMESTAMP(), interval - 1 day) and date_add(UTC_TIMESTAMP(), interval - 30 minute))"
                                + " and id not in (select main_order_id from split_record)";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static int CreateShipOrder(long orderid)
        {
            int result = 0;
            try
            {
                string strSql = string.Empty;
                strSql = string.Format("INSERT INTO split_record (main_order_id) values({0});", orderid);
                strSql += string.Format(" INSERT INTO split_meta (split_id,meta_key,meta_value) SELECT split_id,p.meta_key,p.meta_value FROM split_record sr INNER JOIN wp_postmeta p on p.post_id = sr.main_order_id where p.post_id = {0} and (p.meta_key like '_billing_%' or p.meta_key like '_shipping_%') order by p.meta_key; ", orderid);

                strSql += " INSERT INTO split_detail (split_id,order_name) "
                            + " SELECT distinct sr.split_id,CONCAT('#',oi.order_id,'-',pwr.prefix_code) order_id FROM split_record sr"
                            + " inner join wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                            + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                            + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                            + " inner join wp_woocommerce_order_itemmeta oim_lt on oim_lt.order_item_id = oi.order_item_id and oim_lt.meta_key = '_line_subtotal' and oim_lt.meta_value != 0"
                            + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                            + " where oi.order_id = " + orderid + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

                strSql += " INSERT INTO split_detail_items (split_detail_id,product_id,variation_id,qty,meta_key,meta_value) "
                        + " select split_detail_id,p_id,v_id,qty,meta_key,meta_value from "
                        + " (SELECT sd.split_detail_id, oim_p.meta_value p_id, oim_v.meta_value v_id, oim_qty.meta_value qty,"
                        + " coalesce((select group_concat(replace(im.meta_key,'_system_','')) from wp_woocommerce_order_itemmeta im where im.order_item_id = oi.order_item_id and im.meta_key like '_system_%'),'') meta_key,"
                        + " coalesce((select group_concat(im.meta_value) from wp_woocommerce_order_itemmeta im where im.order_item_id = oi.order_item_id and im.meta_key like '_system_%'),'') meta_value"
                        + " FROM split_record sr"
                        + " inner join wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                        + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_qty on oim_qty.order_item_id = oi.order_item_id and oim_qty.meta_key = '_qty'"
                        + " inner join wp_woocommerce_order_itemmeta oim_lt on oim_lt.order_item_id = oi.order_item_id and oim_lt.meta_key = '_line_subtotal' and oim_lt.meta_value != 0"
                        + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                        + " inner join split_detail sd on sd.split_id = sr.split_id and sd.order_name = CONCAT('#', sr.main_order_id, '-', pwr.prefix_code)"
                        + " where oi.order_id = " + orderid + " group by sr.split_id, oi.order_id, pwr.prefix_code"
                        + " union all"
                        + " SELECT sd.split_detail_id,free_it.free_product_id p_id,0 v_id,oim_qty.meta_value* free_quantity qty,"
                        + " coalesce((select group_concat(replace(im.meta_key,'_system_','')) from wp_woocommerce_order_itemmeta im where im.order_item_id = oi.order_item_id and im.meta_key like '_system_%'),'') meta_key,"
                        + " coalesce((select group_concat(im.meta_value) from wp_woocommerce_order_itemmeta im where im.order_item_id = oi.order_item_id and im.meta_key like '_system_%'),'') meta_value"
                        + " FROM split_record sr"
                        + " inner join wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                        + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_qty on oim_qty.order_item_id = oi.order_item_id and oim_qty.meta_key = '_qty'"
                        + " inner join wp_woocommerce_order_itemmeta oim_lt on oim_lt.order_item_id = oi.order_item_id and oim_lt.meta_key = '_line_subtotal' and oim_lt.meta_value != 0"
                        + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                        + " inner join split_detail sd on sd.split_id = sr.split_id and sd.order_name = CONCAT('#', sr.main_order_id, '-', pwr.prefix_code)"
                        + " inner join wp_product_free free_it on free_it.product_id = pwr.product_id"
                        + " where oi.order_id = " + orderid + " group by sr.split_id, oi.order_id, pwr.prefix_code) tt order by split_detail_id;";
                strSql += string.Format("update wp_posts set post_modified = now(),post_modified_gmt = UTC_TIMESTAMP() where id = {0}; ", orderid);
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
                string strSql = "SELECT p.ID,p.post_date_gmt,p.post_modified_gmt,sd.split_detail_id,sd.order_name,max(case pm.meta_key when '_payment_method_title' then pm.meta_value else '' end) pm_title, "
                        + " max(case pm.meta_key when '_billing_first_name' then pm.meta_value else '' end) b_fn,max(case pm.meta_key when '_billing_last_name' then pm.meta_value else '' end) b_ln, "
                        + " max(case pm.meta_key when '_billing_company' then pm.meta_value else 'company name' end) b_com,max(case pm.meta_key when '_billing_email' then pm.meta_value else '' end) b_email, "
                        + " max(case pm.meta_key when '_billing_phone' then pm.meta_value else '' end) b_phone, "
                        + " max(case pm.meta_key when '_shipping_first_name' then pm.meta_value else '' end) s_fn,max(case pm.meta_key when '_shipping_last_name' then pm.meta_value else '' end) s_ln, "
                        + " max(case pm.meta_key when '_shipping_company' then pm.meta_value else 'company name' end) s_com,max(case pm.meta_key when '_shipping_address_1' then pm.meta_value else '' end) s_add1, "
                        + " max(case pm.meta_key when '_shipping_address_2' then pm.meta_value else '' end) s_add2,max(case pm.meta_key when '_shipping_city' then pm.meta_value else '' end) s_city, "
                        + " max(case pm.meta_key when '_shipping_state' then pm.meta_value else '' end) s_state,max(case pm.meta_key when '_shipping_postcode' then pm.meta_value else '' end) s_postcode, "
                        + " max(case pm.meta_key when '_shipping_country' then pm.meta_value else '' end) s_country"
                        + " FROM wp_posts p inner join split_record sr on sr.main_order_id = p.ID inner join split_detail sd on sd.split_id = sr.split_id  "
                        + " inner join split_detail_items sdi on sdi.split_detail_id = sd.split_detail_id and product_id != 888864 "
                        + " inner join wp_postmeta pm on pm.post_id = p.ID "
                        + " WHERE post_status = 'wc-processing' AND post_type = 'shop_order' AND post_mime_type in ('shop_order_erp','shopordererp','shop_order_replace_erp','shoporderreplaceerp') "
                        + " and convert(varchar,p.post_modified_gmt,20) BETWEEN convert(varchar,'" + from_date.ToString("yyyy-MM-dd HH:mm:ss") + "',20)  AND convert(varchar,'" + to_date.ToString("yyyy-MM-dd HH:mm:ss") + "',20) "
                        + " group by p.ID,p.post_date_gmt,p.post_modified_gmt,sd.split_detail_id,sd.order_name order by p.ID desc";
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
                                + " inner join wp_posts pp on pp.ID = sdi.product_id"
                                + " left outer join wp_posts pvp on pvp.ID = sdi.variation_id"
                                + " left outer join wp_postmeta psku on psku.post_id = (case when sdi.variation_id = 0 then sdi.product_id else sdi.variation_id end) and psku.meta_key = '_sku'"
                                + " where sdi.split_detail_id = " + split_detail_id.ToString();
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable UpdateOrderShipped(long order_id,string order_name, string shipped_items,int shipped_qty, string tracking_num, string tracking_via)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { 
                    new SqlParameter("@order_id", order_id),
                    new SqlParameter("@order_name", order_name),
                    new SqlParameter("@shipped_items", shipped_items),
                    new SqlParameter("@shipped_qty", shipped_qty),
                    new SqlParameter("@tracking_num", tracking_num),
                    new SqlParameter("@tracking_via", tracking_via),
                    new SqlParameter("@qflag", "UOS"),
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_order_shipped_track", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
    }
}