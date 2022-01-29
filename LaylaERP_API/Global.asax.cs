using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace LaylaERP_API
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_BeginRequest()
        {
            string origin = Request.Headers.Get("Origin");
            if (Request.HttpMethod == "OPTIONS")
            {
                Response.AddHeader("Access-Control-Allow-Origin", origin);
                Response.AddHeader("Access-Control-Allow-Headers", "*");
                Response.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS,DELETE");
                Response.StatusCode = 200;
                Response.End();
            }
            else
            {
                if (origin != null)
                {
                    Response.AddHeader("Access-Control-Allow-Origin", origin);
                    Response.AddHeader("Access-Control-Allow-Headers", "*");
                    Response.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS,DELETE");
                }
                else
                {
                    Response.AddHeader("Access-Control-Allow-Origin", "*");
                    Response.AddHeader("Access-Control-Allow-Headers", "*");
                    Response.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS,DELETE");
                }
            }
        }
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
