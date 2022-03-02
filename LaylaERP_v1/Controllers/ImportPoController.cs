using ExcelDataReader;
using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP_v1.BAL;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Serialization;
using System.Xml.XPath;

namespace LaylaERP_v1.Controllers
{
    public class ImportPoController : Controller
    {
        // GET: ImportPo 
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ImportPo()
        {
            return View();
        }
        [HttpPost]
        [ActionName("uploadpofile")]
        public ActionResult ImportPoFile(HttpPostedFileBase importFile, string vendorid)
        {
            if (importFile == null) return Json(new { Status = 0, Message = "No File Selected" });
            long size = importFile.ContentLength;
            string fileType = Path.GetExtension(importFile.FileName);
            if (size < 2097152)
            {
                try
                {
                    var fileData = GetDataFromPoExcelFile(importFile.InputStream, vendorid);
                    XmlDocument xmlDoc = CommonClass.ToXml(fileData);
                    var dt = UploadXMLData("IDEST", xmlDoc);
                    if (dt.Rows.Count > 0)
                    {
                        if (dt.Rows[0]["Response"].ToString().Contains("Success"))
                            return Json(new { Status = 1, Message = "Data Imported Successfully. " });
                        else
                            return Json(new { Status = 0, Message = "Excel invalid data format. " });
                    }
                    return Json(new { Status = 0, Message = "Excel invalid data format. " });
                }
                catch (Exception ex)
                {
                    return Json(new { Status = 0, Message = ex.Message });
                }
            }
            else { return Json(new { Status = 0, Message = "Not excel file or size of file is larger than 2MB" }); }
        }

        private List<ImportPoModel> GetDataFromPoExcelFile(Stream stream, string vendorid)
        {
            var poList = new List<ImportPoModel>();
            try
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    var dataSet = reader.AsDataSet(new ExcelDataSetConfiguration
                    {
                        UseColumnDataType = false,
                        ConfigureDataTable = delegate { return new ExcelDataTableConfiguration { UseHeaderRow = true }; }
                    });

                    if (dataSet.Tables.Count > 0)
                    {
                        var dataTable = dataSet.Tables[0];
                        foreach (DataRow objDataRow in dataTable.Rows)
                        {
                            if (objDataRow.ItemArray.All(x => string.IsNullOrEmpty(x?.ToString()))) continue;
                            poList.Add(new BAL.ImportPoModel()
                            {
                                po_date = objDataRow["Date"].ToString(),
                                po_invoice_number = objDataRow["Invoice"].ToString(),
                                customer_requisition = objDataRow["Customer requisition"].ToString(),
                                po_due_date = objDataRow["Due date"].ToString(),
                                po_currency = objDataRow["Currency"].ToString(),
                                original_invoice_amt = objDataRow["Original Invoice Amount"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Original Invoice Amount"].ToString()) ? Convert.ToDecimal(objDataRow["Original Invoice Amount"].ToString()) : 0) : 0,
                                remain_invoice_amt = objDataRow["Remaining Invoice Amount"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Remaining Invoice Amount"].ToString()) ? Convert.ToDecimal(objDataRow["Remaining Invoice Amount"].ToString()) : 0) : 0,
                                vendor_id = vendorid,
                            }) ; 
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return poList;
        }

        public class CommonClass
        {
            public static XmlDocument ToXml<T>(List<T> _ListObj)
            {
                XmlDocument xmlDoc = new XmlDocument();
                XPathNavigator nav = xmlDoc.CreateNavigator();
                using (XmlWriter writer = nav.AppendChild())
                {
                    XmlSerializer ser = new XmlSerializer(typeof(List<T>), new XmlRootAttribute("BulkData"));
                    ser.Serialize(writer, _ListObj);
                }
                return xmlDoc;
            }
        }
        public static DataTable UploadXMLData(string qFlag, XmlDocument xmlList)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@detailsXML ",xmlList.OuterXml),
                    new SqlParameter("@QFlag",qFlag)
                };

                dt = SQLHelper.ExecuteDataTable("erp_commerce_purchase_order_invoice_import", parameters);
            }
            catch (SqlException ex)
            { throw ex; }
            return dt;
        }

        public JsonResult GetImportPolList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ImportPoRepository.GetImportPoList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
    }
}