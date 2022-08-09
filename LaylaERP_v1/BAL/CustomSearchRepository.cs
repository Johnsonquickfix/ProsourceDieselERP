using LaylaERP.DAL;
using LaylaERP.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class CustomSearchRepository
    {
        public static DataSet GetFilterMasters(string flag)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@flag", flag) };
                ds = SQLHelper.ExecuteDataSet("erp_order_custom_report", parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return ds;
        }
        public static DataTable GetOrderList(CustomSearchModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string sql = string.Empty, _select = string.Empty, _joins = string.Empty, _where = string.Empty;
                foreach (CustomDisplayFieldModel o in model.display_field)
                {
                    if (o.strType.ToLower() == "wp_posts")
                    {
                        _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("{0} as [{1}]", o.strValue, o.strKey);
                    }
                    else if (o.strType.ToLower() == "wp_postmeta")
                    {
                        _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("meta_{0}.meta_value as [{1}]", o.strValue, o.strKey);
                        _joins += string.Format(" INNER JOIN wp_postmeta AS meta_{0} ON ( posts.ID = meta_{0}.post_id AND meta_{0}.meta_key = '{0}' )", o.strValue);
                    }
                }

                foreach (CustomWhereFieldModel o in model.where_field)
                {
                    if (o.strType.ToLower() == "wp_posts")
                    {
                        switch (o.strOperator.ToLower())
                        {
                            case "in":
                                _where += string.Format(" AND wp_posts.{0} in ({1}) ", o.strKey, o.strValue);
                                break;
                            case "equal to":
                                _where += string.Format(" AND wp_posts.{0} = '{1}' ", o.strKey, o.strValue);
                                break;
                            case "start with":
                                _where += string.Format(" AND wp_posts.{0} like '{1}%' ", o.strKey, o.strValue);
                                break;
                            case "end with":
                                _where += string.Format(" AND wp_posts.{0} like '%{1}' ", o.strKey, o.strValue);
                                break;
                            case "any where":
                                _where += string.Format(" AND wp_posts.{0} like '%{1}%' ", o.strKey, o.strValue);
                                break;
                        }
                    }
                    else if (o.strType.ToLower() == "wp_postmeta")
                    {
                        switch (o.strOperator.ToLower())
                        {
                            case "equal to":
                                _where += string.Format(" AND meta_{0}.meta_value = '{1}' ", o.strKey, o.strValue);
                                break;
                            case "start with":
                                _where += string.Format(" AND meta_{0}.meta_value like '{1}%' ", o.strKey, o.strValue);
                                break;
                            case "end with":
                                _where += string.Format(" AND meta_{0}.meta_value like '%{1}' ", o.strKey, o.strValue);
                                break;
                            case "any where":
                                _where += string.Format(" AND meta_{0}.meta_value like '%{1}%' ", o.strKey, o.strValue);
                                break;
                        }
                        if (model.display_field.FindIndex(item => o.strKey.ToLower() == item.strValue.ToLower()) < 0)
                            _joins += string.Format(" INNER JOIN wp_postmeta AS meta_{0} ON ( posts.ID = meta_{0}.post_id AND meta_{0}.meta_key = '{0}' )", o.strKey);
                        //_select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("meta_{0}.meta_value as [{1}]", o.strValue, o.strKey);
                        //_joins += string.Format(" INNER JOIN wp_postmeta AS meta_{0} ON ( posts.ID = meta_{0}.post_id AND meta_{0}.meta_key = '{0}' )", o.strValue);
                    }
                }

                sql = "SELECT COUNT(*) OVER() total_count," + _select + " FROM wp_posts AS posts" + _joins;
                sql += " WHERE posts.post_type IN ( 'shop_order' ) AND posts.post_status != 'auto-draft'";
                if (!string.IsNullOrEmpty(model.order_status))
                {
                    sql += " AND posts.post_status in ( " + model.order_status + " )";
                }
                if (model.start_date.HasValue)
                {
                    sql += " AND posts.post_date >= '" + model.start_date.Value.ToString("yyyy-MM-dd HH:mm:ss") + "' ";
                }
                if (model.end_date.HasValue)
                {
                    sql += " AND posts.post_date < '" + model.end_date.Value.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss") + "' ";
                }

                sql += _where + " order by " + model.sSortColName + " " + model.sSortDir_0 + " OFFSET " + model.iDisplayStart + " ROWS FETCH NEXT " + model.iDisplayLength + " ROWS ONLY;";

                SqlParameter[] parameters = { };
                dt = SQLHelper.ExecuteDataTable(sql, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GetQuoteOrderList(CustomSearchModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string sql = string.Empty, _select = string.Empty, _joins = string.Empty, _where = string.Empty;
                foreach (CustomDisplayFieldModel o in model.display_field)
                {
                    if (o.strType.ToLower() == "erp_order_quote")
                    {
                        _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("{0} as [{1}]", o.strValue, o.strKey);
                    }
                    //else if (o.strType.ToLower() == "wp_postmeta")
                    //{
                    //    _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("meta_{0}.meta_value as [{1}]", o.strValue, o.strKey);
                    //    _joins += string.Format(" INNER JOIN wp_postmeta AS meta_{0} ON ( posts.ID = meta_{0}.post_id AND meta_{0}.meta_key = '{0}' )", o.strValue);
                    //}
                }

                foreach (CustomWhereFieldModel o in model.where_field)
                {
                    if (o.strType.ToLower() == "erp_order_quote")
                    {
                        switch (o.strOperator.ToLower())
                        {
                            case "in":
                                _where += string.Format(" AND quote.{0} in ({1}) ", o.strKey, o.strValue);
                                break;
                            case "equal to":
                                _where += string.Format(" AND quote.{0} = '{1}' ", o.strKey, o.strValue);
                                break;
                            case "start with":
                                _where += string.Format(" AND quote.{0} like '{1}%' ", o.strKey, o.strValue);
                                break;
                            case "end with":
                                _where += string.Format(" AND quote.{0} like '%{1}' ", o.strKey, o.strValue);
                                break;
                            case "any where":
                                _where += string.Format(" AND quote.{0} like '%{1}%' ", o.strKey, o.strValue);
                                break;
                        }
                    }
                    //else if (o.strType.ToLower() == "wp_postmeta")
                    //{
                    //    switch (o.strOperator.ToLower())
                    //    {
                    //        case "equal to":
                    //            _where += string.Format(" AND meta_{0}.meta_value = '{1}' ", o.strKey, o.strValue);
                    //            break;
                    //        case "start with":
                    //            _where += string.Format(" AND meta_{0}.meta_value like '{1}%' ", o.strKey, o.strValue);
                    //            break;
                    //        case "end with":
                    //            _where += string.Format(" AND meta_{0}.meta_value like '%{1}' ", o.strKey, o.strValue);
                    //            break;
                    //        case "any where":
                    //            _where += string.Format(" AND meta_{0}.meta_value like '%{1}%' ", o.strKey, o.strValue);
                    //            break;
                    //    }
                    //    if (model.display_field.FindIndex(item => o.strKey.ToLower() == item.strValue.ToLower()) < 0)
                    //        _joins += string.Format(" INNER JOIN wp_postmeta AS meta_{0} ON ( posts.ID = meta_{0}.post_id AND meta_{0}.meta_key = '{0}' )", o.strKey);
                    //}
                }

                sql = "SELECT COUNT(*) OVER() total_count," + _select + " FROM erp_order_quote AS quote" + _joins;
                sql += " WHERE 1 = 1";
                if (!string.IsNullOrEmpty(model.order_status))
                {
                    sql += " AND quote.quote_status in ( " + model.order_status + " )";
                }
                if (model.start_date.HasValue)
                {
                    sql += " AND quote.quote_date >= '" + model.start_date.Value.ToString("yyyy-MM-dd HH:mm:ss") + "' ";
                }
                if (model.end_date.HasValue)
                {
                    sql += " AND quote.quote_date < '" + model.end_date.Value.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss") + "' ";
                }

                sql += _where + " order by " + model.sSortColName + " " + model.sSortDir_0 + " OFFSET " + model.iDisplayStart + " ROWS FETCH NEXT " + model.iDisplayLength + " ROWS ONLY;";

                SqlParameter[] parameters = { };
                dt = SQLHelper.ExecuteDataTable(sql, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }

        public static DataTable GetJournalsList(CustomSearchModel model)
        {
            DataTable dt = new DataTable();
            try
            {
                string sql = string.Empty, _select = string.Empty, _joins = string.Empty, _where = string.Empty;
                foreach (CustomDisplayFieldModel o in model.display_field)
                {
                    if (o.strType.ToLower() == "erp_accounting_bookkeeping")
                    {
                        _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("{0} as [{1}]", o.strValue, o.strKey);
                    }
                    else if (o.strType.ToLower() == "erp_accounting_account")
                    {
                        _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("account.{0} as [{1}]", o.strValue, o.strKey);
                    }
                    else if (o.strType.ToLower() == "erp_account_process_label")
                    {
                        _select += (!string.IsNullOrEmpty(_select) ? ", " : "") + string.Format("tran_type.{0} as [{1}]", o.strValue, o.strKey);
                    }
                }
                string _tb = string.Empty;
                foreach (CustomWhereFieldModel o in model.where_field)
                {
                    switch (o.strOperator.ToLower())
                    {
                        case "erp_accounting_bookkeeping":
                            _tb = "bookkeeping";
                            break;
                        case "erp_accounting_account":
                            _tb = "account";
                            break;
                        case "tran_type":
                            _tb = "account";
                            break;
                    }
                    switch (o.strOperator.ToLower())
                    {
                        case "in":
                            _where += string.Format(" AND {0}.{1} in ({2}) ", _tb, o.strKey, o.strValue);
                            break;
                        case "equal to":
                            _where += string.Format(" AND {0}.{1} = '{2}' ", _tb, o.strKey, o.strValue);
                            break;
                        case "start with":
                            _where += string.Format(" AND {0}.{1} like '{2}%' ", _tb, o.strKey, o.strValue);
                            break;
                        case "end with":
                            _where += string.Format(" AND {0}.{1} like '%{2}' ", _tb, o.strKey, o.strValue);
                            break;
                        case "any where":
                            _where += string.Format(" AND {0}.{1} like '%{2}%' ", _tb, o.strKey, o.strValue);
                            break;
                    }
                }
                _joins = " inner join erp_accounting_account account on account.account_number = bookkeeping.subledger_account left outer join erp_account_process_label tran_type on tran_type.label_code = bookkeeping.doc_type";

                sql = "SELECT COUNT(*) OVER() total_count," + _select + " FROM erp_accounting_bookkeeping AS bookkeeping" + _joins;
                sql += " WHERE 1 = 1";
                if (!string.IsNullOrEmpty(model.order_status))
                {
                    sql += " AND bookkeeping.doc_type in ( " + model.order_status + " )";
                }
                if (model.start_date.HasValue)
                {
                    sql += " AND bookkeeping.doc_date >= '" + model.start_date.Value.ToString("yyyy-MM-dd HH:mm:ss") + "' ";
                }
                if (model.end_date.HasValue)
                {
                    sql += " AND bookkeeping.doc_date < '" + model.end_date.Value.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss") + "' ";
                }

                sql += _where + " order by " + model.sSortColName + " " + model.sSortDir_0 + " OFFSET " + model.iDisplayStart + " ROWS FETCH NEXT " + model.iDisplayLength + " ROWS ONLY;";

                SqlParameter[] parameters = { };
                dt = SQLHelper.ExecuteDataTable(sql, parameters);
            }
            catch (Exception ex)
            { throw ex; }
            return dt;
        }
    }
}