using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.UTILITIES;
using LaylaERP.BAL.qfk;
using LaylaERP.Models.qfk.TrackAndIdentify;
using Newtonsoft.Json;
using System.IO;
using System.Data;
using Newtonsoft.Json.Linq;
using ClosedXML.Excel;

namespace LaylaERP.Controllers.qfk
{
    [RoutePrefix("list")]
    public class ListsController : Controller
    {
        // GET: Group List
        public ActionResult Index()
        {
            ViewBag.api_key = CommanUtilities.Provider.GetCurrent().public_api_key;
            return View();
        }

        [Route("{id}/edit/{slug}"), Route("{id}/clone/{slug}")]
        public ActionResult EditSegment(long id, string slug)
        {
            JObject pairs = new JObject();
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            if (om.UserID > 0)
            {
                Lists request = new Lists() { list_id = id };
                pairs = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("get", om.public_api_key, 0, JsonConvert.SerializeObject(request)).ToString());
            }
            if (Request.Url.PathAndQuery.ToLower().Contains("/clone/"))
                ViewBag.mode = "Clone";
            else
                ViewBag.mode = "Edit";
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            //ProfileResponse profile = JsonConvert.DeserializeObject<ProfileResponse>(ProfilesRepository.ProfileDetails(om.company_id, id));
            return View(pairs);
        }
        // GET: Lists & Segments create start 
        public ActionResult GroupCreate()
        {
            return PartialView();
        }
        // GET: Create Lists
        public ActionResult CreateList()
        {
            ViewBag.api_key = CommanUtilities.Provider.GetCurrent().public_api_key;
            return PartialView();
        }
        // GET: Lists members
        [Route("{id}/members")]
        public ActionResult ListMembers(long id = 0)
        {
            ListResponse response = new ListResponse() { member_count = 0, group_type_id = 0, group_type_name = string.Empty };
            try
            {
                string api_key = CommanUtilities.Provider.GetCurrent().public_api_key;
                Lists request = new Lists() { list_id = id };
                response = JsonConvert.DeserializeObject<ListResponse>(ProfilesRepository.GroupAdd("listinfo", api_key, 0, JsonConvert.SerializeObject(request)).ToString());
                response.member_count = ProfilesRepository.GroupMemberCount(id);
            }
            catch { }
            //return PartialView(response);
            return View(response);
        }
        public ActionResult ImportMembers(long id = 0)
        {
            ListResponse response = new ListResponse() { member_count = 0, group_type_id = 0, group_type_name = string.Empty };
            try
            {
                string api_key = CommanUtilities.Provider.GetCurrent().public_api_key;
                Lists request = new Lists() { list_id = id };
                response = JsonConvert.DeserializeObject<ListResponse>(ProfilesRepository.GroupAdd("listinfo", api_key, 0, JsonConvert.SerializeObject(request)).ToString());
            }
            catch { }
            return PartialView(response);
        }
        public ActionResult UploadCsvFile(long list_id)
        {

            var attachedFile = System.Web.HttpContext.Current.Request.Files["CsvDoc"];
            if (attachedFile == null || attachedFile.ContentLength <= 0) return Json(null);
            DataTable dt = new DataTable();
            try
            {
                string api_key = CommanUtilities.Provider.GetCurrent().public_api_key;

                using (StreamReader sr = new StreamReader(attachedFile.InputStream))
                {
                    string[] headers = sr.ReadLine().Split(',');
                    foreach (string header in headers)
                    {
                        dt.Columns.Add(header.ToLower().Trim().Replace(' ', '_'));
                    }
                    if (!dt.Columns.Contains("email"))
                    {
                        return Json(new { message = "Email column is not exists." }, 0);
                    }
                    while (!sr.EndOfStream)
                    {
                        string[] rows = sr.ReadLine().Split(',');
                        DataRow dr = dt.NewRow();
                        for (int i = 0; i < headers.Length; i++)
                        {
                            dr[i] = rows[i];
                        }
                        dt.Rows.Add(dr);
                    }
                }
                string json = JsonConvert.SerializeObject(dt);
                var response_data = JsonConvert.DeserializeObject<JObject>(ProfilesRepository.GroupAdd("addmember", api_key, list_id, json));
                return Json(new { message = "success" }, 0);
            }
            catch { }
            return Json(new { message = "success" }, 0);
        }

        public ActionResult CreateSegment()
        {
            ViewBag.api_key = CommanUtilities.Provider.GetCurrent().public_api_key;
            return PartialView();
        }

        public ActionResult ExportMembersToCSV(long id = 0)
        {
            //OperatorModel om = CommanUtilities.Provider.GetCurrent();
            //DataTable dt = ProfilesRepository.GroupMembers(om.company_id, id, string.Empty, 0, 500000);
            DataTable dt = ProfilesRepository.GroupMembers(1, id, string.Empty, 0, 500000);

            //Name of File  
            string fileName = string.Format("List Export {0}.csv", DateTime.UtcNow.ToString("yyyy-MM-dd"));
            dt.TableName = string.Format("List Export {0}", DateTime.UtcNow.ToString("yyyy-MM-dd"));
            dt.Columns.Remove("is_suppressed"); dt.Columns.Remove("totalcount");
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }
    }
}