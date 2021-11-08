using LaylaERP.DAL;
using LaylaERP.Models;
using System.Data.SqlClient;
using System;
using System.Data;
using System.Text;

namespace LaylaERP.BAL
{
    public class ThirdPartyRepository
    {
        public int AddNewVendorBasicInfo(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "insert into wp_vendor(vendor_type,code_vendor,name,name_alias,fournisseur,status,address,address1,zip,town,fk_country,fk_state,StateName,phone,fax,email,url,Workinghours,VendorStatus,NatureofJournal) " +
                    "values(@vendor_type, @code_vendor, @name, @name_alias, @fournisseur, @status, @address, @address1, @zip, @town, @fk_country, @fk_state,@StateName, @phone, @fax, @email, @url, @Workinghours, @VendorStatus,@NatureofJournal); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@vendor_type", model.vendor_type),
                    new SqlParameter("@code_vendor", model.VendorCode ?? (object)DBNull.Value),
                    new SqlParameter("@name", model.Name ?? (object)DBNull.Value),
                    new SqlParameter("@name_alias", model.AliasName ?? (object)DBNull.Value),
                    new SqlParameter("@fournisseur","1"),
                    new SqlParameter("@status", model.Status),
                    new SqlParameter("@address", model.Address ?? (object)DBNull.Value),
                    new SqlParameter("@address1", model.Address1 ?? (object)DBNull.Value),
                    new SqlParameter("@zip", model.ZipCode ?? (object)DBNull.Value),
                    new SqlParameter("@town", model.City ?? (object)DBNull.Value),
                    new SqlParameter("@fk_country", model.Country ?? (object)DBNull.Value),
                    new SqlParameter("@fk_state", model.State ?? (object)DBNull.Value),
                    new SqlParameter("@StateName", model.StateName ?? (object)DBNull.Value),
                    new SqlParameter("@phone", model.Phone ?? (object)DBNull.Value),
                    new SqlParameter("@fax", model.Fax ?? (object)DBNull.Value),
                    new SqlParameter("@email", model.EMail ?? (object)DBNull.Value),
                    new SqlParameter("@url", model.Web ?? (object)DBNull.Value),
                    new SqlParameter("@Workinghours", model.Workinghours ?? (object)DBNull.Value),
                    new SqlParameter("@VendorStatus", model.VendorStatus),
                    new SqlParameter("@NatureofJournal", model.NatureofJournal),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddJournal(ThirdPartyModel model, int id)
        {
            try
            {
                string strsql = "";
                strsql = "Insert into erp_accounting_journal(code,label,nature,active,VendorID) values(@code,@label,@nature,@active,@VendorID); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@code", model.VendorCode ?? (object)DBNull.Value),
                    new SqlParameter("@label", model.Name ?? (object)DBNull.Value),
                    new SqlParameter("@nature", model.NatureofJournal),
                    new SqlParameter("@active", model.VendorStatus),
                    new SqlParameter("@VendorID", id),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditJournal(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_journal set code=@code,label=@label,nature=@nature,active=@active where VendorID=@ID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@ID", model.rowid),
                    new SqlParameter("@code", model.VendorCode ?? (object)DBNull.Value),
                    new SqlParameter("@label", model.Name ?? (object)DBNull.Value),
                    new SqlParameter("@nature", model.NatureofJournal),
                    new SqlParameter("@active", model.VendorStatus),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditVendorBasicInfo(ThirdPartyModel model)
        {
            try
            {
                //string strsql = "update wp_vendor set vendor_type=@vendor_type,name=@name,name_alias=@name_alias,fournisseur=@fournisseur,status=@status,address=@address,address1=@address1,zip=@zip,town=@town,fk_country=@fk_country,fk_state=@fk_state,StateName=@StateName,phone=@phone,fax=@fax,email=@email,url=@url,Workinghours=@Workinghours,VendorStatus = @VendorStatus,NatureofJournal=@NatureofJournal where rowid = @rowid; ";
                string strsql = "vendorbasicinfo";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@rowid", model.rowid),
                    new SqlParameter("@vendor_type", model.vendor_type),
                    new SqlParameter("@name", model.Name),
                    new SqlParameter("@name_alias", model.AliasName),
                    new SqlParameter("@fournisseur","1"),
                    new SqlParameter("@status", model.Status),
                    new SqlParameter("@address", model.Address),
                    new SqlParameter("@address1", model.Address1),
                    new SqlParameter("@zip", model.ZipCode),
                    new SqlParameter("@town", model.City),
                    new SqlParameter("@fk_country", model.Country),
                    new SqlParameter("@fk_state", model.State),
                    new SqlParameter("@StateName", model.StateName),
                    new SqlParameter("@phone", model.Phone),
                    new SqlParameter("@fax", model.Fax),
                    new SqlParameter("@email", model.EMail),
                    new SqlParameter("@url", model.Web),
                    new SqlParameter("@Workinghours", model.Workinghours),
                    new SqlParameter("@VendorStatus", model.VendorStatus),
                    new SqlParameter("@NatureofJournal", model.NatureofJournal),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                strsql = "update wp_vendor set CorAddress1=@CorAddress1,CorAddress2=@CorAddress2,CorCity=@CorCity,CorState=@CorState,CorZipCode=@CorZipCode,CorCountry=@CorCountry," +
                    "CorPhone = @CorPhone,fk_workforce = @fk_workforce,fk_business_entity = @fk_business_entity, note_public = @note_public,note_private = @note_private where rowid=@rowid;";
                SqlParameter[] para =
                {
                     new SqlParameter("@rowid", model.rowid),
                    new SqlParameter("@CorAddress1", model.CorAddress1 ?? (object)DBNull.Value),
                    new SqlParameter("@CorAddress2", model.CorAddress2 ?? (object)DBNull.Value),
                    new SqlParameter("@CorCity", model.CorCity ?? (object)DBNull.Value),
                    new SqlParameter("@CorState", model.CorState ?? (object)DBNull.Value),
                    new SqlParameter("@CorZipCode",model.CorZipCode ?? (object)DBNull.Value),
                    new SqlParameter("@CorCountry", model.CorCountry ?? (object)DBNull.Value),
                    new SqlParameter("@CorPhone", model.CorPhone ?? (object)DBNull.Value),
                    new SqlParameter("@fk_workforce", model.Workforce ?? (object)DBNull.Value),
                    new SqlParameter("@fk_business_entity", model.BusinessEntityType ?? (object)DBNull.Value),
                    new SqlParameter("@note_public", model.NotePublic ?? (object)DBNull.Value),
                    new SqlParameter("@note_private", model.NotePrivate ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                SqlParameter[] para =
                {
                    new SqlParameter("@capital", model.Capital),
                    new SqlParameter("@PaymentTermsID", model.PaymentTermsID),
                    new SqlParameter("@BalanceID", model.BalanceID),
                    new SqlParameter("@fk_incoterms", model.IncotermsType),
                    new SqlParameter("@location_incoterms",model.Incoterms),
                    new SqlParameter("@Currency", model.Currency),
                    new SqlParameter("@CreditLimit", model.CreditLimit),
                    new SqlParameter("@outstanding_limit", model.outstanding_limit),
                    new SqlParameter("@MinimumOrderQuanity", model.MinimumOrderQuanity),
                    new SqlParameter("@order_min_amount", model.order_min_amount),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                strsql = "Insert into erp_VendorShippingMethod(VendorID,ShippingMethodID,FedexAccountNumber,FedexMeterNumber,FedexWebServicesKey,FedexWebServicesPassword,FedexMethodType,FedexMethodEnable," +
                    "FedexCustomServices,FedexDebugMode,UPSUserID,UPSPassword,UPSAccessKey,UPSAccountNumber,UPSOriginPostcode,UPSOriginCountry,UPSAPILicenceKey," +
                    "UPSLicenceEmail,UPSEnable,UPSMeasurementUnits,UPSEnableDebugMode,USPSEnable,USPSPostcode,USPSUserID,USPSCommercialrates,USPSPacking,USPSPriorityMailExpressTitle," +
                    "USPSPriorityMailExpress,USPSPriorityMailExpressHoldforPickup,USPSPriorityMailExpressSundayHoliday,USPSPriorityMailTitle,USPSPriorityMail,USPSPriorityMailHoldForPickup," +
                    "USPSPriorityMailKeysandIDs,USPSPriorityMailRegionalRateBoxA,USPSPriorityMailRegionalRateBoxAHoldForPickup,USPSPriorityMailRegionalRateBoxB," +
                    "USPSPriorityMailRegionalRateBoxBHoldForPickup,FirstClassMailTitle,FirstClassMailPostcards,FirstClassMailLetter,FirstClassMailLargeEnvelope," +
                    "FirstClassMailParcel,FirstClassMailLargePostcards,FirstClassMailKeysandIDs,FirstClassMailPackageService,FirstClassMailPackageServiceHoldForPickup,FirstClassMailMeteredLetter) " +
                    "values(@VendorID, @ShippingMethodID, @FedexAccountNumber, @FedexMeterNumber, @FedexWebServicesKey, @FedexWebServicesPassword, @FedexMethodType, @FedexMethodEnable," +
                    "@FedexCustomServices, @FedexDebugMode, @UPSUserID, @UPSPassword, @UPSAccessKey, @UPSAccountNumber, @UPSOriginPostcode, @UPSOriginCountry, @UPSAPILicenceKey," +
                    "@UPSLicenceEmail, @UPSEnable, @UPSMeasurementUnits, @UPSEnableDebugMode, @USPSEnable, @USPSPostcode, @USPSUserID, @USPSCommercialrates, @USPSPacking, @USPSPriorityMailExpressTitle," +
                    "@USPSPriorityMailExpress, @USPSPriorityMailExpressHoldforPickup, @USPSPriorityMailExpressSundayHoliday, @USPSPriorityMailTitle, @USPSPriorityMail, @USPSPriorityMailHoldForPickup," +
                    "@USPSPriorityMailKeysandIDs, @USPSPriorityMailRegionalRateBoxA, @USPSPriorityMailRegionalRateBoxAHoldForPickup, @USPSPriorityMailRegionalRateBoxB," +
                    "@USPSPriorityMailRegionalRateBoxBHoldForPickup, @FirstClassMailTitle, @FirstClassMailPostcards, @FirstClassMailLetter, @FirstClassMailLargeEnvelope," +
                    "@FirstClassMailParcel, @FirstClassMailLargePostcards, @FirstClassMailKeysandIDs, @FirstClassMailPackageService, @FirstClassMailPackageServiceHoldForPickup,@FirstClassMailMeteredLetter); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@ShippingMethodID", model.ShippingMethodID),
                    new SqlParameter("@FedexAccountNumber", model.FedexAccountNumber ?? (object)DBNull.Value),
                    new SqlParameter("@FedexMeterNumber",model.FedexMeterNumber ?? (object)DBNull.Value),
                    new SqlParameter("@FedexWebServicesKey", model.FedexWebServicesKey ?? (object)DBNull.Value),
                    new SqlParameter("@FedexWebServicesPassword", model.FedexWebServicesPassword ?? (object)DBNull.Value),
                    new SqlParameter("@FedexMethodType", model.FedexMethodType ?? (object)DBNull.Value),
                    new SqlParameter("@FedexMethodEnable", model.FedexMethodEnable),
                    new SqlParameter("@FedexCustomServices", model.FedexCustomServices),
                    new SqlParameter("@FedexDebugMode", model.FedexDebugMode),
                    new SqlParameter("@UPSUserID", model.UPSUserID ?? (object)DBNull.Value),
                    new SqlParameter("@UPSPassword", model.UPSPassword ?? (object)DBNull.Value),
                    new SqlParameter("@UPSAccessKey", model.UPSAccessKey ?? (object)DBNull.Value),
                    new SqlParameter("@UPSAccountNumber", model.UPSAccountNumber ?? (object)DBNull.Value),
                    new SqlParameter("@UPSOriginPostcode", model.UPSOriginPostcode ?? (object)DBNull.Value),
                    new SqlParameter("@UPSOriginCountry", model.UPSOriginCountry ?? (object)DBNull.Value),
                    new SqlParameter("@UPSAPILicenceKey", model.UPSAPILicenceKey ?? (object)DBNull.Value),
                    new SqlParameter("@UPSLicenceEmail", model.UPSLicenceEmail ?? (object)DBNull.Value),
                    new SqlParameter("@UPSEnable", model.UPSEnable),
                    new SqlParameter("@UPSMeasurementUnits", model.UPSMeasurementUnits ?? (object)DBNull.Value),
                    new SqlParameter("@UPSEnableDebugMode", model.UPSEnableDebugMode),
                    new SqlParameter("@USPSEnable", model.USPSEnable),
                    new SqlParameter("@USPSPostcode", model.USPSPostcode ?? (object)DBNull.Value),
                    new SqlParameter("@USPSUserID", model.USPSUserID ?? (object)DBNull.Value),
                    new SqlParameter("@USPSCommercialrates", model.USPSCommercialrates),
                    new SqlParameter("@USPSPacking", model.USPSPacking),
                    new SqlParameter("@USPSPriorityMailExpressTitle", model.USPSPriorityMailExpressTitle ?? (object)DBNull.Value),
                    new SqlParameter("@USPSPriorityMailExpress", model.USPSPriorityMailExpress),
                    new SqlParameter("@USPSPriorityMailExpressHoldforPickup", model.USPSPriorityMailExpressHoldforPickup),
                    new SqlParameter("@USPSPriorityMailExpressSundayHoliday", model.USPSPriorityMailExpressSundayHoliday),
                    new SqlParameter("@USPSPriorityMailTitle", model.USPSPriorityMailTitle ?? (object)DBNull.Value),
                    new SqlParameter("@USPSPriorityMail", model.USPSPriorityMail),
                    new SqlParameter("@USPSPriorityMailHoldForPickup", model.USPSPriorityMailHoldForPickup),
                    new SqlParameter("@USPSPriorityMailKeysandIDs", model.USPSPriorityMailKeysandIDs),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxA", model.USPSPriorityMailRegionalRateBoxA),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxAHoldForPickup", model.USPSPriorityMailRegionalRateBoxAHoldForPickup),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxB", model.USPSPriorityMailRegionalRateBoxB),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxBHoldForPickup", model.USPSPriorityMailRegionalRateBoxBHoldForPickup),
                    new SqlParameter("@FirstClassMailTitle", model.FirstClassMailTitle ?? (object)DBNull.Value),
                    new SqlParameter("@FirstClassMailPostcards", model.FirstClassMailPostcards),
                    new SqlParameter("@FirstClassMailLetter", model.FirstClassMailLetter),
                    new SqlParameter("@FirstClassMailLargeEnvelope", model.FirstClassMailLargeEnvelope),
                    new SqlParameter("@FirstClassMailParcel", model.FirstClassMailParcel),
                    new SqlParameter("@FirstClassMailLargePostcards", model.FirstClassMailLargePostcards),
                    new SqlParameter("@FirstClassMailKeysandIDs", model.FirstClassMailKeysandIDs),
                    new SqlParameter("@FirstClassMailPackageService", model.FirstClassMailPackageService),
                    new SqlParameter("@FirstClassMailPackageServiceHoldForPickup", model.FirstClassMailPackageServiceHoldForPickup),
                    new SqlParameter("@FirstClassMailMeteredLetter", model.FirstClassMailMeteredLetter),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditVendorShipping(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_VendorShippingMethod set VendorID=@VendorID,ShippingMethodID=@ShippingMethodID,FedexAccountNumber=@FedexAccountNumber,FedexMeterNumber=@FedexMeterNumber,FedexWebServicesKey=@FedexWebServicesKey,FedexWebServicesPassword=@FedexWebServicesPassword,FedexMethodType=@FedexMethodType,FedexMethodEnable=@FedexMethodEnable," +
                    "FedexCustomServices = @FedexCustomServices,FedexDebugMode = @FedexDebugMode,UPSUserID = @UPSUserID,UPSPassword = @UPSPassword,UPSAccessKey = @UPSAccessKey,UPSAccountNumber = @UPSAccountNumber,UPSOriginPostcode = @UPSOriginPostcode,UPSOriginCountry = @UPSOriginCountry,UPSAPILicenceKey = @UPSAPILicenceKey," +
                    "UPSLicenceEmail = @UPSLicenceEmail,UPSEnable = @UPSEnable,UPSMeasurementUnits = @UPSMeasurementUnits,UPSEnableDebugMode = @UPSEnableDebugMode,USPSEnable = @USPSEnable,USPSPostcode = @USPSPostcode,USPSUserID = @USPSUserID,USPSCommercialrates = @USPSCommercialrates,USPSPacking = @USPSPacking,USPSPriorityMailExpressTitle = @USPSPriorityMailExpressTitle," +
                    "USPSPriorityMailExpress = @USPSPriorityMailExpress,USPSPriorityMailExpressHoldforPickup = @USPSPriorityMailExpressHoldforPickup,USPSPriorityMailExpressSundayHoliday = @USPSPriorityMailExpressSundayHoliday,USPSPriorityMailTitle = @USPSPriorityMailTitle,USPSPriorityMail = @USPSPriorityMail,USPSPriorityMailHoldForPickup = @USPSPriorityMailHoldForPickup," +
                    "USPSPriorityMailKeysandIDs = @USPSPriorityMailKeysandIDs,USPSPriorityMailRegionalRateBoxA = @USPSPriorityMailRegionalRateBoxA,USPSPriorityMailRegionalRateBoxAHoldForPickup = @USPSPriorityMailRegionalRateBoxAHoldForPickup,USPSPriorityMailRegionalRateBoxB = @USPSPriorityMailRegionalRateBoxB," +
                    "USPSPriorityMailRegionalRateBoxBHoldForPickup = @USPSPriorityMailRegionalRateBoxBHoldForPickup,FirstClassMailTitle = @FirstClassMailTitle,FirstClassMailPostcards = @FirstClassMailPostcards,FirstClassMailLetter = @FirstClassMailLetter,FirstClassMailLargeEnvelope = @FirstClassMailLargeEnvelope," +
                    "FirstClassMailParcel = @FirstClassMailParcel,FirstClassMailLargePostcards = @FirstClassMailLargePostcards,FirstClassMailKeysandIDs = @FirstClassMailKeysandIDs,FirstClassMailPackageService = @FirstClassMailPackageService,FirstClassMailPackageServiceHoldForPickup = @FirstClassMailPackageServiceHoldForPickup,FirstClassMailMeteredLetter = @FirstClassMailMeteredLetter " +
                    "where VendorId = @VendorId; ";
                SqlParameter[] para =
                {
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@ShippingMethodID", model.ShippingMethodID),
                    new SqlParameter("@FedexAccountNumber", model.FedexAccountNumber ?? (object)DBNull.Value),
                    new SqlParameter("@FedexMeterNumber",model.FedexMeterNumber ?? (object)DBNull.Value),
                    new SqlParameter("@FedexWebServicesKey", model.FedexWebServicesKey ?? (object)DBNull.Value),
                    new SqlParameter("@FedexWebServicesPassword", model.FedexWebServicesPassword ?? (object)DBNull.Value),
                    new SqlParameter("@FedexMethodType", model.FedexMethodType ?? (object)DBNull.Value),
                    new SqlParameter("@FedexMethodEnable", model.FedexMethodEnable),
                    new SqlParameter("@FedexCustomServices", model.FedexCustomServices),
                    new SqlParameter("@FedexDebugMode", model.FedexDebugMode),
                    new SqlParameter("@UPSUserID", model.UPSUserID ?? (object)DBNull.Value),
                    new SqlParameter("@UPSPassword", model.UPSPassword ?? (object)DBNull.Value),
                    new SqlParameter("@UPSAccessKey", model.UPSAccessKey ?? (object)DBNull.Value),
                    new SqlParameter("@UPSAccountNumber", model.UPSAccountNumber ?? (object)DBNull.Value),
                    new SqlParameter("@UPSOriginPostcode", model.UPSOriginPostcode ?? (object)DBNull.Value),
                    new SqlParameter("@UPSOriginCountry", model.UPSOriginCountry ?? (object)DBNull.Value),
                    new SqlParameter("@UPSAPILicenceKey", model.UPSAPILicenceKey ?? (object)DBNull.Value),
                    new SqlParameter("@UPSLicenceEmail", model.UPSLicenceEmail ?? (object)DBNull.Value),
                    new SqlParameter("@UPSEnable", model.UPSEnable),
                    new SqlParameter("@UPSMeasurementUnits", model.UPSMeasurementUnits ?? (object)DBNull.Value),
                    new SqlParameter("@UPSEnableDebugMode", model.UPSEnableDebugMode),
                    new SqlParameter("@USPSEnable", model.USPSEnable),
                    new SqlParameter("@USPSPostcode", model.USPSPostcode ?? (object)DBNull.Value),
                    new SqlParameter("@USPSUserID", model.USPSUserID ?? (object)DBNull.Value),
                    new SqlParameter("@USPSCommercialrates", model.USPSCommercialrates),
                    new SqlParameter("@USPSPacking", model.USPSPacking),
                    new SqlParameter("@USPSPriorityMailExpressTitle", model.USPSPriorityMailExpressTitle ?? (object)DBNull.Value),
                    new SqlParameter("@USPSPriorityMailExpress", model.USPSPriorityMailExpress),
                    new SqlParameter("@USPSPriorityMailExpressHoldforPickup", model.USPSPriorityMailExpressHoldforPickup),
                    new SqlParameter("@USPSPriorityMailExpressSundayHoliday", model.USPSPriorityMailExpressSundayHoliday),
                    new SqlParameter("@USPSPriorityMailTitle", model.USPSPriorityMailTitle ?? (object)DBNull.Value),
                    new SqlParameter("@USPSPriorityMail", model.USPSPriorityMail),
                    new SqlParameter("@USPSPriorityMailHoldForPickup", model.USPSPriorityMailHoldForPickup),
                    new SqlParameter("@USPSPriorityMailKeysandIDs", model.USPSPriorityMailKeysandIDs),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxA", model.USPSPriorityMailRegionalRateBoxA),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxAHoldForPickup", model.USPSPriorityMailRegionalRateBoxAHoldForPickup),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxB", model.USPSPriorityMailRegionalRateBoxB),
                    new SqlParameter("@USPSPriorityMailRegionalRateBoxBHoldForPickup", model.USPSPriorityMailRegionalRateBoxBHoldForPickup),
                    new SqlParameter("@FirstClassMailTitle", model.FirstClassMailTitle ?? (object)DBNull.Value),
                    new SqlParameter("@FirstClassMailPostcards", model.FirstClassMailPostcards),
                    new SqlParameter("@FirstClassMailLetter", model.FirstClassMailLetter),
                    new SqlParameter("@FirstClassMailLargeEnvelope", model.FirstClassMailLargeEnvelope),
                    new SqlParameter("@FirstClassMailParcel", model.FirstClassMailParcel),
                    new SqlParameter("@FirstClassMailLargePostcards", model.FirstClassMailLargePostcards),
                    new SqlParameter("@FirstClassMailKeysandIDs", model.FirstClassMailKeysandIDs),
                    new SqlParameter("@FirstClassMailPackageService", model.FirstClassMailPackageService),
                    new SqlParameter("@FirstClassMailPackageServiceHoldForPickup", model.FirstClassMailPackageServiceHoldForPickup),
                    new SqlParameter("@FirstClassMailMeteredLetter", model.FirstClassMailMeteredLetter),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int UpdateVendorShipping(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "update wp_vendor set fk_shipping_method=@fk_shipping_method,ShippingRate=@ShippingRate,ShippingLocation=@ShippingLocation where rowid=@rowid";
                SqlParameter[] para =
                {
                     new SqlParameter("@rowid", model.rowid),
                    new SqlParameter("@fk_shipping_method", model.ShippingMethodID),
                    new SqlParameter("@ShippingRate", model.ShippingRate),
                    new SqlParameter("@ShippingLocation", model.ShippingLocation),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                SqlParameter[] para =
                {
                    new SqlParameter("@TaxMethod", model.TaxMethod),
                    new SqlParameter("@DefaultTax", model.DefaultTax),
                    new SqlParameter("@ShippingTax", model.ShippingTax),
                    new SqlParameter("@ShippingTaxIncludedinprice", model.ShippingTaxIncludedinprice),
                    new SqlParameter("@CalculatedTax", model.CalculatedTax),
                    new SqlParameter("@TaxIncludedinPrice", model.TaxIncludedinPrice),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                strsql = "Update wp_vendor set DiscountType1=@DiscountType1,DefaultDiscount=@DefaultDiscount,DiscountMinimumOrderAmount=@DiscountMinimumOrderAmount,AccountName = @AccountName,AccountEmail = @AccountEmail,DiscountType2 = @DiscountType2,Discount = @Discount where rowid=" + model.rowid + "";
                SqlParameter[] para =
                {
                    new SqlParameter("@DiscountType1", model.DiscountType1 ?? (object)DBNull.Value),
                    new SqlParameter("@DefaultDiscount", model.DefaultDiscount),
                    new SqlParameter("@DiscountMinimumOrderAmount", model.DiscountMinimumOrderAmount),
                    new SqlParameter("@AccountName", model.AccountName ?? (object)DBNull.Value),
                    new SqlParameter("@AccountEmail", model.AccountEmail ?? (object)DBNull.Value),
                    new SqlParameter("@DiscountType2",model.DiscountType2 ?? (object)DBNull.Value),
                    new SqlParameter("@Discount",model.Discount ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
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
                strsql = "insert into wp_VendorPaymentDetails(VendorID,Paymentmethod,BankAccountName,BankAccountNumber,BankName,BankRoutingNumber," +
                    "BankIBAN,BankSwift,ChequeTitle,ChequeDescription,ChequeInstructions,PaypalInvoiceAPIUsername,PaypalInvoiceAPIPassword,PaypalInvoiceAPISignature,PaypalTitle,PaypalDescription,PaypalEmail,PaypalProduction," +
                    "PaypalIPNEmailNotification,PaypalReceiverEmail,PaypalIdentitytoken,PaypalPaymentAction,PaypalAPIUserName,PaypalAPIPassword,PaypalAPISignature) " +
                    "Values(" + model.rowid + ", @Paymentmethod, @BankAccountName, @BankAccountNumber, @BankName, @BankRoutingNumber, @BankIBAN, @BankSwift, @ChequeTitle, @ChequeDescription, @ChequeInstructions," +
                    "@PaypalInvoiceAPIUsername, @PaypalInvoiceAPIPassword, @PaypalInvoiceAPISignature, @PaypalTitle, @PaypalDescription, @PaypalEmail, @PaypalProduction," +
                    "@PaypalIPNEmailNotification, @PaypalReceiverEmail, @PaypalIdentitytoken, @PaypalPaymentAction, @PaypalAPIUserName, @PaypalAPIPassword, @PaypalAPISignature); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@Paymentmethod", model.Paymentmethod ?? (object)DBNull.Value),
                    new SqlParameter("@BankAccountName", model.BankAccountName ?? (object)DBNull.Value),
                    new SqlParameter("@BankAccountNumber", model.BankAccountNumber ?? (object)DBNull.Value),
                    new SqlParameter("@BankName", model.BankName ?? (object)DBNull.Value),
                    new SqlParameter("@BankRoutingNumber", model.BankRoutingNumber ?? (object)DBNull.Value),
                    new SqlParameter("@BankIBAN",model.BankIBAN ?? (object)DBNull.Value),
                    new SqlParameter("@BankSwift",model.BankSwift ?? (object)DBNull.Value),
                    new SqlParameter("@ChequeTitle",model.ChequeTitle ?? (object)DBNull.Value),
                    new SqlParameter("@ChequeDescription",model.ChequeDescription ?? (object)DBNull.Value),
                    new SqlParameter("@ChequeInstructions",model.ChequeInstructions ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalInvoiceAPIUsername",model.PaypalInvoiceAPIUsername ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalInvoiceAPIPassword",model.PaypalInvoiceAPIPassword ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalInvoiceAPISignature",model.PaypalInvoiceAPISignature ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalTitle",model.PaypalTitle ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalDescription",model.PaypalDescription ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalEmail",model.PaypalEmail ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalProduction",model.PaypalProduction),
                    new SqlParameter("@PaypalIPNEmailNotification",model.PaypalIPNEmailNotification ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalReceiverEmail",model.PaypalReceiverEmail ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalIdentitytoken",model.PaypalIdentitytoken ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalPaymentAction",model.PaypalPaymentAction ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalAPIUserName",model.PaypalAPIUserName ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalAPIPassword",model.PaypalAPIPassword ?? (object)DBNull.Value),
                    new SqlParameter("@PaypalAPISignature",model.PaypalAPISignature ?? (object)DBNull.Value),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int AddContacts(ThirdPartyModel model)
        {
            try
            {
                string strsql = "vendorcontactupdate";
                /*strsql = "Insert into erp_VendorContacts(VendorID,Name,Title,Email,Office,Ext,Mobile,Notes,Fax,Address,City,State,ZipCode,Country) " +
                    "values(@VendorID, @Name, @Title, @Email, @Office, @Ext, @Mobile, @Notes, @Fax, @Address, @City, @State, @ZipCode,@Country); SELECT SCOPE_IDENTITY();";*/
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "I"),
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@Name", model.ContactName),
                    new SqlParameter("@Title", model.ContactTitle),
                    new SqlParameter("@Email", model.ContactEmail),
                    new SqlParameter("@Office", model.ContactOffice),
                    new SqlParameter("@Ext","0"),
                    new SqlParameter("@Mobile",model.ContactMobile),
                    new SqlParameter("@Notes",model.ContactNotes),
                    new SqlParameter("@Fax",model.ContactFax),
                    new SqlParameter("@Address",model.ContactAddress),
                    new SqlParameter("@City",model.ContactCity),
                    new SqlParameter("@State",model.ContactState),
                    new SqlParameter("@StateName",model.ContactStateName),
                    new SqlParameter("@ZipCode",model.ContactZipCode),
                    new SqlParameter("@Country",model.ContactCountry),
                }; 
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int LinkWarehouse(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "insert into wp_VendorWarehouse(VendorID,WarehouseID) Values (@VendorID,@WarehouseID); SELECT SCOPE_IDENTITY();";
                SqlParameter[] para =
                {
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@WarehouseID", model.WarehouseID),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int DeleteWarehouse(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "delete from wp_VendorWarehouse where ID=@WarehouseID and VendorID=@VendorID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@WarehouseID", model.VendorWarehouseID),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int DeleteVendorLinkedFiles(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                strsql = "delete from erp_VendorLinkedFiles where ID=@VendorLinkedFilesID and VendorID=@VendorID;";
                SqlParameter[] para =
                {
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@VendorLinkedFilesID", model.VendorLinkedFilesID),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditVendorContacts(ThirdPartyModel model)
        {
            try
            {
                //string strsql = "Update erp_VendorContacts set Name=@Name,Title=@Title,Email=@Email,Office=@Office,Ext=@Ext,Mobile=@Mobile,Notes=@Notes,Fax = @Fax,Address = @Address,City = @City,State = @State,StateName=@StateName,ZipCode = @ZipCode,Country = @Country where ID = @ID; ";
                string strsql = "vendorcontactupdate";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@ID", model.ContactID),
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@Name", model.ContactName),
                    new SqlParameter("@Title", model.ContactTitle),
                    new SqlParameter("@Email", model.ContactEmail),
                    new SqlParameter("@Office", model.ContactOffice),
                    new SqlParameter("@Ext","0"),
                    new SqlParameter("@Mobile",model.ContactMobile),
                    new SqlParameter("@Notes",model.ContactNotes),
                    new SqlParameter("@Fax",model.ContactFax),
                    new SqlParameter("@Address",model.ContactAddress),
                    new SqlParameter("@City",model.ContactCity),
                    new SqlParameter("@State",model.ContactState),
                    new SqlParameter("@StateName",model.ContactStateName),
                    new SqlParameter("@ZipCode",model.ContactZipCode),
                    new SqlParameter("@Country",model.ContactCountry),


                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int EditPaymentMethods(ThirdPartyModel model)
        {
            try
            {
                string strsql = "";
                /*strsql = "update wp_VendorPaymentDetails set Paymentmethod=@Paymentmethod,BankAccountName=@BankAccountName,BankAccountNumber=@BankAccountNumber,BankName=@BankName," +
                    "BankRoutingNumber = @BankRoutingNumber,BankIBAN = @BankIBAN,BankSwift = @BankSwift,ChequeTitle = @ChequeTitle,ChequeDescription = @ChequeDescription," +
                    "ChequeInstructions = @ChequeInstructions,PaypalInvoiceAPIUsername = @PaypalInvoiceAPIUsername,PaypalInvoiceAPIPassword = @PaypalInvoiceAPIPassword," +
                    "PaypalInvoiceAPISignature = @PaypalInvoiceAPISignature,PaypalTitle = @PaypalTitle,PaypalDescription = @PaypalDescription,PaypalEmail = @PaypalEmail," +
                    "PaypalProduction = @PaypalProduction,PaypalIPNEmailNotification = @PaypalIPNEmailNotification,PaypalReceiverEmail = @PaypalReceiverEmail," +
                    "PaypalIdentitytoken = @PaypalIdentitytoken,PaypalPaymentAction = @PaypalPaymentAction,PaypalAPIUserName = @PaypalAPIUserName," +
                    "PaypalAPIPassword = @PaypalAPIPassword,PaypalAPISignature = @PaypalAPISignature where VendorID = @VendorID; "; */
                strsql = "vendorpaymentdetails";
                SqlParameter[] para =
                {
                    new SqlParameter("@qflag", "U"),
                    new SqlParameter("@VendorID", model.rowid),
                    new SqlParameter("@Paymentmethod", model.Paymentmethod),
                    new SqlParameter("@BankAccountName", model.BankAccountName),
                    new SqlParameter("@BankAccountNumber", model.BankAccountNumber),
                    new SqlParameter("@BankName", model.BankName),
                    new SqlParameter("@BankRoutingNumber", model.BankRoutingNumber),
                    new SqlParameter("@BankIBAN",model.BankIBAN),
                    new SqlParameter("@BankSwift",model.BankSwift),
                    new SqlParameter("@ChequeTitle",model.ChequeTitle),
                    new SqlParameter("@ChequeDescription",model.ChequeDescription),
                    new SqlParameter("@ChequeInstructions",model.ChequeInstructions),
                    new SqlParameter("@PaypalInvoiceAPIUsername",model.PaypalInvoiceAPIUsername),
                    new SqlParameter("@PaypalInvoiceAPIPassword",model.PaypalInvoiceAPIPassword),
                    new SqlParameter("@PaypalInvoiceAPISignature",model.PaypalInvoiceAPISignature),
                    new SqlParameter("@PaypalTitle",model.PaypalTitle),
                    new SqlParameter("@PaypalDescription",model.PaypalDescription),
                    new SqlParameter("@PaypalEmail",model.PaypalEmail),
                    new SqlParameter("@PaypalProduction",model.PaypalProduction),
                    new SqlParameter("@PaypalIPNEmailNotification",model.PaypalIPNEmailNotification),
                    new SqlParameter("@PaypalReceiverEmail",model.PaypalReceiverEmail),
                    new SqlParameter("@PaypalIdentitytoken",model.PaypalIdentitytoken),
                    new SqlParameter("@PaypalPaymentAction",model.PaypalPaymentAction),
                    new SqlParameter("@PaypalAPIUserName",model.PaypalAPIUserName),
                    new SqlParameter("@PaypalAPIPassword",model.PaypalAPIPassword),
                    new SqlParameter("@PaypalAPISignature",model.PaypalAPISignature),
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
                    DT = SQLHelper.ExecuteDataTable("select distinct StateFullName from StateList where StateFullName like '" + strSearch + "%' order by StateFullName");
                }
                else
                {
                    DT = SQLHelper.ExecuteDataTable("select distinct StateFullName,State from ZIPCodes1 where StateFullName like '" + strSearch + "%' or State like '" + strSearch + "%' order by StateFullName");
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
        public static DataSet GetWarehouse()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select rowid ID, ref Warehouse from wp_warehouse where status=1 order by rowid ;";
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
                string strSQl = "Select ID, PaymentTerm from PaymentTerms order by ID";
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
                DS = SQLHelper.ExecuteDataSet("Select ID, Balance from BalanceDays order by ID");
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
                DS = SQLHelper.ExecuteDataSet("Select ID,PaymentType from wp_PaymentType order by ID;");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet GetRelatedProducts()
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
                //SELECT CONCAT('SU', RIGHT('0' + RTRIM(YEAR(GETDATE())), 2), RIGHT('0' + RTRIM(MONTH(GETDATE())), 2),'-','0000',MAX(rowid + 1)) FROM wp_vendor;
                //DT = SQLHelper.ExecuteDataTable("SELECT CONCAT('SU', DATE_FORMAT(CURDATE(),'%y%m'),'-',if(max(LPAD(rowid+1 ,5,0)) is null,'00001',max(LPAD(rowid+1 ,5,0))))  as Code from wp_vendor;");
                DT = SQLHelper.ExecuteDataTable("SELECT CONCAT('SU', RIGHT('0' + RTRIM(YEAR(GETDATE())), 2), RIGHT('0' + RTRIM(MONTH(GETDATE())), 2),'-', MAX(RIGHT(REPLICATE(0, 5) + LEFT(rowid+1, 5),5))) as Code FROM wp_vendor");
            }
            catch (Exception ex)
            { throw ex; }
            return DT;
        }
        public static DataTable GetVendor(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "ID", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select v.rowid as ID, t.vendor_type, v.name as VendorName, v.name_alias as AliasName,v.entity,v.status,v.code_vendor as VendorCode, v.zip,v.address,v.address1,v.town,v.fk_state as State,v.fk_country as Country, v.phone,v.fax,v.url,v.email,v.fk_workforce as Workforce,v.fk_typparty as ThirdPartyType,v.fk_business_entity as BusinessEntityType, v.capital, v.fournisseur as Vendor," +
                    "v.location_incoterms as Incoterms, v.salestaxused as Salestaxused,v.SalesRepresentative,v.PaymentTermsID,v.BalanceID,v.PaymentDate,v.Currency ,v.EnableVendorUOM ,v.UnitsofMeasurment,v.MinimumOrderQuanity,v.DefaultTax,v.TaxIncludedinPrice,v.DefaultDiscount,v.CreditLimit,v.VendorStatus FROM wp_vendor v left join wp_vendortype t on v.vendor_type = t.rowid where 1 = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (v.name like '%" + searchid + "%' OR t.vendor_type='%" + searchid + "%' OR v.address='%" + searchid + "%' OR v.phone like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(v.rowid)/" + pagesize.ToString() + ") TotalPage,Count(v.rowid) TotalRecord from wp_vendor v left join wp_vendortype t on v.vendor_type = t.rowid  WHERE 1 = 1 " + strWhr.ToString();

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
            SqlParameter[] para = { new SqlParameter("@id", id) };
            try
            {
                string strWhr = string.Empty;
                string strSql = "vendorbyid";
                /*string strSql = "Select v.rowid as ID,v.vendor_type,v.code_vendor as VendorCode, v.name as VendorName,v.fournisseur as Vendor, v.name_alias as AliasName,v.entity,v.address,v.address1,v.town," +
                    "v.status,v.fk_state as State,v.StateName,v.zip, v.fk_country as Country, v.phone,v.fax,v.email,v.url,v.Workinghours,v.VendorStatus,v.NatureofJournal," +
                    "v.CorAddress1,v.CorAddress2,v.CorCity,v.CorState,v.CorZipCode,v.CorCountry,v.CorPhone,v.fk_workforce as Workforce,v.fk_business_entity as BusinessEntityType," +
                    "v.note_public,v.note_private,v.capital,v.PaymentTermsID,v.BalanceID,v.fk_incoterms as IncotermsType,v.location_incoterms as Incoterms, v.Currency ,v.CreditLimit," +
                    "v.outstanding_limit,v.MinimumOrderQuanity,v.order_min_amount,v.fk_shipping_method,v.ShippingRate,v.ShippingLocation," +
                    "s.ShippingMethodID,s.FedexAccountNumber,s.FedexMeterNumber,s.FedexWebServicesKey,s.FedexWebServicesPassword,s.FedexMethodType,s.FedexMethodEnable," +
                    "s.FedexCustomServices,s.FedexDebugMode,s.UPSUserID,s.UPSPassword,s.UPSAccessKey,s.UPSAccountNumber,s.UPSOriginPostcode,s.UPSOriginCountry,s.UPSAPILicenceKey," +
                    "s.UPSLicenceEmail,s.UPSEnable,s.UPSMeasurementUnits,s.UPSEnableDebugMode,s.USPSEnable,s.USPSPostcode,s.USPSUserID,s.USPSCommercialrates,s.USPSPacking,s.USPSPriorityMailExpressTitle," +
                    "s.USPSPriorityMailExpress,s.USPSPriorityMailExpressHoldforPickup,s.USPSPriorityMailExpressSundayHoliday,s.USPSPriorityMailTitle,s.USPSPriorityMail,s.USPSPriorityMailHoldForPickup," +
                    "s.USPSPriorityMailKeysandIDs,s.USPSPriorityMailRegionalRateBoxA,s.USPSPriorityMailRegionalRateBoxAHoldForPickup,s.USPSPriorityMailRegionalRateBoxB," +
                    "s.USPSPriorityMailRegionalRateBoxBHoldForPickup,s.FirstClassMailTitle,s.FirstClassMailPostcards,s.FirstClassMailLetter,s.FirstClassMailLargeEnvelope," +
                    "s.FirstClassMailParcel,s.FirstClassMailLargePostcards,s.FirstClassMailKeysandIDs,s.FirstClassMailPackageService,s.FirstClassMailPackageServiceHoldForPickup,s.FirstClassMailMeteredLetter,v.TaxMethod,v.DefaultTax,v.ShippingTax,v.ShippingTaxIncludedinprice,v.CalculatedTax,v.TaxIncludedinPrice," +
                    "v.DiscountType1,v.DefaultDiscount,v.DiscountMinimumOrderAmount,v.AccountName,v.AccountEmail,v.DiscountType2,v.Discount,p.Paymentmethod,p.BankAccountName,p.BankAccountNumber,p.BankName,p.BankRoutingNumber,p.BankIBAN,p.BankSwift,p.ChequeTitle,p.ChequeDescription,p.ChequeInstructions," +
                    "p.PaypalInvoiceAPIUsername,p.PaypalInvoiceAPIPassword,p.PaypalInvoiceAPISignature,p.PaypalTitle,p.PaypalDescription,p.PaypalEmail,p.PaypalProduction," +
                    "p.PaypalIPNEmailNotification,p.PaypalReceiverEmail,p.PaypalIdentitytoken,p.PaypalPaymentAction,p.PaypalAPIUserName,p.PaypalAPIPassword,p.PaypalAPISignature " +
                    "FROM wp_vendor v left join wp_VendorPaymentDetails p on v.rowid = p.VendorID left join erp_VendorShippingMethod s on s.VendorID = v.rowid where v.rowid = '" + id + "'";*/
                DataSet ds = SQLHelper.ExecuteDataSet(strSql,para);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public int GetPaymentVendorID(long id)
        {
            try
            {
                string strSql = "Select VendorId from wp_VendorPaymentDetails where VendorID='" + id + "'";
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strSql));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int GetShippingVendorID(long id)
        {
            try
            {
                string strSql = "Select VendorId from erp_VendorShippingMethod where VendorID='" + id + "'";
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strSql));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static DataTable GetVendorContact(string id,string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select c.ID,v.VendorStatus, v.name VendorName,c.Name,c.Title,c.Email,c.Office,c.Ext,c.Mobile,c.Notes,c.Fax,c.City,c.State,c.StateName,c.ZipCode,c.Country,concat( c.Address,' ',c.City,' ',c.State,' ',c.Country,' ',c.ZipCode) Address from erp_VendorContacts c left join wp_vendor v on c.VendorID = v.rowid where c.VendorID='" + id+"' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (c.Name like '%" + searchid + "%' OR c.Title like '%" + searchid + "%' OR c.Email like '%" + searchid + "%' OR c.Address like '%" + searchid + "%' OR c.Office like '%" + searchid + "%' OR c.Mobile like '%" + searchid + "%' OR c.City like '%" + searchid + "%' OR c.State like '%" + searchid + "%' OR c.Country like '%" + searchid + "%' OR c.ZipCode like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(c.id)/" + pagesize.ToString() + ") TotalPage,Count(c.ID) TotalRecord from erp_VendorContacts c left join wp_vendor v on c.VendorID = v.rowid  WHERE c.VendorID='" + id + "' and 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetVendorWarehouseList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select vw.ID, v.name VendorName,CONCAT(ISNULL(w.address,''),' ',ISNULL(w.city,'') ,' ',ISNULL(w.town,''),' ',ISNULL(w.country,''),' ',ISNULL(w.zip,'')) address, ref Warehouse from wp_VendorWarehouse vw left join wp_vendor v on vw.VendorID = v.rowid left join wp_warehouse w on vw.WarehouseID = w.rowid where vw.VendorID='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (ref like '%" + searchid + "%' OR w.address like '%" + searchid + "%' OR w.town like '%" + searchid + "%' OR w.country like '%" + searchid + "%' OR w.zip like '%" + searchid + "%' OR w.city like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(vw.ID)/" + pagesize.ToString() + ") TotalPage,Count(vw.ID) TotalRecord from wp_VendorWarehouse vw left join wp_vendor v on vw.VendorID = v.rowid left join wp_warehouse w on vw.WarehouseID = w.rowid  WHERE vw.VendorID='" + id + "' and 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetVendorLinkedFiles(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "select ID,VendorID,FileName,concat(FileSize,' KB') FileSize,FileType,FilePath, CONVERT(varchar(12),CreatedDate,101) Date from erp_VendorLinkedFiles where VendorID='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (FileName like '%" + searchid + "%' OR FileSize like '%" + searchid + "%' OR CreatedDate like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(ID)/" + pagesize.ToString() + ") TotalPage,Count(ID) TotalRecord from erp_VendorLinkedFiles  WHERE VendorID='" + id + "' and 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetVendorRelatedProduct(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select p.rowid,p.fk_vendor,post.post_title ProductName,v.name VendorName,Concat('$',cast(p.purchase_price as decimal(18,2))) purchase_price," +
                    "Concat('$',cast(((p.purchase_price + p.shipping_price + p.taxrate) - p.discount) as decimal(18,2))) cost_price,Concat('$',cast(p.shipping_price as decimal(18,2))) shipping_price," +
                    "p.discount,p.taxrate,p.date_inc,p.date_modified,p.effective_date,p.minpurchasequantity,p.salestax,p.taxrate,p.discount,p.remark from Product_Purchase_Items p " +
                    "left join wp_vendor v on p.fk_vendor = v.rowid left join wp_posts post on p.fk_product = post.id where p.fk_vendor='" + id + "' and 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (post.post_title like '%" + searchid + "%' OR p.purchase_price='%" + searchid + "%' OR p.shipping_price='%" + searchid + "%' OR cost_price like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from Product_Purchase_Items p left join wp_vendor v on p.fk_vendor = v.rowid left join wp_posts post on p.fk_product = post.id  WHERE p.fk_vendor='" + id + "' and 1 = 1 " + strWhr.ToString();

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
        public static DataTable VendorContactByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select c.ID,v.VendorStatus,v.name VendorName,c.Name,c.Title,c.Email,c.Office,c.Ext,c.Mobile,c.Notes,c.Fax,c.Address,c.City,c.State,c.Country,c.ZipCode,c.StateName from erp_VendorContacts c left join wp_vendor v on c.VendorID = v.rowid where c.ID='" + id + "';";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetfileCountdata(int VendorID, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select FileName from erp_VendorLinkedFiles"
                                + " WHERE VendorID in (" + VendorID + ") and FileName = '" + FileName + "' ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static int FileUpload(int VendorID, string FileName, string FilePath, string FileType, string size)
        {
            try
            {
                string strsql = "";
                strsql = "insert into erp_VendorLinkedFiles(VendorID, FileName, FileSize, FileType, FilePath) values(@VendorID, @FileName, @FileSize, @FileType, @FilePath); SELECT SCOPE_IDENTITY();";
                //strSql.Append(string.Format("insert into erp_VendorLinkedFiles(VendorID,FileName,FileSize,FileType,FilePath) values(@VendorID,@FileName,@FileSize,@FileType,@FilePath);SELECT LAST_INSERT_ID();"));
                 SqlParameter[] para =
                {
                    new SqlParameter("@VendorID", VendorID),
                    new SqlParameter("@FileName", FileName),
                    new SqlParameter("@FileSize", size),
                    new SqlParameter("@FileType", FileType),
                    new SqlParameter("@FilePath", FilePath),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

             
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public static DataTable GetPurchaseOrder(string userstatus,string VendorID, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                /*string strSql = "Select p.rowid id, p.ref, p.ref_ext refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " (p.date_creation) date_creation,(p.date_livraison) date_livraison,s.id StatusID, s.Status,total_ttc from commerce_purchase_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where v.rowid=" + VendorID + " and 1 = 1";*/
                string strSql = "Select p.rowid id, p.ref refordervendor, p.ref_ext, v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " (p.date_creation) date_creation, CONVERT(VARCHAR(12),p.date_livraison,101) date_livraison,s.id StatusID, s.Status,total_ttc from commerce_purchase_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where v.rowid=" + VendorID + " and 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (p.rowid like '%" + searchid + "%' OR p.date_livraison='%" + searchid + "%')";
                }
                if (userstatus != null)
                {  if(userstatus == "3")
                        strWhr += " and (s.id in (3,5,6)) ";
                   else
                        strWhr += " and (s.id='" + userstatus + "') ";

                }
                //strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY ");
                strSql += "; SELECT (Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord  from commerce_purchase_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where v.rowid=" + VendorID + " and 1 = 1 " + strWhr.ToString();

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


        public static DataTable AmountsView(string vendorcode)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT (coalesce(sum(ep.amount),0)) as PaidAmount, (coalesce(sum(epi.amount), 0)) as PurchaseOrder, (coalesce(sum(epi.amount) - sum(ep.amount), 0)) as OutstandingAmount from erp_payment ep"
                               + " inner join erp_payment_invoice epi on epi.fk_payment = ep.rowid where epi.thirdparty_code = '" + vendorcode + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable SelectVendorCode(long vendorcode)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSql = "SELECT code_vendor from wp_vendor where rowid='" + vendorcode + "'";
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