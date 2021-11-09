namespace LaylaERP.BAL
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Data;
    using DAL;
    using Models;
    using System.Data.SqlClient;
    using System.Text;
    using LaylaERP.UTILITIES;
    using System.Text.RegularExpressions;
    using System.Xml;

    public class OrderRepository
    {
        public static ZipCodeModel GetCityByZip(string zipcode)
        {
            ZipCodeModel obj = new ZipCodeModel();
            try
            {
                string strquery = "select distinct ZipCode,State,StateFullName,City from ZIPCodes1 where ZipCode = '" + zipcode.Trim() + "' ";
                SqlDataReader sdr = SQLHelper.ExecuteReader(strquery);
                while (sdr.Read())
                {
                    if (sdr["ZipCode"] != DBNull.Value)
                        obj.ZipCode = sdr["ZipCode"].ToString().Trim();
                    else
                        obj.ZipCode = string.Empty;
                    if (sdr["State"] != DBNull.Value)
                        obj.state = sdr["State"].ToString().Trim();
                    else
                        obj.state = string.Empty;
                    if (sdr["City"] != DBNull.Value)
                        obj.city = sdr["City"].ToString().Trim();
                    else
                        obj.city = string.Empty;

                    obj.country = string.Empty;
                }
            }
            catch (Exception ex)
            { throw ex; }
            return obj;
        }
        public static DataTable GetCustomers(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strWhr = "select top 100 id,CONCAT(User_Login, ' (#',id,' - ', user_email, ')') as displayname,replace(replace(replace(replace(ump.meta_value,'(', ''),')', ''),'-', ''),' ', '') billing_phone"
                                + " from wp_users as ur"
                                + " inner join wp_usermeta um on ur.id = um.user_id and um.meta_key = 'wp_capabilities' and meta_value like '%customer%'"
                                + " left outer join wp_usermeta ump on ur.id = ump.user_id and ump.meta_key = 'billing_phone'";
                strWhr += " where concat(User_Login, ' ', user_email,' ',replace(replace(replace(replace(ump.meta_value,'(', ''),')', ''),'-', ''),' ', '')) like  '%" + strSearch + "%';";

                DT = SQLHelper.ExecuteDataTable(strWhr);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetCustomersInfo(long id)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@user_id", id),
                };
                DT = SQLHelper.ExecuteDataTable("select umeta_id,user_id,meta_key,meta_value from wp_usermeta where user_id= @user_id and (meta_key like 'billing_%' OR meta_key like 'shipping_%') order by meta_key", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        //Add New Order With wp_postmeta and wp_wc_order_stats
        public static DataTable AddOrdersPost(long Pkey, string qFlag, long UserID, string UserName, XmlDocument postsXML, XmlDocument order_statsXML, XmlDocument postmetaXML, XmlDocument order_itemsXML, XmlDocument order_itemmetaXML)
        {
            var dt = new DataTable();
            try
            {
                long id = Pkey;
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", Pkey),
                    new SqlParameter("@qflag", qFlag),
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@username", UserName),
                    new SqlParameter("@postsXML", postsXML.OuterXml),
                    new SqlParameter("@order_statsXML", order_statsXML.OuterXml),
                    new SqlParameter("@postmetaXML", postmetaXML.OuterXml),
                    new SqlParameter("@order_itemsXML", order_itemsXML.OuterXml),
                    new SqlParameter("@order_itemmetaXML", order_itemmetaXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_order_iud", parameters);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataTable GetProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(COALESCE(ps.post_title,post.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as post_title"
                            + " , CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation' AND ps.post_status = 'publish'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " WHERE post.id not in (632713,78676) and post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(COALESCE(ps.post_title,post.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%' "
                            + " ORDER BY post.ID limit 50;";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetCategoryWiseProducts()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "select wp_t.term_order,wp_t.term_id,wp_t.name,p.id pr_id,p.post_title as post_title,"
                                + " '[' + STRING_AGG(concat('{','\"vr_id\":', coalesce(ps.id,0), ',\"vr_title\":\"', coalesce(ps.post_title,'No Variations'),'\",\"_regular_price\":\"',pm_rp.meta_value,'\",\"_price\":\"',pm_sp.meta_value,'\"}'), ',') + ']' variation_details"
                                + "        from wp_posts p"
                                + " inner join wp_term_relationships wp_tr on wp_tr.object_id = p.id"
                                + " inner join wp_term_taxonomy wp_ttn on wp_ttn.term_taxonomy_id = wp_tr.term_taxonomy_id and wp_ttn.taxonomy = 'product_cat'"
                                + " inner join wp_terms wp_t on wp_t.term_id = wp_ttn.term_id"
                                + " left outer join wp_termmeta wp_tm on wp_tm.term_id = wp_t.term_id and wp_tm.meta_key = 'is_active'"
                                + " left outer join wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation' and ps.post_status = 'publish'"
                                + " left outer join wp_postmeta pm_rp on pm_rp.post_id = coalesce(ps.id,p.id) and pm_rp.meta_key = '_regular_price'"
                                + " left outer join wp_postmeta pm_sp on pm_sp.post_id = coalesce(ps.id,p.id) and pm_sp.meta_key = '_price'"
                                + " where p.post_type = 'product' and p.post_status = 'publish' and coalesce(wp_tm.meta_value,'1') = 1"
                                + " group by wp_t.term_order,wp_t.term_id,p.id,wp_t.name,p.id,p.post_title order by wp_t.term_order,wp_t.term_id;";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static OrderProductsModel GetProductDetails(long product_id, long variation_id)
        {
            OrderProductsModel productsModel = new OrderProductsModel();
            try
            {
                DataTable DT = new DataTable();
                SqlParameter[] parameters =
                {
                    new SqlParameter("@product_id", product_id),
                    new SqlParameter("@variation_id", variation_id)
                };
                string strSQl = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , COALESCE(pr.meta_value, 0) reg_price,COALESCE(psr.meta_value, 0) sale_price FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_price'"
                            + " WHERE post.post_type = 'product' and post.id = @product_id and ps.id = @variation_id;";
                SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    if (sdr["id"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["id"]);
                    else
                        productsModel.product_id = 0;
                    if (sdr["pr_id"] != DBNull.Value)
                        productsModel.variation_id = Convert.ToInt64(sdr["pr_id"]);
                    else
                        productsModel.variation_id = 0;
                    if (sdr["post_title"] != DBNull.Value)
                        productsModel.product_name = sdr["post_title"].ToString();
                    else
                        productsModel.product_name = string.Empty;
                    if (sdr["reg_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["price"].ToString().Trim()))
                        productsModel.price = decimal.Parse(sdr["reg_price"].ToString());
                    else
                        productsModel.price = 0;
                    if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                        productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                    else
                        productsModel.sale_price = productsModel.price;

                }
            }
            catch (Exception ex)
            { throw ex; }
            return productsModel;
        }
        public static List<OrderProductsModel> GetProductListDetails(long product_id, long variation_id)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                _list = GetProductListDetails(product_id, variation_id, "-", "-");
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderProductsModel> GetProductListDetails(long product_id, long variation_id, string countrycode, string statecode)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                OrderProductsModel productsModel = new OrderProductsModel();
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "SRPOD"),
                    new SqlParameter("@product_id", product_id),
                    new SqlParameter("@variation_id", variation_id),
                    new SqlParameter("@countrycode", countrycode),
                    new SqlParameter("@statecode", statecode)
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("wp_posts_order_search", parameters);
                while (sdr.Read())
                {
                    productsModel = new OrderProductsModel();
                    if (sdr["id"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["id"]);
                    else
                        productsModel.product_id = 0;
                    if (sdr["pr_id"] != DBNull.Value)
                        productsModel.variation_id = Convert.ToInt64(sdr["pr_id"]);
                    else
                        productsModel.variation_id = 0;
                    if (sdr["post_title"] != DBNull.Value)
                        productsModel.product_name = sdr["post_title"].ToString();
                    else
                        productsModel.product_name = string.Empty;
                    if (sdr["reg_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["reg_price"].ToString().Trim()))
                        productsModel.reg_price = decimal.Parse(sdr["reg_price"].ToString());
                    else
                        productsModel.reg_price = 0;
                    if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                        productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                    else
                        productsModel.sale_price = productsModel.reg_price;
                    productsModel.price = productsModel.sale_price;
                    if (sdr["quantity"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["quantity"].ToString().Trim()))
                        productsModel.quantity = decimal.Parse(sdr["quantity"].ToString().Trim());
                    else
                        productsModel.quantity = 1;
                    if (sdr["is_free"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["is_free"].ToString().Trim()))
                        productsModel.is_free = Convert.ToBoolean(sdr["is_free"].ToString().Trim());
                    else
                        productsModel.is_free = false;
                    if (sdr["free_itmes"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["free_itmes"].ToString().Trim()))
                        productsModel.free_itmes = sdr["free_itmes"].ToString().Trim();
                    else
                        productsModel.free_itmes = string.Empty;
                    productsModel.group_id = 0;
                    if (sdr["Shipping_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["Shipping_price"].ToString().Trim()))
                        productsModel.shipping_amount = decimal.Parse(sdr["Shipping_price"].ToString().Trim());
                    else
                        productsModel.shipping_amount = 0;
                    if (sdr["staterecyclefee"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["staterecyclefee"].ToString().Trim()))
                        productsModel.staterecycle_fee = decimal.Parse(sdr["staterecyclefee"].ToString().Trim());
                    else
                        productsModel.staterecycle_fee = 0;
                    if (sdr["is_taxable"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["is_taxable"].ToString().Trim()))
                        productsModel.staterecycle_istaxable = Convert.ToBoolean(sdr["is_taxable"]);
                    else
                        productsModel.staterecycle_istaxable = false;
                    productsModel.meta_data = "[{\"id\": 0,\"item_id\": 0,\"key\": \"\", \"value\": \"\"}]";
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderShippingModel> GetProductShippingCharge(string variation_ids, string statecode)
        {
            List<OrderShippingModel> _list = new List<OrderShippingModel>();
            try
            {
                _list = GetProductShippingCharge(variation_ids, "US", statecode);
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static List<OrderShippingModel> GetProductShippingCharge(string variation_ids, string countrycode, string statecode)
        {
            List<OrderShippingModel> _list = new List<OrderShippingModel>();
            try
            {
                DataTable DT = new DataTable();
                SqlParameter[] parameters =
                {
                    new SqlParameter("@countrycode", countrycode),
                    new SqlParameter("@statecode", statecode)
                };
                string strSQl = "select fk_productid,Shipping_price,fk_productid from Shipping_Product sp"
                            + " inner join ShippingClass_Details scd on scd.fk_ShippingID = sp.fk_shippingID and countrycode = @countrycode and statecode = @statecode"
                            + " where fk_productid in (" + variation_ids + ") ";
                SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    OrderShippingModel productsModel = new OrderShippingModel();
                    if (sdr["fk_productid"] != DBNull.Value)
                        productsModel.product_id = Convert.ToInt64(sdr["fk_productid"]);
                    else
                        productsModel.product_id = 0;

                    if (sdr["Shipping_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["Shipping_price"].ToString().Trim()))
                        productsModel.AK = decimal.Parse(sdr["Shipping_price"].ToString());
                    else
                        productsModel.AK = 0;

                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static DataSet GetShippingWithRecycling(string product_ids, string variation_ids, string countrycode, string statecode)
        {
            DataSet ds = new DataSet();
            try
            {
                DataTable DT = new DataTable();
                SqlParameter[] parameters =
                {
                    new SqlParameter("@countrycode", countrycode),
                    new SqlParameter("@statecode", statecode)
                };
                string strSQl = "select fk_productid vid,Shipping_price fee from Shipping_Product sp inner join ShippingClass_Details scd on scd.fk_ShippingID = sp.fk_shippingID and countrycode = @countrycode and statecode = @statecode where fk_productid in (" + variation_ids + ");"
                            + " select item_parent_id pid,staterecyclefee fee,is_taxable from wp_staterecyclefee where is_active = 1 and state = @statecode and item_parent_id in (" + product_ids + ");";
                ds = SQLHelper.ExecuteDataSet(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return ds;
        }
        public static DataTable GetCouponDiscount(string strCoupon)
        {
            DataTable dt = new DataTable();
            try
            {
                long lid = CommanUtilities.Provider.GetCurrent().UserID;

                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "COUPN"),
                    new SqlParameter("@coupon", strCoupon),
                    new SqlParameter("@userid", lid)
                };
                string strSQl = "wp_posts_order_search";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GetGiftCardDiscount(string strGiftCard)
        {
            DataTable dt = new DataTable();
            try
            {
                string lid = CommanUtilities.Provider.GetCurrent().UserID.ToString();

                SqlParameter[] parameters =
                {
                    new SqlParameter("@strGiftCard", strGiftCard)
                };
                string strSQl = "Select id, code,order_id,order_item_id,recipient,sender,sender_email,message,balance,remaining as giftcard_amount,'add_giftcard' as type " +
                    "from wp_woocommerce_gc_cards where code=@strGiftCard and is_active='on';";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        //Save/Update Order 
        public static int SaveOrder(OrderModel model)
        {
            int result = 0;
            try
            {
                string str_oiid = string.Join(",", model.OrderProducts.Where(f => f.quantity > 0).Select(x => x.order_item_id.ToString()).ToArray()) + "," + string.Join(",", model.OrderOtherItems.Select(x => x.order_item_id.ToString()).ToArray()) + "," + string.Join(",", model.OrderTaxItems.Select(x => x.order_item_id.ToString()).ToArray());
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                /// step 1 : wp_wc_order_stats
                StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',status='{5}',customer_id='{6}' where order_id='{7}';", model.OrderPostStatus.num_items_sold, model.OrderPostStatus.total_sales,
                        model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.status, model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0} and order_item_id not in ({1}));", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" delete from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));

                /// step 2 : wp_postmeta 
                foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                {
                    strSql.Append(string.Format(" update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", obj.meta_value, obj.post_id, obj.meta_key));
                }

                /// step 3 : wp_woocommerce_order_items
                foreach (OrderProductsModel obj in model.OrderProducts)
                {
                    if (obj.order_item_id > 0)
                    {
                        strSql.Append(string.Format(" update wp_wc_order_product_lookup set product_qty='{0}',product_net_revenue='{1}',product_gross_revenue='{2}',coupon_amount='{3}',tax_amount='{4}',shipping_amount='{5}',shipping_tax_amount='{6}' where order_item_id='{7}';",
                            obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key in ('_qty','_reduced_stock');", obj.quantity, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='_line_subtotal';", obj.total, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key in ('_line_subtotal_tax','_line_tax');", obj.tax_amount, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='_line_total';", (obj.total - obj.discount), obj.order_item_id));
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.product_name, "line_item", model.OrderPostStatus.order_id));

                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount)");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}';", model.OrderPostStatus.order_id, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), obj.discount, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount));
                    }

                    // str_Stock+= string.Format("select 'SO',{0},{1},13 warehouse_id,{2},{3},'I'", model.OrderPostStatus.order_id, obj.variation_id > 0 ? obj.variation_id : obj.product_id, model.OrderPostStatus.date_created.ToString("MMMM dd, yyyy @ HH:mm tt"), obj.quantity);
                }
                /// step 4 : wp_woocommerce_order_itemmeta
                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue + coupon_amount from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'size','' from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1})", model.OrderPostStatus.order_id, str_oiid));
                strSql.Append(string.Format(" union all select order_item_id,'_reduced_stock',product_qty from wp_wc_order_product_lookup where order_id={0} and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));

                /// step 5 : wp_woocommerce_order_items
                foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                {
                    if (obj.order_item_id > 0)
                    {
                        if (obj.item_type == "coupon")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "discount_amount"));
                        }
                        else if (obj.item_type == "fee")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "_line_total"));
                        }
                        else if (obj.item_type == "shipping")
                        {
                            strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "cost"));
                        }
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.item_name, obj.item_type, model.OrderPostStatus.order_id));
                        if (obj.item_type == "coupon")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'discount_amount',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}' and order_item_name = '{3}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type, obj.item_name));
                        }
                        else if (obj.item_type == "fee" && obj.amount != 0)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'tax_status','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", "taxable", model.OrderPostStatus.order_id, obj.item_type));
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_line_total','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type));
                        }
                        else if (obj.item_type == "shipping")
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'cost',{0} from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.amount, model.OrderPostStatus.order_id, obj.item_type));
                        }
                    }
                }
                /// step 6 : wp_posts (Coupon used by)
                strSql.Append(string.Format(" insert into wp_postmeta (post_id,meta_key,meta_value) select id,'_used_by',{0} from wp_posts wp inner join wp_woocommerce_order_items oi on lower(oi.order_item_name) = lower(wp.post_title) and oi.order_item_type = 'coupon' and oi.order_id = {1} where post_type = 'shop_coupon'; ", model.OrderPostStatus.customer_id, model.OrderPostStatus.order_id));

                /// step 7 : wp_woocommerce_order_items (Tax)
                //str_oiid = string.Join(",", model.OrderTaxItems.Select(x => x.order_item_id.ToString()).ToArray());
                //strSql.Append(string.Format(" delete from wp_woocommerce_order_itemmeta where order_item_id in (select order_item_id from wp_woocommerce_order_items where order_id={0} and order_item_type in ('tax') and order_item_id not in ({1}));", model.OrderPostStatus.order_id, str_oiid));
                //strSql.Append(string.Format(" delete from wp_woocommerce_order_items where order_id={0} and order_item_type in ('tax') and order_item_id not in ({1});", model.OrderPostStatus.order_id, str_oiid));
                foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                {
                    if (obj.order_item_id > 0)
                    {
                        strSql.Append(string.Format(" update wp_woocommerce_order_items set order_item_name='{0}-{1}-{2} TAX-1' where order_item_id={3}; ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, obj.order_item_id));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_rate_state, obj.order_item_id, "label"));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.amount, obj.order_item_id, "tax_amount"));
                        strSql.Append(string.Format(" update wp_woocommerce_order_itemmeta set meta_value='{0}' where order_item_id={1} and meta_key='{2}'; ", obj.tax_rate, obj.order_item_id, "rate_percent"));
                    }
                    else
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}-{1}-{2} TAX-1','tax','{3}'); ", obj.tax_rate_country, obj.tax_rate_state, obj.tax_rate_state, model.OrderPostStatus.order_id));

                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.tax_rate_state, model.OrderPostStatus.order_id, "tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'tax_amount','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.amount, model.OrderPostStatus.order_id, "tax"));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}';", obj.tax_rate, model.OrderPostStatus.order_id, "tax"));
                    }
                }

                /// step 8 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed',post_modified = '{1}',post_modified_gmt = '{2}',post_excerpt = '{3}' where id = {4}; ", model.OrderPostStatus.status, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"), model.OrderPostStatus.Search, model.OrderPostStatus.order_id));
                strSql.Append(string.Format(" update wp_posts set post_status = '{0}',post_modified = '{1}',post_modified_gmt = '{2}' where id = {3}; ", model.OrderPostStatus.status, cDate.ToString("yyyy-MM-dd HH:mm:ss"), cUTFDate.ToString("yyyy-MM-dd HH:mm:ss"), model.OrderPostStatus.order_id));

                /////step 9 : Reduce Stock
                //strSql.Append("delete from product_stock_register where tran_type ='SO' and tran_id = " + model.OrderPostStatus.order_id + ";");
                //strSql.Append("insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)");
                //strSql.Append("select 'SO', opl.order_id, (case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) fk_product,");
                //strSql.Append("(select wp_w.rowid from wp_warehouse wp_w where wp_w.is_system = 1 limit 1) warehouse_id,p.post_date,opl.product_qty,'I'");
                //strSql.Append("from wp_wc_order_product_lookup opl inner join wp_posts p on p.id = opl.order_id where p.id = " + model.OrderPostStatus.order_id + ";");

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
        public static long AddOrderFee(OrderOtherItemsModel obj)
        {
            long result = 0;
            try
            {
                string strSQL = string.Empty;
                if (obj.order_item_id > 0)
                {
                    strSQL = string.Format("update wp_woocommerce_order_items set order_item_name ='{0}' where order_item_id={1};update wp_woocommerce_order_itemmeta set meta_value='{2}' where order_item_id={3} and meta_key in ('_fee_amount','_line_total'); ", obj.item_name, obj.order_item_id, obj.amount, obj.order_item_id);
                    if (SQLHelper.ExecuteNonQuery(strSQL) > 0)
                        result = obj.order_item_id;
                }
                else
                {
                    SqlParameter[] parameters =
                {
                    new SqlParameter("@order_item_name", obj.item_name),
                    new SqlParameter("@order_item_type", obj.item_type),
                    new SqlParameter("@order_id", obj.order_id)
                };
                    strSQL = "INSERT INTO wp_woocommerce_order_items(order_item_name,order_item_type,order_id) SELECT @order_item_name,@order_item_type,@order_id; SELECT LAST_INSERT_ID();";
                    result = Convert.ToInt64(SQLHelper.ExecuteScalar(strSQL, parameters));
                    if (result > 0)
                    {
                        strSQL = string.Format("insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) values ('{0}','_fee_amount',{1}),('{2}','_tax_class',''),('{3}','tax_status','taxable'),('{4}','_line_total',{5}),('{6}','_line_tax','0') ", result, obj.amount, result, result, result, obj.amount, result);
                        SQLHelper.ExecuteNonQuery(strSQL);
                    }
                }
            }
            catch { }
            return result;
        }
        public static int RemoveOrderFee(OrderOtherItemsModel obj)
        {
            int result = 0;
            try
            {
                string strSQL = string.Format("delete from wp_woocommerce_order_itemmeta where order_item_id={1};delete from wp_woocommerce_order_items where order_item_id={1};", obj.order_item_id, obj.order_item_id);
                result = SQLHelper.ExecuteNonQuery(strSQL);
            }
            catch { }
            return result;
        }

        public static int UpdatePaymentInvoice(List<OrderPostMetaModel> model)
        {
            int result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strSql_insert = string.Empty, Payment_method = string.Empty;
                StringBuilder strSql = new StringBuilder();
                foreach (OrderPostMetaModel obj in model)
                {
                    strSql_insert += (strSql_insert.Length > 0 ? " union all " : "") + string.Format("select '{0}' post_id,'{1}' meta_key,'{2}' meta_value", obj.post_id, obj.meta_key, obj.meta_value);
                    strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", obj.meta_value, obj.post_id, obj.meta_key));
                    if (obj.meta_key.ToLower() == "_payment_method") Payment_method = obj.meta_value;
                }
                strSql_insert = "insert into wp_postmeta (post_id,meta_key,meta_value) select * from (" + strSql_insert + ") as tmp where tmp.meta_key not in (select meta_key from wp_postmeta where post_id = " + model[0].post_id.ToString() + ");";
                strSql.Append(strSql_insert);
                if (Payment_method.ToLower() == "podium")
                {
                    //strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1};", "wc-pendingpodiuminv", model[0].post_id));
                    strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1} and post_status != 'wc-on-hold';", "wc-pendingpodiuminv", model[0].post_id));
                    //// step 3 : Add Order Note
                    strSql.Append("insert into wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) ");
                    strSql.Append(string.Format("values ({0}, 'WooCommerce', 'woocommerce@laylasleep.com', '', '', '{1}', '{2}', '{3}', '0', '1', 'WooCommerce', 'order_note', '0', '0');", model[0].post_id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), "Order status changed from Pending payment to Pending Podium Invoice."));
                }
                else
                {
                    strSql.Append(string.Format("update wp_posts set post_status = '{0}' where id = {1} and post_status != 'wc-on-hold';", "wc-pending", model[0].post_id));
                }

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch { }
            return result;
        }
        /// <summary>
        /// Update Podium payment cancel after 72 Hours and Update hold order status processing before 48-hour.
        /// </summary>
        /// <returns></returns>
        public static DataTable GetPodiumOrdersList()
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { };
                string strSQl = "SELECT id,post_date,pm.meta_value podium_uid FROM wp_posts p inner join wp_postmeta pm on pm.post_id = p.id and pm.meta_key = '_podium_uid'"
                                + " WHERE post_status = 'wc-pendingpodiuminv' AND post_type = 'shop_order' AND post_modified > DATE_SUB(now(), INTERVAL 3 DAY);"
                                + " update wp_posts set post_status = 'wc-cancelnopay',post_modified_gmt = UTC_TIMESTAMP() WHERE post_status = 'wc-pendingpodiuminv' AND post_type = 'shop_order' AND post_modified < DATE_SUB(now(), INTERVAL 3 DAY);"
                                + " update wp_posts set post_status = 'wc-processing' WHERE post_status = 'wc-on-hold' AND post_type = 'shop_order'"
                                + " and id in (select post_id from wp_postmeta pmu where pmu.meta_key = '_release_date' and REGEXP_REPLACE(pmu.meta_value,'[^0-9]+','') >= DATE_FORMAT(DATE_SUB(now(), INTERVAL 2 DAY), '%m%d%Y'))";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static int UpdatePodiumStatus(OrderPodiumDetailsModel model)
        {
            int result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                StringBuilder strSql = new StringBuilder();
                ///step 1 : Update Podium payment receipt
                strSql.Append(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value) select {0} post_id,meta_key,meta_value from ", model.post_id));
                strSql.Append(string.Format("(select '_podium_payment_uid' meta_key,'{0}' meta_value union all select '_podium_location_uid' meta_key,'{1}' meta_value union all select '_podium_invoice_number' meta_key,'{2}' meta_value union all select '_podium_status' meta_key,'PAID' meta_value) tt ", model.payment_uid, model.location_uid, model.invoice_number));
                strSql.Append(string.Format("where tt.meta_key not in (select meta_key from wp_postmeta where post_id = {0});", model.post_id));

                strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", model.payment_uid, model.post_id, "_podium_payment_uid"));
                strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", model.location_uid, model.post_id, "_podium_location_uid"));
                strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", model.invoice_number, model.post_id, "_podium_invoice_number"));
                strSql.Append(string.Format("update wp_postmeta set meta_value='{0}' where post_id='{1}' and meta_key='{2}';", "PAID", model.post_id, "_podium_status"));
                ///step 2 : Update Order status wc-processing
                strSql.Append(string.Format("update wp_posts set post_status='{0}',post_modified_gmt='{1}' where id = {2};", "wc-processing", cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), model.post_id));
                ///step 3 : Add Order Note
                strSql.Append("insert into wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) ");
                strSql.Append(string.Format("values ({0}, 'WooCommerce', 'woocommerce@laylasleep.com', '', '', '{1}', '{2}', '{3}{4}', '0', '1', 'WooCommerce', 'order_note', '0', '0');", model.post_id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), model.order_note, cDate.ToString("yyyy/MM/dd HH:mm:ss")));
                ///step 4 : Reduce Stock
                strSql.Append("delete from product_stock_register where tran_type ='SO' and tran_id = " + model.post_id + ";");
                strSql.Append("insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)");
                strSql.Append("select 'SO', opl.order_id, (case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) fk_product,");
                strSql.Append("(select wp_w.rowid from wp_warehouse wp_w where wp_w.is_system = 1 limit 1) warehouse_id,p.post_date,opl.product_qty,'I'");
                strSql.Append("from wp_wc_order_product_lookup opl inner join wp_posts p on p.id = opl.order_id where p.id = " + model.post_id + ";");

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                //if (!string.IsNullOrEmpty(model.payment_uid)) PurchaseOrderRepository.CreateOrders(model.post_id);
            }
            catch { }
            return result;
        }
        public static int UpdatePaypalStatus(OrderPostMetaModel model)
        {
            int result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                StringBuilder strSql = new StringBuilder();
                ///step 1 : Update Podium payment receipt
                strSql.Append(string.Format("insert into wp_postmeta (post_id,meta_key,meta_value) SELECT * FROM (SELECT {0},'{1}','{2}') AS tmp WHERE NOT EXISTS (SELECT meta_key FROM wp_postmeta WHERE post_id = {3} and meta_key = '{4}');", model.post_id, model.meta_key, model.meta_value, model.post_id, model.meta_key));
                strSql.Append(string.Format("update wp_postmeta set meta_value = '{0}' where post_id = '{1}' and meta_key = '{2}' ; ", model.meta_value, model.post_id, model.meta_key));

                ///step 2 : Update Order status wc-processing
                strSql.Append(string.Format("update wp_posts set post_status='{0}',post_modified_gmt='{1}' where id = {2};", "wc-processing", cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), model.post_id));
                ///step 3 : Add Order Note
                //strSql.Append("insert into wp_comments(comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) ");
                //strSql.Append(string.Format("values ({0}, 'WooCommerce', 'woocommerce@laylasleep.com', '', '', '{1}', '{2}', '{3}{4}', '0', '1', 'WooCommerce', 'order_note', '0', '0');", model.post_id, cDate.ToString("yyyy/MM/dd HH:mm:ss"), cUTFDate.ToString("yyyy/MM/dd HH:mm:ss"), model.order_note, cDate.ToString("yyyy/MM/dd HH:mm:ss")));
                ///step 4 : Reduce Stock
                strSql.Append("delete from product_stock_register where tran_type ='SO' and tran_id = " + model.post_id + ";");
                strSql.Append("insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)");
                strSql.Append("select 'SO', opl.order_id, (case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) fk_product,");
                strSql.Append("(select wp_w.rowid from wp_warehouse wp_w where wp_w.is_system = 1 limit 1) warehouse_id,p.post_date,opl.product_qty,'I'");
                strSql.Append("from wp_wc_order_product_lookup opl inner join wp_posts p on p.id = opl.order_id where p.id = " + model.post_id + ";");

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                //if (model.meta_value.ToUpper() == "COMPLETED") PurchaseOrderRepository.CreateOrders(model.post_id);
            }
            catch (Exception ex) { throw ex; }
            return result;
        }

        //Refund Order
        public static long AddRefundOrderPost(long parent_id)
        {
            long result = 0;
            try
            {
                OrderPostModel model = new OrderPostModel();
                model.ID = 0;
                model.post_author = "1";
                model.post_date = CommonDate.CurrentDate();
                model.post_date_gmt = CommonDate.UtcDate();
                model.post_content = string.Empty;
                model.post_title = "Refund &ndash; " + model.post_date_gmt.ToString("MMMM dd, yyyy @ HH:mm tt");
                model.post_excerpt = string.Empty;
                model.post_status = "wc-completed";// "draft";
                model.comment_status = "closed";
                model.ping_status = "closed";
                model.post_password = string.Empty;
                model.post_name = "refund-" + model.post_date_gmt.ToString("MMM-dd-yyyy-HHmm-tt").ToLower();
                model.to_ping = string.Empty;
                model.pinged = string.Empty;
                model.post_modified = model.post_date;
                model.post_modified_gmt = model.post_date_gmt;
                model.post_content_filtered = string.Empty;
                model.post_parent = parent_id.ToString();
                model.post_type = "shop_order_refund";
                //model.guid = string.Format("{0}?{1}={2}", Net.Host, model.post_type, model.post_name);
                model.guid = string.Format("{0}?{1}={2}", "http://173.247.242.204/~rpsisr/woo/", "post_type=shop_order_refund&p", "");
                model.menu_order = "0";
                model.post_mime_type = string.Empty;
                model.comment_count = "0";

                string strSQL = "INSERT INTO wp_posts(post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,post_status, comment_status, ping_status, post_password, post_name,"
                                    + " to_ping, pinged, post_modified, post_modified_gmt,post_content_filtered, post_parent, guid, menu_order,post_type, post_mime_type, comment_count)"
                                    + " VALUES(@post_author,@post_date,@post_date_gmt,@post_content,@post_title,@post_excerpt,@post_status,@comment_status,@ping_status,@post_password,@post_name,"
                                    + " @to_ping,@pinged,@post_modified,@post_modified_gmt,@post_content_filtered,@post_parent,@guid,@menu_order,@post_type,@post_mime_type,@comment_count)";

                strSQL += "; insert into wp_wc_order_stats (order_id,parent_id,date_created,date_created_gmt,num_items_sold,total_sales,tax_total,shipping_total,net_total,returning_customer,status,customer_id)";
                strSQL += " SELECT LAST_INSERT_ID(),@post_parent,@post_date,@post_date_gmt,'0','0','0','0','0','0',@post_status,'0' ; SELECT LAST_INSERT_ID();";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@post_author", model.post_author),
                    new SqlParameter("@post_date", model.post_date),
                    new SqlParameter("@post_date_gmt", model.post_date_gmt),
                    new SqlParameter("@post_content", model.post_content),
                    new SqlParameter("@post_title", model.post_title),
                    new SqlParameter("@post_excerpt", model.post_excerpt),
                    new SqlParameter("@post_status", model.post_status),
                    new SqlParameter("@comment_status", model.comment_status),
                    new SqlParameter("@ping_status", model.ping_status),
                    new SqlParameter("@post_password", model.post_password),
                    new SqlParameter("@post_name", model.post_name),
                    new SqlParameter("@to_ping", model.to_ping),
                    new SqlParameter("@pinged", model.pinged),
                    new SqlParameter("@post_modified", model.post_modified),
                    new SqlParameter("@post_modified_gmt", model.post_modified_gmt),
                    new SqlParameter("@post_content_filtered", model.post_content_filtered),
                    new SqlParameter("@post_parent", model.post_parent),
                    new SqlParameter("@guid", model.guid),
                    new SqlParameter("@menu_order", model.menu_order),
                    new SqlParameter("@post_type", model.post_type),
                    new SqlParameter("@post_mime_type", model.post_mime_type),
                    new SqlParameter("@comment_count", model.comment_count)
                };
                result = Convert.ToInt64(SQLHelper.ExecuteScalar(strSQL, parameters));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            return result;
        }
        public static int SaveRefundOrder(OrderModel model)
        {
            int result = 0;
            try
            {
                long n_orderid = 0;
                n_orderid = AddRefundOrderPost(model.OrderPostStatus.order_id);
                if (n_orderid > 0)
                {
                    DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                    /// step 1 : wp_wc_order_stats
                    StringBuilder strSql = new StringBuilder(string.Format("update wp_wc_order_stats set num_items_sold='{0}',total_sales='{1}',tax_total='{2}',shipping_total='{3}',net_total='{4}',customer_id='{5}' where order_id='{6}';", model.OrderPostStatus.num_items_sold, model.OrderPostStatus.total_sales,
                            model.OrderPostStatus.tax_total, model.OrderPostStatus.shipping_total, model.OrderPostStatus.net_total, model.OrderPostStatus.customer_id, n_orderid));
                    var i = 0;
                    /// step 2 : wp_postmeta 
                    strSql.Append("insert into wp_postmeta (post_id,meta_key,meta_value) values");
                    foreach (OrderPostMetaModel obj in model.OrderPostMeta)
                    {
                        if (++i == model.OrderPostMeta.Count)
                            strSql.Append(string.Format("('{0}','{1}','{2}'); ", n_orderid, obj.meta_key, obj.meta_value));
                        else
                            strSql.Append(string.Format("('{0}','{1}','{2}'), ", n_orderid, obj.meta_key, obj.meta_value));
                    }
                    /// step 3 : wp_woocommerce_order_items
                    foreach (OrderProductsModel obj in model.OrderProducts)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}'); ", obj.product_name, "line_item", n_orderid));
                        strSql.Append(" insert into wp_wc_order_product_lookup(order_item_id,order_id,product_id,variation_id,customer_id,date_created,product_qty,product_net_revenue,product_gross_revenue,coupon_amount,tax_amount,shipping_amount,shipping_tax_amount,refunded_item_id) ");
                        strSql.Append(string.Format(" select LAST_INSERT_ID(),'{0}','{1}','{2}','{3}','{4}','-{5}','-{6}','-{7}','{8}','-{9}','{10}','{11}','{12}'; ", n_orderid, obj.product_id, obj.variation_id, model.OrderPostStatus.customer_id,
                                cDate.ToString("yyyy/MM/dd HH:mm:ss"), obj.quantity, (obj.total - obj.discount), (obj.total - obj.discount + obj.tax_amount), 0, obj.tax_amount, obj.shipping_amount, obj.shipping_tax_amount, obj.order_item_id));
                    }
                    /// step 4 : wp_woocommerce_order_itemmeta
                    strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'_product_id',product_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_variation_id',variation_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_qty',product_qty from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_tax_class','' from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_subtotal_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_total',product_net_revenue from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax',tax_amount from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_refunded_item_id',refunded_item_id from wp_wc_order_product_lookup where order_id = {0}", n_orderid));
                    strSql.Append(string.Format(" union all select order_item_id,'_line_tax_data','0' from wp_wc_order_product_lookup where order_id = {0};", n_orderid));
                    /// step 5 : wp_woocommerce_order_items

                    string ID = Guid.NewGuid().ToString("N");
                    string gid = ID.Substring(0, 4) + "-" + ID.Substring(4, 4) + "-" + ID.Substring(8, 4) + "-" + ID.Substring(12, 4);
                    string code = gid.ToUpper();
                    foreach (OrderOtherItemsModel obj in model.OrderOtherItems)
                    {
                        if (obj.amount != 0)
                        {
                            strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", obj.item_name, obj.item_type, n_orderid));

                            if (obj.item_type == "gift_card")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('{0}','{1}','{2}');", code, obj.item_type, n_orderid));

                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'cost','-{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.amount, n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.order_item_id, n_orderid, obj.item_type));
                            }
                            else if (obj.item_type == "fee")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'tax_status','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}'", "taxable", n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_line_total','-{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}'", obj.amount, n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='{2}';", obj.order_item_id, n_orderid, obj.item_type));
                            }
                            else if (obj.item_type == "shipping")
                            {
                                strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select max(order_item_id),'cost','-{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'", obj.amount, n_orderid, obj.item_type));
                                strSql.Append(string.Format(" union all select max(order_item_id),'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id = {1} and order_item_type = '{2}'; ", obj.order_item_id, n_orderid, obj.item_type));
                            }
                        }
                    }
                    /// step 6 : wp_woocommerce_order_items (Tax)
                    foreach (OrderTaxItemsModel obj in model.OrderTaxItems)
                    {
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_items(order_item_name,order_item_type,order_id) value('','tax','{0}');", n_orderid));
                        strSql.Append(string.Format(" insert into wp_woocommerce_order_itemmeta(order_item_id,meta_key,meta_value) select order_item_id,'label','{0} Tax' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.tax_rate_state, n_orderid));
                        strSql.Append(string.Format(" union all select order_item_id,'tax_amount','-{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.amount, n_orderid));
                        strSql.Append(string.Format(" union all select order_item_id,'rate_percent','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax'", obj.tax_rate, n_orderid));
                        strSql.Append(string.Format(" union all select order_item_id,'_refunded_item_id','{0}' from wp_woocommerce_order_items where order_id={1} and order_item_type='tax';", obj.order_item_id, n_orderid));
                    }

                    result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
                }
            }
            catch { }
            return result;
        }
        public static int UpdateRefundedGiftCard(OrderModel model)
        {
            int result = 0;
            try
            {
                long order_item_id = 0; string order_item_name = ""; string order_item_type = "";
                string Userid = CommanUtilities.Provider.GetCurrent().UserID.ToString();
                DataTable dt = OrderRepository.GiftCardDetails(model.order_id);
                StringBuilder strSql = new StringBuilder();
                foreach (DataRow dr in dt.Rows)
                {
                    order_item_id = Convert.ToInt64(dr["order_item_id"]);
                    order_item_name = dr["order_item_name"].ToString();
                    order_item_type = dr["order_item_type"].ToString();
                    DataTable dtMeta = OrderRepository.GiftCardMetaItem(order_item_id);
                    if (dtMeta.Rows.Count > 0)
                    {
                        int metaAmount = Convert.ToInt32(dtMeta.Rows[0]["amount"]);
                        int gcid = Convert.ToInt32(dtMeta.Rows[0]["gc_id"]);
                        decimal RefundAmount = 0;
                        if (model.NetTotal > metaAmount && model.NetTotal > 0)
                        {
                            RefundAmount = metaAmount;
                            strSql.Append(string.Format("Update wp_woocommerce_gc_cards set  is_active='on',remaining=remaining + {0} where id={1};", RefundAmount, gcid));
                            strSql.Append(string.Format("Update wp_woocommerce_gc_activity set  amount=amount-{0} where object_id={1} and type='used';", RefundAmount, order_item_id));
                            strSql.Append(string.Format("Insert into wp_woocommerce_gc_activity(type,user_id,user_email,object_id,gc_id,gc_code,amount,date,note) " +
                                "Select 'refunded', {1}, user_email, object_id, gc_id, gc_code, {2}, DATEDIFF(s,'1970-01-01 00:00:00', GETUTCDATE()), note from wp_woocommerce_gc_activity where object_id = {0} and type = 'used'; ", order_item_id, Userid, RefundAmount));
                            SendGiftCardMailInvoice(order_item_id, RefundAmount);
                            model.NetTotal = model.NetTotal - metaAmount;
                        }
                        else if (model.NetTotal < metaAmount && model.NetTotal > 0)
                        {
                            RefundAmount = model.NetTotal;
                            strSql.Append(string.Format("Update wp_woocommerce_gc_cards set  is_active='on',remaining=remaining + {0} where id={1};", RefundAmount, gcid));
                            strSql.Append(string.Format("Update wp_woocommerce_gc_activity set  amount=amount-{0} where object_id={1} and type='used';", RefundAmount, order_item_id));
                            strSql.Append(string.Format("Insert into wp_woocommerce_gc_activity(type,user_id,user_email,object_id,gc_id,gc_code,amount,date,note) " +
                                "Select 'refunded', {1}, user_email, object_id, gc_id, gc_code, {2}, DATEDIFF(s,'1970-01-01 00:00:00', GETUTCDATE()), note from wp_woocommerce_gc_activity where object_id = {0} and type = 'used'; ", order_item_id, Userid, RefundAmount));
                            SendGiftCardMailInvoice(order_item_id, RefundAmount);
                            model.NetTotal = model.NetTotal - RefundAmount;
                        }
                    }
                }
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
        public static DataTable GiftCardMetaItem(long OrderItemID)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@OrderItemID", OrderItemID)
                };
                string strSQl = "Select * from wp_woocommerce_gc_activity where object_id=@OrderItemID and type='used';";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable SendGiftCardMailInvoice(long order_item_id, decimal NetTotal)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_item_id", order_item_id)
                };
                string strSQl = "Select * from wp_woocommerce_gc_cards where order_item_id=@order_item_id;";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
                if (dt.Rows.Count > 0)
                {
                    GiftCardModel model = new GiftCardModel();
                    model.amount = NetTotal;
                    model.code = dt.Rows[0]["code"].ToString();
                    model.sender = dt.Rows[0]["sender"].ToString();
                    model.order_id = Convert.ToInt64(dt.Rows[0]["order_id"]);
                    String renderedHTML = Controllers.EmailNotificationsController.RenderViewToString("EmailNotifications", "Giftcard", model);
                    SendEmail.SendEmails(dt.Rows[0]["recipient"].ToString(), "You have received a $" + NetTotal + " Gift Card from " + model.sender + "", renderedHTML);
                }

            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GiftCardDetails(long OrderID)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID)
                };
                string strSQl = "Select order_item_id,order_item_name,order_item_type,order_id from wp_woocommerce_order_items where order_id=@order_id and order_item_type='gift_card'";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public int ChangeOrderStatus(OrderPostStatusModel model, string ID)
        {
            try
            {
                string strsql = string.Format("update wp_wc_order_stats set status=@status where order_id  in ({0}); ", ID)
                    + string.Format("update wp_posts set post_status=@status,post_modified=@post_modified,post_modified_gmt=@post_modified_gmt where id  in ({0}); ", ID);
                SqlParameter[] para =
                {
                    new SqlParameter("@status", model.status),
                    new SqlParameter("@post_modified", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                    new SqlParameter("@post_modified_gmt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                //if (result > 0 && model.status == "wc-processing")
                //{
                //    var orders = ID.Split(',');
                //    for (int i = 0; i < orders.Length; i++)
                //    {
                //        try
                //        {
                //            OrderPostStatusModel o = new OrderPostStatusModel();
                //            o.order_id = Convert.ToInt64(orders[i]);
                //            SplitOrder(o);
                //        }
                //        catch { }
                //    }
                //}
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        //Get Order info
        public static DataTable GetOrders(long OrderID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = "'1' is_edit";
                if (!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                    strWhr = " coalesce((SELECT '1' FROM wp_postmeta pm_em WHERE pm_em.post_id=os.id and meta_key = 'employee_id' and meta_value = '" + CommanUtilities.Provider.GetCurrent().UserID + " '),'0') is_edit";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID)
                };
                string strSQl = "select os.id order_id,convert(varchar,os.post_date,101) date_created,max(case meta_key when '_customer_user' then meta_value else '' end) customer_id,"
                            + " (select CONCAT(User_Login, ' (#',id,' - ', user_email, ')') from wp_users u where u.id = max(case meta_key when '_customer_user' then meta_value else '' end)) customer_name,os.post_status status,"
                            + " os.post_excerpt,0 shipping_total,max(case meta_key when '_payment_method' then meta_value else '' end) payment_method,max(case meta_key when '_payment_method_title' then meta_value else '' end) payment_method_title,"
                            + " max(case meta_key when '_customer_ip_address' then meta_value else '' end) ip_address,max(case meta_key when '_created_via' then meta_value else '' end) created_via,"
                            + " max(case meta_key when '_billing_first_name' then meta_value else '' end) b_first_name,max(case meta_key when '_billing_last_name' then meta_value else '' end) b_last_name,"
                            + " max(case meta_key when '_billing_company' then meta_value else '' end) b_company,max(case meta_key when '_billing_address_1' then meta_value else '' end) b_address_1,max(case meta_key when '_billing_address_2' then meta_value else '' end) b_address_2,"
                            + " max(case meta_key when '_billing_postcode' then meta_value else '' end) b_postcode,max(case meta_key when '_billing_city' then meta_value else '' end) b_city,"
                            + " max(case meta_key when '_billing_country' then meta_value else '' end) b_country,max(case meta_key when '_billing_state' then meta_value else '' end) b_state,"
                            + " max(case meta_key when '_billing_email' then meta_value else '' end) b_email,max(case meta_key when '_billing_phone' then meta_value else '' end) b_phone,"
                            + " max(case meta_key when '_shipping_first_name' then meta_value else '' end) s_first_name,max(case meta_key when '_shipping_last_name' then meta_value else '' end) s_last_name,"
                            + " max(case meta_key when '_shipping_company' then meta_value else '' end) s_company,max(case meta_key when '_shipping_address_1' then meta_value else '' end) s_address_1,max(case meta_key when '_shipping_address_2' then meta_value else '' end) s_address_2,"
                            + " max(case meta_key when '_shipping_postcode' then meta_value else '' end) s_postcode,max(case meta_key when '_shipping_city' then meta_value else '' end) s_city,"
                            + " max(case meta_key when '_shipping_country' then meta_value else '' end) s_country,max(case meta_key when '_shipping_state' then meta_value else '' end) s_state,"
                            + " max(case meta_key when '_paypal_id' then meta_value else '' end) paypal_id,max(case meta_key when 'taskuidforsms' then meta_value else '' end) podium_id,max(case meta_key when '_podium_payment_uid' then meta_value else '' end) podium_payment_uid,"
                            + "(select distinct order_item_type FROM wp_woocommerce_order_items WHERE order_id = @order_id and order_item_type='gift_card') as IsGift,"
                            + "(Select COALESCE(sum(amount),0)  from wp_woocommerce_gc_activity where type='refunded' and object_id in ( " 
                            + "Select order_item_id from wp_woocommerce_order_items where order_id = @order_id and order_item_type = 'gift_card')) as GiftCardRefundedAmount,"
                            + "(select Sum(isnull(cast(meta_value as float),0)) FROM wp_woocommerce_order_itemmeta where  meta_key='amount' and order_item_id in (select order_item_id FROM wp_woocommerce_order_items WHERE order_id = @order_id and order_item_type = 'gift_card')) as giftCardAmount,"
                            + " (SELECT count(split_id) FROM split_record WHERE main_order_id=os.id) is_shiped," + strWhr
                            + " from wp_posts os inner join wp_postmeta pm on pm.post_id = os.id"
                            + " where os.id = @order_id "
                            + " group by os.id,os.post_date,os.post_status,os.post_excerpt";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static List<OrderProductsModel> GetOrderProductList(long OrderID)
        {
            List<OrderProductsModel> _list = new List<OrderProductsModel>();
            try
            {
                OrderProductsModel productsModel = new OrderProductsModel();
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "OITEM"),
                    new SqlParameter("order_id", OrderID)
                };
                SqlDataReader sdr = SQLHelper.ExecuteReader("wp_posts_order_search", parameters);
                while (sdr.Read())
                {
                    productsModel = new OrderProductsModel();
                    if (sdr["order_item_id"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["order_item_id"].ToString().Trim()))
                        productsModel.order_item_id = Convert.ToInt64(sdr["order_item_id"]);
                    else
                        productsModel.order_item_id = 0;

                    productsModel.product_type = (sdr["order_item_type"] != Convert.DBNull) ? sdr["order_item_type"].ToString() : "line_item";
                    productsModel.product_name = (sdr["order_item_name"] != Convert.DBNull) ? sdr["order_item_name"].ToString() : "";

                    if (productsModel.product_type == "line_item")
                    {
                        productsModel.product_img = (sdr["p_img"] != Convert.DBNull) ? sdr["p_img"].ToString() : "";
                        if (sdr["p_id"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["p_id"].ToString().Trim()))
                            productsModel.product_id = Convert.ToInt64(sdr["p_id"]);
                        else
                            productsModel.product_id = 0;
                        if (sdr["v_id"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["v_id"].ToString().Trim()))
                            productsModel.variation_id = Convert.ToInt64(sdr["v_id"]);
                        else
                            productsModel.variation_id = 0;

                        if (sdr["line_subtotal"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_subtotal"].ToString().Trim()))
                            productsModel.price = decimal.Parse(sdr["line_subtotal"].ToString());
                        else
                            productsModel.price = 0;
                        if (sdr["qty"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["qty"].ToString().Trim()))
                            productsModel.quantity = decimal.Parse(sdr["qty"].ToString().Trim());
                        else
                            productsModel.quantity = 0;
                        if (sdr["sale_price"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["sale_price"].ToString().Trim()))
                            productsModel.sale_price = decimal.Parse(sdr["sale_price"].ToString().Trim());
                        else
                            productsModel.sale_price = 0;
                        if (productsModel.quantity > 0)
                            productsModel.reg_price = productsModel.price / productsModel.quantity;
                        else
                            productsModel.reg_price = 0;
                        productsModel.total = productsModel.price;

                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        productsModel.discount = productsModel.discount <= productsModel.total ? productsModel.total - productsModel.discount : 0;
                        if (sdr["tax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["tax"].ToString().Trim()))
                            productsModel.tax_amount = decimal.Parse(sdr["tax"].ToString().Trim());
                        else
                            productsModel.tax_amount = productsModel.price;

                        productsModel.is_free = productsModel.total > 0 ? false : true; productsModel.group_id = 0;
                        if (sdr["free_itmes"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["free_itmes"].ToString().Trim()))
                            productsModel.free_itmes = sdr["free_itmes"].ToString().Trim();
                        else
                            productsModel.free_itmes = "{}";
                        if (sdr["meta_data"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["meta_data"].ToString().Trim()))
                            productsModel.meta_data = sdr["meta_data"].ToString().Trim();
                        else
                            productsModel.meta_data = "[{\"id\": 0,\"item_id\": " + productsModel.order_item_id.ToString() + ", \"key\": \"\", \"value\": \"\"}]";
                        ///// free item
                        //if (productsModel.product_id == 78676) { productsModel.is_free = true; }
                        //else if (productsModel.product_id == 632713) { productsModel.is_free = true; }
                        //else productsModel.is_free = false;

                        /// 
                        //if (productsModel.product_id == 611172)
                        //{
                        //    productsModel.group_id = 78676;
                        //    productsModel.free_itmes = "{\"78676\":2}";
                        //}
                        //else if (productsModel.product_id == 118)
                        //{
                        //    productsModel.group_id = 632713;
                        //    productsModel.free_itmes = "{\"632713\":2}";
                        //}
                        //else
                        //{
                        //    productsModel.group_id = 0;
                        //    productsModel.free_itmes = string.Empty;
                        //}
                    }
                    else if (productsModel.product_type == "coupon")
                    {
                        if (sdr["discount_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount_amount"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["discount_amount"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        if (sdr["meta_data"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["meta_data"].ToString().Trim()))
                            productsModel.meta_data = sdr["meta_data"].ToString().Trim();
                        else
                            productsModel.meta_data = "{}";
                    }
                    else if (productsModel.product_type == "fee")
                    {
                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    else if (productsModel.product_type == "gift_card")
                    {
                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    else if (productsModel.product_type == "shipping")
                    {
                        if (sdr["shipping_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["shipping_amount"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["shipping_amount"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    else if (productsModel.product_type == "refund")
                    {
                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString().Trim());
                        else
                            productsModel.total = 0;
                    }
                    else if (productsModel.product_type == "refund_items")
                    {
                        productsModel.product_id = 0;
                        productsModel.variation_id = 0;
                        if (sdr["qty"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["qty"].ToString().Trim()))
                            productsModel.quantity = decimal.Parse(sdr["qty"].ToString().Trim());
                        else
                            productsModel.quantity = 0;

                        if (sdr["line_total"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["line_total"].ToString().Trim()))
                            productsModel.total = decimal.Parse(sdr["line_total"].ToString());
                        else
                            productsModel.total = 0;
                        if (sdr["tax"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["tax"].ToString().Trim()))
                            productsModel.tax_amount = decimal.Parse(sdr["tax"].ToString().Trim());
                        else
                            productsModel.tax_amount = 0;
                        if (sdr["discount_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["discount_amount"].ToString().Trim()))
                            productsModel.discount = decimal.Parse(sdr["discount_amount"].ToString().Trim());
                        else
                            productsModel.discount = 0;
                        productsModel.discount = productsModel.discount <= productsModel.total ? productsModel.total - productsModel.discount : 0;
                        if (sdr["shipping_amount"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["shipping_amount"].ToString().Trim()))
                            productsModel.shipping_amount = decimal.Parse(sdr["shipping_amount"].ToString().Trim());
                        else
                            productsModel.shipping_amount = 0;
                    }
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static OrderModel OrderInvoice(long OrderID)
        {
            OrderModel obj = new OrderModel();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID)
                };
                string strSQl = "select os.id order_id,DATE_FORMAT(os.post_date,'%m/%d/%Y') date_created,"
                            + " max(case meta_key when '_payment_method' then meta_value else '' end) payment_method,max(case meta_key when '_payment_method_title' then meta_value else '' end) payment_method_title,"
                            + " max(case meta_key when '_billing_first_name' then meta_value else '' end) b_first_name,max(case meta_key when '_billing_last_name' then meta_value else '' end) b_last_name,"
                            + " max(case meta_key when '_billing_company' then meta_value else '' end) b_company,max(case meta_key when '_billing_address_1' then meta_value else '' end) b_address_1,max(case meta_key when '_billing_address_2' then meta_value else '' end) b_address_2,"
                            + " max(case meta_key when '_billing_postcode' then meta_value else '' end) b_postcode,max(case meta_key when '_billing_city' then meta_value else '' end) b_city,"
                            + " max(case meta_key when '_billing_country' then meta_value else '' end) b_country,max(case meta_key when '_billing_state' then meta_value else '' end) b_state,"
                            + " max(case meta_key when '_billing_email' then meta_value else '' end) b_email,max(case meta_key when '_billing_phone' then meta_value else '' end) b_phone,"
                            + " max(case meta_key when '_shipping_first_name' then meta_value else '' end) s_first_name,max(case meta_key when '_shipping_last_name' then meta_value else '' end) s_last_name,"
                            + " max(case meta_key when '_shipping_company' then meta_value else '' end) s_company,max(case meta_key when '_shipping_address_1' then meta_value else '' end) s_address_1,max(case meta_key when '_shipping_address_2' then meta_value else '' end) s_address_2,"
                            + " max(case meta_key when '_shipping_postcode' then meta_value else '' end) s_postcode,max(case meta_key when '_shipping_city' then meta_value else '' end) s_city,"
                            + " max(case meta_key when '_shipping_country' then meta_value else '' end) s_country,max(case meta_key when '_shipping_state' then meta_value else '' end) s_state,"
                            + " max(case meta_key when '_paypal_id' then meta_value else '' end) paypal_id,max(case meta_key when 'taskuidforsms' then meta_value else '' end) podium_id,max(case meta_key when '_podium_payment_uid' then meta_value else '' end) podium_payment_uid"
                            + " from wp_posts os inner join wp_postmeta pm on pm.post_id = os.id"
                            + " where os.id = @order_id"
                            + " group by os.id,os.post_date";
                SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl, parameters);
                while (sdr.Read())
                {
                    obj.order_id = (sdr["order_id"] != Convert.DBNull) ? Convert.ToInt64(sdr["order_id"]) : 0;
                    obj.order_date = (sdr["date_created"] != Convert.DBNull) ? sdr["date_created"].ToString() : "";
                    obj.payment_method = (sdr["payment_method"] != Convert.DBNull) ? sdr["payment_method"].ToString() : "";
                    obj.payment_method_title = (sdr["payment_method_title"] != Convert.DBNull) ? sdr["payment_method_title"].ToString() : "";
                    obj.b_first_name = (sdr["b_first_name"] != Convert.DBNull) ? sdr["b_first_name"].ToString() : "";
                    obj.b_last_name = (sdr["b_last_name"] != Convert.DBNull) ? sdr["b_last_name"].ToString() : "";
                    obj.b_company = (sdr["b_company"] != Convert.DBNull) ? sdr["b_company"].ToString() : "";
                    obj.b_address_1 = (sdr["b_address_1"] != Convert.DBNull) ? sdr["b_address_1"].ToString() : "";
                    obj.b_address_2 = (sdr["b_address_2"] != Convert.DBNull) ? sdr["b_address_2"].ToString() : "";
                    obj.b_postcode = (sdr["b_postcode"] != Convert.DBNull) ? sdr["b_postcode"].ToString() : "";
                    obj.b_city = (sdr["b_city"] != Convert.DBNull) ? sdr["b_city"].ToString() : "";
                    obj.b_country = (sdr["b_country"] != Convert.DBNull) ? sdr["b_country"].ToString() : "";
                    obj.b_state = (sdr["b_state"] != Convert.DBNull) ? sdr["b_state"].ToString() : "";
                    obj.b_email = (sdr["b_email"] != Convert.DBNull) ? sdr["b_email"].ToString() : "";
                    obj.b_phone = (sdr["b_phone"] != Convert.DBNull) ? sdr["b_phone"].ToString() : "";
                    obj.s_first_name = (sdr["s_first_name"] != Convert.DBNull) ? sdr["s_first_name"].ToString() : "";
                    obj.s_last_name = (sdr["s_last_name"] != Convert.DBNull) ? sdr["s_last_name"].ToString() : "";
                    obj.s_company = (sdr["s_company"] != Convert.DBNull) ? sdr["s_company"].ToString() : "";
                    obj.s_address_1 = (sdr["s_address_1"] != Convert.DBNull) ? sdr["s_address_1"].ToString() : "";
                    obj.s_address_2 = (sdr["s_address_2"] != Convert.DBNull) ? sdr["s_address_2"].ToString() : "";
                    obj.s_postcode = (sdr["s_postcode"] != Convert.DBNull) ? sdr["s_postcode"].ToString() : "";
                    obj.s_city = (sdr["s_city"] != Convert.DBNull) ? sdr["s_city"].ToString() : "";
                    obj.s_country = (sdr["s_country"] != Convert.DBNull) ? sdr["s_country"].ToString() : "";
                    obj.s_state = (sdr["s_state"] != Convert.DBNull) ? sdr["s_state"].ToString() : "";
                    obj.paypal_id = (sdr["paypal_id"] != Convert.DBNull) ? sdr["paypal_id"].ToString() : "";
                }

                obj.OrderProducts = GetOrderProductList(OrderID);

                obj.GrassAmount = obj.OrderProducts.Sum(x => x.total);
                obj.TotalDiscount = obj.OrderProducts.Sum(x => x.discount);
                obj.TotalTax = obj.OrderProducts.Sum(x => x.tax_amount);
                obj.TotalShipping = obj.OrderProducts.Sum(x => x.total);
                obj.TotalFee = obj.OrderProducts.Sum(x => x.total);

                obj.NetTotal = (obj.GrassAmount - obj.TotalDiscount) + obj.TotalTax + obj.TotalShipping + obj.TotalFee;
            }
            catch (Exception ex)
            { throw ex; }
            return obj;
        }
        public static DataTable OrderPaymentDetails(long OrderID)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@order_id", OrderID)
                };
                string strSQl = "SELECT post_id,max(case meta_key when '_payment_method' then meta_value else '' end) payment_method,max(case meta_key when '_payment_method_title' then meta_value else '' end) payment_method_title,"
                                + " max(case meta_key when '_wc_authorize_net_cim_credit_card_trans_id' then meta_value else '' end) authorize_net_trans_id,max(case meta_key when '_wc_authorize_net_cim_credit_card_account_four' then meta_value else '' end) authorize_net_card_account_four,"
                                + " max(case meta_key when '_wc_authorize_net_cim_credit_card_card_expiry_date' then meta_value else '' end) authorize_net_card_expiry_date,max(case meta_key when '_wc_authorize_net_cim_credit_card_charge_captured' then meta_value else '' end) _wc_authorize_net_captured,"
                                + " max(case meta_key when '_paypal_id' then meta_value else '' end) paypal_id,max(case meta_key when '_paypal_status' then meta_value else '' end) paypal_status,"
                                + " max(case meta_key when '_podium_uid' then meta_value else '' end) podium_uid,max(case meta_key when '_podium_status' then meta_value else '' end) podium_status"
                                + " FROM wp_postmeta WHERE post_id = 853299 and(meta_key like '_payment_method%' or meta_key like '_wc_authorize_net%' or meta_key like '_paypal%' or meta_key like '_podium%')"
                                + " group by post_id";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        //Order Item Meta
        public static string GetOrderItemMeta(long Order_ItemID)
        {
            string strMeta = string.Empty;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "OIMTA"),
                    new SqlParameter("@order_id", Order_ItemID)
                };
                string strSQl = "wp_posts_order_search";
                strMeta = SQLHelper.ExecuteScalar(strSQl, parameters).ToString();
            }
            catch (Exception ex)
            { throw ex; }
            return strMeta;
        }
        //Order comments/notes
        public static DataTable GetOrderNotes(long OrderID)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "ONOTE"),
                    new SqlParameter("@order_id", OrderID)
                };
                string strSQl = "wp_posts_order_search";
                DT = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static int AddOrderNotes(OrderNotesModel obj)
        {
            int result = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@comment_post_ID", obj.post_ID),
                    new SqlParameter("@comment_author", obj.comment_author),
                    new SqlParameter("@comment_author_email", obj.comment_author_email),
                    new SqlParameter("@is_customer_note", obj.is_customer_note),
                    new SqlParameter("@comment_content", obj.comment_content)
                };
                string res = SQLHelper.ExecuteScalar("wp_comments_iud", parameters).ToString();
                if (res.StartsWith("Success")) result = 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public static int RemoveOrderNotes(OrderNotesModel obj)
        {
            int result = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "D"),
                    new SqlParameter("@comment_id", obj.comment_ID)
                };
                string res = SQLHelper.ExecuteScalar("wp_comments_iud", parameters).ToString();
                if (res.StartsWith("Success")) result = 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        //Get Order History
        public static DataTable OrderCounts(long UserID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                {
                    //strWhr += " and (pm_uc.meta_value='" + CommanUtilities.Provider.GetCurrent().UserID + "') ";
                }
                SqlParameter[] parameters =
                {
                    new SqlParameter("@userid", UserID),
                    new SqlParameter("@flag", "ORDTC")
                };
                dt = SQLHelper.ExecuteDataTable("wp_posts_order_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable OrderList(string sMonths, string CustomerID, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                if (!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator"))
                {
                    //strWhr += " and (pmf.employee_id='" + CommanUtilities.Provider.GetCurrent().UserID + "') ";
                }
                if (!string.IsNullOrEmpty(userstatus))
                {
                    if (userstatus == "mine") { strWhr += " and p.post_author = 8 and p.post_status != 'auto-draft'"; }
                    else { strWhr += " and p.post_status = '" + userstatus + "'"; }
                }
                else
                    strWhr += " and p.post_status != 'auto-draft' ";

                if (!string.IsNullOrEmpty(searchid))
                {
                    //strWhr += " and (p.id like '" + searchid + "%' "
                    strWhr += " and concat(p.id,' ', pmf.first_name,' ',pmf.last_name,' ',p.post_status,' ', pmf.billing_phone) like '%" + searchid + "%' ";
                    //+ " OR os.num_items_sold='%" + searchid + "%' "
                    //+ " OR os.total_sales='%" + searchid + "%' "
                    //+ " OR os.customer_id='%" + searchid + "%' "
                    //+ " OR p.post_status like '" + searchid + "%' "
                    //+ " OR p.post_date like '%" + searchid + "%' "
                    //+ " OR COALESCE(pmf.first_name, '') like '" + searchid + "%' "
                    //+ " OR COALESCE(pmf.last_name, '') like '" + searchid + "%' "
                    //+ " OR replace(replace(replace(replace(pmf.billing_phone, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
                    //+ " )";
                }

                if (!string.IsNullOrEmpty(sMonths))
                {
                    //strWhr += " and DATE_FORMAT(p.post_date,'%Y%m') BETWEEN " + sMonths;
                    strWhr += " and cast(p.post_date as date) BETWEEN " + sMonths;
                }
                if (!string.IsNullOrEmpty(CustomerID))
                {
                    strWhr += " and pmf.customer_id= '" + CustomerID + "' ";
                }
                string strSql = "SELECT p.id,p.post_status status, convert(varchar,p.post_date,101) date_created,os.num_items_sold,pmf.total_sales,pmf.customer_id,"
                            + " pmf.first_name,pmf.last_name,pmf.billing_email,pmf.billing_phone,pmf.payment_method,pmf.payment_method_title,pmf.paypal_status,pmf.paypal_id,pmf.podium_status,pmf.podium_uid,"
                            + " (SELECT sum(convert(float,rpm.meta_value)) FROM wp_posts rp JOIN wp_postmeta rpm ON rp.ID = rpm.post_id AND meta_key = '_order_total' WHERE rp.post_parent = p.ID AND rp.post_type = 'shop_order_refund') AS refund_total"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " inner join vw_Order_details pmf on p.id = pmf.post_id"
                            + " WHERE p.post_type = 'shop_order' and p.post_status != 'auto-draft' " + strWhr
                            + " order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY;";
                strSql += "SELECT coalesce(sum(1),0) TotalRecord from wp_posts p inner join vw_Order_details pmf on p.id = pmf.post_id "
                        + " WHERE p.post_type = 'shop_order' " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable OrderList(DateTime? fromdate, DateTime? todate, string customerid, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@customer_id", customerid),
                    new SqlParameter("@post_status", userstatus),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "ORDLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("wp_posts_order_search", parameters);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable OrderListDashboard(string from_date, string to_date, string userstatus, string searchid, int pageno, int pagesize, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            // totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                DateTime fromdate = DateTime.Now, todate = DateTime.Now;
                fromdate = DateTime.Parse(from_date);
                todate = DateTime.Parse(to_date);
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.id like '%" + searchid + "%' "
                            + " OR os.num_items_sold='%" + searchid + "%' "
                            + " OR os.total_sales='%" + searchid + "%' "
                            + " OR os.customer_id='%" + searchid + "%' "
                            + " OR p.post_status like '%" + searchid + "%' "
                            + " OR p.post_date like '%" + searchid + "%' "
                            + " OR COALESCE(pmf.meta_value, '') like '%" + searchid + "%' "
                            + " OR COALESCE(pml.meta_value, '') like '%" + searchid + "%' "
                            + " OR replace(replace(replace(replace(pmp.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') like '%" + searchid + "%'"
                            + " )";
                }

                if (!string.IsNullOrEmpty(from_date))
                {
                    strWhr += " and DATE(p.post_date) >= '" + fromdate.ToString("yyyy-MM-dd") + "' and DATE(post_date)<= '" + todate.ToString("yyyy-MM-dd") + "' ";
                }


                string strSql = "SELECT  p.id order_id, p.id as chkorder,os.num_items_sold,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales, os.customer_id as customer_id,"
                            + " REPLACE(p.post_status, 'wc-', '') status, DATE_FORMAT(p.post_date, '%M %d %Y') date_created,CONCAT(pmf.meta_value, ' ', COALESCE(pml.meta_value, '')) FirstName,COALESCE(pml.meta_value, '') LastName,"
                            + " replace(replace(replace(replace(pmp.meta_value,'-', ''),' ',''),'(',''),')','') billing_phone"
                            + " FROM wp_posts p inner join wp_wc_order_stats os on p.id = os.order_id"
                            + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                            + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                            + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                            + " WHERE p.post_type = 'shop_order' " + strWhr.ToString()
                            + " limit 10 ";

                strSql += "; SELECT Count(distinct p.id) TotalRecord from wp_wc_order_stats os inner join wp_posts p on p.id = os.order_id "
                        + " left join wp_postmeta pmf on os.order_id = pmf.post_id and pmf.meta_key = '_billing_first_name'"
                        + " left join wp_postmeta pml on os.order_id = pml.post_id and pml.meta_key = '_billing_last_name'"
                        + " left join wp_postmeta pmp on os.order_id = pmp.post_id and pmp.meta_key = '_billing_phone'"
                        + " WHERE p.post_type = 'shop_order' " + strWhr.ToString();
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                //if (ds.Tables[1].Rows.Count > 0)
                //    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable SearchCustomersOrders(string CustomerID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(CustomerID))
                {
                    strWhr += " and os.customer_id= '" + CustomerID + "' ";
                }

                string strSql = "SELECT po.ID, DATE_FORMAT(po.post_date, '%M %d %Y') post_date,po.post_status ,os.customer_id,Cast(os.total_sales As DECIMAL(10, 2)) as total_sales,"
                            + " max(case when pm.meta_key = '_billing_first_name' then pm.meta_value else '' end) billing_first_name,max(case when pm.meta_key = '_billing_last_name' then pm.meta_value else '' end) billing_last_name,"
                            + " max(case when pm.meta_key = '_billing_address_1' then pm.meta_value else '' end) billing_address_1,max(case when pm.meta_key = '_billing_address_2' then pm.meta_value else '' end) billing_address_2,"
                            + " max(case when pm.meta_key = '_billing_city' then pm.meta_value else '' end) billing_city,max(case when pm.meta_key = '_billing_state' then pm.meta_value else '' end) billing_state,"
                            + " max(case when pm.meta_key = '_billing_postcode' then pm.meta_value else '' end) billing_postcode,max(case when pm.meta_key = '_billing_country' then pm.meta_value else '' end) billing_country,"
                            + " max(case when pm.meta_key = '_billing_email' then pm.meta_value else '' end) billing_email,max(case when pm.meta_key = '_billing_phone' then replace(replace(replace(replace(pm.meta_value, '-', ''), ' ', ''), '(', ''), ')', '') else '' end) billing_phone,"
                            + " max(case when pm.meta_key = '_shipping_first_name' then pm.meta_value else '' end) shipping_first_name,max(case when pm.meta_key = '_shipping_last_name' then pm.meta_value else '' end) shipping_last_name,"
                            + " max(case when pm.meta_key = '_shipping_address_1' then pm.meta_value else '' end) shipping_address_1,max(case when pm.meta_key = 'shipping_address_2' then pm.meta_value else '' end) shipping_address_2,"
                            + " max(case when pm.meta_key = '_shipping_city' then pm.meta_value else '' end) shipping_city,max(case when pm.meta_key = '_shipping_state' then pm.meta_value else '' end) shipping_state,"
                            + " max(case when pm.meta_key = '_shipping_postcode' then pm.meta_value else '' end) shipping_postcode,max(case when pm.meta_key = '_shipping_country' then pm.meta_value else '' end) shipping_country"
                            + "   FROM wp_posts po inner join wp_wc_order_stats os on po.id = os.order_id"
                            + " LEFT OUTER JOIN wp_postmeta pm on pm.post_id = po.ID "
                            + " WHERE po.post_type = 'shop_order' " + strWhr
                            + " group by po.ID,po.post_date,po.post_status ,os.customer_id,os.total_sales order by ID desc limit 0, 1000";

                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable SearchCustomerAddress(string CustomerID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT 'Default' IsDefault,user_id customer_id,concat('{',STRING_AGG(concat('\"_',meta_key,'\": \"',meta_value,'\"'),','),'}') as meta_data"
                                + " FROM wp_usermeta WHERE user_id = '" + CustomerID + "' and (meta_key like 'billing_%' OR meta_key like 'shipping_%') and meta_key not like '%_method' group by user_id"
                                + " UNION ALL"
                                + " select distinct IsDefault, customer_id, meta_data from"
                                + " (SELECT '' IsDefault, pmu.meta_value customer_id, concat('{', STRING_AGG(concat('\"', pm.meta_key, '\": \"', pm.meta_value, '\"'),','), '}') as meta_data"
                                + " FROM wp_posts po inner join wp_postmeta pmu on pmu.post_id = po.ID and pmu.meta_key = '_customer_user' and pmu.meta_value = '" + CustomerID + "'"
                                + " inner join wp_postmeta pm on pm.post_id = pmu.post_id and (pm.meta_key like '_billing%' OR pm.meta_key like '_shipping_%') and pm.meta_key not like '%_method'"
                                + " WHERE po.post_type = 'shop_order' and po.post_status != 'auto-draft' group by po.ID, pmu.meta_value) tt";
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        //Split Order on Status Change Processing
        public static int SplitOrder(OrderPostStatusModel model)
        {
            int result = 0;
            try
            {
                //List<SplitOrderItemsModel> _list = new List<SplitOrderItemsModel>();
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-MTE", product_id = "118, 56774, 78676, 106923, 1595, 1610, 1619, 208417, 306817, 611172, 611220, 632713, 611172, 716434, 716425, 716418, 787847", variation_id = "684957" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-PSW", product_id = "124524", variation_id = "684958" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-KP", product_id = "14023", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-W", product_id = "128244", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-B", product_id = "31729", variation_id = "684960" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-F", product_id = "20861", variation_id = "684961" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-PB", product_id = "611252", variation_id = "684962" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-FMF", product_id = "727138,612940,727126", variation_id = "684959" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-AJ", product_id = "611286,612995,613207", variation_id = "684963" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-CPB", product_id = "733500", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-PRO", product_id = "612955,612947,611268", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-SMF", product_id = "611238", variation_id = "" });
                //_list.Add(new SplitOrderItemsModel { order_prefix = "-COM", product_id = "772065,787909", variation_id = "" });

                DataTable dt = SQLHelper.ExecuteDataTable(string.Format("SELECT * FROM split_record WHERE main_order_id={0}; ", model.order_id));
                string strSql = string.Empty;
                if (dt.Rows.Count == 0)
                {
                    DateTime cDate = DateTime.Now, cUTFDate = DateTime.UtcNow;
                    strSql = string.Format("INSERT INTO split_record (main_order_id) values({0});", model.order_id);
                    strSql += string.Format(" INSERT INTO split_meta (split_id,meta_key,meta_value) SELECT split_id,p.meta_key,p.meta_value FROM split_record sr INNER JOIN wp_postmeta p on p.post_id = sr.main_order_id where p.post_id = {0} and (p.meta_key like '_billing_%' or p.meta_key like '_shipping_%') order by p.meta_key; ", model.order_id);
                }
                else
                {
                    strSql += string.Format("delete from split_detail_items where split_detail_id in (SELECT split_detail_id FROM split_detail where split_id in (SELECT split_id FROM split_record WHERE main_order_id={0}));", model.order_id);
                    strSql += string.Format("delete from split_detail where split_id in (SELECT split_id FROM split_record WHERE main_order_id={0});", model.order_id);
                }
                strSql += " INSERT INTO split_detail (split_id,order_name) "
                            + " SELECT distinct sr.split_id,CONCAT('#',oi.order_id,'-',pwr.prefix_code) order_id FROM split_record sr"
                            + " inner join wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                            + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                            + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                            + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                            + " where oi.order_id = " + model.order_id + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

                strSql += " INSERT INTO split_detail_items (split_detail_id,product_id,variation_id,qty,meta_key,meta_value) "
                        + " SELECT sd.split_detail_id,oim_p.meta_value p_id,oim_v.meta_value v_id,oim_qty.meta_value qty,'','' FROM split_record sr"
                        + " INNER JOIN wp_woocommerce_order_items oi on oi.order_id = sr.main_order_id and oi.order_item_type = 'line_item'"
                        + " inner join wp_woocommerce_order_itemmeta oim_p on oim_p.order_item_id = oi.order_item_id and oim_p.meta_key = '_product_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_v on oim_v.order_item_id = oi.order_item_id and oim_v.meta_key = '_variation_id'"
                        + " inner join wp_woocommerce_order_itemmeta oim_qty on oim_qty.order_item_id = oi.order_item_id and oim_qty.meta_key = '_qty'"
                        + " inner join product_warehouse_rule pwr on pwr.status = 1 and pwr.product_id = (case when oim_v.meta_value = '0' then oim_p.meta_value else oim_v.meta_value end)"
                        + " inner join split_detail sd on sd.split_id = sr.split_id and sd.order_name = CONCAT('#', oi.order_id, '-', pwr.prefix_code)"
                        + " where oi.order_id = " + model.order_id + " group by sr.split_id, oi.order_id, pwr.prefix_code;";

                result = SQLHelper.ExecuteNonQueryWithTrans(strSql.ToString());
            }
            catch (Exception Ex) { throw Ex; }
            return result;
        }
        //Get Shipping Order
        public static DataTable ProcessingOrders(DateTime from_date, DateTime to_date)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT p.ID,p.post_date_gmt,p.post_modified_gmt,sd.split_detail_id,sd.order_name,max(case meta_key when '_payment_method_title' then meta_value else '' end) pm_title, "
                        + " max(case meta_key when '_billing_first_name' then meta_value else '' end) b_fn,max(case meta_key when '_billing_last_name' then meta_value else '' end) b_ln, "
                        + " max(case meta_key when '_billing_company' then meta_value else 'company name' end) b_com,max(case meta_key when '_billing_email' then meta_value else '' end) b_email, "
                        + " max(case meta_key when '_billing_phone' then meta_value else '' end) b_phone, "
                        + " max(case meta_key when '_shipping_first_name' then meta_value else '' end) s_fn,max(case meta_key when '_shipping_last_name' then meta_value else '' end) s_ln, "
                        + " max(case meta_key when '_shipping_company' then meta_value else 'company name' end) s_com,max(case meta_key when '_shipping_address_1' then meta_value else '' end) s_add1, "
                        + " max(case meta_key when '_shipping_address_2' then meta_value else '' end) s_add2,max(case meta_key when '_shipping_city' then meta_value else '' end) s_city, "
                        + " max(case meta_key when '_shipping_state' then meta_value else '' end) s_state,max(case meta_key when '_shipping_postcode' then meta_value else '' end) s_postcode, "
                        + " max(case meta_key when '_shipping_country' then meta_value else '' end) s_country "
                        + " FROM wp_posts p inner join split_record sr on sr.main_order_id = p.ID inner join split_detail sd on sd.split_id = sr.split_id "
                        + " inner join wp_postmeta pm on pm.post_id = p.ID "
                        + " WHERE post_status = 'wc-processing' AND post_type = 'shop_order' "
                        + " AND DATE_FORMAT(p.post_modified_gmt,'%Y-%m-%d %h:%i:%s') BETWEEN DATE_FORMAT('" + from_date.ToString("yyyy-MM-dd hh:mm:ss") + "','%Y-%m-%d %h:%i:%s') AND DATE_FORMAT('" + to_date.ToString("yyyy-MM-dd hh:mm:ss") + "','%Y-%m-%d %h:%i:%s') "
                        + " group by p.ID,sr.split_id,sd.order_name order by p.ID desc";
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable ProcessingOrdersItemsDetails(string order_id, string split_detail_id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT sdi.product_id,sdi.variation_id,sdi.qty,pp.post_title,pvp.post_title variation_title,psku.meta_value sku,sdi.meta_key,sdi.meta_value,"
                                + "     (select max(case oim.meta_key when '_line_total' then oim.meta_value else '' end) from wp_woocommerce_order_items oi "
                                + "         inner join wp_woocommerce_order_itemmeta oim on oim.order_item_id = oi.order_item_id"
                                + "         where oi.order_item_type = 'line_item' and oi.order_id = " + order_id.ToString() + " group by oi.order_item_id"
                                + "         having max(case oim.meta_key when '_product_id' then oim.meta_value else '' end) = sdi.product_id"
                                + "             and max(case oim.meta_key when '_variation_id' then oim.meta_value else '' end) = sdi.variation_id) line_total"
                                + " FROM split_detail_items sdi"
                                + " inner join wp_posts pp on pp.ID = sdi.product_id AND pp.post_type = 'product'"
                                + " left outer join wp_posts pvp on pvp.ID = sdi.variation_id"
                                + " left outer join wp_postmeta psku on psku.post_id = pp.id and psku.meta_key = '_sku'"
                                + " where sdi.split_detail_id = " + split_detail_id.ToString();
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}