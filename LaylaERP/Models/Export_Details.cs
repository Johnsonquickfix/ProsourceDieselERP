using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace LaylaERP.Models
{

    public class Export_Details
    {

        public int order_item_id
        {
            get; set;
        }
        public string orde_item_name
        {
            get; set;
        }
        public string order_item_type
        {
            get; set;
        }
        public int order_id
        {
            get; set;
        }
        public string meta_key { get; set; }
        public string meta_value { get; set; }
        public string post_type { get; set; }
        public DateTime order_created { get; set; }
        public int ID { get; set; }
        public string product_id { get; set; }
        public string variant_id { get; set; }
        public string product_name { get; set; }
        public string item_type { get; set; }
        public string qty { get; set; }
        public string fee { get; set; }
        public string subtotal { get; set; }
        public string tax { get; set; }
        public string total { get; set; }
        public List<Export_Details> exportdetails { get; set; }

        public static string ssql = "SELECT o.ID as order_id, o.post_date as order_created, oi.order_item_name as product_name,oi.order_item_type as item_type," +
        "(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_product_id') as product_id," +
        "(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_product_variation_id') as variant_id," +
        "(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_qty') as qty," +
        "(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_line_subtotal') as subtotal," +
        "(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_line_total') as total" +
        " FROM wp_posts o LEFT JOIN wp_woocommerce_order_items oi ON oi.order_id = o.id LEFT JOIN wp_posts p ON p.ID = oi.order_item_id WHERE o.post_type = 'shop_order' limit 50 ";


        public static List<Export_Details> userlist = new List<Export_Details>();

        public static void Show_Export_Data()
        {
            DataSet ds1 = new DataSet();
            ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
            for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
            {
                Export_Details uobj = new Export_Details();
                uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["order_id"].ToString());
                uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["order_created"].ToString());
                uobj.product_name = ds1.Tables[0].Rows[i]["product_name"].ToString();
                uobj.item_type = ds1.Tables[0].Rows[i]["item_type"].ToString();
                uobj.product_id = ds1.Tables[0].Rows[i]["product_id"].ToString();
                uobj.variant_id = ds1.Tables[0].Rows[i]["variant_id"].ToString();
                uobj.qty = ds1.Tables[0].Rows[i]["qty"].ToString();
                uobj.subtotal = ds1.Tables[0].Rows[i]["subtotal"].ToString();
                uobj.total = ds1.Tables[0].Rows[i]["total"].ToString();
                userlist.Add(uobj);
            }
        }
    }
}