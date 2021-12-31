namespace LaylaERP_API.BAL
{
    using DAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Data;
    using System.Data.SqlClient;
    using Newtonsoft.Json;

    public class CommonRepositry
    {
        public static Dictionary<string, object> GetOrders(long user_id, int pageno)
        {
            Dictionary<string, object> _list = new Dictionary<string, object>();
            DataTable dt = new DataTable();
            try
            {
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", "ORDLS"),
                    new SqlParameter("@customer_id", user_id),
                    new SqlParameter("@pageno", pageno)
                };
                dt = SQLHelper.ExecuteDataTable("api_user_details", parameters);
                int total = 0;
                foreach (DataRow row in dt.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    childRow.Add("id", row["id"]);
                    childRow.Add("post_status", row["post_status"]);
                    childRow.Add("post_date", row["post_date"]);
                    childRow.Add("order_total", row["order_total"]);
                    childRow.Add("shipstation_shipped_item_count", row["shipstation_shipped_item_count"]);
                    if (row["tracking"] != DBNull.Value) 
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["tracking"].ToString());
                        childRow.Add("tracking", obj);
                    }
                    else
                        childRow.Add("tracking", "[]");
                    if (row["TotalCount"] != DBNull.Value) total = Convert.ToInt32(row["TotalCount"]);
                    parentRow.Add(childRow);
                }
                _list.Add("orders", parentRow);
                _list.Add("total", total);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return _list;
        }

        public static DataSet GetOrderDetail(long user_id, long order_id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", "ORDET"),
                    new SqlParameter("@customer_id", user_id),
                    new SqlParameter("@order_id", order_id)
                };
                ds = SQLHelper.ExecuteDataSet("api_user_details", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
    }
}