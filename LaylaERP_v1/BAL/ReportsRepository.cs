using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using LaylaERP.Models;

namespace LaylaERP.BAL
{
    public class ReportsRepository
    {
        public static List<Export_Details> exportorderlist = new List<Export_Details>();
        public static List<Export_Details> exportorderlistchart = new List<Export_Details>();
        
        public static void GetAjBaseData(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);              
                    //ssql = "SELECT ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //+ " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //+ " cast(umatotal.meta_value as decimal(10,2)) Total,"
                    //+ " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                    //+ " FROM wp_posts u"
                    //+ " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //+ " WHERE post_type IN('shop_order') AND cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND ID IN (SELECT order_id FROM wp_woocommerce_order_items WHERE order_item_id  IN (SELECT order_item_id FROM wp_woocommerce_order_itemmeta  WHERE meta_key = '_product_id' AND meta_value IN(612995, 611286))) order by post_status";
                    SqlParameter[] parameters =
                       {
                            new SqlParameter("@qflag", "PO"),
                            new SqlParameter("@fromdate", from_date),
                             new SqlParameter("@todate", to_date)
                       };
                    ds1 = SQLHelper.ExecuteDataSet("erp_adjustablebasereport_List", parameters);
                }
                else
                {
                    ssql = "";
                }               
                //ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
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
                DataSet ds1 = new DataSet();

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    //ssql = "SELECT 'web' provider,'Order' transaction_type,'' transaction_reference_id, ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //// + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //+ " umadd.meta_value shiptostreet,"
                    //+ " umacity.meta_value shiptocity,"
                    //+ " umastate.meta_value shiptostate,"
                    //+ " umapostalcode.meta_value shiptozip,"
                    //+ " umacountry.meta_value shiptocountrycode,"

                    //+ " umaddbilling.meta_value billingstreet,"
                    //+ " umacitybilling.meta_value billingcity,"
                    //+ " umastatebilling.meta_value billingstate,"
                    //+ " umapostalcodebilling.meta_value billingzip,"
                    //+ " umacountrybilling.meta_value billingcountry,"
                    //+ " cast(umashipingamount.meta_value as decimal(10,2)) shipping_amount, 0 handling_amount,"
                    //+ " cast(umatotal.meta_value as decimal(10,2)) - cast(umatax.meta_value as decimal(10,2)) Total,"
                    //+ " cast(umadiscount.meta_value as decimal(10,2)) Discount,"
                    //+ " cast(umatax.meta_value as decimal(10,2)) Tax,"
                    //+ " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                    //+ " FROM wp_posts u"
                    //+ " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"

