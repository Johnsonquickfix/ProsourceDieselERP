using System;
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

        public static void GetFeeNTaxList()
        {

            try
            {
                FeeNTaxlist.Clear();
                DataSet ds1 = new DataSet();
                string sqlquery = "SELECT id, staterecyclefee, item_parent_id, item_name, city, state, zip, country FROM wp_staterecyclefee WHERE 1";

                ds1 = DAL.SQLHelper.ExecuteDataSet(sqlquery);
                string result = string.Empty;

                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    FeeNTax uobj = new FeeNTax();
                    //Code for role

                    uobj.id = Convert.ToInt32(ds1.Tables[0].Rows[i]["id"].ToString());
                    uobj.staterecyclefee = Convert.ToUInt64(ds1.Tables[0].Rows[i]["staterecyclefee"].ToString());

                    uobj.item_name = ds1.Tables[0].Rows[i]["item_name"].ToString();
                    uobj.city = ds1.Tables[0].Rows[i]["city"].ToString();
                    uobj.state = ds1.Tables[0].Rows[i]["state"].ToString();
                    uobj.zip = ds1.Tables[0].Rows[i]["zip"].ToString();
                    uobj.country = ds1.Tables[0].Rows[i]["country"].ToString();
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
    }
}