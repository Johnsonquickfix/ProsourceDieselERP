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

    }
}