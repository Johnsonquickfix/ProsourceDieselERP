using Newtonsoft.Json;
using LaylaERP.Models.qfk.TrackAndIdentify;
using System;
using System.Text;
using System.Web.Mvc;
using LaylaERP.BAL.qfk;

namespace quickfix_klvanalysis.Controllers
{
    public class WFController : Controller
    {
        //[Route("wf/open")]
        public ActionResult Open()
        {
            try
            {
                string upn = string.Empty;
                if (Request.QueryString["upn"] != null) upn = Request.QueryString["upn"].ToString();
                byte[] bytes = Convert.FromBase64String(upn);
                // Convert the byte array to a string
                string json = Encoding.UTF8.GetString(bytes);
                MailTracking obj = JsonConvert.DeserializeObject<MailTracking>(json);
                if (obj.type == "flow") { FlowsRepository.FlowMailTracking("open", obj.id, string.Empty); }
                else TrackAndIdentifyRepository.CampaignTracking("open", obj.id, json);
            }
            catch { }
            return View();
        }

        //[Route("wf/click")]
        public ActionResult Click()
        {
            try
            {
                string upn = string.Empty;
                if (Request.QueryString["upn"] != null) upn = Request.QueryString["upn"].ToString();
                byte[] bytes = Convert.FromBase64String(upn);
                // Convert the byte array to a string
                string json = Encoding.UTF8.GetString(bytes);
                MailTracking obj = JsonConvert.DeserializeObject<MailTracking>(json);
                string json_para = JsonConvert.SerializeObject(new
                {
                    clientName = Request.Browser.Id,
                    //url = obj.url
                });
                if (obj.type == "flow") { }
                else TrackAndIdentifyRepository.CampaignTracking("click", obj.id, json_para);
                return Redirect(obj.url);
            }
            catch { }
            return View();
        }
    }
}