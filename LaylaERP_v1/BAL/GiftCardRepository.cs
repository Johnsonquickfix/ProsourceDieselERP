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
        public DataTable GetCustomerAddressByEmail(string useremail)
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
                    " left join wp_usermeta BP on u.id = BP.user_id and BP.meta_key = 'billing_phone' " +
                    "where u.user_email = '" + useremail + "' and fn.meta_value is not null";
                DataTable result = SQLHelper.ExecuteDataTable(strSql);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
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
    }
}