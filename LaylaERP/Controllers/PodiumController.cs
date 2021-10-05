using LaylaERP.BAL;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using LaylaERP.Models;

namespace LaylaERP.Controllers
{
    public class PodiumController : Controller
    {
        // GET: Podium
        public ActionResult paymentrec()
        {            
            try
            {
                DataTable dt = OrderRepository.GetPodiumOrdersList();
                string access_token = clsPodium.GetToken();
                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["podium_uid"] != DBNull.Value)
                    {
                        var result = clsPodium.GetPodiumInvoiceDetails(access_token, dr["podium_uid"].ToString());
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(result);
                        try
                        {
                            string status = obj.data.status;
                            if (status.ToUpper() == "PAID")
                            {
                                OrderPodiumDetailsModel model = new OrderPodiumDetailsModel();
                                model.post_id = Convert.ToInt64(dr["id"].ToString());
                                model.payment_uid = obj.data.payments[0].uid; model.location_uid = obj.data.location.uid; model.invoice_number = obj.data.invoiceNumber;
                                model.order_note = "Payment completed through Podium by " + obj.data.customerName + " on ";
                                OrderRepository.UpdatePodiumStatus(model);
                            }
                        }
                        catch { }
                    }
                }
            }
            catch { }
            return View();
        }
    }
}