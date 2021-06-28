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
                    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '__billing_last_name' And umlname.post_id = u.ID"
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
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString()); 
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    uobj.total = ds1.Tables[0].Rows[i]["Total"].ToString();
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
                    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '__billing_last_name' And umlname.post_id = u.ID"
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
                    + " umpodiumdate.meta_value Podiumdate,"
                    + " umtransaction.meta_value TransactionID,"
                    + " umorerItemmeta.meta_value SubTotal,"
                    + " umorerItemmetafee.meta_value Fee,"
                    + " umempname.meta_value EName"
                    + " FROM wp_posts u"                    
                    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    + " LEFT OUTER JOIN wp_postmeta umpodiumdate on umpodiumdate.meta_key = '_podium_paid_date' And umpodiumdate.post_id = u.ID"
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
    }
}