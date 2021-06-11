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
using System.Security.Cryptography;
using System.Text;

namespace LaylaERP.BAL
{
    public class UsersRepositry
    {
        private static string itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        public static string UserPassword;
        public static List<clsUserDetails> userslist = new List<clsUserDetails>();
        //string result = string.Empty;
        public static void ShowUsersDetails(string rolee)
        {
            
            try
            {
                if(rolee==null || rolee == "")
                {
                    rolee = "%";
                }
                userslist.Clear();
                DataSet ds1 = new DataSet();
                string sqlquery = "select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,user_pass,meta_value from wp_users, wp_usermeta WHERE wp_usermeta.meta_value like '%"+rolee+"%' And wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID ASC";
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
            string strQuery = "select count(meta_value) from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' and meta_value not like '%customer%'";
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
            string strQuery = "select count(meta_value) from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' and meta_value not like '%customer%'";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return count;
        }

        public static int EditCustomerStatus(CustomerModel model)
        {
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id=" + model.ID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_status", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int DeleteUsers(string ID)
        {
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id in(" + ID + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_status", "1")
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int changeRoleStatus(CustomerModel model)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value=@meta_value where meta_Key = 'wp_capabilities' and user_id in(" + model.strVal + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@meta_value", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        //Add customers
        public static int AddNewCustomer(clsUserDetails model)
        {
            try
            {

                model.password = EncryptedPwd(model.password);
                string strsql = "insert into wp_users(user_login,user_pass,user_nicename, user_email, user_registered, display_name, user_image) values(@user_login,@user_pass,@user_nicename, @user_email, @user_registered, @display_name, @user_image);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_login", model.user_nicename),
                    new MySqlParameter("@user_pass", model.password),
                    new MySqlParameter("@user_nicename", model.user_nicename),
                    new MySqlParameter("@user_email", model.user_email),
                    new MySqlParameter("@user_registered", Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new MySqlParameter("@display_name", model.user_nicename),
                    new MySqlParameter("@user_image", "None"),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static void AddUserMetaData(clsUserDetails model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


        public static void AddUserMoreMeta(clsUserDetails model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        //-----------------end


        //Password----------------

        public static string EncryptedPwd(string varPassword)
        {
            string expected = "$P$BPGbwPLs6N6VlZ7OqRUvIY1Uvo/Bh9/";
            return MD5Encode(varPassword, expected);
        }
        static string MD5Encode(string password, string hash)
        {
            string output = "*0";
            if (hash == null) return output;
            if (hash.StartsWith(output)) output = "*1";

            string id = hash.Substring(0, 3);
            // We use "$P$", phpBB3 uses "$H$" for the same thing
            if (id != "$P$" && id != "$H$") return output;

            // get who many times will generate the hash
            int count_log2 = itoa64.IndexOf(hash[3]);
            if (count_log2 < 7 || count_log2 > 30)
                return output;

            int count = 1 << count_log2;

            string salt = hash.Substring(4, 8);
            if (salt.Length != 8)
                return output;

            byte[] hashBytes = { };
            using (MD5 md5Hash = MD5.Create())
            {
                hashBytes = md5Hash.ComputeHash(Encoding.ASCII.GetBytes(salt + password));
                byte[] passBytes = Encoding.ASCII.GetBytes(password);
                do
                {
                    hashBytes = md5Hash.ComputeHash(hashBytes.Concat(passBytes).ToArray());
                } while (--count > 0);
            }

            output = hash.Substring(0, 12);
            string newHash = Encode64(hashBytes, 16);

            return output + newHash;
        }
        static string Encode64(byte[] input, int count)
        {
            StringBuilder sb = new StringBuilder();
            int i = 0;
            do
            {
                int value = (int)input[i++];
                sb.Append(itoa64[value & 0x3f]); // to uppercase
                if (i < count)
                    value = value | ((int)input[i] << 8);
                sb.Append(itoa64[(value >> 6) & 0x3f]);
                if (i++ >= count)
                    break;
                if (i < count)
                    value = value | ((int)input[i] << 16);
                sb.Append(itoa64[(value >> 12) & 0x3f]);
                if (i++ >= count)
                    break;
                sb.Append(itoa64[(value >> 18) & 0x3f]);
            } while (i < count);

            return sb.ToString();
        }
        //Password End--------------

        


    }
}