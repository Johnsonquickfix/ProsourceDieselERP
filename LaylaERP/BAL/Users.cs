namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
    using MySql.Data.MySqlClient;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;


    public class Users
    {
        private static string itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        public static DataSet VerifyUser(string UserName, string UserPassword)
        {
            DataSet ds = new DataSet();
            try
            {
                UserPassword = EncryptedPwd(UserPassword);
                string strSql = "Select id,user_login, user_pass,user_status,user_email,um.meta_value from wp_users ur Left outer join wp_usermeta um on um.user_id = ur.id and meta_key = 'wp_capabilities' where(user_login = @UserName Or user_email = @UserName) And user_pass = @UserPassword ;"
                                + " Select * from wp_system_settings;";
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@UserName", UserName),
                    new MySqlParameter("@UserPassword", UserPassword)
                };
                ds = SQLHelper.ExecuteDataSet(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable AppSystemSetting()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = SQLHelper.ExecuteDataTable("Select * from wp_system_settings");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetUsers(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("select id,CONCAT(User_Login, ' [ ', user_email, ']') as displayname from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' and meta_value not like '%customer%' where CONCAT(User_Login, ' [ ', user_email, ']') like '%"+ strSearch + "%' limit 20;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetUserMenuAuth(long UserID)
        {
            DataTable DT = new DataTable();
            try
            {
                MySqlParameter[] para = { new MySqlParameter("@UserID", UserID), new MySqlParameter("@flag", "UML") };
                DT = SQLHelper.ExecuteDataTable("wp_erpmenus_search", para);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
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
    }
}