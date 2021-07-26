using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class ThirdPartyModel : PaggingModel
    {
        public long rowid { get; set; }
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
    }
}