using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace LaylaERP.Models
{

    public class Export_Details
    {

        public int order_item_id
        {
             get; set;
        }
        public string orde_item_name
        {
            get; set;
        }
        public string order_item_type
        {
            get; set;
        }
        public int order_id
        {
            get; set;
        }
        public string meta_key { get; set; }
        public string meta_value { get; set; }
        public string post_type { get; set; }
        public string order_created { get; set; }
        public int ID { get; set; }
        public string product_id { get; set; }
        public string variant_id { get; set; }
        public string product_name { get; set; }
        public string item_type { get; set; }
        public string qty { get; set; }
        public string fee { get; set; }
        public string subtotal { get; set; }
        public string tax { get; set; }
        public string total { get; set; }
        public string customer_id { get; set; }
        public string orderstatus { get; set; }
        public List<Export_Details> exportdetails { get; set; }


        //Export Users

        int _user_active;
        string _user_login = string.Empty;
        string _user_pass = string.Empty;
        string _user_role = string.Empty;
        string _user_email = string.Empty;
        string _user_nicename = string.Empty;
        string _display_name = string.Empty;
        string _user_status = string.Empty;
        string _first_name = string.Empty;
        string _last_name = string.Empty;
        string _address = string.Empty;
        string _country = string.Empty;
        string _phone = string.Empty;
        byte[] _User_Image = null;

        // user_login,user_pass,user_type,status,Email_Id

        public string user_nicename
        {
            get { return _user_nicename; }
            set { _user_nicename = value; }
        }

        public string display_name
        {
            get { return _display_name; }
            set { _display_name = value; }
        }

        public string first_name
        {
            get { return _first_name; }
            set { _first_name = value; }
        }

        public string last_name
        {
            get { return _last_name; }
            set { _last_name = value; }
        }

        public string address
        {
            get { return _address; }
            set { _address = value; }
        }

        public string country
        {
            get { return _country; }
            set { _country = value; }
        }

        public string phone
        {
            get { return _phone; }
            set { _phone = value; }
        }

        public byte[] User_Image
        {
            get { return _User_Image; }
            set { _User_Image = value; }
        }

        public int user_active
        {
            get { return _user_active; }
            set { _user_active = value; }
        }
        public string user_login
        {
            get { return _user_login; }
            set { _user_login = value; }
        }
        public string user_pass
        {
            get { return _user_pass; }
            set { _user_pass = value; }
        }

        public string user_email
        {
            get { return _user_email; }
            set { _user_email = value; }
        }
        public string user_role
        {
            get { return _user_role; }
            set { _user_role = value; }
        }
        public string user_status
        {
            get { return _user_status; }
            set { _user_status = value; }
        }

        public long UID
        {
            get; set;
        }
        public string my
        {
            get; set;
        }
        public string strVal
        {
            get; set;
        }
        public string password
        {
            get; set;
        }
        public string created_date
        {
            get; set;
        }

        //customer
        public string customer_login
        {
            get;
            set;
        }

        public string customer_my
        {
            get; set;
        }
        public string customer_email
        {
            get;
            set;
        }
        public string customer_status
        {
            get;
            set;
        }

        public string customer_phone
        {
            get;
            set;
        }
        public string customerdate_created { get; set; }
    }
}