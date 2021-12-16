namespace LaylaERP_API.BAL
{
    using DAL;
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;


    public class UsersRepositry
    {
        private static string itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        public static LoginModel VerifyUser(string UserName, string UserPassword)
        {
            LoginModel obj = new LoginModel();
            try
            {
                UserPassword = EncryptedPwd(UserPassword);
                string strSql = "Select top 1 id,user_login,user_nicename,user_email,user_registered,display_name,user_status,user_pass,'' [role],"
                                + "    max(case when um.meta_key = 'first_name' then um.meta_value else '' end) first_name,max(case when um.meta_key = 'last_name' then um.meta_value else '' end) last_name,"
                                + "    max(case when um.meta_key = 'billing_phone' then um.meta_value else '' end) billing_phone,max(case when um.meta_key = 'nickname' then um.meta_value else '' end) nickname"
                                + "from wp_users ur"
                                + "Left outer join wp_usermeta um on um.user_id = ur.id and meta_key in ('first_name', 'last_name', 'billing_phone', 'nickname', 'wp_capabilities')"
                                + "where user_status = 0 and(user_login = @UserName Or user_email = @UserName) And user_pass = @UserPassword"
                                + "group by id,user_login,user_nicename,user_email,user_registered,display_name,user_status,user_pass";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@UserName", UserName),
                    new SqlParameter("@UserPassword", UserPassword)
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader(strSql, parameters);
                while (sdr.Read())
                {
                    obj.id = (sdr["id"] != Convert.DBNull) ? Convert.ToInt64(sdr["id"]) : 0;
                    obj.user_login = (sdr["user_login"] != Convert.DBNull) ? sdr["user_login"].ToString() : string.Empty;
                    obj.user_nicename = (sdr["user_nicename"] != Convert.DBNull) ? sdr["user_nicename"].ToString() : string.Empty;
                    obj.user_email = (sdr["user_email"] != Convert.DBNull) ? sdr["user_email"].ToString() : string.Empty;
                    obj.user_registered = (sdr["user_registered"] != Convert.DBNull) ? Convert.ToDateTime( sdr["user_registered"]) : DateTime.UtcNow;
                    obj.display_name = (sdr["display_name"] != Convert.DBNull) ? sdr["display_name"].ToString() : string.Empty;
                    obj.first_name = (sdr["first_name"] != Convert.DBNull) ? sdr["first_name"].ToString() : string.Empty;
                    obj.last_name = (sdr["last_name"] != Convert.DBNull) ? sdr["last_name"].ToString() : string.Empty;
                    obj.billing_phone = (sdr["billing_phone"] != Convert.DBNull) ? sdr["billing_phone"].ToString() : string.Empty;
                    obj.nickname = (sdr["nickname"] != Convert.DBNull) ? sdr["nickname"].ToString() : string.Empty;
                    if (sdr["user_status"].ToString().ToString().Trim() == "0")
                        obj.is_active = true;
                    else
                        obj.is_active = false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return obj;
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