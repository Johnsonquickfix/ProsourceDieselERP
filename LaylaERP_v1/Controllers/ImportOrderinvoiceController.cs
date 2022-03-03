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
    public class ImportOrderinvoiceController : Controller
    {
        // GET: InportExcel
        public ActionResult Index()
        {
            return View();
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
    }
}
 