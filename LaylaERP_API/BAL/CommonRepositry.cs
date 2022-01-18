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
    using LaylaERP_API.Models;

    public class CommonRepositry
    {
        public static Dictionary<string, object> GetOrders(long user_id, int pageno,int pagesize)
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
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize)
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
                _list.Add("pageno", pageno);
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

        public static DataTable GetGiftCards(long user_id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", "URGCL"),
                    new SqlParameter("@customer_id", user_id)
                };
                dt = SQLHelper.ExecuteDataTable("api_user_details", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetUserAddress(long user_id, string flag)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@id", user_id)
                };
                dt = SQLHelper.ExecuteDataTable("api_user_address", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable UpdateShippingAddress(UserShippingModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", "USADU"),
                    new SqlParameter("@id", model.user_id),
                    new SqlParameter("@first_name", model.shipping_first_name),
                    new SqlParameter("@last_name", model.shipping_last_name),
                    new SqlParameter("@company", model.shipping_company),
                    new SqlParameter("@address_1", model.shipping_address_1),
                    new SqlParameter("@address_2", model.shipping_address_2),
                    new SqlParameter("@phone", model.shipping_phone),
                    new SqlParameter("@email", model.shipping_email),
                    new SqlParameter("@city", model.shipping_city),
                    new SqlParameter("@state", model.shipping_state),
                    new SqlParameter("@country", model.shipping_country),
                    new SqlParameter("@postcode", model.shipping_postcode)
                };
                dt = SQLHelper.ExecuteDataTable("api_user_address", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable UpdateBillingAddress(UserBillingModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@flag", "UBADU"),
                    new SqlParameter("@id", model.user_id),
                    new SqlParameter("@first_name", model.billing_first_name),
                    new SqlParameter("@last_name", model.billing_last_name),
                    new SqlParameter("@company", model.billing_company),
                    new SqlParameter("@address_1", model.billing_address_1),
                    new SqlParameter("@address_2", model.billing_address_2),
                    new SqlParameter("@phone", model.billing_phone),
                    new SqlParameter("@email", model.billing_email),
                    new SqlParameter("@city", model.billing_city),
                    new SqlParameter("@state", model.billing_state),
                    new SqlParameter("@country", model.billing_country),
                    new SqlParameter("@postcode", model.billing_postcode)
                };
                dt = SQLHelper.ExecuteDataTable("api_user_address", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}