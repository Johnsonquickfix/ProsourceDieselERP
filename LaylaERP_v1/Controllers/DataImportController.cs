﻿using LaylaERP.BAL;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using RestSharp.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class DataImportController : Controller
    {
        // GET: DataImport
        public ActionResult Index()
        {
            try
            {
                var result = string.Empty;
                var content = new StringContent("{}", Encoding.UTF8, "application/json");
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://quickfixtest2.com/exportdata.php");
                    client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                    var response = client.PostAsync("", content).Result;

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                }

                if (!string.IsNullOrEmpty(result))
                {
                    //var dyn = JsonConvert.DeserializeObject<dynamic>(result);
                    OrderRepository.ImportOrders(result);
                }
            }
            catch { }
            return View();
        }

        public ActionResult ExportData()
        {

            var result = string.Empty;
            try
            {
                Dictionary<string, Dictionary<string, object>> parentRow = new Dictionary<string, Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                DataTable dt = OrderRepository.ExportOrders();
                foreach (DataRow row in dt.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    //childRow.Add("id", row["id"]);
                    //childRow.Add("post_status", row["post_status"]);
                    //childRow.Add("post_date", row["post_date"]);
                    //childRow.Add("order_total", row["order_total"]);
                    //childRow.Add("shipstation_shipped_item_count", row["shipstation_shipped_item_count"]);

                    if (row["posts"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["posts"].ToString());
                        childRow.Add("posts", obj);
                    }
                    else
                        childRow.Add("posts", "{}");
                    if (row["post_meta"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["post_meta"].ToString());
                        childRow.Add("post_meta", obj);
                    }
                    else
                        childRow.Add("post_meta", "{}");
                    if (row["comments"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["comments"].ToString());
                        childRow.Add("comments", obj);
                    }
                    else
                        childRow.Add("comments", "{}");
                    if (row["woocommerce_order_items"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["woocommerce_order_items"].ToString());
                        childRow.Add("woocommerce_order_items", obj);
                    }
                    else
                        childRow.Add("woocommerce_order_items", "{}");
                    if (row["wc_order_stats"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["wc_order_stats"].ToString());
                        childRow.Add("wc_order_stats", obj);
                    }
                    else
                        childRow.Add("wc_order_stats", "{}");
                    if (row["wc_order_product_lookup"] != DBNull.Value)
                    {
                        dynamic obj = JsonConvert.DeserializeObject<dynamic>(row["wc_order_product_lookup"].ToString());
                        childRow.Add("wc_order_product_lookup", obj);
                    }
                    else
                        childRow.Add("wc_order_product_lookup", "{}");
                    parentRow.Add(row["id"].ToString(), childRow);
                }
                result = JsonConvert.SerializeObject(parentRow, Formatting.Indented);

                var content = new StringContent(result, Encoding.UTF8, "application/json");
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://quickfixtest2.com/erpdataimport.php");
                    client.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en_US"));

                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                    var response = client.PostAsync("", content).Result;

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        result = response.Content.ReadAsStringAsync().Result;
                    }
                }


            }
            catch { }
            return Content(result, ContentType.Json, Encoding.UTF8);
        }

        public ActionResult UpldateDataInMySQL()
        {

            var result = string.Empty;
            string _myConnString = System.Configuration.ConfigurationManager.ConnectionStrings["mysqlconstr"].ToString();
            MySqlConnection myConnection = new MySqlConnection(_myConnString);
            myConnection.Open();

            MySqlCommand myCommand = myConnection.CreateCommand();
            MySqlTransaction myTrans;

            // Start a local transaction
            myTrans = myConnection.BeginTransaction();
            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            myCommand.Connection = myConnection;
            myCommand.Transaction = myTrans;

            try
            {
                myCommand.CommandText = "insert into Test (id, desc) VALUES (100, 'Description')";
                myCommand.ExecuteNonQuery();
                myCommand.CommandText = "insert into Test (id, desc) VALUES (101, 'Description')";
                myCommand.ExecuteNonQuery();
                myTrans.Commit();
                Console.WriteLine("Both records are written to database.");
            }
            catch (Exception e)
            {
                try
                {
                    myTrans.Rollback();
                }
                catch (SqlException ex)
                {
                    if (myTrans.Connection != null)
                    {
                        Console.WriteLine("An exception of type " + ex.GetType() + " was encountered while attempting to roll back the transaction.");
                    }
                }

                Console.WriteLine("An exception of type " + e.GetType() + " was encountered while inserting the data.");
                Console.WriteLine("Neither record was written to database.");
            }
            finally
            {
                myConnection.Close();
            }
            return Content(result, ContentType.Json, Encoding.UTF8);
        }
    }
}