namespace LaylaERP.BAL.qfk
{
    using LaylaERP.DAL;
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Web;

    public class FlowsRepository
    {
        public static string FlowAdd(string flag, int company_id, long id, long user_id, string json_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                    id > 0 ? new SqlParameter("@id",id) : new SqlParameter("@id",DBNull.Value),
                    new SqlParameter("@user_id",user_id),
                    new SqlParameter("@json_data",json_data)
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_flows_search", parameters).ToString();
            }
            catch { throw; }
            return str;
        }

    }
}