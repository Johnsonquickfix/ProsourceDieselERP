namespace LaylaERP.BAL
{
    using LaylaERP.DAL;
    using System.Data.SqlClient;
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
                string strSql = "Select top 1 id,user_login, user_pass,user_status,user_email,um.meta_value,(select company_id from cms_usercompany where user_id = ur.id) user_companyid from wp_users ur Left outer join wp_usermeta um on um.user_id = ur.id and meta_key = 'wp_capabilities' where user_status = 0 and (user_login = @UserName Or user_email = @UserName) And user_pass = @UserPassword ;"
                                + " Select * from wp_system_settings;"
                                + " Select * from erp_entityinfo;";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@UserName", UserName),
                    new SqlParameter("@UserPassword", UserPassword)
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
                string strquery = "select id, user_type from wp_user_classification order by id desc";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetSystemAdminRoles()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select id, user_type from wp_user_classification where id not in (65) order by id desc";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetRolesType()
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

        public static DataTable GetRolesTypeTopBar()
        {
            DataTable dtr = new DataTable();
            try
            {
                //string strquery = "select COALESCE(meta_value) user_value, CONCAT(COALESCE(meta_value, ''), '(', count(meta_value), ')') user_type from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' and meta_value not like '%a:1%' and meta_value not like '%a:2%' and meta_value not like '%a:5%' and meta_value not like '%a:0%' and meta_value not like '%a:8%'  and meta_value  not like '%,%' GROUP BY meta_value";
                //string strquery = "select User_Type,User_Value,(select count(umc.user_id) from wp_usermeta umc where umc.meta_key = 'wp_capabilities' and umc.meta_value not like '%a:2%' and umc.meta_value not like '%a:5%' and umc.meta_value not like '%a:0%' and umc.meta_value not like '%a:8%' and umc.meta_value like CONCAT('%', User_Value, '%')) cnt from wp_user_classification as ur order BY ur.User_Type #inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' and meta_value not like '%a:2%' and meta_value not like '%a:5%' and meta_value not like '%a:0%' and meta_value not like '%a:8%' and meta_value not like '%,%' order BY ur.User_Type";
                // string strquery = "select User_Type,User_Value,(select count(umc.user_id) from wp_usermeta umc where umc.meta_key = 'wp_capabilities' and umc.meta_value like CONCAT('%', User_Value, '%')) cnt from wp_user_classification as ur order BY ur.User_Type #inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value NOT like '%customer%' and meta_value not like '%,%' order BY ur.User_Type";

                //string strquery = "select User_Type,User_Value,count(umc.user_id) cnt from wp_user_classification as ur left outer join wp_usermeta umc on umc.meta_key = 'wp_capabilities' and umc.meta_value NOT LIKE '%customer%' and meta_value not like '%a:2%' and umc.meta_value not like '%a:5%' and umc.meta_value not like '%a:0%'  and umc.meta_value not like '%a:8%' and  umc.meta_value like '%'+ur.User_Value+'%' inner join wp_users u on u.ID = umc.user_id group by User_Type,User_Value  order by ur.User_Type";
                string strquery = "select User_Type,User_Value,count(umc.user_id) cnt from wp_user_classification as ur left outer join wp_usermeta umc on umc.meta_key = 'wp_capabilities' and umc.meta_value NOT LIKE '%customer%' and umc.meta_value like '%\"'+ur.User_Value+'\"%' left outer join wp_users u on u.ID = umc.user_id group by User_Type,User_Value  order by ur.User_Type";

                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetMenuNames()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "Select * from wp_erpmenus;";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetCity()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select distinct City,City from ZIPCodes1 order by City";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetCity(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("select distinct City,City from ZIPCodes1 where City like '" + strSearch + "%' ");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetState()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select distinct StateFullName,StateFullName from ZIPCodes1 order by StateFullName";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetState(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,StateFullName from ZIPCodes1 where StateFullName like '" + strSearch + "%' order by StateFullName;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetCanadaState(string strSearch, string country)
        {
            DataTable DT = new DataTable();
            try
            {
                string strwhere = "";
                if (country != null)
                {
                    strwhere = "and Country='" + country + "'";
                }
                //if (country == "CA")
                //{
                    DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_statelist  where (StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%') "+ strwhere +" ;");
                //}
                //else
                //{
                //    DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from ZIPCodes1 where StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%' order by ZIPCodes1.StateFullName ");
                //}
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetStateByCountry(string country)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from erp_statelist  where Country='" + country + "'");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable DisplayAssignRole(string strvalue)
        {
            DataTable DT = new DataTable();
            try
            {
                string strquery = "Select * from wp_user_classification where User_Type=" + strvalue;
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
                DT = SQLHelper.ExecuteDataTable("select id,CONCAT(User_Login, ' [ ', user_email, ']') as displayname from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' and meta_value not like '%customer%' where CONCAT(User_Login, ' [ ', user_email, ']') like '%" + strSearch + "%' ;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetUserAuth(int UserID)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] para =
                    {
                    new SqlParameter("@UserID", UserID),
                };
                DT = SQLHelper.ExecuteDataTable("wp_userauth", para);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetUserMenuAuth(string UserType)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] para =
                    {
                    new SqlParameter("@User_Type", UserType),
                };
                DT = SQLHelper.ExecuteDataTable("Select wuc.User_Type,wem.menu_id,wem.menu_code,wem.menu_name,wem.menu_url,wem.menu_icon,case when wem.parent_id = 0 then null else wem.parent_id end parent_id,wer.add_,wer.edit_,wer.delete_,(case coalesce(wem.parent_id,0) when 0 then 0 else 1 end) as  level  from wp_erprole_rest wer left join wp_erpmenus wem on wem.menu_id = wer.erpmenu_id inner join wp_user_classification wuc on wer.role_id = wuc.ID where User_Value = @User_Type And status=1;", para);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetUsersMenuAuth(string UserType)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] para =
                    {
                    new SqlParameter("@Values", UserType),
                };
                string strquery = "erp_getusersmenuAuth";
                DT = SQLHelper.ExecuteDataTable(strquery, para);
                //DT = SQLHelper.ExecuteDataTable("Select wuc.User_Type,wem.menu_id,wem.menu_code,wem.menu_name,wem.menu_url,wem.menu_icon,case when wem.parent_id = 0 then null else wem.parent_id end parent_id,wer.add_,wer.edit_,wer.delete_,(case coalesce(wem.parent_id,0) when 0 then 0 else 1 end) as  level  from wp_erprole_rest wer left join wp_erpmenus wem on wem.menu_id = wer.erpmenu_id inner join wp_user_classification wuc on wer.role_id = wuc.ID where User_Value = @User_Type And status=1;", para);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetPermissions(string UserType, string menu_url)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] para =
                    {
                    new SqlParameter("@User_Type", UserType),
                     new SqlParameter("@menu_url", menu_url)
                };
                //DT = SQLHelper.ExecuteDataTable("Select wuc.User_Type,wem.menu_id,wem.menu_code,wem.menu_name,wem.menu_url,wem.menu_icon,wem.parent_id,wer.add_,wer.edit_,wer.delete_, if(wem.parent_id is null, 0, 1) as  level  from wp_erprole_rest wer left join wp_erpmenus wem on wem.menu_id = wer.erpmenu_id inner join wp_user_classification wuc on wer.role_id = wuc.ID where User_Type = @User_Type and menu_url=@menu_url;", para);
                DT = SQLHelper.ExecuteDataTable("Select wuc.User_Type,wem.menu_id,wem.menu_code,wem.menu_name,wem.menu_url,wem.menu_icon,wem.parent_id,wer.add_,wer.edit_,wer.delete_ from wp_erprole_rest wer left join wp_erpmenus wem on wem.menu_id = wer.erpmenu_id inner join wp_user_classification wuc on wer.role_id = wuc.ID where User_Type = @User_Type and menu_url=@menu_url;", para);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        //public static DataTable GetUserMenuAuth(long UserID)
        //{
        //    DataTable DT = new DataTable();
        //    try
        //    {
        //        SqlParameter[] para = { new SqlParameter("@UserID", UserID), new SqlParameter("@flag", "UML") };
        //        DT = SQLHelper.ExecuteDataTable("wp_erpmenus_search", para);
        //    }
        //    catch (Exception ex)
        //    { throw ex; }
        //    return DT;
        //}

        //public static DataTable GetMenuByUser(string strvalue)
        //{
        //    DataTable DT = new DataTable();
        //    try
        //    {
        //        string strquery = "Select * from wp_user_classification where User_Type like '%" + strvalue + "%' limit 20;";
        //        DT = SQLHelper.ExecuteDataTable(strquery);
        //    }
        //    catch (Exception ex)
        //    { throw ex; }
        //    return DT;
        //}
        public static DataTable GetMenuByUser(string strvalue)
        {
            DataTable DT = new DataTable();
            try
            {
                string strquery = "Select wuc.user_type, wer.role_id,wer.erpmenu_id,wer.add_,wer.edit_,wer.delete_ from wp_erprole_rest wer left join wp_user_classification wuc on wer.role_ID = wuc.ID where wuc.User_Type like '%" + strvalue + "%';";
                DT = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetDetailsUser(long ID)
        {
            DataTable DT = new DataTable();
            try
            {
            
                //string strquery = "select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,display_name,User_nicename,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'wp_capabilities' and wp_usermeta.user_id = wp_users.ID) user_role,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'first_name' and wp_usermeta.user_id = wp_users.ID) first_name,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'last_name' and wp_usermeta.user_id = wp_users.ID) last_name,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'billing_country' and wp_usermeta.user_id = wp_users.ID) country,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'billing_address_1' and wp_usermeta.user_id = wp_users.ID) address,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_phone' and wp_usermeta.user_id =wp_users.ID) phone,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_address_2' and wp_usermeta.user_id =wp_users.ID) address2,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_city' and wp_usermeta.user_id =wp_users.ID) City,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_state' and wp_usermeta.user_id =wp_users.ID) State,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_postcode' and wp_usermeta.user_id =wp_users.ID) postcode,(select StateFullName from ZIPCodes1 zip where zip.State = (select  meta_value from wp_usermeta where wp_usermeta.meta_key='billing_state' and wp_usermeta.user_id  =wp_users.ID)limit 1)  StateFullName from wp_users where id = " + ID + " limit 20;";
                string strquery = "select *, (select STRING_AGG(User_Type, ',') from wp_user_classification where User_Value in (SELECT * FROM STRING_SPLIT(user_role, ','))) roletype   from (select ID,user_login, user_status,case when user_status=0 then 'Active' else 'InActive' end as status,user_email,display_name,User_nicename,"
                                 + " (select CAST('' AS XML).value('xs:base64Binary(sql:column(\"User_Image\"))','VARCHAR(MAX)') from (select cast(User_Image as varbinary(max)) User_Image from wp_users ui where ui.id = u.id) tui) User_Image,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'wp_capabilities' then um.meta_value else '' end) user_role,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'first_name' then um.meta_value else '' end) first_name,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'last_name' then um.meta_value else '' end) last_name,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_country' then um.meta_value else '' end) country,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_address_1' then um.meta_value else '' end) address,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_phone' then um.meta_value else '' end) phone,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_address_2' then um.meta_value else '' end) address2,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_city' then um.meta_value else '' end) City,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_state' then um.meta_value else '' end) State,"
                                 + " max(case when um.user_id = u.id and um.meta_key = 'billing_postcode' then um.meta_value else '' end) postcode,"
                                 + " (select top 1 StateFullName from ZIPCodes1 zip where zip.State = max(case when um.user_id = u.id and um.meta_key = 'billing_state' then um.meta_value else '' end))  StateFullName"
                                 + " from wp_users u inner join wp_usermeta um on um.user_id = u.id"
                                 + " where id = " + ID + " group by u.id,user_login, user_status,user_status,user_email,display_name,User_nicename ) tt";
                DT = SQLHelper.ExecuteDataTable(strquery);
            
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetDetailsUserS(long ID)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] parameters =
               {
                    new SqlParameter("@id", ID)
                };
                //string strquery = "select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,display_name,User_nicename,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'wp_capabilities' and wp_usermeta.user_id = wp_users.ID) user_role,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'first_name' and wp_usermeta.user_id = wp_users.ID) first_name,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'last_name' and wp_usermeta.user_id = wp_users.ID) last_name,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'billing_country' and wp_usermeta.user_id = wp_users.ID) country,(select meta_value from wp_usermeta where wp_usermeta.meta_key = 'billing_address_1' and wp_usermeta.user_id = wp_users.ID) address,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_phone' and wp_usermeta.user_id =wp_users.ID) phone,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_address_2' and wp_usermeta.user_id =wp_users.ID) address2,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_city' and wp_usermeta.user_id =wp_users.ID) City,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_state' and wp_usermeta.user_id =wp_users.ID) State,(select meta_value from wp_usermeta where wp_usermeta.meta_key='billing_postcode' and wp_usermeta.user_id =wp_users.ID) postcode,(select StateFullName from ZIPCodes1 zip where zip.State = (select  meta_value from wp_usermeta where wp_usermeta.meta_key='billing_state' and wp_usermeta.user_id  =wp_users.ID)limit 1)  StateFullName from wp_users where id = " + ID + " limit 20;";
                string strquery = "erp_getuserdetailsbyid";
                DT = SQLHelper.ExecuteDataTable(strquery, parameters);
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
                strSql.Append(string.Format("insert into wp_user_classification ( User_Type,User_Mnu,User_Classification,Create_User,Customers,Orders_Mnu,System_Settings,Add_New_Orders,Show_Update_Orders) values ('{0}',{1},{2},{3},{4},{5},{6},{7},{8}) ", model.User_Type, model.User_Mnu, model.User_Classification, model.Create_User, model.Customers, model.Orders_Mnu, model.System_Settings, model.Add_New_Orders, model.Show_Update_Orders));

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

        public static int ResetPassword(string UserName, string Password)
        {
            int res;
            try
            {
                Password = EncryptedPwd(Password);
                string strSql = "update wp_users set user_pass=@Password  where user_login = @UserName";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@Password", Password),
                    new SqlParameter("@UserName", UserName)
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
                SqlParameter[] parameters =
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