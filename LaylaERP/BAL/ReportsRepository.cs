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
    }
}