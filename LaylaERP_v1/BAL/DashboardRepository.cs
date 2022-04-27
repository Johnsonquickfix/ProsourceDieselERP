using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.DAL;
using System.Globalization;
using System.Data;
using LaylaERP.Models;
using System.Configuration;
using System.Data.SqlClient;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class DashboardRepository
    {
        public static List<Export_Details> exportorderlist = new List<Export_Details>();
        public static List<Export_Details> QuoteList = new List<Export_Details>();
        public static int Total_Orders(string from_date, string to_date)
        {
            int totalorders = 0;
            //DateTime fromdate = DateTime.Now, todate = DateTime.Now;

            string strQuery = "SELECT Count(distinct p.id) from wp_posts p left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id' WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' ";
            if (from_date != null)
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(from_date, us);
                DateTime endDate = DateTime.Parse(to_date, us);
                strQuery += " and convert(date,p.post_date) >= convert(date,'" + startDate.ToString("yyyy-MM-dd") + "') and convert(date,p.post_date) <= convert(date,'" + endDate.ToString("yyyy-MM-dd") + "')";
            }
            if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
            {
                long user = CommanUtilities.Provider.GetCurrent().UserID;
                strQuery += " and pm.meta_value = '" + user + "'";
            }
            totalorders = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalorders;
        }

        public static decimal Total_Sales(string from_date, string to_date)
        {
            decimal totalsales = 0;
            string strQuery = "SELECT coalesce(round(sum(convert(float,rpm.meta_value)),2),0) TotalSales from wp_posts p inner join wp_postmeta rpm ON p.id = rpm.post_id AND meta_key = '_order_total'" +
                 "left join  wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id' WHERE p.post_type = 'shop_order' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded')";
            if (from_date != null)
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(from_date, us);
                DateTime endDate = DateTime.Parse(to_date, us);
                strQuery += " and convert(date,p.post_date) >= convert(date,'" + startDate.ToString("yyyy-MM-dd") + "') and convert(date,p.post_date) <= convert(date,'" + endDate.ToString("yyyy-MM-dd") + "')";
            }
            if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
            {
                long user = CommanUtilities.Provider.GetCurrent().UserID;
                strQuery += " and pm.meta_value = '" + user + "'";
            }
            totalsales = Convert.ToDecimal(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalsales;
        }

        public static decimal Total_Customer(string from_date, string to_date)
        {
            decimal totalcustomer = 0;
            string strQuery = "SELECT Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' ";
            if (from_date != null)
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(from_date, us);
                DateTime endDate = DateTime.Parse(to_date, us);
                strQuery += "  WHERE convert(date,ur.user_registered) >= '" + startDate.ToString("yyyy-MM-dd") + "' and convert(date,ur.user_registered)<= '" + endDate.ToString("yyyy-MM-dd") + "'";
            }
            totalcustomer = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalcustomer;
        }

        public static decimal Total_Order_Completed(string from_date, string to_date)
        {
            decimal totalordercompleted = 0;

            string strQuery = "SELECT coalesce(Count(distinct p.id),0) from wp_posts p left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id' WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' and p.post_status='wc-completed'  ";
            if (from_date != null)
            {
                CultureInfo us = new CultureInfo("en-US");
                DateTime startDate = DateTime.Parse(from_date, us);
                DateTime endDate = DateTime.Parse(to_date, us);
                strQuery += " and convert(date,p.post_date) >= convert(date,'" + startDate.ToString("yyyy-MM-dd") + "') and convert(date,p.post_date) <= convert(date,'" + endDate.ToString("yyyy-MM-dd") + "')";
            }
            if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
            {
                long user = CommanUtilities.Provider.GetCurrent().UserID;
                strQuery += " and pm.meta_value = '" + user + "'";
            }
            totalordercompleted = Convert.ToInt32(SQLHelper.ExecuteScalar(strQuery).ToString());
            return totalordercompleted;
        }

        public static int TotalOrder(string from_date, string to_date)
        {
            DateTime fromdate = DateTime.Now, todate = DateTime.Now;
            fromdate = DateTime.Parse(from_date);
            todate = DateTime.Parse(to_date);

            int totalorders = 0;
            string strQuery = "SELECT coalesce(Count(distinct p.id),0)  from wp_posts p WHERE p.post_type = 'shop_order' and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft'";
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
                if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
                {
                    long user = CommanUtilities.Provider.GetCurrent().UserID;
                    strWhr = " and pm.meta_value = '" + user + "'";
                }
                string strSql = "Select (SELECT ISNULL(Count(distinct p.id),0) from wp_posts p  left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id' WHERE p.post_type = 'shop_order '" + strWhr.ToString() + " and cast(p.post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status != 'auto-draft') TotalOrder , " +
                    "(SELECT ISNULL(round(sum(convert(numeric(18,2),rpm.meta_value)),2),0) " +
                    "from wp_posts p inner join wp_postmeta rpm ON p.id = rpm.post_id AND meta_key = '_order_total' left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id' " +
                    "WHERE p.post_type = 'shop_order' and cast(p.post_date as date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and cast(post_date as date)<= '" + todate.ToString("yyyy-MM-dd") + "' and p.post_status in ('wc-completed','wc-pending','wc-processing','wc-on-hold','wc-refunded') " + strWhr.ToString() + ") TotalSale ";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataSet GetCommonSearch(string flag, string searchStr)
        {
            DataSet ds = new DataSet();
            // totalrows = 0;
            try
            {
                SqlParameter[] para =
                {
                    new SqlParameter("@flag", flag),
                    !string.IsNullOrEmpty(searchStr) ? new SqlParameter("@search", searchStr) :new SqlParameter("@search", string.Empty)
                };
                ds = SQLHelper.ExecuteDataSet("erp_homesearchbar", para);

                //string strWhr = string.Empty;
                //if (searchOn == "users" || searchOn == "all")
                //    strWhr += "select top 5 id,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value NOT LIKE '%customer%' where User_Login!='' and CONCAT(User_Login,' ', user_email) LIKE '%" + searchStr + "%' order by id Desc;";
                //if (searchOn == "customers" || searchOn == "all")
                //    strWhr += "select  top 5 id,user_login,user_email from wp_users as ur inner join wp_usermeta um on ur.id = um.user_id and um.meta_key='wp_capabilities' AND um.meta_value LIKE '%customer%' where User_Login!='' and CONCAT(User_Login,' ', user_email) LIKE '%" + searchStr + "%' order by id Desc;";
                //if (searchOn == "orders" || searchOn == "all")
                //    strWhr += "select  top 5 p.id,meta_value first_name,p.post_status,post_date FROM wp_posts p left join wp_postmeta pm on p.id = pm.post_id and pm.meta_key in ('_billing_first_name') where p.post_type = 'shop_order' and post_status != 'auto-draft' and id LIKE '%" + searchStr + "%' order by post_date Desc;";
                //ds = SQLHelper.ExecuteDataSet(strWhr);
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
                    strWhr += " and convert(date,p.post_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,p.post_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "') ";
                }
                if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
                {
                    long user = CommanUtilities.Provider.GetCurrent().UserID;
                    strWhr += " and pm.meta_value = '" + user + "'";
                }

                string strSql = "SELECT  p.id order_id, p.id as chkorder,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
                            + " (case p.post_status when 'wc-pendingpodiuminv' then 'Pending Podium Invoice'"
                            + " when 'wc-processing' then 'Processing'"
                            + " when 'wc-pending' then 'Pending payment'"
                            + " when 'wc-on-hold' then 'On Hold'"
                            + " when 'wc-completed' then 'Completed'"
                            + " when 'wc-cancelled' then 'Cancelled'"
                            + " when 'wc-refunded' then 'Refunded'"
                            + " when 'wc-failed' then 'Failed'"
                            + " when 'wc-cancelnopay' then 'Cancelled - No Payment'"
                            + " when 'wc-podium' then 'Order via Podium'"
                            + " when 'draft' then 'Draft'"
                            + " else '-' end) as status,"
                            + " convert(varchar,p.post_date,101) date_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,COALESCE(pml.meta_value, '') LastName,"
                            + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                            + " left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id'"
                            + " WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' " + strWhr.ToString() + " order by p.id desc ";
                //+ " limit 10 ";

                strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_posts p "
                        + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                        + " left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id'"
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

        public static DataTable OrderListDashboardDetails(string from_date, string to_date, string userstatus, string searchid, int pageno, int pagesize, string SortCol = "order_id", string SortDir = "DESC")
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
                    strWhr += " and convert(date,p.post_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,p.post_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "') ";
                }
                if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
                {
                    long user = CommanUtilities.Provider.GetCurrent().UserID;
                    strWhr += " and pm.meta_value = '" + user + "'";
                }

                string strSql = "SELECT  p.id order_id, p.id as chkorder, CONVERT(varchar, CAST(pmfot.meta_value  AS money), 1) total_sales,"
                            + " (case p.post_status when 'wc-pendingpodiuminv' then 'Pending Podium Invoice'"
                            + " when 'wc-processing' then 'Processing'"
                            + " when 'wc-pending' then 'Pending payment'"
                            + " when 'wc-on-hold' then 'On Hold'"
                            + " when 'wc-completed' then 'Completed'"
                            + " when 'wc-cancelled' then 'Cancelled'"
                            + " when 'wc-refunded' then 'Refunded'"
                            + " when 'wc-failed' then 'Failed'"
                            + " when 'wc-cancelnopay' then 'Cancelled - No Payment'"
                            + " when 'wc-podium' then 'Order via Podium'"
                            + " when 'draft' then 'Draft'"
                            + " else '-' end) as status,"
                            + " convert(varchar,p.post_date,101) date_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName" 
                            + " FROM wp_posts p inner join wp_postmeta pmfot on p.id = pmfot.post_id and pmfot.meta_key = '_order_total' "
                            + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'" 
                            + " left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id'"
                            + " WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' " + strWhr.ToString() + " order by p.id desc ";
                //+ " limit 10 ";

                strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_posts p "
                        + " left join wp_postmeta pmf on p.id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on p.id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " left join wp_postmeta pmp on p.id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                        + " left join wp_postmeta pm ON p.id = pm.post_id AND pm.meta_key = 'employee_id'"
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

        //public static DataTable OrderListDashboard(string from_date, string to_date, string userstatus, string searchid, int pageno, int pagesize, string SortCol = "order_id", string SortDir = "DESC")
        //{
        //    DataTable dt = new DataTable();
        //    // totalrows = 0;
        //    try
        //    {
        //        string strWhr = string.Empty;
        //        DateTime fromdate = DateTime.Now, todate = DateTime.Now;
        //        fromdate = DateTime.Parse(from_date);
        //        todate = DateTime.Parse(to_date);
        //        if (!string.IsNullOrEmpty(searchid))
        //        {
        //            strWhr += " and (p.id like '%" + searchid + "%' "
        //                    + " OR os.num_items_sold='%" + searchid + "%' "
        //                    + " OR os.total_sales='%" + searchid + "%' "
        //                    + " OR os.customer_id='%" + searchid + "%' "
        //                    + " OR p.post_status like '%" + searchid + "%' "
        //                    + " OR p.post_date like '%" + searchid + "%' "
        //                    + " OR COALESCE(pmf.meta_value, '') like '%" + searchid + "%' "
        //                    + " OR COALESCE(pml.meta_value, '') like '%" + searchid + "%' "
        //                    + " OR replace(replace(replace(replace(pmp.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
        //                    + " )";
        //        }

        //        if (!string.IsNullOrEmpty(from_date))
        //        {
        //            strWhr += " and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' ";
        //        }


        //        string strSql = "SELECT  p.id order_id, p.id as chkorder,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
        //                    + " REPLACE(p.post_status, 'wc-', '') status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,COALESCE(pml.meta_value, '') LastName,"
        //                    + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone"
        //                    + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
        //                    + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
        //                    + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
        //                    + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
        //                    + " WHERE p.post_type = 'shop_order' " + strWhr.ToString()
        //                    + " limit 10 ";

        //        strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id "
        //                + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
        //                + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
        //                + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
        //                + " WHERE p.post_type = 'shop_order' " + strWhr.ToString();
        //        DataSet ds = SQLHelper.ExecuteDataSet(strSql);
        //        dt = ds.Tables[0];
        //        //if (ds.Tables[1].Rows.Count > 0)
        //        //    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return dt;
        //}

        public static List<object> chartData = new List<object>();
        //public static void SalesGraph1()
        //{
        //    chartData.Clear();
        //    string query = "select date_format(date_created,'%b %d') as Sales_date, sum(coalesce(total_sales,0)) as Total";
        //    query += " from wp_wc_order_stats where date(date_created) <= NOW() and date(date_created) >= Date_add(Now(), interval - 20 day) and total_sales >=0 and (status='wc-completed' or status='wc-processing' or status='wc-pending') group by date(date_created)";
        //    string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
        //    //List<object> chartData = new List<object>();
        //    chartData.Add(new object[]
        //                {
        //                    "Sales_date","Total"
        //                });
        //    using (SqlParameter con = new SqlParameter(constr))
        //    {
        //        using (MySqlCommand cmd = new MySqlCommand(query))
        //        {
        //            cmd.CommandType = CommandType.Text;
        //            cmd.Connection = con;
        //            con.Open();
        //            using (MySqlDataReader sdr = cmd.ExecuteReader())
        //            {
        //                while (sdr.Read())
        //                {
        //                    chartData.Add(new object[]
        //                {
        //                    sdr["Sales_date"], sdr["Total"]
        //                });
        //                }
        //            }

        //            con.Close();
        //        }
        //    }

        //}

        public static void SalesGraph1(string from_date, string to_date)
        {
            chartData.Clear();
            string strWhr = string.Empty;
            string datebetween = string.Empty;
            string query = string.Empty;
            CultureInfo us = new CultureInfo("en-US");
            if (from_date != null)
            {
                DateTime fromdate = DateTime.Parse(from_date, us);
                DateTime todate = DateTime.Parse(to_date, us);
                datebetween = " and convert(date,p.post_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,post_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
            }
            else
            {
                datebetween = " and convert(date,p.post_date) >= convert(date,dateadd(DAY,-20,getdate()))";
            }
            if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
            {
                long user = CommanUtilities.Provider.GetCurrent().UserID;
                strWhr = " and pm_uc.meta_value = '" + user + "'";
                query = "select convert(varchar(6), Sales_date_val, 107) Sales_date,*from(select convert(date, p.post_date) as Sales_date_val, pm_uc.meta_value as Employee,"
                       + " sum(convert(float, pm_st.meta_value)) as Total from wp_posts p"
                       + " left outer join wp_postmeta pm_uc on pm_uc.post_id = p.id and pm_uc.meta_key = 'employee_id'"
                       + " left outer join wp_postmeta pm_st on pm_st.post_id = p.id and pm_st.meta_key = '_order_total'"
                       + " where convert(date, p.post_date) <= convert(date, getdate()) " + datebetween.ToString()
                       + " and p.post_type = 'shop_order' and p.post_status in ('wc-completed', 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-refunded', 'wc-pendingpodiuminv') " + strWhr.ToString()
                       + " group by  convert(date, p.post_date), pm_uc.meta_value) tt order by Sales_date_val desc";
            }
            else
            {
                query = "select convert(varchar(6), Sales_date_val, 107) Sales_date,*from(select convert(date, p.post_date) as Sales_date_val,"
                       + " sum(convert(float, pm_st.meta_value)) as Total from wp_posts p"
                       + " left outer join wp_postmeta pm_uc on pm_uc.post_id = p.id and pm_uc.meta_key = 'employee_id'"
                       + " left outer join wp_postmeta pm_st on pm_st.post_id = p.id and pm_st.meta_key = '_order_total'"
                       + " where convert(date, p.post_date) <= convert(date, getdate()) " + datebetween.ToString()
                       + " and p.post_type = 'shop_order' and p.post_status in ('wc-completed', 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-refunded', 'wc-pendingpodiuminv')"
                       + " group by  convert(date, p.post_date)) tt order by Sales_date_val desc";
            }

            string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            chartData.Add(new object[]
                        {
                            "Sales_date","Total"
                        });
            using (SqlConnection con = new SqlConnection(constr))
            {
                using (SqlCommand cmd = new SqlCommand(query))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    con.Open();
                    using (SqlDataReader sdr = cmd.ExecuteReader())
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
        public static void GetSalesOrderChart(string from_date, string to_date)
        {
            try
            {
                exportorderlist.Clear();
                DataSet ds1 = new DataSet();
                string strWhr = string.Empty;
                string datebetween = string.Empty;
                string query = string.Empty;
                CultureInfo us = new CultureInfo("en-US");
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " and convert(date,p.post_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,post_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                else
                {
                    datebetween = " and convert(date,p.post_date) >= convert(date,dateadd(DAY,-7,getdate()))";
                }
                if (CommanUtilities.Provider.GetCurrent().UserType.ToUpper() != "ADMINISTRATOR")
                {
                    long user = CommanUtilities.Provider.GetCurrent().UserID;
                    strWhr = " and pm_uc.meta_value = '" + user + "'";
                    query = "select convert(varchar(6), Sales_date_val, 107) Sales_date,*from(select convert(date, p.post_date) as Sales_date_val, pm_uc.meta_value as Employee,"
                           + " sum(convert(float, pm_st.meta_value)) as Total from wp_posts p"
                           + " left outer join wp_postmeta pm_uc on pm_uc.post_id = p.id and pm_uc.meta_key = 'employee_id'"
                           + " left outer join wp_postmeta pm_st on pm_st.post_id = p.id and pm_st.meta_key = '_order_total'"
                           + " where convert(date, p.post_date) <= convert(date, getdate()) " + datebetween.ToString()
                           + " and p.post_type = 'shop_order' and p.post_status in ('wc-completed', 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-refunded', 'wc-pendingpodiuminv') " + strWhr.ToString()
                           + " group by  convert(date, p.post_date), pm_uc.meta_value) tt order by Sales_date_val desc";
                }
                else
                {
                    query = "select convert(varchar(6), Sales_date_val, 107) Sales_date,*from(select convert(date, p.post_date) as Sales_date_val,"
                           + " sum(convert(float, pm_st.meta_value)) as Total from wp_posts p"
                           + " left outer join wp_postmeta pm_uc on pm_uc.post_id = p.id and pm_uc.meta_key = 'employee_id'"
                           + " left outer join wp_postmeta pm_st on pm_st.post_id = p.id and pm_st.meta_key = '_order_total'"
                           + " where convert(date, p.post_date) <= convert(date, getdate()) " + datebetween.ToString()
                           + " and p.post_type = 'shop_order' and p.post_status in ('wc-completed', 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-refunded', 'wc-pendingpodiuminv')"
                           + " group by  convert(date, p.post_date)) tt order by Sales_date_val desc";
                }
                ds1 = SQLHelper.ExecuteDataSet(query);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Sales_date"].ToString()))
                        uobj.first_name = ds1.Tables[0].Rows[i]["Sales_date"].ToString();

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.billing_city = ds1.Tables[0].Rows[i]["Total"].ToString();
                    exportorderlist.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static void GetSalesQuoteChart(string from_date, string to_date)
        {
            try
            {
                QuoteList.Clear();
                DataSet ds1 = new DataSet();
                string strWhr = string.Empty;
                string datebetween = string.Empty;
                string query = string.Empty;
                CultureInfo us = new CultureInfo("en-US");
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " convert(date,quote_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,quote_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                else
                {
                    datebetween = " convert(date,quote_date) >= convert(date,dateadd(DAY,-7,getdate()))";
                }
                query = "SELECT SUM(net_total)Total, convert(varchar(6), quote_date, 107) quote_date FROM erp_order_quote WHERE "+datebetween+ " group by convert(varchar(6), quote_date, 107), convert(varchar,quote_date, 112) order by convert(varchar,quote_date, 112) desc";
                ds1 = SQLHelper.ExecuteDataSet(query);
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    Export_Details uobj = new Export_Details();
                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["quote_date"].ToString()))
                        uobj.last_name = ds1.Tables[0].Rows[i]["quote_date"].ToString();

                    if (!string.IsNullOrEmpty(ds1.Tables[0].Rows[i]["Total"].ToString()))
                        uobj.billing_country = ds1.Tables[0].Rows[i]["Total"].ToString();
                    QuoteList.Add(uobj);
                }
            }
            catch (Exception ex) { throw ex; }
        }

        public static DataTable GetQuoteDetails(string from_date, string to_date)
        {
            string datebetween = string.Empty;
            CultureInfo us = new CultureInfo("en-US");
            DataTable ds = new DataTable();
            try
            {
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " and convert(date,quote_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,quote_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                string strSql = "SELECT COUNT(quote_no) Total FROM erp_order_quote WHERE 1=1 " + datebetween + ";";
                ds = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetQuoteApproved(string from_date, string to_date)
        {
            string datebetween = string.Empty;
            CultureInfo us = new CultureInfo("en-US");
            DataTable ds = new DataTable();
            try
            {
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " and convert(date,quote_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,quote_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                string strSql = "SELECT COUNT(quote_status) Approved FROM erp_order_quote where quote_status = 'wc-approved' " + datebetween + ";";
                ds = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetQuoteRejected(string from_date, string to_date)
        {
            string datebetween = string.Empty;
            CultureInfo us = new CultureInfo("en-US");
            DataTable ds = new DataTable();
            try
            {
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " and convert(date,quote_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,quote_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                string strSql = "SELECT COUNT(quote_status) Rejected FROM erp_order_quote where quote_status = 'wc-rejected' " + datebetween + ";";
                ds = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataTable GetQuoteRemain(string from_date, string to_date)
        {
            string datebetween = string.Empty;
            CultureInfo us = new CultureInfo("en-US");
            DataTable ds = new DataTable();
            try
            {
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " and convert(date,quote_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,quote_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                string strSql = "SELECT COUNT(quote_status) Remain FROM erp_order_quote where quote_status in ('wc-draft','wc-pendingpodiuminv') " + datebetween + ";";
                ds = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetQuoteComplete(string from_date, string to_date)
        {
            string datebetween = string.Empty;
            CultureInfo us = new CultureInfo("en-US");
            DataTable ds = new DataTable();
            try
            {
                if (from_date != null)
                {
                    DateTime fromdate = DateTime.Parse(from_date, us);
                    DateTime todate = DateTime.Parse(to_date, us);
                    datebetween = " and convert(date,quote_date) >= convert(date,'" + fromdate.ToString("yyyy-MM-dd") + "') and convert(date,quote_date) <= convert(date,'" + todate.ToString("yyyy-MM-dd") + "')";
                }
                string strSql = "SELECT COUNT(quote_status) Complete FROM erp_order_quote where quote_status = 'wc-podium' " + datebetween + ";";
                ds = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
    }
}