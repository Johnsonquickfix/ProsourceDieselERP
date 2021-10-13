using LaylaERP.BAL;
using LaylaERP.Models;
using System;
using System.Collections.Generic;
using System.Data;
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
        [HttpPost]
        public ActionResult GiftCard(FormCollection collection)
        {
            string giftamount = collection["hfAmount"];
            if (giftamount == "Other")
            {
                giftamount = collection["amount"];
            }
            string GiftToMultiple = collection["GiftToMultiple"];
            string senderemail = collection["GiftFrom"];
            //if (giftamount == "")
            //{
            //    ViewBag.ErrorMessage = "Please select amount"; return View();
            //}
            //else if (GiftToMultiple == "")
            //{
            //    ViewBag.Focus = "txtGiftTo"; ViewBag.ErrorMessage = "recipient value can not be null"; return View();
            //}
            //else if (senderemail == "")
            //{
            //    ViewBag.Focus = "txtGiftFrom"; ViewBag.ErrorMessage = "Gift From value can not be null"; return View();
            //}
            //else
            //{
            DataTable data = new GiftCardRepository().GetCustomerAddressByEmail(senderemail);
            
            GiftCardModel model = new GiftCardModel
            {
                amount = Convert.ToDouble(giftamount),
                recipient = GiftToMultiple,
                sender_email = senderemail,
                message = collection["GiftMessage"],
                delivery_date = collection["DeliveryDate"],
                FirstName = data.Rows[0]["FirstName"].ToString(),
                LastName = data.Rows[0]["LastName"].ToString(),
                Company = data.Rows[0]["Company"].ToString(),
                Country = data.Rows[0]["Country"].ToString(),
                State = data.Rows[0]["State"].ToString(),
                City = data.Rows[0]["City"].ToString(),
                Zipcode = data.Rows[0]["Company"].ToString(),
                Address = data.Rows[0]["Address1"].ToString(),
                Address2 = data.Rows[0]["Address2"].ToString(),
                PhoneNumber = data.Rows[0]["Phone"].ToString(),
                OrderNotes = data.Rows[0]["Company"].ToString(),
            };
            return View("ordermeta", model);
            //}
        }
        public ActionResult ordermeta(GiftCardModel model)
        {
            string Email = model.sender_email;


            return View(model);
        }
        //public JsonResult AddGiftCard(GiftCardModel model)
        //{
        //    string mail = "";
        //    string Message = "";
        //    bool status = true;
        //    foreach (string list in model.recipient)
        //    {
        //        string ID = Guid.NewGuid().ToString("N");
        //        string gid = ID.Substring(0, 4) + "-" + ID.Substring(4, 4) + "-" + ID.Substring(8, 4) + "-" + ID.Substring(12, 4);
        //        string code = gid.ToUpper();
        //        int UserID = GiftCardRepository.AddGiftCard(model, code,list);
        //        if (UserID > 0)
        //        {
        //            GiftCardRepository.AddGiftCardActivity(model, UserID, code);
        //            status = true;
        //            mail += list + " ";
        //            Message = mail + " has been saved successfully!!";
        //            //return Json(new { status = true, message = "Data has been saved successfully!!", url = "", id = UserID }, 0);
        //        }
        //        else
        //        {
        //            status = false;
        //            mail += list + " ";
        //            Message = mail + " can not be saved!! something went wrong";
        //        }
        //    }
        //    return Json(new { status = status, message = Message, url = "" }, 0);
        //}
    }
}