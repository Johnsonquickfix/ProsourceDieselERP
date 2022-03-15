using LaylaERP.DAL;
using LaylaERP.UTILITIES;
using System;
using System.Data;
using System.Data.SqlClient;

namespace LaylaERP.Models
{
    public class CustomerRepository
    {
        public int AddNewCustomer(CustomerModel model)
        {
            byte[] myimage = { 0X20 };
            try 
            {
                string strsql = "insert into wp_users(user_login,user_nicename, user_email, user_registered, display_name, user_image)values(@user_login,@user_nicename, @user_email, @user_registered, @display_name, @user_image); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_login", model.user_nicename ?? (object)DBNull.Value),
                    new SqlParameter("@user_nicename", model.user_nicename ?? (object)DBNull.Value),
                    new SqlParameter("@user_email", model.user_email ?? (object)DBNull.Value),
                    new SqlParameter("@user_registered", Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new SqlParameter("@display_name", model.user_nicename ?? (object)DBNull.Value),
                    new SqlParameter("@user_image", myimage),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/NewUser/" + model.ID + "", "created in manage customer");
                throw Ex;
            }
        }

        public int EditCustomer(CustomerModel model,long userid)
        {
            try
            {
                string strsql = "update wp_users set user_nicename=@user_nicename, user_email=@user_email where Id=@id";
                SqlParameter[] para =
                {
                    new SqlParameter("@flag", "U"),
                    new SqlParameter("@id", userid),
                    new SqlParameter("@user_nicename", model.user_nicename ?? (object)DBNull.Value),
                    new SqlParameter("@user_email", model.user_email ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/NewUser/" + model.ID + "", "Updated  manage customer");
                throw Ex;
            }
        }
        public void AddUserMetaData(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value);";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName ?? (object)DBNull.Value),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/Adduser_MetaData/" + model.ID + "", "created in metadata customer");
                throw Ex;
            }
        }
        public void UpdateUserMetaData(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName ?? (object)DBNull.Value),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/Updateuser_MetaData/" + model.ID + "", "Updated  meta data customer");
                throw Ex;
            }
        }
        public void AddUserMetaDataBillingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value);";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName ?? (object)DBNull.Value),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/Adduser_MetaData_BillingAddress/" + model.ID + "", "create in billing address customer");
                throw Ex;
            }
        }

        public void UpdateUserMetaDataBillingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName ?? (object)DBNull.Value),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/Updateuser_MetaData_BillingAddress/" + model.ID + "", "Updated meta Billing Address customer");
                throw Ex;
            }
        }
        public void AddUserMetaDataShippingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(@user_id,@meta_key,@meta_value);";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName ?? (object)DBNull.Value),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/Adduser_MetaData_ShippingAddress/" + model.ID + "", "Create meta Shipping Address customer");
                throw Ex;
            }
        }
        public void UpdateUserMetaDataShippingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                string strsql = "Update wp_usermeta set meta_value=@meta_value where user_id=@user_id and meta_key=@meta_key";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_id", id),
                    new SqlParameter("@meta_key", varFieldsName ?? (object)DBNull.Value),
                    new SqlParameter("@meta_value", varFieldsValue ?? (object)DBNull.Value),
                };
                SQLHelper.ExecuteNonQuery(strsql, para);
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/Updateuser_MetaData_ShippingAddress/" + model.ID + "", "Update meta Shipping Address customer");
                throw Ex;
            }
        }
        public static DataTable CustomerList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                //string strWhr = string.Empty;

                //string strSql = "SELECT ur.id,null User_Image,user_nicename, CONVERT(VARCHAR(12), user_registered, 107) user_registered, user_status,"
                //            + " case when user_status=0 then 'Active' else 'InActive' end as status,user_email,CONCAT(umfn.meta_value,' ',umln.meta_value) name ,umph.meta_value  billing_phone from wp_users ur"
                //            + " INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' LEFT OUTER JOIN wp_usermeta umph on umph.meta_key='billing_phone' And umph.user_id = ur.ID LEFT OUTER JOIN wp_usermeta umfn on umfn.meta_key='first_name' And umfn.user_id = ur.ID LEFT OUTER JOIN wp_usermeta umln on umln.meta_key='last_name' And umln.user_id = ur.ID WHERE 1 = 1";
                //if (!string.IsNullOrEmpty(searchid))
                //{
                //    strWhr += " and (User_Email like '%" + searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR um.meta_value like '%" + searchid + "%')";
                //}
                //if (userstatus != null)
                //{
                //    strWhr += " and (ur.user_status='" + userstatus + "') ";
                //}
                //strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY; ");


                //strSql += "; SELECT Count(ur.id)/" + pagesize.ToString() + " TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

                //DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                //dt = ds.Tables[0];
                //if (ds.Tables[1].Rows.Count > 0)
                //    totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());

                SqlParameter[] parameters =
               {                    
                     
                    new SqlParameter("@post_status", userstatus),
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@flag", "CLS")
                };

                DataSet ds = SQLHelper.ExecuteDataSet("erp_customer_search", parameters);
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
        public static DataTable CustomerByID(CustomerModel model)
        {
            DataTable dt = new DataTable();
            
            try
            {
                string strWhr = string.Empty;
                /*
                string strSql = "SELECT ur.ID,ur.user_nicename, ur.user_email,MAX( case when um.meta_key = 'first_name' THEN um.meta_value ELSE '' END) first_name," +
                    "MAX( case when um.meta_key = 'last_name' THEN um.meta_value ELSE '' END) last_name, MAX( case when um.meta_key = 'billing_address_1' THEN um.meta_value ELSE '' END) " +
                    "billing_address_1,MAX( case when um.meta_key = 'billing_address_2' THEN um.meta_value ELSE '' END) billing_address_2," +
                    "MAX( case when um.meta_key = 'billing_city' THEN um.meta_value ELSE '' END) billing_city,MAX( case when um.meta_key = 'billing_postcode' THEN um.meta_value ELSE '' END)" +
                    " billing_postcode,MAX( case when um.meta_key = 'billing_country' THEN um.meta_value ELSE '' END) billing_country,MAX( case when um.meta_key = 'billing_state' THEN um.meta_value ELSE '' END) " +
                    "billing_state,MAX( case when um.meta_key = 'billing_phone' THEN um.meta_value ELSE '' END) billing_phone,zip.StateFullName from wp_users ur INNER JOIN wp_usermeta um on ur.ID = um.user_id left JOIN wp_usermeta umstate on ur.ID = umstate.user_id and umstate.meta_key='billing_state' left JOIN ZIPCodes1 zip on zip.State = umstate.meta_value and umstate.meta_key = 'billing_state' " +
                    "WHERE 1 = 1 and ur.id = '" +model.ID+ "' GROUP BY ur.ID,ur.user_nicename, ur.user_email, zip.StateFullName"; */
                SqlParameter[] param =
                {
                    new SqlParameter("@id", model.ID),
                };
                string strSql = "erp_getcustomerdetailsbyid";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql, param);
                dt = ds.Tables[0];
               
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public int EditCustomerStatus(CustomerModel model)
        {               
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id=" + model.ID + "";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_status", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/UpdateCustomer/" + model.ID + "", "Updated  manage customer");
                throw Ex;
            }
        }
        public int DeleteCustomer(string ID)
        {
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id in(" +ID + ")";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_status", "1")
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/DeleteCustomer/" + ID + "", "Delete Customer ");
                throw Ex;
            }
        }

        public int ChangeCustomerStatus(CustomerModel model,string ID)
        {
            try
            {
                string strsql = "update wp_users set user_status=@user_status where Id in(" + ID + ")";
                SqlParameter[] para =
                {
                    new SqlParameter("@user_status", model.user_status)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception 
            Ex)
            
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Customer/ChangeCustomerStatus/" + model.ID + "", "Update Customer status changed");
                throw Ex;
            }
        }
        public static DataSet SearchCustomerAddress(string CustomerID)
        {
            DataSet dt = new DataSet();
            try
            {
                //string strSql = "SELECT distinct pmu.meta_value customer_id, concat('{', STRING_AGG(concat('\"', pm.meta_key, '\": \"', pm.meta_value, '\"'), ','), '}') as meta_data"
                //            + " FROM wp_posts po inner join wp_postmeta pmu on pmu.post_id = po.ID and pmu.meta_key = '_customer_user' and pmu.meta_value = '" + CustomerID + "'"
                //            + " inner join wp_postmeta pm on pm.post_id = pmu.post_id"
                //            + " and pm.meta_key in ('_billing_first_name', '_billing_last_name', '_billing_company', '_billing_address_1', '_billing_address_2', '_billing_city', '_billing_state', '_billing_country', '_billing_postcode', '_billing_phone', '_billing_email', '_shipping_first_name', '_shipping_last_name', '_shipping_company', '_shipping_address_1', '_shipping_address_2', '_shipping_city', '_shipping_state', '_shipping_country', '_shipping_postcode')"
                //            + " WHERE po.post_type = 'shop_order' and po.post_status != 'auto-draft'"
                //            + " group by po.ID, pmu.meta_value";
                //dt = SQLHelper.ExecuteDataSet(strSql);
                string strSql = "SELECT distinct pmu.meta_value customer_id, max(case pm.meta_key when '_billing_first_name' then pm.meta_value else '' end) b_first_name,max(case pm.meta_key when '_billing_last_name' then pm.meta_value else '' end) b_last_name,"
                          + " max(case pm.meta_key when '_billing_company' then pm.meta_value else '' end) b_company,max(case pm.meta_key when '_billing_address_1' then pm.meta_value else '' end) b_address_1,max(case pm.meta_key when '_billing_address_2' then pm.meta_value else '' end) b_address_2,max(case pm.meta_key when '_billing_postcode' then pm.meta_value else '' end) b_postcode,max(case pm.meta_key when '_billing_city' then pm.meta_value else '' end) b_city,"
                          + " max(case pm.meta_key when '_billing_country' then pm.meta_value else '' end) b_country,max(case pm.meta_key when '_billing_state' then pm.meta_value else '' end) b_state,max(case pm.meta_key when '_billing_email' then pm.meta_value else '' end) b_email,max(case pm.meta_key when '_billing_phone' then pm.meta_value else '' end) b_phone,max(case pm.meta_key when '_shipping_first_name' then pm.meta_value else '' end) s_first_name,max(case pm.meta_key when '_shipping_last_name' then pm.meta_value else '' end) s_last_name,"
                          + " max(case pm.meta_key when '_shipping_company' then pm.meta_value else '' end) s_company,max(case pm.meta_key when '_shipping_address_1' then pm.meta_value else '' end) s_address_1,max(case pm.meta_key when '_shipping_address_2' then pm.meta_value else '' end) s_address_2,max(case pm.meta_key when '_shipping_postcode' then pm.meta_value else '' end) s_postcode,max(case pm.meta_key when '_shipping_city' then pm.meta_value else '' end) s_city,max(case pm.meta_key when '_shipping_country' then pm.meta_value else '' end) s_country,max(case pm.meta_key when '_shipping_state' then pm.meta_value else '' end) s_state"
                          + " FROM wp_posts po inner join wp_postmeta pmu on pmu.post_id = po.ID and pmu.meta_key = '_customer_user' and  pmu.meta_value = '" + CustomerID + "' "
                          + " inner join wp_postmeta pm on pm.post_id = pmu.post_id   WHERE po.post_type = 'shop_order' and po.post_status != 'auto-draft' group by po.ID, pmu.meta_value ";
                dt = SQLHelper.ExecuteDataSet(strSql);
                dt.Tables[0].TableName = "po"; dt.Tables[0].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
    
}