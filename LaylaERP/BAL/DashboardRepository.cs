using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using System.Globalization;

namespace LaylaERP.BAL
{
    public class DashboardRepository
    {
        public static int Total_Orders()
        {
            int totalorders = 0;
            string strQuery = "SELECT Count(distinct p.id)  from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order'  and p.post_status != 'auto-draft'";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }

        public static decimal Total_Sales()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT round(sum(total_sales),0) from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and p.post_status in ('wc-completed','wc-processing','wc-on-hold','wc-refunded')";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static decimal Total_Customer()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static decimal Total_Order_Completed()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT Count(distinct p.id)  from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order'  and p.post_status != 'auto-draft' and status='wc-completed'";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }
    }
}