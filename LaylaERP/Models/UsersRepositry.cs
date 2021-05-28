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
                string _conString = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
                using (MySqlConnection con = new MySqlConnection(_conString))
                {
                    MySqlCommand cmd = new MySqlCommand("select ID, User_Image, user_login, user_status, if(user_status=0,'Active','InActive') as status,user_email,user_pass,meta_value from wp_users, wp_usermeta WHERE  wp_usermeta.meta_key='wp_capabilities' And wp_users.ID=wp_usermeta.user_id And wp_users.ID IN (SELECT user_id FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value NOT LIKE '%customer%') ORDER BY ID ASC", con);
                    cmd.CommandType = CommandType.Text;
                    con.Open();
                    MySqlDataReader rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        var myuser = new clsUserDetails();
                        myuser.user_login = rdr["user_login"].ToString();
                        myuser.user_email = rdr["user_email"].ToString();
                        userslist.Add(myuser);
                    }
                    
                }
            }
            catch(Exception e)
            {

            }
        }
    }
}