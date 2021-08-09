using LaylaERP.DAL;
using LaylaERP.Models;
using MySql.Data.MySqlClient;
using System;
using System.Data;

namespace LaylaERP.BAL
{
    public class ThirdPartyRepository
    {
        public int AddNewVendorBasicInfo(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "insert into wp_vendor(vendor_type,code_vendor,name,name_alias,fournisseur,status,address,address1,zip,town,fk_country,fk_state,phone,fax,email,url,Workinghours,VendorStatus) " +
                    "values(@vendor_type, @code_vendor, @name, @name_alias, @fournisseur, @status, @address, @address1, @zip, @town, @fk_country, @fk_state, @phone, @fax, @email, @url, @Workinghours, @VendorStatus);  SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@vendor_type", model.vendor_type),
                    new MySqlParameter("@code_vendor", model.VendorCode),
                    new MySqlParameter("@name", model.Name),
                    new MySqlParameter("@name_alias", model.AliasName),
                    new MySqlParameter("@fournisseur","1"),
                    new MySqlParameter("@status", model.Status),
                    new MySqlParameter("@address", model.Address),
                    new MySqlParameter("@address1", model.Address1),
                    new MySqlParameter("@zip", model.ZipCode),
                    new MySqlParameter("@town", model.City),
                    new MySqlParameter("@fk_country", model.Country),
                    new MySqlParameter("@fk_state", model.State),
                    new MySqlParameter("@phone", model.Phone),
                    new MySqlParameter("@fax", model.Fax),
                    new MySqlParameter("@email", model.EMail),
                    new MySqlParameter("@url", model.Web),
                    new MySqlParameter("@Workinghours", model.Workinghours),
                    new MySqlParameter("@VendorStatus", model.VendorStatus),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int AddVendorAdditionalInfo(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update wp_vendor set CorAddress1=@CorAddress1,CorAddress2=@CorAddress2,CorCity=@CorCity,CorState=@CorState,CorZipCode=@CorZipCode,CorCountry=@CorCountry," +
                    "CorPhone = @CorPhone,fk_workforce = @fk_workforce,fk_business_entity = @fk_business_entity, note_public = @note_public,note_private = @note_private where rowid="+model.rowid+"";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@CorAddress1", model.CorAddress1),
                    new MySqlParameter("@CorAddress2", model.CorAddress2),
                    new MySqlParameter("@CorCity", model.CorCity),
                    new MySqlParameter("@CorState", model.CorState),
                    new MySqlParameter("@CorZipCode",model.CorZipCode),
                    new MySqlParameter("@CorCountry", model.CorCountry),
                    new MySqlParameter("@CorPhone", model.CorPhone),
                    new MySqlParameter("@fk_workforce", model.Workforce),
                    new MySqlParameter("@fk_business_entity", model.BusinessEntityType),
                    new MySqlParameter("@note_public", model.NotePublic),
                    new MySqlParameter("@note_private", model.NotePrivate),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddVendorPaymentTerms(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update wp_vendor set capital=@capital,PaymentTermsID=@PaymentTermsID,BalanceID=@BalanceID,fk_incoterms=@fk_incoterms,location_incoterms=@location_incoterms," +
                    "Currency = @Currency,CreditLimit = @CreditLimit,outstanding_limit = @outstanding_limit,MinimumOrderQuanity = @MinimumOrderQuanity,order_min_amount = @order_min_amount where rowid=" + model.rowid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@capital", model.Capital),
                    new MySqlParameter("@PaymentTermsID", model.PaymentTermsID),
                    new MySqlParameter("@BalanceID", model.BalanceID),
                    new MySqlParameter("@fk_incoterms", model.IncotermsType),
                    new MySqlParameter("@location_incoterms",model.Incoterms),
                    new MySqlParameter("@Currency", model.Currency),
                    new MySqlParameter("@CreditLimit", model.CreditLimit),
                    new MySqlParameter("@outstanding_limit", model.outstanding_limit),
                    new MySqlParameter("@MinimumOrderQuanity", model.MinimumOrderQuanity),
                    new MySqlParameter("@order_min_amount", model.order_min_amount),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddVendorShipping(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_vendor set fk_shipping_method=@fk_shipping_method,ShippingRate=@ShippingRate,ShippingLocation=@ShippingLocation,ShippingAPIKeyTest = @ShippingAPIKeyTest,ShippingAPISecretTest = @ShippingAPISecretTest,ShippingAPIKeyProduction = @ShippingAPIKeyProduction," +
                    "ShippingAPISecretProduction = @ShippingAPISecretProduction,ShippingLogin = @ShippingLogin,ShippingPassword = @ShippingPassword where rowid=" + model.rowid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@fk_shipping_method", model.fk_shipping_method),
                    new MySqlParameter("@ShippingRate", model.ShippingRate),
                    new MySqlParameter("@ShippingLocation", model.ShippingLocation),
                    new MySqlParameter("@ShippingAPIKeyTest", model.ShippingAPIKeyTest),
                    new MySqlParameter("@ShippingAPISecretTest",model.ShippingAPISecretTest),
                    new MySqlParameter("@ShippingAPIKeyProduction", model.ShippingAPIKeyProduction),
                    new MySqlParameter("@ShippingAPISecretProduction", model.ShippingAPISecretProduction),
                    new MySqlParameter("@ShippingLogin", model.ShippingLogin),
                    new MySqlParameter("@ShippingPassword", model.ShippingPassword),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddVendorTaxes(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_vendor set TaxMethod=@TaxMethod,DefaultTax=@DefaultTax,ShippingTax=@ShippingTax,CalculatedTax=@CalculatedTax,ShippingTaxIncludedinprice = @ShippingTaxIncludedinprice,TaxIncludedinPrice = @TaxIncludedinPrice where rowid=" + model.rowid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@fk_shipping_method", model.TaxMethod),
                    new MySqlParameter("@ShippingRate", model.DefaultTax),
                    new MySqlParameter("@ShippingLocation", model.ShippingTax),
                    new MySqlParameter("@CalculatedTax", model.CalculatedTax),
                    new MySqlParameter("@ShippingAPIKeyTest", model.ShippingTaxIncludedinprice),
                    new MySqlParameter("@ShippingAPISecretTest",model.TaxIncludedinPrice),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddVendorDiscount(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update wp_vendor set DiscountType1=@DiscountType1,DefaultDiscount=@DefaultDiscount,order_min_amount=@order_min_amount,AccountName = @AccountName,AccountEmail = @AccountEmail,DiscountType2 = @DiscountType2,Discount = @Discount where rowid=" + model.rowid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@DiscountType1", model.DiscountType1),
                    new MySqlParameter("@DefaultDiscount", model.DefaultDiscount),
                    new MySqlParameter("@order_min_amount", model.order_min_amount),
                    new MySqlParameter("@AccountName", model.AccountName),
                    new MySqlParameter("@AccountEmail", model.AccountEmail),
                    new MySqlParameter("@DiscountType2",model.DiscountType2),
                    new MySqlParameter("@Discount",model.Discount),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddPaymentMethods(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update wp_vendor set DiscountType1=@DiscountType1,DefaultDiscount=@DefaultDiscount,order_min_amount=@order_min_amount,AccountName = @AccountName,AccountEmail = @AccountEmail,DiscountType2 = @DiscountType2,Discount = @Discount where rowid=" + model.rowid + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@DiscountType1", model.DiscountType1),
                    new MySqlParameter("@DefaultDiscount", model.DefaultDiscount),
                    new MySqlParameter("@order_min_amount", model.order_min_amount),
                    new MySqlParameter("@AccountName", model.AccountName),
                    new MySqlParameter("@AccountEmail", model.AccountEmail),
                    new MySqlParameter("@DiscountType2",model.DiscountType2),
                    new MySqlParameter("@Discount",model.Discount),
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
                string strsql = "update wp_vendor set name=@name,vendor_type=@vendor_type,name_alias=@name_alias,code_vendor=@code_vendor,status=@status,address=@address,address1=@address1,zip = @zip,town = @town,fk_country = @fk_country,fk_state = @fk_state,StateName=@StateName,phone = @phone,fax = @fax,email = @email,url = @url," +
                    "salestaxused = @salestaxused,fk_typparty = @fk_typparty,fk_workforce = @fk_workforce,fk_Business_Entity = @fk_Business_Entity,capital = @capital,fk_incoterms=@fk_incoterms,location_incoterms=@location_incoterms,SalesRepresentative=@SalesRepresentative,PaymentTermsID=@PaymentTermsID,BalanceID=@BalanceID," +
                    "PaymentDate=@PaymentDate,Currency=@Currency ,EnableVendorUOM=@EnableVendorUOM ,UnitsofMeasurment=@UnitsofMeasurment,MinimumOrderQuanity=@MinimumOrderQuanity,DefaultTax=@DefaultTax,TaxIncludedinPrice=@TaxIncludedinPrice,DefaultDiscount=@DefaultDiscount,CreditLimit=@CreditLimit,VendorStatus=@VendorStatus," +
                    "outstanding_limit=@outstanding_limit,fk_shipping_method=@fk_shipping_method,order_min_amount=@order_min_amount where rowid = " + VendorID + "";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@name", model.Name),
                    new MySqlParameter("@name_alias", model.AliasName),
                    new MySqlParameter("@vendor_type", model.vendor_type),
                    //new MySqlParameter("@client", model.Prospect),
                    new MySqlParameter("@code_vendor", model.VendorCode),
                    new MySqlParameter("@status", model.Status),
                    new MySqlParameter("@address", model.Address),
                    new MySqlParameter("@address1", model.Address1),
                    new MySqlParameter("@zip", model.ZipCode),
                    new MySqlParameter("@town", model.City),
                    new MySqlParameter("@fk_country", model.Country),
                    new MySqlParameter("@fk_state", model.State),
                    new MySqlParameter("@StateName", model.StateName),
                    new MySqlParameter("@phone", model.Phone),
                    new MySqlParameter("@fax", model.Fax),
                    new MySqlParameter("@email", model.EMail),
                    new MySqlParameter("@url", model.Web),
                    new MySqlParameter("@salestaxused", model.SalesTaxUsed),
                    new MySqlParameter("@fk_typparty", model.ThirdPartyType),
                    new MySqlParameter("@fk_workforce", model.Workforce),
                    new MySqlParameter("@fk_Business_Entity", model.BusinessEntityType),
                    new MySqlParameter("@capital", model.Capital),
                    new MySqlParameter("@SalesRepresentative", model.SalesRepresentative),
                    new MySqlParameter("@PaymentTermsID", model.PaymentTermsID),
                    new MySqlParameter("@BalanceID", model.BalanceID),
                    new MySqlParameter("@PaymentDate", model.PaymentDate),
                    new MySqlParameter("@Currency", model.Currency),
                    new MySqlParameter("@EnableVendorUOM", model.EnableVendorUOM),
                    new MySqlParameter("@UnitsofMeasurment", model.UnitsofMeasurment),
                    new MySqlParameter("@MinimumOrderQuanity", model.MinimumOrderQuanity),
                    new MySqlParameter("@DefaultTax", model.DefaultTax),
                    new MySqlParameter("@TaxIncludedinPrice", model.TaxIncludedinPrice),
                    new MySqlParameter("@DefaultDiscount", model.DefaultDiscount),
                    new MySqlParameter("@fk_incoterms", model.IncotermsType),
                    new MySqlParameter("@location_incoterms", model.Incoterms),
                    new MySqlParameter("@CreditLimit", model.CreditLimit),
                    new MySqlParameter("@VendorStatus", model.VendorStatus),
                    new MySqlParameter("@outstanding_limit", model.outstanding_limit),
                    new MySqlParameter("@fk_shipping_method", model.fk_shipping_method),
                    new MySqlParameter("@order_min_amount", model.order_min_amount),
                    

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
                if (country == "CA")
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
        public static DataSet GetVendorType()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select rowid ID,vendor_type from wp_vendortype order by rowid";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet GetShippingMethod()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select ID,ShippingMethod from wp_ShippingMethod order by ID";
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
        public static DataSet GetDiscountType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select ID, DiscountType from wp_discountType;");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet GetPaymentMethod()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select ID,PaymentType from wp_PaymentType where Flag='V' order by ID;");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataTable GetVendorCode()
        {
            DataTable DT = new DataTable();
            try
            {
                DT = SQLHelper.ExecuteDataTable("SELECT CONCAT('SU', DATE_FORMAT(CURDATE(),'%y%m'),'-',max(LPAD(rowid+1 ,5,0)))  as Code from wp_vendor;");
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

                string strSql = "Select rowid as ID, name as VendorName, name_alias as AliasName,entity,status,code_vendor as VendorCode, zip,address,address1,town,fk_state as State, fk_country as Country, phone,fax,url,email,fk_workforce as Workforce,fk_typparty as ThirdPartyType,fk_business_entity as BusinessEntityType, capital, fournisseur as Vendor,location_incoterms as Incoterms, salestaxused as Salestaxused,SalesRepresentative,PaymentTermsID,BalanceID,PaymentDate,Currency ,EnableVendorUOM ,UnitsofMeasurment,MinimumOrderQuanity,DefaultTax,TaxIncludedinPrice,DefaultDiscount,CreditLimit,VendorStatus FROM wp_vendor where 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (email like '%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR nom like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (VendorStatus='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord from wp_vendor  WHERE 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetProduct(int id, long rowid)
        {
            DataTable dt = new DataTable();
            try
            {
                id = Convert.ToInt32(rowid);
                string strWhr = string.Empty;
                string strSql = "";
                if (rowid > 0)
                {
                    strSql = "Select v.id, w.ref as warehouse, v.LeadTime, v.DaysofStock from wp_VendorSetting v inner join wp_warehouse w on v.WarehouseID = w.rowid where VendorID='" + id + "'";
                }
                else
                {
                    strSql = "select rowid as id,ref as warehouse, '' as LeadTime,'' as DaysofStock from wp_warehouse";
                }
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

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
                string strSql = "Select rowid as ID,vendor_type, name as VendorName, name_alias as AliasName,entity,status,code_vendor as VendorCode, zip,address,address1,town,fk_state as State,StateName, fk_country as Country, phone,fax,url,email,fk_workforce as Workforce,fk_typparty as ThirdPartyType,fk_business_entity as BusinessEntityType,capital, fournisseur as Vendor,fk_incoterms as IncotermsType,location_incoterms as Incoterms, salestaxused as Salestaxused,SalesRepresentative,PaymentTermsID,BalanceID,LEFT(CAST(PaymentDate AS DATE), 10) PaymentDate,Currency ,EnableVendorUOM ,UnitsofMeasurment,MinimumOrderQuanity,DefaultTax,TaxIncludedinPrice,DefaultDiscount,CreditLimit,VendorStatus,outstanding_limit,fk_shipping_method,order_min_amount FROM wp_vendor where rowid='" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        //public int VendorSetting(string WarehouseID, int VendorID, string LeadTime, string DaysofStock)
        //{
        //    try
        //    {
        //        int result = 0;
        //        string[] Warehouse_ID = WarehouseID.Split(',');
        //        string[] Lead_Time = LeadTime.Split(',');
        //        string[] Days_of_Stock = DaysofStock.Split(',');

        //        for (int i = 0; i <= Warehouse_ID.Length - 1; i++)
        //        {
        //            WarehouseID = Warehouse_ID[i].ToString();
        //            LeadTime = Lead_Time[i].ToString();
        //            DaysofStock = Days_of_Stock[i].ToString();

        //            string strsql = "Insert into wp_VendorSetting(LeadTime,DaysofStock,VendorID,WarehouseID) Values(@LeadTime,@DaysofStock,@VendorID,@WarehouseID);SELECT LAST_INSERT_ID();";
        //            MySqlParameter[] para =
        //            {
        //            new MySqlParameter("@WarehouseID", WarehouseID),
        //            new MySqlParameter("@LeadTime", LeadTime),
        //            new MySqlParameter("@DaysofStock", DaysofStock),
        //            new MySqlParameter("@VendorID", VendorID)
        //            };
        //            result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
        //        }
        //        return result;
        //    }
        //    catch (Exception Ex)
        //    {
        //        throw Ex;
        //    }
        //}
        //public int EditVendorSetting(string WarehouseID, long VendorID, string LeadTime, string DaysofStock)
        //{
        //    try
        //    {
        //        int result = 0;
        //        string[] Warehouse_ID = WarehouseID.Split(',');
        //        string[] Lead_Time = LeadTime.Split(',');
        //        string[] Days_of_Stock = DaysofStock.Split(',');

        //        for (int i = 0; i <= Warehouse_ID.Length - 1; i++)
        //        {
        //            WarehouseID = Warehouse_ID[i].ToString();
        //            LeadTime = Lead_Time[i].ToString();
        //            DaysofStock = Days_of_Stock[i].ToString();

        //            string strsql = "Update wp_VendorSetting set LeadTime=@LeadTime,DaysofStock=@DaysofStock where ID=" + WarehouseID + " and VendorID=" + VendorID + ";";
        //            MySqlParameter[] para =
        //            {
        //            new MySqlParameter("@WarehouseID", WarehouseID),
        //            new MySqlParameter("@LeadTime", LeadTime),
        //            new MySqlParameter("@DaysofStock", DaysofStock),
        //            new MySqlParameter("@VendorID", VendorID)
        //            };
        //            result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
        //        }
        //        return result;
        //    }
        //    catch (Exception Ex)
        //    {
        //        throw Ex;
        //    }
        //}
    }
}