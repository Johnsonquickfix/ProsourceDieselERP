using LaylaERP.Controllers;
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
                 strsql = "insert into wp_vendor(nom,name_alias,client,fournisseur,code_fournisseur,status,address,zip,town,fk_pays,fk_departement,phone,fax,email,url,siren,tva_assuj,fk_typent,fk_effectif,fk_forme_juridique,capital,location_incoterms) values(@nom, @name_alias, @client, @fournisseur, @code_fournisseur, @status, @address, @zip, @town, @fk_pays, @fk_departement, @phone, @fax, @email, @url, @siren, @tva_assuj, @fk_typent, @fk_effectif, @fk_forme_juridique, @capital, @location_incoterms); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@nom", model.Name),
                    new MySqlParameter("@name_alias", model.AliasName),
                    new MySqlParameter("@client", model.Prospect),
                    new MySqlParameter("@fournisseur","1"),
                    new MySqlParameter("@code_fournisseur", model.VendorCode),
                    new MySqlParameter("@status", model.Status),
                    new MySqlParameter("@address", model.Address),
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
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        //internal int AddNewVendor(ThirdPartyController model)
        //{
        //    throw new NotImplementedException();
        //}
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
    }
}