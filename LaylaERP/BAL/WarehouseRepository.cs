using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;

namespace LaylaERP.BAL
{
    public class WarehouseRepository
    {
        public static DataTable GetWarehouseDetail()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ref,entity,description,lieu,concat(address,' ',town,' ',zip)as address,phone,fax,if(statut=0,'Close','Open')as status FROM wp_warehouse";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddWarehouse(WarehouseModel model)
        {
            try
            {
                string strsql = "insert into wp_warehouse(ref,datec,lieu,description,address,zip,town,country,phone,fax,statut) values(@ref,@datec,@lieu,@description,@address,@zip,@town,@country,@phone,@fax,@statut);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@datec",Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new MySqlParameter("@lieu", model.lieu),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@address", model.address),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@town", model.town),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@fax", model.fax),
                    new MySqlParameter("@statut", model.statut)
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