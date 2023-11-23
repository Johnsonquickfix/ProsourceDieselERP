using DocumentFormat.OpenXml.EMMA;
using LaylaERP.BAL;
using LaylaERP.Models;
using MySqlX.XDevAPI.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class assignvendorandwarehouseController : Controller
    {
        // GET: assignvendorandwarehouse
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult assign(WarehouseModel obj)
        {

            string data = WarehouseRepository.Addvendorandwarehouse(obj);
            return Json(new { status = true, message = data }, 0);
           
        }
        public ActionResult Getvendorwarehouse()
        {

            DataTable data = WarehouseRepository.Getvendorandwarehouse();
            var result = JsonConvert.SerializeObject(data);
            return Json(new { status = true, message = result }, 0);
           
        }
       

        public ActionResult Update(WarehouseModel obj)
        {

            string data = WarehouseRepository.Updatevendorandwarehouse(obj);
            return Json(new { status = true, message = data }, 0);

        }

    }
}