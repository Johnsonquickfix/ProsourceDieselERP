using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using System.Data.SqlClient;
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
                //string strquery = "Select menu_id, menu_code, menu_name, menu_url, menu_icon, parent_id,menu_order, if(status= 1, 'Active', 'Inactive') as status from wp_erpmenus order by menu_code;";
                string strquery = "SELECT m.menu_id, m.menu_code, m.menu_name, m.menu_url, m.menu_icon, m.parent_id,m.menu_order, iif(m.status= 1, 'Active', 'Inactive') as status, epr.menu_name as parent_name FROM wp_erpmenus m left join wp_erpmenus epr on m.parent_id = epr.menu_id order by m.menu_code";
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

                string strSql = "SELECT menu_id, menu_code, menu_name, menu_url, menu_icon, parent_id,menu_order, status from wp_erpmenus where menu_id =" + id + "";
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
                string strsql = "update wp_erpmenus set menu_code=@menu_code, menu_name=@menu_name, menu_url=@menu_url, menu_icon=@menu_icon, parent_id=@parent_id,menu_order=@menu_order, status=@status where menu_id in(" + model.menu_id + ")";
                SqlParameter[] para =
                {
                    new SqlParameter("@menu_code", model.menu_code),
                    new SqlParameter("@menu_name", model.menu_name),
                    new SqlParameter("@menu_url", model.menu_url),
                    new SqlParameter("@menu_icon", model.menu_icon),
                    new SqlParameter("@parent_id", model.parent_id),
                    new SqlParameter("@menu_order", model.menu_order),
                    new SqlParameter("@status", model.status)
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
                string strsql = "insert into wp_erpmenus(menu_code, menu_name, menu_url, menu_icon, parent_id,menu_order, status) values(@menu_code,@menu_name,@menu_url, @menu_icon, @parent_id, @menu_order, @status);SELECT LAST_INSERT_ID();";
                SqlParameter[] para =
                {
                    new SqlParameter("@menu_code", model.menu_code),
                    new SqlParameter("@menu_name", model.menu_name),
                    new SqlParameter("@menu_url", model.menu_url),
                    new SqlParameter("@menu_icon", model.menu_icon),
                    new SqlParameter("@parent_id", model.parent_id),
                    new SqlParameter("@menu_order", model.menu_order),
                    new SqlParameter("@status", model.status)
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
                SqlParameter[] para =
                {
                    new SqlParameter("@erpmenu_id", erpmenu_id)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataSet GetMenus()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT menu_id as id, concat(menu_id,'-',menu_name) as menu_name FROM wp_erpmenus order by menu_id";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

    }


}