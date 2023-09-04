namespace LaylaERP.Controllers.API
{
    using Models.qfk;
    using BAL.qfk;
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    [RoutePrefix("api/analytics")]
    public class AnalyticsController : ApiController
    {
        [HttpGet, Route("metrics-list")]
        public IHttpActionResult GetMetricsList([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = ProfilesRepository.MetricsList(om.company_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);
                var dt = ProfilesRepository.MetricsList(1, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0);

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("metrics-chart")]
        public IHttpActionResult GetMetricsChart([FromUri] SearchModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = ProfilesRepository.MetricsChart(om.company_id, model.metric_id, model.period, model.date_from.Value, model.date_to.Value);
                var dt = ProfilesRepository.MetricsChart(1, model.metric_id, model.period, model.date_from.Value, model.date_to.Value);

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("metrics-feeds")]
        public IHttpActionResult GetMetricsFeeds([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var value = ProfilesRepository.MetricsFeedsList(om.company_id, model.metric_id, model.date_from, model.date_to, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "feeds");
                var value = ProfilesRepository.MetricsFeedsList(1, model.metric_id, model.date_from, model.date_to, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "feeds");
                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("metrics-best-person")]
        public IHttpActionResult GetMetricsBestPerson([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var value = ProfilesRepository.MetricsFeedsList(om.company_id, model.metric_id, model.date_from, model.date_to, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "bestpeople");
                var value = ProfilesRepository.MetricsFeedsList(1, model.metric_id, model.date_from, model.date_to, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "bestpeople");
                return Ok(JsonConvert.DeserializeObject<JArray>(value));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
