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
                string strsql = "update wp_users set user_nicename=@user_nicename, user_email=@user_email, user_status=@user_status where Id=" + userid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_nicename", model.user_nicename),
                    new MySqlParameter("@user_email", model.user_email),
                    new MySqlParameter("@user_status", model.user_status),
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

    }
}