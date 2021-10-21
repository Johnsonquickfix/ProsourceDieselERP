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
    public class AccountingRepository
    {
        public static DataSet GetNatureofJournal()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select ID,Nature from erp_NatureofJournal";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public int AddJournal(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Insert into erp_accounting_journal(code,label,nature,active) values(@code,@label,@nature,@active); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@code", model.code),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@nature", model.nature),
                    new MySqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int EditJournal(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_journal set code=@code,label=@label,nature=@nature,active=@active where rowid=@ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ID", model.rowid),
                    new MySqlParameter("@code", model.code),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@nature", model.nature),
               new MySqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public int UpdateJournalStatus(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_journal set active=@active where rowid=@ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ID", model.rowid),
                    new MySqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetJournalData(string ID, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select J.rowid ID,J.entity,J.code,J.label,N.Nature,J.active from erp_accounting_journal J left join erp_NatureofJournal N on J.nature = N.ID where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (J.code like '%" + searchid + "%' OR N.Nature like '%" + searchid + "%' OR J.label like '%" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                //}
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(J.rowid)/" + pagesize.ToString() + ") TotalPage,Count(J.rowid) TotalRecord from erp_accounting_journal J left join erp_NatureofJournal N on J.nature = N.ID WHERE 1 = 1 " + strWhr.ToString();

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

        public static DataTable GetJournalByID(long id)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                string strSql = "Select rowid,entity,code,label,nature,active from erp_accounting_journal where rowid = '" + id + "'";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int UpdateChartOfAccountStatus(AccountingJournalModel model)
        {
            try
            {
                string strsql = "";
                strsql = "Update erp_accounting_account set active=@active where rowid=@ID;";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ID", model.rowid),
                    new MySqlParameter("@active", model.active),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }



        public static DataTable GetChartOfAccounts(SearchModel model)
        {
            string strWhr = " where fk_pcg_version='" + model.strValue1 + "'";
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT rowid as ID, account_number, label, labelshort, account_parent, pcg_type,active from erp_accounting_account ";
                if (!string.IsNullOrEmpty(model.strValue1))
                {
                    strSql += strWhr;
                }

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }
        public static DataTable GetProductStock(string optType)
        {
            DataTable dt = new DataTable();
            try
            {

                string strSql = "select  p.id,eaa.label AccountingAccount,CAST(pa.fk_account_number AS INT) AccountingAccountNumber,p.post_type,p.post_title,max(case when p.id = s.post_id and s.meta_key = '_sku' then s.meta_value else '' end) sku, " +
                    "max(case when p.id = s.post_id and s.meta_key = '_regular_price' then s.meta_value else '' end) regular_price, " +
                    "max(case when p.id = s.post_id and s.meta_key = '_price' then s.meta_value else '' end) sale_price, " +
                    "(select coalesce(sum(case when pwr.flag = 'R' then quantity else -quantity end),0) from product_stock_register pwr " +
                    "where pwr.product_id = p.id) stock, (case when p.post_parent = 0 then p.id else p.post_parent end) p_id,p.post_parent,p.post_status " +
                    "FROM wp_posts as p left join wp_postmeta as s on p.id = s.post_id left join product_accounting as pa on p.id = pa.fk_product_id  and pa.option_mode = '" + optType + "'" +
                    "left join erp_accounting_account as eaa on pa.fk_account_number = eaa.account_number " +
                    "where p.post_type in ('product', 'product_variation') and p.post_status != 'draft'  group by p.id order by p_id;";

                dt = SQLHelper.ExecuteDataTable(strSql);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet GetNewAccounttoAssign(string optType)
        {
            DataSet DS = new DataSet();
            try
            {
                string account = "";
                string pcg = "";
                if (optType == "sales")
                {
                    account = "4";
                    pcg = "INCOME";
                }
                else
                {
                    account = "5";
                    pcg = "COGS";
                }
                string strSQl = "Select account_number ID, concat(account_number,' - ',label) label from erp_accounting_account where  account_number like '" + account + "%' and pcg_type='" + pcg + "' order by account_number;";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int AddAccount(AccountingModel model)
        {
            try
            {
                string strsql = "";
                strsql = "INSERT into erp_accounting_account(entity, date_modified, fk_pcg_version, pcg_type, account_number, account_parent, label, fk_accounting_category, active, reconcilable) "
                    + " values(@entity, @date_modified, @fk_pcg_version, @pcg_type, @account_number, @account_parent, @label, @fk_accounting_category, @active, @reconcilable); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@entity", "1"),
                    new MySqlParameter("@date_modified", DateTime.UtcNow.ToString()),
                    new MySqlParameter("@fk_pcg_version", model.fk_pcg_version),
                    new MySqlParameter("@pcg_type", model.pcg_type),
                    new MySqlParameter("@account_number",model.account_number),
                    new MySqlParameter("@account_parent",model.account_parent),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@fk_accounting_category","0"),
                    new MySqlParameter("@active","1"),
                     new MySqlParameter("@reconcilable","0"),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataSet GetPcgType()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("SELECT * from erp_pcg_type");

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static DataTable GetAccountByID(long id)
        {
            DataTable dt = new DataTable();

            try
            {

                string strSql = "SELECT rowid as rowid, account_number, fk_pcg_version, label, labelshort, account_parent, pcg_type,active from erp_accounting_account "
                + "where rowid=" + id + "";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];


            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public int AddProductAccount(string ProductID, string option_mode, string ProductAccountNumberID)
        {
            try
            {
                int result = 0;
                string[] ID = ProductID.Split(',');
                string[] value = ProductAccountNumberID.Split(',');

                for (int i = 0; i <= value.Length - 1; i++)
                {
                    ProductID = ID[i].ToString();
                    ProductAccountNumberID = value[i].ToString();
                    if (ProductAccountNumberID != "0")
                    {
                        string strsql = "";
                        string Product = GetAccountNumber(ProductID, option_mode).ToString();
                        if (Product == ProductID)
                        {
                            strsql = "Update product_accounting set fk_product_id=@fk_product_id,option_mode=@option_mode,fk_account_number=@fk_account_number where fk_product_id=@fk_product_id";
                        }
                        else
                        {
                            strsql = "insert into product_accounting(fk_product_id,option_mode,fk_account_number) values(@fk_product_id,@option_mode,@fk_account_number); SELECT LAST_INSERT_ID();";
                        }
                        MySqlParameter[] para =
                        {
                            new MySqlParameter("@fk_product_id",ProductID),
                            new MySqlParameter("@option_mode", option_mode),
                            new MySqlParameter("@fk_account_number", ProductAccountNumberID),
                        };
                        result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                    }
                }
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int UpdateAccount(AccountingModel model)
        {
            try
            {
                string strsql = "";
                strsql = "UPDATE erp_accounting_account set fk_pcg_version=@fk_pcg_version, pcg_type=@pcg_type, account_parent=@account_parent, label=@label where rowid='" + model.rowid + "'";

                MySqlParameter[] para =
                {
                    new MySqlParameter("@fk_pcg_version", model.fk_pcg_version),
                    new MySqlParameter("@pcg_type", model.pcg_type),
                    new MySqlParameter("@account_parent",model.account_parent),
                    new MySqlParameter("@label", model.label),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
        public int GetAccountNumber(string id, string option_mode)
        {
            try
            {
                string strSql = "Select fk_product_id from product_accounting where fk_product_id='" + id + "' and option_mode='" + option_mode + "'";
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strSql));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static int AddPcgTypeDetails(PcgtypeModel model)
        {
            try
            {
                string strsql = "";
                strsql = "INSERT into erp_pcg_type(pcg_type,account_parent) values(@pcg_type,@account_parent); SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@pcg_type", model.pcg_type),
                    new MySqlParameter("@account_parent", model.account_parent),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetPcgTypeList()
        {
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT id as ID, account_parent, pcg_type from erp_pcg_type ";
                
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetPcgTypeById(string strValue1)
        {
            DataTable dtr = new DataTable();
            try
            {

                string strSql = "SELECT id as ID, account_parent, pcg_type from erp_pcg_type where id='"+ strValue1 + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dtr = ds.Tables[0];

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdatePcgType(PcgtypeModel model)
        {
            try
            {
                string strsql = "";
                strsql = "UPDATE erp_pcg_type set account_parent=@account_parent, pcg_type=@pcg_type where id='" + model.rowid + "'";

                MySqlParameter[] para =
                {
                    new MySqlParameter("@account_parent", model.account_parent),
                    new MySqlParameter("@pcg_type", model.pcg_type),
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable AccountBalanceList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT rowid as id, concat(inv_complete,'-', label_complete) as account,format(COALESCE(sum(case when senstag = 'C' then credit end), 0),2) credit, format(COALESCE(sum(case when senstag = 'D' then debit end), 0),2) debit, format((COALESCE(sum(CASE WHEN senstag = 'C' then credit end), 0) + invtotal) - (invtotal - COALESCE(sum(CASE WHEN senstag = 'D' then credit end), 0)),2) as balance FROM erp_accounting_bookkeeping where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (inv_complete like '%" + searchid + "%' OR credit like '%" + searchid + "%' OR debit like '%" + searchid + "%') ";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" group by inv_complete order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(rowid)/" + pagesize.ToString() + ") TotalPage,Count(rowid) TotalRecord FROM erp_accounting_bookkeeping where 1=1 " + strWhr.ToString();

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

        public static DataTable AccountJournalList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT eab.rowid as id, inv_complete, code_journal, date_format(date_creation,'%m-%d-%Y') as datecreation, debit, credit, label_operation, v.name FROM erp_accounting_bookkeeping"
                                + " eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (inv_complete like '%" + searchid + "%' OR code_journal like '%" + searchid + "%' OR credit like '%" + searchid + "%' OR debit like '%" + searchid + "%' OR v.name like '%" + searchid + "%') ";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" group by inv_complete, eab.rowid order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(eab.rowid)/" + pagesize.ToString() + ") TotalPage,Count(eab.rowid) TotalRecord FROM erp_accounting_bookkeeping eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 " + strWhr.ToString();

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

        public static DataTable AccountLedgerList(string id, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT eab.rowid as id, inv_complete, code_journal, date_format(date_creation,'%m-%d-%Y') as datecreation, debit, credit, label_operation, v.name FROM erp_accounting_bookkeeping"
                                + " eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (inv_complete like '%" + searchid + "%' OR code_journal like '%" + searchid + "%' OR credit like '%" + searchid + "%' OR debit like '%" + searchid + "%' OR v.name like '%" + searchid + "%') ";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" group by inv_complete, eab.rowid order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(eab.rowid)/" + pagesize.ToString() + ") TotalPage,Count(eab.rowid) TotalRecord FROM erp_accounting_bookkeeping eab left join wp_vendor v on v.code_vendor = eab.thirdparty_code where 1=1 " + strWhr.ToString();

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
    }
}