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
    }
}