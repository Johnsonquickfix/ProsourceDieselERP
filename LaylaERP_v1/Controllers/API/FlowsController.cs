﻿namespace LaylaERP.Controllers.API
{
    using LaylaERP.BAL.qfk;
    using LaylaERP.Models.qfk.Flows;
    using LaylaERP.UTILITIES;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    [RoutePrefix("api/flow")]
    public class FlowsController : ApiController
    {
        [HttpPost, Route("create")]
        public IHttpActionResult FlowCreate(Flow request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                if (string.IsNullOrEmpty(request.flow_name)) return Content(HttpStatusCode.BadRequest, new { message = "name is required. name must be between 1 and 255 characters." });
                var json_data = JsonConvert.DeserializeObject<JObject>(FlowsRepository.FlowAdd("create", om.login_company_id, request.flow_id, om.UserID, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else if (json_data["status"].ToString() == "200") return Ok(json_data);
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else return Ok(json_data);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        // Get: api/lists/5
        public IHttpActionResult Get(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, new { message = "Request had invalid authentication credentials." });
                //if (string.IsNullOrEmpty(api_key)) return Content(HttpStatusCode.Unauthorized, new { message = "The API key specified is invalid." });
                if (id <= 0) return Content(HttpStatusCode.BadRequest, new { detail = "id is required." });
                Flow request = new Flow() { flow_id = id };
                var json_data = JsonConvert.DeserializeObject<JObject>(FlowsRepository.FlowAdd("get", om.login_company_id, request.flow_id, om.UserID, JsonConvert.SerializeObject(request)).ToString());
                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "200") return Content(HttpStatusCode.OK, json_data);
                    else if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, json_data);
                    else if(json_data["status"].ToString() == "404") return Content(HttpStatusCode.NotFound, json_data);
                    else return Content(HttpStatusCode.BadRequest, json_data);
                }
                else return Content(HttpStatusCode.OK, new { status = 200, message = "Success!", data = json_data });
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
    }
}
