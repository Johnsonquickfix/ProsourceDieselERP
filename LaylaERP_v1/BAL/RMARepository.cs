using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Text.RegularExpressions;

namespace LaylaERP.BAL
{
    public class RMARepository : Controller
    {
        public static DataSet Getorderdetails(string flag, long entity_id, long order_id, string billing_email)
        {
            DataSet ds;
            try
            {
                SqlParameter[] parameters =
                {
                    //new SqlParameter("@entity_id", entity_id),
                    new SqlParameter("@order_id", order_id),
                    new SqlParameter("@billing_email", billing_email), 
                    new SqlParameter("@flag", flag)
                };

                ds = SQLHelper.ExecuteDataSet("cms_rmaapi_customer_search", parameters);

            }
            catch { throw; }
            return ds;
        }

    }
}