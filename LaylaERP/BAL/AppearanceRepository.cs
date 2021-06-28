using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using LaylaERP.Models;
using System.Data;



namespace LaylaERP.BAL
{
    public class AppearanceRepository
    {
        public static DataTable GetERPMenus()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "Select * from wp_erpmenus order by menu_code;";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable MenuByID(Appearance model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                //string strSql = "SELECT ur.ID,ur.user_nicename, ur.user_email,MAX( case when um.meta_key = 'first_name' THEN um.meta_value ELSE '' END) first_name,MAX( case when um.meta_key = 'last_name' THEN um.meta_value ELSE '' END) last_name, MAX( case when um.meta_key = 'billing_address_1' THEN um.meta_value ELSE '' END) billing_address_1,MAX( case when um.meta_key = 'billing_address_2' THEN um.meta_value ELSE '' END) billing_address_2,MAX( case when um.meta_key = 'billing_city' THEN um.meta_value ELSE '' END) billing_city,MAX( case when um.meta_key = 'billing_postcode' THEN um.meta_value ELSE '' END) billing_postcode,MAX( case when um.meta_key = 'billing_country' THEN um.meta_value ELSE '' END) billing_country,MAX( case when um.meta_key = 'billing_state' THEN um.meta_value ELSE '' END) billing_state,MAX( case when um.meta_key = 'billing_phone' THEN um.meta_value ELSE '' END) billing_phone from wp_users ur INNER JOIN wp_usermeta um on ur.ID = um.user_id WHERE 1 = 1 and ur.id = '" + model.ID + "' GROUP BY ur.ID,ur.user_nicename, ur.user_email";
                string strSql = "SELECT * from wp_erpmenus where menu_id =" + model.menu_id + "";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }


}