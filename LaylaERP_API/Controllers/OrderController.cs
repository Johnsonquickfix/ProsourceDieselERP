namespace LaylaERP_API.Controllers
{
    using Models;
    using BAL;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Newtonsoft.Json;

    [RoutePrefix("api/order")]
    public class OrderController : BaseApiController
    {
        [HttpGet]
        [Route("checkcoupon")]
        public IHttpActionResult CheckCoupon([FromUri] CouponModel model)
        {
            ResultModel result = new ResultModel();
            if (string.IsNullOrEmpty(model.couponCode))
            {
                return Ok(new { });
            }
            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.GetCouponDetail("GTCOU", model.couponCode, string.Empty)));
                if (balResult.Count > 0) return Ok(balResult[0]);
                else return Ok(new { });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("checkusercoupon")]
        public IHttpActionResult CheckUserCouponUsed([FromUri] CouponModel model)
        {
            ResultModel result = new ResultModel();
            if (string.IsNullOrEmpty(model.couponCode) || string.IsNullOrEmpty(model.umail_uid))
            {
                return Ok(new { });
            }
            try
            {
                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.GetCouponDetail("CKUCO", model.couponCode, model.umail_uid)));
                if (balResult.Count > 0) return Ok(balResult[0]);
                else return Ok(new { });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("addorder")]
        public IHttpActionResult addorder(dynamic model)
        {
            ResultModel result = new ResultModel();
            //if (model.id == 0)
            //{
            //    return Ok(new { success = false, err_msg = "Please provide valid details." });
            //}
            //if (!string.IsNullOrEmpty(model.user_new_pass) && !string.IsNullOrEmpty(model.user_conf_pass))
            //{
            //    if (model.user_new_pass != model.user_conf_pass)
            //    {
            //        return Ok(new { success = false, err_msg = "Error! confirm password field should be match with the password field." });
            //    }
            //}
            try
            {
                if (model.cartItems.Count == 0) return Ok(new { success = false, err_msg = "Please provide valid details." });
                long order_id = 0, customer_id = 0;
                order_id = model.orderId;
                customer_id = model.user_id;
                string order_note = string.Empty, orderComment = string.Empty;

                List<PostMetaModel> postMetas = new List<PostMetaModel>();
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_key", meta_value = "wc_order_" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_created_via", meta_value = "checkout" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_cart_hash", meta_value = "0" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_customer_user", meta_value = model.user_id });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_version", meta_value = "4.8.0" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_prices_include_tax", meta_value = "no" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_download_permissions_granted", meta_value = "" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_recorded_sales", meta_value = "yes" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_recorded_coupon_usage_counts", meta_value = "yes" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_stock_reduced", meta_value = "yes" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "employee_id", meta_value = "0" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "employee_name", meta_value = "" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_currency", meta_value = "USD" });

                if (model.customerDetails.Count > 0)
                {
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_first_name", meta_value = model.customerDetails[0].billing_first_name });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_last_name", meta_value = model.customerDetails[0].billing_last_name });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_email", meta_value = model.customerDetails[0].billing_email });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_country", meta_value = model.customerDetails[0].billing_country });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_state", meta_value = model.customerDetails[0].billing_state });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_city", meta_value = model.customerDetails[0].billing_city });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_postcode", meta_value = model.customerDetails[0].billing_zipcode });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_phone", meta_value = model.customerDetails[0].billing_phone });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_address_1", meta_value = model.customerDetails[0].billing_address_1 });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_address_2", meta_value = model.customerDetails[0].billing_address_2 });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_company", meta_value = model.customerDetails[0].billing_company });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_billing_address_index", meta_value = "" });

                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_first_name", meta_value = model.customerDetails[0].shipping_first_name });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_last_name", meta_value = model.customerDetails[0].shipping_last_name });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_email", meta_value = model.customerDetails[0].shipping_email });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_country", meta_value = model.customerDetails[0].shipping_country });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_state", meta_value = model.customerDetails[0].shipping_state });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_city", meta_value = model.customerDetails[0].shipping_city });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_postcode", meta_value = model.customerDetails[0].shipping_zipcode });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_phone", meta_value = model.customerDetails[0].shipping_phone });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_address_1", meta_value = model.customerDetails[0].shipping_address_1 });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_address_2", meta_value = model.customerDetails[0].shipping_address_2 });
                    postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_shipping_address_index", meta_value = "" });
                    order_note = model.customerDetails[0].order_note;
                }
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_payment_method", meta_value = model.paymentInfo.payment_method });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_payment_method_title", meta_value = model.paymentInfo.payment_method_title });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_total", meta_value = model.cartTotals });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_cart_discount", meta_value = model.cartDiscount });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_cart_discount_tax", meta_value = "0" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_shipping", meta_value = model.shipping });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_shipping_tax", meta_value = "0" });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_order_tax", meta_value = model.tax });
                postMetas.Add(new PostMetaModel() { post_id = 0, meta_key = "_gift_amount", meta_value = model.gift_amount });
                orderComment = model.orderComment;

                //OrderStatsModel orderStats = new OrderStatsModel();
                //orderStats.order_id = 0;
                //orderStats.parent_id = 0;
                //orderStats.returning_customer = 0;
                //orderStats.customer_id = !string.IsNullOrEmpty(model.user_id) ? Convert.ToInt64(model.user_id) : 0;
                //orderStats.num_items_sold = 0;
                //orderStats.total_sales = model.cartTotals;
                //orderStats.shipping_total = model.shipping;
                //orderStats.tax_total = model.tax;
                //orderStats.net_total = orderStats.total_sales;
                List<CartItemsModel> cartItems = JsonConvert.DeserializeObject<List<CartItemsModel>>(JsonConvert.SerializeObject(model.cartItems));

                System.Xml.XmlDocument postsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument order_statsXML = JsonConvert.DeserializeXmlNode("{\"Data\":[]}", "Items");
                System.Xml.XmlDocument postmetaXML = CommonRepositry.ToXml(postMetas);
                System.Xml.XmlDocument order_itemsXML = CommonRepositry.ToXml(cartItems);

                var balResult = JsonConvert.DeserializeObject<List<dynamic>>(JsonConvert.SerializeObject(CommonRepositry.AddOrders(order_id, "I", customer_id, order_note, orderComment, 0, string.Empty, postsXML, order_statsXML, postmetaXML, order_itemsXML)));
                if (balResult.Count > 0)
                {
                    return Ok(balResult[0]);
                }
                else
                {
                    result.user_data = "{}";
                    result.success = false;
                    result.error_msg = "Record not found.";
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                //return InternalServerError(ex);
                result.user_data = "{}";
                result.success = false;
                result.error_msg = ex.Message;
                return Ok(result);
            }
        }
    }
}
