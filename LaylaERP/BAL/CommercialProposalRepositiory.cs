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
    public class CommercialProposalRepositiory
    {

        public static DataSet GetVendor()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, name from wp_vendor where VendorStatus='1' order by rowid limit 50;");
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

        public static DataSet GetPaymentType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select ID, PaymentType from wp_PaymentType order by ID limit 50;");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataSet SourceOrderChannel()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, name from order_channel order by rowid limit 50;");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

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
        public static DataTable GetVendorByID(int VendorTypeID)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "Select rowid, name from wp_vendor where rowid=" + VendorTypeID + ";";
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

        public static int AddProposal(CommercialProposalModel model)
        {
            string fin_validity;
            fin_validity = DateTime.UtcNow.AddDays(model.fin_validite).ToString("yyyy-MM-dd");
            try
            {
                string strsql = "insert into commerce_proposal" +
                    "(ref,entity,fk_vendor,datec,datep,fin_validite,fk_user_author,fk_statut,payment_term,balance,payment_type,fk_availability,fk_shipping_method,fk_incoterms,model_pdf,note_public,note_private,date_delivery,location_incoterms,validity_duration)" +
                    " values(@ref,1,@fk_vendor,@datec,@datep,@fin_validite,1,1,@payment_term,@balance,@payment_type,@fk_availability,@fk_shipping_method,@fk_incoterms,@model_pdf,@note_public,@note_private,@date_delivery,@location_incoterms,@validity_duration);SELECT LAST_INSERT_ID();";

                MySqlParameter[] para =
                {

                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@fk_vendor", model.fk_vendor),
                    new MySqlParameter("@datec", Convert.ToDateTime(DateTime.UtcNow.ToString())),
                    new MySqlParameter("@datep", model.datep),
                    new MySqlParameter("@fin_validite", fin_validity),
                    new MySqlParameter("@validity_duration", model.validity_duration),
                    new MySqlParameter("@payment_term", model.payment_term),
                    new MySqlParameter("@balance", model.balance),
                    new MySqlParameter("@payment_type", model.payment_type),
                    new MySqlParameter("@fk_availability",model.fk_availability),
                    new MySqlParameter("@fk_shipping_method", model.fk_shipping_method),
                    new MySqlParameter("@fk_incoterms", model.fk_incoterms),
                    new MySqlParameter("@model_pdf", model.model_pdf),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@date_delivery", model.date_delivery),
                    new MySqlParameter("@location_incoterms", model.location_incoterms),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetCommerceCode()
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("SELECT CONCAT('PROV', DATE_FORMAT(CURDATE(),'%y%m'),'-',max(LPAD(rowid+1 ,5,0)))  as Code from commerce_proposal;");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetCommerceProposal()
        {
            DataTable DT = new DataTable();
            try
            {
                string SqlQuery = "Select cp.rowid id, cp.ref, v.name vendorname, v.name_alias namealias ,v.town city, v.zip,LEFT(CAST(cp.datep as DATE),10) proposaldate,LEFT(CAST(cp.fin_validite as DATE),10) enddate, s.Status status from commerce_proposal cp inner join wp_vendor v on cp.fk_vendor = v.rowid inner join wp_StatusMaster s on cp.fk_statut = s.ID where 1=1";
                //string SqlQuery = "Select cp.rowid id, cp.ref ,v.town city, v.zip,LEFT(CAST(cp.datep as DATE),10) proposaldate,LEFT(CAST(cp.fin_validite as DATE),10) enddate, s.Status as status from commerce_proposal cp inner join wp_vendor v on cp.fk_vendor = v.rowid inner join wp_StatusMaster s on cp.fk_statut = s.ID where 1=1";
                DT = SQLHelper.ExecuteDataTable(SqlQuery);
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetProposalByID(long id)
        {
            DataTable dt = new DataTable();

            try
            {
                //string strWhr = string.Empty;

                //string strSql = "SELECT rowid,ref,payment_term,balance,payment_type,fk_availability,fk_shipping_method,fk_incoterms,location_incoterms,note_public,note_private,fk_vendor," +
                //"LEFT(CAST(date_delivery as DATE),10) date_delivery,validity_duration,LEFT(CAST(datep as DATE),10) datep,location_incoterms from commerce_proposal where rowid=" + id + "";
                string strSql = "Select cp.rowid as rowid, cp.ref, v.name vendorname, v.name_alias namealias, LEFT(CAST(cp.datep as DATE), 10) proposaldate,LEFT(CAST(cp.fin_validite as DATE), 10) enddate,"
                + "LEFT(CAST(cp.date_delivery as DATE),10) deliverydate,s.Status as status, bd.Balance as balance, pterm.PaymentTerm as paymentterm, ptype.PaymentType as paymenttype, it.IncoTerm, sm.ShippingMethod as shippingmethod from commerce_proposal cp"
                + " left OUTER join wp_vendor v on cp.fk_vendor = v.rowid"
                + " left OUTER join wp_StatusMaster s on cp.fk_statut = s.ID"
                + " left OUTER join BalanceDays bd on cp.balance = bd.ID"
                + " left OUTER join PaymentTerms pterm on cp.payment_term = pterm.ID"
                + " left outer join wp_PaymentType ptype on cp.payment_type = ptype.ID"
                + " left outer join IncoTerms it on cp.fk_incoterms = it.rowid"
                + " left OUTER join wp_ShippingMethod sm on cp.fk_shipping_method=sm.ID"
                + " where cp.rowid=" + id + "";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int UpdateProposal(CommercialProposalModel model)
        {
            try
            {
                string fin_validity;
                fin_validity = DateTime.UtcNow.AddDays(model.fin_validite).ToString("yyyy-MM-dd");
                string strsql = "update commerce_proposal set ref=@ref, fin_validite=@fin_validite, fk_vendor=@fk_vendor, payment_term=@payment_term, balance=@balance," +
                    " payment_type=@payment_type, fk_availability=@fk_availability, fk_shipping_method=@fk_shipping_method, fk_incoterms=@fk_incoterms," +
                    " note_public=@note_public, note_private=@note_private, date_delivery=@date_delivery, model_pdf=@model_pdf, validity_duration=@validity_duration  where rowid in(" + model.rowid + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@fk_vendor", model.fk_vendor),
                    new MySqlParameter("@fin_validite", fin_validity),
                    new MySqlParameter("@payment_term", model.payment_term),
                    new MySqlParameter("@balance", model.balance),
                    new MySqlParameter("@payment_type", model.payment_type),
                    new MySqlParameter("@fk_availability",model.fk_availability),
                    new MySqlParameter("@fk_shipping_method", model.fk_shipping_method),
                    new MySqlParameter("@fk_incoterms", model.fk_incoterms),
                    new MySqlParameter("@model_pdf", model.model_pdf),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@date_delivery", model.date_delivery),
                    new MySqlParameter("@validity_duration", model.validity_duration),

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

