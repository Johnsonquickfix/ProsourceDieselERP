﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class ThirdPartyModel : PaggingModel
    {
        public long rowid { get; set; }
        public int vendor_type { get; set; }
        public string Name { get; set; }
        public string AliasName { get; set; }
        public string Prospect { get; set; }
        public string CustomerCode { get; set; }
        public string Vendor { get; set; }
        public string VendorCode { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }
        public string Address1 { get; set; }
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string StateName { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string EMail { get; set; }
        public string Web { get; set; }
        public string ProfId { get; set; }
        public string SalesTaxUsed { get; set; }
        public string VATID { get; set; }
        public string ThirdPartyType { get; set; }
        public string Workforce { get; set; }
        public string BusinessEntityType { get; set; }
        public string Capital { get; set; }
        public int IncotermsTypeID { get; set; }
        public string IncotermsType { get; set; }
        public string Incoterms { get; set; }
        public string SalesRepresentative { get; set; }
        public string Logo { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }
        public int PaymentTermsID { get; set; }
        public int BalanceID { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Currency { get; set; }
        public bool EnableVendorUOM { get; set; }
        public string UnitsofMeasurment { get; set; }
        public string MinimumOrderQuanity { get; set; }
        public decimal DefaultTax { get; set; }
        public bool TaxIncludedinPrice { get; set; }
        public decimal DefaultDiscount { get; set; }
        public string CreditLimit { get; set; }
        public string WarehouseID { get; set; }
        public int VendorID { get; set; }
        public string LeadTime { get; set; }
        public string DaysofStock { get; set; }
        public bool VendorStatus { get; set; }
        public string outstanding_limit { get; set; }
        public int fk_shipping_method { get; set; }
        public string order_min_amount { get; set; }
        public string Workinghours { get; set; }
        public string CorAddress1 { get; set; }
        public string CorAddress2 { get; set; }
        public string CorCity { get; set; }
        public string CorState { get; set; }
        public string CorZipCode { get; set; }
        public string CorCountry { get; set; }
        public string CorPhone { get; set; }
        public string NotePublic { get; set; }
        public string NotePrivate { get; set; }
        public decimal ShippingRate { get; set; }
        public string ShippingLocation { get; set; }
        public string ShippingAPIKeyTest { get; set; }
        public string ShippingAPISecretTest { get; set; }
        public string ShippingAPIKeyProduction { get; set; }
        public string ShippingAPISecretProduction { get; set; }
        public string ShippingLogin { get; set; }
        public string ShippingPassword { get; set; }
        public string TaxMethod { get; set; }
        public string ShippingTax { get; set; }
        public string CalculatedTax { get; set; }
        public bool ShippingTaxIncludedinprice { get; set; }
        public string DiscountType1 { get; set; }
        public decimal DiscountMinimumOrderAmount { get; set; }
        public string AccountName { get; set; }
        public string AccountEmail { get; set; }
        public string DiscountType2 { get; set; }
        public string Discount { get; set; }
        public string Paymentmethod { get; set; }
        public string BankAccountName { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankRoutingNumber { get; set; }
        public string BankIBAN { get; set; }
        public string BankSwift { get; set; }
        public string ChequeTitle { get; set; }
        public string ChequeDescription { get; set; }
        public string PaypalInvoiceAPIUsername { get; set; }
        public string PaypalInvoiceAPIPassword { get; set; }
        public string PaypalInvoiceAPISignature { get; set; }
        public string PaypalTitle { get; set; }
        public string PaypalDescription { get; set; }
        public string ChequeInstructions { get; set; }
        public string PaypalEmail { get; set; }
        public bool PaypalProduction { get; set; }
        public string PaypalIPNEmailNotification { get; set; }
        public string PaypalReceiverEmail { get; set; }
        public string PaypalIdentitytoken { get; set; }
        public string PaypalPaymentAction { get; set; }
        public string PaypalAPIUserName { get; set; }
        public string PaypalAPIPassword { get; set; }
        public string PaypalAPISignature { get; set; }




    }
}