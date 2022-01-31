namespace LaylaERP.Controllers
{
    using BAL;
    using Models;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;


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

        public ActionResult EditEvents()
        {
            return View();
        }
        // GET: Events
        public ActionResult EventCalendar()
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
            int ID = EventsRepository.AddEvents(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Event saved successfully.", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetEventsList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = EventsRepository.GetEventsList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetEventsById(long id)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = EventsRepository.GetEventById(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult UpdateEvents(EventsModel model)
        {
            if (model.rowid > 0)
            {
                EventsRepository.EditEvents(model);
                return Json(new { status = true, message = "Event updated successfully", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }

    }
}