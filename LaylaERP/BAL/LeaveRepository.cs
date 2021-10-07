﻿using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;
using LaylaERP.UTILITIES;

namespace LaylaERP.BAL
{
    public class LeaveRepository
    {
        public static DataTable GetSelectEmployeeID()
        {
            DataTable dtr = new DataTable();
            try
            {
                long user = CommanUtilities.Provider.GetCurrent().UserID;
                string strquery = string.Empty;
                strquery = "SELECT rowid from erp_hrms_emp WHERE fk_user='"+user+"'";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetLeaveCalculation(string id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = string.Empty;
                strquery = "select ehlt.rowid, ehlt.leave_type, format(ehlt.leave_days,2) as leave_days, format(if(ehl.is_approved=1, (ehlt.leave_days-ehl.days), ehlt.leave_days),2) as remain from erp_hrms_leave_type ehlt left join erp_hrms_leave ehl on ehl.leave_code=ehlt.rowid and ehl.fk_emp='" + id+ "' order by ehlt.rowid";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }


        public static DataTable GetLeaveList()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ehl.rowid ,ehe.firstname as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to,FORMAT(ehl.days,2) as days, (case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=3 then 'Reject' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE 1 = 1 ";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int ChangeLeaveStatus(LeaveModel model, string ID)
        {
            try
            {
                string strsql = "update erp_hrms_leave set is_approved=@is_approved where rowid in(" + ID + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@is_approved", model.is_approved)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception
            Ex)

            {
                throw Ex;
            }
        }

        public static DataTable GetGrantLeaveList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ehl.rowid ,CONCAT(ehe.firstname,' ',ehe.lastname) as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to, FORMAT(ehl.days,2) days, (case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=2 then 'Rejected' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE is_approved = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (ehl.leave_type like '%" + searchid + "%' OR ehl.days like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ehl.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehl.rowid) TotalRecord from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE is_approved = 1 " + strWhr.ToString();

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

        public static DataTable SelectGrantLeave(long id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ehl.rowid,CONCAT(ehe.firstname, ' ', ehe.lastname) as name, fk_emp,leave_code,description,leave_type,is_paid,DATE_FORMAT(from_date, '%m-%d-%Y') as from_date,DATE_FORMAT(to_date, '%m-%d-%Y') as to_date,note_public,note_private,is_approved, FORMAT(days, 2) as days, is_approved as status, justification FROM erp_hrms_leave ehl inner join erp_hrms_emp ehe on ehe.rowid = fk_emp WHERE ehl.rowid='" + id + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdateGrantLeave(LeaveModel model)
        {

            try
            {
                string strsql = "UPDATE erp_hrms_leave set fk_emp = @fk_emp, leave_code = @leave_code, description=@description, leave_type=@leave_type, from_date=@from_date, to_date=@to_date," +
                    "note_public=@note_public, note_private=@note_private, days=@days, apply_date=@apply_date, justification=@justification, is_approved=@is_approved where rowid = '" + model.rowid + "';";
                MySqlParameter[] para =
               {
                    new MySqlParameter("@fk_emp", model.fk_emp),
                    new MySqlParameter("@leave_code",model.leave_code),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@leave_type", model.leave_type),
                    new MySqlParameter("@from_date", model.from_date),
                    new MySqlParameter("@to_date", model.to_date),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@note_private", model.note_private),
                    new MySqlParameter("@apply_date",Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new MySqlParameter("@days", model.days),
                    new MySqlParameter("@justification",model.justification),
                    new MySqlParameter("@is_approved", model.is_approved)
                };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


        public static DataTable GetPendingLeaveList(string fromdate,string todate, string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ehl.rowid ,CONCAT(ehe.firstname,' ',ehe.lastname) as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to, FORMAT(ehl.days,2) days, (case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=2 then 'Rejected' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE is_approved = 0 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (ehl.leave_type like '%" + searchid + "%' OR ehl.days like '%" + searchid + "%')";
                }
                if (!string.IsNullOrEmpty(fromdate) && !string.IsNullOrEmpty(todate))
                {
                    DateTime fromdatepending = DateTime.ParseExact(fromdate, "MM-dd-yyyy", null);
                    DateTime todatepending = DateTime.ParseExact(todate, "MM-dd-yyyy", null);

                    strWhr += " and (ehl.from_date >='" + fromdatepending.ToString("yyyy-MM-dd") + "' and ehl.from_date <= '"+todatepending.ToString("yyyy-MM-dd")+"') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ehl.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehl.rowid) TotalRecord from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE is_approved = 0 " + strWhr.ToString();

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

        public static DataTable GetRejectedLeaveList(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT ehl.rowid ,CONCAT(ehe.firstname,' ',ehe.lastname) as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to, FORMAT(ehl.days,2) days, (case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=2 then 'Rejected' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE is_approved = 2 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (ehl.leave_type like '%" + searchid + "%' OR ehl.days like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ehl.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehl.rowid) TotalRecord from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE is_approved = 2 " + strWhr.ToString();

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

        public static DataTable GetLeaveDetailsForAdmin()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = string.Empty;
                /*strquery = "select r.fk_emp, concat(ehe.firstname,' ',ehe.lastname) as name,"
                    + "SUM(case when p.rowid = 1 and r.is_approved = 1 then(p.leave_days - r.days) else 0 end) as CL,"
                    + "SUM(case when p.rowid = 2 and r.is_approved = 1 then(p.leave_days - r.days) else 0 end) as ML,"
                    + "SUM(case when p.rowid = 3 and r.is_approved = 1 then(p.leave_days - r.days) else 0 end) as SL,"
                    + "SUM(case when p.rowid = 4 and r.is_approved = 1 then(p.leave_days - r.days) else 0 end) as LWP,"
                    + "SUM(case when p.rowid = 5 and r.is_approved = 1 then(p.leave_days - r.days) else 0 end) as HF"
                    + " from erp_hrms_leave r left join erp_hrms_leave_type p on p.rowid = r.leave_code LEFT join erp_hrms_emp ehe on ehe.rowid = r.fk_emp GROUP by r.fk_emp";*/

                strquery = "select r.fk_emp, concat(ehe.firstname, ' ', ehe.lastname) as name, ehd.designation,"
                           + " format(min(if(r.leave_code = 5 and r.is_approved = 1, (p5.leave_days - r.days), p5.leave_days)),2) HF,"
                           + " format(min(if(r.leave_code = 4 and r.is_approved = 1, (p4.leave_days - r.days), p4.leave_days)),2) LWP,"
                           + " format(min(if(r.leave_code = 3 and r.is_approved = 1, (p3.leave_days - r.days), p3.leave_days)),2) SL,"
                           + " format(min(if(r.leave_code = 2 and r.is_approved = 1, (p2.leave_days - r.days), p2.leave_days)),2) ML,"
                           + " format(min(if(r.leave_code = 1 and r.is_approved = 1, (p1.leave_days - r.days), p1.leave_days)),2) CL"
                           + " from erp_hrms_leave r"
                           + " left join erp_hrms_leave_type p1 on p1.rowid = 1"
                           + " left join erp_hrms_leave_type p2 on p2.rowid = 2"
                           + " left join erp_hrms_leave_type p3 on p3.rowid = 3"
                           + " left join erp_hrms_leave_type p4 on p4.rowid = 4"
                           + " left join erp_hrms_leave_type p5 on p5.rowid = 5"
                           + " left join erp_hrms_emp ehe on ehe.rowid = r.fk_emp"
                           + " left join erp_hrms_empdetails ehed on ehed.fk_emp = ehe.rowid"
                           + " left join erp_hrms_designation ehd on ehd.rowid = ehed.designation"
                           + " GROUP by r.fk_emp";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

    }
}