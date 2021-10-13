using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class GiftCardModel
    {
        public long id { get; set; }
        public string type { get; set; }
        public long user_id { get; set; }
        public string user_email { get; set; }
        public long object_id { get; set; }
        public long gc_id { get; set; }
        public string gc_code { get; set; }
        public double amount { get; set; }
        public int date { get; set; }
        public string note { get; set; }
        public string code { get; set; }
        public long order_id { get; set; }
        public long order_item_id { get; set; }
        public string recipient { get; set; }
        public List<string> recipientList { get; set; }
        public int redeemed_by { get; set; }
        public string sender { get; set; }
        public string sender_email { get; set; }
        public string message { get; set; }
        public double balance { get; set; }
        public double remaining { get; set; }
        public string template_id { get; set; }
        public int create_date { get; set; }
        public int deliver_date { get; set; }
        public string delivered { get; set; }
        public int expire_date { get; set; }
        public int redeem_date { get; set; }
        public string is_virtual { get; set; }
        public string is_active { get; set; }
        public int qty { get; set; }

        public string delivery_date { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }
        public string PhoneNumber { get; set; }
        public string OrderNotes { get; set; }

    }

}