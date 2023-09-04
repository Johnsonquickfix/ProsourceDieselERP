namespace LaylaERP.Controllers.qfk
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using LaylaERP.UTILITIES;
    using LaylaERP.BAL.qfk;
    using LaylaERP.Models.qfk.Common;

    [RoutePrefix("audience")]
    public class AudienceController : Controller
    {
        // GET: Audience
        [Route("profiles")]
        public ActionResult Profiles()
        {
            return View();
        }
        [Route("profile/{id}")]
        public ActionResult ProfileView(string id)
        {
            ViewBag.id = id;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            //ProfileResponse profile = JsonConvert.DeserializeObject<ProfileResponse>(ProfilesRepository.ProfileDetails(om.company_id, id));
            ProfileResponse profile = JsonConvert.DeserializeObject<ProfileResponse>(ProfilesRepository.ProfileDetails(1, id));
            return View(profile);
        }
    }
}