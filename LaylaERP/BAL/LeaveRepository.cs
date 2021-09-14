﻿using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;

namespace LaylaERP.BAL
{
    public class LeaveRepository
    {
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

                string strSql = "SELECT ehl.rowid ,CONCAT(ehe.firstname,' ',ehe.lastname) as name, ehl.leave_type as leavetype,DATE_FORMAT(ehl.from_date, '%m-%d-%Y') as date_from ,DATE_FORMAT(ehl.to_date,'%m-%d-%Y') as date_to, FORMAT(ehl.days,2) days, (case WHEN ehl.is_approved=0 then 'Pending' when ehl.is_approved=1 then 'Approved' when ehl.is_approved=2 then 'Rejected' end) as status from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE 1 = 1 ";
                if (!string.IsNullOrEmpty(searchid))
                {
                    strWhr += " and (ehl.leave_type like '%" + searchid + "%' OR ehl.days like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    //strWhr += " and (is_active='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(ehl.rowid)/" + pagesize.ToString() + ") TotalPage,Count(ehl.rowid) TotalRecord from erp_hrms_leave ehl Left join erp_hrms_emp ehe on ehe.rowid = ehl.fk_emp WHERE 1 = 1 " + strWhr.ToString();

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
                string strquery = "SELECT rowid, fk_emp,leave_code,description,leave_type,is_paid,DATE_FORMAT(from_date,'%m-%d-%Y') as from_date,DATE_FORMAT(to_date,'%m-%d-%Y') as to_date,note_public,note_private,is_approved, FORMAT(days,2) as days, is_approved as status FROM erp_hrms_leave WHERE rowid='" + id + "'";

                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

    }
}