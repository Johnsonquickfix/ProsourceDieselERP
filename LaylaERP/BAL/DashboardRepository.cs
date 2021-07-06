using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using System.Globalization;
using System.Data;
using LaylaERP.Models;

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
            string strQuery = "SELECT IFNULL(Count(distinct p.id),0)  from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order'  and p.post_status != 'auto-draft' and status='wc-completed'";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static int TotalOrder(string from_date, string to_date)
        {
            DateTime fromdate = DateTime.Now, todate = DateTime.Now;
            fromdate = DateTime.Parse(from_date);
            todate = DateTime.Parse(to_date);

            int totalorders = 0;
            string strQuery = "SELECT IFNULL(Count(distinct p.id),0)  from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft'";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }

        public static int TotalSale(string from_date, string to_date)
        {
            DateTime fromdate = DateTime.Now, todate = DateTime.Now;
            fromdate = DateTime.Parse(from_date);
            todate = DateTime.Parse(to_date);

            int totalorders = 0;
            string strQuery = "SELECT IFNULL(round(sum(total_sales),0),0) from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-processing','wc-on-hold','wc-refunded')";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }
        public static DataTable Gettotal(string from_date, string to_date)
        {
            //DataTable dt = new DataTable();

            //try
            //{
            //    //string strWhr = string.Empty;

                //string strSql = "SELECT id, staterecyclefee, item_parent_id, item_name, city, state, zip, country FROM wp_staterecyclefee where id='" + model. + "'";

                //DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                //dt = ds.Tables[0];


                DataTable dt = new DataTable();
                // totalrows = 0;
                try
                {
                    string strWhr = string.Empty;
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    

                    //if (!string.IsNullOrEmpty(from_date))
                    //{
                    //    strWhr += " and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' ";
                    //}

                    string strSql = "Select (SELECT IFNULL(Count(distinct p.id),0)  from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft') TotalOrder , (SELECT IFNULL(round(sum(total_sales),0),0) from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-processing','wc-on-hold','wc-refunded')) TotalSale ";
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