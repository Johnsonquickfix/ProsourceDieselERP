using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Dynamic;

namespace LaylaERP_v1.Models.Product
{
    public class CartPaymentController
    {
        public string message { get; set; }
        public int status { get; set; }
        public string code { get; set; }
        public CartPaymentDataResponse data { get; set; }
    }
    public class CartPaymentDataResponse
    {
        public string email { get; set; }
        public BillingInfo billing { get; set; }
        public ShippingInfo shipping { get; set; }
        public string order_notes { get; set; }
        public string session_id { get; set; }
        public string user_id { get; set; }
        public string payment_method { get; set; }
        public string payment_method_title { get; set; }
        public CardData card_data { get; set; }
    }
    public class BillingInfo
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }
        public string company { get; set; }
        public string phone { get; set; }
        public string address_1 { get; set; }
        public string address_2 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postcode { get; set; }
        public string country { get; set; }
    }
    public class ShippingInfo
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }
        public string company { get; set; }
        public string phone { get; set; }
        public string address_1 { get; set; }
        public string address_2 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postcode { get; set; }
        public string country { get; set; }
    }

    public class CardData
    {
        public string card_number { get; set; }
        public Expiry expiry { get; set; }
        public string csc { get; set; }
    }

    public class Expiry
    {
        public string month { get; set; }
        public string year { get; set; }
    }


}