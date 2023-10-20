using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using LaylaERP_v1.BAL;
using LaylaERP_v1.Models.Product;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class QuickorderController : Controller
    {
        // GET: Quickorder
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ProductDetails(CartResponse objs, long product_id, long vendor_id)
        {            
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;  
                //if (!string.IsNullOrEmpty(model.strValue1))
                //    pid = Convert.ToInt64(model.strValue1);
                //if (!string.IsNullOrEmpty(model.strValue2))
                //    vid = Convert.ToInt64(model.strValue2);
                obj =  QuickorderRepository.ProductDetails(objs, product_id, vendor_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult getshipping(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0; 
                obj = QuickorderRepository.getshipping(objs, product_id, vendor_id, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult getshippingdetails(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.getshippingdetails(objs, product_id, vendor_id, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult addproduct(CartResponse objs, long product_id, long vendor_id, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.addproduct(objs, product_id, vendor_id, session_id);
            }
            catch(Exception ex)
            { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult getshippingmethod(string methodId, string methodTitle, decimal amount, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.getshippingmethod(methodId, methodTitle, amount, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult applycoupon(string code,  string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.applycoupon(code, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult deletecoupon(string code, string session_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj = QuickorderRepository.deletecoupon(code, session_id);
            }
            catch { }
            return Json(obj, 0);
        }
        [HttpPost]
        public JsonResult GetProductList(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = QuickorderRepository.GetProductList(model.strValue1,model.strValue2);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult paymentorder(CartPaymentController objs, long product_id, long vendor_id)
        {
            List<PurchaseOrderProductsModel> obj = new List<PurchaseOrderProductsModel>();
            try
            {
                long pid = 0, vid = 0;
                obj =  QuickorderRepository.paymentorder(objs, product_id, vendor_id);
            }
            catch { }
            return Json(obj, 0);
        }

    }
}