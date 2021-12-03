using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace LaylaERP.BAL
{
    public class ForgotPasswordRepository
    {
        //Password----------------
        private static string itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
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

        public static DataSet ForgotPassword(string UserName)
        {
            DataSet ds = new DataSet();
            try
            {
                string strSql = "SELECT ID, user_login,user_email,user_nicename from wp_users u INNER JOIN wp_usermeta um on um.user_id=u.ID and um.meta_key='wp_capabilities' and um.meta_value NOT LIKE '%customer%' WHERE(user_login = @UserName Or user_email = @UserName); Select SenderEmailID,SenderEmailPwd,SMTPServerName,587 SMTPServerPortNo,SSL from wp_system_settings";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@UserName", UserName)
                };
                ds = SQLHelper.ExecuteDataSet(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static int Updateuserpassword(PasswordModel model)
        {
            try
            {
                model.pwd = EncryptedPwd(model.pwd);
                string strsql = "UPDATE wp_users SET user_pass=@user_pass WHERE ID = @id ";   
                SqlParameter[] para =
                {
                    new SqlParameter("@id", model.ID),
                    new SqlParameter("@user_pass", model.pwd),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }

    public class PasswordModel
    {
        public string pwd { get; set; }
        public long ID { get; set; }
    }

}