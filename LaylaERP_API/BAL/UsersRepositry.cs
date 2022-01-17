namespace LaylaERP_API.BAL
{
    using DAL;
    using Models;
    using Newtonsoft.Json;
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

        public static ResultModel UserVerify(string UserName, string UserPassword)
        {
            ResultModel obj = new ResultModel();
            try
            {
                //UserPassword = EncryptedPwd(UserPassword);
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "AUTH"),
                    new SqlParameter("@user_login", UserName),
                    new SqlParameter("@user_pass", UserPassword)
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("api_user_auth", parameters);
                while (sdr.Read())
                {
                    obj.success = (sdr["success"] != Convert.DBNull) ? Convert.ToBoolean(sdr["success"]) : false;
                    obj.error_msg = (sdr["error_msg"] != Convert.DBNull) ? sdr["error_msg"].ToString() : string.Empty;
                    obj.user_data = (sdr["user_data"] != Convert.DBNull) ? Convert.ToInt64(sdr["user_data"]) : 0;
                    if (obj.success)
                    {
                        string user_pass = (sdr["user_pass"] != Convert.DBNull) ? sdr["user_pass"].ToString() : string.Empty;
                        //if (!CheckPassword(UserPassword, user_pass))
                        //{
                        //    obj.success = false; obj.user_data = 0;
                        //    obj.error_msg = "The password you entered for the username's is incorrect.";
                        //}
                    }
                }
            }
            catch (Exception ex)
            {
                obj.success = false;
                obj.error_msg = ex.Message;
                obj.user_data = "{}";
            }
            return obj;
        }

        public static LoginModel UserInfo(long id)
        {
            LoginModel obj = new LoginModel();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "UINFO"),
                    new SqlParameter("@id", id),
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("api_user_auth", parameters);
                while (sdr.Read())
                {
                    obj.id = (sdr["id"] != Convert.DBNull) ? Convert.ToInt64(sdr["id"]) : 0;
                    obj.user_login = (sdr["user_login"] != Convert.DBNull) ? sdr["user_login"].ToString() : string.Empty;
                    obj.user_nicename = (sdr["user_nicename"] != Convert.DBNull) ? sdr["user_nicename"].ToString() : string.Empty;
                    obj.user_email = (sdr["user_email"] != Convert.DBNull) ? sdr["user_email"].ToString() : string.Empty;
                    obj.user_registered = (sdr["user_registered"] != Convert.DBNull) ? sdr["user_registered"].ToString() : string.Empty;
                    obj.display_name = (sdr["display_name"] != Convert.DBNull) ? sdr["display_name"].ToString() : string.Empty;
                    obj.first_name = (sdr["first_name"] != Convert.DBNull) ? sdr["first_name"].ToString() : string.Empty;
                    obj.last_name = (sdr["last_name"] != Convert.DBNull) ? sdr["last_name"].ToString() : string.Empty;
                    obj.billing_phone = (sdr["billing_phone"] != Convert.DBNull) ? sdr["billing_phone"].ToString() : string.Empty;
                    obj.nickname = (sdr["nickname"] != Convert.DBNull) ? sdr["nickname"].ToString() : string.Empty;
                    obj.role = (sdr["role"] != Convert.DBNull) ? sdr["role"].ToString() : string.Empty;
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

        public static ResultModel CreateUser(LoginModel model)
        {
            ResultModel obj = new ResultModel();
            try
            {
                string user_pass = EncryptedPwd(model.user_pass);
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "URADD"),
                    new SqlParameter("@user_login", model.user_login),
                    new SqlParameter("@user_pass", user_pass),
                    new SqlParameter("@user_email", model.user_login),
                    new SqlParameter("@user_nicename", model.user_nicename),
                    new SqlParameter("@display_name", model.display_name),
                    new SqlParameter("@first_name", model.first_name),
                    new SqlParameter("@last_name", model.last_name),
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("api_user_auth", parameters);
                while (sdr.Read())
                {
                    obj.success = (sdr["success"] != Convert.DBNull) ? Convert.ToBoolean(sdr["success"]) : false;
                    obj.error_msg = (sdr["error_msg"] != Convert.DBNull) ? sdr["error_msg"].ToString() : string.Empty;
                    if (sdr["user_id"] != DBNull.Value)
                    {
                        dynamic json_obj = JsonConvert.DeserializeObject<dynamic>(sdr["user_id"].ToString());
                        obj.user_data = json_obj;
                    }
                }
            }
            catch (Exception ex)
            {
                obj.success = false;
                obj.error_msg = ex.Message;
                obj.user_data = 0;
            }
            return obj;
        }

        public static ResultModel UserUpdate(LoginModel model)
        {
            ResultModel obj = new ResultModel();
            try
            {
                string user_pass = string.Empty, user_new_pass = string.Empty;
                if (!string.IsNullOrEmpty(model.user_pass) && !string.IsNullOrEmpty(model.user_new_pass))
                { user_pass = EncryptedPwd(model.user_pass); user_new_pass = EncryptedPwd(model.user_pass); }
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "URUPD"),
                    new SqlParameter("@id", model.id),
                    new SqlParameter("@user_pass", user_pass),
                    new SqlParameter("@user_new_pass", user_new_pass),
                    new SqlParameter("@user_email", model.user_email),
                    new SqlParameter("@display_name", model.display_name),
                    new SqlParameter("@first_name", model.first_name),
                    new SqlParameter("@last_name", model.last_name),
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("api_user_auth", parameters);
                while (sdr.Read())
                {
                    obj.success = (sdr["success"] != Convert.DBNull) ? Convert.ToBoolean(sdr["success"]) : false;
                    obj.error_msg = (sdr["error_msg"] != Convert.DBNull) ? sdr["error_msg"].ToString() : string.Empty;
                    if (sdr["user_data"] != DBNull.Value)
                    {
                        dynamic json_obj = JsonConvert.DeserializeObject<dynamic>(sdr["user_data"].ToString());
                        obj.user_data = json_obj;
                    }
                }
            }
            catch (Exception ex)
            {
                obj.success = false;
                obj.error_msg = ex.Message;
                obj.user_data = "{}";
            }
            return obj;
        }

        public static string EncryptedPwd(string varPassword)
        {
            string expected = "$P$BPGbwPLs6N6VlZ7OqRUvIY1Uvo/Bh9/";
            return MD5Encode(varPassword, expected);
        }
        public static bool CheckPassword(string password, string stored_hash)
        {
            string hash = MD5Encode(password, stored_hash);
            return hash == password;
        }
        static string MD5Encode(string password, string hash)
        {
            string output = "*0";
            if (hash == null) { return output; }

            if (hash.StartsWith(output)) output = "*1";

            string id = hash.Substring(0, 3);
            // We use "$P$", phpBB3 uses "$H$" for the same thing
            if (id != "$P$" && id != "$H$") return output;

            // get who many times will generate the hash
            int count_log2 = itoa64.IndexOf(hash[3]);
            if (count_log2 < 7 || count_log2 > 30) return output;

            int count = 1 << count_log2;

            string salt = hash.Substring(4, 8);
            if (salt.Length != 8) return output;

            //byte[] hashBytes = { };
            //using (MD5 md5Hash = MD5.Create())
            //{
            //    hashBytes = md5Hash.ComputeHash(Encoding.ASCII.GetBytes(salt + password));
            //    byte[] passBytes = Encoding.ASCII.GetBytes(password);
            //    do
            //    {
            //        hashBytes = md5Hash.ComputeHash(hashBytes.Concat(passBytes).ToArray());
            //    } while (--count > 0);
            //}
            string _hash = string.Empty;
            _hash = GetMD5Hash(salt + password);
            using (MD5 md5Hash = MD5.Create())
            {
                _hash = BitConverter.ToString(md5Hash.ComputeHash(Encoding.UTF8.GetBytes(salt + password))).Replace("-", string.Empty).ToLower();
                do
                {
                    _hash = BitConverter.ToString(md5Hash.ComputeHash(Encoding.UTF8.GetBytes(_hash + password))).Replace("-", string.Empty).ToLower();
                } while (--count > 0);
            }

            output = hash.Substring(0, 12);
            string newHash = Encode64(_hash, 16);

            return output + newHash;
        }
        //private static string GetMd5Hash(byte[] data)
        //{
        //    StringBuilder sBuilder = new StringBuilder();
        //    for (int i = 0; i < data.Length; i++)
        //        sBuilder.Append(data[i].ToString("X2"));
        //    return sBuilder.ToString();
        //}
        private static string GetMD5Hash(string input)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider x = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] bs = System.Text.Encoding.ASCII.GetBytes(input);
            bs = x.ComputeHash(bs);
            System.Text.StringBuilder s = new System.Text.StringBuilder();
            foreach (byte b in bs)
            {
                s.Append(b.ToString("x2").ToLower());
            }
            string password = s.ToString();
            return password;
        }
        static string Encode64(string input, int count)
        {
            StringBuilder sb = new StringBuilder();
            int i = 0;
            do
            {
                int value = (int)input[i++];
                sb.Append(itoa64[value & 0x3f]); // to uppercase
                if (i < count) value = value | ((int)input[i] << 8);
                sb.Append(itoa64[(value >> 6) & 0x3f]);
                if (i++ >= count) break;
                if (i < count) value = value | ((int)input[i] << 16);
                sb.Append(itoa64[(value >> 12) & 0x3f]);
                if (i++ >= count) break;
                sb.Append(itoa64[(value >> 18) & 0x3f]);
            } while (i < count);

            return sb.ToString();
        }
    }
}