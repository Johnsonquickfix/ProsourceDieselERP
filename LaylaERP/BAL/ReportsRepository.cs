using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;

namespace LaylaERP.BAL
{
    public class ReportsRepository
    {
        public static List<Export_Details> exportorderlist = new List<Export_Details>();
        public static void GetAjBaseData(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    ssql = "SELECT ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    + " format(umatotal.meta_value, 2) Total,"
                    + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                    + " FROM wp_posts u"                
                    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    + " WHERE post_type IN('shop_order') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND ID IN (SELECT order_id FROM wp_woocommerce_order_items WHERE order_item_id  IN (SELECT order_item_id FROM wp_woocommerce_order_itemmeta  WHERE meta_key = '_product_id' AND meta_value IN(612995, 611286))) order by post_status";

                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString()); 
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
                    else
                        uobj.total = "$0";        
                    exportorderlist.Add(uobj);
                }
            }
                catch (Exception ex) { throw ex; }
        }
        public static void GetArizonaSalesOrder(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    ssql = "SELECT 'web' provider,'Order' transaction_type,'' transaction_reference_id, ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                   // + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    + " umadd.meta_value shiptostreet,"
                    + " umacity.meta_value shiptocity,"
                    + " umastate.meta_value shiptostate,"
                    + " umapostalcode.meta_value shiptozip,"
                    + " umacountry.meta_value shiptocountrycode,"

                    + " umaddbilling.meta_value billingstreet,"
                    + " umacitybilling.meta_value billingcity,"
                    + " umastatebilling.meta_value billingstate,"
                    + " umapostalcodebilling.meta_value billingzip,"
                    + " umacountrybilling.meta_value billingcountry,"
                    + " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"
                    + " format(umatotal.meta_value, 2) - format(umatax.meta_value, 2) Total,"
                    + " format(umadiscount.meta_value, 2) Discount,"
                    + " format(umatax.meta_value, 2) Tax,"
                    + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                    + " FROM wp_posts u"
                    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"

                    + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"

                    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                    + " WHERE umastate.post_id IN (SELECT ID FROM wp_posts WHERE post_status IN ('wc-completed') AND post_type='shop_order' AND  DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' ) AND umastate.meta_value LIKE 'AZ' order by post_status";

                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                    uobj.tax = ds1.Tables[0].Rows[i]["Tax"].ToString();
                    uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["shiptostreet"].ToString();
                    uobj.shipping_city = ds1.Tables[0].Rows[i]["shiptocity"].ToString();
                    uobj.shipping_state = ds1.Tables[0].Rows[i]["shiptostate"].ToString();
                    uobj.shipping_postcode = ds1.Tables[0].Rows[i]["shiptozip"].ToString();
                    uobj.shipping_country = ds1.Tables[0].Rows[i]["shiptocountrycode"].ToString();
                    uobj.billing_address_1 = ds1.Tables[0].Rows[i]["billingstreet"].ToString();
                    uobj.billing_city = ds1.Tables[0].Rows[i]["billingcity"].ToString();
                    uobj.billing_country = ds1.Tables[0].Rows[i]["billingcountry"].ToString();
                    uobj.billing_state = ds1.Tables[0].Rows[i]["billingstate"].ToString();
                    uobj.billing_postcode = ds1.Tables[0].Rows[i]["billingzip"].ToString();
                    uobj.provider = ds1.Tables[0].Rows[i]["provider"].ToString();
                    uobj.transaction_type = ds1.Tables[0].Rows[i]["transaction_type"].ToString();
                    uobj.transaction_reference_id = ds1.Tables[0].Rows[i]["transaction_reference_id"].ToString();
                    uobj.shipping_amount = ds1.Tables[0].Rows[i]["shipping_amount"].ToString();
                    uobj.handling_amount = ds1.Tables[0].Rows[i]["handling_amount"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    uobj.Discount = ds1.Tables[0].Rows[i]["Discount"].ToString();
                    uobj.total = ds1.Tables[0].Rows[i]["Total"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }
        public static void GetZeroOrder(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    ssql = "SELECT ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    + " format(umatotal.meta_value, 2) Total,"
                    + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name,"
                   // + " umitem.order_item_name orderItem,"
                    + " (select group_concat(ui.order_item_name,' x ',uim.meta_value) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                    + " FROM wp_posts u"
                    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"                   
                    + " WHERE post_type IN('shop_order') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND umatotal.meta_value IN ('0', '0.00') order by post_status";

                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    uobj.orde_item_name = ds1.Tables[0].Rows[i]["itemname"].ToString();
                    uobj.total = "$"+ ds1.Tables[0].Rows[i]["Total"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }
        public static void GetPodiumOrder(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"                   
                    + " format(umatotal.meta_value, 2) Total,"
                    + " format(umadiscount.meta_value, 2) Discount,"
                    + " format(umatax.meta_value, 2) Tax,"
                    + " post_date Podiumdate,"
                    + " umtransaction.meta_value TransactionID,"
                    + " umorerItemmeta.meta_value SubTotal,"
                    + " umorerItemmetafee.meta_value Fee,"
                    + " umempname.meta_value EName"
                    + " FROM wp_posts u"                    
                    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"              
                    + " LEFT OUTER JOIN wp_postmeta umtransaction on umtransaction.meta_key = '_transaction_id' And umtransaction.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umempname on umempname.meta_key = 'employee_name' And umempname.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_woocommerce_order_items umorerItem on umorerItem.order_item_type='line_item' And umorerItem.order_id = u.ID"
                    + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmeta on umorerItemmeta.meta_key='_line_subtotal' And umorerItemmeta.order_item_id = umorerItem.order_id"
                    + " LEFT OUTER JOIN wp_woocommerce_order_items umorerfee on umorerfee.order_item_type='fee' And umorerfee.order_id = u.ID"
                    + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmetafee on umorerItemmetafee.meta_key='_line_total' And umorerItemmetafee.order_item_id = umorerfee.order_id"
                    + " WHERE post_type IN('shop_order') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND ID IN (SELECT post_id FROM wp_postmeta WHERE meta_key='_payment_method' AND meta_value='podium') order by post_status";

                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());                    
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Podiumdate"].ToString()))
                    uobj.created_date = Convert.ToDateTime(ds1.Tables[0].Rows[i]["Podiumdate"].ToString());
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["Discount"].ToString();
                    uobj.tax = ds1.Tables[0].Rows[i]["Tax"].ToString();
                    uobj.total = ds1.Tables[0].Rows[i]["Total"].ToString();
                    uobj.customer_id = ds1.Tables[0].Rows[i]["TransactionID"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["EName"].ToString();
                    uobj.fee = ds1.Tables[0].Rows[i]["Fee"].ToString();
                    uobj.subtotal = ds1.Tables[0].Rows[i]["SubTotal"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetPodiumOrderDetails(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    + " format(umatotal.meta_value, 2) Total,"
                    + " format(umadiscount.meta_value, 2) Discount,"
                    + " case when post_status in ('wc-refunded') then  (format(-umatotal.meta_value, 2)) else format((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)), 2) end CommissionableAmount,"
                    + " format(umatax.meta_value, 2) Tax,"
                    + " post_date Podiumdate,"
                    + " umtransaction.meta_value TransactionID,"
                    + " format((umatotal.meta_value - (IFNULL(umatax.meta_value,0) +IFNULL(umorerItemmetafee.meta_value,0))) + umadiscount.meta_value,2) SubTotal,"
                    + " format(umorerItemmetafee.meta_value,2) Fee,"
                    + " umempname.meta_value EName"
                    + " FROM wp_posts u"
                    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"                
                    + " LEFT OUTER JOIN wp_postmeta umtransaction on umtransaction.meta_key = '_transaction_id' And umtransaction.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umempname on umempname.meta_key = 'employee_name' And umempname.post_id = u.ID"

                    //+ " LEFT OUTER JOIN wp_woocommerce_order_items umorerItem on umorerItem.order_item_type='line_item' And umorerItem.order_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmeta on umorerItemmeta.meta_key='_line_subtotal' And umorerItemmeta.order_item_id = umorerItem.order_id"

                    + " LEFT OUTER JOIN wp_woocommerce_order_items umorerfee on umorerfee.order_item_type='fee' And umorerfee.order_id = u.ID"
                    + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmetafee on umorerItemmetafee.meta_key='_fee_amount' And umorerItemmetafee.order_item_id = umorerfee.order_item_id"
                    + " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') and  DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' order by post_status";

                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Podiumdate"].ToString()))
                        uobj.created_date = Convert.ToDateTime(ds1.Tables[0].Rows[i]["Podiumdate"].ToString());
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Discount"].ToString()))
                        uobj.address = "$" + ds1.Tables[0].Rows[i]["Discount"].ToString();
                    else
                        uobj.address = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Tax"].ToString()))
                        uobj.tax = "$" + ds1.Tables[0].Rows[i]["Tax"].ToString();
                    else
                        uobj.tax = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
                    else
                        uobj.total = "";
                    uobj.customer_id = ds1.Tables[0].Rows[i]["TransactionID"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["EName"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                        uobj.fee = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                    else
                        uobj.fee = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["SubTotal"].ToString()))
                        uobj.subtotal = "$" + ds1.Tables[0].Rows[i]["SubTotal"].ToString();
                    else
                        uobj.subtotal = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString()))
                        uobj.Discount = "$"+ ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString();
                    else                
                        uobj.Discount = "";
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetPodiumEmployeeOrderDetails(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    //ssql = "SELECT count(ID) CunrID,"
                    //+ " format(sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),2) CommissionableAmount,"
                    //+ " umempname.meta_value EName," 
                    //+ " format(sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)))/count(ID),2) AOV,"
                    //+ " format(((select Comm_Rate from  wp_agent_commission where AOV_Range1 <= (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)))/count(u.id)) and AOV_Range2 >= (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)))/count(u.id)) ) * (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))))) /100,2)  CommissionEarned,"
                    //+ " format(((select Comm_Rate from  wp_agent_commission where AOV_Range1 <= (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)))/count(u.id)) and AOV_Range2 >= (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)))/count(u.id)) )),2)  Valued"
                    //+ " FROM wp_posts u"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_postmeta umempname on umempname.meta_key = 'employee_name' And umempname.post_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_woocommerce_order_items umorerfee on umorerfee.order_item_type='fee' And umorerfee.order_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmetafee on umorerItemmetafee.meta_key='_fee_amount' And umorerItemmetafee.order_item_id = umorerfee.order_item_id "
                    //+ " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') and  DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' group by EName";
                    ssql = "SELECT count(ID) CunrID,"
                        + " format(sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),2)  CommissionableAmount,"
                  //+ " format(sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0),2) CommissionableAmount,"
                  + " umempname.meta_value EName,"
                  + " format((sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0))/count(ID),2) AOV,"
                  + " format(((select Comm_Rate from  wp_agent_commission where AOV_Range1 <=  (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0))/count(u.id)  and AOV_Range2 >=  (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0))/count(u.id) )),2) Valued"
                  + " FROM wp_posts u"
                  + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID and post_status IN ('wc-completed','wc-processing')"
                  + " LEFT OUTER JOIN wp_postmeta umatotalrefunded on umatotalrefunded.meta_key = '_order_total' And umatotalrefunded.post_id = u.ID and post_status IN ('wc-refunded')"
                  + " LEFT OUTER JOIN wp_postmeta umempname on umempname.meta_key = 'employee_name' And umempname.post_id = u.ID "
                  + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID "
                  + " LEFT OUTER JOIN wp_woocommerce_order_items umorerfee on umorerfee.order_item_type='fee' And umorerfee.order_id = u.ID "
                  + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmetafee on umorerItemmetafee.meta_key='_fee_amount' And umorerItemmetafee.order_item_id = umorerfee.order_item_id "
                  + " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') and  DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' group by EName";
                }
                else
                {
                    ssql = "";
                }

                decimal valued = 0;
                decimal CommissionValue = 0;
                decimal total = 0;
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["CunrID"].ToString());

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString()))
                        uobj.fee = "$" + ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString();
                    else
                        uobj.fee = "";
                    uobj.first_name = ds1.Tables[0].Rows[i]["EName"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["AOV"].ToString()))
                        uobj.tax = "$" + ds1.Tables[0].Rows[i]["AOV"].ToString();
                    else
                        uobj.tax = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Valued"].ToString()))
                    {
                        valued = Convert.ToDecimal(ds1.Tables[0].Rows[i]["Valued"].ToString());
                        CommissionValue = Convert.ToDecimal(ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString());
                        total = (valued * CommissionValue) / 100;
                        uobj.total = "$" + total.ToString("#.##"); 
                    }
                    else
                        uobj.total = "";
                     
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataTable GetState()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select distinct State,StateFullName from ZIPCodes1 where state in ('CA','CT','RI') order by StateFullName";
                dtr = DAL.SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetTaxableState()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select distinct State,StateFullName from ZIPCodes1 where state in ('CA', 'CO', 'CT', 'IL', 'IN', 'MI', 'MS', 'NC', 'NE', 'NJ', 'NM', 'PA', 'TN', 'TX', 'WA', 'AR', 'FL', 'GA', 'IA', 'MO', 'OH', 'SC', 'WI') order by StateFullName";
                dtr = DAL.SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetSaleTaxState()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select distinct State,StateFullName from ZIPCodes1 where state in ('CA','CO','CT','IL','IN','MI','MS','NE','NJ','NM','NC','PA','TX','WA','TN') order by StateFullName";
                dtr = DAL.SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static void GetMRF(string from_date, string to_date,string txtState)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    if (txtState == "ALL")
                    {
                        ssql = "SELECT ID,"
                        + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                        + " format(umatotal.meta_value, 2) Total,"
                        + " format(ummrffeevalue.meta_value, 2) MRF,"
                        + " format(umrefunfee.meta_value, 2) RefundFee,"                 
                        + " umrefunded.meta_value refunded,"
                        + " u.post_date  PaidDAte,"
                        + " (select group_concat(uim.meta_value,' x ',ui.order_item_name) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' and umastate.meta_value IN ('CA','CO','RI') And umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umrefunded on umrefunded.meta_key = '_refunded_payment' And umrefunded.post_id = u.ID"                   
                         + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_woocommerce_order_items ummrfee on order_item_name='State Recycling Fee' AND order_item_type='fee' And ummrfee.order_id = u.ID"
                        + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta  ummrffeevalue on ummrffeevalue.meta_key = '_line_total' And ummrffeevalue.order_item_id  = ummrfee.order_item_id"
                        + " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') AND post_type IN ('shop_order','shop_order_refund') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    }
                    else
                    {
                        ssql = "SELECT ID,"
                       + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                        + " format(umatotal.meta_value, 2) Total,"
                        + " format(ummrffeevalue.meta_value, 2) MRF,"
                        + " format(umrefunfee.meta_value, 2) RefundFee,"         
                        + " umrefunded.meta_value refunded,"
                        + " u.post_date  PaidDAte,"
                        + " (select group_concat(uim.meta_value,' x ',ui.order_item_name) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' and umastate.meta_value IN ('CA','CO','RI') And umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umrefunded on umrefunded.meta_key = '_refunded_payment' And umrefunded.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_woocommerce_order_items ummrfee on order_item_name='State Recycling Fee' AND order_item_type='fee' And ummrfee.order_id = u.ID"
                        + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta  ummrffeevalue on ummrffeevalue.meta_key = '_line_total' And ummrffeevalue.order_item_id  = ummrfee.order_item_id"
                        + " WHERE umastate.meta_value =  '" + txtState + "' and  post_status IN ('wc-completed','wc-processing','wc-refunded') AND post_type IN ('shop_order','shop_order_refund') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' order by post_status";
                    }
                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["PaidDAte"].ToString()))
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["PaidDAte"].ToString());
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["MRF"].ToString()))
                        uobj.orderstatus = "$" + ds1.Tables[0].Rows[i]["MRF"].ToString();
                    uobj.orderstatus = "$0";
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["refunded"].ToString()))
                        uobj.first_name = "No";
                    else
                        uobj.first_name = "Yes";
                    uobj.orde_item_name = ds1.Tables[0].Rows[i]["itemname"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
                    else
                        uobj.total = "$0";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["RefundFee"].ToString()))
                        uobj.fee = "$" + ds1.Tables[0].Rows[i]["RefundFee"].ToString();
                    else
                        uobj.fee = "$0";
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetMattress(string from_date, string to_date, string txtStatus)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    if (txtStatus == "ALL")
                    {
                        ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                        + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"  
                        + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                        + " format(umatotal.meta_value, 2) Total,"
                        + " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"                       
                        + " format(umadiscount.meta_value, 2) Discount,"
                        + " format(umatax.meta_value, 2) Tax,"
                        + " format(umrefunfee.meta_value, 2) RefundFee,"         
                        + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name,"
                        + " (select group_concat(ui.order_item_name,' x ',uim.meta_value ) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"         
                        + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                        + " WHERE ID IN (SELECT order_id FROM wp_woocommerce_order_items WHERE order_item_id IN (SELECT order_item_id FROM wp_woocommerce_order_itemmeta WHERE meta_key='_product_id' AND meta_value IN ('118','61172'))) AND post_type='shop_order' AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    }
                    else
                    {
                        ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                        + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"
                        + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                        + " format(umatotal.meta_value, 2) Total,"
                        + " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"
                        + " format(umadiscount.meta_value, 2) Discount,"
                        + " format(umatax.meta_value, 2) Tax,"
                        + " format(umrefunfee.meta_value, 2) RefundFee,"
                        + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name,"
                        + " (select group_concat(ui.order_item_name,' x ',uim.meta_value ) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                        + " WHERE post_status = '" + txtStatus + "' and ID IN (SELECT order_id FROM wp_woocommerce_order_items WHERE order_item_id IN (SELECT order_item_id FROM wp_woocommerce_order_itemmeta WHERE meta_key='_product_id' AND meta_value IN ('118','61172'))) AND post_type='shop_order' AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    }
                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type =   ds1.Tables[0].Rows[i]["ID"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());                 
                    uobj.orderstatus =   ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["shippingaddress"].ToString();
                    uobj.billing_address_1 = ds1.Tables[0].Rows[i]["billingaddress"].ToString();                    
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();   
                    uobj.orde_item_name = ds1.Tables[0].Rows[i]["itemname"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.total = ds1.Tables[0].Rows[i]["Total"].ToString();
                    else
                        uobj.total = "0";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["RefundFee"].ToString()))
                        uobj.fee = ds1.Tables[0].Rows[i]["RefundFee"].ToString();
                    else
                        uobj.fee = "0";

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping_amount"].ToString()))
                        uobj.shipping_amount =  ds1.Tables[0].Rows[i]["shipping_amount"].ToString();
                    else
                        uobj.shipping_amount = "0"; 
                    uobj.handling_amount = "0";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Discount"].ToString()))
                        uobj.Discount =  ds1.Tables[0].Rows[i]["Discount"].ToString();
                    else
                        uobj.Discount = "0";

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Tax"].ToString()))
                        uobj.tax =  ds1.Tables[0].Rows[i]["Tax"].ToString();
                    else
                        uobj.tax = "0";

                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetTaxJarOrder(string from_date, string to_date, string txtState)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    if (txtState == "ALL")
                    {
                        ssql = "SELECT 'web' provider,'Order' transaction_type,'' transaction_reference_id, ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                        // + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                        + " umadd.meta_value shiptostreet,"
                        + " umacity.meta_value shiptocity,"
                        + " umastate.meta_value shiptostate,"
                        + " umapostalcode.meta_value shiptozip,"
                        + " umacountry.meta_value shiptocountrycode,"

                        + " umaddbilling.meta_value billingstreet,"
                        + " umacitybilling.meta_value billingcity,"
                        + " umastatebilling.meta_value billingstate,"
                        + " umapostalcodebilling.meta_value billingzip,"
                        + " umacountrybilling.meta_value billingcountry,"
                        + " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"
                        + " format(umatotal.meta_value, 2) - format(umatax.meta_value, 2) Total,"
                        + " format(umadiscount.meta_value, 2) Discount,"
                        + " format(umatax.meta_value, 2) Tax,"
                        + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state'  AND umastate.meta_value IN ('CA', 'CO', 'CT', 'IL', 'IN', 'MI', 'MS', 'NC', 'NE', 'NJ', 'NM', 'PA', 'TN', 'TX', 'WA', 'AR', 'FL', 'GA', 'IA', 'MO', 'OH', 'SC', 'WI') And umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"

                        + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"

                        + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                        + " WHERE umastate.post_id IN (SELECT ID FROM wp_posts WHERE post_status IN ('wc-completed','wc-processing') AND post_type='shop_order' AND  DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' )  order by post_status";
                    }
                    else
                    {
                        ssql = "SELECT 'web' provider,'Order' transaction_type,'' transaction_reference_id, ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                         // + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                         + " umadd.meta_value shiptostreet,"
                         + " umacity.meta_value shiptocity,"
                         + " umastate.meta_value shiptostate,"
                         + " umapostalcode.meta_value shiptozip,"
                         + " umacountry.meta_value shiptocountrycode,"

                         + " umaddbilling.meta_value billingstreet,"
                         + " umacitybilling.meta_value billingcity,"
                         + " umastatebilling.meta_value billingstate,"
                         + " umapostalcodebilling.meta_value billingzip,"
                         + " umacountrybilling.meta_value billingcountry,"
                         + " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"
                         + " format(umatotal.meta_value, 2) - format(umatax.meta_value, 2) Total,"
                         + " format(umadiscount.meta_value, 2) Discount,"
                         + " format(umatax.meta_value, 2) Tax,"
                         + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                         + " FROM wp_posts u"
                         + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state'  AND umastate.meta_value IN ('CA', 'CO', 'CT', 'IL', 'IN', 'MI', 'MS', 'NC', 'NE', 'NJ', 'NM', 'PA', 'TN', 'TX', 'WA', 'AR', 'FL', 'GA', 'IA', 'MO', 'OH', 'SC', 'WI') And umastate.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"

                         + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"

                         + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                         + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                         + " WHERE umastate.meta_value =  '" + txtState + "' and  umastate.post_id IN (SELECT ID FROM wp_posts WHERE post_status IN ('wc-completed','wc-processing') AND post_type='shop_order' AND  DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' )  order by post_status";
                    }




                    DataSet ds1 = new DataSet();
                    ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                        uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                        uobj.tax = ds1.Tables[0].Rows[i]["Tax"].ToString();
                        uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                        uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["shiptostreet"].ToString();
                        uobj.shipping_city = ds1.Tables[0].Rows[i]["shiptocity"].ToString();
                        uobj.shipping_state = ds1.Tables[0].Rows[i]["shiptostate"].ToString();
                        uobj.shipping_postcode = ds1.Tables[0].Rows[i]["shiptozip"].ToString();
                        uobj.shipping_country = ds1.Tables[0].Rows[i]["shiptocountrycode"].ToString();
                        uobj.billing_address_1 = ds1.Tables[0].Rows[i]["billingstreet"].ToString();
                        uobj.billing_city = ds1.Tables[0].Rows[i]["billingcity"].ToString();
                        uobj.billing_country = ds1.Tables[0].Rows[i]["billingcountry"].ToString();
                        uobj.billing_state = ds1.Tables[0].Rows[i]["billingstate"].ToString();
                        uobj.billing_postcode = ds1.Tables[0].Rows[i]["billingzip"].ToString();
                        uobj.provider = ds1.Tables[0].Rows[i]["provider"].ToString();
                        uobj.transaction_type = ds1.Tables[0].Rows[i]["transaction_type"].ToString();
                        uobj.transaction_reference_id = ds1.Tables[0].Rows[i]["transaction_reference_id"].ToString();
                        uobj.shipping_amount = ds1.Tables[0].Rows[i]["shipping_amount"].ToString();
                        uobj.handling_amount = ds1.Tables[0].Rows[i]["handling_amount"].ToString();
                        uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                        uobj.Discount = ds1.Tables[0].Rows[i]["Discount"].ToString();
                        uobj.total = ds1.Tables[0].Rows[i]["Total"].ToString();
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetSalesTaxRefunded(string from_date, string to_date, string txtState)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    if (txtState == "ALL")
                    {
                        ssql = "SELECT distinct ID,post_date,"
                        + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"
                        + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"                    
                        + " format(umatax.meta_value, 2) Tax,"
                        + " format(umrefunfee.meta_value, 2) RefundFee"  
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.meta_value IN ('CA','CO','CT','IL','IN','MI','MS','NE','NJ','NM','NC','PA','TX','WA','TN') and umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"                   
                        + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"            
                        + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"        
                        + " WHERE post_type IN ('shop_order_refund') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    }
                    else
                    {
                        ssql = "SELECT distinct ID,post_date,"
                        + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"
                        + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                        + " format(umatax.meta_value, 2) Tax,"
                        + " format(umrefunfee.meta_value, 2) RefundFee"
                        + " FROM wp_posts u"
                        + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And  umastate.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                        + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID" 
                        + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"         
                        + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"         
                        + " WHERE post_type IN ('shop_order_refund') and umastate.meta_value =  '" + txtState + "' AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    }
                }
                else
                {
                    ssql = "";
                }


                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                        uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                   
                    uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["shippingaddress"].ToString();
                    uobj.billing_address_1 = ds1.Tables[0].Rows[i]["billingaddress"].ToString();
                   
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["RefundFee"].ToString()))
                        uobj.fee = "$"+ ds1.Tables[0].Rows[i]["RefundFee"].ToString();
                    else
                        uobj.fee = "$0";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Tax"].ToString()))
                        uobj.tax = "$"+ ds1.Tables[0].Rows[i]["Tax"].ToString();
                    else
                        uobj.tax = "$0";

                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

    }
}