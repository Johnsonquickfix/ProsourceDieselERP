namespace LaylaERP.UTILITIES
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
            var client = new TaxjarApi("16586498a18266a962bcd19ff2d7910b");
            
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            var rates = client.RatesForLocation(varpostcode, new
            {
                city = varcity,
                country = varcountry
            });

            return (rates.CombinedRate * 100);
        }
    }
}
