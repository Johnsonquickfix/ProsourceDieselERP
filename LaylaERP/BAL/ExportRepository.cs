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
        public static List<ExportModel> usersexportlist = new List<ExportModel>();
        public static List<ExportModel> customersexportlist = new List<ExportModel>();
        
        public static void ExportUsersDetails(string from_dateusers, string to_dateusers, string rolee)
        {
            try
            {
                string sqlquery = string.Empty;
                if (!string.IsNullOrEmpty(from_dateusers) && !string.IsNullOrEmpty(to_dateusers))
                {
                    DateTime fromdateuser = DateTime.Parse(from_dateusers);
                    DateTime todateusers = DateTime.Parse(to_dateusers);
                    //sqlquery = "select ID, User_Image, user_login, user_status, DATE(wp_users.user_registered) as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, meta_value from wp_users, wp_usermeta WHERE DATE(wp_users.user_registered)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and DATE(wp_users.user_registered)<='" + todateusers.ToString("yyyy-MM-dd") + "' and wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";
                    sqlquery = "select ID, User_Image, user_login, user_status, DATE_FORMAT(wp_users.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, " +
                         "CONCAT((case when um.meta_value like '%administrator%' then 'Administrator,' else '' end),(case when um.meta_value like '%accounting%' then 'Accounting,' else '' end),"
                             + " (case when um.meta_value like '%author%' then 'Author,' else '' end),(case when um.meta_value like '%modsquad%' then 'Mod Squad,' else '' end),"
                             + " (case when um.meta_value like '%shop_manager%' then 'Shop Manager,' else '' end),(case when um.meta_value like '%subscriber%' then 'Subscriber,' else '' end),"
                             + " (case when um.meta_value like '%supplychainmanager%' then 'Supply Chain Manager,' else '' end),(case when um.meta_value like '%wpseo_editor%' then 'SEO Editor,' else '' end),"
                             + " (case when um.meta_value like '%editor%' then 'Editor,' else '' end),(case when um.meta_value like '%seo_manager%' then 'SEO Manager,' else '' end),"
                             + " (case when um.meta_value like '%contributor%' then 'SEO Contributor,' else '' end)) meta_value" +
                         " from wp_users, wp_usermeta um WHERE DATE(wp_users.user_registered)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and DATE(wp_users.user_registered)<='" + todateusers.ToString("yyyy-MM-dd") + "' and um.meta_key='wp_capabilities' And wp_users.ID=um.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";
                }
                else if(!string.IsNullOrEmpty(rolee))
                {
                    sqlquery = "select ID, User_Image, user_login, user_status, DATE_FORMAT(wp_users.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, " +
                         "CONCAT((case when um.meta_value like '%administrator%' then 'Administrator,' else '' end),(case when um.meta_value like '%accounting%' then 'Accounting,' else '' end),"
                             + " (case when um.meta_value like '%author%' then 'Author,' else '' end),(case when um.meta_value like '%modsquad%' then 'Mod Squad,' else '' end),"
                             + " (case when um.meta_value like '%shop_manager%' then 'Shop Manager,' else '' end),(case when um.meta_value like '%subscriber%' then 'Subscriber,' else '' end),"
                             + " (case when um.meta_value like '%supplychainmanager%' then 'Supply Chain Manager,' else '' end),(case when um.meta_value like '%wpseo_editor%' then 'SEO Editor,' else '' end),"
                             + " (case when um.meta_value like '%editor%' then 'Editor,' else '' end),(case when um.meta_value like '%seo_manager%' then 'SEO Manager,' else '' end),"
                             + " (case when um.meta_value like '%contributor%' then 'SEO Contributor,' else '' end),"
                             + " (case when um.meta_value like '%test%' then 'Test,' else '' end)) meta_value"
                         +" from wp_users, wp_usermeta um WHERE um.meta_value like '%" + rolee + "%' and um.meta_key='wp_capabilities' And wp_users.ID=um.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";
                }
                else
                {
                    sqlquery = "select ID, User_Image, user_login, user_status, DATE_FORMAT(wp_users.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, " +
                        "CONCAT((case when um.meta_value like '%administrator%' then 'Administrator,' else '' end),(case when um.meta_value like '%accounting%' then 'Accounting,' else '' end),"
                            + " (case when um.meta_value like '%author%' then 'Author,' else '' end),(case when um.meta_value like '%modsquad%' then 'Mod Squad,' else '' end),"
                            + " (case when um.meta_value like '%shop_manager%' then 'Shop Manager,' else '' end),(case when um.meta_value like '%subscriber%' then 'Subscriber,' else '' end),"
                            + " (case when um.meta_value like '%supplychainmanager%' then 'Supply Chain Manager,' else '' end),(case when um.meta_value like '%wpseo_editor%' then 'SEO Editor,' else '' end),"
                            + " (case when um.meta_value like '%editor%' then 'Editor,' else '' end),(case when um.meta_value like '%seo_manager%' then 'SEO Manager,' else '' end),"
                            + " (case when um.meta_value like '%contributor%' then 'SEO Contributor,' else '' end),"
                            +" (case when um.meta_value like '%test%' then 'Test,' else '' end)) meta_value"
                        +" from wp_users, wp_usermeta um WHERE um.meta_key='wp_capabilities' And wp_users.ID=um.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";
                }
                //WHERE um.meta_value like '%" + rolee + "%'
                usersexportlist.Clear();
                DataSet ds1 = new DataSet();

                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();


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
                    result = ds1.Tables[0].Rows[i]["meta_value"].ToString().TrimEnd(',');

                    if (result == "Mod_Squad")
                    {
                        result = "Mod Squad";
                    }
                    else if (result == "SEO_Editor")
                    {
                        result = "SEO Editor";
                    }
                    else if (result == "SEO_Manager")
                    {
                        result = "SEO Manager";
                    }
                    else if (result == "Shop_Manager")
                    {
                        result = "Shop Manager";
                    }
                    else if (result == "Supply_Chain_Manager")
                    {
                        result = "Supply Chain Manager";
                    }
                    else if (result == "administrator")
                    {
                        result = "Administrator";
                    }
                    else if (result == "author")
                    {
                        result = "Author";
                    }
                    else if (result == "editor")
                    {
                        result = "Editor";
                    }
                    else if (result == "test")
                    {
                        result = "Test";
                    }
                    else
                    {
                        uobj.my = result;
                    }
                    //uobj.my = result;
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    uobj.user_status = ds1.Tables[0].Rows[i]["status"].ToString();
                    uobj.created_date = ds1.Tables[0].Rows[i]["created_date"].ToString();
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
        //public static 


        public static List<ExportModel> exportorderlist = new List<ExportModel>();

        public static void ExportOrderDetails(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (!string.IsNullOrEmpty(from_date) && !string.IsNullOrEmpty(to_date))
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);

                    //ssql = "select ws.order_id as id, ws.order_id as order_id, DATE_FORMAT(ws.date_created, '%M %d %Y') order_created, substring(ws.status,4) as status,  ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total, ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID and DATE(ws.date_created)>='" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(ws.date_created)<='" + todate.ToString("yyyy-MM-dd") + "' order by ws.order_id desc limit 100";
                   ssql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold as qty,Cast(os.total_sales As DECIMAL(10, 2)) as subtotal,format(os.net_total, 2) as total, os.customer_id as customer_id, REPLACE(p.post_status, 'wc-', '') as status, DATE_FORMAT(os.date_created, '%M %d %Y') order_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName"
                        + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                        + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " WHERE p.post_type = 'shop_order' and DATE(os.date_created)>='" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(os.date_created)<='" + todate.ToString("yyyy-MM-dd") + "' order by p.id DESC limit 500";

                }
                else
                {
                    //ssql = "select ws.order_id as id,ws.order_id as order_id,DATE_FORMAT(ws.date_created, '%M %d %Y') order_created,substring(ws.status,4) as status,ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total,ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID order by ws.order_id desc limit 1000";
                    ssql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold as qty,Cast(os.total_sales As DECIMAL(10, 2)) as subtotal,format(os.net_total, 2) as total, os.customer_id as customer_id, REPLACE(p.post_status, 'wc-', '') as status, DATE_FORMAT(os.date_created, '%M %d %Y') order_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " WHERE p.post_type = 'shop_order' order by p.id DESC limit 500";
                 }
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();
                    uobj.order_id = Convert.ToInt32(ds1.Tables[0].Rows[i]["order_id"].ToString());
                    uobj.order_created = ds1.Tables[0].Rows[i]["order_created"].ToString();
                    uobj.first_name = ds1.Tables[0].Rows[i]["FirstName"].ToString();
                    uobj.orderstatus = ds1.Tables[0].Rows[i]["status"].ToString();
                    //uobj.product_id = ds1.Tables[0].Rows[i]["product_id"].ToString();
                    //uobj.variant_id = ds1.Tables[0].Rows[i]["variant_id"].ToString();
                    uobj.qty = ds1.Tables[0].Rows[i]["qty"].ToString();
                    uobj.subtotal = "$" + ds1.Tables[0].Rows[i]["subtotal"].ToString();
                    uobj.total = "$" + ds1.Tables[0].Rows[i]["total"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public static void ExportCustomersDetails(string from_dateusers, string to_dateusers)
        {
            try
            {
                string sqlquery = string.Empty;
                if (!string.IsNullOrEmpty(from_dateusers) && !string.IsNullOrEmpty(to_dateusers))
                {
                    DateTime fromdateuser = DateTime.Parse(from_dateusers);
                    DateTime todateusers = DateTime.Parse(to_dateusers);


                    sqlquery = "select ur.ID,null User_Image, user_login , user_status, DATE_FORMAT(ur.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,umph.meta_value" +
                        " from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'  LEFT OUTER JOIN wp_usermeta umph on umph.meta_key='billing_phone' And umph.user_id = ur.ID WHERE DATE(ur.user_registered)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and DATE(ur.user_registered)<='" + todateusers.ToString("yyyy-MM-dd") + "' ORDER BY ur.ID DESC";
                }
                else
                {
                    sqlquery = "select ur.ID,null User_Image, user_login , user_status, DATE_FORMAT(ur.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,umph.meta_value" +
                        " from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'  LEFT OUTER JOIN wp_usermeta umph on umph.meta_key='billing_phone' And umph.user_id = ur.ID ORDER BY ur.ID DESC limit 1000";
                }
                customersexportlist.Clear();
                DataSet ds1 = new DataSet();

                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();

                    uobj.UID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.customer_login = ds1.Tables[0].Rows[i]["user_login"].ToString();
                    uobj.customer_phone = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.customer_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    uobj.customer_status = ds1.Tables[0].Rows[i]["status"].ToString();
                    uobj.customerdate_created =ds1.Tables[0].Rows[i]["created_date"].ToString();
                    customersexportlist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }

        }

        public static DataTable GetUserRoles()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select user_value, user_type from wp_user_classification order by user_type";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }


    }
}