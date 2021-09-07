﻿using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class SetupRepostiory
    {
        public static DataSet GetProducts()
        {
            DataSet DS = new DataSet();
            try
            {
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

        public static DataSet GetVendor()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT rowid, name from wp_vendor order by rowid";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable Getvendordetails(SearchModel model)
        {

            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT v.rowid as vid, v.name as vname, w.rowid as wid, w.ref as wname,v.fk_state as state, v.fk_country as country FROM wp_VendorWarehouse vs"
                               + " inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid"
                              + " inner join wp_vendor v on v.rowid = vs.VendorID where v.rowid='"+model.strValue1+"'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
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

        public static DataTable GetIdProductWarehouserule()
        {

            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT max(rowid) as id from product_warehouse_rule";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddProductWarehouseRule(SetupModel model)
        {
            try
            {
                string strsql = "INSERT into product_warehouse_rule(product_id, prefix_code, status) values(@product_id, @prefix_code, @status);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@product_id", model.product_id),
                    new MySqlParameter("@prefix_code",model.prefix_code),
                    new MySqlParameter("@status",'1'),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int AddProductWarehouseRuleDetails(SetupModel model, int id)
        {
            try
            {
                string strsql = "INSERT into product_warehouse_rule_details(fk_product_rule, country, state, fk_vendor, fk_warehouse) values(@fk_product_rule, @country, @state, @fk_vendor, @fk_warehouse);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@fk_product_rule", id),
                    new MySqlParameter("@country",model.country),
                    new MySqlParameter("@state",model.state),
                    new MySqlParameter("@fk_vendor",model.fk_vendor),
                    new MySqlParameter("@fk_warehouse",model.fk_warehouse),
               };
                int result = Convert.ToInt32(DAL.SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetTableWarehouseRule()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT COALESCE(ps.id,p.id) id,COALESCE(ps.post_title,p.post_title) as product, ww.ref as warehouse, wv.name as vendor, pwr.prefix_code as code"
                                  +" FROM wp_posts as p"
                                  +" LEFT JOIN wp_posts ps ON ps.post_parent = p.id and ps.post_type LIKE 'product_variation'"
                                  +" left join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                                  +" INNER join product_warehouse_rule pwr on pwr.product_id = ps.id"
                                  +" INNER join product_warehouse_rule_details pwrd on pwrd.fk_product_rule = pwr.rowid"
                                  +" inner join wp_warehouse ww on ww.rowid = pwrd.fk_warehouse"
                                  +" inner join wp_vendor wv on wv.rowid = pwrd.fk_vendor"
                                  +" WHERE p.post_type = 'product' AND p.post_status = 'publish'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

    }
}
