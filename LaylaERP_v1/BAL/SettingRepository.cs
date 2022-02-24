using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
using System.Text;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class SettingRepository
    {
        
        public static DataSet DisplaySettings()
        {
            DataSet DT = new DataSet();
            try
            {
                string strquery = "Select * from wp_system_settings;"
                               + " Select * from erp_entityinfo;";
                DT = SQLHelper.ExecuteDataSet(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;

            
        }

        public static void Updatesetting(SettingModel model, long id,string SenderEmailID)
        {
            try
            {
                string strsql = "Update wp_system_settings set AuthorizeNet=@AuthorizeNet,Paypal=@Paypal,AmazonPay=@AmazonPay,CreditCustomer=@CreditCustomer,Podium=@Podium, SenderEmailID=@SenderEmailID, SenderEmailPwd=@SenderEmailPwd, SMTPServerName=@SMTPServerName," +
                    "SMTPServerPortNo=@SMTPServerPortNo, SSL=@SSL, PaypalClientId=@PaypalClientId, PaypalSecret=@PaypalSecret,PaypalSellerAccount=@PaypalSellerAccount,AuthorizeAPILogin=@AuthorizeAPILogin, " +
                    " AuthorizeTransKey=@AuthorizeTransKey,AmazonAPIId=@AmazonAPIId,AmazonUser=@AmazonUser,AmazonPwd=@AmazonPwd,TaxjarAPIId=@TaxjarAPIId, " +
                    " TaxjarUser=@TaxjarUser,TaxjarPwd=@TaxjarPwd,podiumAPIKey=@podiumAPIKey,podiumSecretKey=@podiumSecretKey,podium_refresh_code=@podium_refresh_code,podium_code=@podium_code,podium_locationuid=@podium_locationuid where ID=@user_id";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@AuthorizeNet",model.AuthorizeNet),
                    new SqlParameter("@Paypal", model.Paypal),
                    new SqlParameter("@AmazonPay",model.AmazonPay),
                    new SqlParameter("@CreditCustomer",model.CreditCustomer),
                    new SqlParameter("@Podium",model.Podium),
                    new SqlParameter("@SenderEmailID", SenderEmailID),
                    new SqlParameter("@SenderEmailPwd", model.SenderEmailPwd),
                    new SqlParameter("@SMTPServerName", model.SMTPServerName),
                    new SqlParameter("@SMTPServerPortNo",model.SMTPServerPortNo),
                    new SqlParameter("@SSL",model.SSL),
                    new SqlParameter("@PaypalClientId",model.PaypalClientId),
                    new SqlParameter("@PaypalSecret", model.PaypalSecret),
                    new SqlParameter("@PaypalSellerAccount",model.PaypalSellerAccount),
                    new SqlParameter("@AuthorizeAPILogin",model.AuthorizeAPILogin),
                    new SqlParameter("@AuthorizeTransKey", model.AuthorizeTransKey),
                    new SqlParameter("@AmazonAPIId", model.AmazonAPIId),
                    new SqlParameter("@AmazonUser", model.AmazonUser),
                    new SqlParameter("@AmazonPwd", model.AmazonPwd),
                    new SqlParameter("@TaxjarAPIId",model.TaxjarAPIId),
                    new SqlParameter("@TaxjarUser", model.TaxjarUser),
                    new SqlParameter("@TaxjarPwd", model.TaxjarPwd),
                    new SqlParameter("@podiumAPIKey",model.podiumAPIKey),
                    new SqlParameter("@podiumSecretKey",model.podiumSecretKey),
                    new SqlParameter("@podium_code",model.podium_code),
                    new SqlParameter("@podium_refresh_code",model.podium_refresh_code),
                    new SqlParameter("@podium_locationuid",model.podium_locationuid),

                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static void Update_EntityInfo(SettingModel model, long id)
        {
            try
            {
                string strsql = "Update erp_entityinfo set CompanyName=@CompanyName,lastname=@lastname,firstname=@firstname,address=@address,address1=@address1, zip=@zip, town=@town, fk_state=@fk_state," +
                    "fk_country=@fk_country, country_code_phone=@country_code_phone, user_mobile=@user_mobile,email=@email,website=@website, " +
                    " logo_url=@logo_url,additional_notes=@additional_notes,po_email=@po_email,base_url=@base_url " +
                    " where entity=@id";
                SqlParameter[] para =
                {
                    new SqlParameter("@id", id),
                    new SqlParameter("@lastname",model.lastname),
                    new SqlParameter("@CompanyName", model.CompanyName),
                    new SqlParameter("@firstname",model.firstname),
                    new SqlParameter("@address",model.address),
                    new SqlParameter("@address1",model.address1),              
                    new SqlParameter("@zip", model.postal_code),
                    new SqlParameter("@town", model.City),
                    new SqlParameter("@fk_state",model.State),
                    new SqlParameter("@fk_country",model.Country),
                    new SqlParameter("@country_code_phone", model.country_code_phone),
                    new SqlParameter("@user_mobile",model.user_mobile),
                    new SqlParameter("@email",model.email),
                    new SqlParameter("@website", model.website),
                    new SqlParameter("@logo_url", model.logo_url),
                    new SqlParameter("@additional_notes", model.additional_notes),
                    new SqlParameter("@po_email", model.po_email),
                    new SqlParameter("@base_url", model.base_url)

                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/Update_Setting/" + id + "", "Update global setting.");
                throw Ex;
            }
        }

        // For Order Shipping Rule
        public static DataTable GetRoule()
        {
            DataTable DT = new DataTable();
            try
            {
                string strSQl = "Select rowid , name from erp_order_automation_filter";
                DT = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public int CheckDuplicateRoule(SettingModel model)
        {
            try
            {
                string strquery = "select count(rowid) from erp_order_automation_filter where name = '" + model.rule_name + "' ";
                SqlParameter[] para =
                {

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strquery).ToString());
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddNewRule(SettingModel model)
        {
            try
            {
                string strsql = "insert into erp_order_automation_filter(name,description)values(@name,@description); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@name", model.rule_name),
                     new SqlParameter("@description", model.description ?? (object)DBNull.Value)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/NewRule/" + model.rule_name + "", "Insert shipping rule.");
                throw Ex;
            }
        }

        public static DataTable GetShippingruleList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (eoar.rowid like '%" + searchid + "%' "
                            + " OR eoaf.name like '%" + searchid + "%' "
                            + " OR eslcun.CountryFullName like '%" + searchid + "%' "
                            + " OR esl.StateFullName like '%" + searchid + "%' "
                            + " OR wv.name like '%" + searchid + "%' "
                            + " OR post_title like '%" + searchid + "%' "

                            + " )"; 
                }

                string strSql = "select DISTINCT eoar.rowid rowid, eoaf.name rulrname,location State,eslcun.CountryFullName Country,"
                + " wv.name vendrname,services,prefix_code, ww.ref warehouse "
                + " from erp_order_automation_rule eoar"
                + " left OUTER join erp_order_automation_filter eoaf on eoaf.rowid = eoar.fk_rule"
                //+ " left OUTER join erp_StateList esl on esl.State = eoar.location "
                 + " left OUTER join erp_StateList eslcun on eslcun.Country = eoar.country"
                //+ " left OUTER join wp_posts ps on ps.id = eoar.fk_product"
                + " left OUTER join wp_vendor wv on wv.rowid = eoar.fk_vendor"
                + " left OUTER join wp_warehouse ww on ww.rowid = eoar.fk_warehouse"
                + " WHERE eoar.rowid > 0" + strWhr

              + " order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY";
                //strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");

                strSql += "; SELECT count(distinct eoar.rowid) TotalRecord from erp_order_automation_rule eoar"
                + " left OUTER join erp_order_automation_filter eoaf on eoaf.rowid = eoar.fk_rule"
                //+ " left OUTER join erp_StateList esl on esl.State = eoar.location"
                + " left OUTER join erp_StateList eslcun on eslcun.Country = eoar.country"
                //+ " left OUTER join wp_posts ps on ps.id = eoar.fk_product"
                + " left OUTER join wp_vendor wv on wv.rowid = eoar.fk_vendor"
                + " left OUTER join wp_warehouse ww on ww.rowid = eoar.fk_warehouse"
                + " WHERE eoar.rowid > 0 " + strWhr.ToString();
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

        public int deleteShipping(SettingModel model)
        {
            try
            {
                string strsql = "delete from erp_order_automation_rule where country = '"+ model.countryshipping + "' and  fk_rule = " + model.fk_rule + " ";

                int result = SQLHelper.ExecuteNonQuery(strsql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/NewRule/" + model.fk_rule + "", "Delete shipping rule.");
                throw Ex;
            }
        }

        public static DataTable GetEditDataID(OrderPostStatusModel model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                //string strSql = "SELECT rowid ID,fk_rule,location,Statefullname,fk_product,fk_vendor,services,ScD.country from erp_order_automation_rule ScD left outer join erp_StateList esl on esl.State = ScD.location"
                //             + " WHERE rowid = " + model.strVal + " ";

                string strSql = "SELECT rowid ID,fk_rule,location,fk_product,fk_vendor,services,Country, fk_warehouse from erp_order_automation_rule ScD"
                           + " WHERE rowid = " + model.strVal + " ";


                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable Getcountrystatecountry(SettingModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select rowid from erp_order_automation_rule"
                                + " WHERE fk_rule =" + model.fk_rule + " and location = '" + model.location + "' and fk_product  = '" + model.fk_products + "' ";
                                //+ " limit 10;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int updateshippingrule(SettingModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                // strSql.Append(string.Format("insert into Product_Purchase_Items ( fk_vendor,purchase_price,cost_price,minpurchasequantity,salestax,taxrate,discount,remark) values ({0},{1},{2},{3},{4},{5},{6},{7},'{8}') ", model.fk_product, model.fk_vendor, model.purchase_price, model.cost_price, model.minpurchasequantity, model.salestax, model.taxrate, model.discount, model.remark));

                /// step 6 : wp_posts
                strSql.Append(string.Format("update erp_order_automation_rule set location = '{0}',fk_product = '{1}',fk_vendor = {2},services = '{3}',fk_rule = {4},country= '{5}',prefix_code= (select string_agg(prefix_code,',') from product_warehouse_rule where product_id in ({1})), fk_warehouse={7} where rowid = {6}", model.location, model.fk_products, model.fk_vendor, model.services, model.fk_rule,model.countryshipping, model.ID, model.fk_warehouse));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Setting/NewRule/" + model.fk_products + "", "Update shipping rule.");
                throw ex; }
            return result;
        }
        public static int Addshippingruledetails(SettingModel model)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                //StringBuilder strSql = new StringBuilder(string.Format("delete from Product_Purchase_Items where fk_product = {0}; ", model.fk_product));
                //strSql.Append(string.Format("insert into erp_order_automation_rule (fk_rule,fk_product,location,fk_vendor,services,country,prefix_code) values ({0},{1},'{2}',{3},'{4}','{5}') ", model.fk_rule, model.fk_product, model.location, model.fk_vendor, model.services,model.countryshipping));
                
                //strSql.Append(string.Format("insert into erp_order_automation_rule (fk_rule,fk_product,location,fk_vendor,services,country,prefix_code) select {0},'{1}','{2}',{3},'{4}','{5}', (select group_concat(prefix_code)  from product_warehouse_rule where product_id in ({1}) ) prefix_code", model.fk_rule, model.fk_products, model.location, model.fk_vendor, model.services, model.countryshipping));
                strSql.Append(string.Format("insert into erp_order_automation_rule (fk_rule,fk_product,location,fk_vendor,services,country,prefix_code, fk_warehouse) select {0},'{1}','{2}',{3},'{4}','{5}', (select string_agg(prefix_code,',')  from product_warehouse_rule where product_id in ({1}) ) prefix_code, {6}", model.fk_rule, model.fk_products, model.location, model.fk_vendor, model.services, model.countryshipping, model.fk_warehouse));


                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Setting/CreateShiprule/" + model.fk_products + "", "Insert shipping rule.");
                throw ex; }
            return result;
        }

        public static DataSet GetProducts()
        {
            DataSet DS = new DataSet();
            try
            {
                /*   string strSQl = "SELECT p.id,CONCAT(p.post_title, COALESCE(CONCAT(' (',s.meta_value,')'),'')) text FROM wp_posts AS p left join wp_postmeta as s on p.id = s.post_id and s.meta_key = '_sku' WHERE p.post_type in ('product','product_variation') AND p.post_status != 'draft' group by p.id, p.post_title, meta_value  ORDER BY p.ID;"
                               + " Select t.term_id id,name text From wp_terms t Left Join wp_term_taxonomy tt On t.term_id = tt.term_id WHERE tt.taxonomy = 'product_cat'";*/
                string strSQl = "SELECT COALESCE(ps.id,p.id) id,CONCAT(COALESCE(ps.post_title,p.post_title), COALESCE(CONCAT(' (' ,psku.meta_value,')'),'')) as text"
                                   + " FROM wp_posts as p"
                                   + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                   + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                   + " WHERE p.post_type = 'product' AND p.post_status = 'publish'";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet GetWarehouse(SearchModel model)
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT v.rowid as vid, v.name as vname, w.rowid as wid, w.ref as wname,v.fk_state as state, v.fk_country as country FROM wp_VendorWarehouse vs"
                               + " inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid"
                              + " inner join wp_vendor v on v.rowid = vs.VendorID where v.rowid='" + model.strValue2 + "'";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
    }
}