                    //+ " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"

                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                    //+ " WHERE umastate.post_id IN (SELECT ID FROM wp_posts WHERE post_status IN ('wc-completed') AND post_type='shop_order' AND  cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' ) AND umastate.meta_value LIKE 'AZ' order by post_status";
                    SqlParameter[] parameters =
                     {
                            new SqlParameter("@qflag", "PO"),
                            new SqlParameter("@fromdate", from_date),
                             new SqlParameter("@todate", to_date)
                       };
                    ds1 = SQLHelper.ExecuteDataSet("erp_arizonasales_List", parameters);
                }
                else
                {
                    ssql = "";
                }


             
               // ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
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
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    //ssql = "SELECT ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //+ " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //+ " cast(umatotal.meta_value as decimal(10,2)) Total,"
                    //+ " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name,"
                    //// + " umitem.order_item_name orderItem,"
                    ////+ " (select group_concat(ui.order_item_name,' x ',uim.meta_value) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                    ////+" stuff((select(ui.order_item_name + ' x ' + uim.meta_value) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' for xml path('')),1,1,'')  itemname"
                    //+ " CONCAT(ui.order_item_name,' x ',+uim.meta_value) as itemname"
                    //+ " FROM wp_posts u"
                    //+ " LEFT join wp_woocommerce_order_items ui on ui.order_id = u.ID"
                    //+ " LEFT join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'"

                    //+ " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    ////+ " WHERE post_type IN('shop_order') AND cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND umatotal.meta_value IN ('0', '0.00') order by post_status";
                    //+ " WHERE ui.order_item_type = 'line_item' AND post_type IN('shop_order') AND cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND umatotal.meta_value IN ('0', '0.00') order by post_status";


                    SqlParameter[] parameters =
                       {
                            new SqlParameter("@qflag", "PO"),
                            new SqlParameter("@fromdate", from_date),
                             new SqlParameter("@todate", to_date)
                       };
                    ds1 = SQLHelper.ExecuteDataSet("erp_ZeroOrder_List", parameters);
                }
                else
                {
                    ssql = "";
                }


                
                //ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    uobj.orde_item_name = ds1.Tables[0].Rows[i]["itemname"].ToString();
                    uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
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
                    + " cast(umatotal.meta_value as decimal(10,2)) Total,"
                    + " cast(umadiscount.meta_value as decimal(10,2)) Discount,"
                    + " cast(umatax.meta_value as decimal(10,2)) Tax,"
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
                    + " WHERE post_type IN('shop_order') AND cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' AND ID IN (SELECT post_id FROM wp_postmeta WHERE meta_key='_payment_method' AND meta_value='podium') order by post_status";

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
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "PO"),
                    new SqlParameter("@fromdate", from_date),
                     new SqlParameter("@todate", to_date)
                };

                    ds1 = SQLHelper.ExecuteDataSet("erp_CommissionEarnAgent", parameters);



                    //DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    //fromdate = DateTime.Parse(from_date);
                    //todate = DateTime.Parse(to_date);

                    //ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //+ " format(umatotal.meta_value, 2) Total,"
                    //+ " format(umadiscount.meta_value, 2) Discount,"
                    //+ " case when post_status in ('wc-refunded') then  (format(-umatotal.meta_value, 2)) else format((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0)), 2) end CommissionableAmount,"
                    //+ " format(umatax.meta_value, 2) Tax,"
                    //+ " post_date Podiumdate,"
                    //+ " umtransaction.meta_value TransactionID,"
                    //+ " format((umatotal.meta_value - (IFNULL(umatax.meta_value,0) +IFNULL(umorerItemmetafee.meta_value,0))) + umadiscount.meta_value,2) SubTotal,"
                    //+ " format(umorerItemmetafee.meta_value,2) Fee,"
                    //+ " umempname.meta_value EName"
                    //+ " FROM wp_posts u"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"                
                    //+ " LEFT OUTER JOIN wp_postmeta umtransaction on umtransaction.meta_key = '_transaction_id' And umtransaction.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umempname on umempname.meta_key = 'employee_name' And umempname.post_id = u.ID"

                    ////+ " LEFT OUTER JOIN wp_woocommerce_order_items umorerItem on umorerItem.order_item_type='line_item' And umorerItem.order_id = u.ID"
                    ////+ " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmeta on umorerItemmeta.meta_key='_line_subtotal' And umorerItemmeta.order_item_id = umorerItem.order_id"

                    //+ " LEFT OUTER JOIN wp_woocommerce_order_items umorerfee on umorerfee.order_item_type='fee' And umorerfee.order_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmetafee on umorerItemmetafee.meta_key='_fee_amount' And umorerItemmetafee.order_item_id = umorerfee.order_item_id"
                    //+ " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') and  cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' order by post_status";



                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Podiumdate"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["Podiumdate"].ToString();
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
                        //if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["SubTotal"].ToString()))
                        //    uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["SubTotal"].ToString()) + ;
                        //else
                        uobj.subtotal = "$" + (Convert.ToDecimal(ds1.Tables[0].Rows[i]["Total"].ToString()) - Convert.ToDecimal(ds1.Tables[0].Rows[i]["Tax"].ToString()) - Convert.ToDecimal(ds1.Tables[0].Rows[i]["Fee"].ToString()) + Convert.ToDecimal(ds1.Tables[0].Rows[i]["Discount"].ToString()));
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["CommissionableAmount"].ToString();
                        else
                            uobj.Discount = "";
                        exportorderlist.Add(uobj);
                    }
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
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {
                    SqlParameter[] parameters =
                        {
                            new SqlParameter("@qflag", "CE"),
                            new SqlParameter("@fromdate", from_date),
                             new SqlParameter("@todate", to_date)
                        };

                    ds1 = SQLHelper.ExecuteDataSet("erp_CommissionEarnAgent", parameters);

                    //DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    //fromdate = DateTime.Parse(from_date);
                    //todate = DateTime.Parse(to_date);

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
                    //  ssql = "SELECT count(ID) CunrID,"
                    //      + " format(sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),2)  CommissionableAmount,"
                    ////+ " format(sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0),2) CommissionableAmount,"
                    //+ " umempname.meta_value EName,"
                    //+ " format((sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0))/count(ID),2) AOV,"
                    //+ " format(((select Comm_Rate from  wp_agent_commission where AOV_Range1 <=  (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0))/count(u.id)  and AOV_Range2 >=  (sum((umatotal.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))) - IFNULL(sum((umatotalrefunded.meta_value) - (IFNULL(umatax.meta_value,0)+ IFNULL(umorerItemmetafee.meta_value,0))),0))/count(u.id) )),2) Valued"
                    //+ " FROM wp_posts u"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID and post_status IN ('wc-completed','wc-processing')"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotalrefunded on umatotalrefunded.meta_key = '_order_total' And umatotalrefunded.post_id = u.ID and post_status IN ('wc-refunded')"
                    //+ " LEFT OUTER JOIN wp_postmeta umempname on umempname.meta_key = 'employee_name' And umempname.post_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_woocommerce_order_items umorerfee on umorerfee.order_item_type='fee' And umorerfee.order_id = u.ID "
                    //+ " LEFT OUTER JOIN wp_woocommerce_order_itemmeta umorerItemmetafee on umorerItemmetafee.meta_key='_fee_amount' And umorerItemmetafee.order_item_id = umorerfee.order_item_id "
                    //+ " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') and  DATE(post_date) >= '" + from_date + "' and DATE(post_date)<= '" + to_date + "' group by EName";
                }
                else
                {
                    ssql = "";
                }

                decimal valued = 0;
                decimal CommissionValue = 0;
                decimal total = 0;

                // ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
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

        public static void GetMRF(string from_date, string to_date, string txtState)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    SqlParameter[] parameters =
                  {
                            new SqlParameter("@qflag", txtState),
                            new SqlParameter("@fromdate", fromdate),
                             new SqlParameter("@todate", todate)
                        };

                    ds1 = SQLHelper.ExecuteDataSet("erp_mrfdetailsreports", parameters);


                    //ssql = "SELECT ID,"
                    //    + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //    + " format(umatotal.meta_value, 2) Total,"
                    //    + " format(ummrffeevalue.meta_value, 2) MRF,"
                    //    + " format(umrefunfee.meta_value, 2) RefundFee,"                 
                    //    + " umrefunded.meta_value refunded,"
                    //    + " u.post_date  PaidDAte,"
                    //    + " (select group_concat(uim.meta_value,' x ',ui.order_item_name) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                    //    + " FROM wp_posts u"
                    //    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' and umastate.meta_value IN ('CA','CO','RI') And umastate.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umrefunded on umrefunded.meta_key = '_refunded_payment' And umrefunded.post_id = u.ID"                   
                    //     + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_woocommerce_order_items ummrfee on order_item_name='State Recycling Fee' AND order_item_type='fee' And ummrfee.order_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta  ummrffeevalue on ummrffeevalue.meta_key = '_line_total' And ummrffeevalue.order_item_id  = ummrfee.order_item_id"
                    //    + " WHERE post_status IN ('wc-completed','wc-processing','wc-refunded') AND post_type IN ('shop_order','shop_order_refund') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    //}
                    //else
                    //{
                    //    ssql = "SELECT ID,"
                    //   + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //    + " format(umatotal.meta_value, 2) Total,"
                    //    + " format(ummrffeevalue.meta_value, 2) MRF,"
                    //    + " format(umrefunfee.meta_value, 2) RefundFee,"         
                    //    + " umrefunded.meta_value refunded,"
                    //    + " u.post_date  PaidDAte,"
                    //    + " (select group_concat(uim.meta_value,' x ',ui.order_item_name) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                    //    + " FROM wp_posts u"
                    //    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' and umastate.meta_value IN ('CA','CO','RI') And umastate.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umrefunded on umrefunded.meta_key = '_refunded_payment' And umrefunded.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_woocommerce_order_items ummrfee on order_item_name='State Recycling Fee' AND order_item_type='fee' And ummrfee.order_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_woocommerce_order_itemmeta  ummrffeevalue on ummrffeevalue.meta_key = '_line_total' And ummrffeevalue.order_item_id  = ummrfee.order_item_id"
                    //    + " WHERE umastate.meta_value =  '" + txtState + "' and  post_status IN ('wc-completed','wc-processing','wc-refunded') AND post_type IN ('shop_order','shop_order_refund') AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' order by post_status";
                    //}
                }
                else
                {
                    ssql = "";
                }


                // DataSet ds1 = new DataSet();
                // ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["PaidDAte"].ToString()))
                        uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["PaidDAte"].ToString());
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["MRF"].ToString()))
                        uobj.orderstatus = "$" + ds1.Tables[0].Rows[i]["MRF"].ToString();
                    else
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
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    SqlParameter[] parameters =
                  {
                            new SqlParameter("@qflag", txtStatus),
                            new SqlParameter("@fromdate", fromdate),
                             new SqlParameter("@todate", todate)
                        };

                    ds1 = SQLHelper.ExecuteDataSet("erp_mrfreports", parameters);
                    //if (txtStatus == "ALL")
                    //{
                    //ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //+ " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"  
                    //+ " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                    //+ " format(umatotal.meta_value, 2) Total,"
                    //+ " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"                       
                    //+ " format(umadiscount.meta_value, 2) Discount,"
                    //+ " format(umatax.meta_value, 2) Tax,"
                    //+ " format(umrefunfee.meta_value, 2) RefundFee,"         
                    //+ " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name,"
                    //+ " (select group_concat(ui.order_item_name,' x ',uim.meta_value ) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                    //+ " FROM wp_posts u"
                    //+ " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"         
                    //+ " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //+ " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                    //+ " WHERE ID IN (SELECT order_id FROM wp_woocommerce_order_items WHERE order_item_id IN (SELECT order_item_id FROM wp_woocommerce_order_itemmeta WHERE meta_key='_product_id' AND meta_value IN ('118','61172'))) AND post_type='shop_order' AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";


                    //}
                    //else
                    //{
                    //    ssql = "SELECT distinct ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //    + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"
                    //    + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                    //    + " format(umatotal.meta_value, 2) Total,"
                    //    + " format(umashipingamount.meta_value, 2) shipping_amount, 0 handling_amount,"
                    //    + " format(umadiscount.meta_value, 2) Discount,"
                    //    + " format(umatax.meta_value, 2) Tax,"
                    //    + " format(umrefunfee.meta_value, 2) RefundFee,"
                    //    + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name,"
                    //    + " (select group_concat(ui.order_item_name,' x ',uim.meta_value ) from wp_woocommerce_order_items ui inner join wp_woocommerce_order_itemmeta uim on uim.order_item_id = ui.order_item_id and uim.meta_key = '_qty'  where ui.order_id = u.ID and ui.order_item_type = 'line_item' )  itemname"
                    //    + " FROM wp_posts u"
                    //    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                    //    + " WHERE post_status = '" + txtStatus + "' and ID IN (SELECT order_id FROM wp_woocommerce_order_items WHERE order_item_id IN (SELECT order_item_id FROM wp_woocommerce_order_itemmeta WHERE meta_key='_product_id' AND meta_value IN ('118','61172'))) AND post_type='shop_order' AND DATE(post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "'   order by post_status";
                    //}
                }
                else
                {
                    ssql = "";
                }


                // DataSet ds1 = new DataSet();
                // ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = ds1.Tables[0].Rows[i]["ID"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                        uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["post_status"].ToString();
                    uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["shippingaddress"].ToString();
                    uobj.billing_address_1 = ds1.Tables[0].Rows[i]["billingaddress"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    uobj.orde_item_name = ds1.Tables[0].Rows[i]["itemname"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
                    else
                        uobj.total = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["RefundFee"].ToString()))
                        uobj.fee = "$" + ds1.Tables[0].Rows[i]["RefundFee"].ToString();
                    else
                        uobj.fee = "";

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping_amount"].ToString()))
                        uobj.shipping_amount = "$" + ds1.Tables[0].Rows[i]["shipping_amount"].ToString();
                    else
                        uobj.shipping_amount = "";
                    uobj.handling_amount = "";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Discount"].ToString()))
                        uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Discount"].ToString();
                    else
                        uobj.Discount = "";

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Tax"].ToString()))
                        uobj.tax = "$" + ds1.Tables[0].Rows[i]["Tax"].ToString();
                    else
                        uobj.tax = "";

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
                    DataSet ds1 = new DataSet();
                    //if (txtState == "ALL")
                    //{
                    //    ssql = "SELECT 'web' provider,'Order' transaction_type,'' transaction_reference_id, ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //    // + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //    + " umadd.meta_value shiptostreet,"
                    //    + " umacity.meta_value shiptocity,"
                    //    + " umastate.meta_value shiptostate,"
                    //    + " umapostalcode.meta_value shiptozip,"
                    //    + " umacountry.meta_value shiptocountrycode,"

                    //    + " umaddbilling.meta_value billingstreet,"
                    //    + " umacitybilling.meta_value billingcity,"
                    //    + " umastatebilling.meta_value billingstate,"
                    //    + " umapostalcodebilling.meta_value billingzip,"
                    //    + " umacountrybilling.meta_value billingcountry,"
                    //    + " cast(umashipingamount.meta_value as decimal(10,2)) shipping_amount, 0 handling_amount,"
                    //    + " cast(umatotal.meta_value as decimal(10,2)) - cast(umatax.meta_value as decimal(10,2)) Total,"
                    //    + " cast(umadiscount.meta_value as decimal(10,2)) Discount,"
                    //    + " cast(umatax.meta_value as decimal(10,2)) Tax,"
                    //    + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                    //    + " FROM wp_posts u"
                    //    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state'  AND umastate.meta_value IN ('CA', 'CO', 'CT', 'IL', 'IN', 'MI', 'MS', 'NC', 'NE', 'NJ', 'NM', 'PA', 'TN', 'TX', 'WA', 'AR', 'FL', 'GA', 'IA', 'MO', 'OH', 'SC', 'WI') And umastate.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"

                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"

                    //    + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                    //    + " WHERE umastate.post_id IN (SELECT ID FROM wp_posts WHERE post_status IN ('wc-completed','wc-processing') AND post_type='shop_order' AND  cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' ) and cast(umatax.meta_value as decimal(10,2)) <> 0.00 order by post_status";
                    //}
                    //else
                    //{
                    //    ssql = "SELECT 'web' provider,'Order' transaction_type,'' transaction_reference_id, ID,post_date,REPLACE(u.post_status, 'wc-', '') post_status,"
                    //     // + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  address,"
                    //     + " umadd.meta_value shiptostreet,"
                    //     + " umacity.meta_value shiptocity,"
                    //     + " umastate.meta_value shiptostate,"
                    //     + " umapostalcode.meta_value shiptozip,"
                    //     + " umacountry.meta_value shiptocountrycode,"

                    //     + " umaddbilling.meta_value billingstreet,"
                    //     + " umacitybilling.meta_value billingcity,"
                    //     + " umastatebilling.meta_value billingstate,"
                    //     + " umapostalcodebilling.meta_value billingzip,"
                    //     + " umacountrybilling.meta_value billingcountry,"
                    //     + " cast(umashipingamount.meta_value as decimal(10,2)) shipping_amount, 0 handling_amount,"
                    //     + " cast(umatotal.meta_value as decimal(10,2)) - cast(umatax.meta_value as decimal(10,2)) Total,"
                    //     + " cast(umadiscount.meta_value as decimal(10,2)) Discount,"
                    //     + " cast(umatax.meta_value as decimal(10,2)) Tax,"
                    //     + " CONCAT(umfname.meta_value, ' ', COALESCE(umlname.meta_value, '')) Name"
                    //     + " FROM wp_posts u"
                    //     + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state'  AND umastate.meta_value IN ('CA', 'CO', 'CT', 'IL', 'IN', 'MI', 'MS', 'NC', 'NE', 'NJ', 'NM', 'PA', 'TN', 'TX', 'WA', 'AR', 'FL', 'GA', 'IA', 'MO', 'OH', 'SC', 'WI') And umastate.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"

                    //     + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"

                    //     + " LEFT OUTER JOIN wp_postmeta umatotal on umatotal.meta_key = '_order_total' And umatotal.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umadiscount on umadiscount.meta_key = '_cart_discount' And umadiscount.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //     + " LEFT OUTER JOIN wp_postmeta umashipingamount on umashipingamount.meta_key = '_order_shipping' And umashipingamount.post_id = u.ID"
                    //     + " WHERE umastate.meta_value =  '" + txtState + "' and  umastate.post_id IN (SELECT ID FROM wp_posts WHERE post_status IN ('wc-completed','wc-processing') AND post_type='shop_order' AND  cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' ) and cast(umatax.meta_value as decimal(10,2)) <> 0.00 order by post_status";
                    //}


                    SqlParameter[] parameters =
                       {
                            new SqlParameter("@qflag", txtState),
                            new SqlParameter("@fromdate", fromdate),
                             new SqlParameter("@todate", todate)
                        };

                    ds1 = SQLHelper.ExecuteDataSet("erp_TaxJarOrder_List", parameters);


                    //ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
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

        public static void GetAvalaraOrder(string from_date, string to_date, string txtState)
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
                    DataSet ds1 = new DataSet();
                    
                    SqlParameter[] parameters =
                       {
                            new SqlParameter("@qflag", txtState),
                            new SqlParameter("@fromdate", fromdate),
                             new SqlParameter("@todate", todate)
                        };

                    ds1 = SQLHelper.ExecuteDataSet("erp_AvalaraOrder_List", parameters);


                    //ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["order_id"].ToString());
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
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    
                    //if (txtState == "ALL")
                    //{
                    //    ssql = "SELECT distinct ID,post_date, post_status,"
                    //    + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"
                    //    + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                    //    + " cast(umatax.meta_value as decimal(10,2)) Tax,"
                    //    + " cast(umrefunfee.meta_value as decimal(10,2)) RefundFee"
                    //    + " FROM wp_posts u"
                    //    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And umastate.meta_value IN ('CA','CO','CT','IL','IN','MI','MS','NE','NJ','NM','NC','PA','TX','WA','TN') and umastate.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //    + " WHERE post_type IN ('shop_order_refund') AND cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' and cast(umatax.meta_value as decimal(10,2)) <> 0.00   order by post_status";
                    //}
                    //else
                    //{
                    //    ssql = "SELECT distinct ID,post_date, post_status,"
                    //    + " CONCAT(COALESCE(umfname.meta_value,''),' ',COALESCE(umlname.meta_value, ''),' ' , COALESCE(umadd.meta_value,''), ' ', COALESCE(umadd2.meta_value, ''), ' ',  COALESCE(umacity.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcode.meta_value,''), ' ',  COALESCE(umacountry.meta_value,''))  shippingaddress,"
                    //    + " CONCAT(COALESCE(umshippingfirst.meta_value,''),' ',COALESCE(umshippinglast.meta_value, ''),' ' , COALESCE(umaddbilling.meta_value,''), ' ', COALESCE(umaddbilling2.meta_value, ''), ' ',  COALESCE(umacitybilling.meta_value,''), ' ',  COALESCE(umastate.meta_value,''), ' ',  COALESCE(umapostalcodebilling.meta_value,''), ' ',  COALESCE(umacountrybilling.meta_value,''))  billingaddress,"
                    //    + " cast(umatax.meta_value as decimal(10,2)) Tax,"
                    //    + " cast(umrefunfee.meta_value as decimal(10,2)) RefundFee"
                    //    + " FROM wp_posts u"
                    //    + " LEFT OUTER JOIN wp_postmeta umfname on umfname.meta_key = '_billing_first_name' And umfname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umlname on umlname.meta_key = '_billing_last_name' And umlname.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umshippingfirst on umshippingfirst.meta_key = '_shipping_first_name' And umshippingfirst.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umshippinglast on umshippinglast.meta_key = '_shipping_last_name' And umshippinglast.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umadd on umadd.meta_key = '_shipping_address_1' And umadd.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = '_shipping_address_2' And umadd2.user_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacity on umacity.meta_key = '_shipping_city' And umacity.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastate on umastate.meta_key = '_shipping_state' And  umastate.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcode on umapostalcode.meta_key = '_shipping_postcode' And umapostalcode.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountry on umacountry.meta_key = '_shipping_country' And umacountry.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling on umaddbilling.meta_key = '_billing_address_1' And umaddbilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umaddbilling2 on umaddbilling2.meta_key = '_billing_address_2' And umaddbilling2.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacitybilling on umacitybilling.meta_key = '_shipping_city' And umacitybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umastatebilling on umastatebilling.meta_key = '_shipping_state' And umastatebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umapostalcodebilling on umapostalcodebilling.meta_key = '_shipping_postcode' And umapostalcodebilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umacountrybilling on umacountrybilling.meta_key = '_shipping_country' And umacountrybilling.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umrefunfee on umrefunfee.meta_key = '_refund_amount' And umrefunfee.post_id = u.ID"
                    //    + " LEFT OUTER JOIN wp_postmeta umatax on umatax.meta_key = '_order_tax' And umatax.post_id = u.ID"
                    //    + " WHERE post_type IN ('shop_order_refund') and umastate.meta_value =  '" + txtState + "' AND cast(post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' and cast(umatax.meta_value as decimal(10,2)) <> 0.00  order by post_status";
                    //}

                    SqlParameter[] parameters =
                    {
                            new SqlParameter("@qflag", txtState),
                            new SqlParameter("@fromdate", fromdate),
                             new SqlParameter("@todate", todate)
                        };

                    ds1 = SQLHelper.ExecuteDataSet("erp_salestaxrefunded_List", parameters);
                }
                else
                {
                    ssql = "";
                }


           
                //ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_item_type = "#" + ds1.Tables[0].Rows[i]["ID"].ToString();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                        uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());

                    uobj.shipping_address_1 = ds1.Tables[0].Rows[i]["shippingaddress"].ToString();
                    uobj.billing_address_1 = ds1.Tables[0].Rows[i]["billingaddress"].ToString();

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["RefundFee"].ToString()))
                        uobj.fee = "$" + ds1.Tables[0].Rows[i]["RefundFee"].ToString();
                    else
                        uobj.fee = "$0";
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Tax"].ToString()))
                        uobj.tax = "$" + ds1.Tables[0].Rows[i]["Tax"].ToString();
                    else
                        uobj.tax = "$0";

                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public static DataTable GetPaymentStatusList(string bank, string status, DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@searchcriteria", searchid),
                     //new SqlParameter("@status", bank),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@statustype", bank),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "SSPY")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_report_status_search", parameters);
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

        public static void GetStatusDetails(string from_date, string to_date, string Type)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@type", Type),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_OrderStatus_List", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["post_date"].ToString();

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
                        uobj.first_name = ds1.Tables[0].Rows[i]["gift_card"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();
                        else
                            uobj.fee = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.Discount = "";

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                            uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        else
                            uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void Getcouponcodesearch(string from_date, string to_date, string Type)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                    new SqlParameter("@type", Type),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_couponcodesearch_list", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["post_date"].ToString();

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
                        uobj.first_name = ds1.Tables[0].Rows[i]["gift_card"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();
                        else
                            uobj.fee = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.Discount = "";

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                            uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        else
                            uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }
        public static DataSet GetEmployee()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select ID, user_login from wp_users u  INNER JOIN vw_users_customer um on  um.user_id = u.ID  WHERE um.meta_value = 'salesrep'  ORDER BY u.ID ASC;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static void GetSalesDetails(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_salesdetails_List", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["EmpName"].ToString()))
                            uobj.first_name = ds1.Tables[0].Rows[i]["EmpName"].ToString();

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["post_date"].ToString();

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
                        uobj.billing_state = ds1.Tables[0].Rows[i]["gift_card"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();
                        else
                            uobj.fee = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.Discount = "";

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                            uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        else
                            uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetPartialRefund(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_partialrefund_List", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["refund_total"].ToString()))
                            uobj.first_name = ds1.Tables[0].Rows[i]["refund_total"].ToString();

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["post_date"].ToString();

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
                        uobj.billing_state = ds1.Tables[0].Rows[i]["gift_card"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();
                        else
                            uobj.fee = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.Discount = "";

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                            uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        else
                            uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetStatusOrder(string from_date, string to_date, string type)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", type),
                    new SqlParameter("@fromdate", from_date), 
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_orderreportstatus_List", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["refund_total"].ToString()))
                            uobj.first_name = ds1.Tables[0].Rows[i]["refund_total"].ToString();

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["post_date"].ToString();

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
                        uobj.billing_state = ds1.Tables[0].Rows[i]["gift_card"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();
                        else
                            uobj.fee = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.Discount = "";

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                            uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        else
                            uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public static void GetGrafixDetails(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_totaldetails_List", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        //uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.first_name = ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Day Index"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["Day Index"].ToString();

                        uobj.orderstatus = ds1.Tables[0].Rows[i]["Tax"].ToString();

                        //if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Discount"].ToString()))
                        uobj.address = ds1.Tables[0].Rows[i]["subtotal"].ToString();
                        //else
                        //    uobj.address = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                            uobj.tax = ds1.Tables[0].Rows[i]["Total"].ToString();
                        else
                            uobj.tax = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Discount"].ToString()))
                            uobj.total = ds1.Tables[0].Rows[i]["Discount"].ToString();
                        else
                            uobj.total = "";
                        uobj.customer_id = ds1.Tables[0].Rows[i]["gift_card"].ToString();
                        uobj.billing_state = ds1.Tables[0].Rows[i]["Fee"].ToString();
                        //if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                        uobj.fee = ds1.Tables[0].Rows[i]["shipping"].ToString();

                        uobj.Discount = ds1.Tables[0].Rows[i]["refund_total"].ToString();
                        //else
                        //    uobj.fee = "";
                        //if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                        //    uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        //else
                        //    uobj.subtotal = "";
                        //if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                        //    uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        //else
                        //    uobj.Discount = "";

                        //if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                        //    uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        //else
                        //    uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public static void GetPeriodChart(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_GetPeriodChart_List", parameters);

                    

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["grosssale"].ToString()))
                            uobj.fee = ds1.Tables[0].Rows[i]["grosssale"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["netsale"].ToString()))
                            uobj.Discount = ds1.Tables[0].Rows[i]["netsale"].ToString();
                        uobj.orderstatus = ds1.Tables[0].Rows[i]["shipping"].ToString();
                        uobj.address = ds1.Tables[0].Rows[i]["coupon_count"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["total_Items"].ToString()))
                            uobj.tax = ds1.Tables[0].Rows[i]["total_Items"].ToString();
                        else
                            uobj.tax = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["total_order"].ToString()))
                            uobj.total = ds1.Tables[0].Rows[i]["total_order"].ToString();
                        else
                            uobj.total = "";
                        uobj.customer_id = ds1.Tables[0].Rows[i]["refunded_count"].ToString();
                      
 
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public static void Getorderforecast(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_Getorderforecast_List", parameters);
                    if (ds1.Tables[0].Rows.Count > 0)
                    {
                        ds1.Tables[0].DefaultView.RowFilter = "sr = '10'";
                        decimal oct = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = '11'";
                        decimal nov = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = '12'";
                        decimal dec = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        string r1 = "0.5", r2 = "0.33333333333", r3 = "0.16666666666";
                        // string r1 = "0.5", r2 = "1/3", r3 = "1/6";

                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            if (i == 0)
                                uobj.fee = (oct * Convert.ToDecimal(r1) + nov * Convert.ToDecimal(r2) + dec * Convert.ToDecimal(r3)).ToString();
                            if (i == 1)
                            {
                                var lastItem = exportorderlist.Last();
                                // var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + nov * Convert.ToDecimal(r2) + dec * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 2)
                            {
                                var lastItem = exportorderlist.Last();
                                var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + dec * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 3)
                            {
                                var start = exportorderlist.ElementAt(0);
                                var firstItem = exportorderlist.ElementAt(1);
                                var second = exportorderlist.ElementAt(2);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 4)
                            {
                                var start = exportorderlist.ElementAt(1);
                                var firstItem = exportorderlist.ElementAt(2);
                                var second = exportorderlist.ElementAt(3);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 5)
                            {
                                var start = exportorderlist.ElementAt(2);
                                var firstItem = exportorderlist.ElementAt(3);
                                var second = exportorderlist.ElementAt(4);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 6)
                            {
                                var start = exportorderlist.ElementAt(3);
                                var firstItem = exportorderlist.ElementAt(4);
                                var second = exportorderlist.ElementAt(5);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 7)
                            {
                                var start = exportorderlist.ElementAt(4);
                                var firstItem = exportorderlist.ElementAt(5);
                                var second = exportorderlist.ElementAt(6);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 8)
                            {
                                var start = exportorderlist.ElementAt(5);
                                var firstItem = exportorderlist.ElementAt(6);
                                var second = exportorderlist.ElementAt(7);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 9)
                            {
                                var start = exportorderlist.ElementAt(6);
                                var firstItem = exportorderlist.ElementAt(7);
                                var second = exportorderlist.ElementAt(8);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 10)
                            {
                                var start = exportorderlist.ElementAt(7);
                                var firstItem = exportorderlist.ElementAt(8);
                                var second = exportorderlist.ElementAt(9);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 11)
                            {
                                var start = exportorderlist.ElementAt(8);
                                var firstItem = exportorderlist.ElementAt(9);
                                var second = exportorderlist.ElementAt(10);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            //else
                            //{                          
                            //    uobj.fee = "0.0";
                            //}
                            //  exportorderlist.Last<>   .OrderBy(x => x.Key).Last();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["sr"].ToString()))
                                uobj.tax = ds1.Tables[0].Rows[i]["sr"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                                uobj.Discount = ds1.Tables[0].Rows[i]["Total"].ToString();
                            exportorderlist.Add(uobj);
                        }
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetMonthlyYear(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "MD"),
                    new SqlParameter("@yearfrom", from_date), 
                     new SqlParameter("@yearto", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_yearmonthtotaldetails_List", parameters);
                    if (ds1.Tables[0].Rows.Count >= 12 && ds1.Tables[1].Rows.Count >= 12)
                    {

                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            int b = 0;
                            if (i == 0)
                                b = 1;
                            else
                                b = i + 1;
                            for (int j = 0; j < b; j++)
                            {
                                uobj.total = ds1.Tables[0].Rows[i]["TOTAL"].ToString();
                                uobj.tax = ds1.Tables[1].Rows[j]["TOTAL"].ToString();
                            }
                            exportorderlist.Add(uobj);
                        }
                    }
                    //for (int i = 0; i < ds1.Tables[1].Rows.Count; i++)
                    //{
                    //    Export_Details uobj = new Export_Details();                     
                            
                    //      uobj.tax = ds1.Tables[1].Rows[i]["TOTAL"].ToString();
                  
                    //    exportorderlist.Add(uobj);
                    //}
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetQuarterlyYear(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "QD"),
                    new SqlParameter("@yearfrom", from_date),
                     new SqlParameter("@yearto", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_yearmonthtotaldetails_List", parameters);
                    if (ds1.Tables[0].Rows.Count > 0 && ds1.Tables[1].Rows.Count > 0)
                    {
                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            int b = 0;
                            if (i == 0)
                                b = 1;
                            else
                                b = i + 1;
                            for (int j = 0; j < b; j++)
                            {
                                uobj.total = ds1.Tables[0].Rows[i]["TOTAL"].ToString();
                                uobj.tax = ds1.Tables[1].Rows[j]["TOTAL"].ToString();
                            }
                            exportorderlist.Add(uobj);
                        }
                    }
                    //for (int i = 0; i < ds1.Tables[1].Rows.Count; i++)
                    //{
                    //    Export_Details uobj = new Export_Details();                     

                    //      uobj.tax = ds1.Tables[1].Rows[i]["TOTAL"].ToString();

                    //    exportorderlist.Add(uobj);
                    //}
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataTable GetQuarerly(string year, string to_date, string Empid)
        {
            DataTable dt = new DataTable();
            try
            {
               
                string ssql;
                DataSet ds1 = new DataSet();
                if (year != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@year",year ),
                    new SqlParameter("@qflag","QD" ),

                };
                    dt = SQLHelper.ExecuteDataTable("erp_quartertotaldetails_List", parameters);

                    //for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    //{
                    //    Export_Details uobj = new Export_Details();
                    //    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["1"].ToString()))
                    //        uobj.qty = ds1.Tables[0].Rows[i]["1"].ToString();
                    //    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["2"].ToString()))
                    //        uobj.total = ds1.Tables[0].Rows[i]["2"].ToString();

                    //    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["3"].ToString()))
                    //        uobj.tax = ds1.Tables[0].Rows[i]["3"].ToString();
                    //    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["4"].ToString()))
                    //        uobj.Discount = ds1.Tables[0].Rows[i]["4"].ToString();
                    //    exportorderlist.Add(uobj);
                    //}
                }
            }
            catch (Exception ex) { throw ex; }
            return dt;
        }

        public static DataTable GetMonthly(string year, string to_date, string Empid)
        {
            DataTable dt = new DataTable();
            try
            {

                string ssql;
                DataSet ds1 = new DataSet();
                if (year != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@year",year ),
                    new SqlParameter("@qflag","MD" ),

                };
                    dt = SQLHelper.ExecuteDataTable("erp_quartertotaldetails_List", parameters);

                    
                }
            }
            catch (Exception ex) { throw ex; }
            return dt;
        }

        
        public static DataTable GetGrafixDetail(string from_date, string to_date, string Empid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                dt = SQLHelper.ExecuteDataTable("erp_totaldetails_List", parameters);


                //string strSql = "Select p.fk_purchase id,p.rowid RicD, (select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                //                     + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,FORMAT(total_ttc,2) total_ttc from commerce_purchase_receive_order p"
                //                      + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_purchase = @ref and p.fk_status= 5 and 1 = 1";

                //strSql += strWhr + string.Format(" order by DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') desc");

                //string strSql = "Select max(p.fk_purchase) id,max(p.rowid) RicD,p.ref refordervendor,sum(recqty) Quenty, string_agg(concat(' ' ,description, ' (*',recqty,')'), ',') des,max(CONVERT(VARCHAR(12), p.date_creation, 107)) dtcration,max(CONVERT(VARCHAR(12), p.date_creation, 107)) date_creation, Cast(CONVERT(DECIMAL(10,2),max(p.total_ttc)) as nvarchar) total_ttc from commerce_purchase_receive_order p "
                //                     + " inner join commerce_purchase_receive_order_detail pr on pr.fk_purchase_re = p.rowid  "
                //                      + " where p.fk_purchase = @ref and product_type = 0 and p.fk_status= 5 and 1 = 1 ";

                //strSql += strWhr + string.Format(" group by  p.ref  order by RicD desc");



                //dt = SQLHelper.ExecuteDataTable(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static List<ReportsModel> GetProductListDetails(string from_date, string to_date, string Empid)
        {
            List<ReportsModel> _list = new List<ReportsModel>();
            try
            {


                ReportsModel productsModel = new ReportsModel();
                string strWhr = string.Empty;

                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                string strSQl = "erp_totaldetails_List";
                //strSQl += ";";
                SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    productsModel = new ReportsModel();
                    if (sdr["Users"] != DBNull.Value)
                        productsModel.SalesFigure = Convert.ToInt32(sdr["Users"]);
                    else
                        productsModel.SalesFigure = 0;

                    if (sdr["Day Index"] != DBNull.Value)
                        productsModel.Month = sdr["Day Index"].ToString();
                    else
                        productsModel.Month = string.Empty;


                    _list.Add(productsModel);
                }
            }


            catch (Exception ex)
            { throw ex; }
            return _list;
        }
     
        public static DataTable GetProductList(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("SELECT post_title FROM wp_posts P where p.post_type = 'shop_coupon'  and p.post_status != 'auto-draft' and P.post_status != 'trash' and post_title  like '" + strSearch + "%' order by post_title;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetWalmartDetailsList(DateTime? fromdate, DateTime? todate, string searchid, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "wal"),
                    new SqlParameter("@searchcriteria", searchid),

                };
                dt = SQLHelper.ExecuteDataTable("erp_Walmart_search", parameters);

            }

            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet exportwalmartlist(DateTime? fromdate, DateTime? todate, string searchid, string categoryid, string productid)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                   {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "ex"),
                    new SqlParameter("@searchcriteria", searchid),

                };
                ds = SQLHelper.ExecuteDataSet("erp_Walmart_search", parameters);
                ds.Tables[0].TableName = "item"; ds.Tables[1].TableName = "details";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetWalmartdetailsdata(string searchid, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;       
                SqlParameter[] parameters =
                   {
            
                    new SqlParameter("@flag", "sh"),
                    new SqlParameter("@searchcriteria", searchid),

                };
                dt = SQLHelper.ExecuteDataTable("erp_Walmart_search", parameters);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static void GetWisconsinSalesOrder(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                DataSet ds1 = new DataSet();
                string ssql;

                if (from_date != "" && to_date != "")
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    SqlParameter[] param = {
                        new SqlParameter("@from", from_date),
                        new SqlParameter("@to", to_date)
                    };
                    ds1 = DAL.SQLHelper.ExecuteDataSet("erp_wisconsin", param);
                }
                else
                {
                    ssql = "";
                }
                //DataSet ds1 = new DataSet();
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["post_date"].ToString());
                    uobj.tax = "$" + ds1.Tables[0].Rows[i]["Tax"].ToString();
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
                    uobj.shipping_amount = "$" + ds1.Tables[0].Rows[i]["shipping_amount"].ToString();
                    uobj.handling_amount = "$" + ds1.Tables[0].Rows[i]["handling_amount"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["Name"].ToString();
                    uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Discount"].ToString();
                    uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetIDMeOrderReport(string from_date, string to_date, string Type)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                    new SqlParameter("@type", Type),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_idmeorderreport", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["post_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["post_date"].ToString();

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
                        uobj.first_name = ds1.Tables[0].Rows[i]["name"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["State_Recycling_Fee"].ToString();
                        else
                            uobj.fee = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.Discount = "";

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["shipping"].ToString()))
                            uobj.billing_postcode = "$" + ds1.Tables[0].Rows[i]["shipping"].ToString();
                        else
                            uobj.billing_postcode = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetForecastSalesMonthly(string year)
        {
            try
            {
                exportorderlist.Clear();
                DataSet ds1 = new DataSet();
                if (year != "")
                {
                    SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FCM"),
                    new SqlParameter("@year", year),
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_forcastsalemonthly", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.tax = ds1.Tables[0].Rows[i]["month"].ToString();
                        uobj.shipping_amount = ds1.Tables[0].Rows[i]["month_name"].ToString();
                        uobj.handling_amount = '$' + ds1.Tables[0].Rows[i]["sales"].ToString();
                        uobj.first_name = '$' + ds1.Tables[0].Rows[i]["forcastSales"].ToString();
                        uobj.Discount = '$' + ds1.Tables[0].Rows[i]["lowerconfidence"].ToString();
                        uobj.total = '$' + ds1.Tables[0].Rows[i]["upperconfidence"].ToString();
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetForecastSalesMonthlyChart(string year)
        {
            try
            {
                exportorderlistchart.Clear();
                DataSet ds1 = new DataSet();
                if (year != "")
                {
                    SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FCM"),
                    new SqlParameter("@year", year),
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_forcastsalemonthly", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.tax = ds1.Tables[0].Rows[i]["month"].ToString();
                        uobj.shipping_amount = ds1.Tables[0].Rows[i]["month_name"].ToString();
                        uobj.handling_amount = ds1.Tables[0].Rows[i]["sales"].ToString();
                        uobj.first_name = ds1.Tables[0].Rows[i]["forcastSales"].ToString();
                        uobj.Discount = ds1.Tables[0].Rows[i]["lowerconfidence"].ToString();
                        uobj.total = ds1.Tables[0].Rows[i]["upperconfidence"].ToString();
                        exportorderlistchart.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetForecastSalesQuarterly(string year)
        {
            try
            {
                exportorderlist.Clear();
                DataSet ds1 = new DataSet();
                if (year != "")
                {
                    SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FCQ"),
                    new SqlParameter("@year", year),
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_forcastsalemonthly", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.tax = ds1.Tables[0].Rows[i]["quarter"].ToString();
                        uobj.first_name = ds1.Tables[0].Rows[i]["quarter_name"].ToString();
                        uobj.handling_amount = '$' + ds1.Tables[0].Rows[i]["sales"].ToString();
                        uobj.fee = '$' + ds1.Tables[0].Rows[i]["forcastSales"].ToString();
                        uobj.Discount = '$' + ds1.Tables[0].Rows[i]["lowerconfidence"].ToString();
                        uobj.total = '$' + ds1.Tables[0].Rows[i]["upperconfidence"].ToString();
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetForecastSalesQuarterlyChart(string year)
        {
            try
            {
                exportorderlistchart.Clear();
                DataSet ds1 = new DataSet();
                if (year != "")
                {
                    SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FCQ"),
                    new SqlParameter("@year", year),
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_forcastsalemonthly", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.tax = ds1.Tables[0].Rows[i]["quarter"].ToString();
                        uobj.first_name = ds1.Tables[0].Rows[i]["quarter_name"].ToString();
                        uobj.handling_amount = ds1.Tables[0].Rows[i]["sales"].ToString();
                        uobj.fee = ds1.Tables[0].Rows[i]["forcastSales"].ToString();
                        uobj.Discount = ds1.Tables[0].Rows[i]["lowerconfidence"].ToString();
                        uobj.total = ds1.Tables[0].Rows[i]["upperconfidence"].ToString();
                        exportorderlistchart.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataTable GetForecastSalesLSR(string year)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FCM"),
                    new SqlParameter("@year", year),
                };
                dt = SQLHelper.ExecuteDataTable("erp_forcastsalemonthly", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static void GetForecastSalesHistoricalChart(string year)
        {
            try
            {
                exportorderlistchart.Clear();
                DataSet ds1 = new DataSet();
                if (year != "")
                {
                    SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FCM"),
                    new SqlParameter("@year", year),
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_forcastsalemonthly", parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.tax = ds1.Tables[0].Rows[i]["month"].ToString();
                        uobj.shipping_amount = ds1.Tables[0].Rows[i]["month_name"].ToString();
                        uobj.handling_amount = ds1.Tables[0].Rows[i]["sales"].ToString();
                        exportorderlistchart.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }
        public static DataTable GetProductInventoryList(string sMonths, string searchid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "PD"),
                    new SqlParameter("@year", sMonths),
                    new SqlParameter("@pid", productid),
                };
                dt = SQLHelper.ExecuteDataTable("erp_productinventoryforcoste_List", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static void GetProductInventoryforecast(string productid, string year,  string flag)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                //DataTable ds2 = new DataTable();
                if (year != "" && productid != "")
                {

                    SqlParameter[] parameters =
               {
                      new SqlParameter("@qflag", "QT"),
                    new SqlParameter("@year", year),
                    new SqlParameter("@pid", productid),
                };
                    //ds1 = SQLHelper.ExecuteDataTable("erp_productinventoryforcoste_List", parameters);
                    ds1 = SQLHelper.ExecuteDataSet("erp_productinventoryforcoste_List", parameters);
                    if (ds1.Tables[0].Rows.Count > 0)
                    {
                        ds1.Tables[0].DefaultView.RowFilter = "sr = '10'";
                        decimal oct = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = '11'";
                        decimal nov = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = '12'";
                        decimal dec = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        string r1 = "0.5", r2 = "0.33333333333", r3 = "0.16666666666";
                        // string r1 = "0.5", r2 = "1/3", r3 = "1/6";

                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            if (i == 0)
                                uobj.fee = (oct * Convert.ToDecimal(r1) + nov * Convert.ToDecimal(r2) + dec * Convert.ToDecimal(r3)).ToString();
                            if (i == 1)
                            {
                                var lastItem = exportorderlist.Last();
                                // var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + nov * Convert.ToDecimal(r2) + dec * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 2)
                            {
                                var lastItem = exportorderlist.Last();
                                var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + dec * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 3)
                            {
                                var start = exportorderlist.ElementAt(0);
                                var firstItem = exportorderlist.ElementAt(1);
                                var second = exportorderlist.ElementAt(2);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 4)
                            {
                                var start = exportorderlist.ElementAt(1);
                                var firstItem = exportorderlist.ElementAt(2);
                                var second = exportorderlist.ElementAt(3);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 5)
                            {
                                var start = exportorderlist.ElementAt(2);
                                var firstItem = exportorderlist.ElementAt(3);
                                var second = exportorderlist.ElementAt(4);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 6)
                            {
                                var start = exportorderlist.ElementAt(3);
                                var firstItem = exportorderlist.ElementAt(4);
                                var second = exportorderlist.ElementAt(5);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 7)
                            {
                                var start = exportorderlist.ElementAt(4);
                                var firstItem = exportorderlist.ElementAt(5);
                                var second = exportorderlist.ElementAt(6);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 8)
                            {
                                var start = exportorderlist.ElementAt(5);
                                var firstItem = exportorderlist.ElementAt(6);
                                var second = exportorderlist.ElementAt(7);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 9)
                            {
                                var start = exportorderlist.ElementAt(6);
                                var firstItem = exportorderlist.ElementAt(7);
                                var second = exportorderlist.ElementAt(8);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 10)
                            {
                                var start = exportorderlist.ElementAt(7);
                                var firstItem = exportorderlist.ElementAt(8);
                                var second = exportorderlist.ElementAt(9);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 11)
                            {
                                var start = exportorderlist.ElementAt(8);
                                var firstItem = exportorderlist.ElementAt(9);
                                var second = exportorderlist.ElementAt(10);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            //else
                            //{                          
                            //    uobj.fee = "0.0";
                            //}
                            //  exportorderlist.Last<>   .OrderBy(x => x.Key).Last();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["sr"].ToString()))
                                uobj.tax = ds1.Tables[0].Rows[i]["sr"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Month_name"].ToString()))
                                uobj.country = ds1.Tables[0].Rows[i]["Month_name"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                                uobj.Discount = ds1.Tables[0].Rows[i]["Total"].ToString();
                            exportorderlist.Add(uobj);
                        }
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }
        public static void GetProductInventoryforecastmonth(string productid, string year, string flag, string Month1, string Month2, string Month3)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                //DataTable ds2 = new DataTable();
                if (year != "" && productid != "")
                {

                    SqlParameter[] parameters =
               {
                      new SqlParameter("@qflag", "QT"),
                    new SqlParameter("@year", year),
                    new SqlParameter("@pid", productid),
                };
                    //ds1 = SQLHelper.ExecuteDataTable("erp_productinventoryforcoste_List", parameters);
                    ds1 = SQLHelper.ExecuteDataSet("erp_productinventoryforcoste_List", parameters);
                    if (ds1.Tables[0].Rows.Count > 0)
                    {
                        ds1.Tables[0].DefaultView.RowFilter = "sr = "+ Month1 + "";
                        decimal m1 = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = " + Month2 + "";
                        decimal m2 = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = " + Month3 + "";
                        decimal m3 = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        string r1 = "0.5", r2 = "0.33333333333", r3 = "0.16666666666";
                        // string r1 = "0.5", r2 = "1/3", r3 = "1/6";

                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            if (i == 0)
                                uobj.fee = (m1 * Convert.ToDecimal(r1) + m2 * Convert.ToDecimal(r2) + m3 * Convert.ToDecimal(r3)).ToString();
                            if (i == 1)
                            {
                                var lastItem = exportorderlist.Last();
                                // var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + m2 * Convert.ToDecimal(r2) + m3 * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 2)
                            {
                                var lastItem = exportorderlist.Last();
                                var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + m3 * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 3)
                            {
                                var start = exportorderlist.ElementAt(0);
                                var firstItem = exportorderlist.ElementAt(1);
                                var second = exportorderlist.ElementAt(2);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 4)
                            {
                                var start = exportorderlist.ElementAt(1);
                                var firstItem = exportorderlist.ElementAt(2);
                                var second = exportorderlist.ElementAt(3);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 5)
                            {
                                var start = exportorderlist.ElementAt(2);
                                var firstItem = exportorderlist.ElementAt(3);
                                var second = exportorderlist.ElementAt(4);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 6)
                            {
                                var start = exportorderlist.ElementAt(3);
                                var firstItem = exportorderlist.ElementAt(4);
                                var second = exportorderlist.ElementAt(5);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 7)
                            {
                                var start = exportorderlist.ElementAt(4);
                                var firstItem = exportorderlist.ElementAt(5);
                                var second = exportorderlist.ElementAt(6);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 8)
                            {
                                var start = exportorderlist.ElementAt(5);
                                var firstItem = exportorderlist.ElementAt(6);
                                var second = exportorderlist.ElementAt(7);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 9)
                            {
                                var start = exportorderlist.ElementAt(6);
                                var firstItem = exportorderlist.ElementAt(7);
                                var second = exportorderlist.ElementAt(8);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 10)
                            {
                                var start = exportorderlist.ElementAt(7);
                                var firstItem = exportorderlist.ElementAt(8);
                                var second = exportorderlist.ElementAt(9);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 11)
                            {
                                var start = exportorderlist.ElementAt(8);
                                var firstItem = exportorderlist.ElementAt(9);
                                var second = exportorderlist.ElementAt(10);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            //else
                            //{                          
                            //    uobj.fee = "0.0";
                            //}
                            //  exportorderlist.Last<>   .OrderBy(x => x.Key).Last();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["sr"].ToString()))
                                uobj.tax = ds1.Tables[0].Rows[i]["sr"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Month_name"].ToString()))
                                uobj.country = ds1.Tables[0].Rows[i]["Month_name"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                                uobj.Discount = ds1.Tables[0].Rows[i]["Total"].ToString();
                            exportorderlist.Add(uobj);
                        }
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void Getorderforecastmonthvise(string from_date, string to_date, string Empid, string Month1, string Month2, string Month3)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                         new SqlParameter("@id", Empid),
                     new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet("erp_Getorderforecast_List", parameters);
                    if (ds1.Tables[0].Rows.Count >= 12)
                    {
                        ds1.Tables[0].DefaultView.RowFilter = "sr = " + Month1 + "";
                        decimal m1 = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = " + Month2 + "";
                        decimal m2 = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        ds1.Tables[0].DefaultView.RowFilter = "sr = " + Month3 + "";
                        decimal m3 = (decimal)ds1.Tables[0].DefaultView[0]["Total"];

                        string r1 = "0.5", r2 = "0.33333333333", r3 = "0.16666666666";
                        // string r1 = "0.5", r2 = "1/3", r3 = "1/6";

                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            if (i == 0)
                                uobj.fee = (m1 * Convert.ToDecimal(r1) + m2 * Convert.ToDecimal(r2) + m3 * Convert.ToDecimal(r3)).ToString();
                            if (i == 1)
                            {
                                var lastItem = exportorderlist.Last();
                                // var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + m2 * Convert.ToDecimal(r2) + m3 * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 2)
                            {
                                var lastItem = exportorderlist.Last();
                                var firstItem = exportorderlist.ElementAt(0);
                                uobj.fee = (Convert.ToDecimal(lastItem.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + m3 * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 3)
                            {
                                var start = exportorderlist.ElementAt(0);
                                var firstItem = exportorderlist.ElementAt(1);
                                var second = exportorderlist.ElementAt(2);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 4)
                            {
                                var start = exportorderlist.ElementAt(1);
                                var firstItem = exportorderlist.ElementAt(2);
                                var second = exportorderlist.ElementAt(3);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 5)
                            {
                                var start = exportorderlist.ElementAt(2);
                                var firstItem = exportorderlist.ElementAt(3);
                                var second = exportorderlist.ElementAt(4);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 6)
                            {
                                var start = exportorderlist.ElementAt(3);
                                var firstItem = exportorderlist.ElementAt(4);
                                var second = exportorderlist.ElementAt(5);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 7)
                            {
                                var start = exportorderlist.ElementAt(4);
                                var firstItem = exportorderlist.ElementAt(5);
                                var second = exportorderlist.ElementAt(6);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 8)
                            {
                                var start = exportorderlist.ElementAt(5);
                                var firstItem = exportorderlist.ElementAt(6);
                                var second = exportorderlist.ElementAt(7);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 9)
                            {
                                var start = exportorderlist.ElementAt(6);
                                var firstItem = exportorderlist.ElementAt(7);
                                var second = exportorderlist.ElementAt(8);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 10)
                            {
                                var start = exportorderlist.ElementAt(7);
                                var firstItem = exportorderlist.ElementAt(8);
                                var second = exportorderlist.ElementAt(9);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            if (i == 11)
                            {
                                var start = exportorderlist.ElementAt(8);
                                var firstItem = exportorderlist.ElementAt(9);
                                var second = exportorderlist.ElementAt(10);
                                uobj.fee = (Convert.ToDecimal(second.fee) * Convert.ToDecimal(r1) + Convert.ToDecimal(firstItem.fee) * Convert.ToDecimal(r2) + Convert.ToDecimal(start.fee) * Convert.ToDecimal(r3)).ToString();

                            }
                            //else
                            //{                          
                            //    uobj.fee = "0.0";
                            //}
                            //  exportorderlist.Last<>   .OrderBy(x => x.Key).Last();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["sr"].ToString()))
                                uobj.tax = ds1.Tables[0].Rows[i]["sr"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                                uobj.Discount = ds1.Tables[0].Rows[i]["Total"].ToString();
                            exportorderlist.Add(uobj);
                        }
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataTable GetForecastInventoryLSR(string productid, string year, string flag)
        //string productid, string year,  string flag
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
           {
                      new SqlParameter("@qflag", "QT"),
                    new SqlParameter("@year", year),
                    new SqlParameter("@pid", productid),
                };
                dt = SQLHelper.ExecuteDataTable("erp_productinventoryforcoste_List", parameters);
               
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable InventoryProductList(string sMonths, string searchid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "PD"),
                    new SqlParameter("@year", sMonths),
                    new SqlParameter("@month", 0),
                    new SqlParameter("@pid", productid),
                };
                dt = SQLHelper.ExecuteDataTable("erp_productinventorydetails_List", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static void InventoryProductDetailList(string productid, string year, string flag, string Month)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;
                DataSet ds1 = new DataSet();
                //DataTable ds2 = new DataTable();
                if (year != "" && productid != "")
                {

                    SqlParameter[] parameters =
               {
                      new SqlParameter("@qflag", "QT"),
                    new SqlParameter("@year", year),
                    new SqlParameter("@month", Month),
                    new SqlParameter("@pid", productid),
                };
                    //ds1 = SQLHelper.ExecuteDataTable("erp_productinventoryforcoste_List", parameters);
                    ds1 = SQLHelper.ExecuteDataSet("erp_productinventorydetails_List", parameters);
                    if (ds1.Tables[0].Rows.Count > 0)
                    {
                        for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                        {
                            Export_Details uobj = new Export_Details();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["sr"].ToString()))
                                uobj.tax = ds1.Tables[0].Rows[i]["sr"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Month_name"].ToString()))
                                uobj.country = ds1.Tables[0].Rows[i]["Month_name"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["total"].ToString()))
                                uobj.Discount = ds1.Tables[0].Rows[i]["total"].ToString();
                            if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["amounttotal"].ToString())) 
                                uobj.fee = ds1.Tables[0].Rows[i]["amounttotal"].ToString();
                            else
                                uobj.fee = "0.00";
                            exportorderlist.Add(uobj);
                        }
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        } 

        public static DataSet GetPOApproveList(DateTime? fromdate, DateTime? todate)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH")                   
                };
                ds = SQLHelper.ExecuteDataSet("erp_po_approve_search", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod"; 
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetPurchaseOrder(int userid, DateTime? fromdate, DateTime? todate, string searchcriteria, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH"),
                   // !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                   // new SqlParameter("@isactive", userstatus),
                    new SqlParameter("@searchcriteria", searchcriteria),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir)
                    //new SqlParameter("@userid", userid)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_Proposals_search", parameters);
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
        public static DataSet GetNonInvoicedSalesPOList(DateTime? fromdate, DateTime? todate)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH")
                };
                ds = SQLHelper.ExecuteDataSet("erp_NonInvoicedSales_list", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }


        public static DataTable GetNonInvoicedSales(DateTime? fromdate, DateTime? todate, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH")
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_NonInvoicedSales_list", parameters);
                dt = ds.Tables[1];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static void GetQuoteDetails(string from_date, string to_date, string Empid)
        {
            try
            {
                exportorderlist.Clear();
                string ssql = "SELECT concat(um.meta_value,' ',umm.meta_value) Employee, quote_no,CONVERT(VARCHAR,quote_date,110)quote_date, gross_total Total,net_total subtotal, discount Discount, tax_total Tax, fee_total Fee FROM erp_order_quote eoq"
                             + " left join wp_usermeta um on um.user_id = eoq.created_by and um.meta_key = 'first_name'"
                             + " left join wp_usermeta umm on umm.user_id = eoq.created_by and umm.meta_key = 'last_name'";
                if(Empid != "0")
                {
                    ssql += " WHERE created_by=@id";
                }
                DataSet ds1 = new DataSet();
                if (from_date != "" && to_date != "")
                {

                    SqlParameter[] parameters =
               {
                    new SqlParameter("@qflag", "OL"),
                    new SqlParameter("@fromdate", from_date),
                    new SqlParameter("@id", Empid),
                    new SqlParameter("@todate", to_date)
                };
                    ds1 = SQLHelper.ExecuteDataSet(ssql, parameters);

                    for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                    {
                        Export_Details uobj = new Export_Details();
                        uobj.display_name = ds1.Tables[0].Rows[i]["quote_no"].ToString();
                        uobj.first_name = ds1.Tables[0].Rows[i]["Employee"].ToString();
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["quote_date"].ToString()))
                            uobj.billing_city = ds1.Tables[0].Rows[i]["quote_date"].ToString();

                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Discount"].ToString()))
                            uobj.Discount = "$" + ds1.Tables[0].Rows[i]["Discount"].ToString();
                        else
                            uobj.Discount = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Tax"].ToString()))
                            uobj.tax = "$" + ds1.Tables[0].Rows[i]["Tax"].ToString();
                        else
                            uobj.tax = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                            uobj.total = "$" + ds1.Tables[0].Rows[i]["Total"].ToString();
                        else
                            uobj.total = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["subtotal"].ToString()))
                            uobj.subtotal = "$" + (ds1.Tables[0].Rows[i]["subtotal"].ToString());
                        else
                            uobj.subtotal = "";
                        if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Fee"].ToString()))
                            uobj.fee = "$" + ds1.Tables[0].Rows[i]["Fee"].ToString();
                        else
                            uobj.fee = "";
                        exportorderlist.Add(uobj);
                    }
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataTable Getpastduemiscbill(DateTime? fromdate, DateTime? todate, string flag)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                      fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH")
                    
                };
                dt = SQLHelper.ExecuteDataTable("erp_pastduemiscbill_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
     
        public static void GetOrderData(DateTime? fromdate, DateTime? todate, string status)
        {
            try
            {
                string strWhr = string.Empty;
                exportorderlist.Clear();
                string ssql;

                SqlParameter[] parameters =
                {
                      fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH"),
                      new SqlParameter("@status", status)

                };
                DataSet ds1 = new DataSet();
                ds1 = SQLHelper.ExecuteDataSet("erp_agingorder_search", parameters);

               
               // ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["order_id"].ToString());
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["order_created"].ToString());
                    uobj.first_name = ds1.Tables[0].Rows[i]["FirstName"].ToString();
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["status"].ToString();
                    //uobj.product_id = ds1.Tables[0].Rows[i]["product_id"].ToString();
                    //uobj.variant_id = ds1.Tables[0].Rows[i]["variant_id"].ToString();
                    uobj.qty = ds1.Tables[0].Rows[i]["qty"].ToString();
                    uobj.subtotal = "$" + ds1.Tables[0].Rows[i]["subtotal"].ToString();
                    uobj.total = "$" + ds1.Tables[0].Rows[i]["total"].ToString();
                    uobj.tax = "$" + ds1.Tables[0].Rows[i]["tax"].ToString();
                    uobj.user_status = ds1.Tables[0].Rows[i]["status"].ToString();
                    uobj.variant_id = ds1.Tables[0].Rows[i]["daysdiff"].ToString();
                    //uobj.shipping_amount = "$" + ds1.Tables[0].Rows[i]["shipping_total"].ToString();
                    //uobj.coupon = "$" + ds1.Tables[0].Rows[i]["coupon"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

       
        public static DataTable GetTransactionList(DateTime? fromdate, DateTime? todate, string payment_method)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                        fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    !string.IsNullOrEmpty(payment_method) ? new SqlParameter("@payment_method", payment_method) : new SqlParameter("@payment_method", DBNull.Value),
                    new SqlParameter("@flag", "UNSETTLED")

                };
                dt = SQLHelper.ExecuteDataTable("erp_payment_unsettlement", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataSet GetNonDepositedFundlist(DateTime? fromdate, DateTime? todate)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH")
                };
                ds = SQLHelper.ExecuteDataSet("erp_NonDepositedFund_mail", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        //public static DataTable GetProductReceiveList(int userid, DateTime? fromdate, DateTime? todate, string searchcriteria, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        //{
        //    DataTable dt = new DataTable();
        //    totalrows = 0;
        //    try
        //    {
        //        SqlParameter[] parameters =
        //        {
        //            fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
        //            todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
        //            new SqlParameter("@flag", "SERCH"),
        //           // !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
        //           // new SqlParameter("@isactive", userstatus),
        //            new SqlParameter("@searchcriteria", searchcriteria),
        //            new SqlParameter("@pageno", pageno),
        //            new SqlParameter("@pagesize", pagesize),
        //            new SqlParameter("@sortcol", SortCol),
        //            new SqlParameter("@sortdir", SortDir)
        //            //new SqlParameter("@userid", userid)
        //        };
        //        DataSet ds = SQLHelper.ExecuteDataSet("erp_Proposals_search", parameters);
        //        dt = ds.Tables[0];
        //        if (ds.Tables[1].Rows.Count > 0)
        //            totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return dt;
        //}
        public static DataTable GetProductReceiveList(DateTime? fromdate, DateTime? todate, string flag, string batchno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@batchno", batchno),
                    new SqlParameter("@flag", flag)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_reportproductserno_search", parameters);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet getcompanyoverview(DateTime? from_date, DateTime? to_date, int fiscalyear_id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] param = {
                        from_date.HasValue ? new SqlParameter("@from", from_date) :new SqlParameter("@from",DBNull.Value),
                        to_date.HasValue ? new SqlParameter("@to", to_date) :new SqlParameter("@to",DBNull.Value),
                        fiscalyear_id > 0 ? new SqlParameter("@rowid", fiscalyear_id) :new SqlParameter("@rowid",DBNull.Value)
                         
                    };

                ds = SQLHelper.ExecuteDataSet("erp_company_overview_list", param);
                ds.Tables[0].TableName = "pods";  
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet getordercollectionlist(DateTime? from_date, DateTime? to_date, int fiscalyear_id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] param = {
                        from_date.HasValue ? new SqlParameter("@from", from_date) :new SqlParameter("@from",DBNull.Value),
                        to_date.HasValue ? new SqlParameter("@to", to_date) :new SqlParameter("@to",DBNull.Value),
                        fiscalyear_id > 0 ? new SqlParameter("@rowid", fiscalyear_id) :new SqlParameter("@rowid",DBNull.Value)

                    };

                ds = SQLHelper.ExecuteDataSet("erp_ordercollection_list", param);
                ds.Tables[0].TableName = "podium"; ds.Tables[1].TableName = "paypal"; ds.Tables[2].TableName = "amazon"; ds.Tables[3].TableName = "credit_card"; ds.Tables[4].TableName = "affirm"; ds.Tables[5].TableName = "total";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }


        public static DataTable GetThresholdlist(DateTime? fromdate, DateTime? todate, string payment_method, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    !string.IsNullOrEmpty(payment_method) ? new SqlParameter("@payment_method", payment_method) : new SqlParameter("@payment_method", DBNull.Value),
                    new SqlParameter("@flag", "SEARCH")
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_payment_merchant_search", parameters);
                dt = ds.Tables[1];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet GetSendMailThreshold(DateTime? fromdate, DateTime? todate ,string payment_method)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    !string.IsNullOrEmpty(payment_method) ? new SqlParameter("@payment_method", payment_method) : new SqlParameter("@payment_method", DBNull.Value),
                    new SqlParameter("@flag", "SEARCH")
                };
                ds = SQLHelper.ExecuteDataSet("erp_payment_merchant_search", parameters);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetthresholdById(string id)
        {
            DataTable dt = new DataTable();
            string strQuery = string.Empty;
            try
            {
                strQuery = "SELECT threshold FROM erp_merchant_fee where merchant_name ='" + id + "'";
                dt = SQLHelper.ExecuteDataTable(strQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetBillDetailslist(DateTime? fromdate, DateTime? todate, string payment_method, string bill, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
               {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    //!string.IsNullOrEmpty(payment_method) ? new SqlParameter("@payment_method", payment_method) : new SqlParameter("@payment_method", DBNull.Value),
                    new SqlParameter("@flag",payment_method),
                    new SqlParameter("@ref",bill)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_misc_bill_search", parameters);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet getbill()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select ref ID, ref from erp_commerce_miscellaneous_bill ORDER BY ref desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }


    }
}