using LaylaERP.BAL.qfk;
using LaylaERP.Models.qfk.Flows;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers.qfk
{
    [RoutePrefix("flows")]
    public class FlowsController : Controller
    {
        // GET: Flows
        public ActionResult Index()
        {
            return View();
        }

        [Route("create"), Route("{id}/edit"), Route("{id}/clone")]
        public ActionResult CreateFlow(long id = 0)
        {
            ViewBag.id = id; ViewBag.mode = "Edit";
            if (Request.Url.PathAndQuery.ToLower().Contains("/create/")) ViewBag.mode = "Create";
            else if (Request.Url.PathAndQuery.ToLower().Contains("/edit/")) ViewBag.mode = "Edit";
            else if (Request.Url.PathAndQuery.ToLower().Contains("/clone/")) ViewBag.mode = "Clone";
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
        [Route("{content_id}/create-template/{temp_id}")]
        public ActionResult TemplateEditor(long content_id = 0, long temp_id = 0)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                //if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                //if (id <= 0) return Content(HttpStatusCode.BadRequest, new { message = "id is required." });
                //if (string.IsNullOrEmpty(request.content_type)) return Content(HttpStatusCode.BadRequest, new { message = "content_type is required." });
                ActionMessage action = new ActionMessage();
                action.content_id = content_id;
                action.content_type = "email";
                action.template_id = temp_id;
                var json_data = JsonConvert.DeserializeObject<JObject>(FlowsRepository.FlowAdd("create-template", om.login_company_id, content_id, om.UserID, JsonConvert.SerializeObject(action)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "200") return Redirect("~/flows/email-template-editor/" + content_id);
                }
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message }, 0); }
            return Json(new { status = false, message = "Sorry, that content isn't actually here." }, 0);
        }

        [Route("email-template-editor/{id}")]
        public ActionResult TemplateEditor(long id = 0)
        {
            try
            {
                ViewBag.id = id;
            }
            catch { }
            return View();
        }
    }
}