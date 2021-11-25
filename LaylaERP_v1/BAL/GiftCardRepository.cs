using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml;

namespace LaylaERP.BAL
{
    public class GiftCardRepository
    {
        public DataTable GetOrderInfoByGCID(long id)
        {
            try
            {
                string strSql = "Select TOP 1 fn.meta_value as FirstName, fl.meta_value as LastName, bco.meta_value as Country, bs.meta_value as State, bc.meta_value as City, " +
                    "BA1.meta_value as Address1,BA2.meta_value as Address2,Bcomp.meta_value as Company, BP.meta_value as Phone,ZC.meta_value as ZipCode " +
                    "from wp_users u left join wp_usermeta fn on u.id = fn.user_id and fn.meta_key = 'billing_first_name' " +
                    "left join wp_usermeta fl on u.id = fl.user_id and fl.meta_key = 'billing_last_name' " +
                    "left join wp_usermeta bco on u.id = bco.user_id and bco.meta_key = 'billing_country' " +
                    "left join wp_usermeta bs on u.id = bs.user_id and bs.meta_key = 'billing_state' " +
                    "left join wp_usermeta bc on u.id = bc.user_id and bc.meta_key = 'billing_city' " +
                    "left join wp_usermeta BA1 on u.id = BA1.user_id and BA1.meta_key = 'billing_address_1' " +
                    "left join wp_usermeta BA2 on u.id = BA2.user_id and BA2.meta_key = 'billing_address_2' " +
                    "left join wp_usermeta Bcomp on u.id = Bcomp.user_id and Bcomp.meta_key = 'billing_company'" +
                    " left join wp_usermeta ZC on u.id = ZC.user_id and ZC.meta_key='billing_postcode '" +
                    " left join wp_usermeta BP on u.id = BP.user_id and BP.meta_key = 'billing_phone' left join wp_usermeta wc on u.id = wc.user_id and wc.meta_key = 'wp_capabilities' " +
                    "where u.user_email = '" + id + "' and wc.meta_value='customer'";
                DataTable result = SQLHelper.ExecuteDataTable(strSql);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public DataTable GetCustomerAddressByEmail(string useremail)
        //{
        //    try
        //    {
        //        string strSql = "Select TOP 1 fn.meta_value as FirstName, fl.meta_value as LastName, bco.meta_value as Country, bs.meta_value as State, bc.meta_value as City, " +
        //            "BA1.meta_value as Address1,BA2.meta_value as Address2,Bcomp.meta_value as Company, BP.meta_value as Phone,ZC.meta_value as ZipCode " +
        //            "from wp_users u left join wp_usermeta fn on u.id = fn.user_id and fn.meta_key = 'billing_first_name' " +
        //            "left join wp_usermeta fl on u.id = fl.user_id and fl.meta_key = 'billing_last_name' " +
        //            "left join wp_usermeta bco on u.id = bco.user_id and bco.meta_key = 'billing_country' " +
        //            "left join wp_usermeta bs on u.id = bs.user_id and bs.meta_key = 'billing_state' " +
        //            "left join wp_usermeta bc on u.id = bc.user_id and bc.meta_key = 'billing_city' " +
        //            "left join wp_usermeta BA1 on u.id = BA1.user_id and BA1.meta_key = 'billing_address_1' " +
        //            "left join wp_usermeta BA2 on u.id = BA2.user_id and BA2.meta_key = 'billing_address_2' " +
        //            "left join wp_usermeta Bcomp on u.id = Bcomp.user_id and Bcomp.meta_key = 'billing_company'" +
        //            " left join wp_usermeta ZC on u.id = ZC.user_id and ZC.meta_key='billing_postcode '" +
        //            " left join wp_usermeta BP on u.id = BP.user_id and BP.meta_key = 'billing_phone' left join wp_usermeta wc on u.id = wc.user_id and wc.meta_key = 'wp_capabilities' " +
        //            "where u.user_email = '" + useremail + "' and wc.meta_value='customer'";
        //        DataTable result = SQLHelper.ExecuteDataTable(strSql);
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
        public static DataTable AddGiftCardOrdersPost(long Pkey, string qFlag, long UserID, string UserName, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@username", UserName),
                    new SqlParameter("@postsXML", postsXML.OuterXml),
                    new SqlParameter("@order_statsXML", order_statsXML.OuterXml),
                    new SqlParameter("@postmetaXML", postmetaXML.OuterXml),
                    new SqlParameter("@order_itemsXML", order_itemsXML.OuterXml),
                    new SqlParameter("@order_itemmetaXML", order_itemmetaXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_order", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataTable AddGiftCardOrders(long Pkey, string qFlag, long UserID, string UserName, string UserEmail, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@username", UserName),
                    new SqlParameter("@useremail", UserEmail),
                    new SqlParameter("@postsXML", postsXML.OuterXml),
                    new SqlParameter("@order_statsXML", order_statsXML.OuterXml),
                    new SqlParameter("@postmetaXML", postmetaXML.OuterXml),
                    new SqlParameter("@order_itemsXML", order_itemsXML.OuterXml),
                    new SqlParameter("@order_itemmetaXML", order_itemmetaXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_orderdummy", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }
        //gift card
        public static DataTable GetPodiumGiftOrdersList()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", "PGPLS") };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GiftCardOrderList(DateTime? fromdate, DateTime? todate, string customerid, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@customer_id", customerid),
                    new SqlParameter("@post_status", userstatus),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "SGCOL")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("wp_posts_giftcard_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int ChangeGiftCardStatus(SearchModel model, string ID)
        {
            try
            {
                string strsql = string.Format("Update wp_woocommerce_gc_cards set is_active=@status where id in ({0}); ", ID);
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.strValue2)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
              
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable TodayGiftCardsList()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", "SGCOD") };
                dt = SQLHelper.ExecuteDataTable("wp_posts_giftcard_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GetRedeemedCustomers(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                
                string strWhr = "Select id,user_email displayname from (select id,user_email, ROW_NUMBER() OVER(PARTITION BY user_email order by id desc) rn from wp_woocommerce_gc_activity where type = 'used' and id> 109 and user_email like  '%" + strSearch + "%')a where rn = 1";
                DT = SQLHelper.ExecuteDataTable(strWhr);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
    }
}