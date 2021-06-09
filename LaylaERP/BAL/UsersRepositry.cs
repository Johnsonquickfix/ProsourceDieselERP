using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System.Data;
using System.Configuration;
using Newtonsoft.Json;
using System.Collections;
using LaylaERP.DAL;

namespace LaylaERP.BAL
{
    public class UsersRepositry
    {
        public static List<clsUserDetails> userslist = new List<clsUserDetails>();
        //string result = string.Empty;
        public static void ShowUsersDetails()
        {
            
            try
            {
                userslist.Clear();
                DataSet ds1 = new DataSet();
                string sqlquery = "select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,user_pass,meta_value from wp_users, wp_usermeta WHERE wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID ASC";
                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;
                
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    clsUserDetails uobj = new clsUserDetails();
                    //Code for role

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

                    uobj.ID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.user_login = ds1.Tables[0].Rows[i]["user_login"].ToString();
                    result = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.my = result;
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    if ((ds1.Tables[0].Rows[i]["user_status"].ToString() == "0"))
                    { uobj.user_status = "Active"; }
                    else { uobj.user_status = "InActive"; }

                    //Code For Role End
                    userslist.Add(uobj);
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


        public static int RoleCount()
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%administrator%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            //select COUNT(meta_value)as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%Mod Squad%' OR meta_value like '%modsquad%'
            return count;
        }

        public static int RoleCount(int a)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%Mod Squad%' OR meta_value like '%modsquad%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }

        public static int RoleCount(int a,int b)
        {
            int count = 0;
            string strQuery = "select count(meta_value) from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' and meta_value like '%customer%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }

        public static int RoleCount(int a, int b, int c)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%shop manager%' OR meta_value like '%shopmanager%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }

        public static int RoleCount(int a, int b, int c, int d)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%subscriber%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }
        public static int RoleCount(int a, int b, int c, int d, int e)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%Supply Chain Manager%' or meta_value like '%supplychainmanager%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }
        public static int RoleCount(int a, int b, int c, int d, int e, int f)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%norole%' or meta_value like '%no role%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }
        public static int RoleCount(int a, int b, int c, int d, int e, int f, int g)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%author%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }
        public static int RoleCount(int a, int b, int c, int d, int e, int f, int g, int h)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%no role%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }
        public static int RoleCount(int a, int b, int c, int d, int e, int f, int g, int h, int i)
        {
            int count = 0;
            string strQuery = "select COUNT(meta_value) as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%accounting%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }

        public static int RoleCount(int a, int b, int c, int d, int e, int f, int g, int h, int i, int j)
        {
            int count = 0;
            string strQuery = "select count(*) from wp_users";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }
    }
}