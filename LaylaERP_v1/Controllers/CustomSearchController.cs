using ClosedXML.Excel;
using LaylaERP.BAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class CustomSearchController : Controller
    {
        [Route("customsearch/ordersearch")]
        public ActionResult OrderSearch()
        {
            return View();
        }
        [HttpGet, Route("customsearch/filtermasters")]
        public JsonResult GetFilterMasters(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                string flag = "MASTER";
                if (model.strValue1 == "ORDER") flag = "ORDERMASTER";
                else if (model.strValue1 == "QUOTE") flag = "QUOTEMASTER";
                else if (model.strValue1 == "JOURNAL") flag = "JOURNALMASTER";
                result = JsonConvert.SerializeObject(CustomSearchRepository.GetFilterMasters(flag), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost, Route("customsearch/order-list")]
        public JsonResult GetOrderList(CustomSearchModel model)
        {
            string result = string.Empty;
            try
            {
                result = JsonConvert.SerializeObject(CustomSearchRepository.GetOrderList(model), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost, Route("customsearch/order-list-export")]
        public ActionResult ExportOrderList(CustomSearchModel model)
        {
            string fileName = String.Format("Order_List_{0}.xlsx", DateTime.Now.ToString("dd_MMMM_yyyy_hh_mm_tt"));
            try
            {
                DataTable dt = CustomSearchRepository.GetOrderList(model);
                dt.TableName = "Order_List";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    dt.Columns.Remove("total_count");
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    //var ws = wb.Worksheets.Add("Orders");
                    var ws = wb.Worksheets.Add(dt);
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }

        #region [Quote Order custom reports]
        [Route("customsearch/quoteordersearch")]
        public ActionResult QuoteOrderSearch()
        {
            return View();
        }
        [HttpPost, Route("customsearch/quoteorder-list")]
        public JsonResult GetQuoteOrderList(CustomSearchModel model)
        {
            string result = string.Empty;
            try
            {
                result = JsonConvert.SerializeObject(CustomSearchRepository.GetQuoteOrderList(model), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost, Route("customsearch/quoteorder-list-export")]
        public ActionResult ExportQuoteOrderList(CustomSearchModel model)
        {
            string fileName = String.Format("QuoteOrder_List_{0}.xlsx", DateTime.Now.ToString("dd_MMMM_yyyy_hh_mm_tt"));
            try
            {
                DataTable dt = CustomSearchRepository.GetQuoteOrderList(model);
                dt.TableName = "QuoteOrder_List";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    dt.Columns.Remove("total_count");
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    //var ws = wb.Worksheets.Add("Orders");
                    var ws = wb.Worksheets.Add(dt);
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region [Account Journals custom reports]
        [Route("customsearch/journalscustomreport")]
        public ActionResult JournalsCustomReport()
        {
            return View();
        }
        [HttpPost, Route("customsearch/journals-list")]
        public JsonResult GetJournalsList(CustomSearchModel model)
        {
            string result = string.Empty;
            try
            {
                result = JsonConvert.SerializeObject(CustomSearchRepository.GetJournalsList(model), Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpPost, Route("customsearch/journals-list-export")]
        public ActionResult ExportQuotejournalsList(CustomSearchModel model)
        {
            string fileName = String.Format("Journal_{0}.xlsx", DateTime.Now.ToString("dd_MMMM_yyyy_hh_mm_tt"));
            try
            {
                DataTable dt = CustomSearchRepository.GetJournalsList(model);
                dt.TableName = "Journal";
                using (XLWorkbook wb = new XLWorkbook())
                {
                    dt.Columns.Remove("total_count");
                    //Add DataTable in worksheet  
                    //wb.Worksheets.Add(dt);
                    //var ws = wb.Worksheets.Add("Orders");
                    var ws = wb.Worksheets.Add(dt);
                    ws.Columns().AdjustToContents();  // Adjust column width
                    ws.Rows().AdjustToContents();     // Adjust row heights
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/ms-excel", fileName);
                    }
                }
                //result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch (Exception ex) { throw ex; }
            //return Json(robj, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}