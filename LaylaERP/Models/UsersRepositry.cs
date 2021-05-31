using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System.Data;
using System.Configuration;


namespace LaylaERP.Models
{
    public class UsersRepositry
    {
        public static List<clsUserDetails> userslist = new List<clsUserDetails>();

        public static void ShowUsersDetails()
        {
            try
            {
                DataSet ds1 = new DataSet();
                string sqlquery = "select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,user_pass,meta_value from wp_users, wp_usermeta WHERE  wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID ASC";
                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    clsUserDetails uobj = new clsUserDetails();
                    uobj.ID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.user_login = ds1.Tables[0].Rows[i]["user_login"].ToString();
                    uobj.user_role = ds1.Tables[0].Rows[i]["meta_value"].ToString();
                    uobj.user_email = ds1.Tables[0].Rows[i]["user_email"].ToString();
                    if ((ds1.Tables[0].Rows[i]["user_status"].ToString() == "0"))
                    { uobj.user_status = "Active"; }
                    else { uobj.user_status = "InActive"; }

                    userslist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }
        }
    }
}