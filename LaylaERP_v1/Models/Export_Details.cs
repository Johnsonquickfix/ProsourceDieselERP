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
        public DateTime order_created { get; set; }
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
        public string billing_address_1 { get; set; }
        public string billing_city { get; set; }
        public string billing_state { get; set; }
        public string billing_postcode { get; set; }
        public string billing_country { get; set; }
        public string shipping_address_1 { get; set; }
        public string shipping_city { get; set; }
        public string shipping_state { get; set; }
        public string shipping_postcode { get; set; }
        public string shipping_country { get; set; }
        public string provider { get; set; }
        public string transaction_type { get; set; }
        public string transaction_reference_id { get; set; }
        public string shipping_amount { get; set; }
        public string handling_amount { get; set; }
        public string Discount { get; set; }
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
        public DateTime created_date
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
        public DateTime customerdate_created { get; set; }

        public class BannerModel
        {
            public string id { get; set; } = string.Empty;
            public string post_content { get; set; } = string.Empty;
            public string post_title { get; set; } = string.Empty;
            public string post_author { get; set; } = string.Empty;
            public string user_login { get; set; } = string.Empty;
            public string mobileimage { get; set; } = string.Empty;
            public string post_date { get; set; } = string.Empty;
            public string total { get; set; } = string.Empty;
            public string pagebannertype { get; set; } = string.Empty;
            public string type_banner { get; set; } = string.Empty;

            public string entity_id { get; set; } = string.Empty;
            public string _edit_last { get; set; } = string.Empty;
            public string _edit_lock { get; set; } = string.Empty;
            public string _for_mobile { get; set; } = string.Empty;
            public string _thumbnail_id { get; set; } = string.Empty;
            public string for_mobile { get; set; } = string.Empty;
            public string InnerExcludeGlobalBanner { get; set; } = string.Empty;
            public string BannerImage { get; set; } = string.Empty;
            public string Bannerimage_width { get; set; } = string.Empty;
            public string Bannerimage_height { get; set; } = string.Empty;
            public string Banner_order { get; set; } = string.Empty;
            public string InnerPageBannerLink { get; set; } = string.Empty;
            public string InnerPageBannerSelection { get; set; } = string.Empty;
            public string InnerPageBannerTitle { get; set; } = string.Empty;
            public string InnerPageBannerType { get; set; } = string.Empty; 
            public string remove_schema_page_specific { get; set; } = string.Empty;
            public string slide_template { get; set; } = string.Empty;
           
            


        }

        public class PagesModel
        {
            public string id { get; set; } = string.Empty;
            public string post_content { get; set; } = string.Empty;
            public string post_title { get; set; } = string.Empty;
            public string post_author { get; set; } = string.Empty;
            public string user_login { get; set; } = string.Empty; 
            public string post_date { get; set; } = string.Empty;
            public string total { get; set; } = string.Empty; 
            public string entity_id { get; set; } = string.Empty;
            public string entity { get; set; } = string.Empty;
            public string post_parent { get; set; } = string.Empty;
            public string order { get; set; } = string.Empty;
            public string upload_ad_image { get; set; } = string.Empty;
            public string short_description { get; set; } = string.Empty;
            public string featured_image_url { get; set; } = string.Empty;
            public string _yoast_wpseo_focuskw { get; set; } = string.Empty;
            public string _yoast_wpseo_metadesc { get; set; } = string.Empty;
            public string _yoast_wpseo_title { get; set; } = string.Empty;
            public string _yoast_wpseo_keywordsynonyms { get; set; } = string.Empty;
            public string _yoast_wpseo_focuskeywords { get; set; } = string.Empty;
            //public string _wp_page_template { get; set; } = string.Empty; 
            public string _gmk { get; set; } = string.Empty;
            public string _comment { get; set; } = string.Empty;
            
            
        
        }

        public class PostModel
        {
            public string id { get; set; } = string.Empty;
            public string post_content { get; set; } = string.Empty;
            public string post_title { get; set; } = string.Empty;
            public string post_author { get; set; } = string.Empty;
            public string user_login { get; set; } = string.Empty;
            public string post_date { get; set; } = string.Empty;
            public string total { get; set; } = string.Empty;
            public string entity_id { get; set; } = string.Empty;
            public string entity { get; set; } = string.Empty;
            public string category { get; set; } = string.Empty;
            //public string order { get; set; } = string.Empty;
            public string single_image_url { get; set; } = string.Empty;
            public string featured_image_url { get; set; } = string.Empty;
            public string _yoast_wpseo_focuskw { get; set; } = string.Empty;
            public string _yoast_wpseo_metadesc { get; set; } = string.Empty;
            public string _yoast_wpseo_title { get; set; } = string.Empty;
            public string _yoast_wpseo_keywordsynonyms { get; set; } = string.Empty;
            public string _yoast_wpseo_focuskeywords { get; set; } = string.Empty;
            //public string _wp_page_template { get; set; } = string.Empty;
            //public string _gmk { get; set; } = string.Empty;
            //public string _comment { get; set; } = string.Empty;



        }
        public class StoreModel
        {            
            public string store_id { get; set; } = string.Empty;
            public string store_name { get; set; } = string.Empty;
            public string logo_url { get; set; } = string.Empty;
            public string img_width { get; set; } = string.Empty;
            public string img_height { get; set; } = string.Empty;
            public string mobile { get; set; } = string.Empty;
            public string email { get; set; } = string.Empty;
            public string address { get; set; } = string.Empty;
            public string total { get; set; } = string.Empty;
        }


        public class BlogModel
        {
            public string id { get; set; } = string.Empty;
            public string post_content { get; set; } = string.Empty;
            public string post_title { get; set; } = string.Empty;
            public string post_author { get; set; } = string.Empty;
            public string user_login { get; set; } = string.Empty;
            public string post_date { get; set; } = string.Empty;
            public string total { get; set; } = string.Empty;
            public string entity_id { get; set; } = string.Empty;
            public string entity { get; set; } = string.Empty;      
            public string upload_ad_image { get; set; } = string.Empty;
            public string short_description { get; set; } = string.Empty;
            public string featured_image_url { get; set; } = string.Empty;
            //public dynamic image_details { get; set; } = string.Empty;
            public ImageModel image { get; set; }
            public OtherImageModel other_image { get; set; }
        }
        public class ImageModel
        {
            public string width { get; set; }
            public string height { get; set; }
            public string file { get; set; }
          
        }
        public class OtherImageModel
        {
            public string width { get; set; }
            public string height { get; set; }
            public string file { get; set; }

        }
    }
}