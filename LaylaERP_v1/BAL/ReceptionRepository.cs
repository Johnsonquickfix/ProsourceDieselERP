using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LaylaERP.BAL
{
    public class ReceptionRepository
    {
        public static DataTable GetPurchaseOrder_old(DateTime? fromdate, DateTime? todate, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;          

                string strSql = "Select p.rowid id, p.ref, p.ref_ext refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " CONVERT(VARCHAR(12), p.date_creation, 107)  date_creation,CONVERT(VARCHAR(12), p.date_livraison, 107)  date_livraison, s.Status,total_ttc,fk_projet from commerce_purchase_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.ref_ext <> '' and p.fk_status= 3 and 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.SalesRepresentative)='" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                 strWhr += " and fk_projet = 0 ";
                //}
                strSql += strWhr + string.Format(" order by " + SortCol + " " + SortDir + " OFFSET " + (pageno).ToString() + " ROWS FETCH NEXT " + pagesize + " ROWS ONLY; ");

                strSql += "; SELECT Count(p.rowid)/" + pagesize.ToString() + " TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_order p inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID WHERE p.ref_ext <> '' and p.fk_status= 3 and 1 = 1 " + strWhr.ToString();

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

        // public static DataTable GetPurchaseOrder(DateTime? fromdate, DateTime? todate, string userstatus, string salestatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        public static DataTable GetPurchaseOrder(int userid,DateTime? fromdate, DateTime? todate, string searchcriteria, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
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
                   // !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
                   // new SqlParameter("@isactive", userstatus),
                    new SqlParameter("@searchcriteria", searchcriteria),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@userid", userid)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_purchase_receiveorder_search", parameters);
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


        public static DataTable GetPartiallyOrderList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.fk_purchase id, p.rowid RicD,(select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_receive_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_status= 5 and 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.SalesRepresentative)='" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }
                //if (userstatus != null)
                //{
                //    strWhr += " and (v.VendorStatus='" + userstatus + "') ";
                //}
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_receive_order p inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID WHERE p.fk_status= 5 and 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetPoClosureOrderList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "Select p.fk_purchase id,p.rowid RicD, (select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                                + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_receive_order p"
                                + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_status= 6 and 1 = 1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.SalesRepresentative)='" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(p.rowid)/" + pagesize.ToString() + ") TotalPage,Count(p.rowid) TotalRecord from commerce_purchase_receive_order p inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID WHERE p.fk_status= 6 and 1 = 1 " + strWhr.ToString();

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
        public static DataTable GetPoClosureOrderDetailsList_Old(string searchid, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.SalesRepresentative)='" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }

                //string strSql = "Select p.fk_purchase id,p.rowid RicD, (select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                //  + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_receive_order p"
                //  + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_status= 6 and 1 = 1";

                string strSql = "Select distinct MAX(p.rowid) rowid, p.fk_purchase id, MAX(cpo.ref) ref,MAX(cpo.fk_projet) fk_projet,MAX(v.name) vendor_name,MAX(v.address) address,MAX(v.town) town,MAX(v.fk_country) fk_country,MAX(v.fk_state) fk_state,MAX(v.zip) zip ,MAX(v.phone) phone,MAX(s.Status) Status,max(CONVERT(VARCHAR(12), p.date_livraison, 107)) date_livraison from commerce_purchase_receive_order p  "
                                 + " inner join commerce_purchase_order cpo on cpo.rowid = p.fk_purchase inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID "
                                 + " where p.fk_status= 6 and cpo.fk_projet = 0 and 1 = 1  GROUP by p.fk_purchase ";

                strSql += strWhr + string.Format(" order by rowid desc");
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetPoClosureOrderDetailsList(int userid, DateTime? fromdate, DateTime? todate, string searchid, string categoryid, string searchcriteria)
        {
            DataTable dt = new DataTable();
                try
                {
                    SqlParameter[] parameters =
                        {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "ARecev"),
                    new SqlParameter("@searchcriteria", searchcriteria),
                     new SqlParameter("@userid", userid)

                };
                    dt = SQLHelper.ExecuteDataTable("erp_purchase_receiveorder_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }
        public static DataTable GetPoClosureOrderDataList(string searchid, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@ref", searchid)
                };


                //string strSql = "Select p.fk_purchase id,p.rowid RicD, (select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                //                     + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,FORMAT(total_ttc,2) total_ttc from commerce_purchase_receive_order p"
                //                      + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_purchase = @ref and p.fk_status= 6 and 1 = 1";               

                //strSql += strWhr + string.Format(" order by DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') desc");

                string strSql = "Select max(p.fk_purchase) id,max(p.rowid) RicD,p.ref refordervendor,sum(recqty) Quenty, string_agg(concat(' ' ,description, ' (*',recqty,')'), ',') des,max(CONVERT(VARCHAR(12), p.date_creation, 107)) dtcration,max(CONVERT(VARCHAR(12), p.date_creation, 107)) date_creation,Cast(CONVERT(DECIMAL(10,2),max(p.total_ttc)) as nvarchar) total_ttc from commerce_purchase_receive_order p "
                                     + " inner join commerce_purchase_receive_order_detail pr on pr.fk_purchase_re = p.rowid "
                                      + " where p.fk_purchase = @ref and product_type = 0 and p.fk_status= 6 and 1 = 1 ";

                strSql += strWhr + string.Format("group by p.ref order by RicD desc");

                dt = SQLHelper.ExecuteDataTable(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }



        public static DataTable GetPartiallyDetailsList_Old(string searchid, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                if (!string.IsNullOrEmpty(searchid))
                {
                    searchid = searchid.ToLower();
                    strWhr += " and (lower(p.ref) like '" + searchid + "%' OR lower(p.ref_ext) like '" + searchid + "%' OR lower(v.name) like '" + searchid + "%' OR lower(v.fk_state) like '" + searchid + "%' OR lower(v.zip) like '" + searchid + "%')";
                }

                //string strSql = "Select p.fk_purchase id,p.rowid RicD, (select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                //  + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,total_ttc from commerce_purchase_receive_order p"
                //  + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_status= 6 and 1 = 1";


                //   string strSql = "Select distinct  p.fk_purchase id,(select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status from commerce_purchase_receive_order p "
                //+ "inner join wp_vendor v on p.fk_supplier = v.rowid "
                //+ "inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_status= 5 and 1 = 1";

                string strSql = "Select distinct MAX(p.rowid) rowid, p.fk_purchase id, MAX(cpo.ref) ref,MAX(cpo.fk_projet) fk_projet,MAX(v.name) vendor_name,MAX(v.address) address,MAX(v.town) town,MAX(v.fk_country) fk_country,MAX(v.fk_state) fk_state,MAX(v.zip) zip ,MAX(v.phone) phone,MAX(s.Status) Status,max(CONVERT(VARCHAR(12), p.date_livraison, 107)) date_livraison from commerce_purchase_receive_order p  "
                                + " inner join commerce_purchase_order cpo on cpo.rowid = p.fk_purchase inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID "
                                + " where p.fk_status= 5 and cpo.fk_projet = 0 and 1 = 1  GROUP by p.fk_purchase ";

                strSql += strWhr + string.Format(" order by rowid desc");
                dt = SQLHelper.ExecuteDataTable(strSql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetPartiallyDetailsList(int userid,DateTime? fromdate, DateTime? todate, string searchid, string categoryid, string searchcriteria)
        {           
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                    {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", "Recev"),
                    new SqlParameter("@searchcriteria", searchcriteria),
                    new SqlParameter("@userid", userid)

                };
                dt = SQLHelper.ExecuteDataTable("erp_purchase_receiveorder_search", parameters);                
            
            }

            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        //public static DataTable GetPartiallyDetailsList(DateTime? fromdate, DateTime? todate, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        //{
        //    DataTable dt = new DataTable();
        //    totalrows = 0;
        //    try
        //    {
        //        SqlParameter[] parameters =
        //        {
        //            fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
        //            todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
        //            new SqlParameter("@flag", "Recev"),
        //           // !CommanUtilities.Provider.GetCurrent().UserType.ToLower().Contains("administrator") ? new SqlParameter("@userid", CommanUtilities.Provider.GetCurrent().UserID) : new SqlParameter("@userid",DBNull.Value),
        //           // new SqlParameter("@isactive", userstatus),
        //            new SqlParameter("@searchcriteria", searchid),
        //            new SqlParameter("@pageno", pageno),
        //            new SqlParameter("@pagesize", pagesize),
        //            new SqlParameter("@sortcol", SortCol),
        //            new SqlParameter("@sortdir", SortDir),
        //             //new SqlParameter("@salestatus", salestatus)
        //        };
        //        DataSet ds = SQLHelper.ExecuteDataSet("erp_purchase_receiveorder_search", parameters);
        //        dt = ds.Tables[0];
        //        if (ds.Tables[1].Rows.Count > 0)
        //            totalrows = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalRecord"].ToString());
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return dt;
        //}



        public static DataTable GetPartiallyOrderDataList(string searchid, string categoryid, string productid)
        {
            DataTable dt = new DataTable();
            try
            {
                string strWhr = string.Empty;
                SqlParameter[] parameters =
                 {
                    new SqlParameter("@ref", searchid)
                };


                //string strSql = "Select p.fk_purchase id,p.rowid RicD, (select ref from commerce_purchase_order where rowid = p.fk_purchase) ref,(select fk_projet from commerce_purchase_order where rowid = p.fk_purchase) fk_projet, p.ref refordervendor,v.SalesRepresentative request_author,v.name vendor_name,v.address,v.town,v.fk_country,v.fk_state,v.zip,v.phone,"
                //                     + " DATE_FORMAT(p.date_creation,'%m/%d/%Y %h:%i %p') dt,DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') date_creation,DATE_FORMAT(p.date_livraison, '%m/%d/%Y') date_livraison, s.Status,FORMAT(total_ttc,2) total_ttc from commerce_purchase_receive_order p"
                //                      + " inner join wp_vendor v on p.fk_supplier = v.rowid inner join wp_StatusMaster s on p.fk_status = s.ID where p.fk_purchase = @ref and p.fk_status= 5 and 1 = 1";

                //strSql += strWhr + string.Format(" order by DATE_FORMAT(p.date_creation,'%m/%d/%Y %H:%i') desc");

                string strSql = "Select max(p.fk_purchase) id,max(p.rowid) RicD,p.ref refordervendor,sum(recqty) Quenty, string_agg(concat(' ' ,description, ' (*',recqty,')'), ',') des,max(CONVERT(VARCHAR(12), p.date_creation, 107)) dtcration,max(CONVERT(VARCHAR(12), p.date_creation, 107)) date_creation, Cast(CONVERT(DECIMAL(10,2),max(p.total_ttc)) as nvarchar) total_ttc from commerce_purchase_receive_order p "
                                     + " inner join commerce_purchase_receive_order_detail pr on pr.fk_purchase_re = p.rowid  "
                                      + " where p.fk_purchase = @ref and product_type = 0 and p.fk_status= 5 and 1 = 1 ";

                strSql += strWhr + string.Format(" group by  p.ref  order by RicD desc");



                dt = SQLHelper.ExecuteDataTable(strSql, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataSet GetPurchaseOrderByID(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@po_id", id), };              
                ds = SQLHelper.ExecuteDataSet("erp_receiveorderdatabyid", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod"; ds.Tables[2].TableName = "pods";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet GetPurchaseHistory(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@po_id", id), };
                //string strSql = "select fk_purchase from commerce_purchase_receive_order"
                //                + " where fk_purchase = @po_id;"
                //                + " select cprod.rowid,description,CONVERT(VARCHAR(12), date_creation, 107) date_creation,recqty,convert(numeric(18,2), cprod.total_ttc) amount,convert(numeric(18,2), cprod.discount) discount,isnull(convert(numeric(18,2), cprod.total_avgcost),0.00) total_avgcost,cpro.localtax1,cpro.localtax2  from commerce_purchase_receive_order_detail  cprod"
                //                + " left outer join commerce_purchase_receive_order cpro on cpro.rowid = cprod.fk_purchase_re"
                //                + " where product_type = 0 and cprod.fk_purchase = @po_id order by cprod.rowid desc;";
                string strSql = "erp_receivehistoryid";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }


        public static DataSet Getwarehouse(string Id)
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "select WarehouseID ID,ref as Name from wp_VendorWarehouse  wvw inner join wp_warehouse ww on  ww.rowid = wvw.WarehouseID where VendorID = " + Id + ";";
                DS = SQLHelper.ExecuteDataSet(strSQl);

            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public long ReceptionPurchase(PurchaseReceiceOrderModel model)
        {
            long result = 0;
            try
            {

                string str_oiid = string.Join(",", model.PurchaseOrderProducts.Select(x => x.rowid.ToString()).ToArray());
                string strsql = "";
                string strsqlins = "";
                string strstock = "";
                // string strupdate = "";
                StringBuilder strupdate = new StringBuilder();
                DateTime cDate = CommonDate.CurrentDate(), cUTFDate = CommonDate.UtcDate();
                string strPOYearMonth = cDate.ToString("yyMM").PadRight(4);
                SqlParameter[] para = { };
                //if (model.RowID > 0)
                //{
                //    strsql = string.Format("delete from commerce_purchase_receive_order_detail where fk_purchase = '{0}' and rowid not in ({1});", model.RowID, str_oiid);
                //    strsql += string.Format("update commerce_purchase_receive_order set ref_ext='',fk_status='1',ref_supplier='{0}',fk_supplier='{1}',fk_payment_term='{2}',fk_balance_days='{3}',fk_incoterms='{4}',location_incoterms='{5}',"
                //            + "fk_payment_type='{6}',date_livraison='{7}',note_private='{8}',note_public='{9}',discount='{10}',total_tva='{11}',localtax1='{12}',localtax2='{13}',total_ht='{14}',total_ttc='{15}' where rowid='{16}';",
                //            model.VendorBillNo, model.VendorID, model.PaymentTerms, model.Balancedays, model.IncotermType, model.Incoterms, model.PaymentType, model.Planneddateofdelivery, model.NotePrivate, model.NotePublic,
                //            model.discount, model.total_tva, model.localtax1, model.localtax2, model.total_ht, model.total_ttc, model.RowID);
                //}
                //else
                //{

                //strupdate = string.Format("update commerce_purchase_order set fk_status = '{0}' where rowid = '{1}';", model.fk_status, model.IDRec);
                strupdate.Append(string.Format("update commerce_purchase_order set fk_status = '{0}' where rowid = '{1}'; ", model.fk_status, model.IDRec));
                strupdate.Append(string.Format("update commerce_purchase_receive_order set fk_status = '{0}',fk_warehouse = '{1}' where fk_purchase = '{2}' ", model.fk_status, model.WarehouseID, model.IDRec));
                SQLHelper.ExecuteNonQueryWithTrans(strupdate.ToString());
                strsqlins = "insert into commerce_purchase_receive_order(ref,ref_ext,ref_supplier,fk_supplier,fk_status,source,fk_payment_term,fk_balance_days,fk_payment_type,date_livraison,fk_incoterms,location_incoterms,note_private,note_public,fk_user_author,date_creation,discount,total_tva,localtax1,localtax2,total_ht,total_ttc,fk_purchase,fk_warehouse,total_avgcost) "
                        + string.Format("select concat('PR" + strPOYearMonth + "-',RIGHT(CONCAT('00000', max(right(ref,5))+1), 5)) ref,'','{0}','{1}','{2}','0','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}','{20}','{21}' from commerce_purchase_receive_order;select SCOPE_IDENTITY();",
                                model.VendorBillNo, model.VendorID, model.fk_status, model.PaymentTerms, model.Balancedays, model.PaymentType, model.Planneddateofdelivery, model.IncotermType, model.Incoterms, model.NotePrivate, model.NotePublic, model.LoginID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), model.discount, model.total_tva, model.localtax1, model.localtax2, model.total_ht, model.total_ttc, model.IDRec, model.WarehouseID, model.total_avgcost);

                model.RowID = Convert.ToInt64(SQLHelper.ExecuteScalar(strsqlins, para));
                //}
                /// step 2 : commerce_purchase_receive_order_detail
                foreach (PurchaseReceiceOrderProductsModel obj in model.PurchaseOrderProducts)
                {
                    //if (obj.rowid > 0)
                    //{
                    //    strsql += string.Format("update commerce_purchase_receive_order_detail set ref='{0}',description='{1}',qty='{2}',discount_percent='{3}',discount='{4}',subprice='{5}',total_ht='{6}',total_ttc='{7}',date_start='{8}',date_end='{9}',rang='{10}',"
                    //        + " tva_tx='{11}',localtax1_tx='{12}',localtax1_type='{13}',localtax2_tx='{14}',localtax2_type='{15}',total_tva='{16}',total_localtax1='{17}',total_localtax2='{18}' where rowid='{19}';",
                    //        obj.product_sku, obj.description, obj.qty, obj.discount_percent, obj.discount, obj.subprice, obj.total_ht, obj.total_ttc, obj.date_start, obj.date_end, obj.rang,
                    //        obj.tva_tx, obj.localtax1_tx, obj.localtax1_type, obj.localtax2_tx, obj.localtax2_type, obj.total_tva, obj.total_localtax1, obj.total_localtax2, obj.rowid);
                    //}
                    //else
                    //{
                    if (obj.date_start == "0000/00/00")
                        obj.date_start = null;
                    if (obj.date_end == "0000/00/00")
                        obj.date_end = null;

                    strsql += "insert into commerce_purchase_receive_order_detail (fk_purchase_re,fk_purchase,fk_product,ref,description,qty,recqty,discount_percent,discount,subprice,total_ht,total_ttc,product_type,date_start,date_end,rang,tva_tx,localtax1_tx,localtax1_type,localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_avgcost) ";
                    strsql += string.Format(" select '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}','{19}','{20}','{21}','{22}','{23}','{24}';",
                        model.RowID, model.IDRec, obj.fk_product, obj.product_sku, obj.description, obj.qty, obj.Recqty, obj.discount_percent, obj.discount, obj.subprice, obj.total_ht, obj.total_ttc, obj.product_type, obj.date_start, obj.date_end, obj.rang,
                        obj.tva_tx, obj.localtax1_tx, obj.localtax1_type, obj.localtax2_tx, obj.localtax2_type, obj.total_tva, obj.total_localtax1, obj.total_localtax2,obj.total_avgcost);

                    //}
                }
                SQLHelper.ExecuteNonQueryWithTrans(strsql);
                //Add Stock
                // strsql += "delete from product_stock_register where tran_type = 'PO' and flag = 'O' and tran_id = " + model.RowID + ";"

                //if (model.WarehouseID == model.WarehousepoID)
                //{

                    foreach (PurchaseReceiceOrderProductsModel obj in model.PurchaseOrderProducts)
                    {
                        if (obj.fk_product > 0)
                        {

                            strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                            strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','R' ;",
                                  model.RowID, obj.fk_product, model.WarehouseID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                            //if (obj.qty >= obj.Remqty)
                            //{
                            //    strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                            //    strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','O' ;",
                            //     model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);
                            //}
                            //else
                            //{
                                //if (obj.ItemRemqty > 0)
                                //{
                                //    strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                                //    strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','O' ;",
                                //          model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.ItemRemqty);
                                //}
                            //}
                        }
                        //+" inner join commerce_purchase_receive_order po on po.rowid = pod.fk_purchase_re where fk_purchase_re = " + model.RowID + ";");
                    }
                //}
                //else
                //{
                //    foreach (PurchaseReceiceOrderProductsModel obj in model.PurchaseOrderProducts)
                //    {
                //        if (obj.fk_product > 0)
                //        {
                //            strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                //            strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','R' ;",
                //                  model.RowID, obj.fk_product, model.WarehouseID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                //            //strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                //            //strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','O' ;",
                //            //      model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                //            strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                //            strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','R' ;",
                //                  model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);

                //            strstock += "insert into product_stock_register (tran_type,tran_id,product_id,warehouse_id,tran_date,quantity,flag)";
                //            strstock += string.Format("select 'PR','{0}','{1}','{2}','{3}','{4}','I' ;",
                //                  model.RowID, obj.fk_product, model.WarehousepoID, cDate.ToString("yyyy-MM-dd HH:mm:ss"), obj.Recqty);
                //        }
                //        //+" inner join commerce_purchase_receive_order po on po.rowid = pod.fk_purchase_re where fk_purchase_re = " + model.RowID + ";");
                //    }
                //}
                // if (SQLHelper.ExecuteNonQueryWithTrans(strstock) > 0)
                // select 'PR',pod.fk_purchase_re,pod.fk_product," + model.WarehouseID + ",po.date_creation,pod.qty,'R' from commerce_purchase_receive_order_detail pod"
                if (!string.IsNullOrEmpty(strstock))
                    SQLHelper.ExecuteScalar(strstock, para);
                result = model.RowID;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Reception/ReceptionPurchase/" + model.IDRec + "", "Update Reception PO,s Receive Order");
                throw Ex;
            }
            return result;
        }


        public long UpdateStatusReceptionPurchase(PurchaseReceiceOrderModel model)
        {
            long result = 0;
            try
            {
                StringBuilder strupdate = new StringBuilder();
                strupdate.Append(string.Format("update commerce_purchase_order set fk_status = {0} where rowid = {1}; ", model.fk_status, model.IDRec));
                strupdate.Append(string.Format("update commerce_purchase_receive_order set fk_status = {0} where fk_purchase = {1} ", model.fk_status, model.IDRec));
                result = SQLHelper.ExecuteNonQueryWithTrans(strupdate.ToString());
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Reception/UpdateStatusReceptionPurchase/" + model.IDRec + "", "Update status reception purchase");
                throw Ex;
            }
            return result;
        }

        public static DataSet GetPurchaseOrder(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                //SqlParameter[] para = { new SqlParameter("@po_id", id), };
                //string strSql = "select po.rowid,po.ref,po.ref_ext,po.ref_supplier,po.fk_supplier,po.fk_status,po.fk_payment_term,coalesce(pt.PaymentTerm,'') PaymentTerm,po.fk_balance_days,bd.Balance,po.fk_payment_type,"
                //                + " DATE_FORMAT(po.date_livraison, '%m/%d/%Y') date_livraison,po.fk_incoterms,po.location_incoterms,po.note_private,po.note_public,DATE_FORMAT(po.date_creation, '%m/%d/%Y') date_creation,"
                //                + " v.name vendor_name,v.address,COALESCE(v.town,'') town,v.fk_country,v.fk_state,v.zip,COALESCE(v.phone,'') phone,COALESCE(v.email,'') vendor_email"
                //                + " from commerce_purchase_receive_order po inner join wp_vendor v on po.fk_supplier = v.rowid"
                //                + " left outer join PaymentTerms pt on pt.id = po.fk_payment_term"
                //                + " left outer join BalanceDays bd on bd.id = po.fk_balance_days where po.rowid = @po_id;"
                //                + " select rowid,fk_purchase,fk_product,ref product_sku,description,recqty qty,discount_percent,discount,subprice,total_ht,tva_tx,localtax1_tx,localtax1_type,"
                //                + " localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_ttc,product_type,date_start,date_end,rang"
                //                + " from commerce_purchase_receive_order_detail where fk_purchase_re = @po_id;";
                //ds = SQLHelper.ExecuteDataSet(strSql, para);
                //ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";

                SqlParameter[] para = { new SqlParameter("@po_id", id), };
                //string strSql = "select po.rowid,po.ref,po.ref_ext,po.ref_supplier,po.fk_supplier,po.fk_status,po.fk_payment_term,coalesce(pt.PaymentTerm,'') PaymentTerm,po.fk_balance_days,bd.Balance,po.fk_payment_type,"
                //                + " DATE_FORMAT(po.date_livraison, '%m/%d/%Y') date_livraison,po.fk_incoterms,po.location_incoterms,po.note_private,po.note_public,DATE_FORMAT(po.date_creation, '%m/%d/%Y') date_creation,"
                //                + " v.name vendor_name,v.address,COALESCE(v.town,'') town,v.fk_country,v.fk_state,v.zip,COALESCE(v.phone,'') phone,COALESCE(v.email,'') vendor_email"
                //                + " from commerce_purchase_receive_order po inner join wp_vendor v on po.fk_supplier = v.rowid"
                //                + " left outer join PaymentTerms pt on pt.id = po.fk_payment_term"
                //                + " left outer join BalanceDays bd on bd.id = po.fk_balance_days where po.rowid = @po_id;"
                //                + " select rowid,fk_purchase,fk_product,ref product_sku,description,recqty qty,discount_percent,discount,subprice,total_ht,tva_tx,localtax1_tx,localtax1_type,"
                //                + " localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_ttc,product_type,DATE_FORMAT(date_start, '%m/%d/%Y') date_start,DATE_FORMAT(date_end, '%m/%d/%Y') date_end,rang"
                //                + " from commerce_purchase_receive_order_detail where fk_purchase_re = @po_id order by product_type,rowid;";
                //strSql += "select date_format(datec,'%Y%m%d%k%i%s') sn,date_format(datec,'%m/%d/%Y') datec,ep.ref,epi.type,pt.paymenttype,epi.amount,num_payment from erp_payment_invoice epi"
                //                + " inner join erp_payment ep on ep.rowid = epi.fk_payment inner join wp_PaymentType pt on pt.id = ep.fk_payment"
                //                + " where epi.fk_invoice = @po_id and type = 'PO'"
                //                + " union all"
                //                + " select date_format(datec,'%Y%m%d%k%i%s') sn,date_format(datec, '%m/%d/%Y') datec,ep.ref, epi.type,pt.paymenttype,epi.amount,num_payment from commerce_purchase_receive_order_detail rod"
                //                + " inner join erp_payment_invoice epi on rod.fk_purchase_re = epi.fk_invoice"
                //                + " inner join erp_payment ep on ep.rowid = epi.fk_payment inner join wp_PaymentType pt on pt.id = ep.fk_payment"
                //                + " where rod.fk_purchase_re = @po_id and type = 'PR' group by epi.fk_payment,ep.ref;";

                //strSql += "select wh.ref,ifnull(address,'') address, ifnull(address1,'') address1,ifnull(City,'') City,ifnull(town,'') state, ifnull(zip,'') zip,"
                //            + " ifnull( Country,'') Country, ifnull( phone,'') phone, ifnull(email,'') email,"
                //            + " (select ref from commerce_purchase_order where rowid = psr.fk_purchase) pono from commerce_purchase_receive_order psr inner join wp_warehouse wh on wh.rowid = psr.fk_warehouse where psr.rowid = @po_id limit 1;";
                ds = SQLHelper.ExecuteDataSet("erp_receiveorderprint", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod"; ds.Tables[2].TableName = "popd"; ds.Tables[3].TableName = "podvadd";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public static DataSet GetPurchaseOrder_Rec(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@po_id", id), };
                string strSql = "select po.rowid,po.ref,po.ref_ext,po.ref_supplier,po.fk_supplier,po.fk_warehouse,po.fk_status,po.fk_payment_term,coalesce(pt.PaymentTerm,'') PaymentTerm,po.fk_balance_days,bd.Balance,po.fk_payment_type,"
                                       + " DATE_FORMAT(po.date_livraison, '%m/%d/%Y') date_livraison,po.fk_incoterms,po.location_incoterms,po.note_private,po.note_public,DATE_FORMAT(po.date_creation, '%m/%d/%Y') date_creation,"
                                       + " v.name vendor_name,v.address,COALESCE(v.town,'') town,v.fk_country,v.fk_state,v.zip,COALESCE(v.phone,'') phone,COALESCE(v.email,'') vendor_email"
                                       + " from commerce_purchase_order po inner join wp_vendor v on po.fk_supplier = v.rowid"
                                       + " left outer join PaymentTerms pt on pt.id = po.fk_payment_term"
                                       + " left outer join BalanceDays bd on bd.id = po.fk_balance_days where po.rowid = @po_id;"
                                       + " select rowid,fk_purchase,fk_product,ref product_sku,description,qty,discount_percent,discount,subprice,total_ht,tva_tx,localtax1_tx,localtax1_type,"
                                       + " localtax2_tx,localtax2_type,total_tva,total_localtax1,total_localtax2,total_ttc,product_type,date_start,date_end,rang"
                                       + " from commerce_purchase_order_detail where fk_purchase = @po_id;";
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }



        public static List<ProductModelservices> GetfileuploadData(string strValue1, string strValue2)
        {
            List<ProductModelservices> _list = new List<ProductModelservices>();
            try
            {
                string free_products = string.Empty;

                ProductModelservices productsModel = new ProductModelservices();
                string strWhr = string.Empty;

                if (string.IsNullOrEmpty(strValue1) && string.IsNullOrEmpty(strValue2))
                {

                }
                else
                {
                    if (!string.IsNullOrEmpty(strValue1))
                        strWhr += " fk_purchase = " + strValue1;
                    string strSQl = "SELECT pw.rowid as ID,fk_purchase,Length,FileType,CONVERT(VARCHAR(12), CreateDate, 107)  CreateDate,FileName"
                                + " from commerce_purchase_order_linkedfiles pw"
                                + " WHERE " + strWhr;

                    strSQl += ";";
                    SqlDataReader sdr = SQLHelper.ExecuteReader(strSQl);
                    while (sdr.Read())
                    {
                        productsModel = new ProductModelservices();
                        if (sdr["ID"] != DBNull.Value)
                            productsModel.ID = Convert.ToInt64(sdr["ID"]);
                        else
                            productsModel.ID = 0;
                        if (sdr["FileName"] != DBNull.Value)
                            productsModel.product_name = sdr["FileName"].ToString();
                        else
                            productsModel.product_name = string.Empty;

                        productsModel.product_label = sdr["Length"].ToString();
                        productsModel.sellingpric = sdr["CreateDate"].ToString();

                        _list.Add(productsModel);
                    }
                }
            }
            catch (Exception ex)
            { throw ex; }
            return _list;
        }



        public static DataTable GetfileCountdata(int fk_product, string FileName)
        {
            DataTable dt = new DataTable();
            try
            {
                string strSQl = "select FileName from commerce_purchase_order_linkedfiles"
                                + " WHERE fk_purchase in (" + fk_product + ") and FileName = '" + FileName + "' "
                                + " ";
                dt = SQLHelper.ExecuteDataTable(strSQl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int FileUploade(int fk_product, string FileName, string Length, string FileType, string FilePath)
        {
            int result = 0;
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format("Insert into commerce_purchase_order_linkedfiles(fk_purchase,FileName,Length,FileType,FilePath) values(" + fk_product + ",'" + FileName + "','" + Length + "','" + FileType + "','" + FilePath + "');select SCOPE_IDENTITY();"));
                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
                return result;
            }
            catch (Exception Ex)
            {
                UserActivityLog.ExpectionErrorLog(Ex, "Reception/FileUploade/" + fk_product + "", "Add Purchase order linkedfiles");
                throw Ex;
            }
        }

        public static int Deletefileuploade(ProductModel model)
        {
            int result = 0;
            try
            {
                //StringBuilder strSql = new StringBuilder();
                StringBuilder strSql = new StringBuilder(string.Format("delete from commerce_purchase_order_linkedfiles where rowid = {0}; ", model.ID));

                result = SQLHelper.ExecuteNonQuery(strSql.ToString());
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Reception/Deletefileuploade/" + model.ID + "", "Delete purchase order linkedfiles");
                throw ex; 
            }
            return result;
        }

        public static DataSet GetReceiveOrder(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@flag", "GETPO"), new SqlParameter("@id", id), };
                ds = SQLHelper.ExecuteDataSet("erp_purchasereceive_order_search", para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod"; ds.Tables[2].TableName = "popd";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        public static DataSet getinvoicehistory(long id)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] para = { new SqlParameter("@po_id", id), };
                string strSql = "select top 1 fk_purchase from commerce_purchase_receive_order"
                                + " where fk_purchase = @po_id;"
                                +   "Select max(p.fk_purchase) id,max(p.rowid) RicD,p.ref refordervendor,sum(recqty) Quenty, string_agg(concat(' ' ,description, ' (*',recqty,')'), ',') des,max(CONVERT(VARCHAR(12), p.date_creation, 107)) dtcration,max(CONVERT(VARCHAR(12), p.date_creation, 107)) date_creation, Cast(CONVERT(DECIMAL(10,2),max(p.total_ttc)) as nvarchar) total_ttc from commerce_purchase_receive_order p "
                                     + " inner join commerce_purchase_receive_order_detail pr on pr.fk_purchase_re = p.rowid  "
                                      + " where p.fk_purchase =  @po_id and product_type = 0 and p.fk_status in (5,6) and 1 = 1 group by  p.ref  order by RicD desc"; 
                ds = SQLHelper.ExecuteDataSet(strSql, para);
                ds.Tables[0].TableName = "po"; ds.Tables[1].TableName = "pod";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }

        

        public static DataTable Getinventorysheet(string flag)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
 
                    new SqlParameter("@flag", "SERCH"),
                };
                dt = SQLHelper.ExecuteDataTable("erp_poinventorysheet_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable Getrestposheet(string flag)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {

                    new SqlParameter("@flag", "SERCH"),
                };
                dt = SQLHelper.ExecuteDataTable("erp_restposheet_search", parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable InventoryValuationReport()
        {
            DataTable dt = new DataTable();
            try
            {
                dt = SQLHelper.ExecuteDataTable("erp_poinventory_valuation");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static DataTable GetProductReceiveList(string flag,string batchno, DateTime? fromdate, DateTime? todate, string searchcriteria, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                SqlParameter[] parameters =
                {
                    fromdate.HasValue ? new SqlParameter("@fromdate", fromdate.Value) : new SqlParameter("@fromdate", DBNull.Value),
                    todate.HasValue ? new SqlParameter("@todate", todate.Value) : new SqlParameter("@todate", DBNull.Value),
                    new SqlParameter("@flag", flag), 
                    new SqlParameter("@searchcriteria", searchid),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", SortCol),
                    new SqlParameter("@sortdir", SortDir),
                    new SqlParameter("@batchno", batchno),
                    new SqlParameter("@userid", 0)
                };
                DataSet ds = SQLHelper.ExecuteDataSet("erp_productserno_search", parameters);
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

        public static DataTable allotserial(string id)
        {
            var dt = new DataTable();
            try
            {
                 
                SqlParameter[] parameters =
                {
                    new SqlParameter("@pkey", id), 
                };
                dt = SQLHelper.ExecuteDataTable("erp_allotserial_iud", parameters);
            }
            catch (Exception ex)
            {
                UserActivityLog.ExpectionErrorLog(ex, "Reception/allotserial/" + id + "", "Allot serial");
                throw new Exception(ex.Message);
            }
            return dt;
        }

        public static DataSet Getserealpo()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select distinct appb.purchase_id id,ref text from commerce_purchase_product_batch appb inner join commerce_purchase_order cpo on cpo.rowid = appb.purchase_id ;"+
                                 "select distinct product_id id,post_title text from commerce_purchase_product_batch cppb inner join wp_posts wp on wp.id = cppb.product_id";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
        public static DataSet Getbatchnobypurchaseid(int purchase_id)
        {
            DataSet DS = new DataSet();
            try
            {
                //SqlParameter[] para = { new SqlParameter("@purchase_id", purchase_id)  };
                DS = SQLHelper.ExecuteDataSet("select  distinct batchno id,batchno text from commerce_purchase_product_batch where purchase_id = " + purchase_id + "");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }



    }

}