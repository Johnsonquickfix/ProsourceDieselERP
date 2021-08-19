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
                string strquery = "Select menu_id, menu_code, menu_name, menu_url, menu_icon, parent_id, if(status= 1, 'Active', 'Inactive') as status from wp_erpmenus order by menu_code;";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable MenuByID(int id)
        {
            DataTable dt = new DataTable();

            try
            {

                string strSql = "SELECT menu_id, menu_code, menu_name, menu_url, menu_icon, parent_id, status from wp_erpmenus where menu_id =" + id + "";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateMenus(Appearance model)
        {
            try
            {
                string strsql = "update wp_erpmenus set menu_code=@menu_code, menu_name=@menu_name, menu_url=@menu_url, menu_icon=@menu_icon, parent_id=@parent_id, status=@status where menu_id in(" + model.menu_id + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@menu_code", model.menu_code),
                    new MySqlParameter("@menu_name", model.menu_name),
                    new MySqlParameter("@menu_url", model.menu_url),
                    new MySqlParameter("@menu_icon", model.menu_icon),
                    new MySqlParameter("@parent_id", model.parent_id),
                    new MySqlParameter("@status", model.status)
            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddNewMenu(Appearance model)
        {
            
            try
            {
                string strsql = "insert into wp_erpmenus(menu_code, menu_name, menu_url, menu_icon, parent_id, status) values(@menu_code,@menu_name,@menu_url, @menu_icon, @parent_id, @status);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@menu_code", model.menu_code),
                    new MySqlParameter("@menu_name", model.menu_name),
                    new MySqlParameter("@menu_url", model.menu_url),
                    new MySqlParameter("@menu_icon", model.menu_icon),
                    new MySqlParameter("@parent_id", model.parent_id),
                    new MySqlParameter("@status", model.status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddAdminRole(int erpmenu_id)
        {
            try
            {
                string strsql = "Insert into wp_erprole_rest(role_id,erpmenu_id,add_,edit_,delete_) values(65,@erpmenu_id,1,1,1);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@erpmenu_id", erpmenu_id)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }


}