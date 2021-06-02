using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;

namespace LaylaERP.BAL
{
    public class DashboardRepository
    {
        public static int Total_Orders()
        {
            int totalorders = 0;
            string strQuery = "SELECT count(order_id) from wp_wc_order_stats";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }

        public static decimal Total_Sales()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT round(sum(total_sales),0) from wp_wc_order_stats";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static decimal Total_Customer()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT count(customer_id) from wp_wc_order_stats";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static decimal Total_Order_Completed()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT count(status) from wp_wc_order_stats WHERE status='wc-completed'";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }
    }
}