using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using System.Data.SqlClient;

namespace LaylaERP.BAL
{
    public class AgentCommissionRateRepository
    {
        public static DataTable GetCommission()
        {
            DataTable dtr = new DataTable();
            try
            {
                //string strquery = "SELECT id, AOV_Range1, AOV_Range2,cast(Comm_Rate as decimal(10,2)) as Comm_Rate from wp_agent_commission order by id";
                string strquery = "agentcommissionrate";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddNewMenu(AgentCommissionRate model)
        {
            try
            {
                string strsql = "insert into wp_agent_commission(AOV_Range1, AOV_Range2, Comm_Rate) values(@AOV_Range1,@AOV_Range2,@Comm_Rate); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@AOV_Range1", model.AOV_Range1),
                    new SqlParameter("@AOV_Range2", model.AOV_Range2),
                    new SqlParameter("@Comm_Rate", model.Comm_Rate),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetCommissionByID(int id)
        {
            DataTable dt = new DataTable();

            try
            {

                string strSql = "SELECT id, AOV_Range1, AOV_Range2, cast(Comm_Rate as decimal(10,2)) as Comm_Rate from wp_agent_commission where id =" + id + "";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateCommission(AgentCommissionRate model)
        {
            try
            {
                //string strsql = "update wp_agent_commission set AOV_Range1=@AOV_Range1, AOV_Range2=@AOV_Range2, Comm_Rate=@Comm_Rate where id in (@id)";
                string strsql = "agentcommissionupdate";
                SqlParameter[] para =
                {
                    new SqlParameter("@AOV_Range1", model.AOV_Range1),
                    new SqlParameter("@AOV_Range2", model.AOV_Range2),
                    new SqlParameter("@Comm_Rate", model.Comm_Rate),
                    new SqlParameter("@id", model.id),

            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}