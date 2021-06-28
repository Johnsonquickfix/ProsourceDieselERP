using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.BAL;
using Newtonsoft.Json;
using LaylaERP.Models;


namespace LaylaERP.Controllers
{
    public class AppearanceController : Controller
    {
        // GET: Appearance
        public ActionResult Index()
        {
            return View("Menus");
        }

        public ActionResult Menus()
        {
            return View();
        }

        public ActionResult AddMenu(int menu_id=0)
        {
            Appearance model = new Appearance();
            ViewBag.id = menu_id;
            return View(model);
        }

        public ActionResult Appearance()
        {
            return View();
        }
        
        public JsonResult GetERPMenus()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AppearanceRepository.GetERPMenus();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetMenuByID(Appearance model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = AppearanceRepository.MenuByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}