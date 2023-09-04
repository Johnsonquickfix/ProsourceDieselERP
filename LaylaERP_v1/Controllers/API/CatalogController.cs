namespace LaylaERP.Controllers.API
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Models.qfk;
    using Models.qfk.Content;
    using BAL.qfk;
    using UTILITIES;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("api/catalog")]
    public class CatalogController : ApiController
    {
        [HttpPost, Route("create")]
        public async Task<IHttpActionResult> create(ProductSources request)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                if (string.IsNullOrEmpty(request.source_name)) return Content(HttpStatusCode.BadRequest, new { message = "source_name is required. source_name must be between 1 and 255 characters." });
                if (string.IsNullOrEmpty(request.source_url)) return Content(HttpStatusCode.BadRequest, new { source_url = "source_name is required." });
                request.status_id = 1;
                //var json_data = JsonConvert.DeserializeObject<JObject>(CatalogRepository.SourceAdd("create", om.company_id, om.user_id, request.sources_id, JsonConvert.SerializeObject(request)).ToString());
                var json_data = JsonConvert.DeserializeObject<JObject>(CatalogRepository.SourceAdd("create", 1, om.UserID, request.sources_id, JsonConvert.SerializeObject(request)).ToString());

                if (json_data["status"] != null)
                {
                    if (json_data["status"].ToString() == "401") return Content(HttpStatusCode.Unauthorized, new { message = json_data["message"] });
                    else return Content(HttpStatusCode.BadRequest, new { message = json_data["message"] });
                }
                else
                {
                    long id = Convert.ToInt64(json_data["id"]);
                    //await new ImportData().ImportProductFromCustomSources(om.company_id, om.user_id, id, request.source_url);
                    await new ImportData().ImportProductFromCustomSources(1, om.UserID, id, request.source_url);
                    return Ok(json_data);
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet, Route("source-list")]
        public IHttpActionResult GetSourceList([FromUri] JqDataTableModel model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = CatalogRepository.SourceList(om.company_id, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");
                var dt = CatalogRepository.SourceList(1, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "lists");

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("source/{id}")]
        public IHttpActionResult GetSource(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //ProductSources sources = JsonConvert.DeserializeObject<ProductSources>(CatalogRepository.SourceAdd("get", om.company_id, om.user_id, id, string.Empty).ToString());
                ProductSources sources = JsonConvert.DeserializeObject<ProductSources>(CatalogRepository.SourceAdd("get", 1, om.UserID, id, string.Empty).ToString());
                return Ok(sources);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
        [HttpDelete, Route("source/{id}")]
        public IHttpActionResult DeleteSource(long id)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //ProductSources sources = JsonConvert.DeserializeObject<ProductSources>(CatalogRepository.SourceAdd("delete", om.company_id, om.user_id, id, string.Empty).ToString());
                ProductSources sources = JsonConvert.DeserializeObject<ProductSources>(CatalogRepository.SourceAdd("delete", 1, om.UserID, id, string.Empty).ToString());
                return Ok(sources);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet, Route("items")]
        public IHttpActionResult GetItems([FromUri] ProductsRequest model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = CatalogRepository.ProductList(om.company_id, model.id, model.json_condition, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "productlists");
                var dt = CatalogRepository.ProductList(1, model.id, model.json_condition, model.sSearch, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "productlists");
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("categories")]
        public IHttpActionResult GetCategories([FromUri] ProductsRequest model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = CatalogRepository.ProductList(om.company_id, model.id, model.sSearch, model.json_condition, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "categories");
                var dt = CatalogRepository.ProductList(1, model.id, model.sSearch, model.json_condition, model.iDisplayStart, model.iDisplayLength, model.sSortColName, model.sSortDir_0, "categories");
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("products")]
        public IHttpActionResult GetProducts([FromUri] ProductsRequest model)
        {
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                if (om.UserID <= 0) return Content(HttpStatusCode.Unauthorized, "Request had invalid authentication credentials.");

                //var dt = CatalogRepository.Products(om.company_id);
                var dt = CatalogRepository.Products(1);
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
