using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using LaylaERP.BAL;
using Newtonsoft.Json;
using LaylaERP.Models;
using System.Dynamic;

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

        public ActionResult AddMenu(int menu_id)
        {
            dynamic myModel = new ExpandoObject();
            myModel.menu_id = null;
            myModel.menu_code = null;
            myModel.menu_name = null;
            myModel.menu_url = null;
            myModel.menu_icon = null;
            myModel.parent_id = null;
            myModel.menu_order = null;
            myModel.status = null;

            DataTable dt = AppearanceRepository.MenuByID(menu_id);
            myModel.menu_id = menu_id;
            myModel.menu_code = dt.Rows[0]["menu_code"];
            myModel.menu_name = dt.Rows[0]["menu_name"];
            myModel.menu_url = dt.Rows[0]["menu_url"];
            myModel.menu_icon = dt.Rows[0]["menu_icon"];
            myModel.parent_id = dt.Rows[0]["parent_id"];
            myModel.menu_order = dt.Rows[0]["menu_order"];
            myModel.status = dt.Rows[0]["status"];
            return PartialView("AddMenu", myModel);

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

        [HttpPost]
        public JsonResult UpdateMenus(Appearance model)
        {
            if (model.menu_id > 0)
            {
                AppearanceRepository.UpdateMenus(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        public ActionResult AddMenuDetails()
        {
            Appearance model = new Appearance();
            return View(model);
        }

        [HttpPost]
        public JsonResult CreateMenus(Appearance model)
        {
            //if (ModelState.IsValid)
            //{
                //if (model.menu_id > 0)
                //{

                //}
                //else
                //{

                    int ID = AppearanceRepository.AddNewMenu(model);
                    if (ID > 0)
                    {
                        AppearanceRepository.AddAdminRole(ID);
                        return Json(new { status = true, message = "Data has been saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                //}
            //}
            //return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        }


        public JsonResult GetMenus()
        {
            DataSet ds = AppearanceRepository.GetMenus();
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["menu_name"].ToString(), Value = dr["id"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SelectMenus(int menu_id )
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AppearanceRepository.MenuByID(menu_id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
    }
}