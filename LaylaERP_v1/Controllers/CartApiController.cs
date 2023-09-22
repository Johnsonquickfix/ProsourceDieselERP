﻿namespace LaylaERP_v1.Controllers
{
    using LaylaERP_v1.BAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using LaylaERP_v1.Models.Product;
    using System.Dynamic;

    [RoutePrefix("cartapi")]
    public class CartApiController : ApiController
    {
        [HttpPost, Route("items/{app_key}/{entity_id}")]
        public IHttpActionResult CartItems(string app_key, long entity_id, CartProductRequest cart)
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

                dynamic obj = JsonConvert.DeserializeObject<dynamic>(CartRepository.AddItem(entity_id, user_id, session_id, (cart != null ? JsonConvert.SerializeObject(cart) : "")));
                if (obj.status == 200) return Ok(CalculateTotals(obj));
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
                    dynamic obj = JsonConvert.DeserializeObject<dynamic>(CartRepository.ApplyCoupon("apply-coupon", entity_id, user_id, session_id, code));
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
                    dynamic obj = JsonConvert.DeserializeObject<dynamic>(CartRepository.ApplyCoupon("remove-coupon", entity_id, user_id, session_id, code));
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

        public static dynamic CalculateTotals(dynamic obj)
        {
            try
            {
                int item_count = obj.data.item_count;
                decimal shipping_total = 0, shipping_tax = 0;
                decimal fee_total = 0, fee_tax = 0;
                decimal cart_contents_total = 0, cart_contents_tax = 0;
                decimal f_subtotal = 0, f_subtotal_tax = 0, f_line_total = 0, f_line_tax = 0;
                decimal discount_total = 0, discount_tax = 0;
                foreach (var item in obj.data.items)
                {
                    decimal line_subtotal = item.line_subtotal.ToObject<decimal>() ?? 0, line_discount = 0, line_total = 0;
                    if (obj.data.coupons != null)
                    {
                        foreach (var coupon in obj.data.coupons)
                        {
                            if (coupon.categories != null)
                            {
                                long[] _p_c = item.categories.ToObject<long[]>();
                                long[] _c_c = coupon.categories.ToObject<long[]>();
                                var intersect = _p_c.Intersect(_c_c);
                                if (intersect.Count() > 0)
                                {
                                    if (coupon.discount_type == "percent")
                                    {
                                        line_discount = line_discount + ((line_subtotal * (coupon.coupon_amount.ToObject<decimal>() ?? 0)) / 100.0);
                                    }
                                    else
                                    {
                                        line_discount = line_discount + (((coupon.coupon_amount.ToObject<decimal>() ?? 0) / item_count) * (item.quantity.ToObject<decimal>() ?? 0));
                                    }
                                }
                                else line_discount = 0;
                            }
                            else
                            {
                                if (coupon.discount_type == "percent")
                                {
                                    line_discount = line_discount + ((line_subtotal * (coupon.coupon_amount.ToObject<decimal>() ?? 0)) / 100.0);
                                }
                                else
                                {
                                    line_discount = line_discount + (((coupon.coupon_amount.ToObject<decimal>() ?? 0) / item_count) * (item.quantity.ToObject<decimal>() ?? 0));
                                }
                            }
                        }

                        if (line_subtotal > line_discount) line_total = line_subtotal - line_discount;
                        else if (line_subtotal < line_discount) line_total = 0;
                        else line_total = line_subtotal - line_discount;
                    }
                    else line_total = line_subtotal;

                    item.line_total = line_total;
                    f_subtotal = f_subtotal + line_subtotal;
                    f_subtotal_tax = f_subtotal_tax + (item.line_subtotal_tax.ToObject<decimal>() ?? 0);
                    f_line_total = f_line_total + (item.line_total.ToObject<decimal>() ?? 0);
                    f_line_tax = f_line_tax + (item.line_total_tax.ToObject<decimal>() ?? 0);

                    discount_total = discount_total + (line_subtotal - line_total);
                }
                cart_contents_total = f_line_total; cart_contents_tax = f_line_tax;

                //obj.cart_totals = new ExpandoObject();
                obj.data.cart_totals.subtotal = f_subtotal;
                obj.data.cart_totals.subtotal_tax = f_subtotal_tax;
                obj.data.cart_totals.shipping_total = shipping_total;
                obj.data.cart_totals.shipping_tax = shipping_tax;
                //obj.data.cart_totals.shipping_taxes = new List<dynamic>();
                obj.data.cart_totals.discount_total = discount_total;
                obj.data.cart_totals.discount_tax = discount_tax;
                obj.data.cart_totals.cart_contents_total = f_line_total;
                obj.data.cart_totals.cart_contents_tax = f_line_tax;
                //obj.data.cart_totals.cart_contents_taxes = new List<dynamic>();
                obj.data.cart_totals.fee_total = fee_total;
                obj.data.cart_totals.fee_tax = fee_tax;
                //obj.data.cart_totals.fee_taxes = new List<dynamic>();
                obj.data.cart_totals.total = (f_line_total + shipping_total + fee_total);
                obj.data.cart_totals.total_tax = (f_line_tax + shipping_tax + fee_tax);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return obj;
        }
    }
}