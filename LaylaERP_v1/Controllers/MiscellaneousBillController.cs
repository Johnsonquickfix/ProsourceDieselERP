namespace LaylaERP.Controllers
{
    using LaylaERP.BAL;
    using LaylaERP.Models;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;


    public class MiscellaneousBillController : Controller
    {
        public ActionResult AutoBillConfigList()
        {
            return View();
        }

        // GET: Miscellaneous Auto Bill Configuration
        public ActionResult AutoBillConfig()
        {
            return View();
        }

        [HttpPost]
        [Route("miscellaneousbill/autobillconfig-save")]
        public JsonResult AutoBillConfigSave(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                long id = 0, userid = CommanUtilities.Provider.GetCurrent().UserID;
                if (!string.IsNullOrEmpty(model.strValue1)) id = Convert.ToInt64(model.strValue1);
                System.Xml.XmlDocument orderXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue2 + "}", "Items");
                System.Xml.XmlDocument orderdetailsXML = JsonConvert.DeserializeXmlNode("{\"Data\":" + model.strValue3 + "}", "Items");
                JSONresult = JsonConvert.SerializeObject(MiscellaneousBillRepository.AutoBillConfigSave(id, userid, "I", orderXML, orderdetailsXML));

            }
            catch { }
            return Json(JSONresult, JsonRequestBehavior.AllowGet);
        }
    }
}