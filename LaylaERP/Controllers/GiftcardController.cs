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
            string mail = "";
            string Message = "";
            bool status = true;
            foreach (string list in model.recipient)
            {
                string ID = Guid.NewGuid().ToString("N");
                string gid = ID.Substring(0, 4) + "-" + ID.Substring(4, 4) + "-" + ID.Substring(8, 4) + "-" + ID.Substring(12, 4);
                string code = gid.ToUpper();
                int UserID = GiftCardRepository.AddGiftCard(model, code,list);
                if (UserID > 0)
                {
                    GiftCardRepository.AddGiftCardActivity(model, UserID, code);
                    status = true;
                    mail += list + " ";
                    Message = mail + " has been saved successfully!!";
                    //return Json(new { status = true, message = "Data has been saved successfully!!", url = "", id = UserID }, 0);
                }
                else
                {
                    status = false;
                    mail += list + " ";
                    Message = mail + " can not be saved!! something went wrong";
                }
            }
            return Json(new { status = status, message = Message, url = "" }, 0);
        }
    }
}