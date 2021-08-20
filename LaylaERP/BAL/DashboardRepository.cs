using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using System.Globalization;
using System.Data;
using LaylaERP.Models;
using System.Configuration;
using MySql.Data.MySqlClient;

namespace LaylaERP.BAL
{
    public class DashboardRepository
    {
        public static int Total_Orders()
        {
            int totalorders = 0;
            string strQuery = "SELECT Count(distinct p.id) from wp_posts p WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft'";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }

        public static decimal Total_Sales()
        {
            decimal totalsales = 0;
            string strQuery = "SELECT IFNULL(round(sum(rpm.meta_value),0),0) from wp_posts p inner join wp_postmeta rpm ON p.id = rpm.post_id AND meta_key = '_order_total' WHERE p.post_type = 'shop_order' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')";
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
            string strQuery = "SELECT IFNULL(Count(distinct p.id),0) from wp_posts p WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' and p.post_status='wc-completed'";
            totalsales = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static int TotalOrder(string from_date, string to_date)
        {
            DateTime fromdate = DateTime.Now, todate = DateTime.Now;
            fromdate = DateTime.Parse(from_date);
            todate = DateTime.Parse(to_date);

            int totalorders = 0;
            string strQuery = "SELECT IFNULL(Count(distinct p.id),0)  from wp_posts p WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft'";
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }

        public static int TotalSale(string from_date, string to_date)
        {
            DateTime fromdate = DateTime.Now, todate = DateTime.Now;
            fromdate = DateTime.Parse(from_date);
            todate = DateTime.Parse(to_date);

            int totalorders = 0;
            string strQuery = "SELECT IFNULL(round(sum(rpm.meta_value),0),0) from wp_posts p inner join wp_postmeta rpm ON p.id = rpm.post_id AND meta_key = '_order_total' WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')";
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
                string strSql = "Select (SELECT IFNULL(Count(distinct p.id),0) from wp_posts p WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft') TotalOrder , (SELECT IFNULL(round(sum(rpm.meta_value),0),0) from wp_posts p inner join wp_postmeta rpm ON p.id = rpm.post_id AND meta_key = '_order_total' WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')) TotalSale ";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataSet GetCommonSearch(string searchOn, string searchStr)
        {
            DataSet ds = new DataSet();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (searchOn == "users" || searchOn == "all")
                    strWhr += "select id,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value NOT LIKE '%customer%' where User_Login!='' and CONCAT(User_Login,' ', user_email) LIKE '%" + searchStr + "%' order by id Desc LIMIT 0,5;";
                 if (searchOn == "customers" || searchOn == "all")
                    strWhr += "select id,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value LIKE '%customer%' where User_Login!='' and CONCAT(User_Login,' ', user_email) LIKE '%" + searchStr + "%' order by id Desc LIMIT 0,5;";
                if (searchOn == "orders" || searchOn == "all")
                    strWhr += "select p.id,meta_value first_name,p.post_status,post_date FROM wp_posts p left join wp_postmeta pm on p.id = pm.post_id and pm.meta_key in ('_billing_first_name') where p.post_type = 'shop_order' and post_status != 'auto-draft' and id LIKE '%" + searchStr + "%' order by post_date Desc LIMIT 0,5;";
                ds = SQLHelper.ExecuteDataSet(strWhr);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetUsers()
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                strWhr = "select ID,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value NOT LIKE '%customer%' "
                                    + " order by ID Desc LIMIT 0,5; ";
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
                                    + " where User_Login != '' order by ID Desc LIMIT 0,5; ";
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
                                    + " FROM wp_wc_order_stats left join wp_postmeta on wp_wc_order_stats.order_id = wp_postmeta.post_id WHERE wp_postmeta.meta_key = '_billing_first_name' order by date_created Desc LIMIT 0,5; ";
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

        public static DataTable OrderListDashboard(string from_date, string to_date, string userstatus, string searchid, int pageno, int pagesize, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                fromdate = DateTime.Parse(from_date);
                todate = DateTime.Parse(to_date);
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.id like '" + searchid + "%' "
                            //+ " OR os.num_items_sold='%" + searchid + "%' "
                            //+ " OR os.total_sales='%" + searchid + "%' "
                            //+ " OR os.customer_id='%" + searchid + "%' "
                            + " OR p.post_status like '" + searchid + "%' "
                            //+ " OR p.post_date like '%" + searchid + "%' "
                            + " OR COALESCE(pmf.meta_value, '') like '" + searchid + "%' "
                            + " OR COALESCE(pml.meta_value, '') like '" + searchid + "%' "
                            + " OR replace(replace(replace(replace(pmp.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
                            + " )";
                }

                if (!string.IsNullOrEmpty(from_date))
                {
                    strWhr += " and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' ";
                }


                string strSql = "SELECT  p.id order_id, p.id as chkorder,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
                            + " REPLACE(p.post_status, 'wc-', '') status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,COALESCE(pml.meta_value, '') LastName,"
                            + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                            + " WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' " + strWhr.ToString()
                            + " limit 10 ";

                strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_posts p "
                        + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                        + " WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' " + strWhr.ToString();
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                //if (ds.Tables[1].Rows.Count > 0)
                //    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static List<object> chartData = new List<object>();
        public static void SalesGraph1()
        {
            chartData.Clear();
            string query = "select date_format(date_created,'%b %d') as Sales_date, sum(coalesce(total_sales,0)) as Total";
            query += " from wp_wc_order_stats where date(date_created) <= NOW() and date(date_created) >= Date_add(Now(), interval - 20 day) and total_sales >=0 and (status='wc-completed' or status='wc-processing' or status='wc-pending') group by date(date_created)";
            string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            //List<object> chartData = new List<object>();
            chartData.Add(new object[]
                        {
                            "Sales_date","Total"
                        });
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                using (MySqlCommand cmd = new MySqlCommand(query))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    con.Open();
                    using (MySqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            chartData.Add(new object[]
                        {
                            sdr["Sales_date"], sdr["Total"]
                        });
                        }
                    }

                    con.Close();
                }
            }

        }
    }
}