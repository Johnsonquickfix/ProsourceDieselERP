using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class UserClassification
    {
        bool _User_Mnu;
        bool _User_Classification;
        bool _Create_User;
        bool _Customers;
        bool _Orders_Mnu;
        bool _Show_Update_Orders;
        bool _Add_New_Orders;
        bool _Shippings_Mnu;
        bool _Show_Shippings;
        bool _Add_New_Shippings;
        bool _Coupon_Mnu;
        bool _Show_Coupon;

        bool _Add_Coupon;
        bool _System_Settings;
        bool _Tax;
        bool _Payments;
        string _User_Type = string.Empty;
     



        public bool User_Mnu
        {
            get { return _User_Mnu; }
            set { _User_Mnu = value; }
        }

        public bool User_Classification
        {
            get { return _User_Classification; }
            set { _User_Classification = value; }
        }

        public bool Create_User
        {
            get { return _Create_User; }
            set { _Create_User = value; }
        }

        public bool Customers
        {
            get { return _Customers; }
            set { _Customers = value; }
        }
        public bool Orders_Mnu
        {
            get { return _Orders_Mnu; }
            set { _Orders_Mnu = value; }
        }
        public bool Show_Update_Orders
        {
            get { return _Show_Update_Orders; }
            set { _Show_Update_Orders = value; }
        }

        public string User_Type
        {
            get { return _User_Type; }
            set { _User_Type = value; }
        }
        public bool Add_New_Orders
        {
            get { return _Add_New_Orders; }
            set { _Add_New_Orders = value; }
        }

        public bool Shippings_Mnu
        {
            get { return _Shippings_Mnu; }
            set { _Shippings_Mnu = value; }
        }

        public bool Show_Shippings
        {
            get { return _Show_Shippings; }
            set { _Show_Shippings = value; }
        }

        public bool Add_New_Shippings
        {
            get { return _Add_New_Shippings; }
            set { _Add_New_Shippings = value; }
        }

        public bool Coupon_Mnu
        {
            get { return _Coupon_Mnu; }
            set { _Coupon_Mnu = value; }
        }

        public bool Show_Coupon
        {
            get { return _Show_Coupon; }
            set { _Show_Coupon = value; }
        }

        public bool Add_Coupon
        {
            get { return _Add_Coupon; }
            set { _Add_Coupon = value; }
        }

        public bool System_Settings
        {
            get { return _System_Settings; }
            set { _System_Settings = value; }
        }

        public bool Tax
        {
            get { return _Tax; }
            set { _Tax = value; }
        }

        public bool Payments
        {
            get { return _Payments; }
            set { _Payments = value; }
        }
        public string strVal { get; set; }
        public string strAdd { get; set; }
        public string strEdit { get; set; }
        public string strDel { get; set; }
        public int role_id { get; set; }
    }
}