using LaylaERP.BAL;
using LaylaERP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class GiftcardController : Controller
    {
        // GET: Giftcard
        public ActionResult Giftcard()
        {
            return View();
        }
        public JsonResult AddGiftCard(GiftCardModel model)
        {
            //string UserID = Guid.NewGuid().ToString().Substring(0, 20);

            int UserID = GiftCardRepository.AddGiftCard(model);
            if (UserID > 0)
            {
                return Json(new { status = true, message = "Data has been saved successfully!!", url = "", id = UserID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
    }
}