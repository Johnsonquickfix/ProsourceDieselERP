using LaylaERP.BAL;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Taxjar;
namespace LaylaERP.Controllers
{
    public class TaxJarOrderController : Controller
    {
        // GET: TaxJarOrder
        public ActionResult CreateOrder()
        {
            try
            {
                var client = new TaxjarApi(CommanUtilities.Provider.GetCurrent().TaxjarAPIId);
                DataSet ds = OrderRepository.GetCompleteOrdersList();
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    var dyn = JsonConvert.DeserializeObject<dynamic>(dr[0].ToString());
                    foreach (var inputAttribute in dyn.orders)
                    {
                        string StatusCode = "";
                        string transaction_id = inputAttribute.transaction_id.Value.ToString();
                        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                        try
                        {
                            client.ShowOrder(transaction_id);
                        }
                        catch (TaxjarException e)
                        {
                            StatusCode = e.TaxjarError.StatusCode;
                            // 406 Not Acceptable – transaction_id is missing
                            //e.TaxjarError.Error;
                            //e.TaxjarError.Detail;
                            //e.TaxjarError.StatusCode;
                        }
                        if (StatusCode.Contains("404"))
                        {
                            try
                            {
                                var order = client.CreateOrder(inputAttribute);
                                DAL.SQLHelper.ExecuteNonQuery(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value) select {0},'_taxjar_last_sync',convert(varchar, GETUTCDATE(), 23) + ' ' +  convert(varchar, GETUTCDATE(), 8)", transaction_id));
                            }
                            catch { }
                        }
                    }
                }
            }
            catch { }
            return View();
        }
    }
}