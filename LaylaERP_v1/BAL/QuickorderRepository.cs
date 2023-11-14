using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using LaylaERP_v1.BAL;
using LaylaERP_v1.Models.Product;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq; 
using LaylaERP.UTILITIES.BoxPacker; 
using Newtonsoft.Json;
using Newtonsoft.Json.Linq; 
using System.Dynamic;
using System.Net.Http;
using System.Text;
using System.Net;

namespace LaylaERP.BAL
{
    public class QuickorderRepository
    {
        public static List<PurchaseOrderProductsModel> ProductDetails(CartResponse obj, long product_id, long vendor_id)
        {
           
            //TaxJarModel _tax = new TaxJarModel();
            //if (obj.data.shipping_address != null)
            //{
            //    _tax.to_street = obj.data.shipping_address.address_1;
            //    _tax.to_city = obj.data.shipping_address.city;
            //    _tax.to_state = obj.data.shipping_address.state;
            //    _tax.to_zip = obj.data.shipping_address.postcode;
            //    _tax.to_country = obj.data.shipping_address.country;
            //    _tax.amount = 100;
            //    if (!string.IsNullOrEmpty(obj.data.shipping_address.address_1) && !string.IsNullOrEmpty(obj.data.shipping_address.city) && !string.IsNullOrEmpty(obj.data.shipping_address.state) && !string.IsNullOrEmpty(obj.data.shipping_address.postcode) && !string.IsNullOrEmpty(obj.data.shipping_address.country))
            //        _tax = GetTaxAmounts(_tax);
            //    else _tax = new TaxJarModel { order_total_amount = 0, taxable_amount = 0, amount_to_collect = 0, rate = 0, freight_taxable = false };
            //   //_tax.rate = 10;
            //}
            //dynamic data = LaylaERP_v1.Controllers.CartApiController.CalculateTotals(obj, true);

            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();
            try
            {
                PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                SqlParameter[] parameters =
               {
                    new SqlParameter("@Flag", "PRDPRC"),new SqlParameter("@id",product_id),new SqlParameter("@userid", vendor_id)
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("erp_purchase_order_search", parameters);
                while (sdr.Read())
                {
                    productsModel = new PurchaseOrderProductsModel();
                    if (sdr["id"] != DBNull.Value)
                        productsModel.fk_product = Convert.ToInt64(sdr["id"]);
                    else
                        productsModel.fk_product = 0;
                    if (sdr["post_title"] != DBNull.Value)
                        productsModel.description = sdr["post_title"].ToString();
                    else
                        productsModel.description = string.Empty;
                    if (sdr["sku"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sku"].ToString().Trim()))
                        productsModel.product_sku = sdr["sku"].ToString();
                    else
                        productsModel.product_sku = string.Empty;
                    if (sdr["purchase_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["purchase_price"].ToString().Trim()))
                        productsModel.subprice = decimal.Parse(sdr["purchase_price"].ToString().Trim());
                    else
                        productsModel.subprice = 0;
                    if (sdr["salestax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["salestax"].ToString().Trim()))
                        productsModel.localtax1_tx = decimal.Parse("0");
                    else
                        productsModel.localtax1_tx = 0;
                    productsModel.localtax1_type = "F";
                    if (sdr["shipping_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["shipping_price"].ToString().Trim()))
                        productsModel.localtax2_tx = decimal.Parse(sdr["shipping_price"].ToString().Trim());
                    else
                        productsModel.localtax2_tx = 0;
                    productsModel.localtax2_type = "F";
                    if (sdr["discount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount"].ToString().Trim()))
                        productsModel.discount_percent = decimal.Parse(sdr["discount"].ToString().Trim());
                    else
                        productsModel.discount_percent = 0;
                    if (sdr["qty"] != DBNull.Value)
                        productsModel.qty = decimal.Parse(sdr["qty"].ToString().Trim());
                    else
                        productsModel.qty = 1;
                    productsModel.total_ht = productsModel.localtax1_tx * productsModel.qty;
                    //productsModel.discount = productsModel.total_ht * (productsModel.discount_percent / 100);
                    //productsModel.total_localtax1 = productsModel.localtax1_tx * productsModel.qty;
                    //productsModel.total_localtax2 = productsModel.localtax2_tx * productsModel.qty;
                    productsModel.total_ttc = productsModel.total_ht - productsModel.discount + productsModel.total_localtax1 + productsModel.total_localtax2;
                    //if (sdr["free_itmes"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["free_itmes"].ToString().Trim()))
                    //    productsModel.free_itmes = sdr["free_itmes"].ToString().Trim();
                    //else
                    //    productsModel.free_itmes = "{}";
                    //if (sdr["is_free"] != DBNull.Value)
                    //    productsModel.is_free = Convert.ToBoolean(sdr["is_free"].ToString());
                    //else
                    //    productsModel.is_free = false;
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<Ordershipping> getdetail(CartResponse obj, long product_id, long vendor_id)
        {
            List<Ordershipping> shippingList = new List<Ordershipping>();

            if (obj != null && obj.data != null && obj.data.items != null)
            {
                foreach (var item in obj.data.items)
                {
                    // Create an Ordershipping object for each item
                    Ordershipping shipping = new Ordershipping
                    {
                        id = item.id,
                        quantity = item.quantity,
                        variation_id = item.variation_id
                        // Add other properties from the item as needed
                    };

                    // Add the Ordershipping object to the list
                    shippingList.Add(shipping);
                }
            }

            return shippingList;
        }

        public static List<PurchaseOrderProductsModel> addproduct(CartResponse obj, long product_id, long vendor_id, string session_id)
        {
             
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/items/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));

            if (!string.IsNullOrEmpty(session_id) || session_id.Trim() != "0")
            {
            }
            else
                request.Headers.Add("X-Cart-Session-Id", session_id);
            List<Ordershipping> shippingData = getdetail(obj, 1, 1);
            // Serialize the list to JSON
            string json = JsonConvert.SerializeObject(shippingData);
            // Serialize the dynamicData array to a JSON string
            var content = new StringContent(json, null, "application/json");
            request.Content = content;
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            HttpResponseMessage response = client.SendAsync(request).Result; // Block and wait 
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {
                if (response.IsSuccessStatusCode)
                {
                    // Handle a successful response here
                    string responseContent = response.Content.ReadAsStringAsync().Result;
                    PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                    dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);
                    productsModel.product_sku = jsonResponse.data.session_id; 
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<PurchaseOrderProductsModel> addproductitem(CartResponse obj, long product_id, long vendor_id, string session_id)
        {

            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/items/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));

            if (string.IsNullOrEmpty(session_id) || session_id.Trim() == "0")
            {
            }
            else
                request.Headers.Add("X-Cart-Session-Id", session_id);
            List<Ordershipping> shippingData = getdetail(obj, 1, 1);
            // Serialize the list to JSON
            string json = JsonConvert.SerializeObject(shippingData);
            // Serialize the dynamicData array to a JSON string
            var content = new StringContent(json, null, "application/json");
            request.Content = content;
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            HttpResponseMessage response = client.SendAsync(request).Result; // Block and wait 
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {
                if (response.IsSuccessStatusCode)
                {
                    // Handle a successful response here
                    string responseContent = response.Content.ReadAsStringAsync().Result;
                    PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                    dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);
                    productsModel.product_sku = jsonResponse.data.session_id;
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }


        public static List<PurchaseOrderProductsModel> getshipping(CartResponse obj, long product_id, long vendor_id, string session_id)
        {
            var client = new HttpClient();
           // var request = new HttpRequestMessage(HttpMethod.Post, "https://erp.prosourcediesel.com/cartapi/items/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false");
            var request = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/items/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));

            if (string.IsNullOrEmpty(session_id) || session_id.Trim() == "0")
            {
            }
            else 
                request.Headers.Add("X-Cart-Session-Id", session_id);
            List<Ordershipping> shippingData = getdetail(obj, 1,1); 
            // Serialize the list to JSON
            string json = JsonConvert.SerializeObject(shippingData); 
            // Serialize the dynamicData array to a JSON string
            var content = new StringContent(json, null, "application/json");
            request.Content = content;
            HttpResponseMessage response = client.SendAsync(request).Result; // Block and wait 
             List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {
                if (response.IsSuccessStatusCode)
                {
                    // Handle a successful response here
                    string responseContent = response.Content.ReadAsStringAsync().Result; 
                    PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                    dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);  
                    productsModel.product_sku = jsonResponse.data.session_id;
                    if (!string.IsNullOrEmpty(productsModel.product_sku))
                    {
                        //var requesttax = new HttpRequestMessage(HttpMethod.Post, "https://erp.prosourcediesel.com/cartapi/updateshipping/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false");
                        var requesttax = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/updateshipping/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));

                        requesttax.Headers.Add("X-Cart-Session-Id", productsModel.product_sku);
                        //var contenttax = new StringContent("{\n    \"first_name\": \"David\",      \n    \"last_name\": \"G\",\n    \"email\": \"david.quickfix1@gmail.com\",\n    \"company\": \"\",\n    \"phone\": \"(012) 345-6789\",\n    \"address_1\": \"street 101\",\n    \"address_2\": \"\",\n     \"city\": \"NEW YORK\",\n     \"state\": \"NY\",\n     \"postcode\": 10001,\n     \"country\": \"US\" \n}", null, "application/json");
                        CartShippingAddressRequest shipping = new CartShippingAddressRequest
                        {
                            first_name = obj.data.shipping_address.first_name,
                            last_name = obj.data.shipping_address.last_name,
                            company = obj.data.shipping_address.company,
                            address_1 = obj.data.shipping_address.address_1,
                            address_2 = obj.data.shipping_address.address_2,
                            city = obj.data.shipping_address.city,
                            state = obj.data.shipping_address.state,
                            postcode = obj.data.shipping_address.postcode,
                            country = obj.data.shipping_address.country
                        };
                        // Serialize the CartShippingAddressRequest object to JSON
                        string shippingJson = JsonConvert.SerializeObject(shipping);
                        // Create a StringContent with the JSON data
                        var contenttax = new StringContent(shippingJson, Encoding.UTF8, "application/json");
                        requesttax.Content = contenttax;
                        HttpResponseMessage responsetax = client.SendAsync(requesttax).Result; // Block and wait 
                        if (responsetax.IsSuccessStatusCode)
                        {
                            string responseContenttax = responsetax.Content.ReadAsStringAsync().Result;
                            //PurchaseOrderProductsModel productsModeltax = new PurchaseOrderProductsModel();
                            dynamic jsonResponsetotal = JsonConvert.DeserializeObject(responseContenttax);

                            var shippingMethodsArray = jsonResponsetotal.data.shipping_methods.ToObject<List<ShippingMethods>>();
                            productsModel.ShippingMethods = shippingMethodsArray;


                            //// Check if "shipping_methods" is an array or a single object
                            //if (jsonResponsetotal.data.shipping_methods is JArray)
                            //{
                            //    // "shipping_methods" is an array with multiple methods
                            //    var shippingMethodsArray = jsonResponsetotal.data.shipping_methods.ToObject<List<ShippingMethods>>();

                            //    foreach (var method in shippingMethodsArray)
                            //    {
                            //        // Access and process each shipping method
                            //        var methodId = method.method_id;
                            //        var methodTitle = method.method_title;
                            //        var amount = method.amount;
                            //        var isActive = method.isactive;

                            //        // Perform actions with each shipping method
                            //    }
                            //}
                            //else if (jsonResponsetotal.data.shipping_methods is JObject)
                            //{
                            //    // "shipping_methods" is a single object (not an array)
                            //    var singleShippingMethod = jsonResponsetotal.data.shipping_methods.ToObject<ShippingMethods>();

                            //    // Access and process the single shipping method
                            //    var methodId = singleShippingMethod.method_id;
                            //    var methodTitle = singleShippingMethod.method_title;
                            //    var amount = singleShippingMethod.amount;
                            //    var isActive = singleShippingMethod.isactive;

                            //    // Perform actions with the single shipping method
                            //}


                            productsModel.subprice = jsonResponsetotal.data.cart_totals.subtotal;
                            productsModel.total_localtax1 = jsonResponsetotal.data.cart_totals.subtotal_tax;
                            productsModel.total_localtax2 = jsonResponsetotal.data.cart_totals.shipping_total;
                            productsModel.localtax1_tx = jsonResponsetotal.data.cart_totals.shipping_tax;
                            productsModel.total_ttc = jsonResponsetotal.data.cart_totals.total;
                            productsModel.discount = jsonResponsetotal.data.cart_totals.discount_total;
                        }
                    }

                    _list.Add(productsModel);
                }
                }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<PurchaseOrderProductsModel> getshippingdetails(CartResponse obj, long product_id, long vendor_id, string session_id)
        {
            var client = new HttpClient();
            //var request = new HttpRequestMessage(HttpMethod.Post, "https://erp.prosourcediesel.com/cartapi/items/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false");

            //if (string.IsNullOrEmpty(session_id) || session_id.Trim() == "0")
            //{
            //}
            //else
            //    request.Headers.Add("X-Cart-Session-Id", session_id);
            //List<Ordershipping> shippingData = getdetail(obj, 1, 1);
            //// Serialize the list to JSON
            //string json = JsonConvert.SerializeObject(shippingData);
            //// Serialize the dynamicData array to a JSON string
            //var content = new StringContent(json, null, "application/json");
            //request.Content = content;
            //HttpResponseMessage response = client.SendAsync(request).Result; // Block and wait 
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {
                
                    // Handle a successful response here
                    //string responseContent = response.Content.ReadAsStringAsync().Result;
                    PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                    //dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);
                    productsModel.product_sku = session_id;
                    if (!string.IsNullOrEmpty(productsModel.product_sku))
                    {

                   
                    var requesttax = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/updateshipping/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));
                 //var requesttax = new HttpRequestMessage(HttpMethod.Post, "https://erp.prosourcediesel.com/cartapi/updateshipping/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false");
                        requesttax.Headers.Add("X-Cart-Session-Id", productsModel.product_sku);
                        //var contenttax = new StringContent("{\n    \"first_name\": \"David\",      \n    \"last_name\": \"G\",\n    \"email\": \"david.quickfix1@gmail.com\",\n    \"company\": \"\",\n    \"phone\": \"(012) 345-6789\",\n    \"address_1\": \"street 101\",\n    \"address_2\": \"\",\n     \"city\": \"NEW YORK\",\n     \"state\": \"NY\",\n     \"postcode\": 10001,\n     \"country\": \"US\" \n}", null, "application/json");
                        CartShippingAddressRequest shipping = new CartShippingAddressRequest
                        {
                            first_name = obj.data.shipping_address.first_name,
                            last_name = obj.data.shipping_address.last_name,
                            company = obj.data.shipping_address.company,
                            address_1 = obj.data.shipping_address.address_1,
                            address_2 = obj.data.shipping_address.address_2,
                            city = obj.data.shipping_address.city,
                            state = obj.data.shipping_address.state,
                            postcode = obj.data.shipping_address.postcode,
                            country = obj.data.shipping_address.country
                        };
                        // Serialize the CartShippingAddressRequest object to JSON
                        string shippingJson = JsonConvert.SerializeObject(shipping);
                        // Create a StringContent with the JSON data
                        var contenttax = new StringContent(shippingJson, Encoding.UTF8, "application/json");
                        requesttax.Content = contenttax;
                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                    HttpResponseMessage responsetax = client.SendAsync(requesttax).Result; // Block and wait 
                        if (responsetax.IsSuccessStatusCode)
                        {
                            string responseContenttax = responsetax.Content.ReadAsStringAsync().Result;
                            //PurchaseOrderProductsModel productsModeltax = new PurchaseOrderProductsModel();
                            dynamic jsonResponsetotal = JsonConvert.DeserializeObject(responseContenttax);

                            var shippingMethodsArray = jsonResponsetotal.data.shipping_methods.ToObject<List<ShippingMethods>>();
                            productsModel.ShippingMethods = shippingMethodsArray;
 
                            productsModel.subprice = jsonResponsetotal.data.cart_totals.subtotal;
                            productsModel.total_localtax1 = jsonResponsetotal.data.cart_totals.subtotal_tax;
                            productsModel.total_localtax2 = jsonResponsetotal.data.cart_totals.shipping_total;
                            productsModel.localtax1_tx = jsonResponsetotal.data.cart_totals.shipping_tax;
                            productsModel.total_ttc = jsonResponsetotal.data.cart_totals.total;
                            productsModel.discount = jsonResponsetotal.data.cart_totals.discount_total;
                        }
                    }

                    _list.Add(productsModel);
               //}
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<PurchaseOrderProductsModel> getshippingmethod(string method_id, string method_title, decimal amount, string session_id)
        {
            var client = new HttpClient(); 
            PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {
                
                    if (!string.IsNullOrEmpty(session_id))
                    {
                    var requesttax = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/shippingmethod/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false"));


                    //var requesttax = new HttpRequestMessage(HttpMethod.Post, "https://erp.prosourcediesel.com/cartapi/shippingmethod/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?checkout=false");
                        requesttax.Headers.Add("X-Cart-Session-Id", session_id);
                    //var contenttax = new StringContent("{\n    \"first_name\": \"David\",      \n    \"last_name\": \"G\",\n    \"email\": \"david.quickfix1@gmail.com\",\n    \"company\": \"\",\n    \"phone\": \"(012) 345-6789\",\n    \"address_1\": \"street 101\",\n    \"address_2\": \"\",\n     \"city\": \"NEW YORK\",\n     \"state\": \"NY\",\n     \"postcode\": 10001,\n     \"country\": \"US\" \n}", null, "application/json");
                    ShippingMethods shipping = new ShippingMethods
                    {
                            method_id = method_id,
                            method_title = method_title,
                            amount = amount,
                            isactive = true, 
                        };
                        // Serialize the CartShippingAddressRequest object to JSON
                        string shippingJson = JsonConvert.SerializeObject(shipping);
                        // Create a StringContent with the JSON data
                        var contenttax = new StringContent(shippingJson, Encoding.UTF8, "application/json");
                        requesttax.Content = contenttax;
                        HttpResponseMessage responsetax = client.SendAsync(requesttax).Result; // Block and wait 
                        if (responsetax.IsSuccessStatusCode)
                        {
                            string responseContenttax = responsetax.Content.ReadAsStringAsync().Result;
                            //PurchaseOrderProductsModel productsModeltax = new PurchaseOrderProductsModel();
                            dynamic jsonResponsetotal = JsonConvert.DeserializeObject(responseContenttax); 
                            //var shippingMethodsArray = jsonResponsetotal.data.shipping_methods.ToObject<List<ShippingMethods>>();
                            productsModel.subprice = jsonResponsetotal.data.cart_totals.subtotal;
                            productsModel.total_localtax1 = jsonResponsetotal.data.cart_totals.subtotal_tax;
                            productsModel.total_localtax2 = jsonResponsetotal.data.cart_totals.shipping_total;
                            productsModel.localtax1_tx = jsonResponsetotal.data.cart_totals.shipping_tax;
                            productsModel.total_ttc = jsonResponsetotal.data.cart_totals.total;
                            productsModel.discount = jsonResponsetotal.data.cart_totals.discount_total;
                    }
                    }

                    _list.Add(productsModel);
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }

        public static List<PurchaseOrderProductsModel> applycoupon(string code, string session_id)
        {
            var client = new HttpClient();
            PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {

                if (!string.IsNullOrEmpty(session_id))
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/applyCoupon/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?code=" + code + ""));

                    //var request = new HttpRequestMessage(HttpMethod.Get, "https://erp.prosourcediesel.com/cartapi/applyCoupon/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?code=" + code + "");
                    request.Headers.Add("X-Cart-Session-Id", session_id);
                    request.Headers.Add("X-User-Id", "");
                    //var response = await client.SendAsync(request);
                    //response.EnsureSuccessStatusCode();
                    //Console.WriteLine(await response.Content.ReadAsStringAsync()); 
                    HttpResponseMessage responsetax = client.SendAsync(request).Result; // Block and wait 
                    if (responsetax.IsSuccessStatusCode)
                    {
                        string responseContenttax = responsetax.Content.ReadAsStringAsync().Result;
                        //PurchaseOrderProductsModel productsModeltax = new PurchaseOrderProductsModel();
                        dynamic jsonResponsetotal = JsonConvert.DeserializeObject(responseContenttax);
                        //var shippingMethodsArray = jsonResponsetotal.data.shipping_methods.ToObject<List<ShippingMethods>>();

                        var couponsdetails = jsonResponsetotal.data.coupons.ToObject<List<couponsdetails>>();
                        productsModel.couponsdetails = couponsdetails;

                        var stauscode = jsonResponsetotal.status;
                        if (stauscode == "200")
                        {
                            productsModel.subprice = jsonResponsetotal.data.cart_totals.subtotal;
                            productsModel.total_localtax1 = jsonResponsetotal.data.cart_totals.subtotal_tax;
                            productsModel.total_localtax2 = jsonResponsetotal.data.cart_totals.shipping_total;
                            productsModel.localtax1_tx = jsonResponsetotal.data.cart_totals.shipping_tax;
                            productsModel.discount = jsonResponsetotal.data.cart_totals.discount_total;
                            productsModel.total_ttc = jsonResponsetotal.data.cart_totals.total;
                            productsModel.product_type = jsonResponsetotal.status;
                            productsModel.total_tva = jsonResponsetotal.data.coupons[0].coupon_amount;
                            //int lastIndex = jsonResponsetotal.data.coupons.Count - 1;
                            //productsModel.total_tva = jsonResponsetotal.data.coupons[lastIndex].discount_amount;

                        }
                        else
                        {
                            productsModel.product_label = jsonResponsetotal.message;
                            productsModel.product_type = jsonResponsetotal.status;
                        }
                    }
                } 
                _list.Add(productsModel);

            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<PurchaseOrderProductsModel> deletecoupon(string code, string session_id)
        {
            var client = new HttpClient();
            PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();  // Check if the request was successful (status code 200 OK)
            try
            {

                if (!string.IsNullOrEmpty(session_id))
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, string.Format("{0}://{1}{2}", System.Web.HttpContext.Current.Request.Url.Scheme, System.Web.HttpContext.Current.Request.Url.Authority, "/cartapi/removeCoupon/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?code=" + code + ""));

                    //var request = new HttpRequestMessage(HttpMethod.Get, "https://erp.prosourcediesel.com/cartapi/removeCoupon/88B4A278-4A14-4A8E-A8C6-6A6463C46C65/1?code=" + code + "");
                    request.Headers.Add("X-Cart-Session-Id", session_id);
                    request.Headers.Add("X-User-Id", "");
                    //var response = await client.SendAsync(request);
                    //response.EnsureSuccessStatusCode();
                    //Console.WriteLine(await response.Content.ReadAsStringAsync()); 
                    HttpResponseMessage responsetax = client.SendAsync(request).Result; // Block and wait 
                    if (responsetax.IsSuccessStatusCode)
                    {
                        string responseContenttax = responsetax.Content.ReadAsStringAsync().Result;
                        //PurchaseOrderProductsModel productsModeltax = new PurchaseOrderProductsModel();
                        dynamic jsonResponsetotal = JsonConvert.DeserializeObject(responseContenttax);
                        //var shippingMethodsArray = jsonResponsetotal.data.shipping_methods.ToObject<List<ShippingMethods>>();
                        var stauscode = jsonResponsetotal.status;
                        if (stauscode == "200")
                        {
                            productsModel.subprice = jsonResponsetotal.data.cart_totals.subtotal;
                            productsModel.total_localtax1 = jsonResponsetotal.data.cart_totals.subtotal_tax;
                            productsModel.total_localtax2 = jsonResponsetotal.data.cart_totals.shipping_total;
                            productsModel.localtax1_tx = jsonResponsetotal.data.cart_totals.shipping_tax;
                            productsModel.discount = jsonResponsetotal.data.cart_totals.discount_total;
                            productsModel.total_ttc = jsonResponsetotal.data.cart_totals.total;
                            productsModel.product_type = jsonResponsetotal.status;
                        }
                        else
                        {
                            productsModel.product_label = jsonResponsetotal.message;
                            productsModel.product_type = jsonResponsetotal.status;
                        }
                    }
                }
                _list.Add(productsModel);

            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static DataTable GetProductList(string strSearch, string strproducttype)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select distinct top 100 p.id id,CONCAT(p.post_title, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as displayname,post_parent"
                              + " FROM wp_posts as p"
                               + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                             // + " WHERE p.post_type = '" + strproducttype + "' and CONCAT(p.post_title,p.id,post_name, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%'  ORDER BY id; ";//AND p.post_status = 'publish' 
                             + " WHERE p.post_type in ('product', 'product_variation') and CONCAT(p.post_title,p.id,post_name, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%'  ORDER BY id; ";//AND p.post_status = 'publish' 

                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetvariationProductList(string strSearch, string strproducttype)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select distinct top 100 convert(varchar, p.id) + '#' + convert(varchar,post_parent) id,CONCAT(p.post_title, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as displayname,post_parent"
                              + " FROM wp_posts as p"
                               + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                             // + " WHERE p.post_type = '" + strproducttype + "' and CONCAT(p.post_title,p.id,post_name, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%'  ORDER BY id; ";//AND p.post_status = 'publish' 
                             + " WHERE p.post_type in ('product', 'product_variation') and CONCAT(p.post_title,p.id,post_name, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%'  ORDER BY id; ";//AND p.post_status = 'publish' 

                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static List<PurchaseOrderProductsModel> paymentorder(CartPaymentController obj, long product_id, long vendor_id)
        {
            var client = new HttpClient();
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();
            var url = "";
            if (vendor_id > 0)
            {
                // PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                // productsModel.fk_product = 0;
                //productsModel.description = "coming soon..";
                //_list.Add(productsModel);
                url = "https://editor.prosourcediesel.com/api/order/createOrUpdateAdmin.php?order_id=" + vendor_id + "";
            }
            else
            {
                url = "https://editor.prosourcediesel.com/api/order/createOrUpdateAdmin.php";
            }

                var request = new HttpRequestMessage(HttpMethod.Post, url);

                // Serialize the CartShippingAddressRequest object to JSON
                string shippingJson = JsonConvert.SerializeObject(obj.data);
                // Create a StringContent with the JSON data
                var contenttax = new StringContent(shippingJson, Encoding.UTF8, "application/json");
                request.Content = contenttax;
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            HttpResponseMessage response = client.SendAsync(request).Result; // Block and wait 
                                                                                 // Check if the request was successful (status code 200 OK)
                try
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string responseContenttax = response.Content.ReadAsStringAsync().Result;
                        //PurchaseOrderProductsModel productsModeltax = new PurchaseOrderProductsModel();
                        dynamic jsonResponsetotal = JsonConvert.DeserializeObject(responseContenttax);
                        PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                        productsModel.fk_product = jsonResponsetotal.response;
                        productsModel.description = "Order created successfully";
                        _list.Add(productsModel);
                    }
                    else
                    {
                        PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                        productsModel.fk_product = 0;
                        productsModel.description = "something went wrong";
                        _list.Add(productsModel);

                    }
                }

                catch (Exception ex)
                { throw ex; }
            
            return _list;
        }
    }
}