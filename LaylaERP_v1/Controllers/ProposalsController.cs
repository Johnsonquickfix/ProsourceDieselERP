namespace LaylaERP.Controllers
{
    using BAL;
    using Models;
    using UTILITIES;
    using Microsoft.Ajax.Utilities;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;


    public class ProposalsController : Controller
    {
        // GET: SupplierProposals
        [Route("proposals/supplierproposals")]
        public ActionResult SupplierProposalsList()
        {
            return View();
        }

        [HttpGet]
        [Route("proposals/proposals-list")]
        public JsonResult GetProposalsList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long supplierid = 0;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    supplierid = Convert.ToInt32(model.strValue3);
                DataTable dt = ProposalsRepository.GetProposals(fromdate, todate, supplierid, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
    }
}