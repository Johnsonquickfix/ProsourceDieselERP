using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
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
                    DateTime fromdateuser = DateTime.ParseExact(from_dateusers, "MM-dd-yyyy", null);
                    DateTime todateusers = DateTime.ParseExact(to_dateusers, "MM-dd-yyyy", null);

                    //sqlquery = "select ID, User_Image, user_login, user_status, DATE(wp_users.user_registered) as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, meta_value from wp_users, wp_usermeta WHERE DATE(wp_users.user_registered)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and DATE(wp_users.user_registered)<='" + todateusers.ToString("yyyy-MM-dd") + "' and wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";
                    /*sqlquery = "select ID, User_Image, user_login, user_status, DATE_FORMAT(wp_users.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, " +
                         "CONCAT((case when um.meta_value like '%administrator%' then 'Administrator,' else '' end),(case when um.meta_value like '%accounting%' then 'Accounting,' else '' end),"
                             + " (case when um.meta_value like '%author%' then 'Author,' else '' end),(case when um.meta_value like '%modsquad%' then 'Mod Squad,' else '' end),"
                             + " (case when um.meta_value like '%shop_manager%' then 'Shop Manager,' else '' end),(case when um.meta_value like '%subscriber%' then 'Subscriber,' else '' end),"
                             + " (case when um.meta_value like '%supplychainmanager%' then 'Supply Chain Manager,' else '' end),(case when um.meta_value like '%wpseo_editor%' then 'SEO Editor,' else '' end),"
                             + " (case when um.meta_value like '%editor%' then 'Editor,' else '' end),(case when um.meta_value like '%seo_manager%' then 'SEO Manager,' else '' end),"
                             + " (case when um.meta_value like '%contributor%' then 'SEO Contributor,' else '' end)) meta_value" +
                         " from wp_users, wp_usermeta um WHERE DATE(wp_users.user_registered)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and DATE(wp_users.user_registered)<='" + todateusers.ToString("yyyy-MM-dd") + "' and um.meta_key='wp_capabilities' And wp_users.ID=um.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";*/

                    sqlquery = "select ID, user_login, user_status, iif(user_status = 0,'Active','InActive') as status,user_email, user_registered as created_date,"
                                     + "um.meta_value as meta_value, umph.meta_value Phone,CONCAT(umfn.meta_value,' ',umln.meta_value) as name, CONCAT(umadd.meta_value, ' ', COALESCE(umadd2.meta_value, ''), ' ', umacity.meta_value, ' ', umastate.meta_value, ' ', umapostalcode.meta_value )  address"
                                     + " from wp_users u inner join wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%'"
                                     + " LEFT OUTER JOIN wp_usermeta umph on umph.meta_key = 'billing_phone' And umph.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umadd on umadd.meta_key = 'billing_address_1' And umadd.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = 'billing_address_2' And umadd2.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umacity on umacity.meta_key = 'billing_city' And umacity.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umastate on umastate.meta_key = 'billing_state' And umastate.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umfn on umfn.meta_key = 'first_name' And umfn.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umln on umln.meta_key = 'last_name' And umln.user_id = u.ID"
                                     + " LEFT OUTER JOIN wp_usermeta umapostalcode on umapostalcode.meta_key = 'billing_postcode' And umapostalcode.user_id = u.ID  WHERE cast(user_registered as date)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and cast(user_registered as date)<='" + todateusers.ToString("yyyy-MM-dd") + "' ORDER BY ID ASC";
                }
                else if (!string.IsNullOrEmpty(rolee))
                {
                    /*sqlquery = "select ID, User_Image, user_login, user_status, DATE_FORMAT(wp_users.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, " +
                         "CONCAT((case when um.meta_value like '%administrator%' then 'Administrator,' else '' end),(case when um.meta_value like '%accounting%' then 'Accounting,' else '' end),"
                             + " (case when um.meta_value like '%author%' then 'Author,' else '' end),(case when um.meta_value like '%modsquad%' then 'Mod Squad,' else '' end),"
                             + " (case when um.meta_value like '%shop_manager%' then 'Shop Manager,' else '' end),(case when um.meta_value like '%subscriber%' then 'Subscriber,' else '' end),"
                             + " (case when um.meta_value like '%supplychainmanager%' then 'Supply Chain Manager,' else '' end),(case when um.meta_value like '%wpseo_editor%' then 'SEO Editor,' else '' end),"
                             + " (case when um.meta_value like '%editor%' then 'Editor,' else '' end),(case when um.meta_value like '%seo_manager%' then 'SEO Manager,' else '' end),"
                             + " (case when um.meta_value like '%contributor%' then 'SEO Contributor,' else '' end),"
                             + " (case when um.meta_value like '%test%' then 'Test,' else '' end)) meta_value"
                         +" from wp_users, wp_usermeta um WHERE um.meta_value like '%" + rolee + "%' and um.meta_key='wp_capabilities' And wp_users.ID=um.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";*/

                    sqlquery = "select ID, user_login, user_status, iif(user_status = 0,'Active','InActive') as status,user_email, user_registered as created_date,"
                                  + "um.meta_value as meta_value, umph.meta_value Phone,CONCAT(umfn.meta_value,' ',umln.meta_value) as name, CONCAT(umadd.meta_value, ' ', COALESCE(umadd2.meta_value, ''), ' ', umacity.meta_value, ' ', umastate.meta_value, ' ', umapostalcode.meta_value )  address"
                                  + " from wp_users u inner join wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%'"
                                  + " LEFT OUTER JOIN wp_usermeta umph on umph.meta_key = 'billing_phone' And umph.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umadd on umadd.meta_key = 'billing_address_1' And umadd.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = 'billing_address_2' And umadd2.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umacity on umacity.meta_key = 'billing_city' And umacity.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umastate on umastate.meta_key = 'billing_state' And umastate.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umfn on umfn.meta_key = 'first_name' And umfn.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umln on umln.meta_key = 'last_name' And umln.user_id = u.ID"
                                  + " LEFT OUTER JOIN wp_usermeta umapostalcode on umapostalcode.meta_key = 'billing_postcode' And umapostalcode.user_id = u.ID  WHERE um.meta_value like '%" + rolee + "%' ORDER BY ID ASC";

                }
                else
                {
                    /*sqlquery = "select ID, User_Image, user_login, user_status, DATE_FORMAT(wp_users.user_registered,'%M %d %Y') as created_date, if(user_status=0,'Active','InActive') as status,user_email,user_pass, " +
                        "CONCAT((case when um.meta_value like '%administrator%' then 'Administrator,' else '' end),(case when um.meta_value like '%accounting%' then 'Accounting,' else '' end),"
                            + " (case when um.meta_value like '%author%' then 'Author,' else '' end),(case when um.meta_value like '%modsquad%' then 'Mod Squad,' else '' end),"
                            + " (case when um.meta_value like '%shop_manager%' then 'Shop Manager,' else '' end),(case when um.meta_value like '%subscriber%' then 'Subscriber,' else '' end),"
                            + " (case when um.meta_value like '%supplychainmanager%' then 'Supply Chain Manager,' else '' end),(case when um.meta_value like '%wpseo_editor%' then 'SEO Editor,' else '' end),"
                            + " (case when um.meta_value like '%editor%' then 'Editor,' else '' end),(case when um.meta_value like '%seo_manager%' then 'SEO Manager,' else '' end),"
                            + " (case when um.meta_value like '%contributor%' then 'SEO Contributor,' else '' end),"
                            +" (case when um.meta_value like '%test%' then 'Test,' else '' end)) meta_value"
                        +" from wp_users, wp_usermeta um WHERE um.meta_key='wp_capabilities' And wp_users.ID=um.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID DESC";*/

                    sqlquery = "select ID, user_login, user_status, iif (user_status = 0,'Active','InActive') as status,user_email, user_registered as created_date,"
                              + "um.meta_value as meta_value, umph.meta_value Phone,CONCAT(umfn.meta_value,' ',umln.meta_value) as name, CONCAT(umadd.meta_value, ' ', COALESCE(umadd2.meta_value, ''), ' ', umacity.meta_value, ' ', umastate.meta_value, ' ', umapostalcode.meta_value )  address"
                              + " from wp_users u inner join wp_usermeta um on um.user_id = u.id and um.meta_key = 'wp_capabilities' and meta_value NOT LIKE '%customer%'"
                              + " LEFT OUTER JOIN wp_usermeta umph on umph.meta_key = 'billing_phone' And umph.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umadd on umadd.meta_key = 'billing_address_1' And umadd.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umadd2 on umadd2.meta_key = 'billing_address_2' And umadd2.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umacity on umacity.meta_key = 'billing_city' And umacity.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umastate on umastate.meta_key = 'billing_state' And umastate.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umfn on umfn.meta_key = 'first_name' And umfn.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umln on umln.meta_key = 'last_name' And umln.user_id = u.ID"
                              + " LEFT OUTER JOIN wp_usermeta umapostalcode on umapostalcode.meta_key = 'billing_postcode' And umapostalcode.user_id = u.ID ORDER BY ID ASC";
                }
                //WHERE um.meta_value like '%" + rolee + "%'
                usersexportlist.Clear();
                DataSet ds1 = new DataSet();

                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();


                    /*if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["meta_value"].ToString()) && ds1.Tables[0].Rows[i]["meta_value"].ToString().Length > 5 && ds1.Tables[0].Rows[i]["meta_value"].ToString().Substring(0, 2) == "a:")
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
                    uobj.first_name = ds1.Tables[0].Rows[i]["name"].ToString();
                    result = ds1.Tables[0].Rows[i]["meta_value"].ToString().TrimEnd(',');

                    if (result == "Mod_Squad")
                    {
                        result = "Modsquad";
                    }
                    else if (result == "accounting")
                    {
                        result = "Accounting";
                    }
                    else if (result == "accounting")
                    {
                        result = "Accounting";
                    }
                    else if (result == "wpseo_editor")
                    {
                        result = "Seo Editor";
                    }
                    else if (result == "SEO_Editor")
                    {
                        result = "Seo Editor";
                    }
                    else if (result == "modsquad")
                    {
                        result = "Modsquad";
                    }
                    else if (result == "seo_manager")
                    {
                        result = "Seo Manager";
                    }
                    else if (result == "Shop_Manager")
                    {
                        result = "Shop Manager";
                    }
                    else if (result == "shopmanager")
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
                    else if (result == "modsquad,administrator")
                    {
                        result = "Modsquad, Administrator";
                    }
                    else if (result == "SEO_Editor,modsquad")
                    {
                        result = "Seo Editor, Modsquad";
                    }
                    else if (result == "shop_manager")
                    {
                        result = "Shop Manager";
                    }
                    
                    else
                    {
                        result = ds1.Tables[0].Rows[i]["meta_value"].ToString().TrimEnd(',');
                        result=System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(result.ToLower());
                    }*/
                    uobj.UID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.first_name = ds1.Tables[0].Rows[i]["name"].ToString();
                    uobj.my = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.phone = ds1.Tables[0].Rows[i]["Phone"].ToString();
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    uobj.user_address = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.created_date = Convert.ToDateTime(ds1.Tables[0].Rows[i]["created_date"].ToString());
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
                    varUserType = "Modsquad";
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

        public static void ExportOrderDetails(string from_date, string to_date, string user)
        {
            try
            {
                exportorderlist.Clear();
                string ssql;

                if (!string.IsNullOrEmpty(from_date) && !string.IsNullOrEmpty(to_date))
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.ParseExact(from_date,"MM-dd-yyyy",null);
                    todate = DateTime.ParseExact(to_date, "MM-dd-yyyy", null);

                    //ssql = "select ws.order_id as id, ws.order_id as order_id, DATE_FORMAT(ws.date_created, '%M %d %Y') order_created, substring(ws.status,4) as status,  ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total, ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID and DATE(ws.date_created)>='" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(ws.date_created)<='" + todate.ToString("yyyy-MM-dd") + "' order by ws.order_id desc limit 100";
                    ssql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold as qty,(os.total_sales) as subtotal,(os.net_total) as total,(os.tax_total) as tax, os.customer_id as customer_id, REPLACE(p.post_status, 'wc-', '') as status, os.date_created as order_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName"
                         + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                         + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                         + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                         + " left join wp_postmeta pmm on os.order_id = pmm.post_id and pmm.meta_key = 'employee_id'"
                         + " WHERE pmm.meta_value='"+user+"' and p.post_type = 'shop_order'and p.post_status != 'auto-draft' and cast(os.date_created as date)>='" + fromdate.ToString("yyyy-MM-dd") + "' and cast(os.date_created as date)<='" + todate.ToString("yyyy-MM-dd") + "' order by p.id";

                }
                else
                {
                    //ssql = "select ws.order_id as id,ws.order_id as order_id,DATE_FORMAT(ws.date_created, '%M %d %Y') order_created,substring(ws.status,4) as status,ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total,ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID order by ws.order_id desc limit 1000";
                    ssql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold as qty, cast(os.total_sales as decimal(10,2)) as subtotal,"
                            + " cast(os.net_total as decimal(10,2)) as total, cast(os.tax_total as decimal(10,2)) as tax,os.shipping_total as shipping_total, os.customer_id as customer_id,"
                            + " REPLACE(p.post_status, 'wc-', '') as status, os.date_created as order_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmm on os.order_id = pmm.post_id and pmm.meta_key = 'employee_id'"
                            + " WHERE pmm.meta_value='" + user + "' and p.post_type = 'shop_order' and p.post_status != 'auto-draft' order by p.id";
                }
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();
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
                    //uobj.shipping_amount = "$" + ds1.Tables[0].Rows[i]["shipping_total"].ToString();
                    //uobj.coupon = "$" + ds1.Tables[0].Rows[i]["coupon"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public static void GetOrderData(string from_date, string to_date, string user, string status)
        {
            try
            {
                string strWhr = string.Empty;
                exportorderlist.Clear();
                string ssql;

                if (status != "0")
                {
                    strWhr += " and (p.post_status ='" + status + "') ";
                }

                if (!string.IsNullOrEmpty(from_date) && !string.IsNullOrEmpty(to_date))
                {
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.ParseExact(from_date, "MM-dd-yyyy", null);
                    todate = DateTime.ParseExact(to_date, "MM-dd-yyyy", null);


                   

                    //ssql = "select ws.order_id as id, ws.order_id as order_id, DATE_FORMAT(ws.date_created, '%M %d %Y') order_created, substring(ws.status,4) as status,  ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total, ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID and DATE(ws.date_created)>='" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(ws.date_created)<='" + todate.ToString("yyyy-MM-dd") + "' order by ws.order_id desc limit 100";
                    ssql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold as qty,(os.total_sales) as subtotal,(os.net_total) as total,(os.tax_total) as tax, os.customer_id as customer_id, REPLACE(p.post_status, 'wc-', '') as status, os.date_created as order_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,DATEDIFF(day,os.date_created , getdate() ) daysdiff"
                         + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                         + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                         + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                         + " left join wp_postmeta pmm on os.order_id = pmm.post_id and pmm.meta_key = 'employee_id'"
                         + " WHERE pmm.meta_value='" + user + "'  and p.post_type = 'shop_order' "+ strWhr + "and p.post_status != 'auto-draft' and cast(os.date_created as date)>='" + fromdate.ToString("yyyy-MM-dd") + "' and cast(os.date_created as date)<='" + todate.ToString("yyyy-MM-dd") + "' order by p.id";

                }
                else
                {
                    //ssql = "select ws.order_id as id,ws.order_id as order_id,DATE_FORMAT(ws.date_created, '%M %d %Y') order_created,substring(ws.status,4) as status,ws.num_items_sold as qty,format(ws.total_sales, 2) as subtotal,format(ws.net_total, 2) as total,ws.customer_id as customer_id from wp_wc_order_stats ws, wp_users wu where ws.customer_id = wu.ID order by ws.order_id desc limit 1000";
                    ssql = "SELECT p.id order_id, p.id as chkorder,os.num_items_sold as qty, cast(os.total_sales as decimal(10,2)) as subtotal,"
                            + " cast(os.net_total as decimal(10,2)) as total, cast(os.tax_total as decimal(10,2)) as tax,os.shipping_total as shipping_total, os.customer_id as customer_id,"
                            + " REPLACE(p.post_status, 'wc-', '') as status, os.date_created as order_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,DATEDIFF(day,os.date_created , getdate() ) daysdiff"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmm on os.order_id = pmm.post_id and pmm.meta_key = 'employee_id'"
                            + " WHERE pmm.meta_value='" + user + "' and p.post_type = 'shop_order' "+ strWhr + " and p.post_status != 'auto-draft' order by p.id";
                }
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet(ssql);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();
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


        public static void ExportCustomersDetails(string from_dateusers, string to_dateusers)
        {
            try
            {
                string sqlquery = string.Empty;
                if (!string.IsNullOrEmpty(from_dateusers) && !string.IsNullOrEmpty(to_dateusers))
                {
                    DateTime fromdateuser = DateTime.ParseExact(from_dateusers, "MM-dd-yyyy", null);
                    DateTime todateusers = DateTime.ParseExact(to_dateusers, "MM-dd-yyyy", null);


                    /*sqlquery = "select ur.ID,null User_Image, user_login , user_status, ur.user_registered as created_date, iif(user_status=0,'Active','InActive') as status,user_email,"
                          + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'first_name') as first_name,"
                                + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'last_name') as last_name,"
                                + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'billing_address_1') as billing_address_1,"
                                + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'billing_city') as billing_city,"
                                + " (SELECT meta_value from wp_usermeta WHERE user_id = ur.ID AND meta_key='billing_postcode')as billing_postcode,"
                                + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'billing_phone') as billing_phone,"
                                + " (SELECT concat(first_name,' ', last_name)) as name,"
                                + " (SELECT concat(billing_address_1,' ', billing_city,' ', billing_postcode))as address"
                        + " from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE DATE(ur.user_registered)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and DATE(ur.user_registered)<='" + todateusers.ToString("yyyy-MM-dd") + "' ORDER BY ur.ID DESC";*/
                    sqlquery = "SELECT ur.id,user_nicename, CONVERT(VARCHAR(12), user_registered, 101) created_date, user_status,"
                          + " (CONCAT(ISNULL(umadd.meta_value+', ',''), ISNULL(umacity.meta_value+', ',''), ISNULL(umastate.meta_value+', ',''),ISNULL(umpostcode.meta_value,''))) address,user_email,CONCAT(umfn.meta_value, ' ', umln.meta_value) name ,"
                          + " umph.meta_value billing_phone from wp_users ur INNER JOIN wp_usermeta um on um.meta_key = 'wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'"
                          + " LEFT OUTER JOIN wp_usermeta umph on umph.user_id = ur.ID and umph.meta_key = 'billing_phone'"
                          + " LEFT OUTER JOIN wp_usermeta umadd on umadd.user_id = ur.ID and umadd.meta_key = 'billing_address_1'"
                          + " LEFT OUTER JOIN wp_usermeta umfn on umfn.user_id = ur.ID  and umfn.meta_key = 'first_name'"
                          + " LEFT OUTER JOIN wp_usermeta umln on umln.user_id = ur.ID and umln.meta_key = 'last_name'"
                          + " LEFT OUTER JOIN wp_usermeta umacity on umacity.user_id = ur.ID and umacity.meta_key = 'billing_city'"
                          + " LEFT OUTER JOIN wp_usermeta umastate on umastate.user_id = ur.ID and umastate.meta_key = 'billing_state'"
                          + " LEFT OUTER JOIN wp_usermeta umpostcode on umpostcode.user_id = ur.ID and umpostcode.meta_key = 'billing_postcode'"
                          + " WHERE cast(user_registered as date)>='" + fromdateuser.ToString("yyyy-MM-dd") + "' and cast(user_registered as date)<='" + todateusers.ToString("yyyy-MM-dd") + "' order by ur.id  desc";
                }
                else
                {
                    //sqlquery = "select ur.ID,null User_Image, user_login , user_status, ur.user_registered as created_date, iif(user_status=0,'Active','InActive') as status,user_email,"
                    //            + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'first_name') as first_name,"
                    //            + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'last_name') as last_name,"
                    //            + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'billing_address_1') as billing_address_1,"
                    //            + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'billing_city') as billing_city,"
                    //            + " (SELECT meta_value from wp_usermeta WHERE user_id = ur.ID AND meta_key='billing_postcode')as billing_postcode,"
                    //            + " (SELECT meta_value FROM wp_usermeta WHERE user_id = ur.ID AND meta_key = 'billing_phone') as billing_phone,"
                    //            + " (SELECT concat(first_name,' ', last_name)) as name,"
                    //            + " (SELECT concat(billing_address_1,' ', billing_city,' ', billing_postcode))as address"
                    //      + " from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'";

                    sqlquery = "SELECT top 100 ur.id,user_nicename, CONVERT(VARCHAR(12), user_registered, 101) created_date, user_status,"
                               + " (CONCAT(ISNULL(umadd.meta_value+', ',''), ISNULL(umacity.meta_value+', ',''), ISNULL(umastate.meta_value+', ',''),ISNULL(umpostcode.meta_value,''))) address,user_email,CONCAT(umfn.meta_value, ' ', umln.meta_value) name ,"
                               + " umph.meta_value billing_phone from wp_users ur INNER JOIN wp_usermeta um on um.meta_key = 'wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'"
                               + " LEFT OUTER JOIN wp_usermeta umph on umph.user_id = ur.ID and umph.meta_key = 'billing_phone'"
                               + " LEFT OUTER JOIN wp_usermeta umadd on umadd.user_id = ur.ID and umadd.meta_key = 'billing_address_1'"
                               + " LEFT OUTER JOIN wp_usermeta umfn on umfn.user_id = ur.ID  and umfn.meta_key = 'first_name'"
                               + " LEFT OUTER JOIN wp_usermeta umln on umln.user_id = ur.ID and umln.meta_key = 'last_name'"
                               + " LEFT OUTER JOIN wp_usermeta umacity on umacity.user_id = ur.ID and umacity.meta_key = 'billing_city'"
                               + " LEFT OUTER JOIN wp_usermeta umastate on umastate.user_id = ur.ID and umastate.meta_key = 'billing_state'"
                               + " LEFT OUTER JOIN wp_usermeta umpostcode on umpostcode.user_id = ur.ID and umpostcode.meta_key = 'billing_postcode'"
                               + " WHERE 1 = 1 order by ur.id desc";
                }
                customersexportlist.Clear();
                DataSet ds1 = new DataSet();

                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    ExportModel uobj = new ExportModel();

                    uobj.UID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.customer_phone = ds1.Tables[0].Rows[i]["billing_phone"].ToString();
                    uobj.customer_name = ds1.Tables[0].Rows[i]["name"].ToString();
                    uobj.customer_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    uobj.customer_status = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.customerdate_created = Convert.ToDateTime(ds1.Tables[0].Rows[i]["created_date"].ToString());
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