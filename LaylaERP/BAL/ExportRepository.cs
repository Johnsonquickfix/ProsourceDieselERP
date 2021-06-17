using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class ExportRepository
    {
        public static List<Export_Details> usersexportlist = new List<Export_Details>();
        public static void ExportUsersDetails()
        {
            try
            {
                usersexportlist.Clear();
                DataSet ds1 = new DataSet();
                string sqlquery = "select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,user_pass,meta_value from wp_users, wp_usermeta WHERE wp_users.user_registered IS NOT NULL and wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";
                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["meta_value"].ToString()) && ds1.Tables[0].Rows[i]["meta_value"].ToString().Length > 5 && ds1.Tables[0].Rows[i]["meta_value"].ToString().Substring(0, 2) == "a:")
                    {

                        if (ds1.Tables[0].Rows[i]["meta_value"].ToString().Trim() == "a:0:{}")
                            ds1.Tables[0].Rows[i]["meta_value"] = "Unknown";
                        //result = ds1.Tables[0].Rows[i]["meta_value"].ToString();

                        else
                            ds1.Tables[0].Rows[i]["meta_value"] = User_Role_Name(ds1.Tables[0].Rows[i]["meta_value"].ToString());

                    }
                    else
                    {
                        ds1.Tables[0].Rows[i]["meta_value"] = ds1.Tables[0].Rows[i]["meta_value"];
                    }

                    uobj.UID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.user_login = ds1.Tables[0].Rows[i]["user_login"].ToString();
                    result = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.my = result;
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    uobj.user_status = ds1.Tables[0].Rows[i]["status"].ToString();
                    
                    usersexportlist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }

        }
        public static string User_Role_Name(string usertype)
        {
            string varUserType = string.Empty;
            if (usertype != "Administrator" && usertype != "Accounting" && usertype != "Mod Squad" && usertype != "Author" && usertype != "Shop Manager" && usertype != "Subscriber" && usertype != "Supply Chain Manager" && usertype != "SEO Editor")
            {

                Models.clsSerialization vardeserilaziation = new Models.clsSerialization();
                Hashtable ht = (Hashtable)vardeserilaziation.Deserialize(usertype);

                if (ht.ContainsKey("administrator"))
                {
                    varUserType = "Administrator";
                }
                else if (ht.ContainsKey("accounting"))
                {
                    varUserType = "Accounting";
                }
                else if (ht.ContainsKey("modsquad"))
                {
                    varUserType = "Mod Squad";
                }
                else if (ht.ContainsKey("author"))
                {
                    varUserType = "Author";
                }
                else if (ht.ContainsKey("shop_manager"))
                {
                    varUserType = "Shop Manager";
                }
                else if (ht.ContainsKey("subscriber"))
                {
                    varUserType = "Subscriber";
                }
                else if (ht.ContainsKey("supplychainmanager"))
                {
                    varUserType = "Supply Chain Manager";
                }
                else if (ht.ContainsKey("wpseo_editor"))
                {
                    varUserType = "SEO Editor";
                }
                else
                {
                    varUserType = string.Empty;
                }
            }
            return varUserType;
        }


        //public static string ssql = "SELECT o.ID as order_id, o.post_date as order_created, oi.order_item_name as product_name,oi.order_item_type as item_type," +
        //"(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_product_id') as product_id," +
        //"(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_product_variation_id') as variant_id," +
        //"(SELECT meta_value FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_qty') as qty," +
        //"(SELECT format(meta_value, 2) FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_line_subtotal') as subtotal," +
        //"(SELECT format(meta_value, 2) FROM wp_woocommerce_order_itemmeta WHERE order_item_id = oi.order_item_id AND meta_key = '_line_total') as total" +
        //" FROM wp_posts o LEFT JOIN wp_woocommerce_order_items oi ON oi.order_id = o.id LEFT JOIN wp_posts p ON p.ID = oi.order_item_id WHERE o.post_type = 'shop_order' limit 2000 ";
        public static string ssql = "select ws.order_id as order_id, ws.date_created as order_created, substring(ws.status,4) as status,  ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total, ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID order by ws.order_id desc limit 6000";


        public static List<Export_Details> exportorderlist = new List<Export_Details>();

        public static void ExportOrderDetails()
        {
            try
            {
                exportorderlist.Clear();
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["order_id"].ToString());
                    uobj.order_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["order_created"].ToString());
                    uobj.customer_id = ds1.Tables[0].Rows[i]["customer_id"].ToString();
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["status"].ToString();
                    //uobj.product_id = ds1.Tables[0].Rows[i]["product_id"].ToString();
                    //uobj.variant_id = ds1.Tables[0].Rows[i]["variant_id"].ToString();
                    uobj.qty = ds1.Tables[0].Rows[i]["qty"].ToString();
                    uobj.subtotal = ds1.Tables[0].Rows[i]["subtotal"].ToString();
                    uobj.total = ds1.Tables[0].Rows[i]["total"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

    }
}