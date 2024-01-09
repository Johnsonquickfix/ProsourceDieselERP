using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers.qfk
{
    [RoutePrefix("forms")]
    public class FormsController : Controller
    {
        // GET: Group List
        public ActionResult Index()
        {
            return View();
        }

        [Route("create")]
        public ActionResult Create()
        {
            return View();
        }
    }
}