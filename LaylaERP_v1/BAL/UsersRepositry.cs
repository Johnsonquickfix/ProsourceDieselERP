using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using Newtonsoft.Json;
using System.Collections;
using LaylaERP.DAL;
using System.Security.Cryptography;
using System.Text;
using LaylaERP.UTILITIES;

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
                //if (rolee == null || rolee == "")
                //{
                //    rolee = "";
                //}
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@rolee", rolee)
                };
                userslist.Clear();
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet("wp_userslist", parameters);
                string result = string.Empty;
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    clsUserDetails uobj = new clsUserDetails();
                    uobj.ID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.user_login = ds1.Tables[0].Rows[i]["user_login"].ToString();
                    result = ds1.Tables[0].Rows[i]["meta_value"].ToString().TrimEnd(',');
                    uobj.my = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    if ((ds1.Tables[0].Rows[i]["user_status"].ToString() == "0"))
                    { uobj.user_status = "Active"; }
                    else { uobj.user_status = "InActive"; }
                    uobj.phone = ds1.Tables[0].Rows[i]["Phone"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    //Code For Role End
                    userslist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }

        }


        public static void ShowDataUsersDetails(string rolee)
        {

            try
            {

                userslist.Clear();
                DataSet ds1 = new DataSet();

                string sqlquery = "select ID, user_login,user_status,user_email,user_pass,max(case when um.meta_key = 'wp_capabilities' then um.meta_value else '' end) meta_value,max(case when um.meta_key = 'billing_phone' then um.meta_value else '' end) Phone,"
                                  + "max(case when um.meta_key = 'billing_address_1' then um.meta_value else '' end) billing_address_1,max(case when um.meta_key = 'billing_address_2' then um.meta_value else '' end) billing_address_2,"
                                  + " max(case when um.meta_key = 'billing_city' then um.meta_value else '' end) billing_city,"
                                  + " max(case when um.meta_key = 'billing_state' then um.meta_value else '' end) billing_state,"
                                  + " max(case when um.meta_key = 'billing_postcode' then um.meta_value else '' end) billing_postcode"
                                  + " from wp_users u"
                                  + " inner join wp_usermeta um on um.user_id = u.id "
                                  + " where u.id in (select w_um.user_id from  wp_usermeta w_um where w_um.meta_key = 'wp_capabilities' and w_um.meta_value NOT LIKE '%customer%' and meta_value not like '%a:2%' and w_um.meta_value not like '%a:5%' and w_um.meta_value not like '%a:0%' "
                                  + " and w_um.meta_value not like '%a:8%') group by id,user_login,user_status,user_email,user_pass ORDER BY id ASC";
                if (!string.IsNullOrEmpty(rolee))
                {
                    sqlquery += " and um.meta_value like '%" + rolee + "%' ";
                }
                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    clsUserDetails uobj = new clsUserDetails();
                    uobj.ID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.user_login = ds1.Tables[0].Rows[i]["user_login"].ToString();
                    result = ds1.Tables[0].Rows[i]["meta_value"].ToString().TrimEnd(',');
                    uobj.my = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    if ((ds1.Tables[0].Rows[i]["user_status"].ToString() == "0"))
                    { uobj.user_status = "Active"; }
                    else { uobj.user_status = "InActive"; }
                    uobj.phone = ds1.Tables[0].Rows[i]["Phone"].ToString();
                    string address = ds1.Tables[0].Rows[i]["billing_address_1"].ToString() + ' ' + ds1.Tables[0].Rows[i]["billing_address_2"].ToString() + ' ' + ds1.Tables[0].Rows[i]["billing_city"].ToString() + ' ' + ds1.Tables[0].Rows[i]["billing_state"].ToString() + ' ' + ds1.Tables[0].Rows[i]["billing_postcode"].ToString();
                    uobj.address = address;
                    //Code For Role End
                    userslist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }


        }

        public static DataTable GetDetails(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ur.id,null User_Image,user_nicename, user_registered, user_status, if(user_status=0,'Active','InActive') as status,user_email,umph.meta_value "
                            + " from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value not LIKE '%customer%'"
                            + " LEFT OUTER JOIN wp_usermeta umph on umph.meta_key='billing_phone' And umph.user_id = ur.ID WHERE 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (User_Email like '%" + searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR um.meta_value like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ur.user_status='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, (pageno * pagesize).ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ur.id)/" + pagesize.ToString() + ") TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value not LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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

        public static int RoleCount(int a, int b)
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
                SqlParameter[] para =
                {
                    new SqlParameter("@user_status", model.user_status)
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
                SqlParameter[] para =
                {
                    new SqlParameter("@user_status", "1")
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int ActiveUsers(string ID)
        {
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id in(" + ID + ")";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_status", "0")
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
                SqlParameter[] para =
                {
                    new SqlParameter("@meta_value", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static int GrantroleStatus(CustomerModel model)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value= CONCAT(@meta_value, meta_value) where meta_Key = 'wp_capabilities' and user_id in(" + model.strVal + ")";
                SqlParameter[] para =
                {
                    new SqlParameter("@meta_value", model.user_status + ',')
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int RevokeroleStatus(CustomerModel model)
        {
            try
            {
                int count = 0;
                string strsql = String.Empty;
                int result = 0;
                string strQuery = "select COUNT(meta_value) from wp_usermeta where user_id in (" + model.strVal + ") and meta_Key = 'wp_capabilities' and meta_value like '%" + model.user_status + ',' + "%'";
                count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
                if (count > 0)
                {
                    strsql = "update wp_usermeta set meta_value= REPLACE(meta_value,@meta_value,'') where meta_Key = 'wp_capabilities' and user_id in(" + model.strVal + ")";
                    SqlParameter[] para =
                    {
                    new SqlParameter("@meta_value",  model.user_status+',')
                };
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                }
                else
                {
                    strsql = "update wp_usermeta set meta_value= REPLACE(meta_value,@meta_value,'') where meta_Key = 'wp_capabilities' and user_id in(" + model.strVal + ")";
                    SqlParameter[] para =
                    {
                    new SqlParameter("@meta_value", ',' + model.user_status)
                    };
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                }

                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int GetRoleID(string UserValue)
        {
            int count = 0;
            string strQuery = "select ID from wp_user_classification  where User_value = '" + UserValue + "' ";
            count = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            //select COUNT(meta_value)as meta_value from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' where meta_value like '%Mod Squad%' OR meta_value like '%modsquad%'
            return count;
        }

        //Add customers
        public static int AddNewCustomer(clsUserDetails model)
        {
            try
            {
                DataTable dt = new DataTable();
                model.password = EncryptedPwd(model.password);
                //string strsql = "insert into wp_users(user_login,user_pass,user_nicename, user_email, user_registered, display_name, user_image) values(@user_login,@user_pass,@user_nicename, @user_email, @user_registered, @display_name, @user_image);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@user_login", model.user_nicename),
                    new SqlParameter("@user_pass", model.password),
                    new SqlParameter("@user_nicename", model.user_nicename),
                    new SqlParameter("@user_email", model.user_email),
                    new SqlParameter("@user_registered", Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new SqlParameter("@display_name", model.user_nicename),
                    new SqlParameter("@user_image", model.User_Image),
                };
                dt = SQLHelper.ExecuteDataTable("erp_user_iud", para);
                int result = Convert.ToInt32(dt.Rows[0]["id"]);
                //  int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int ZipcodeByCity(clsUserDetails model)
        {
            try
            {
                string strquery = "";
                if (model.country == "CA")
                    strquery = "select count(StateFullName) from erp_statelist where (statefullname = '" + model.billing_state + "' Or state='" + model.billing_state + "') ";

                else
                    strquery = "select count(ZipCode) from ZIPCodes1 where ZipCode = '" + model.billing_postcode + "' And (statefullname = '" + model.billing_state + "' Or state='" + model.billing_state + "') ";


                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        //GetUserName
        public static int GetUserName(clsUserDetails model)
        {
            try
            {
                string strquery = "select count(ID) from wp_users inner join wp_usermeta on wp_usermeta.user_id =  wp_users.ID and wp_usermeta.meta_key='wp_capabilities' and lower(meta_value) not in ('customer') where user_login = '" + model.user_nicename + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int GetEmailName(clsUserDetails model)
        {
            try
            {
                string strquery = "select count(ID) from wp_users where user_email = '" + model.user_email + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static int UpdateUsers(clsUserDetails model)
        {
            try
            {

                if (!string.IsNullOrEmpty(model.password))
                    model.password = EncryptedPwd(model.password);
                string strsql = "erp_user_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@id", model.ID),
                    new SqlParameter("@user_login", model.user_nicename),
                    new SqlParameter("@user_pass", model.password),
                    new SqlParameter("@user_nicename", model.user_nicename),
                    new SqlParameter("@user_email", model.user_email),
                    new SqlParameter("@display_name", model.user_nicename),
                    new SqlParameter("@user_image", model.User_Image),
                    new SqlParameter("@user_status", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                string strsql = "erp_user_iud";
                SqlParameter[] para =
                {
                     new SqlParameter("@qflag", "IM"),
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static void UpdateUserMetaData(clsUserDetails model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "erp_user_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "UM"),
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
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
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value);";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static void UpdateUserMoreMeta(clsUserDetails model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {

                string strsql = "update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName),
                    new SqlParameter("@meta_value", varFieldsValue),
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

        public static DataTable UsersCounts()
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;

                string strSql = "select COUNT(meta_value) as AllUser,sum(case when meta_value like '%administrator%' then 1 else 0 end) Administrator,"
                            + " sum(case when meta_value like '%accounting%' then 1 else 0 end) Accounting,sum(case when meta_value like '%author%' then 1 else 0 end) Author,"
                            + " sum(case when meta_value like '%modsquad%' then 1 else 0 end) ModSquad,sum(case when meta_value like '%shop_manager%' then 1 else 0 end) ShopManager,"
                            + " sum(case when meta_value like '%subscriber%' then 1 else 0 end) Subscriber,sum(case when meta_value like '%supplychainmanager%' then 1 else 0 end) SupplyChainManager,"
                            + " sum(case when meta_value like '%wpseo_editor%' then 1 else 0 end) SEOEditor,sum(case when meta_value like '%none%' then 1 else 0 end) Norole,"
                            + " sum(case when meta_value like '%editor%' then 1 else 0 end) Editor,sum(case when meta_value like '%seo_manager%' then 1 else 0 end) SEOManager,"
                            + " sum(case when meta_value like '%contributor%' then 1 else 0 end) Contributor"
                            + " from wp_users as ur"
                            + " inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' ";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public int CheckDuplicateUserRole(UserClassification model)
        {
            try
            {
                string strquery = "select count(User_Type) from wp_user_classification where User_Type = '" + model.User_Type + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        //Add role
        public int AddNewRole(UserClassification model)
        {
            try
            {
                string strsql = "insert into wp_user_classification(User_Type,User_Value)values(@User_Type,@User_Value);SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@User_Type", model.User_Type),
                    new SqlParameter("@User_Value", model.User_Type.ToLower().Replace(" ",String.Empty)),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int ChangePermission(string ID, int role_id, string flag)
        {
            try
            {
                DeletePermission(role_id);
                int result = 0;
                string[] values = ID.Split(',');
                string[] strflag = flag.Split(',');



                for (int i = 0; i <= values.Length - 1; i++)
                {
                    ID = values[i].ToString();
                    flag = strflag[i].ToString();



                    string strsql = "insert into wp_erprole_rest(role_id,erpmenu_id,flag) values(@role_id,'" + ID + "','" + flag + "')";
                    SqlParameter[] para =
                     {
                    new SqlParameter("@role_id", role_id)
                     };
                    result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }

        }
        public int CopyPermission(int roleto, int role_id)
        {
            try
            {
                DeletePermission(roleto);
                int result = 0;
                UserActivityLog.WriteDbLog(LogType.Submit, "Copy permission from " + role_id + " to " + roleto + "", "/Users/AssignRole" + ", " + Net.BrowserInfo);
                string strsql = "insert into wp_erprole_rest(role_id,erpmenu_id,add_,edit_,delete_,flag) Select " + roleto + ",erpmenu_id,add_,edit_,delete_,'C' from wp_erprole_rest where role_id=" + role_id + ";";
                result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));

                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int DeletePermission(int role_id)
        {
            try
            {
                string strsql = "delete from wp_erprole_rest where role_id=@role_id";
                SqlParameter[] para =
                 {
                    new SqlParameter("@role_id", role_id)
                     };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }

        }
        public int UpdateAddPermission(int role_id, string strAdd)
        {
            try
            {

                int result = 0;
                string strsql = "update wp_erprole_rest set add_=1 where role_id=" + role_id + " and erpmenu_id in (" + strAdd + ");";
                result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }

        }
        public int UpdateEditPermission(int role_id, string strEdit)
        {
            try
            {

                int result = 0;
                string strsql = "update wp_erprole_rest set edit_=1 where role_id=" + role_id + " and erpmenu_id in (" + strEdit + ");";
                result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }

        }
        public int UpdateDeletePermission(int role_id, string strDel)
        {
            try
            {

                int result = 0;
                string strsql = "update wp_erprole_rest set delete_=1 where role_id=" + role_id + " and erpmenu_id in (" + strDel + ");";
                result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }

        }


    }
}