using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;

namespace LaylaERP.BAL
{
    public class UserProfileRepository
    {
        private static string itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        public static int EditUserProfile(clsUserDetails model, long userid)
        {
            try
            {
                string strsql = "update wp_users set user_nicename=@user_nicename, user_email=@user_email,User_Image=@User_Image where Id=" + userid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_nicename", model.user_nicename),
                    new MySqlParameter("@user_email", model.user_email),                  
                     new MySqlParameter("@User_Image", model.User_Image),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int Update_Password(clsUserDetails model, long userid)
        {
            try
            {
                model.password = EncryptedPwd(model.password);
                string strsql = "update wp_users set user_pass=@user_pass where Id=" + userid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_pass", model.password),                   
                };
                string dd = strsql;
                int result =  Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
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

        public static void UpdateProfileMetaData(clsUserDetails model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
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

        public static DataTable DisplayProfileDetails(clsUserDetails model, long id)
        {
            DataTable DT = new DataTable();
            try
            {
                //string strquery = "select user_login, if(user_status=0,'Active','InActive'),user_email,(SELECT meta_value FROM wp_usermeta WHERE meta_key = 'firstname' and user_id="+id+"),meta_key from wp_users inner join wp_usermeta on wp_users.ID=wp_usermeta.user_id WHERE wp_users.ID=" + id+"";
                //string strquery = "select user_login, user_email, user_status from wp_users where ID=" + id + "";
                string strquery = "SELECT u.ID, u.user_login, u.user_email, u.user_status, " +
        "(SELECT meta_value FROM wp_usermeta WHERE user_id = " + id + " AND meta_key = 'first_name') as first_name, " +
        "(SELECT meta_value FROM wp_usermeta WHERE user_id = " + id + " AND meta_key = 'last_name') as last_name, " +
        "(SELECT meta_value FROM wp_usermeta WHERE user_id = " + id + " AND meta_key = 'user_phone') as user_phone, " +
        "(SELECT meta_value FROM wp_usermeta WHERE user_id = " + id + " AND meta_key = 'user_country') as user_country, " +
        "(SELECT meta_value FROM wp_usermeta WHERE user_id = " + id + " AND meta_key = 'user_address') as user_address " +
         "FROM wp_users u LEFT JOIN wp_usermeta um ON um.user_id = u.ID where u.ID = " + id + " GROUP by u.id";
                  DT = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

    }
}

