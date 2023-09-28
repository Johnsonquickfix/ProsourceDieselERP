namespace LaylaERP_v1.Controllers
{
    using LaylaERP.UTILITIES;
    using LaylaERP.UTILITIES.BoxPacker;
    using LaylaERP_v1.BAL;
    using LaylaERP_v1.Models.Product;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Dynamic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("cartapi")]
    public class CartApiController : ApiController
    {
        [HttpPost, Route("updateshipping/{app_key}/{entity_id}")]
        public IHttpActionResult UpdateShippingAddress(string app_key, long entity_id, CartShippingAddressRequest address)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (string.IsNullOrEmpty(address.address_1)) return Ok(new { message = "address_1 fields are required.", status = 404, code = "not_found", data = new List<string>() });
                else if (string.IsNullOrEmpty(address.city)) return Ok(new { message = "city fields are required.", status = 404, code = "not_found", data = new List<string>() });
                else if (string.IsNullOrEmpty(address.state)) return Ok(new { message = "state fields are required.", status = 404, code = "not_found", data = new List<string>() });
                else if (string.IsNullOrEmpty(address.postcode)) return Ok(new { message = "postcode fields are required.", status = 404, code = "not_found", data = new List<string>() });
                else if (string.IsNullOrEmpty(address.country)) return Ok(new { message = "country fields are required.", status = 404, code = "not_found", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                // check coupon amount
                //CartRepository.ApplyCoupon("check-coupon", entity_id, user_id, session_id, string.Empty);
                CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.UpdateShippingAddress("update-shipping", entity_id, user_id, session_id, JsonConvert.SerializeObject(address)));
                if (obj.status == 200) return Ok(CalculateTotals(obj));
                return Ok(obj);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost, Route("items/{app_key}/{entity_id}")]
        public IHttpActionResult CartItems(string app_key, long entity_id, CartProductRequest cart, bool checkout = false)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty;
                if (headers.Contains("X-User-Id"))
                {
                    user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                }
                if (headers.Contains("X-Cart-Session-Id"))
                {
                    session_id = headers.GetValues("X-Cart-Session-Id").First();
                }
                //if (cart != null) return Ok(JsonConvert.DeserializeObject(CartRepository.AddItem(entity_id, user_id, session_id, JsonConvert.SerializeObject(cart))));
                //else return Ok(JsonConvert.DeserializeObject(CartRepository.AddItem(entity_id, user_id, session_id, "")));
                // check coupon amount
                //CartRepository.ApplyCoupon("check-coupon", entity_id, user_id, session_id, string.Empty);
                CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.AddItem(entity_id, user_id, session_id, (cart != null ? JsonConvert.SerializeObject(cart) : "")));
                if (obj.status == 200 && checkout) return Ok(CalculateTotals(obj));
                else if (obj.status == 200 && !checkout) return Ok(obj);
                return Ok(obj);

                //return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = new { } });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("applycoupon/{app_key}/{entity_id}")]
        public IHttpActionResult ApplyCoupon(string app_key, long entity_id, string code = "")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty;
                if (headers.Contains("X-User-Id"))
                {
                    user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                }
                if (headers.Contains("X-Cart-Session-Id"))
                {
                    session_id = headers.GetValues("X-Cart-Session-Id").First();
                }
                //apply-coupon
                if (!string.IsNullOrEmpty(code))
                {
                    CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.ApplyCoupon("apply-coupon", entity_id, user_id, session_id, code));
                    if (obj.status == 200) return Ok(CalculateTotals(obj));
                    return Ok(obj);
                }
                else return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("removeCoupon/{app_key}/{entity_id}")]
        public IHttpActionResult RemoveCoupon(string app_key, long entity_id, string code = "")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty;
                if (headers.Contains("X-User-Id"))
                {
                    user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                }
                if (headers.Contains("X-Cart-Session-Id"))
                {
                    session_id = headers.GetValues("X-Cart-Session-Id").First();
                }
                //apply-coupon
                if (!string.IsNullOrEmpty(code))
                {
                    CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.ApplyCoupon("remove-coupon", entity_id, user_id, session_id, code));
                    if (obj.status == 200) return Ok(CalculateTotals(obj));
                    return Ok(obj);
                }
                else return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("removeCart/{app_key}/{entity_id}")]
        public IHttpActionResult RemoveCart(string app_key, long entity_id)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(CartRepository.UpdateShippingAddress("remove-cart", entity_id, user_id, session_id, string.Empty));
                return Ok(obj);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public static dynamic CalculateTotals(CartResponse obj)
        {
            try
            {
                //double _dimension = 2.54, _weight = 0.453592;
                double _dimension = 1, _weight = 1;
                //Packer packer = new Packer(true, false);
                WC_Boxpack packer = new WC_Boxpack();
                TaxJarModel _tax = new TaxJarModel();
                if (obj.data.shipping_address != null)
                {
                    _tax.to_street = obj.data.shipping_address.address_1;
                    _tax.to_city = obj.data.shipping_address.city;
                    _tax.to_state = obj.data.shipping_address.state;
                    _tax.to_zip = obj.data.shipping_address.postcode;
                    _tax.to_country = obj.data.shipping_address.country;
                    _tax.amount = 100;
                    if (!string.IsNullOrEmpty(obj.data.shipping_address.address_1) && !string.IsNullOrEmpty(obj.data.shipping_address.city) && !string.IsNullOrEmpty(obj.data.shipping_address.state) && !string.IsNullOrEmpty(obj.data.shipping_address.postcode) && !string.IsNullOrEmpty(obj.data.shipping_address.country))
                        _tax = GetTaxAmounts(_tax);
                    else _tax = new TaxJarModel { order_total_amount = 0, taxable_amount = 0, amount_to_collect = 0, rate = 0, freight_taxable = false };
                }

                long item_count = obj.data.item_count;
                decimal shipping_total = 0, shipping_tax = 0;
                decimal fee_total = 0, fee_tax = 0;
                decimal cart_contents_total = 0, cart_contents_tax = 0;
                decimal f_subtotal = 0, f_subtotal_tax = 0, f_line_total = 0, f_line_tax = 0;
                decimal discount_total = 0, discount_tax = 0;
                foreach (var item in obj.data.items)
                {
                    decimal line_subtotal = item.quantity * (item.price.HasValue ? item.price.Value : 0), line_discount = 0, line_total = 0;
                    item.line_subtotal = line_subtotal;
                    if (obj.data.coupons != null)
                    {
                        foreach (var coupon in obj.data.coupons)
                        {
                            decimal discount = 0;
                            if (coupon.categories != null)
                            {
                                long[] _p_c = item.categories.ToArray();
                                long[] _c_c = coupon.categories.ToArray();
                                var intersect = _p_c.Intersect(_c_c);
                                if (intersect.Count() > 0)
                                {
                                    if (coupon.discount_type == "percent")
                                    {
                                        discount = ((line_subtotal * coupon.coupon_amount) / 100M);
                                        //line_discount = line_discount + ((line_subtotal * (coupon.coupon_amount ?? 0)) / 100.0);
                                    }
                                    else
                                    {
                                        discount = ((coupon.coupon_amount / item_count) * item.quantity);
                                        //line_discount = line_discount + (((coupon.coupon_amount ?? 0) / item_count) * (item.quantity ?? 0));
                                    }
                                }
                                else line_discount = 0;
                            }
                            else
                            {
                                if (coupon.discount_type == "percent")
                                {
                                    discount = ((line_subtotal * coupon.coupon_amount) / 100M);
                                    //line_discount = line_discount + ((line_subtotal * (coupon.coupon_amount ?? 0)) / 100.0);
                                }
                                else
                                {
                                    discount = ((coupon.coupon_amount / item_count) * item.quantity);
                                    //line_discount = line_discount + (((coupon.coupon_amount ?? 0) / item_count) * (item.quantity ?? 0));
                                }
                            }
                            line_discount = line_discount + discount;
                            //if (coupon.discount_amount == null) coupon.discount_amount = 0;
                            coupon.discount_amount = coupon.discount_amount + discount;
                            coupon.coupon_amount = coupon.coupon_amount;
                        }

                        if (line_subtotal > line_discount) line_total = line_subtotal - line_discount;
                        else if (line_subtotal < line_discount) line_total = 0;
                        else line_total = line_subtotal - line_discount;
                    }
                    else line_total = line_subtotal;

                    item.line_total = line_total;
                    item.line_subtotal_tax = (line_subtotal * _tax.rate / 100);
                    item.line_total_tax = (line_total * _tax.rate / 100);
                    f_subtotal = f_subtotal + line_subtotal;
                    f_subtotal_tax = f_subtotal_tax + (item.line_subtotal_tax ?? 0);
                    f_line_total = f_line_total + line_total;
                    f_line_tax = f_line_tax + (item.line_total_tax ?? 0);

                    discount_total = discount_total + line_discount;//(line_subtotal - line_total);
                    // Add Item in Box
                    if (item.dimensions != null)
                    {
                        //foreach(var dim in (item.quantity.ToObject<double>() ?? 0))
                        for (int qty = 0; qty < item.quantity; qty++)
                        {
                            packer.AddItem(item.dimensions.length * _dimension, item.dimensions.width * _dimension, item.dimensions.height * _dimension, (item.weight.HasValue ? (item.weight.Value * _weight) : 0));
                        }
                        //packer.AddItem(new Item { Id = "", Description = "", Depth = (item.dimensions.height.ToObject<double>() ?? 0) * _mm, Length = (item.dimensions.length.ToObject<double>() ?? 0) * _mm, Width = (item.dimensions.width.ToObject<double>() ?? 0) * _mm, Weight = (item.weight.ToObject<double>() ?? 0) * _mm }, (item.quantity.ToObject<int>() ?? 0));
                    }
                }
                cart_contents_total = f_line_total; cart_contents_tax = f_line_tax;
                // Calculate cart_total
                obj.data.cart_totals.subtotal = f_subtotal;
                obj.data.cart_totals.subtotal_tax = f_subtotal_tax;
                obj.data.cart_totals.discount_total = discount_total;
                obj.data.cart_totals.discount_tax = discount_tax;
                obj.data.cart_totals.cart_contents_total = f_line_total;
                obj.data.cart_totals.cart_contents_tax = f_line_tax;
                //obj.data.cart_totals.cart_contents_taxes = new List<dynamic>();
                obj.data.cart_totals.fee_total = fee_total;
                obj.data.cart_totals.fee_tax = fee_tax;

                // calculate shipping
                if (obj.data.shipping_address != null)
                {
                    //packer.AddItem(9, 8, 4, 1, 67.95);
                    if (!string.IsNullOrEmpty(obj.data.shipping_address.postcode) && !string.IsNullOrEmpty(obj.data.shipping_address.country))
                    {
                        get_boxes(packer);
                        packer.Pack();
                        var packages = packer.GetPackages();
                        if (packages.Count > 0) get_fedex_shipping_methods(obj, packages);
                        CartDataResponse.ShippingMethods _shipping = obj.data.shipping_methods.Where(s => s.isactive == true).FirstOrDefault();
                        if (_shipping == null) _shipping = obj.data.shipping_methods.OrderBy(s => s.amount).FirstOrDefault();
                        if (_shipping != null) shipping_total = _shipping.amount;
                    }
                }
                //obj.data.cart_totals.shipping_taxes = new List<dynamic>();
                obj.data.cart_totals.shipping_total = shipping_total;
                obj.data.cart_totals.shipping_tax = shipping_tax;
                //obj.data.cart_totals.fee_taxes = new List<dynamic>();
                //obj.data.cart_totals.total = (f_line_total + shipping_total + fee_total);
                obj.data.cart_totals.total = (f_line_total + shipping_total + fee_total + f_line_tax + shipping_tax + fee_tax);
                obj.data.cart_totals.total_tax = (f_line_tax + shipping_tax + fee_tax);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return obj;
        }
        public static TaxJarModel GetTaxAmounts(TaxJarModel model)
        {
            try
            {
                DataTable dt = CartRepository.GetTaxRate(model.to_country, model.to_state, model.to_city, model.to_street, model.to_zip);
                if (dt.Rows.Count > 0)
                {
                    model.order_total_amount = 0;
                    model.taxable_amount = 0;
                    model.amount_to_collect = 0;
                    model.rate = (dt.Rows[0]["rate"] != Convert.DBNull) ? Convert.ToDecimal(dt.Rows[0]["rate"]) : 0;
                    model.freight_taxable = (dt.Rows[0]["freight_taxable"] != Convert.DBNull) ? Convert.ToBoolean(dt.Rows[0]["freight_taxable"]) : false;
                    model.tax_meta = (dt.Rows[0]["data"] != Convert.DBNull) ? dt.Rows[0]["data"].ToString() : "[]";

                    //model.rate = (dt.Rows[0]["rate"] != Convert.DBNull) ? Convert.ToDecimal(dt.Rows[0]["rate"]) : 0;
                    //model.freight_taxable = (dt.Rows[0]["freight_taxable"] != Convert.DBNull) ? Convert.ToBoolean(dt.Rows[0]["freight_taxable"]) : false; ;
                }
                else
                {
                    model = clsTaxJar.GetTaxes(model);
                    CartRepository.SaveTaxRate(model.to_country, model.to_state, model.to_city, model.to_street, model.to_zip, model.rate, model.freight_taxable, model.tax_meta);
                }
            }
            catch { }
            return model;
        }

        #region [Get fedex shipping methods]
        [HttpPost, Route("shippingmethod/{app_key}/{entity_id}")]
        public IHttpActionResult UpdateShippingMethod(string app_key, long entity_id, CartDataResponse.ShippingMethods methods)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (string.IsNullOrEmpty(methods.method_id)) return Ok(new { message = "method_id fields are required.", status = 404, code = "not_found", data = new List<string>() });
                //else if (string.IsNullOrEmpty(methods.method_title)) return Ok(new { message = "method_title fields are required.", status = 404, code = "not_found", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                // check coupon amount
                //CartRepository.ApplyCoupon("check-coupon", entity_id, user_id, session_id, string.Empty);
                CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.UpdateShippingAddress("shipping_method", entity_id, user_id, session_id, JsonConvert.SerializeObject(methods)));
                if (obj.status == 200) return Ok(CalculateTotals(obj));
                return Ok(obj);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public static void get_boxes(WC_Boxpack packer)
        {
            double _mm = 25.4;
            string filePath = AppContext.BaseDirectory, fileName = "boxpacker_box";
            string appPath = string.Format(@"{0}json\{1}.json", filePath, fileName);
            JArray records = JArray.Parse(System.IO.File.ReadAllText(appPath, System.Text.Encoding.UTF8));
            foreach (JObject item in records)
            {
                WC_Boxpack_Box box = packer.AddBox((((float?)item["length"]) ?? 0), (((float?)item["width"]) ?? 0), (((float?)item["height"]) ?? 0), (((float?)item["box_weight"]) ?? 0));//FEDEX_MEDIUM_BOX
                box.SetInnerDimensions((((float?)item["length"]) ?? 0), (((float?)item["width"]) ?? 0), (((float?)item["height"]) ?? 0));
                box.SetId(item["name"].ToString());
                box.SetMaxWeight((((float?)item["max_weight"]) ?? 0));
                box.SetVolume((((float?)item["length"]) ?? 0) * (((float?)item["width"]) ?? 0) * (((float?)item["height"]) ?? 0));
            }
            // Add Standard UPS boxes
            //WC_Boxpack_Box box = packer.AddBox(13.25, 11.5, 2.375, 0.40625);//FEDEX_MEDIUM_BOX
            //box.SetInnerDimensions(13.25, 11.5, 2.375); box.SetId("FEDEX_MEDIUM_BOX"); box.SetMaxWeight(20);            //box.SetBoxType();

            //box = packer.AddBox(11.25, 8.75, 4.375, 0.40625);//FEDEX_MEDIUM_BOX:2
            //box.SetInnerDimensions(11.25, 8.75, 4.375); box.SetId("FEDEX_MEDIUM_BOX:2"); box.SetMaxWeight(20);

            //box = packer.AddBox(12.375, 10.875, 1.5, 0.28125);//FEDEX_SMALL_BOX
            //box.SetInnerDimensions(12.375, 10.875, 1.5); box.SetId("FEDEX_SMALL_BOX"); box.SetMaxWeight(20);

            //box = packer.AddBox(11.25, 8.75, 2.625, 0.28125);//FEDEX_SMALL_BOX:2
            //box.SetInnerDimensions(11.25, 8.75, 2.625); box.SetId("FEDEX_SMALL_BOX:2"); box.SetMaxWeight(20);
        }
        public static void get_fedex_shipping_methods(CartResponse order, List<WC_Boxpack_Package> packages)
        {
            dynamic _frdex = new ExpandoObject();
            List<CartDataResponse.ShippingMethods> _shipping_methods = new List<CartDataResponse.ShippingMethods>();
            try
            {
                List<string> _shipping_services = new List<string>() { "PRIORITY_OVERNIGHT", "STANDARD_OVERNIGHT", "FEDEX_2_DAY", "GROUND_HOME_DELIVERY", "FEDEX_GROUND", "INTERNATIONAL_ECONOMY", "INTERNATIONAL_PRIORITY", "INTERNATIONAL_GROUND", "FEDEX_INTERNATIONAL_CONNECT_PLUS", "INTERNATIONAL_DISTRIBUTION_FREIGHT", "INTERNATIONAL_ECONOMY_DISTRIBUTION", "INTERNATIONAL_PRIORITY_DISTRIBUTION", "FEDEX_INTERNATIONAL_PRIORITY_EXPRESS", "FEDEX_INTERNATIONAL_PRIORITY", "FEDEX_REGIONAL_ECONOMY", "FEDEX_REGIONAL_ECONOMY_FREIGHT" };
                if (order.data.shipping_methods == null) order.data.shipping_methods = new List<CartDataResponse.ShippingMethods>();
                if ((order.data.cart_totals.subtotal - order.data.cart_totals.discount_total) >= 90)
                {
                    _shipping_methods.Add(new CartDataResponse.ShippingMethods() { method_id = "FREE_SHIPPING", method_title = "Free shipping (3-5 Business Days)", amount = 0 });
                }

                string accountNumber = "740561073", client_id = "l7e40e1dfda4e04c958f688ad2b071535f", client_secret = "b1d2efec8b344ac3a205ef2b2f1301be";

                if (order.data.shipping_address != null)
                {
                    _frdex.accountNumber = new { value = accountNumber };
                    _frdex.requestedShipment = new
                    {
                        preferredCurrency = "USD",
                        dropoffType = "REGULAR_PICKUP",
                        //ShipTimestamp" => date('c', strtotime('+1 Weekday')), //date('c'), //'2021-11-01T00:00:00+00:00',
                        packagingType = "YOUR_PACKAGING",
                        shippingChargesPayment = new
                        {
                            PaymentType = "SENDER",
                            Payor = new { ResponsibleParty = new { AccountNumber = accountNumber, CountryCode = "US" } }
                        },
                        shipper = new
                        {
                            address = new
                            {
                                //streetLines = new List<string>() { "2211 Wayne Street" },
                                //city = "Fairfield",stateOrProvinceCode = "IN",
                                postalCode = "94534",
                                countryCode = "US",
                                //residential = true
                            }
                        },
                        recipient = new
                        {
                            address = new
                            {
                                streetLines = new List<string>() { order.data.shipping_address.address_1, order.data.shipping_address.address_2 },
                                city = order.data.shipping_address.city,
                                stateOrProvinceCode = order.data.shipping_address.state,
                                postalCode = order.data.shipping_address.postcode,
                                countryCode = order.data.shipping_address.country,
                                //residential = true
                            }
                        },
                        pickupType = "DROPOFF_AT_FEDEX_LOCATION",
                        //serviceType = "GROUND_HOME_DELIVERY",
                        //shipmentSpecialServices = new { specialServiceTypes = new List<string>() { "HOME_DELIVERY_PREMIUM" } },
                        rateRequestType = new List<string>() { "LIST" },
                        requestedPackageLineItems = new List<dynamic>(),
                        totalPackageCount = packages.Count,
                        //serviceType = "SMART_POST",
                        //smartPostInfoDetail = new { indicia = "PARCEL_SELECT", hubId = "5531" }
                    };
                    int i = 0;
                    foreach (WC_Boxpack_Package item in packages)
                    {
                        i++;
                        var _it = new
                        {
                            sequenceNumber = i,
                            groupNumber = i,
                            groupPackageCount = i,
                            weight = new { units = "LB", value = Math.Max(0.5, Math.Round(item.weight, 2)) },
                            dimensions = new { length = Math.Max(1, Math.Round(item.length, 2)), width = Math.Max(1, Math.Round(item.width, 2)), height = Math.Max(1, Math.Round(item.height, 2)), units = "IN" },
                            //declaredValue = new { amount = 0, currency = "USD" }
                        };
                        _frdex.requestedShipment.requestedPackageLineItems.Add(_it);
                    }
                }
                var access_token = clsFedex.GetToken(client_id, client_secret);
                string str_meta = string.Empty;
                var result = JsonConvert.DeserializeObject<dynamic>(clsFedex.ShipRates(access_token, JsonConvert.SerializeObject(_frdex)));
                if (result != null)
                {
                    if (order.data.shipping_methods == null) order.data.shipping_methods = new List<CartDataResponse.ShippingMethods>();
                    CartDataResponse.ShippingMethods methods;
                    foreach (JToken rat in result.output.rateReplyDetails)
                    {
                        if (_shipping_services.Contains(rat.SelectToken("serviceType").Value<string>()))
                        {
                            if (rat["ratedShipmentDetails"] != null)
                            {
                                foreach (JToken sh_rat in rat["ratedShipmentDetails"])
                                {
                                    methods = new CartDataResponse.ShippingMethods();
                                    methods.method_id = rat.SelectToken("serviceType").Value<string>();
                                    methods.method_title = methods.method_id.Replace("_", " ");
                                    methods.amount = sh_rat["totalNetCharge"] != null ? Convert.ToDecimal(sh_rat["totalNetCharge"]) : 0;
                                    if (order.data.shipping_rate != null) if (order.data.shipping_rate.method_id.Equals(methods.method_id)) methods.isactive = true;
                                    _shipping_methods.Add(methods);
                                }
                            }
                            else
                            {
                                methods = new CartDataResponse.ShippingMethods();
                                methods.method_id = rat.SelectToken("serviceType").Value<string>();
                                methods.method_title = methods.method_id.Replace("_", " ");
                                methods.amount = rat["totalNetCharge"] != null ? Convert.ToDecimal(rat["totalNetCharge"]) : 0;
                                if (order.data.shipping_rate != null) if (order.data.shipping_rate.method_id.Equals(methods.method_id)) methods.isactive = true;
                                _shipping_methods.Add(methods);
                            }
                        }
                    }
                }
            }
            catch (Exception ex) { }
            _shipping_methods = _shipping_methods.OrderBy(s => s.amount).ToList();
            if (_shipping_methods.Count > 0 && order.data.shipping_rate == null) {
                _shipping_methods[0].isactive = true;
                order.data.shipping_rate = _shipping_methods[0];
            }
            order.data.shipping_methods = _shipping_methods.OrderBy(s => s.amount).ToList();
        }
        #endregion
    }
}
