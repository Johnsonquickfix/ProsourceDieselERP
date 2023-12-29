using System;
using System.Collections.Generic;
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
    }
}