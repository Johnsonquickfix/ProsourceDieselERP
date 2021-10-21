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


    public class ShipRepository
    {
        /// <summary>
        /// Get Pending Ship Orders List.
        /// </summary>
        /// <returns></returns>
        public static DataTable GetPendingShipOrdersList()
        {
            DataTable dt = new DataTable();
            try
            {
                MySqlParameter[] parameters = { };
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
                            + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                            + " where oi.order_id = " + orderid + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

                strSql += " INSERT INTO split_detail_items (split_detail_id,product_id,variation_id,qty,meta_key,meta_value) "
                        + " SELECT sd.split_detail_id,oim_p.meta_value p_id,oim_v.meta_value v_id,oim_qty.meta_value qty,'','' FROM split_record sr"
                        + " INNER JOIN wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                        + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_qty on oim_qty.order_item_id = oi.order_item_id and oim_qty.meta_key = '_qty'"
                        + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                        + " inner join split_detail sd on sd.split_id = sr.split_id and sd.order_name = CONCAT('#', oi.order_id, '-', pwr.prefix_code)"
                        + " where oi.order_id = " + orderid + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

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
                        + " AND DATE_FORMAT(p.post_modified_gmt,'%Y-%m-%d %H:%i:%s') BETWEEN DATE_FORMAT('" + from_date.ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s') AND DATE_FORMAT('" + to_date.ToString("yyyy-MM-dd HH:mm:ss") + "','%Y-%m-%d %H:%i:%s') "
                        + " group by p.ID,sr.split_id,sd.order_name order by p.ID desc";
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