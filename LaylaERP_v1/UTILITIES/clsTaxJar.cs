﻿namespace LaylaERP.UTILITIES
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Runtime.InteropServices;
    using System.Text;
    using System.Threading.Tasks;
    using System.Windows;
    using Taxjar;


    public class clsTaxJar
    {
        public static decimal GetTaxCombinedRate(string varpostcode, string varcity, string varcountry)
        {
            //var client = new TaxjarApi("7e8b90a535209d00f4a6f78b43f4119f");
            var client = new TaxjarApi(CommanUtilities.Provider.GetCurrent().TaxjarAPIId);

            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            var rates = client.RatesForLocation(varpostcode, new
            {
                city = varcity,
                country = varcountry
            });

            return (rates.CombinedRate * 100);
        }
        public static decimal GetTaxCombinedRate(string varpostcode, string varstreet, string varcity, string varstate, string varcountry)
        {
            //var client = new TaxjarApi("7e8b90a535209d00f4a6f78b43f4119f");
            // var client = new TaxjarApi("16586498a18266a962bcd19ff2d7910b");
            var client = new TaxjarApi(CommanUtilities.Provider.GetCurrent().TaxjarAPIId);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            var rates = client.RatesForLocation(varpostcode, new
            {
                street = varstreet,
                city = varcity,
                state = varstate,
                country = varcountry
            });

            return (rates.CombinedRate);
        }
        public static TaxJarModel GetTaxes(TaxJarModel taxJarModel)
        {
            //var client = new TaxjarApi("16586498a18266a962bcd19ff2d7910b");
            var client = new TaxjarApi(CommanUtilities.Provider.GetCurrent().TaxjarAPIId);
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            var Taxes = client.TaxForOrder(new
            {
                from_country = "US",
                from_zip = "46706",
                from_state = "IN",
                from_city = "Auburn",
                from_street = "2211 Wayne Street",
                to_country = taxJarModel.to_country,
                to_zip = taxJarModel.to_zip,
                to_state = taxJarModel.to_state,
                to_city = taxJarModel.to_city,
                to_street = taxJarModel.to_street,
                amount = taxJarModel.amount,
                shipping = taxJarModel.shipping
            });
            taxJarModel.order_total_amount = Taxes.OrderTotalAmount;
            taxJarModel.taxable_amount = Taxes.TaxableAmount;
            taxJarModel.amount_to_collect = Taxes.AmountToCollect;
            taxJarModel.rate = Taxes.Rate;
            taxJarModel.freight_taxable = Taxes.FreightTaxable;
            taxJarModel.tax_meta = "[{\"rate\": "+ Taxes.Rate.ToString() + ", \"name\": '"+ taxJarModel.to_country + "-" + taxJarModel.to_state + "-" + taxJarModel.to_state + " TAX-1', \"type\": '" + taxJarModel.to_state + " Tax'}]";
            return taxJarModel;
        }
    }
    public class TaxJarModel
    {
        public string to_zip { get; set; }
        public string to_street { get; set; }
        public string to_city { get; set; }
        public string to_state { get; set; }
        public string to_country { get; set; }
        public decimal amount { get; set; }
        public decimal shipping { get; set; }
        public decimal order_total_amount { get; set; }
        public decimal taxable_amount { get; set; }
        public decimal amount_to_collect { get; set; }
        public decimal rate { get; set; }
        public bool freight_taxable { get; set; }
        public string tax_meta { get; set; }
    }
}
