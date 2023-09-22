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
    }
}