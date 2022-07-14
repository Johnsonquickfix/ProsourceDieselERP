using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Xml;

namespace LaylaERP.BAL
{
    public class PurchaseOrderRepository
    {
        public static DataTable SearchProducts(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "SELECT COALESCE(ps.id,p.id) id,CONCAT(COALESCE(ps.post_title,p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as text"
                                + " FROM wp_posts as p"
                                + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                + " WHERE p.post_type = 'product' AND p.post_status = 'publish'"
                                + " AND CONCAT(COALESCE(ps.post_title, p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) like '%" + strSearch + "%'"
                                + " ORDER BY id limit 50; ";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable SearchVenderProducts(long vendor_id)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@vendor_id", vendor_id)
                };
                string strSQl = "SELECT distinct p.id id,CONCAT(p.post_title, COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as text"
                                + " FROM wp_posts as p"
                                + " inner join Product_Purchase_Items ir on ir.fk_product = p.id and ir.fk_vendor=@vendor_id"
                                + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                                + " WHERE p.post_type in ('product', 'product_variation') ORDER BY id; ";//AND p.post_status = 'publish' 
                DT = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static List<PurchaseOrderProductsModel> GetProductsDetails(long product_id, long vendor_id)
        {
            List<PurchaseOrderProductsModel> _list = new List<PurchaseOrderProductsModel>();
            try
            {
                PurchaseOrderProductsModel productsModel = new PurchaseOrderProductsModel();
                //SqlParameter[] parameters =
                //{
                //    new SqlParameter("@product_id", product_id),new SqlParameter("@vendor_id", vendor_id)
                //};
                //string strSQl = "SELECT p.id,p.post_title,psku.meta_value sku,ir.fk_vendor,1 qty,cost_price purchase_price,0 salestax,0 shipping_price,discount"
                //            + " FROM wp_posts as p"
                //            + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                //            + " left outer join Product_Purchase_Items ir on ir.fk_product = p.id and(ir.fk_vendor=0 or ir.fk_vendor=@vendor_id)"
                //            + " WHERE p.post_type in('product', 'product_variation') AND p.id = @product_id "
                //            + " union all"
                //            + " select p.id,p.post_title,psku.meta_value sku,ir.fk_vendor,free_it.free_quantity qty,cost_price purchase_price,0 salestax,0 shipping_price,discount"
                //            + " FROM wp_product_free free_it"
                //            + " inner join wp_posts as p on p.id = free_it.free_product_id"
                //            + " left outer join wp_postmeta psku on psku.post_id = p.id and psku.meta_key = '_sku'"
                //            + " left outer join Product_Purchase_Items ir on ir.fk_product = p.id and(ir.fk_vendor = 0 or ir.fk_vendor = @vendor_id) and effective_date <= getdate() and ir.date_to >= getdate()"
                //            + " WHERE free_it.status = 1 and free_it.product_id = @product_id";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@Flag", "ITEMDETAIL"),new SqlParameter("@id",product_id),new SqlParameter("@userid", vendor_id)
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
                        productsModel.localtax1_tx = decimal.Parse(sdr["salestax"].ToString().Trim());
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
                    productsModel.discount = productsModel.total_ht * (productsModel.discount_percent / 100);
                    productsModel.total_localtax1 = productsModel.localtax1_tx * productsModel.qty;
                    productsModel.total_localtax2 = productsModel.localtax2_tx * productsModel.qty;
                    productsModel.total_ttc = productsModel.total_ht - productsModel.discount + productsModel.total_localtax1 + productsModel.total_localtax2;
                    if (sdr["free_itmes"] != DBNull.Value && !string.IsNullOrWhiteSpace(sdr["free_itmes"].ToString().Trim()))
                        productsModel.free_itmes = sdr["free_itmes"].ToString().Trim();
                    else
                        productsModel.free_itmes = "{}";
                    _list.Add(productsModel);
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }
        public static DataSet GetAllMasterList(long VendorID = 0, string flag = "GETMD")
        {
            DataSet DS = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", flag), new SqlParameter("@id", VendorID) };
                DS = SQLHelper.ExecuteDataSet("erp_purchase_order_search", para);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetVendor()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select rowid as ID, concat(name,' (',name_alias,')') as Name from wp_vendor where VendorStatus=1 order by rowid desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public string GetPurchaseOrderCode()
        {
            string result = "";
            try
            {
                string strsql = "SELECT CONCAT('PO', DATE_FORMAT(CURDATE(),'%y%m'),'-',max(LPAD(rowid+1 ,5,0)))  as Code from commerce_purchase_order;";
                result = SQLHelper.ExecuteScalar(strsql).ToString();
            }
            catch (Exception ex)
            { throw ex; }
            return result;
        }
        public static DataTable GetIncotermByID(int IncotermsTypeID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "Select rowid as ID, IncoTerm, short_description from IncoTerms where rowid=" + IncotermsTypeID + " order by ID;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GetVendorByID(long VendorID)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@rowid", VendorID) };
                string strSQl = "select rowid,vendor_type,name,name_alias,code_vendor,address,town,fk_country,fk_state,zip,phone,fax,email,url,fk_incoterms,location_incoterms,PaymentTermsID,BalanceID,Paymentmethod,v.fk_warehouse from wp_vendor v left outer join wp_VendorPaymentDetails vpd on vpd.VendorID = v.rowid where rowid=@rowid;";
                dt = SQLHelper.ExecuteDataTable(strSQl, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        //Save and update Purchase order
        public static DataTable AddNewPurchase(long Pkey, string qFlag, long UserID, XmlDocument orderXML, XmlDocument orderdetailsXML)
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
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                    new SqlParameter("@orderdetailsXML", orderdetailsXML.OuterXml)
                };
                dt = SQLHelper.ExecuteDataTable("erp_purchase_order_iud", parameters);
            }
            catch (Exception ex)
            {
                if (qFlag == "POP")
                    UserActivityLog.ExpectionErrorLog(ex, "PaymentInvoice/TakePayment/" + Pkey + "", "Payment taken from invoice");
                if (qFlag == "POAMD")
                    UserActivityLog.ExpectionErrorLog(ex, "PurchaseOrder/POAmendment/" + Pkey + "", "PO Amendment");
                if (qFlag == "I")
                    UserActivityLog.ExpectionErrorLog(ex, "PurchaseOrder/NewPurchase/" + Pkey + "", "New Purchase Order");
                throw new Exception(ex.Message);
            }
            return dt;
        }
        public static DataTable UpdatePurchaseStatus(PurchaseOrderModel model)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    model.LoginID > 0 ? new SqlParameter("@userid", model.LoginID) : new SqlParameter("@userid", DBNull.Value),
                    new SqlParameter("@pkeys", model.Search),
                    new SqlParameter("@qflag", "POA"),
                    new SqlParameter("@status", model.Status),
                };
                dt = SQLHelper.ExecuteDataTable("erp_purchase_order_iud", parameters);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "PurchaseOrder/UpdatePurchaseOrderStatus/" + model.Search + "", "Update Purchase Order Status");
                throw Ex;
            }
            return dt;
        }
        public static DataTable PurchaseApproval(PurchaseOrderModel model)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    model.LoginID > 0 ? new SqlParameter("@userid", model.LoginID) : new SqlParameter("@userid", DBNull.Value),
                    new SqlParameter("@pkeys", model.RowID),
                    new SqlParameter("@row_key", model.Search),
                    new SqlParameter("@qflag", "POBMA"),
                    new SqlParameter("@status", model.Status),
                };
                dt = SQLHelper.ExecuteDataTable("erp_purchase_order_iud", parameters);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return dt;
        }
        //Get Purchase order
        public static DataSet GetPurchaseOrderByID(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@id", id), new SqlParameter("@Flag", "POBID") };
                ds = SQLHelper.ExecuteDataSet("erp_purchase_order_search", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        //Get Purchase order
        public static DataTable GetPurchaseOrderPayment(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] para = { new SqlParameter("@po_id", id), };
                string strSql = "select replace(convert(varchar,datec,101),'/','')+replace(convert(varchar,datec,108),':','') sn,convert(varchar,datec,101) datec,ep.ref,epi.type,pt.paymenttype,epi.amount,num_payment from erp_payment_invoice epi"
                                + " inner join erp_payment ep on ep.rowid = epi.fk_payment inner join wp_PaymentType pt on pt.id = ep.fk_payment"
                                + " where epi.fk_invoice = @po_id and type = 'PO'"
                                + " union all"
                                + " select replace(convert(varchar,datec,101),'/','')+replace(convert(varchar,datec,108),':','') sn,convert(varchar,datec,10) datec,ep.ref, epi.type,pt.paymenttype,epi.amount,num_payment from commerce_purchase_receive_order_detail rod"
                                + " inner join erp_payment_invoice epi on rod.fk_purchase_re = epi.fk_invoice"
                                + " inner join erp_payment ep on ep.rowid = epi.fk_payment inner join wp_PaymentType pt on pt.id = ep.fk_payment"
                                + " where rod.fk_purchase = @po_id and type = 'PR' --group by epi.fk_payment,ep.ref";
                dt = SQLHelper.ExecuteDataTable(strSql, para);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        //Get Purchase order Print 
        public static DataSet GetPurchaseOrder(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", "GETPO"), new SqlParameter("@id", id), };
                ds = SQLHelper.ExecuteDataSet("erp_purchase_order_search", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod"; ds.Tables[2].TableName = "popd";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataTable GetPurchaseOrder(DateTime? fromdate, DateTime? todate, int statusid, string userstatus, string salestatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH"),
                    !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                    new SqlParameter("@isactive", userstatus),
                    new SqlParameter("@status", statusid),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                     new SqlParameter("@salestatus", salestatus)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_purchase_order_search", parameters);
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

        public static int CreateOrders(long id)
        {
            int result = 0;
            try
            {
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strPOYearMonth = cDate.ToString("yyMM").PadRight(4);
                SqlParameter[] para = { };
                string strsql = "";
                DataTable DT = new DataTable();
                string strSQl = "select '' ref,'' ref_ext,code_vendor ref_supplier,ir.fk_vendor fk_supplier,1 fk_status,0 source,wp_v.PaymentTermsID,wp_v.BalanceID,wp_vpd.Paymentmethod,"
                            + " p.post_date date_livraison, wp_v.fk_incoterms,wp_v.location_incoterms,'System Created' note_private,'' note_public,0 fk_user_author,p.post_date date_creation,"
                            + "  ((opl.product_qty * ir.purchase_price) * (ir.discount / 100)) discount,0 total_tva,round((opl.product_qty * ir.salestax), 2) localtax1,round((opl.product_qty * ir.shipping_price), 2) localtax2,"
                            + " round((opl.product_qty * ir.purchase_price), 2) total_ht,"
                            + " round((opl.product_qty * ir.purchase_price), 2) - round(((opl.product_qty * ir.purchase_price) * (ir.discount / 100)), 2) + round((opl.product_qty * ir.salestax), 2) + round((opl.product_qty * ir.shipping_price), 2) total_ttc,"
                            + " opl.order_id,psku.meta_value sku,wp_oi.order_item_name,(case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) fk_product,p.post_date,opl.product_qty,"
                            + " ir.purchase_price,ir.salestax,ir.shipping_price,ir.discount discountPer,(select wp_w.rowid from wp_warehouse wp_w where wp_w.is_system = 1 limit 1) warehouse_id"
                            + " from wp_posts p"
                            + " inner join wp_woocommerce_order_items wp_oi on p.id = wp_oi.order_id and wp_oi.order_item_type = 'line_item'"
                            + " inner join wp_wc_order_product_lookup opl on opl.order_item_id = wp_oi.order_item_id"
                            + " inner join Product_Purchase_Items ir on ir.is_active = 1 and ir.fk_product = (case when opl.variation_id > 0 then opl.variation_id else opl.product_id end)"
                            + " left outer join wp_postmeta psku on psku.post_id = (case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) and psku.meta_key = '_sku'"
                            + " left outer join wp_vendor wp_v on wp_v.rowid = ir.fk_vendor"
                            + " left outer join wp_VendorPaymentDetails wp_vpd on wp_vpd.VendorID = wp_v.rowid"
                            + " where p.id = " + id + " group by p.id,(case when opl.variation_id > 0 then opl.variation_id else opl.product_id end) order by ref_supplier;"
                            + "delete from commerce_purchase_order_detail where fk_purchase in (select rowid from commerce_purchase_order where fk_projet = " + id + ");"
                            + "delete from commerce_purchase_order where fk_projet = " + id + ";";
                DT = SQLHelper.ExecuteDataTable(strSQl);

                foreach (DataRow DR in DT.DefaultView.ToTable(true, "ref_supplier", "fk_supplier", "PaymentTermsID", "BalanceID", "Paymentmethod", "date_livraison", "fk_incoterms", "location_incoterms", "date_creation", "warehouse_id").Rows)
                {
                    strsql = "insert into commerce_purchase_order(ref,ref_ext,ref_supplier,fk_supplier,fk_status,source,fk_payment_term,fk_balance_days,fk_payment_type,date_livraison,fk_incoterms,location_incoterms,note_private,note_public,fk_user_author,date_creation,discount,total_tva,localtax1,localtax2,total_ht,total_ttc,fk_projet,fk_warehouse) "
                        + string.Format("select concat('PO" + strPOYearMonth + "-',lpad(coalesce(max(right(ref,5)),0) + 1,5,'0')) ref,'','{0}','{1}','1','0','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}' from commerce_purchase_order where lpad(ref,6,0) = 'PO" + strPOYearMonth + "';select LAST_INSERT_ID();",
                                DR["ref_supplier"], DR["fk_supplier"], DR["PaymentTermsID"], DR["BalanceID"], DR["Paymentmethod"], cDate.ToString("yyyy-MM-dd HH:mm:ss"), DR["fk_incoterms"], DR["location_incoterms"], "", "", 0, cDate.ToString("yyyy-MM-dd HH:mm:ss"), 0, 0, 0, 0, 0, 0, id, DR["warehouse_id"]);

                    long po_id = Convert.ToInt64(SQLHelper.ExecuteScalar(strsql, para));
                    strsql = string.Empty;
                    if (po_id > 0)
                    {
                        DT.DefaultView.RowFilter = "fk_supplier = " + DR["fk_supplier"].ToString().Trim();

                        decimal total_gm = 0, total_tax = 0, total_shamt = 0, total_discamt = 0, total_net = 0;
                        /// step 2 : commerce_purchase_order_detail
                        foreach (DataRow DRMC in DT.DefaultView.ToTable().Rows)
                        {
                            strsql += "insert into commerce_purchase_order_detail (fk_purchase,fk_product,ref,description,qty,discount_percent,discount,subprice,total_ht,total_ttc,product_type,date_start,date_end,rang,tva_tx,localtax1_tx,localtax1_type,localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2) ";
                            strsql += string.Format(" select '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}','{20}','{21}';",
                                po_id, DRMC["fk_product"], DRMC["sku"], DRMC["order_item_name"], DRMC["product_qty"], DRMC["discountPer"], DRMC["discount"], DRMC["purchase_price"], DRMC["total_ht"], DRMC["total_ttc"], 0, "", "", 1,
                                0, DRMC["salestax"], "F", DRMC["shipping_price"], "F", 0, DRMC["localtax1"], DRMC["localtax2"]);
                            total_gm += Convert.ToDecimal(DRMC["total_ht"].ToString());
                            total_discamt += Convert.ToDecimal(DRMC["discount"].ToString());
                            total_tax += Convert.ToDecimal(DRMC["localtax1"].ToString());
                            total_shamt += Convert.ToDecimal(DRMC["localtax2"].ToString());
                            total_net += Convert.ToDecimal(DRMC["total_ttc"].ToString());
                        }
                        strsql += string.Format("update commerce_purchase_order set fk_status='3',ref_ext=REPLACE(ref,'PO','PI'),billed='1',discount = {0},localtax1={1},localtax2={2},total_ht={3},total_ttc={4} where rowid={5};", total_discamt, total_tax, total_shamt, total_gm, total_net, po_id);

                        //Add Stock
                        strsql += "delete from product_stock_register where tran_type = 'PO' and flag = 'O' and tran_id = " + po_id + ";"
                                + " insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)"
                                + " select 'PO',pod.fk_purchase,pod.fk_product,po.fk_warehouse,po.date_creation,pod.qty,'O' from commerce_purchase_order_detail pod"
                                + " inner join commerce_purchase_order po on po.rowid = pod.fk_purchase where fk_purchase = " + po_id + ";";

                        result = SQLHelper.ExecuteNonQueryWithTrans(strsql);
                    }
                }

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return result;
        }
        public static DataSet GetPurchaseOrderPrintList(string flag = "POPRT")
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", flag) };
                ds = SQLHelper.ExecuteDataSet("erp_purchase_order_search", parameters);
            }
            catch (Exception ex) { throw ex; }
            return ds;
        }
        public static DataTable SendInvoiceUpdate(XmlDocument orderXML)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@qflag", "SINV"),
                    new SqlParameter("@orderXML", orderXML.OuterXml),
                };
                dt = SQLHelper.ExecuteDataTable("erp_purchase_order_iud", parameters);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
            return dt;
        }
    }
}