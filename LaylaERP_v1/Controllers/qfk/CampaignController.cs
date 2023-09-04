namespace LaylaERP.Controllers.qfk
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Models.qfk.Campaigns;
    using BAL.qfk;
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    [RoutePrefix("campaigns")]
    public class CampaignsController : Controller
    {
        [Route("list")]
        public ActionResult List()
        {
            return View();
        }
        [Route("create"), Route("create/{id}")]
        public ActionResult Create(long id = 0)
        {
            CampaignRequest request = new CampaignRequest();
            try
            {
                ViewBag.id = id;
                if (id > 0)
                {
                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    //request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, om.company_id, id, string.Empty));
                    request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, 1, id, string.Empty));
                    if (request.campaign_status == 3) return RedirectToAction("reports", "campaigns", new { id = id }); 
                }
            }
            catch { }
            return View();
        }
        [Route("{id}/content")]
        public ActionResult Content(long id = 0)
        {
            try
            {
                ViewBag.id = id;
            }
            catch { }
            return View();
        }
        [Route("rich-text-editor/{id}")]
        public ActionResult RichTextEditor(long id = 0)
        {
            try
            {
                ViewBag.id = id;
            }
            catch { }
            return View();
        }
        [Route("html-editor/{id}")]
        public ActionResult HtmlEditor(long id = 0)
        {
            try
            {
                ViewBag.id = id;
            }
            catch { }
            return View();
        }
        [Route("{id}/content/library")]
        public ActionResult library(long id = 0)
        {
            try
            {
                ViewBag.id = id;
            }
            catch { }
            return View();
        }
        [Route("{id}/schedule")]
        public ActionResult Schedule(long id = 0)
        {
            CampaignRequest request = new CampaignRequest();
            try
            {
                ViewBag.id = id;
                if (id > 0)
                {
                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    //request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, om.company_id, id, string.Empty));
                    request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, 1, id, string.Empty));
                }
            }
            catch { }
            return View(request);
        }
        [Route("{id}/sent")]
        public ActionResult Sent(long id = 0)
        {
            try
            {
                ViewBag.id = id;
            }
            catch { }
            return View();
        }
        [Route("{id}/reports")]
        public ActionResult Reports(long id = 0)
        {
            JObject pairs = new JObject();
            try
            {
                ViewBag.id = id;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID > 0)
                {
                    //pairs = JsonConvert.DeserializeObject<JObject>(quickfix_klvanalysis.Repository.CampaignRepository.CampaignsAdd("campaign-overview", om.user_id, om.company_id, ViewBag.id, string.Empty));
                    pairs = JsonConvert.DeserializeObject<JObject>(CampaignRepository.CampaignsAdd("campaign-overview", om.UserID, 1, ViewBag.id, string.Empty));
                }
            }
            catch { }
            return View(pairs);
        }
        [Route("{id}/web-view")]
        public ActionResult WebView(long id = 0)
        {
            CampaignRequest request = new CampaignRequest();
            try
            {
                ViewBag.id = id;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, om.company_id, id, string.Empty));
                request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, 1, id, string.Empty));
            }
            catch { }
            //return View(pairs);
            return Content(request.contentdata.data_html);
        }
        [Route("{id}/reports/recipients")]
        public ActionResult Recipients(long id = 0)
        {
            CampaignRequest request = new CampaignRequest();
            try
            {
                ViewBag.id = id;
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, om.company_id, id, string.Empty));
                request = JsonConvert.DeserializeObject<CampaignRequest>(CampaignRepository.CampaignsAdd("get", 0, 1, id, string.Empty));
            }
            catch { }
            return View(request);
        }
    }
}