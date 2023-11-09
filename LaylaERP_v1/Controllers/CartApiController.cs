namespace LaylaERP_v1.Controllers
{
    using LaylaERP.Models;
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
    using System.Text;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("cartapi")]
    public class CartApiController : ApiController
    {
        public static string website_url = "http://newnext.prosourcediesel.com";
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
                long user_id = 0; string session_id = string.Empty, email = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();
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
        public async Task<IHttpActionResult> CartItems(string app_key, long entity_id, List<CartProductRequest> cart, bool checkout = false)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });

                System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                long user_id = 0; string session_id = string.Empty, email = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();
                //if (cart != null) return Ok(JsonConvert.DeserializeObject(CartRepository.AddItem(entity_id, user_id, session_id, JsonConvert.SerializeObject(cart))));
                //else return Ok(JsonConvert.DeserializeObject(CartRepository.AddItem(entity_id, user_id, session_id, "")));
                // check coupon amount
                //CartRepository.ApplyCoupon("check-coupon", entity_id, user_id, session_id, string.Empty);
                CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.AddItem(entity_id, user_id, session_id, (cart != null ? JsonConvert.SerializeObject(cart) : "")));
                if (obj.status == 200)
                {
                    //if (checkout && !string.IsNullOrEmpty(email)) await kl_started_checkout(email, obj);
                    //else if (!checkout && !string.IsNullOrEmpty(email)) await kl_added_to_cart(email, obj);
                    if (cart != null && !string.IsNullOrEmpty(email)) await kl_added_to_cart(email, obj);
                    return Ok(CalculateTotals(obj, checkout));
                }
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
                long user_id = 0; string session_id = string.Empty, email = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();
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
                long user_id = 0; string session_id = string.Empty, email = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();
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
                long user_id = 0; string session_id = string.Empty, email = string.Empty;
                if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();
                dynamic obj = JsonConvert.DeserializeObject<dynamic>(CartRepository.UpdateShippingAddress("remove-cart", entity_id, user_id, session_id, string.Empty));
                return Ok(obj);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public static dynamic CalculateTotals(CartResponse obj, bool checkout = true)
        {
            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                //double _dimension = 2.54, _weight = 0.453592;
                double _dimension = 1, _weight = 1;
                //Packer packer = new Packer(true, false);
                WC_Boxpack packer = new WC_Boxpack();
                TaxJarModel _tax = new TaxJarModel();
                if (obj.data.shipping_address != null && checkout)
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

                List<CartDataResponse.Item> _newItem = new List<CartDataResponse.Item>();
                foreach (var item in obj.data.items)
                {
                    if (item.id > 0)
                    {
                        // get wholesale rate 
                        if (item.wholesale != null)
                        {
                            if ((item.wholesale.price.HasValue ? item.wholesale.price : 0) > 0)
                            {
                                decimal? _price = item.wholesale.price;
                                System.Collections.ArrayList _att = serializer.Deserialize(item.wholesale.rule_mapping) as System.Collections.ArrayList;
                                foreach (System.Collections.Hashtable _r in _att)
                                {
                                    if (_r["wholesale-role"].ToString().ToLower() == item.wholesale.role.ToLower())
                                    {
                                        int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                        decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                        if (_start_qty <= item.quantity && (_end_qty >= item.quantity || _end_qty == 0)) _price = _wholesale_discount_range;
                                    }
                                }
                                item.price = _price;
                            }
                            else
                            {
                                if ((item.wholesale.cat_discount.HasValue ? item.wholesale.cat_discount : 0) > 0 && item.price > 0)
                                {
                                    decimal? _price = item.price - (item.price * item.wholesale.cat_discount) / 100;
                                    System.Collections.ArrayList _att = serializer.Deserialize(item.wholesale.cat_rule_mapping) as System.Collections.ArrayList;
                                    foreach (System.Collections.Hashtable _r in _att)
                                    {
                                        if (_r["wholesale-role"].ToString().ToLower() == item.wholesale.role.ToLower())
                                        {
                                            int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                            decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                            if (_start_qty <= item.quantity && (_end_qty >= item.quantity || _end_qty == 0)) _price = item.price - (item.price * _wholesale_discount_range) / 100;
                                        }
                                    }
                                    item.price = _price;
                                }
                            }
                        }
                        if (item.add_core_price.HasValue) item.price = (item.price.HasValue ? item.price.Value : 0) + (item.add_core_price.Value ? item.core_price.Value : 0);
                        item.wholesale = null;
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
                        item.line_subtotal_tax = Math.Round((line_subtotal * _tax.rate / 100), 2);
                        item.line_total_tax = Math.Round((line_total * _tax.rate / 100), 2);
                        f_subtotal = f_subtotal + line_subtotal;
                        f_subtotal_tax = f_subtotal_tax + (item.line_subtotal_tax ?? 0);
                        f_line_total = f_line_total + line_total;
                        f_line_tax = f_line_tax + (item.line_total_tax ?? 0);

                        discount_total = discount_total + line_discount;//(line_subtotal - line_total);
                        // Add Item in Box
                        if (item.dimensions != null)
                        {
                            for (int qty = 0; qty < item.quantity; qty++)
                            {
                                packer.AddItem(item.dimensions.length * _dimension, item.dimensions.width * _dimension, item.dimensions.height * _dimension, (item.weight.HasValue ? (item.weight.Value * _weight) : 0));
                            }
                            //packer.AddItem(new Item { Id = "", Description = "", Depth = (item.dimensions.height.ToObject<double>() ?? 0) * _mm, Length = (item.dimensions.length.ToObject<double>() ?? 0) * _mm, Width = (item.dimensions.width.ToObject<double>() ?? 0) * _mm, Weight = (item.weight.ToObject<double>() ?? 0) * _mm }, (item.quantity.ToObject<int>() ?? 0));
                        }

                        CartDataResponse.Item _o = obj.data.items.Where(o => o.kit_key == item.kit_key && o.id == 0).FirstOrDefault();
                        if (_o != null)
                        {
                            if (!_newItem.Any(x => x.kit_key == _o.kit_key))
                            {
                                if (_o.children == null) _o.children = new List<CartDataResponse.Item>();
                                _o.children.Add(item);
                                _newItem.Add(_o);
                            }
                            else
                            {
                                _o = _newItem.Where(o => o.kit_key == item.kit_key).FirstOrDefault();
                                if (_o.children == null) _o.children = new List<CartDataResponse.Item>();
                                _o.children.Add(item);
                            };
                        }
                        else _newItem.Add(item);
                    }
                }
                //Group total
                foreach (var item in _newItem.Where(x => x.group_id > 0))
                {
                    item.quantity = (int)item.children.Select(i => i.quantity).Average();
                    item.price = item.children.Where(i => i.price.HasValue).Sum(i => i.price.HasValue ? i.price.Value : 0);
                    item.regular_price = item.children.Where(i => i.regular_price.HasValue).Sum(i => i.regular_price.Value);
                    item.sale_price = item.children.Where(i => i.sale_price.HasValue).Sum(i => i.sale_price.Value);
                    item.line_subtotal = item.children.Where(i => i.line_subtotal.HasValue).Sum(i => i.line_subtotal ?? 0);
                    item.line_subtotal_tax = item.children.Where(i => i.line_subtotal_tax.HasValue).Sum(i => i.line_subtotal_tax ?? 0);
                    item.line_total = item.children.Where(i => i.line_total.HasValue).Sum(i => i.line_total ?? 0);
                    item.line_total_tax = item.children.Where(i => i.line_total_tax.HasValue).Sum(i => i.line_total_tax ?? 0);
                }
                obj.data.items = _newItem;
                obj.data.item_count = _newItem.Sum(i => i.quantity);
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
                if (obj.data.shipping_address != null && checkout)
                {
                    //packer.AddItem(9, 8, 4, 1, 67.95);
                    if (!string.IsNullOrEmpty(obj.data.shipping_address.postcode) && !string.IsNullOrEmpty(obj.data.shipping_address.country))
                    {
                        get_boxes(packer);
                        packer.Pack();
                        var packages = packer.GetPackages();
                        if (packages.Count > 0) get_fedex_shipping_methods(obj, packages);
                        //CartDataResponse.ShippingMethods _shipping = obj.data.shipping_methods.Where(s => s.isactive == true).FirstOrDefault();
                        //if (_shipping == null) _shipping = obj.data.shipping_methods.OrderBy(s => s.amount).FirstOrDefault();
                        //if (_shipping != null) shipping_total = _shipping.amount;
                        shipping_total = obj.data.shipping_rate != null ? obj.data.shipping_rate.amount : 0;
                        shipping_tax = 0;
                        //shipping_tax = Math.Round((shipping_total * _tax.rate / 100), 2);
                    }
                }
                ///set shipping item wise
                foreach (var item in obj.data.items)
                {
                    item.line_shipping_amount = Math.Round(((shipping_total / item_count) * item.quantity), 4);
                    if (item.line_shipping_amount.HasValue) item.line_shipping_tax_amount = Math.Round(((shipping_tax / item_count) * item.quantity), 4);
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
            bool is_active = false;
            dynamic _frdex = new ExpandoObject();
            List<CartDataResponse.ShippingMethods> _shipping_methods = new List<CartDataResponse.ShippingMethods>();
            try
            {
                List<string> _shipping_services = new List<string>() { "PRIORITY_OVERNIGHT", "STANDARD_OVERNIGHT", "FEDEX_2_DAY", "GROUND_HOME_DELIVERY", "FEDEX_GROUND", "INTERNATIONAL_ECONOMY", "INTERNATIONAL_PRIORITY", "INTERNATIONAL_GROUND", "FEDEX_INTERNATIONAL_CONNECT_PLUS", "INTERNATIONAL_DISTRIBUTION_FREIGHT", "INTERNATIONAL_ECONOMY_DISTRIBUTION", "INTERNATIONAL_PRIORITY_DISTRIBUTION", "FEDEX_INTERNATIONAL_PRIORITY_EXPRESS", "FEDEX_INTERNATIONAL_PRIORITY", "FEDEX_REGIONAL_ECONOMY", "FEDEX_REGIONAL_ECONOMY_FREIGHT" };
                if (order.data.shipping_methods == null) order.data.shipping_methods = new List<CartDataResponse.ShippingMethods>();
                if ((order.data.cart_totals.subtotal - order.data.cart_totals.discount_total) >= 90)
                {
                    _shipping_methods.Add(new CartDataResponse.ShippingMethods() { method_id = "FREE_SHIPPING", method_title = "Free shipping (3-5 Business Days)", amount = 0, isactive = false });
                }

                string accountNumber = "740561073", client_id = "l7e40e1dfda4e04c958f688ad2b071535f", client_secret = "b1d2efec8b344ac3a205ef2b2f1301be";

                if (order.data.shipping_address != null)
                {
                    _frdex.accountNumber = new { value = accountNumber };
                    _frdex.requestedShipment = new
                    {
                        preferredCurrency = "USD",
                        dropoffType = "REGULAR_PICKUP",
                        shipDateStamp = DateTime.Now.ToString("yyyy-MM-dd"),
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
                    // Los Angeles -- USA (UTC/GMT -07:00)
                    DateTime date = DateTime.UtcNow.AddHours(-7);

                    foreach (JToken rat in result.output.rateReplyDetails)
                    {
                        if (_shipping_services.Contains(rat.SelectToken("serviceType").Value<string>()))
                        {
                            string _new_label = string.Empty; int _rate_multiply = 1;
                            //If thursday 15hr to up and friday 15hr before
                            if ((((int)date.DayOfWeek) == 4 && date.Hour >= 15) || (((int)date.DayOfWeek) == 5 && date.Hour < 15))
                            {
                                if (rat.SelectToken("serviceType").Value<string>().Equals("PRIORITY_OVERNIGHT"))
                                {
                                    _new_label = "FedEx Priority Overnight with Monday Delivery";
                                    _rate_multiply = 4;
                                }
                                else if (rat.SelectToken("serviceType").Value<string>().Equals("STANDARD_OVERNIGHT"))
                                {
                                    _new_label = "FedEx Standard Overnight with Monday Delivery";
                                }
                            }
                            if (rat["ratedShipmentDetails"] != null)
                            {
                                foreach (JToken sh_rat in rat["ratedShipmentDetails"])
                                {
                                    methods = new CartDataResponse.ShippingMethods();
                                    methods.method_id = rat.SelectToken("serviceType").Value<string>();
                                    methods.method_title = !string.IsNullOrEmpty(_new_label) ? _new_label : methods.method_id.Replace("_", " ");
                                    methods.amount = sh_rat["totalNetCharge"] != null ? Convert.ToDecimal(sh_rat["totalNetCharge"]) * _rate_multiply : 0;
                                    if (order.data.shipping_rate != null) { if (order.data.shipping_rate.method_id.Equals(methods.method_id)) { methods.isactive = true; is_active = true; } }
                                    _shipping_methods.Add(methods);
                                }
                            }
                            else
                            {
                                methods = new CartDataResponse.ShippingMethods();
                                methods.method_id = rat.SelectToken("serviceType").Value<string>();
                                methods.method_title = !string.IsNullOrEmpty(_new_label) ? _new_label : methods.method_id.Replace("_", " ");
                                methods.amount = rat["totalNetCharge"] != null ? Convert.ToDecimal(rat["totalNetCharge"]) * _rate_multiply : 0;
                                if (order.data.shipping_rate != null) { if (order.data.shipping_rate.method_id.Equals(methods.method_id)) { methods.isactive = true; is_active = true; } }
                                _shipping_methods.Add(methods);
                            }
                        }
                    }
                }
            }
            catch (Exception ex) { }
            order.data.shipping_methods = _shipping_methods.OrderBy(s => s.amount).ToList();
            if (is_active) order.data.shipping_rate = order.data.shipping_methods.Where(e => e.isactive == true).FirstOrDefault();
            else
            {
                if (order.data.shipping_methods.Count > 0)
                {
                    _shipping_methods[0].isactive = true; order.data.shipping_rate = _shipping_methods[0];
                }
            }
            //_shipping_methods = _shipping_methods.OrderBy(s => s.amount).ToList();
            //if (_shipping_methods.Count > 0 && (order.data.shipping_rate == null || is_active == false))
            //{
            //    _shipping_methods[0].isactive = true;
            //    order.data.shipping_rate = _shipping_methods[0];
            //}

        }
        #endregion

        #region [Klaviyo data]
        public static async Task<string> kl_started_checkout(string profile_email, CartResponse order)
        {
            clsKlaviyoData klaviyoData = new clsKlaviyoData();
            klaviyoData.data = new clsKlaviyoData.clsPodiumEvent() { type = "event", attributes = new Dictionary<string, object>() };
            //"Started Checkout", "johnson.quickfix@gmail.com"
            var _metric = new { data = new { type = "metric", attributes = new { name = "Started Checkout" } } };
            var _profile = new { data = new { type = "profile", attributes = new { email = profile_email } } };
            var _properties = new Dictionary<string, object>();
            _properties.Add("$use_ip", true); _properties.Add("$is_session_activity", true);
            _properties.Add("CurrencySymbol", "$");
            _properties.Add("Currency", "USD");
            var _ItemNames = new List<string>();
            decimal _amount = 0;
            foreach (CartDataResponse.Item i in order.data.items)
            {
                _ItemNames.Add(i.name);
                _amount += i.line_total.Value;
            }
            _properties.Add("$value", _amount);
            _properties.Add("ItemNames", _ItemNames);
            _properties.Add("$service", "erp-woocommerce");
            var _attributes = new { properties = _properties, metric = _metric, profile = _profile };
            klaviyoData.data.attributes.Add("properties", _properties);
            klaviyoData.data.attributes.Add("metric", _metric);
            klaviyoData.data.attributes.Add("profile", _profile);
            return await LaylaERP.UTILITIES.clsKlaviyo.TrackProfileActivity(klaviyoData);
        }
        public static async Task<string> kl_added_to_cart(string profile_email, CartResponse order)
        {
            clsKlaviyoData klaviyoData = new clsKlaviyoData();
            klaviyoData.data = new clsKlaviyoData.clsPodiumEvent() { type = "event", attributes = new Dictionary<string, object>() };
            //"Started Checkout", "johnson.quickfix@gmail.com"
            var _metric = new { data = new { type = "metric", attributes = new { name = "Added to Cart" } } };
            var _profile = new { data = new { type = "profile", attributes = new { email = profile_email } } };
            var _properties = new Dictionary<string, object>();
            _properties.Add("$use_ip", true); _properties.Add("$is_session_activity", true);
            //_properties.Add("CurrencySymbol", "$"); _properties.Add("Currency", "USD");
            _properties.Add("value", order.data.cart_totals.subtotal);
            if (order.data.items.Count > 0)
            {
                _properties.Add("AddedItemCategories", new List<string>());
                _properties.Add("AddedItemImageURL", order.data.items[0].image.name);
                _properties.Add("AddedItemPrice", order.data.items[0].price);
                _properties.Add("AddedItemQuantity", order.data.items[0].quantity);
                _properties.Add("AddedItemProductID", order.data.items[0].id);
                _properties.Add("AddedItemProductName", order.data.items[0].name);
                _properties.Add("AddedItemSKU", order.data.items[0].sku);
                _properties.Add("AddedItemTags", new List<string>());
                _properties.Add("AddedItemURL", string.Format("{0}/{1}/{2}", website_url, order.data.items[0].brand, order.data.items[0].slug));
                var _ItemNames = new List<string>();
                dynamic _items = new List<dynamic>();
                foreach (CartDataResponse.Item i in order.data.items)
                {
                    _ItemNames.Add(i.name);
                    dynamic _image = new List<dynamic>(); _image.Add(new { URL = i.image.name });
                    _items.Add(new
                    {
                        productID = i.id,
                        variantID = i.variation_id,
                        quantity = i.quantity,
                        name = i.name,
                        URL = string.Format("{0}/{1}/{2}", website_url, i.brand, i.slug),
                        Images = _image,
                        categories = new List<string>(),
                        variation = new List<string>(),
                        subTotal = i.line_subtotal,
                        total = i.line_total,
                        lineTotal = i.line_total,
                        tax = i.line_subtotal_tax,
                        totalWithTax = i.line_subtotal_tax
                    });
                }
                _properties.Add("ItemNames", _ItemNames);
                _properties.Add("Categories", new List<string>());
                _properties.Add("ItemCount", order.data.item_count);
                _properties.Add("Tags", new List<string>());
                _properties.Add("extra", new { items = _items, subTotal = order.data.cart_totals.subtotal, shippingTotal = order.data.cart_totals.shipping_total, taxTotal = order.data.cart_totals.total_tax, grandTotal = order.data.cart_totals.total, cartRebuildKey = order.data.session_id });
            }
            var _attributes = new { properties = _properties, metric = _metric, profile = _profile };
            klaviyoData.data.attributes.Add("properties", _properties);
            klaviyoData.data.attributes.Add("metric", _metric);
            klaviyoData.data.attributes.Add("profile", _profile);
            return await LaylaERP.UTILITIES.clsKlaviyo.TrackProfileActivity(klaviyoData);
        }
        #endregion

        #region [Update Order]
        public static int UpdateOrder(long entity_id, string cart_session_id, long order_id, long customer_id, string order_status, List<OrderPostMetaModel> orderPostMetas)
        {
            int result = 0;
            try
            {
                CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.AddItem(entity_id, 0, cart_session_id, ""));
                if (obj.status == 200)
                {
                    CalculateTotals(obj, true);

                    string _giftcard_to = string.Empty, _giftcard_from = string.Empty, _giftcard_from_mail = string.Empty, _giftcard_message = string.Empty, _giftcard_amt = string.Empty;
                    StringBuilder strProductMeta = new StringBuilder("");
                    string Userid = CommanUtilities.Provider.GetCurrent().UserID.ToString();
                    DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                    /// step 1 : wp_wc_order_stats
                    StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',status='{5}',customer_id='{6}' where order_id='{7}';", obj.data.item_count, obj.data.cart_totals.subtotal,
                            obj.data.cart_totals.total_tax, obj.data.cart_totals.shipping_total, obj.data.cart_totals.total, order_status, customer_id, order_id));
                    strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0});", order_id));
                    strSql.Append(string.Format(" delete from wp_wc_order_product_lookup where order_id={0};", order_id));
                    strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0};", order_id));

                    /// step 2 : wp_postmeta 
                    foreach (OrderPostMetaModel _meta in orderPostMetas)
                    {
                        strSql.Append(string.Format(" update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", _meta.meta_value, order_id, _meta.meta_key));
                        if (_meta.meta_key.Equals("_billing_email")) _giftcard_from_mail = _meta.meta_value;
                        strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) SELECT * FROM (SELECT '{0}' id, '{1}' _key, '{2}' _value) tb WHERE _key not in (SELECT meta_key FROM wp_postmeta WHERE post_id = '{3}'); ", order_id, _meta.meta_key, _meta.meta_value, order_id));
                    }

                    /// step 3 : wp_woocommerce_order_items [line_item]
                    foreach (CartDataResponse.Item _item in obj.data.items)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", _item.name, "line_item", order_id));
                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount)");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}';", order_id, _item.id, _item.variation_id, customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), _item.quantity, _item.line_subtotal, _item.line_total, (_item.line_subtotal - _item.line_total), _item.line_total_tax, 0, 0));
                        //Insert tax data in serialize format
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_tax_data','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", "", order_id, "line_item", _item.name));
                    }
                    /// step 4 : wp_woocommerce_order_items [coupon]
                    if (obj.data.coupons != null)
                    {
                        foreach (CartDataResponse.Coupon _item in obj.data.coupons)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", _item.coupon_title, "coupon", order_id));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", _item.discount_amount, order_id, "coupon", _item.coupon_title));
                        }
                    }
                    /// step 5 : wp_woocommerce_order_items [fee]
                    if (obj.data.cart_totals.fee_total != 0)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}';", "taxable", order_id, "fee", "fee"));
                        //strSql.Append(string.Format(" union all select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", obj.total, model.OrderPostStatus.order_id, obj.product_type, obj.product_name));
                        //strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", obj.tax_amount, model.OrderPostStatus.order_id, obj.product_type, obj.product_name));
                    }
                    /// step 6 : wp_woocommerce_order_items [shipping]
                    if (obj.data.shipping_rate != null)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.data.shipping_rate.method_id, "shipping", order_id));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.data.shipping_rate.amount, order_id, "shipping"));
                    }
                    /// step 7 : wp_woocommerce_order_items [tax]
                    if (obj.data.cart_totals.total_tax > 0)
                    {
                        //strSql.Append(string.Format(" delete from wp_wc_order_tax_lookup where order_id = {0}; insert into wp_wc_order_tax_lookup(order_id,tax_rate_id,date_created,shipping_tax,order_tax,total_tax) select {0},{1},UTC_TIMESTAMP(),0,{2},{3}; ", model.OrderPostStatus.order_id, model.OrderPostStatus.order_id, obj.tax_amount, obj.tax_amount));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", "", order_id, "tax", "Tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", obj.data.cart_totals.total_tax, order_id, "tax", "Tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'", 0, order_id, "tax", "Tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'freighttax_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}';", obj.data.cart_totals.shipping_tax, order_id, "tax", "Tax"));
                    }

                    /// step 8: wp_woocommerce_order_itemmeta
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue  from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id={0}", order_id));
                    //strSql.Append(" union all select order_item_id,'_line_tax_data',concat('a:2:{s:5:\"total\";a:1:{i:0;s:',length(tax_amount),':\"',tax_amount,'\";}s:8:\"subtotal\";a:1:{i:0;s:',length(tax_amount),':\"',tax_amount,'\";}}') from wp_wc_order_product_lookup where order_id=" + model.OrderPostStatus.order_id + " and order_item_id not in (" + str_oiid + ")");
                    strSql.Append(string.Format(" union all select order_item_id,'size','' from wp_wc_order_product_lookup where order_id={0}", order_id));
                    strSql.Append(string.Format(" union all select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id={0};", order_id));

                    /// step 9 : wp_posts (Coupon used by)
                    strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", customer_id, order_id));

                    /// step 10 : wp_posts
                    strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}' where id = {3}; ", order_status, cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), order_id));

                    result = LaylaERP.DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                }
                //return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = new { } });
            }
            catch (Exception ex)
            {

            }
            return result;
        }
        #endregion
        #region [Update Order Status]
        public static int UpdateOrderStatus(long entity_id, string cart_session_id, long order_id, long customer_id, string order_status, List<OrderPostMetaModel> orderPostMetas)
        {
            int result = 0;
            try
            {
                //CartResponse obj = JsonConvert.DeserializeObject<CartResponse>(CartRepository.AddItem(entity_id, 0, cart_session_id, ""));
                     string _giftcard_to = string.Empty, _giftcard_from = string.Empty, _giftcard_from_mail = string.Empty, _giftcard_message = string.Empty, _giftcard_amt = string.Empty;
                    StringBuilder strProductMeta = new StringBuilder("");
                    string Userid = CommanUtilities.Provider.GetCurrent().UserID.ToString();
                    DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                    /// step 1 : wp_wc_order_stats
                    //StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',status='{5}',customer_id='{6}' where order_id='{7}';", obj.data.item_count, obj.data.cart_totals.subtotal,
                    //obj.data.cart_totals.total_tax, obj.data.cart_totals.shipping_total, obj.data.cart_totals.total, order_status, customer_id, order_id));
                    //strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0});", order_id));
                    //strSql.Append(string.Format(" delete from wp_wc_order_product_lookup where order_id={0};", order_id));
                    //strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0};", order_id));
                   StringBuilder strSql = new StringBuilder();
                    /// step 2 : wp_postmeta 
                    foreach (OrderPostMetaModel _meta in orderPostMetas)
                    {
                    strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", _meta.meta_value, order_id, _meta.meta_key));
                        if (_meta.meta_key.Equals("_billing_email")) _giftcard_from_mail = _meta.meta_value;
                        strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) SELECT * FROM (SELECT '{0}' id, '{1}' _key, '{2}' _value) tb WHERE _key not in (SELECT meta_key FROM wp_postmeta WHERE post_id = '{3}'); ", order_id, _meta.meta_key, _meta.meta_value, order_id));
                    } 
                    strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}' where id = {3}; ", order_status, cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), order_id));
                     result = LaylaERP.DAL.MYSQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                
                //return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = new { } });
            }
            catch (Exception ex)
            {

            }
            return result;
        }
        #endregion
    }
}
