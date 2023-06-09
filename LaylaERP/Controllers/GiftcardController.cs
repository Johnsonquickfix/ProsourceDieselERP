﻿using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
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
            string GiftToMultiple = collection["GiftToMultiple"].TrimEnd(',');
            string[] Emaillist = GiftToMultiple.Split(',');

            string senderemail = collection["GiftFrom"];
            string FirstName = "", LastName = "", Company = "", Country = "", State = "", City = "", Zipcode = "", Address = "", Address2 = "", PhoneNumber = "", OrderNotes = "";
           
            DataTable data = new GiftCardRepository().GetCustomerAddressByEmail(senderemail);
            if (data.Rows.Count > 0)
            {
                FirstName = data.Rows[0]["FirstName"].ToString();
                LastName = data.Rows[0]["LastName"].ToString();
                Company = data.Rows[0]["Company"].ToString();
                Country = data.Rows[0]["Country"].ToString();
                State = data.Rows[0]["State"].ToString();
                City = data.Rows[0]["City"].ToString();
                Zipcode = data.Rows[0]["Company"].ToString();
                Address = data.Rows[0]["Address1"].ToString();
                Address2 = data.Rows[0]["Address2"].ToString();
                PhoneNumber = data.Rows[0]["Phone"].ToString();
                OrderNotes = data.Rows[0]["Company"].ToString();
               
            }
            GiftCardModel model = new GiftCardModel
            {
                amount = Convert.ToDecimal(giftamount),
                recipient = GiftToMultiple,
                sender_email = senderemail,
                message = collection["GiftMessage"],
                delivery_date = collection["DeliveryDate"],
                FirstName = FirstName,
                LastName = LastName,
                Company = Company,
                Country = Country,
                State = State,
                City = City,
                Zipcode = Zipcode,
                Address = Address,
                Address2 = Address2,
                PhoneNumber = PhoneNumber,
                OrderNotes = OrderNotes,
                recipientList = Emaillist.ToList(),
                qty = Emaillist.Length,
            };
            return View("ordermeta", model);
        }
        public ActionResult ordermeta(GiftCardModel model)
        {
            return View(model);
        }
        [HttpPost]
        public JsonResult GetNewOrderNo(OrderModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                OperatorModel om = CommanUtilities.Provider.GetCurrent();
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "employee_id", meta_value = om.UserID.ToString() });
                model.OrderPostMeta.Add(new OrderPostMetaModel() { post_id = 0, meta_key = "employee_name", meta_value = om.UserName.ToString() });

                JSONresult = GiftCardRepository.AddOrdersPost(model.OrderPostMeta).ToString();
            }
            catch { }
            return Json(new { status = true, message = JSONresult, url = "" }, 0);
        }
    }
}