﻿using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP_v1.BAL;
using LaylaERP_v1.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class EventsController : Controller
    {
        // GET: Events
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AddNewEvents()
        {
            return View();
        }
        public ActionResult EventsList()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetUsersList()
        {
            string result = string.Empty;
            try
            {
                DataSet DS = EventsRepository.GetUsers();
                result = JsonConvert.SerializeObject(DS, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpPost]
        public JsonResult AddEvents(EventsModel model)
        {
            int ID = 1;
                //int ID = EventsRepository.AddEvents(model);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Events saved successfully.", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
        }

        public JsonResult GetWarehouseDetailNew(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = EventsRepository.GetWarehouseDetailNew(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
    }
}