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
        // GET: SupplierProposals
        [Route("proposals/proposals-view")]
        public ActionResult SupplierProposalsView(long id = 0)
        {
            ViewBag.id = id;
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
                long supplierid = 0; bool IsBilled = false;
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);
                if (!string.IsNullOrEmpty(model.strValue3))
                    supplierid = Convert.ToInt64(model.strValue3);
                if (!string.IsNullOrEmpty(model.strValue4))
                    IsBilled = model.strValue4.Equals("1") ? true : false;
                DataTable dt = ProposalsRepository.GetProposals(fromdate, todate, supplierid, IsBilled, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        [HttpGet]
        [Route("proposals/proposals-print")]
        public JsonResult GetProposalsPrint(SearchModel model)
        {
            string JSONresult = string.Empty;
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            OperatorModel om = new OperatorModel();
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ProposalsRepository.GetSupplierProposalsDetails(id, "GETPO");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(new { en_id = UTILITIES.CryptorEngine.Encrypt(model.strValue1), com_name = om.CompanyName, add = om.address, add1 = om.address1, city = om.City, state = om.State, zip = om.postal_code, country = om.Country, phone = om.user_mobile, email = om.email, website = om.website, data = JSONresult }, 0);
        }
        [HttpGet]
        [Route("proposals/getproposals-details")]
        public JsonResult GetProposalsByID(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                DataSet ds = ProposalsRepository.GetSupplierProposalsDetails(id, "POBID");
                JSONresult = JsonConvert.SerializeObject(ds);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        // generate invoice for Vendor Sales PO
        [HttpPost]
        public JsonResult generateinvoice(SearchModel model)
        {
            string strID = model.strValue1;
            if (strID != "")
            {
                ProposalsRepository.generateinvoice(strID);
                return Json(new { status = true, message = "Invoice generate successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        // generate invoice for Vendor Sales PO
        [HttpPost]
        public JsonResult generatesalespoinvoice(SearchModel model)
        {
            string strID = model.strValue1;
            if (strID != "")
            {
                DataTable dt = ProposalsRepository.generatesalespoinvoice(strID);
                if (dt.Rows[0]["Response"].ToString() == "Success")
                    return Json(new { status = true, message = "Invoice generate successfully!", type = "All" }, 0);
                else if (dt.Rows[0]["Response"].ToString() == "None")
                    return Json(new { status = true, message = "No vendor sales PO is not matching for generating an invoice!", type = "None" }, 0);
                else
                    return Json(new { status = true, message = "Some vendor sales PO (" + dt.Rows[0]["datapo"].ToString() + ") is not matching with our criteria to generate an invoice.", type = "Miss" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        [HttpGet]
        [Route("proposals/getship-rate")]
        public JsonResult GetShippingRate(SearchModel model)
        {
            string JSONresult = string.Empty;
            bool _status = false;
            try
            {
                long id = 0;
                if (!string.IsNullOrEmpty(model.strValue1))
                    id = Convert.ToInt64(model.strValue1);
                string orders_json = string.Empty;
                DataTable dt = ProposalsRepository.GetFedexJSONforRate(id, out orders_json);

                string client_id = string.Empty, client_secret = string.Empty;
                foreach (DataRow dr in dt.Rows)
                {
                    client_id = dr["client_id"].ToString().Trim();
                    client_secret = dr["client_secret"].ToString().Trim();
                }
                var access_token = clsFedex.GetToken(client_id, client_secret);
                string str_meta = string.Empty;
                if (!string.IsNullOrEmpty(orders_json))
                {
                    var dyn = JsonConvert.DeserializeObject<dynamic>(orders_json);
                    foreach (var inputAttribute in dyn.orders)
                    {
                        string transaction_id = inputAttribute.transaction_id.Value.ToString();
                        var result = JsonConvert.DeserializeObject<dynamic>(clsFedex.ShipRates(access_token, inputAttribute.ToString()));
                        str_meta += (str_meta.Length > 0 ? ", " : "") + "{ \"id\": " + transaction_id + ", \"fedex_charges\": " + result.output.rateReplyDetails[0].ratedShipmentDetails[0].totalNetFedExCharge.ToString() + " }";
                    }
                }
                if (!string.IsNullOrEmpty(str_meta))
                {
                    ProposalsRepository.UpdateFedexRate("[" + str_meta + "]");
                    _status = true;
                }
            }
            catch (Exception ex) { Json(new { status = _status, message = ex.Message }, 0); }
            return Json(new { status = _status, message = "Record updated successfully." }, 0);
        }
        // GET: fedex shiong charge update cron job
        [Route("proposals/ship-rate-sync")]
        public ActionResult FedexShippingRate()
        {
            try
            {
                string orders_json = string.Empty;
                DataTable dt = ProposalsRepository.GetFedexJSONforRate(null, out orders_json);

                string client_id = string.Empty, client_secret = string.Empty;
                foreach (DataRow dr in dt.Rows)
                {
                    client_id = dr["client_id"].ToString().Trim();
                    client_secret = dr["client_secret"].ToString().Trim();
                }
                var access_token = clsFedex.GetToken(client_id, client_secret);
                string str_meta = string.Empty;
                if (!string.IsNullOrEmpty(orders_json))
                {
                    var dyn = JsonConvert.DeserializeObject<dynamic>(orders_json);
                    foreach (var inputAttribute in dyn.orders)
                    {
                        string transaction_id = inputAttribute.transaction_id.Value.ToString();
                        var result = JsonConvert.DeserializeObject<dynamic>(clsFedex.ShipRates(access_token, inputAttribute.ToString()));
                        if (result != null)
                            str_meta += (str_meta.Length > 0 ? ", " : "") + "{ \"id\": " + transaction_id + ", \"fedex_charges\": " + result.output.rateReplyDetails[0].ratedShipmentDetails[0].totalNetFedExCharge.ToString() + " }";
                    }
                }
                if (!string.IsNullOrEmpty(str_meta))
                {
                    ProposalsRepository.UpdateFedexRate("[" + str_meta + "]");
                }
            }
            catch (Exception ex) { }
            return View();
        }
    }
}