namespace LaylaERP.Controllers.qfk
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Web;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using Models.qfk.Content;
    using BAL.qfk;
    using UTILITIES;
    using System.Data;
    using Newtonsoft.Json.Linq;


    [RoutePrefix("catalog")]
    public class CatalogController : Controller
    {
        [Route("items")]
        public ActionResult Items()
        {
            return View();
        }
        [Route("item/{id}")]
        public ActionResult ItemDetail(long id = 0)
        {
            Product pairs = new Product();
            try
            {
                if (id > 0)
                {
                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    //pairs = JsonConvert.DeserializeObject<Product>(CatalogRepository.ProductDetail(om.company_id, id));
                    pairs = JsonConvert.DeserializeObject<Product>(CatalogRepository.ProductDetail(1, id));
                }
            }
            catch { }
            return View(pairs);
        }
        [Route("product-feeds")]
        public ActionResult ProductFeeds()
        {
            return View();
        }
        [Route("sources")]
        public ActionResult Sources(string id)
        {
            return View();
        }
        [Route("sources/create"), Route("sources/{id}")]
        public ActionResult SourceCreate(long id = 0)
        {
            ProductSources sources = new ProductSources();
            try
            {
                if (id > 0)
                {
                    OperatorModel om = CommanUtilities.Provider.GetCurrent();
                    //sources = JsonConvert.DeserializeObject<ProductSources>(CatalogRepository.SourceAdd("get", om.company_id, om.user_id, id, string.Empty).ToString());
                    sources = JsonConvert.DeserializeObject<ProductSources>(CatalogRepository.SourceAdd("get", 1, om.UserID, id, string.Empty).ToString());
                }
            }
            catch { }
            return View(sources);
        }
        [Route("templates")]
        public ActionResult Templates()
        {
            return View();
        }
    }
}