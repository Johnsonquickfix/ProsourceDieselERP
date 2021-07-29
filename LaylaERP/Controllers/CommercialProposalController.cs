using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class CommercialProposalController : Controller
    {
        // GET: CommercialProposal
        public ActionResult ListingProposal()
        {
            return View();
        }

        // GET: NewProposal
        public ActionResult NewProposal()
        {
            return View();
        }
    }
}