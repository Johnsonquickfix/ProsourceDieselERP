using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class clsUserDetails
    {
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
        string _billing_address_2 =string.Empty;
        string _billing_city = string.Empty;
        string _billing_postcode = string.Empty;
        string _billing_state = string.Empty;


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

        public  byte[] User_Image
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
        public string billing_address_2
        {
            get { return _billing_address_2; }
            set { _billing_address_2 = value; }
        }
        public string billing_city
        {
            get { return _billing_city; }
            set { _billing_city = value; }
        }

        public string billing_postcode
        {
            get { return _billing_postcode; }
            set { _billing_postcode = value; }
        }

        public string billing_state
        {
            get { return _billing_state; }
            set { _billing_state = value; }
        }


        public long ID
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

    }
    public class entityDetails
    {
        int active;
        string _email = string.Empty;
        string _companyname = string.Empty; 
        string _address = string.Empty; 
        string _phone = string.Empty;
        string _status = string.Empty;
        public string email
        {
            get { return _email; }
            set { _email = value; }
        }
        public string companyname
        {
            get { return _companyname; }
            set { _companyname = value; }
        }
        public string address
        {
            get { return _address; }
            set { _address = value; }
        }
        public string phone
        {
            get { return _phone; }
            set { _phone = value; }
        }
        public string status
        {
            get { return _status; }
            set { _status = value; }
        }
        public long ID
        {
            get; set;
        } 
    }
}