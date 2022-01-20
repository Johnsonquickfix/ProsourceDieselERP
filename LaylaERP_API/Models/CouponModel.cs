namespace LaylaERP_API.Models
{
    using System;
    using System.ComponentModel;

    public class CouponModel
    {
        public string couponCode { get; set; }
        public string umail_uid { get; set; }
        public CouponModel()
        {
            couponCode = umail_uid = string.Empty;
        }
    }
}