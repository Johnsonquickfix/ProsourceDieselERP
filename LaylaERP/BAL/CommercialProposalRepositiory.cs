﻿using LaylaERP.DAL;
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
                DS = SQLHelper.ExecuteDataSet("Select rowid, nom from wp_vendor order by rowid limit 50;");
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
                string strSQl = "Select rowid, nom from wp_vendor where rowid=" + VendorTypeID + ";";
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
                    "(ref,entity,fk_vendor,datec,datep,fin_validite,fk_user_author,fk_statut,payment_term,balance,payment_type,fk_availability,fk_shipping_method,fk_incoterms,model_pdf,note_public,note_private,date_delivery)" +
                    " values(@ref,1,@fk_vendor,@datec,@datep,@fin_validite,1,0,@payment_term,@balance,@payment_type,@fk_availability,@fk_shipping_method,@fk_incoterms,@model_pdf,@note_public,@note_private,@date_delivery);SELECT LAST_INSERT_ID();";
                
                MySqlParameter[] para =
                {
                    
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@fk_vendor", model.fk_vendor),
                    new MySqlParameter("@datec", Convert.ToDateTime(DateTime.UtcNow.ToString())),
                    new MySqlParameter("@datep", model.datep),
                    new MySqlParameter("@fin_validite", fin_validity),
                    //new MySqlParameter("@type_mouvement", model.type_mouvement),
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

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}

