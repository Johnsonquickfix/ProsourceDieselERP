namespace LaylaERP.Controllers
{
    using Models;
    using BAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using LaylaERP.UTILITIES;

    [RoutePrefix("api2/commonapi")]
    public class CommonAPIController : ApiController
    {
        [HttpPost]
        [Route("eventlist")]
        public IHttpActionResult UserEventList(SearchModel model)
        {
            try
            {
                DateTime? fromdate = null, todate = null;
                if (!string.IsNullOrEmpty(model.strValue1))
                    fromdate = Convert.ToDateTime(model.strValue1);
                if (!string.IsNullOrEmpty(model.strValue2))
                    todate = Convert.ToDateTime(model.strValue2);

                long user_id = CommanUtilities.Provider.GetCurrent().UserID;
                var balResult = EventsRepository.GetCalenderEvents(user_id, fromdate, todate);
                return Ok(balResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
