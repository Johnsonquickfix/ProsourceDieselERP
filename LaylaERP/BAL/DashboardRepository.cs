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
            string strQuery = "SELECT round(sum(total_sales),0) from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')";
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
            string strQuery = "SELECT IFNULL(round(sum(total_sales),0),0) from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }
        public static DataTable Gettotal(string from_date, string to_date)
        {           
                DataTable dt = new DataTable();
                // totalrows = 0;
                try
                {
                    string strWhr = string.Empty;
                    DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                    fromdate = DateTime.Parse(from_date);
                    todate = DateTime.Parse(to_date);
                    string strSql = "Select (SELECT IFNULL(Count(distinct p.id),0)  from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft') TotalOrder , (SELECT IFNULL(round(sum(total_sales),0),0) from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')) TotalSale ";
                    DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                    dt = ds.Tables[0];
                }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetUsers()
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select ID,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value NOT LIKE '%customer%' "
                                    + " order by user_login LIMIT 0,5; ";
                DataSet ds = SQLHelper.ExecuteDataSet(strWhr);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetCustomer()
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select ID,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value LIKE '%customer%' "
                                    + " where User_Login != '' order by user_login LIMIT 0,5; ";
                DataSet ds = SQLHelper.ExecuteDataSet(strWhr);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable Getorder()
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select order_id as chkorder,meta_value,num_items_sold,Cast(total_sales As DECIMAL(10, 2)) as total_sales,status,date_created "
                                    + " FROM wp_wc_order_stats left join wp_postmeta on wp_wc_order_stats.order_id = wp_postmeta.post_id WHERE wp_postmeta.meta_key = '_billing_first_name' order by date_created LIMIT 0,5; ";
                DataSet ds = SQLHelper.ExecuteDataSet(strWhr);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetUsersDetails(string sType)
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select ID,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value NOT LIKE '%customer%' "
                                    + " where CONCAT(User_Login, ' [ ', user_email, ']') LIKE '%" + sType + "%' order by user_login LIMIT 0,5; ";
                DataSet ds = SQLHelper.ExecuteDataSet(strWhr);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetCustomerDetails(string sType)
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select ID,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value LIKE '%customer%' "
                                    + " where User_Login != '' and CONCAT(User_Login, ' [ ', user_email, ']') LIKE '%" + sType + "%' order by user_login LIMIT 0,5; ";
                DataSet ds = SQLHelper.ExecuteDataSet(strWhr);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetorderDetails(string sType)
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select order_id as chkorder,meta_value,num_items_sold,Cast(total_sales As DECIMAL(10, 2)) as total_sales,status,date_created "
                                    + " FROM wp_wc_order_stats left join wp_postmeta on wp_wc_order_stats.order_id = wp_postmeta.post_id WHERE wp_postmeta.meta_key = '_billing_first_name' and  order_id LIKE '%" + sType + "%'  order by date_created LIMIT 0,5; ";
                DataSet ds = SQLHelper.ExecuteDataSet(strWhr);
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