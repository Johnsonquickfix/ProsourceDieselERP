using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using LaylaERP_v1.BAL;
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
                obj.subject = obj.subject.Replace("{site_title}", model.site_title).Replace("{order_number}", model.order_number).Replace("{site_address}", model.site_address).Replace("{site_url}", model.site_url);
                obj.email_heading = obj.email_heading.Replace("{site_title}", model.site_title).Replace("{order_number}", model.order_number).Replace("{site_address}", model.site_address).Replace("{site_url}", model.site_url);
                obj.additional_content = obj.additional_content.Replace("{site_title}", model.site_title).Replace("{order_number}", model.order_number).Replace("{site_address}", model.site_address).Replace("{site_url}", model.site_url);
                obj.filename = obj.filename.Replace(".cshtml", "");
                status = true;
                String renderedHTML = EmailNotificationsController.RenderViewToString("EmailNotifications", obj.filename, obj);
                result = SendEmail.SendEmails(model.recipients, obj.subject, renderedHTML);
            }
            catch (Exception ex) { status = false; result = ex.Message; }
            return Json(new { status = status, message = result }, 0);
        }

        public ActionResult Cancel(OrderModel model)
        {
            return View(model);
        }
        public ActionResult Completed(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Customerinvoice(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Customernote(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Failed(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Giftcard(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Newaccount(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Onhold(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Processing(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult Refunded(OrderModel model)
        {
            return View(model);
        }
        public ActionResult Resetpassword(EmailSettingModel model)
        {
            return View(model);
        }

        public ActionResult NewOrder(OrderModel model)
        {
            return View(model);
        }
        public ActionResult GiftCardOrder(OrderModel model)
        {
            return View(model);
        }
        public ActionResult SendGiftcard(GiftCardModel model)
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

        public ActionResult QuoteOrderMail(OrderQuoteModel model)
        {
            DataSet ds = OrderQuoteRepository.GetOrdersQuote(model.id);
            return View(ds);
        }
        public ActionResult DonateandHaulMail(OrderQuoteModel model)
        {
            DataSet ds = DonationHaulRepository.donationcusmail(model.id);
            return View(ds);
        }

        public ActionResult EmailVerified(EmailSettingModel model)
        {
            return View(model);
        }
        public ActionResult ForgotPassword(EmailSettingModel model)
        {
            return View(model);
        }
    }
}