using LaylaERP.BAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using System.Dynamic;

namespace LaylaERP.Controllers
{
    public class AgentCommissionRateController : Controller
    {
        // GET: AgentCommissionRate
        public ActionResult AgentCommissionRate()
        {
            return View();
        }
        public JsonResult GetCommission()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = AgentCommissionRateRepository.GetCommission();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public ActionResult AddCommissionRate()
        {
            AgentCommissionRate model = new AgentCommissionRate();
            return View(model);
        }

        [HttpPost]
        public JsonResult CreateMenus(AgentCommissionRate model)
        {
            if (ModelState.IsValid)
            {
                if (model.id > 0)
                {

                }
                else
                {

                    int ID = AgentCommissionRateRepository.AddNewMenu(model);
                    if (ID > 0)
                    {

                        return Json(new { status = true, message = "Data saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "" }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid details", url = "" }, 0);
        }


        public ActionResult UpdateCommission(int id)
        {
            dynamic myModel = new ExpandoObject();
            myModel.id = null;
            myModel.AOV_Range1 = null;
            myModel.AOV_Range2 = null;
            myModel.Comm_Rate = null;

            DataTable dt = AgentCommissionRateRepository.GetCommissionByID(id);
            myModel.id = id;
            myModel.AOV_Range1 = dt.Rows[0]["AOV_Range1"];
            myModel.AOV_Range2 = dt.Rows[0]["AOV_Range2"];
            myModel.Comm_Rate = dt.Rows[0]["Comm_Rate"];
            return PartialView("UpdateCommission", myModel);
        }

        [HttpPost]
        public JsonResult UpdateCommission(AgentCommissionRate model)
        {
            //int menu_id = 0;
            //AppearanceRepository.UpdateUsers(model);
            if (model.id > 0)
            {
                AgentCommissionRateRepository.UpdateCommission(model);
                ModelState.Clear();
                return Json(new { status = true, message = "Data saved successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid details", url = "" }, 0);
            }

        }
    }
}