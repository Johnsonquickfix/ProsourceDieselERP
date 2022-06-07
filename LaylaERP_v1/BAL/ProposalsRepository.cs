namespace LaylaERP.BAL
{
    using DAL;
    using Models;
    using UTILITIES;
    using System.Data.SqlClient;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Web;
    using System.Xml;

    public class ProposalsRepository
    {
        public static DataTable GetProposals(DateTime? fromdate, DateTime? todate, long supplierid, bool IsBilled, string search, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "SERCH"),
                    //!CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                    new SqlParameter("@supplierid", supplierid),
                    new SqlParameter("@isbilled", IsBilled),
                    new SqlParameter("@searchcriteria", search),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_Proposals_search", parameters);
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

        //Get Purchase order Print 
        public static DataSet GetSupplierProposalsDetails(long id,string flag= "GETPO")
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", flag), new SqlParameter("@id", id), };
                ds = SQLHelper.ExecuteDataSet("erp_Proposals_search", para);
                ds.Tables[0].TableName = "po";
                if (ds.Tables.Count > 1) ds.Tables[1].TableName = "pod";
                if (ds.Tables.Count > 2) ds.Tables[2].TableName = "sod";
                if (ds.Tables.Count > 3) ds.Tables[3].TableName = "com";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        // generate invoice for Vendor Sales PO
        public static int generateinvoice(string ID)
        {
            try
            {               
                string strsql = String.Empty;
                int result = 0;
                //strsql = "update commerce_purchase_enquiry set ref_ext = REPLACE(ref, 'PO','PI'),billed = 1 where  rowid in(" + ID + ")";
                //strsql = "update commerce_purchase_enquiry set ref_ext =  concat('PI',convert(varchar(4), @getdate, 12),'-',right(concat('00000',(coalesce(max(right(ref_ext,5)),0) + 1)),5)) ,billed = 1 where  rowid in(" + ID + ")";
                strsql = "erp_updateinvoice_salespo";
                SqlParameter[] para =
                {
                new SqlParameter("@id", ID)
                };
                result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));  
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Proposals/generateinvoice/" + ID + "", "Generate invoice ");
                throw Ex;
            }
        }
        public static DataTable generatesalespoinvoice(string ID)
        {
            try
            {
                string strsql = String.Empty;
                int result = 0; 
                strsql = "erp_updatesalesinvoice_salespo";
                SqlParameter[] para =
                {
                new SqlParameter("@id", ID)
                };
                DataTable dt = SQLHelper.ExecuteDataTable(strsql, para);
                return dt;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Proposals/generateinvoice/" + ID + "", "Generate invoice ");
                throw Ex;
            }
        }
        public static DataTable manualgeneratesalespoinvoice(string ID)
        {
            try
            {
                string strsql = String.Empty;
                int result = 0;
                strsql = "erp_manualinvoiceupdate_salespo";
                SqlParameter[] para =
                {
                new SqlParameter("@id", ID)
                };
                DataTable dt = SQLHelper.ExecuteDataTable(strsql, para);
                return dt;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Proposals/generateinvoice/" + ID + "", "Generate invoice ");
                throw Ex;
            }
        }
        public static DataTable GetFedexJSONforRate(long? id, out string orders)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters = {
                    new SqlParameter("@fedexorders", SqlDbType.NVarChar, -1),
                    id.HasValue ? new SqlParameter("@id", id.Value) : new SqlParameter("@id", DBNull.Value), 
                    new SqlParameter("@flag", "FEDEX") 
                };
                parameters[0].Direction = ParameterDirection.Output;
                dt = SQLHelper.ExecuteDataTable("erp_Proposals_search", parameters);
                orders = parameters[0].Value.ToString();
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable UpdateFedexRate(string JSONdata)
        {
            var dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "FEDEXAMT"),
                    new SqlParameter("@fedexorders", JSONdata),
                };
                dt = SQLHelper.ExecuteDataTable("erp_Proposals_search", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
    }
}