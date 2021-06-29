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
        public void AddFeeNTax(FeeNTax model)
        {
            try
            {
                //string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value)";

                string strsql = "INSERT INTO wp_staterecyclefee( staterecyclefee, item_parent_id, item_name, city, state, zip, country) VALUES (@staterecyclefee,@item_parent_id,@item_name,@city,@state,@zip,@country)";
                MySqlParameter[] para =
                {

                    new MySqlParameter("@staterecyclefee", model.staterecyclefee),
                    new MySqlParameter("@item_parent_id", model.item_parent_id),
                    new MySqlParameter("@item_name", model.item_name),
                    new MySqlParameter("@city", model.city),
                    new MySqlParameter("@state", model.state),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@country", model.country),

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
                string strsql = "update wp_staterecyclefee set staterecyclefee= @staterecyclefee,item_parent_id=@item_parent_id,item_name=@item_name,city=@city,state=@state,zip=@zip,country=@country where id=@id ";
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

                string strSql = "SELECT id, staterecyclefee, item_parent_id, item_name, city, state, zip, country FROM wp_staterecyclefee where id='" + model.id + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
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
    }
}