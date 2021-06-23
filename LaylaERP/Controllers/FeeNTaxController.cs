using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using LaylaERP.BAL;
using System.Data;
using Newtonsoft.Json;

namespace LaylaERP.Controllers
{
    public class FeeNTaxController : Controller
    {
        // GET: FeeNTax
        public ActionResult Index()
        {
            return View("StateRecycleTax");
        }
        [HttpGet]
        public ActionResult StateRecycleTax(long id = 0)
        {
            FeeNTax model = new FeeNTax();
            ViewBag.id = id;
            return View(model);
        }
        [HttpPost]
        public ActionResult StateRecycleTax(FeeNTax model)
        {
            FeeNTaxRepository FNT = new FeeNTaxRepository();
            if (ModelState.IsValid)
            {
                if (model.id > 0)
                {

                    FNT.EditFeeNTaxStatus(model);
                    return Json(new { status = true, message = "Customer Record has been updated successfully!!", url = "" }, 0);
                }
                else
                {
                    // int ID = Repo.AddNewCustomer(model);

                    FNT.AddFeeNTax(model);

                    ModelState.Clear();
                    return Json(new { status = true, message = "Customer Record has been saved successfully!!", url = "" }, 0);


                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

        public JsonResult GetFeeNTaxByID(FeeNTax model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = FeeNTaxRepository.FeeNTaxByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult UpdateFeeNTax(FeeNTax model)
        {
            FeeNTaxRepository FNT = new FeeNTaxRepository();

            if (ModelState.IsValid)
            {

                FNT.EditFeeNTaxStatus(model);
                return Json(new { status = true, message = "Customer Status has been updated successfully!!", url = "" }, 0);

            }
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }



        [HttpGet]
        public ActionResult GetFeeNTaxList()
        {
            FeeNTax FNT = new FeeNTax();
            DataTable dt = new DataTable();
            dt = FeeNTaxRepository.FeeNTaxList();
            List<FeeNTax> lststu = new List<FeeNTax>();
            if (dt != null)
            {

                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {

                        FeeNTax obj = new FeeNTax();
                        obj.staterecyclefee = Convert.ToUInt64(dt.Rows[i]["staterecyclefee"].ToString());
                        obj.item_name = dt.Rows[i]["item_name"].ToString();
                        obj.state = dt.Rows[i]["state"].ToString();
                        obj.id = Convert.ToInt32(dt.Rows[i]["id"].ToString());
                        obj.zip = Convert.ToInt32(dt.Rows[i]["zip"].ToString());
                        obj.city = dt.Rows[i]["city"].ToString();
                        obj.country = dt.Rows[i]["country"].ToString();

                        lststu.Add(obj);
                    }


                }

                FNT.lst = lststu;

            }
            return Json(lststu, JsonRequestBehavior.AllowGet);
        }

    }
}

