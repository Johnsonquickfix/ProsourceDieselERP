using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LaylaERP.Controllers
{
    public class EmailNotificationsController : Controller
    {
        // GET: EmailNotifications
        public ActionResult Index(EmailSettingModel model)
        {
            return View(model);
        }
        [HttpPost]
        public JsonResult SendMailNotification(EmailNotificationsModel model)
        {
            string result = string.Empty;
            bool status = false;
            try
            {
                EmailSettingModel obj = EmailNotificationsRepository.GetDetails(model.option_name);
                obj.recipients = model.recipients;
                obj.subject.Replace("{site_title}", model.site_title).Replace("{order_number}", model.order_number);
                obj.email_heading.Replace("{site_title}", model.site_title).Replace("{order_number}", model.order_number);
                obj.additional_content.Replace("{site_title}", model.site_title).Replace("{order_number}", model.order_number).Replace("{site_address}", model.site_address).Replace("{site_url}", model.site_url);
                status = true;
                String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", "Index", model);
                result = SendEmail.SendEmails(model.recipients, obj.subject, renderedHTML);
            }
            catch(Exception ex) { status = false; result = ex.Message; }
            return Json(new { status = status, message = result }, 0);
        }
        [HttpPost]
        public ActionResult NewOrder(OrderModel model)
        {            
            return View(model);
        }
        public static string RenderViewToString(string controllerName, string viewName, object viewData)
        {
            using (var writer = new StringWriter())
            {
                var routeData = new RouteData();
                routeData.Values.Add("controller", controllerName);
                var fakeControllerContext = new ControllerContext(new HttpContextWrapper(new HttpContext(new HttpRequest(null, "http://google.com", null), new HttpResponse(null))), routeData, new EmailNotificationsController());
                var razorViewEngine = new RazorViewEngine();
                var razorViewResult = razorViewEngine.FindView(fakeControllerContext, viewName, "", false);

                var viewContext = new ViewContext(fakeControllerContext, razorViewResult.View, new ViewDataDictionary(viewData), new TempDataDictionary(), writer);
                razorViewResult.View.Render(viewContext, writer);
                return writer.ToString();

            }
        }
    }
}