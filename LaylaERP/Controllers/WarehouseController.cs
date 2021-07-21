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
    public class WarehouseController : Controller
    {
        // GET: Warehouse
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult AddNewWarehouse()
        {
            WarehouseModel model = new WarehouseModel();
           
            return View(model);
        }
        public ActionResult Warehouse()
        {
            return View();
        }

        public JsonResult GetWarehouse()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = WarehouseRepository.GetWarehouseDetail();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult AddWarehouse(WarehouseModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.rowid > 0)
                {

                }
                else
                {

                    int ID = WarehouseRepository.AddWarehouse(model);
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
            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }

    }
}