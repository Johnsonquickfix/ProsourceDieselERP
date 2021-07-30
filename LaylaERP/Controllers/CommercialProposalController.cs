using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
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
        public JsonResult GetVendorByID(CommercialProposalModel model)
        {
            int id = model.VendorTypeID;
            string result = string.Empty;
            try
            {
                DataTable dt = CommercialProposalRepositiory.GetVendorByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }
        //interconterm
        public JsonResult GetIncotermByID(CommercialProposalModel model)
        {
            int id = model.IncotermsTypeID;
            string result = string.Empty;
            try
            {
                DataTable dt = CommercialProposalRepositiory.GetIncotermByID(id);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(result, 0);
        }

        public JsonResult GetIncoterm(SearchModel model)
        {
            DataSet ds = BAL.CommercialProposalRepositiory.GetIncoterm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["IncoTerm"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }
        //interconterm


        public JsonResult GetVendor(SearchModel model)
        {
            DataSet ds = BAL.CommercialProposalRepositiory.GetVendor();
            List<SelectListItem> thirdpartylist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                thirdpartylist.Add(new SelectListItem { Text = dr["nom"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(thirdpartylist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetPaymentType(SearchModel model)
        {
            DataSet ds = BAL.CommercialProposalRepositiory.GetPaymentType();
            List<SelectListItem> paymenttypelist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                paymenttypelist.Add(new SelectListItem { Text = dr["PaymentType"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(paymenttypelist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult SourceOrderChannel(SearchModel model)
        {
            DataSet ds = BAL.CommercialProposalRepositiory.SourceOrderChannel();
            List<SelectListItem> sourcelist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                sourcelist.Add(new SelectListItem { Text = dr["name"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(sourcelist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetPaymentTerm(SearchModel model)
        {
            DataSet ds = BAL.ThirdPartyRepository.GetPaymentTerm();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["PaymentTerm"].ToString(), Value = dr["ID"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetBalanceDays(SearchModel model)
        {

            DataSet ds = BAL.ThirdPartyRepository.GetBalanceDays();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {

                productlist.Add(new SelectListItem { Text = dr["Balance"].ToString(), Value = dr["ID"].ToString() });

            }
            return Json(productlist, JsonRequestBehavior.AllowGet);


        }
        [HttpPost]
        public JsonResult AddProposal(CommercialProposalModel model)
        {
            int ID = CommercialProposalRepositiory.AddProposal(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
    }
}