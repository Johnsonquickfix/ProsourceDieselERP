using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LaylaERP.Models;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using Newtonsoft.Json;
using System.Collections;
using LaylaERP.DAL;
using System.Security.Cryptography;
using System.Text;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class EntityRepositry
    {
        public static List<entityDetails> entitylist = new List<entityDetails>();
        public static void ShowDetails(string condition)
        {
            try
            {
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@condition", condition),
                    new SqlParameter("@flag", "List")
                };
                entitylist.Clear();
                DataSet ds1 = new DataSet();
                ds1 = DAL.SQLHelper.ExecuteDataSet("wp_entitylist", parameters);
                string result = string.Empty;
                for (int i = 0; i < ds1.Tables[0].Rows.Count; i++)
                {
                    entityDetails uobj = new entityDetails();
                    uobj.ID = Convert.ToInt32(ds1.Tables[0].Rows[i]["ID"].ToString());
                    uobj.companyname = ds1.Tables[0].Rows[i]["CompanyName"].ToString(); 
                    uobj.email = ds1.Tables[0].Rows[i]["email"].ToString();
                    //if ((ds1.Tables[0].Rows[i]["user_status"].ToString() == "0"))
                    //{ uobj.user_status = "Active"; }
                    //else { uobj.user_status = "InActive"; }
                    uobj.phone = ds1.Tables[0].Rows[i]["user_mobile"].ToString();
                    uobj.address = ds1.Tables[0].Rows[i]["address"].ToString();
                    uobj.status = ds1.Tables[0].Rows[i]["status"].ToString();
                    //Code For Role End
                    entitylist.Add(uobj);
                }

            }
            catch (Exception e)
            {

            }

        }

        public static int CreateEntity(string qflag,string ID, string Emailuser, string companyname, string FirstName, string LastName, string address, string country, string Countrycode, string Phone, string Zipcode, string City, string State, string Website, string LogoUrl, string AdditionalNotes, string base_url, string po_emailval,string address2)
        {
            try
            {
                SqlParameter[] para = {
                    new SqlParameter("@qflag",qflag),
                    new SqlParameter("@ID", ID),
                    new SqlParameter("@Emailuser",Emailuser),
                    new SqlParameter("@companyname",companyname),
                    new SqlParameter("@FirstName",FirstName),
                    new SqlParameter("@LastName",LastName),
                    new SqlParameter("@address",address),
                    new SqlParameter("@country",country),
                    new SqlParameter("@Phone",Phone),
                    new SqlParameter("@Zipcode",Zipcode),
                    new SqlParameter("@City",City),
                    new SqlParameter("@State",State),
                    new SqlParameter("@Website",Website),
                    new SqlParameter("@LogoUrl",LogoUrl),
                    new SqlParameter("@AdditionalNotes",AdditionalNotes),
                    new SqlParameter("@base_url",base_url),
                    new SqlParameter("@Countrycode",Countrycode),
                    new SqlParameter("@po_emailval",po_emailval),
                    new SqlParameter("address2",address2),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar("erp_entity_iud", para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetDataByID(entityDetails model)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                SqlParameter[] parameters =
                 {
                    new SqlParameter("@condition", ""),
                    new SqlParameter("@flag", "ByID"),
                    new SqlParameter("@rowid", model.ID),
                }; 
                DataTable ds = new DataTable();
                dt = DAL.SQLHelper.ExecuteDataTable("wp_entitylist", parameters);   

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int ActiveEntity(string ID, string status)
        {
            try
            {
                string strsql = "update erp_entityinfo set status=@status where rowid in(" + ID + ")";
                SqlParameter[] para =
                {
                    new SqlParameter("@status", status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Entity/ActiveEntity/" + ID + "", "Active/Deactive Entity");
                throw Ex;
            }
        }
    }
}