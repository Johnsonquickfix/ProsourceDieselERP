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
    using System.Data;
    using System.Dynamic;

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
            ProfileResponse profile = JsonConvert.DeserializeObject<ProfileResponse>(ProfilesRepository.ProfileDetails("profiledetail", 1, id));
            return View(profile);
        }


        [Route("profiles/search-id/{ids}")]
        public ActionResult Profilesearchbyid(int ids = 0)
        {
            DataTable dt = BAL.CustomSearchRepository.Getemailbyid(ids);

            dynamic myModel = new ExpandoObject();
            myModel.user_email = dt.Rows[0]["user_email"];
            myModel.ID = ids;
            return View(myModel);
        }
        [Route("profilebyid/{id}")]
        public ActionResult ProfilebyidView(string id)
        {
            ViewBag.id = id;
            OperatorModel om = CommanUtilities.Provider.GetCurrent();
            //ProfileResponse profile = JsonConvert.DeserializeObject<ProfileResponse>(ProfilesRepository.ProfileDetails(om.company_id, id));
            ProfileResponse profile = JsonConvert.DeserializeObject<ProfileResponse>(ProfilesRepository.ProfileDetails("profiledetail", 1, id));
            return View(profile);
        }
    }
}