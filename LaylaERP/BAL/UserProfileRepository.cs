using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;

namespace LaylaERP.BAL
{
    public class UserProfileRepository
    {
        public static int EditUserProfile(clsUserDetails model, long userid)
        {
            try
            {
                string strsql = "update wp_users set user_nicename=@user_nicename, user_email=@user_email, user_status=@user_status,User_Image=@User_Image where Id=" + userid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_nicename", model.user_nicename),
                    new MySqlParameter("@user_email", model.user_email),
                    new MySqlParameter("@user_status", model.user_status),
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

