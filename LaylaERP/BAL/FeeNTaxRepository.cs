﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System.Data;

namespace LaylaERP.BAL
{
    public class FeeNTaxRepository
    {
        public static List<FeeNTax> FeeNTaxlist = new List<FeeNTax>();
        public void AddFeeNTax(FeeNTax model)
        {
            try
            {
                //string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value)";

                string strsql = "INSERT INTO wp_staterecyclefee( staterecyclefee, item_parent_id, item_name, city, state, zip, country, is_taxable, is_active) VALUES (@staterecyclefee,@item_parent_id,@item_name,@city,@state,@zip,@country,@is_taxable,@is_active)";
                MySqlParameter[] para =
                {

                    new MySqlParameter("@staterecyclefee", model.staterecyclefee),
                    new MySqlParameter("@item_parent_id", model.item_parent_id),
                    new MySqlParameter("@item_name", model.item_name),
                    new MySqlParameter("@city", model.city),
                    new MySqlParameter("@state", model.state),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@is_taxable",model.is_taxable),
                    new MySqlParameter("@is_active",model.is_active),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }



        public int EditFeeNTaxStatus(FeeNTax model)
        {
            try
            {
                string strsql = "update wp_staterecyclefee set staterecyclefee= @staterecyclefee,item_parent_id=@item_parent_id,item_name=@item_name,city=@city,state=@state,zip=@zip,country=@country, is_taxable=@is_taxable, is_active=@is_active where id=@id ";
                MySqlParameter[] para =
                {
                     new MySqlParameter("@staterecyclefee", model.staterecyclefee),
                    new MySqlParameter("@item_parent_id", model.item_parent_id),
                    new MySqlParameter("@item_name", model.item_name),
                    new MySqlParameter("@city", model.city),
                    new MySqlParameter("@state", model.state),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@id", model.id),
                    new MySqlParameter("@is_taxable",model.is_taxable),
                    new MySqlParameter("@is_active",model.is_active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable FeeNTaxByID(FeeNTax model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                //string strSql = "SELECT id, staterecyclefee, item_parent_id, item_name, city, state, zip, country, is_taxable, is_active FROM wp_staterecyclefee where id='" + model.id + "'";
                string strSql = "SELECT e.id,e.staterecyclefee, e.item_parent_id, p.post_title as item_name, e.city, e.state, e.zip, e.country, e.is_taxable , e.is_active FROM wp_staterecyclefee e"
                               + " left join wp_posts p on p.ID = e.item_parent_id where e.id = '" + model.id + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable Getproduct(string strSearch)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ID,post_title FROM wp_posts WHERE post_type='product' and post_status='publish' and post_title like '" + strSearch + "%' order by post_title";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static void GetFeeNTaxList(string status)
        {

            try
            {
                FeeNTaxlist.Clear();
                DataSet ds1 = new DataSet();
                //string sqlquery = "SELECT id, staterecyclefee, item_parent_id, concat(item_parent_id,' - ',item_name) as item_name, city, state, zip, country, if(is_taxable=0,'No','Yes') as is_taxable, if(is_active=1,'Active','Inactive') as is_active FROM wp_staterecyclefee WHERE is_active='"+status+"'";
                string sqlquery = "SELECT e.id,e.staterecyclefee, e.item_parent_id, concat(e.item_parent_id,' - ',p.post_title) as item_name, e.city, e.state, e.zip, e.country, if(e.is_taxable=0,'No','Yes') as is_taxable, if(e.is_active=1,'Active','Inactive') as is_active FROM wp_staterecyclefee e"
                                  + " left join wp_posts p on p.ID = e.item_parent_id where is_active='" + status + "'";
                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    FeeNTax uobj = new FeeNTax();
                    //Code for role

                    uobj.id = Convert.ToInt32(ds1.Tables[0].Rows[i]["id"].ToString());
                    decimal d = Convert.ToDecimal(ds1.Tables[0].Rows[i]["staterecyclefee"]);
                    
                    uobj.recyclefee = String.Format("{0:0.00}", d);

                    uobj.item_name = ds1.Tables[0].Rows[i]["item_name"].ToString();
                    uobj.city = ds1.Tables[0].Rows[i]["city"].ToString();
                    uobj.state = ds1.Tables[0].Rows[i]["state"].ToString();
                    uobj.zip = ds1.Tables[0].Rows[i]["zip"].ToString();
                    uobj.country = ds1.Tables[0].Rows[i]["country"].ToString();
                    uobj.taxableshow = ds1.Tables[0].Rows[i]["is_taxable"].ToString();
                    uobj.activeshow = ds1.Tables[0].Rows[i]["is_active"].ToString();
                    //Code For Role End
                    FeeNTaxlist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }


        }

        public static DataTable FeeNTaxList()
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT id, staterecyclefee, item_parent_id, item_name, city, state, zip, country FROM wp_staterecyclefee WHERE 1";


                dt = SQLHelper.ExecuteDataTable(strSql);



            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetState(string strSearch)
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("select distinct State, StateFullName,StateFullName from ZIPCodes1 where State like '" + strSearch + "%' or StateFullName like '" + strSearch + "%' order by StateFullName limit 50;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataSet GetParentProduct()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "SELECT ID, post_title FROM wp_posts WHERE post_type = 'product' and post_status = 'publish' order by post_title";

                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
    }
}