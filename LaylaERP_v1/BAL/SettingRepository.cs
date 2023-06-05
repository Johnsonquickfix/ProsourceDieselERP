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
                    " TaxjarUser=@TaxjarUser,TaxjarPwd=@TaxjarPwd,podiumAPIKey=@podiumAPIKey,podiumSecretKey=@podiumSecretKey,podium_refresh_code=@podium_refresh_code,podium_code=@podium_code,podium_locationuid=@podium_locationuid, affirm_api_key = @affirm_api_key, affirm_private_api_key = @affirm_private_api_key, amazon_public_key = @amazon_public_key, amazon_private_key = @amazon_private_key where ID=@user_id";
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
                    new SqlParameter("@affirm_api_key",model.affirm_api_key),
                    new SqlParameter("@affirm_private_api_key",model.affirm_private_api_key),
                    new SqlParameter("@amazon_public_key",model.amazon_public_key),
                    new SqlParameter("@amazon_private_key",model.amazon_private_key),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/Update_Setting/" + id + "", "Update global setting.");
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

        public static DataTable ProductList(string strValue1, string userstatus, string strValue3, string strValue4, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "order_id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                //if (strValue1 == "0")
                //    strValue1 = "";
                //if (strValue3 == "0")
                //    strValue3 = "";
                //if (strValue4 == "0")
                //    strValue4 = "";

                //if (!string.IsNullOrEmpty(userstatus))
                //{
                //    if (userstatus == "private")
                //        strWhr += " and p.post_status in ('publish','private')";
                //    else
                //        strWhr += " and p.post_status = '" + userstatus + "'";
                //}
                //else
                //    strWhr += " and p.post_status != 'auto-draft' ";
                //if (userstatus != "trash")
                //{
                //    strWhr += " and p.post_status != 'draft' ";
                //}
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.ID like '%" + searchid + "%' "
                            + " OR post_title like '%" + searchid + "%' "
                            //+ " OR itemname like '%" + searchid + "%' "
                            + " OR s.meta_value like '%" + searchid + "%' "
                            + " OR p.post_status like '%" + searchid + "%' "
                            //+ " OR pm1.meta_value like '%" + searchid + "%' "
                            //+ " OR pmstc.meta_value like '%" + searchid + "%' "


                            + " )";
                }
                //if (!string.IsNullOrEmpty(strValue1))
                //{

                //    strWhr += " and (case when p.post_parent = 0 then p.id else p.post_parent end) in (select object_id from wp_term_relationships ttr where ttr.term_taxonomy_id='" + strValue1 + "')";
                //}
                //if (!string.IsNullOrEmpty(strValue3))
                //{

                //    strWhr += " and product_slug like '%" + strValue3 + "%' ";
                //}
                //if (!string.IsNullOrEmpty(strValue4))
                //{

                //    strWhr += " and pmstc.meta_value like '%" + strValue4 + "%' ";
                //}      
                string strSql = "Select * from ( select p.id,max(p.post_type)post_type,max(p.post_title)post_title,"
              + "  max(case when p.id = s.post_id and s.meta_key = '_product_attributes' then s.meta_value else '' end) attributes,"
              + " max(case when p.id = s.post_id and s.meta_key = '_product_attributes' then s.meta_value_old else '0' end) oldattributes,"
              + "  (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status"
              + " FROM wp_posts p "
              + " left join wp_postmeta as s on p.id = s.post_id"             
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' " + strWhr
              + " GROUP BY  p.ID,guid,post_status,post_parent) tt where post_parent = 0"
               + " order by p_id,post_type,id";
                //+ " order by p_id" + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT count(distinct p.ID) TotalRecord FROM wp_posts p"
               + " left join wp_postmeta as s on p.id = s.post_id"              
              + " WHERE p.post_type in ('product', 'product_variation') and p.post_status != 'draft' and post_parent = 0" + strWhr;



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

        public static DataTable GetattributesById(string id)
        {
            DataTable dt = new DataTable();
            string strQuery = string.Empty;
            try
            {
                strQuery = "SELECT meta_value,meta_value_old,isnull((select term_id  from wp_terms where term_id in ( select term_id from wp_term_taxonomy where taxonomy = 'product_type' and term_taxonomy_id in (SELECT term_taxonomy_id FROM wp_term_relationships where object_id = P.post_id))),0) pid FROM wp_postmeta p where meta_key = '_product_attributes' and post_id =" + id + "";
                dt = SQLHelper.ExecuteDataTable(strQuery);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int Updateattribitues(string attributes, string o_attributes, int producttpye, int product_id)
        {
            try
            {
                DataTable dt = new DataTable();
                // string strsql = "INSERT into product_warehouse_rule_details(fk_product_rule, country, state, fk_vendor, fk_warehouse) values(@fk_product_rule, @country, @state, @fk_vendor, @fk_warehouse); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@product_id", product_id),
                    new SqlParameter("@attributes",attributes),
                    new SqlParameter("@o_attributes",o_attributes),
                    new SqlParameter("@producttpye",producttpye),

               };
                dt = SQLHelper.ExecuteDataTable("erp_product_attributes_iud", para);
                int result = Convert.ToInt32(dt.Rows[0]["id"]);
                //int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/Updateattribitues/" + product_id + "", "Update Product attributes.");
                throw Ex;
            }
        }

        public static int UpdateCompany(clsUserDetails model)
        {
            try
            {

                string strsql = "erp_company_iud";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@id", model.ID),
                    new SqlParameter("@user_nicename", model.user_nicename),
                    new SqlParameter("@user_email", model.user_email),
                    new SqlParameter("@display_name", model.user_nicename),
                    new SqlParameter("@user_image", model.User_Image),
                    new SqlParameter("@user_status", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/UpdateCompany/" + model.ID + "", "Update Setting");
                throw Ex;
            }
        }

        public static DataTable GetDetailscompany(long ID)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] parameters =
               {
                    new SqlParameter("@id", ID)
                };
                 string strquery = "select * from wp_company where id = " + ID ;
                 DT = SQLHelper.ExecuteDataTable(strquery, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetUserCompany(string optType)
        {
            DataTable dt = new DataTable();
            try
            {

                string strSql = "wp_userscompanylist";

                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        //public static DataSet Getcompany(string optType)
        //{
        //    DataSet DS = new DataSet();
        //    try
        //    { 
        //        string strSQl = "Select entity ID, CompanyName label from erp_entityinfo ;";
        //        DS = SQLHelper.ExecuteDataSet(strSQl);
        //    }
        //    catch (Exception ex)
        //    { throw ex; }
        //    return DS;
        //}
        public static DataTable GetcompanyData(string optType)
        {
            DataTable DS = new DataTable();
            try
            {
                string strSQl = "Select entity ID, CompanyName label from erp_entityinfo ;";
                DS = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable Selectcompanybiyid(long id)
        {
            DataTable dtr = new DataTable();
            try
            { 
                string strquery = "SELECT ID as id, user_id,company_id"
                                  + " FROM cms_usercompany"
                                  + " WHERE user_id='" + id + "' ";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int Updateusertocompany(SetupModel model)
        {

            try
            {
                string strsql = "cms_companyuser_iud"; 
                SqlParameter[] para =
               {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@user_id",model.searchid), 
                    new SqlParameter("@company_id",model.state),
                    new SqlParameter("@company",model.country),
            };

                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setup/erp_company_iud/" + model.searchid + "", "Update user company details.");
                throw Ex;
            }
        }

        public static DataSet GetCompany(string id)
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "cms_userscompany";
                SqlParameter[] para =
                  {
                        new SqlParameter("@qflag", "I"),
                        new SqlParameter("@id",id), 
                };
                // + " WHERE p.post_type = 'product' AND p.post_status = 'publish'"; 
                DS = SQLHelper.ExecuteDataSet(strSQl, para);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable Getentitylogo(long ID)
        {
            DataTable DT = new DataTable();
            try
            {
                SqlParameter[] parameters =
               {
                    new SqlParameter("@id", ID)
                };
                string strquery = "select logo_url from erp_entityinfo where entity = " + ID;
                DT = SQLHelper.ExecuteDataTable(strquery, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetProductCompany(string optType)
        {
            DataTable dt = new DataTable();
            try
            {

                string strSql = "cms_productcompanylist";

                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int UpdateProducttocompany(SetupModel model)
        {

            try
            {
                string strsql = "cms_companyproduct_iud";
                SqlParameter[] para =
               {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@product_id",model.searchid),
                    new SqlParameter("@company_id",model.state),
                    new SqlParameter("@company",model.country),
            };

                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Setting/cms_companyproduct_iud/" + model.searchid + "", "Update product company details.");
                throw Ex;
            }
        }

        public static DataTable Selectproductcompanybiyid(long id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ID as id, product_id,company_id"
                                  + " FROM cms_productcompany"
                                  + " WHERE product_id='" + id + "' and company_id is not null ";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
    }
}