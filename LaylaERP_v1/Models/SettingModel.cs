using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class SettingModel
    {
        bool _AuthorizeNet;
        bool _Paypal;
        bool _AmazonPay;
        bool _CreditCustomer;
        bool _Podium;
        string _SenderEmailID = string.Empty;
        string _SenderEmailPwd = string.Empty;
        string _SMTPServerName = string.Empty;
        int _SMTPServerPortNo;
        int _SSL;
        int _ID;
        string _PaypalClientID = string.Empty;
        string _PaypalSecret = string.Empty;
        string _PaypalSellerAccount = string.Empty;
        string _PaypalAccountDetails = string.Empty;
        string _AuthorizeAPILogin = string.Empty;
        string _AuthorizeTransKey = string.Empty;
        string _AuthorizeKey = string.Empty;
        string _AmazonAPIId = string.Empty;
        string _AmazonUser = string.Empty;
        string _AmazonPwd = string.Empty;
        string _TaxjarAPIId = string.Empty;
        string _TaxjarUser = string.Empty;
        string _TaxjarPwd = string.Empty;
        string _podiumAPIKey = string.Empty;
        string _podiumSecretKey = string.Empty;
        string _podium_code = string.Empty;
        string _podium_refresh_code = string.Empty;
        string _podium_locationuid = string.Empty;

        public bool AuthorizeNet
        {
            get { return _AuthorizeNet; }
            set { _AuthorizeNet = value; }
        }

        public bool Paypal
        {
            get { return _Paypal; }
            set { _Paypal = value; }
        }

        public bool AmazonPay
        {
            get { return _AmazonPay; }
            set { _AmazonPay = value; }
        }

        public bool CreditCustomer
        {
            get { return _CreditCustomer; }
            set { _CreditCustomer = value; }
        }

        public bool Podium
        {
            get { return _Podium; }
            set { _Podium = value; }
        }
        public string sender_name { get; set; }
        public string SenderEmailID
        {
            get { return _SenderEmailID; }
            set { _SenderEmailID = value; }
        }
        public string SenderEmailPwd
        {
            get { return _SenderEmailPwd; }
            set { _SenderEmailPwd = value; }
        }

        public string SMTPServerName
        {
            get { return _SMTPServerName; }
            set { _SMTPServerName = value; }
        }
        public int SMTPServerPortNo
        {
            get { return _SMTPServerPortNo; }
            set { _SMTPServerPortNo = value; }
        }
        public int SSL
        {
            get { return _SSL; }
            set { _SSL = value; }
        }
        public string PaypalClientId
        {
            get { return _PaypalClientID; }
            set { _PaypalClientID = value; }
        }
        public string PaypalSecret
        {
            get { return _PaypalSecret; }
            set { _PaypalSecret = value; }
        }
        public string PaypalSellerAccount
        {
            get { return _PaypalSellerAccount; }
            set { _PaypalSellerAccount = value; }
        }
        public string PaypalAccountDetails
        {
            get { return _PaypalAccountDetails; }
            set { _PaypalAccountDetails = value; }
        }
        public string AuthorizeAPILogin
        {
            get { return _AuthorizeAPILogin; }
            set { _AuthorizeAPILogin = value; }
        }
        public string AuthorizeTransKey
        {
            get { return _AuthorizeTransKey; }
            set { _AuthorizeTransKey = value; }
        }
        public string AuthorizeKey
        {
            get { return _AuthorizeKey; }
            set { _AuthorizeKey = value; }
        }
        public string AmazonAPIId
        {
            get { return _AmazonAPIId; }
            set { _AmazonAPIId = value; }
        }
        public string AmazonUser
        {
            get { return _AmazonUser; }
            set { _AmazonUser = value; }
        }
        public string AmazonPwd
        {
            get { return _AmazonPwd; }
            set { _AmazonPwd = value; }
        }
        public string TaxjarAPIId
        {
            get { return _TaxjarAPIId; }
            set { _TaxjarAPIId = value; }
        }
        public string TaxjarUser
        {
            get { return _TaxjarUser; }
            set { _TaxjarUser = value; }
        }
        public string TaxjarPwd
        {
            get { return _TaxjarPwd; }
            set { _TaxjarPwd = value; }
        }
        public string podiumAPIKey
        {
            get { return _podiumAPIKey; }
            set { _podiumAPIKey = value; }
        }
        public string podiumSecretKey
        {
            get { return _podiumSecretKey; }
            set { _podiumSecretKey = value; }
        }


        public string podium_code
        {
            get { return _podium_code; }
            set { _podium_code = value; }
        }
        public string podium_refresh_code
        {
            get { return _podium_refresh_code; }
            set { _podium_refresh_code = value; }
        }
        public string podium_locationuid
        {
            get { return _podium_locationuid; }
            set { _podium_locationuid = value; }
        }
        public int ID
        {
            get { return _ID; }
            set { _ID = value; }
        }
        public bool IsPayment { get; set; }
        public string affirm_api_key { get; set; }
        public string affirm_private_api_key { get; set; }
        public string CompanyName { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string address { get; set; }
        public string address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string postal_code { get; set; }
        public string country_code_phone { get; set; }
        public string phone_type { get; set; }
        public string user_mobile { get; set; }
        public string email { get; set; }
        public string website { get; set; }
        public string logo_url { get; set; }
        public string additional_notes { get; set; }
        public string po_email { get; set; }
        public string base_url { get; set; }

        public string rule_name { get; set; }
        public string description { get; set; }
        public string location { get; set; }
        public string services { get; set; }
        public string fk_products { get; set; }
        public int fk_rule { get; set; }
        public int fk_product { get; set; }
        public int fk_vendor { get; set; }
        public string countryshipping { get; set; }

        public int fk_warehouse { get; set; }

        public string amazon_public_key { get; set; }
        public string amazon_private_key { get; set; }
    }

    public static class GlobalVariables
    {
        public static string strEmailNotSendMsg = string.Empty;
        public static string strSenderEmailPwd = string.Empty;
        public static string strSMTPServerName = string.Empty;
        public static string strSMTPServerPortNo = string.Empty;

        public static string strTaxRate_glb = string.Empty;
        public static string strTaxRate_glb_pct = string.Empty;

        public static bool bl_AuthorizeNet_glb = false;
        public static bool bl_Paypal_glb = false;
        public static bool bl_AmazonPay_glb = false;
        public static bool bl_CreditCustomer_glb = false;
    }
}