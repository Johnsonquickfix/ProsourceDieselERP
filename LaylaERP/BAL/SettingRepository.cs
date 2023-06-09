﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System.Text;

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
                    "SMTPServerPortNo=@SMTPServerPortNo, PaypalClientId=@PaypalClientId, PaypalSecret=@PaypalSecret,PaypalSellerAccount=@PaypalSellerAccount,AuthorizeAPILogin=@AuthorizeAPILogin, " +
                    " AuthorizeTransKey=@AuthorizeTransKey,AmazonAPIId=@AmazonAPIId,AmazonUser=@AmazonUser,AmazonPwd=@AmazonPwd,TaxjarAPIId=@TaxjarAPIId, " +
                    "TaxjarAPIId=@TaxjarAPIId,TaxjarUser=@TaxjarUser,TaxjarPwd=@TaxjarPwd,podiumAPIKey=@podiumAPIKey,podiumSecretKey=@podiumSecretKey,podium_refresh_code=@podium_refresh_code,podium_code=@podium_code where ID=@user_id";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@AuthorizeNet",model.AuthorizeNet),
                    new MySqlParameter("@Paypal", model.Paypal),
                    new MySqlParameter("@AmazonPay",model.AmazonPay),
                    new MySqlParameter("@CreditCustomer",model.CreditCustomer),
                    new MySqlParameter("@Podium",model.Podium),
                    new MySqlParameter("@SenderEmailID", SenderEmailID),
                    new MySqlParameter("@SenderEmailPwd", model.SenderEmailPwd),
                    new MySqlParameter("@SMTPServerName", model.SMTPServerName),
                    new MySqlParameter("@SMTPServerPortNo",model.SMTPServerPortNo),
                    new MySqlParameter("@PaypalClientId",model.PaypalClientId),
                    new MySqlParameter("@PaypalSecret", model.PaypalSecret),
                    new MySqlParameter("@PaypalSellerAccount",model.PaypalSellerAccount),
                    new MySqlParameter("@AuthorizeAPILogin",model.AuthorizeAPILogin),
                    new MySqlParameter("@AuthorizeTransKey", model.AuthorizeTransKey),
                    new MySqlParameter("@AmazonAPIId", model.AmazonAPIId),
                    new MySqlParameter("@AmazonUser", model.AmazonUser),
                    new MySqlParameter("@AmazonPwd", model.AmazonPwd),
                    new MySqlParameter("@TaxjarAPIId",model.TaxjarAPIId),
                    new MySqlParameter("@TaxjarUser", model.TaxjarUser),
                    new MySqlParameter("@TaxjarPwd", model.TaxjarPwd),
                    new MySqlParameter("@podiumAPIKey",model.podiumAPIKey),
                    new MySqlParameter("@podiumSecretKey",model.podiumSecretKey),
                    new MySqlParameter("@podium_code",model.podium_code),
                    new MySqlParameter("@podium_refresh_code",model.podium_refresh_code),

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
                    " logo_url=@logo_url,additional_notes=@additional_notes " +
                    " where entity=@id";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@id", id),
                    new MySqlParameter("@lastname",model.lastname),
                    new MySqlParameter("@CompanyName", model.CompanyName),
                    new MySqlParameter("@firstname",model.firstname),
                    new MySqlParameter("@address",model.address),
                    new MySqlParameter("@address1",model.address1),              
                    new MySqlParameter("@zip", model.postal_code),
                    new MySqlParameter("@town", model.City),
                    new MySqlParameter("@fk_state",model.State),
                    new MySqlParameter("@fk_country",model.Country),
                    new MySqlParameter("@country_code_phone", model.country_code_phone),
                    new MySqlParameter("@user_mobile",model.user_mobile),
                    new MySqlParameter("@email",model.email),
                    new MySqlParameter("@website", model.website),
                    new MySqlParameter("@logo_url", model.logo_url),
                    new MySqlParameter("@additional_notes", model.additional_notes)       

                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
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
                MySqlParameter[] para =
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
                string strsql = "insert into erp_order_automation_filter(name,description)values(@name,@description);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@name", model.rule_name),
                     new MySqlParameter("@description", model.description)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
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
                + " wv.name vendrname,services,prefix_code"
                + " from erp_order_automation_rule eoar"
                + " left OUTER join erp_order_automation_filter eoaf on eoaf.rowid = eoar.fk_rule"
                //+ " left OUTER join erp_StateList esl on esl.State = eoar.location "
                 + " left OUTER join erp_StateList eslcun on eslcun.Country = eoar.country"
                //+ " left OUTER join wp_posts ps on ps.id = eoar.fk_product"
                + " left OUTER join wp_vendor wv on wv.rowid = eoar.fk_vendor"
                + " WHERE eoar.rowid > 0" + strWhr

              + " order by " + SortCol + " " + SortDir + " limit " + (pageno).ToString() + ", " + pagesize + "";

                strSql += "; SELECT count(distinct eoar.rowid) TotalRecord from erp_order_automation_rule eoar"
                + " left OUTER join erp_order_automation_filter eoaf on eoaf.rowid = eoar.fk_rule"
                //+ " left OUTER join erp_StateList esl on esl.State = eoar.location"
                + " left OUTER join erp_StateList eslcun on eslcun.Country = eoar.country"
                //+ " left OUTER join wp_posts ps on ps.id = eoar.fk_product"
                + " left OUTER join wp_vendor wv on wv.rowid = eoar.fk_vendor"
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

                string strSql = "SELECT rowid ID,fk_rule,location,fk_product,fk_vendor,services,Country from erp_order_automation_rule ScD"
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
                                + " WHERE fk_rule =" + model.fk_rule + " and location = '" + model.location + "' and fk_product  = "+ model.fk_product + " "
                                + " limit 10;";
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
                strSql.Append(string.Format("update erp_order_automation_rule set location = '{0}',fk_product = '{1}',fk_vendor = {2},services = '{3}',fk_rule = {4},country= '{5}',prefix_code= (select group_concat(prefix_code) from product_warehouse_rule where product_id in ({1})) where rowid = {6}", model.location, model.fk_products, model.fk_vendor, model.services, model.fk_rule,model.countryshipping, model.ID));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            { throw ex; }
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
                strSql.Append(string.Format("insert into erp_order_automation_rule (fk_rule,fk_product,location,fk_vendor,services,country,prefix_code) select {0},'{1}','{2}',{3},'{4}','{5}', (select group_concat(prefix_code)  from product_warehouse_rule where product_id in ({1}) ) prefix_code", model.fk_rule, model.fk_products, model.location, model.fk_vendor, model.services, model.countryshipping));
                /// step 6 : wp_posts
                //strSql.Append(string.Format(" update wp_posts set post_status = '{0}' ,comment_status = 'closed' where id = {1} ", model.OrderPostStatus.status, model.OrderPostStatus.order_id));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                }
            catch (Exception ex)
            { throw ex; }
            return result;
        }

        public static DataSet GetProducts()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT p.id,CONCAT(p.post_title, COALESCE(CONCAT(' (',s.meta_value,')'),'')) text FROM wp_posts AS p left join wp_postmeta as s on p.id = s.post_id and s.meta_key = '_sku' WHERE p.post_type in ('product','product_variation') AND p.post_status != 'draft' group by p.post_title  ORDER BY p.ID;"
                            + " Select t.term_id id,name text From wp_terms t Left Join wp_term_taxonomy tt On t.term_id = tt.term_id WHERE tt.taxonomy = 'product_cat'";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

    }
}