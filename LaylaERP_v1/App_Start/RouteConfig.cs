﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LaylaERP
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapMvcAttributeRoutes();            
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Login", id = UrlParameter.Optional }
            );
            //Url shortener route
            routes.MapRoute(
                name: "ShortUrl",
                url: "{shortUrl}",
                defaults:new { controller = "DataImport", action = "ShortUrlPage", shortUrl = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Banner",
                url: "{controller}/{action}/{app_key}/{entity_id}",
                defaults: new { controller = "CMSApi", action = "Getbanner", app_key = UrlParameter.Optional, entity_id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Pages",
                url: "{controller}/{action}/{app_key}/{entity_id}",
                defaults: new { controller = "CMSApi", action = "Getpages", app_key = UrlParameter.Optional, entity_id = UrlParameter.Optional }
            );
        }
    }
}
