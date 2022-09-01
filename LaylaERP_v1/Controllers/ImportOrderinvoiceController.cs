using ExcelDataReader;
using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP_v1.BAL;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
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
    public class ImportOrderinvoiceController : Controller
    {
        // GET: InportExcel
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ImportOrderinvoice()
        {
            return View();
        }
        public ActionResult CompareSalesPO()
        {
            return View();
        }
        public ActionResult ImportBankcheckstatement()
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

        private List<ImportOrderinvoiceModel> GetDataFromPoExcelFile(Stream stream, string vendorid)
        {
            var poList = new List<ImportOrderinvoiceModel>();
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
                            poList.Add(new BAL.ImportOrderinvoiceModel()
                            {
                                document_id = objDataRow["Document"].ToString(),
                                doc_date = objDataRow["DocDate"].ToString(),
                                payer_id = objDataRow["Payer"].ToString(),
                                payer_name = objDataRow["Payer Name"].ToString(),
                                ref_doc = objDataRow["Ref doc"].ToString(),
                                sales_doc = objDataRow["Sales Doc"].ToString(),
                                item = objDataRow["Item"].ToString(),
                                material_number = objDataRow["Material"].ToString(),
                                material_description = objDataRow["Material Description"].ToString(),
                                pint = objDataRow["Plnt"].ToString(),
                                po_number = objDataRow["Purchase order number"].ToString(),
                                bol = objDataRow["BoL"].ToString(),
                                net_amount = objDataRow["Net amount"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Net amount"].ToString()) ? Convert.ToDecimal(objDataRow["Net amount"].ToString()) : 0) : 0,
                                freight_charge = objDataRow["Freight Ch"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Freight Ch"].ToString()) ? Convert.ToDecimal(objDataRow["Freight Ch"].ToString()) : 0) : 0,
                                sales_tax = objDataRow["Sales Tax"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Sales Tax"].ToString()) ? Convert.ToDecimal(objDataRow["Sales Tax"].ToString()) : 0) : 0,
                                total_amount = objDataRow["Total Amout"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Total Amout"].ToString()) ? Convert.ToDecimal(objDataRow["Total Amout"].ToString()) : 0) : 0,
                                cmir = objDataRow["CMIR"].ToString(),
                                tracking_number = objDataRow["Tracking N"].ToString(),
                                name = objDataRow["Name"].ToString(),
                                street = objDataRow["Street"].ToString(),
                                city = objDataRow["City"].ToString(),
                                state = objDataRow["State"].ToString(),
                                zipcode = objDataRow["Zipcode"].ToString(),
                                destination_country = objDataRow["Dest Coun"].ToString(),
                                cr_dr_memo_text = objDataRow["Credit Debit Memo Text"].ToString(),
                                vendor_id = vendorid,
                            });
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

                dt = SQLHelper.ExecuteDataTable("erp_import_commerce_purchase_order_invoice", parameters);
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
                DataTable dt = ImportOrderinvoiceRepository.GetImportPoList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetCompareSalesPO(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ImportOrderinvoiceRepository.GetCompareSalesPO(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }


        public JsonResult updateinvoice(JqDataTableModel model)
        {
            ImportOrderinvoiceRepository.updateinvoice(model.strValue1);
                
               // if (model.updatedID > 0)
                    return Json(new { status = true, message = "updated successfully!!", url = "" }, 0);
                //else
                //    return Json(new { status = true, message = "Product record updated successfully!!", url = "Manage" }, 0); 
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Index(HttpPostedFileBase postedFile,string vend)
        {
            string filePath = string.Empty;
            DataTable dt = new DataTable();
            if (postedFile != null)
            {
                string path = Server.MapPath("~/Uploads/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                filePath = path + Path.GetFileName(postedFile.FileName);
                string extension = Path.GetExtension(postedFile.FileName);
                postedFile.SaveAs(filePath);

                string conString = string.Empty;
                switch (extension)
                {
                    case ".xls": //Excel 97-03.
                        conString = ConfigurationManager.ConnectionStrings["Excel03ConString"].ConnectionString;
                        break;
                    case ".xlsx": //Excel 07 and above.
                        conString = ConfigurationManager.ConnectionStrings["Excel07ConString"].ConnectionString;
                        break;
                }

              
                conString = string.Format(conString, filePath);

                using (OleDbConnection connExcel = new OleDbConnection(conString))
                {
                    using (OleDbCommand cmdExcel = new OleDbCommand())
                    {
                        using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                        {
                            cmdExcel.Connection = connExcel;

                            //Get the name of First Sheet.
                            connExcel.Open();
                            DataTable dtExcelSchema;
                            dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                            string sheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                            connExcel.Close();

                            //Read Data from First Sheet.
                            connExcel.Open();
                            cmdExcel.CommandText = "SELECT * From [" + sheetName + "]";
                            odaExcel.SelectCommand = cmdExcel;
                            odaExcel.Fill(dt);
                            connExcel.Close(); 
                           
                        }
                    }
                }

                conString = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
                using (SqlConnection con = new SqlConnection(conString))
                {
                    using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(con))
                    {
                        //Set the database table name.
                        sqlBulkCopy.DestinationTableName = "dbo.commerce_purchase_order_invoice_import";

                        //[OPTIONAL]: Map the Excel columns with that of the database table
                        sqlBulkCopy.ColumnMappings.Add("Document", "document_id");
                        sqlBulkCopy.ColumnMappings.Add("DocDate", "doc_date");
                        sqlBulkCopy.ColumnMappings.Add("Payer", "payer_id");
                        sqlBulkCopy.ColumnMappings.Add("Payernam", "payer_name");
                        sqlBulkCopy.ColumnMappings.Add("Refdoc", "ref_doc");
                        sqlBulkCopy.ColumnMappings.Add("SalesDoc", "sales_doc");
                        sqlBulkCopy.ColumnMappings.Add("Item", "item");
                        sqlBulkCopy.ColumnMappings.Add("Material", "material_number");
                        sqlBulkCopy.ColumnMappings.Add("MaterialDescription", "material_description");
                        sqlBulkCopy.ColumnMappings.Add("Plnt", "pint");
                        sqlBulkCopy.ColumnMappings.Add("Purchaseordernumber", "po_number");
                        sqlBulkCopy.ColumnMappings.Add("BoL", "bol");
                        sqlBulkCopy.ColumnMappings.Add("Netamount", "net_amount");
                        sqlBulkCopy.ColumnMappings.Add("FreightCh", "freight_charge");
                        sqlBulkCopy.ColumnMappings.Add("SalesTax", "sales_tax");
                        sqlBulkCopy.ColumnMappings.Add("TotalAmout", "total_amount");
                        sqlBulkCopy.ColumnMappings.Add("CMIR", "cmir");
                        sqlBulkCopy.ColumnMappings.Add("TrackingN", "tracking_number");
                        sqlBulkCopy.ColumnMappings.Add("Name", "name");
                        sqlBulkCopy.ColumnMappings.Add("Street", "street");
                        sqlBulkCopy.ColumnMappings.Add("City", "city");
                        sqlBulkCopy.ColumnMappings.Add("State", "state");
                        sqlBulkCopy.ColumnMappings.Add("Zipcode", "zipcode");
                        sqlBulkCopy.ColumnMappings.Add("DestCoun", "destination_country");
                        sqlBulkCopy.ColumnMappings.Add("CreditDebitMemoText", "cr_dr_memo_text");


                        con.Open();
                        sqlBulkCopy.WriteToServer(dt);
                        con.Close();
                    }
                }

                //if (ModelState.IsValid)
                //{

                //    if (postedFile != null && postedFile.ContentLength > 0)
                //    {
                //        // ExcelDataReader works with the binary Excel file, so it needs a FileStream
                //        // to get started. This is how we avoid dependencies on ACE or Interop:
                //        Stream stream = postedFile.InputStream;

                //        // We return the interface, so that
                //        IExcelDataReader reader = null;


                //        if (postedFile.FileName.EndsWith(".xls"))
                //        {
                //            reader = ExcelReaderFactory.CreateBinaryReader(stream);
                //        }
                //        else if (postedFile.FileName.EndsWith(".xlsx"))
                //        {
                //            reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                //        }
                //        else
                //        {
                //            ModelState.AddModelError("File", "This file format is not supported");
                //            return View();
                //        }

                //        reader.IsFirstRowAsColumnNames = true;

                //        DataSet result = reader.AsDataSet();
                //        reader.Close();

                //        return View(result.Tables[0]);
                //    }
                //    else
                //    {
                //        ModelState.AddModelError("File", "Please Upload Your file");
                //    }
                //}
            }

            //return View(dt);
            return View();
        }

        ///Order Affirm Imort
        [HttpPost]
        [ActionName("uploadaffirmfile")]
        public ActionResult ImportaffirmFile(HttpPostedFileBase importFile, string vendorid)
        {
            if (importFile == null) return Json(new { Status = 0, Message = "No File Selected" });
            long size = importFile.ContentLength;
            string fileType = Path.GetExtension(importFile.FileName);
            if (size < 2097152)
            {
                try
                {
                    var fileData = GetDataFromaffirmExcelFile(importFile.InputStream, vendorid);
                    XmlDocument xmlDoc = CommonClass.ToXml(fileData);
                    var dt = UploadaffirmXMLData("IDEST", xmlDoc);
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
        private List<ImportOrderaffirmModel> GetDataFromaffirmExcelFile(Stream stream, string vendorid)
        {
            var poList = new List<ImportOrderaffirmModel>();
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
                            poList.Add(new BAL.ImportOrderaffirmModel()
                            {
                                order_id = objDataRow["order_id"].ToString(),
                                transaction_id = objDataRow["transaction_id"].ToString(),
                                charge_created_date = objDataRow["charge_created_date"].ToString(),
                                event_type = objDataRow["event_type"].ToString(),
                                charge_id = objDataRow["charge_id"].ToString(), 
                                total_settled = objDataRow["total_settled"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["total_settled"].ToString()) ? Convert.ToDecimal(objDataRow["total_settled"].ToString()) : 0) : 0,
                                fees = objDataRow["fees"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["fees"].ToString()) ? Convert.ToDecimal(objDataRow["fees"].ToString()) : 0) : 0,
                            });
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
        public static DataTable UploadaffirmXMLData(string qFlag, XmlDocument xmlList)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@detailsXML ",xmlList.OuterXml),
                    new SqlParameter("@QFlag",qFlag)
                };

                dt = SQLHelper.ExecuteDataTable("erp_import_affirm_order", parameters);
            }
            catch (SqlException ex)
            { throw ex; }
            return dt;
        }

        public JsonResult GetBankcheckList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = ImportOrderinvoiceRepository.GetBankcheckList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        [ActionName("checkuploadfile")]
        public ActionResult ImportcheckFile(HttpPostedFileBase importFile, string bankidid)
        {
            if (importFile == null) return Json(new { Status = 0, Message = "No File Selected" });
            long size = importFile.ContentLength;
            string fileType = Path.GetExtension(importFile.FileName);
            if (size < 2097152)
            {
                try
                {
                    var fileData = GetDataFromcheckExcelFile(importFile.InputStream, bankidid);
                    XmlDocument xmlDoc = CommonClass.ToXml(fileData);
                    var dt = UploadCheckXMLData("IDEST", xmlDoc);
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

        private List<ImportOrderinvoiceModel> GetDataFromcheckExcelFile(Stream stream,string bankidid)
        {
            var poList = new List<ImportOrderinvoiceModel>();
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
                            poList.Add(new BAL.ImportOrderinvoiceModel()
                            {
                                document_id = objDataRow["Check No"].ToString(),
                                payer_id = bankidid,
                                doc_date = objDataRow["Clear Date"].ToString(), 
                                net_amount = objDataRow["Check Amount"] != DBNull.Value ? (!string.IsNullOrEmpty(objDataRow["Check Amount"].ToString()) ? Convert.ToDecimal(objDataRow["Check Amount"].ToString()) : 0) : 0,
                                
                            });
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

        public static DataTable UploadCheckXMLData(string qFlag, XmlDocument xmlList)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@detailsXML ",xmlList.OuterXml),
                    new SqlParameter("@QFlag",qFlag)
                };

                dt = SQLHelper.ExecuteDataTable("erp_import_check_iud", parameters);
            }
            catch (SqlException ex)
            { throw ex; }
            return dt;
        }

        public JsonResult Verifycheck(JqDataTableModel model)
        {
            DateTime? fromdate = null, todate = null;
            if (!string.IsNullOrEmpty(model.strValue2))
                fromdate = Convert.ToDateTime(model.strValue2);
            if (!string.IsNullOrEmpty(model.strValue3))
                todate = Convert.ToDateTime(model.strValue3);
            ImportOrderinvoiceRepository.Verifycheck(model.strValue1, fromdate, todate);

            // if (model.updatedID > 0)
            return Json(new { status = true, message = "updated successfully!!", url = "" }, 0);
            //else
            //    return Json(new { status = true, message = "Product record updated successfully!!", url = "Manage" }, 0); 
        }

    }
}
 