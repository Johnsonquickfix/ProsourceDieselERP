﻿using LaylaERP.Controllers;
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
    public class ThirdPartyRepository
    {
        public int AddNewVendor(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                 strsql = "insert into wp_vendor(nom,name_alias,client,fournisseur,code_fournisseur,status,address,address1,zip,town,fk_pays,fk_departement,phone,fax,email,url,siren,tva_assuj,fk_typent,fk_effectif,fk_forme_juridique,capital,location_incoterms,SalesRepresentative) values(@nom, @name_alias, @client, @fournisseur, @code_fournisseur, @status, @address, @zip, @town, @fk_pays, @fk_departement, @phone, @fax, @email, @url, @siren, @tva_assuj, @fk_typent, @fk_effectif, @fk_forme_juridique, @capital, @location_incoterms,@SalesRepresentative); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@nom", model.Name),
                    new MySqlParameter("@name_alias", model.AliasName),
                    new MySqlParameter("@client", model.Prospect),
                    new MySqlParameter("@fournisseur","1"),
                    new MySqlParameter("@code_fournisseur", model.VendorCode),
                    new MySqlParameter("@status", model.Status),
                    new MySqlParameter("@address", model.Address),
                    new MySqlParameter("@address1", model.Address1),
                    new MySqlParameter("@zip", model.ZipCode),
                    new MySqlParameter("@town", model.City),
                    new MySqlParameter("@fk_pays", model.Country),
                    new MySqlParameter("@fk_departement", model.State),
                    new MySqlParameter("@phone", model.Phone),
                    new MySqlParameter("@fax", model.Fax),
                    new MySqlParameter("@email", model.EMail),
                    new MySqlParameter("@url", model.Web),
                    new MySqlParameter("@siren", model.ProfId),
                    new MySqlParameter("@tva_assuj", model.SalesTaxUsed),
                    new MySqlParameter("@fk_typent", model.ThirdPartyType),
                    new MySqlParameter("@fk_effectif", model.Workforce),
                    new MySqlParameter("@fk_forme_juridique", model.BusinessEntityType),
                    new MySqlParameter("@capital", model.Capital),
                    new MySqlParameter("@location_incoterms", model.Incoterms),
                    new MySqlParameter("@SalesRepresentative", model.SalesRepresentative),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int EditVendor(ThirdPartyModel model, long VendorID)
        {
            try
            {
                string strsql = "update wp_vendor set nom=@nom,name_alias=@name_alias,code_fournisseur=@code_fournisseur,status=@status,address=@address,address1=@address1,zip = @zip,town = @town,fk_pays = @fk_pays,fk_departement = @fk_departement,phone = @phone,fax = @fax,email = @email,url = @url,tva_assuj = @tva_assuj,fk_typent = @fk_typent,fk_effectif = @fk_effectif,fk_forme_juridique = @fk_forme_juridique,capital = @capital,SalesRepresentative=@SalesRepresentative where rowid = " + VendorID +"";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@nom", model.Name),
                    new MySqlParameter("@name_alias", model.AliasName),
                    //new MySqlParameter("@client", model.Prospect),
                    new MySqlParameter("@code_fournisseur", model.VendorCode),
                    new MySqlParameter("@status", model.Status),
                    new MySqlParameter("@address", model.Address),
                    new MySqlParameter("@address1", model.Address1),
                    new MySqlParameter("@zip", model.ZipCode),
                    new MySqlParameter("@town", model.City),
                    new MySqlParameter("@fk_pays", model.Country),
                    new MySqlParameter("@fk_departement", model.State),
                    new MySqlParameter("@phone", model.Phone),
                    new MySqlParameter("@fax", model.Fax),
                    new MySqlParameter("@email", model.EMail),
                    new MySqlParameter("@url", model.Web),
                    new MySqlParameter("@tva_assuj", model.SalesTaxUsed),
                    new MySqlParameter("@fk_typent", model.ThirdPartyType),
                    new MySqlParameter("@fk_effectif", model.Workforce),
                    new MySqlParameter("@fk_forme_juridique", model.BusinessEntityType),
                    new MySqlParameter("@capital", model.Capital),
                    new MySqlParameter("@SalesRepresentative", model.SalesRepresentative)

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetState(string strSearch, string country)
        {
            DataTable DT = new DataTable();
            try
            {
                if (country == "CA - Canada")
                {
                    DT = SQLHelper.ExecuteDataTable("select distinct StateFullName from StateList where StateFullName like '" + strSearch + "%' order by StateFullName limit 50;");
                }
                else
                {
                    DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,StateFullName,State from ZIPCodes1 where StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%' order by StateFullName limit 50;");
                }
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }

        public static DataTable GetVendor(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select rowid as ID, nom as VendorName, name_alias as AliasName,entity,status,code_fournisseur as VendorCode, zip,address,address1,town,fk_departement as State, fk_pays as Country, phone,fax,url,email,fk_effectif as Workforce,fk_typent as ThirdPartyType,fk_forme_juridique as BusinessEntityType, siren as ProfId, capital, fournisseur as Vendor,location_incoterms as Incoterms, tva_assuj as Salestaxused FROM rpsisr_woo.wp_vendor";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (User_Email like '%" + searchid + "%' OR User_Login='%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR um.meta_value like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (ur.user_status='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, (pageno * pagesize).ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ur.id)/" + pagesize.ToString() + ") TotalPage,Count(ur.id) TotalRecord from wp_users ur INNER JOIN wp_usermeta um on um.meta_key='wp_capabilities' And um.user_id = ur.ID And um.meta_value LIKE '%customer%' WHERE 1 = 1 " + strWhr.ToString();

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
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
        public static DataTable VendorByID(long id)
        {
            DataTable dt = new DataTable();

            try
            {
                string strWhr = string.Empty;

                string strSql = "Select rowid as ID, nom as VendorName, name_alias as AliasName,entity,status,code_fournisseur as VendorCode, zip,address,address1,town,fk_departement as State, fk_pays as Country, phone,fax,url,email,fk_effectif as Workforce,fk_typent as ThirdPartyType,fk_forme_juridique as BusinessEntityType, siren as ProfId, capital, fournisseur as Vendor,location_incoterms as Incoterms, tva_assuj as Salestaxused,SalesRepresentative FROM rpsisr_woo.wp_vendor where rowid='" + id+"'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
    }
}