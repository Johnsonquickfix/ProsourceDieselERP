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
using System.Dynamic;

namespace LaylaERP_v1.BAL
{
    public class CartRepository
    {
        public static string AddItem(long entity_id, long user_id, string cart_session_id, string json_data)
        {
            string result;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "add-item"),
                    new SqlParameter("@entity_id", entity_id),
                    user_id > 0 ? new SqlParameter("@user_id", user_id) :  new SqlParameter("@user_id", DBNull.Value),
                    !string.IsNullOrEmpty(cart_session_id) ? new SqlParameter("@cart_session_id", cart_session_id) : new SqlParameter("@cart_session_id", DBNull.Value),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data", json_data) :new SqlParameter("@json_data",  DBNull.Value)
                };
                result = SQLHelper.ExecuteReaderReturnJSON("wp_cart_search", parameters).ToString();
            }
            catch { throw; }
            return result;
        }
        public static string UpdateShippingAddress(string flag, long entity_id, long user_id, string cart_session_id, string json_data)
        {
            string result;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@entity_id", entity_id),
                    user_id > 0 ? new SqlParameter("@user_id", user_id) :  new SqlParameter("@user_id", DBNull.Value),
                    !string.IsNullOrEmpty(cart_session_id) ? new SqlParameter("@cart_session_id", cart_session_id) : new SqlParameter("@cart_session_id", DBNull.Value),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data", json_data) :new SqlParameter("@json_data",  DBNull.Value)
                };
                result = SQLHelper.ExecuteReaderReturnJSON("wp_cart_search", parameters).ToString();
            }
            catch { throw; }
            return result;
        }
        public static string ApplyCoupon(string flag, long entity_id, long user_id, string cart_session_id, string coupon_code)
        {
            string result;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    new SqlParameter("@entity_id", entity_id),
                    user_id > 0 ? new SqlParameter("@user_id", user_id) :  new SqlParameter("@user_id", DBNull.Value),
                    !string.IsNullOrEmpty(cart_session_id) ? new SqlParameter("@cart_session_id", cart_session_id) : new SqlParameter("@cart_session_id", DBNull.Value),
                    !string.IsNullOrEmpty(coupon_code) ? new SqlParameter("@coupon_code", coupon_code) :new SqlParameter("@coupon_code",  DBNull.Value)
                };
                result = SQLHelper.ExecuteReaderReturnJSON("wp_cart_search", parameters).ToString();
            }
            catch { throw; }
            return result;
        }

        public static DataTable GetTaxRate(string tocountry, string tostate, string tocity, string tostreet, string tozip)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@tocountry", tocountry),
                    new SqlParameter("@tostate", tostate),
                    new SqlParameter("@tocity", tocity),
                    new SqlParameter("@tostreet", tostreet),
                    new SqlParameter("@tozip", tozip)
                };
                string strSQl = "SELECT top 1 tocountry,tostate,tocity,tostreet,tozip,coalesce(rate,0) rate,freight_taxable,data FROM taxrates where [time] > DATEADD(day, -1,GETUTCDATE()) and lower(tocountry) = lower(@tocountry) and lower(tostate) = lower(@tostate) and lower(tocity) = lower(@tocity) and lower(tostreet) = lower(@tostreet) and tozip = @tozip order by [time] desc;";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static int SaveTaxRate(string tocountry, string tostate, string tocity, string tostreet, string tozip, decimal rate, bool freight_taxable, string tax_data)
        {
            int result = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@tocountry", tocountry),
                    new SqlParameter("@tostate", tostate),
                    new SqlParameter("@tocity", tocity),
                    new SqlParameter("@tostreet", tostreet),
                    new SqlParameter("@tozip", tozip),
                    new SqlParameter("@rate", rate),
                    new SqlParameter("@freight_taxable", freight_taxable),
                    new SqlParameter("@tax_data", tax_data)
                };
                string strSQl = "INSERT INTO taxrates (tocountry,tostate,tocity,tostreet,tozip,rate,freight_taxable,data) VALUES (@tocountry,@tostate,@tocity,@tostreet,@tozip,@rate,@freight_taxable,@tax_data);delete from taxrates where [time] < DATEADD(day, -1,GETUTCDATE());";
                result = SQLHelper.ExecuteNonQuery(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }

        #region [User Profile]
        public static dynamic UserVerify(string UserName, string UserPassword)
        {
            dynamic obj = new ExpandoObject();
            try
            {
                long id = 0;
                //UserPassword = EncryptedPwd(UserPassword);
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "AUTH"),
                    new SqlParameter("@user_login", UserName),
                    new SqlParameter("@user_pass", UserPassword)
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("api_user_auth", parameters);
                while (sdr.Read())
                {
                    bool success = (sdr["success"] != Convert.DBNull) ? Convert.ToBoolean(sdr["success"]) : false;
                    obj.message = (sdr["error_msg"] != Convert.DBNull) ? sdr["error_msg"].ToString() : string.Empty;
                    obj.status = success ? 200 : 404; obj.code = success == true ? "SUCCESS" : "Not Found";
                    id = (sdr["user_data"] != Convert.DBNull) ? Convert.ToInt64(sdr["user_data"]) : 0;
                    //obj.data = (sdr["user_data"] != Convert.DBNull) ? Convert.ToInt64(sdr["user_data"]) : 0;
                    if (success)
                    {
                        string hash = (sdr["user_pass"] != Convert.DBNull) ? sdr["user_pass"].ToString() : string.Empty;
                        //if (!CheckPassword(UserPassword, user_pass))
                        if (!CryptSharp.PhpassCrypter.CheckPassword(UserPassword, hash))
                        {
                            obj.success = false; obj.data = new { }; obj.status = 401; obj.code = "Unauthorized";
                            obj.message = "The password you entered for the username's is incorrect.";
                            return obj;
                        }

                        SqlParameter[] parameters1 = {
                                    new SqlParameter("@flag", "create-utoken"),
                                    new SqlParameter("@id", id)
                                };
                        SqlDataReader sdr1 = SQLHelper.ExecuteReader("api_user_auth", parameters1);
                        while (sdr1.Read())
                        {
                            obj.data = new { user_id = id, utoken = (sdr["user_data"] != Convert.DBNull) ? sdr1["user_data"] : "" };
                        }
                    }
                    else obj.data = new { };
                }
            }
            catch (Exception ex)
            {
                obj.success = false; obj.status = 500; obj.code = "internal_server_error";
                obj.message = ex.Message;
                obj.data = new { };
            }
            return obj;
        }
        public static string UserInfo(string utoken, long id = 0)
        {
            string result;
            try
            {
                SqlParameter[] parameters = {
                        new SqlParameter("@flag", "UINFO"),
                        new SqlParameter("@utoken", utoken),
                        new SqlParameter("@id", id)
                    };
                result = SQLHelper.ExecuteReaderReturnJSON("api_user_auth", parameters).ToString();
            }
            catch { throw; }
            return result;
        }
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
                        //dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["tracking"].ToString());
                        //childRow.Add("tracking", obj);
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
        #endregion
    }
}