using Dapper;
using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CustomerRepository
    {
        public int AddNewCustomer(CustomerModel model)
        {
            try
            {
                string strsql = "insert into wp_users(user_login,user_nicename, user_email, user_registered, display_name, user_image)values(@user_login,@user_nicename, @user_email, @user_registered, @display_name, @user_image);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_login", model.user_nicename),
                    new MySqlParameter("@user_nicename", model.user_nicename),
                    new MySqlParameter("@user_email", model.user_email),
                    new MySqlParameter("@user_registered", Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new MySqlParameter("@display_name", model.user_nicename),
                    new MySqlParameter("@user_image", "None"),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int EditCustomer(CustomerModel model,long userid)
        {
            try
            {
                string strsql = "update wp_users set user_nicename=@user_nicename, user_email=@user_email where Id=" + userid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_nicename", model.user_nicename),
                    new MySqlParameter("@user_email", model.user_email),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public void AddUserMetaData(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public void UpdateUserMetaData(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public void AddUserMetaDataBillingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public void UpdateUserMetaDataBillingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=meta_key";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public void AddUserMetaDataShippingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public void UpdateUserMetaDataShippingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "Update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=meta_key";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_id", id),
                    new MySqlParameter("@meta_key", varFieldsName),
                    new MySqlParameter("@meta_value", varFieldsValue),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable CustomerList(int userstatus,string searchid, int pageno, int pagesize, out int totalrows,string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ur.id,null User_Image,user_nicename, user_registered, user_status, if(user_status=0,'Active','InActive') as status,user_email,umph.meta_value "
                             + " from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%'"
                             + " inner JOIN wp_usermeta umph on umph.meta_key='billing_phone' And umph.user_id = ur.ID WHERE 1 = 1";
                if (!string.IsNullOrEmpty(searchid)) {
                    strWhr += " and (User_Email like '%"+ searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' )"; 
                }
                strWhr += " and (ur.user_status='"+userstatus+"') ";
             
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}" , SortCol, SortDir, (pageno * pagesize).ToString() , pagesize.ToString());

                strSql += "; SELECT ceil(Count(ur.id)/" + pagesize.ToString() + ") TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
                if (ds.Tables[1].Rows.Count > 0)
                    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
            }
            catch { }
            return dt;
        }
        public int EditCustomerStatus(CustomerModel model)
        {               
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id=" + model.ID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_status", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int DeleteCustomer(string ID)
        {
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id in(" +ID + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@user_status", "1")
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
    
}