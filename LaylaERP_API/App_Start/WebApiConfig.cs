using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using System.Net.Http.Headers;
using System.Web.Http.Cors;

namespace LaylaERP_API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            string origin = System.Configuration.ConfigurationManager.AppSettings["AOrigins"];
            var cors = new EnableCorsAttribute(origin, "*", "GET,HEAD,POST");
            //var cors = new EnableCorsAttribute("*", "*", "GET,HEAD,POST");
            //var cors = new EnableCorsAttribute("*", "*", "GET,POST");
            config.EnableCors(cors);
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            GlobalConfiguration.Configuration.Formatters.XmlFormatter.UseXmlSerializer = true;
        }
    }
}
