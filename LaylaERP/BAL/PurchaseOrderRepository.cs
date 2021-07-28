using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class PurchaseOrderRepository
    {
        public static DataSet GetIncoterm()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select rowid as ID, IncoTerm, short_description from IncoTerms order by ID";
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
                string strSQl = "select rowid as ID, concat(nom,' (',name_alias,')') as Name from wp_vendor order by rowid desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetIncotermByID(int IncotermsTypeID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "Select rowid as ID, IncoTerm, short_description from IncoTerms where rowid=" + IncotermsTypeID + " order by ID;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataTable GetVendorByID(int VendorID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select rowid as ID, concat(nom,' (',name_alias,')') as Name, code_fournisseur as vendor from wp_vendor where rowid=" + VendorID + " order by ID;";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
        public static DataSet GetPaymentTerm()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select ID, PaymentTerm from PaymentTerms order by ID limit 50;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet GetPaymentType()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select ID,PaymentType from wp_PaymentType order by ID limit 50;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public int AddNewPurchase(PurchaseOrderModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Insert into commerce_proposal(fk_statut, note_private, note_public,fk_incoterms,location_incoterms) values(@fk_statut, @note_private, @note_public,fk_incoterms,location_incoterms); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@fk_statut", model.fk_statut),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@fk_incoterms", model.IncotermType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),


                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditPurchase(PurchaseOrderModel model, long PurchaseID)
        {
            try
            {
                string strsql = "fk_statut=@fk_statut, note_private=@note_private, note_public=@note_public,fk_incoterms=@fk_incoterms,location_incoterms=@location_incoterms where rowid = " + PurchaseID + "";
                MySqlParameter[] para =
                {
                   new MySqlParameter("@fk_statut", model.fk_statut),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@fk_incoterms", model.IncotermType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),

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