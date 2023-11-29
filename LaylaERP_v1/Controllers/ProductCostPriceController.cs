using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.Models.qfk.Content;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class ProductCostPriceController : Controller
    {
        // GET: ProductCostPrice
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetProductById(string id)
        {
            DataTable dt = ProductRepository.GetProductById(id);
            var result = JsonConvert.SerializeObject(dt);
            return Json(result,0);
        }

        public ActionResult UpdateProduct(ProductByingPrice obj)
        {
            var result = ProductRepository.UpdateProduct(obj);
            return Json(result,0);
        }

    }
}