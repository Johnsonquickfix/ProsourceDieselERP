using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class EmailNotificationsRepository
    {
        public static string emailfromname()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_from_name'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
        public static string emailfromaddress()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_from_address'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
        public static string emailheaderimage()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_header_image'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
        public static string emailfootertext()
        {
            string value = "";
            string strQuery = "select option_value from wp_options where option_name = 'woocommerce_email_footer_text'";
            value = SQLHelper.ExecuteScalar(strQuery).ToString();
            return value;
        }
    }
}