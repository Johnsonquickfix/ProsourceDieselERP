using LaylaERP.BAL;
using LaylaERP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class ThirdPartyController : Controller
    {
        // GET: ThirdParty
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult NewVendor()
        {
            return View();
        }
        [HttpPost]
        public JsonResult AddVendor(ThirdPartyModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {
                    //Repo.EditCustomer(model, model.row);
                    //return Json(new { status = true, message = "Customer Record has been updated successfully!!", url = "", id = model.ID }, 0);
                }
                else
                {
                    int ID = new ThirdPartyRepository().AddNewVendor(model);
                    if (ID > 0)
                    {
                        ModelState.Clear();
                        return Json(new { status = true, message = "Customer Record has been saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
    }
}