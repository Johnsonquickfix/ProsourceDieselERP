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
                string strSQl = "select rowid as ID, concat(nom,' (',name_alias,')') as Name from wp_vendor where VendorStatus=1 order by rowid desc;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public string GetPurchaseOrderCode()
        {
            string result = "";
            try
            {
                string strsql = "SELECT CONCAT('PO', DATE_FORMAT(CURDATE(),'%y%m'),'-',max(LPAD(rowid+1 ,5,0)))  as Code from commerce_purchase_order;";
                result = SQLHelper.ExecuteScalar(strsql).ToString();
            }
            catch (Exception ex)
            { throw ex; }
            return result;
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
                string strSQl = "select rowid as ID, concat(nom,' (',name_alias,')') as Name, code_fournisseur as vendor from wp_vendor where rowid=" + VendorID + " and VendorStatus=1 order by ID;";
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
        public static DataSet GetBalanceDays()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select ID, Balance from BalanceDays order by ID limit 50;");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public int AddNewPurchase(PurchaseOrderModel model)
        {
            try
            {
                 
                string refe = GetPurchaseOrderCode();

                string strsql = "";
                strsql = "insert into commerce_purchase_order(ref,ref_ext,ref_supplier,fk_soc,fk_statut,source,fk_cond_reglement,BalanceDaysID,fk_mode_reglement,date_livraison,fk_incoterms,location_incoterms,note_private,note_public) values(@ref,@ref_ext,@ref_supplier,@fk_soc,@fk_statut,@source,@fk_cond_reglement,@BalanceDaysID,@fk_mode_reglement,@date_livraison,@fk_incoterms,@location_incoterms,@note_private,@note_public); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", refe),
                    new MySqlParameter("@ref_ext", model.VendorCode),
                    new MySqlParameter("@ref_supplier", model.Vendor),
                    new MySqlParameter("@fk_soc", model.VendorID),
                    new MySqlParameter("@fk_statut", "2"),
                    new MySqlParameter("@source", "0"),
                    new MySqlParameter("@fk_cond_reglement", model.PaymentTerms),
                    new MySqlParameter("@BalanceDaysID", model.Balancedays),
                    new MySqlParameter("@fk_mode_reglement", model.PaymentType),
                    new MySqlParameter("@date_livraison", model.Planneddateofdelivery),
                    new MySqlParameter("@fk_incoterms", model.IncotermType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@note_public", model.note_public),



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
                string strsql = "Update commerce_purchase_order set ref=@ref,ref_supplier=@ref_supplier,fk_soc=@fk_soc,fk_statut=@fk_statut,source=@source,fk_cond_reglement = @fk_cond_reglement,BalanceDaysID = @BalanceDaysID,fk_mode_reglement = @fk_mode_reglement,date_livraison = @date_livraison,fk_incoterms = @fk_incoterms,location_incoterms = @location_incoterms,note_private = @note_private,note_public = @note_public where rowid = " + PurchaseID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref_ext", model.VendorCode),
                    new MySqlParameter("@ref_supplier", model.Vendor),
                    new MySqlParameter("@fk_soc", model.VendorID),
                    new MySqlParameter("@fk_statut", "2"),
                    new MySqlParameter("@source", "0"),
                    new MySqlParameter("@fk_cond_reglement", model.PaymentTerms),
                    new MySqlParameter("@BalanceDaysID", model.Balancedays),
                    new MySqlParameter("@fk_mode_reglement", model.PaymentType),
                    new MySqlParameter("@date_livraison", model.Planneddateofdelivery),
                    new MySqlParameter("@fk_incoterms", model.IncotermType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@note_public", model.note_public),

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