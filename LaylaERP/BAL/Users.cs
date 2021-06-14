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
    using LaylaERP.Models;


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

        public static DataTable GetSystemRoles()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select id, user_type from wp_user_classification";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable DisplayAssignRole(string strvalue)
        {
            DataTable DT = new DataTable();
            try
            {
                string strquery = "Select * from wp_user_classification where User_Type="+ strvalue;
                DT = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
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

        public static DataTable GetMenuByUser(string strvalue)
        {
            DataTable DT = new DataTable();
            try
            {
                string strquery = "Select * from wp_user_classification where User_Type like '%" + strvalue + "%' limit 20;";
                DT = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static int UpdateUserClassifications(UserClassification model)
        {
            int result = 0;
            try
            {
                
                StringBuilder strSql = new StringBuilder(string.Format("delete from wp_user_classification where User_Type = '{0}'; ", model.User_Type));                
                strSql.Append(string.Format("insert into wp_user_classification ( User_Type,User_Mnu,User_Classification,Create_User,Customers,Orders_Mnu,System_Settings,Add_New_Orders,Show_Update_Orders) values ('{0}',{1},{2},{3},{4},{5},{6},{7},{8}) ",  model.User_Type, model.User_Mnu, model.User_Classification, model.Create_User, model.Customers,model.Orders_Mnu,model.System_Settings,model.Add_New_Orders,model.Show_Update_Orders));

                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
            return result;
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

        public static DataSet ForgotPassword(string UserName)
        {
            DataSet ds = new DataSet();
            try
            {
                string strSql = "Select user_login,user_email,user_nicename from wp_users  where(user_login = @UserName Or user_email = @UserName)";
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@UserName", UserName)
                };
                ds = SQLHelper.ExecuteDataSet(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static int ResetPassword(string UserName, string Password)
        {
            int res;
            try
            {
                Password = EncryptedPwd(Password);
                string strSql = "update wp_users set user_pass=@Password  where user_login = @UserName";
                MySqlParameter[] parameters =
                {
                    new MySqlParameter("@Password", Password),
                    new MySqlParameter("@UserName", UserName)
                };
                res = SQLHelper.ExecuteNonQuery(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return res;
        }


        public static DataSet GetEmailCredentials()
        {
            DataSet ds = new DataSet();
            try
            {
                string strSql = "Select * from wp_system_settings;";
                MySqlParameter[] parameters =
                {
                    
                };
                ds = SQLHelper.ExecuteDataSet(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

    }
}