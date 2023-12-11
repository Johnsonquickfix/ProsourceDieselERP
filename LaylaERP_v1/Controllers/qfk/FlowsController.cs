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
    }
}