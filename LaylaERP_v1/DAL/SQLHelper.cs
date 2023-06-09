﻿namespace LaylaERP.DAL
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Data;
    using System.Data.SqlClient;

    [Serializable]
    public static class SQLHelper
    {
        #region Declaration
        private static string _conString = System.Configuration.ConfigurationManager.ConnectionStrings["constr"].ToString();
        #endregion

        #region ExecuteNonQuery
        public static int ExecuteNonQuery(string query)
        {
            int retval;
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            try
            {
                if (query.ToUpper().StartsWith("INSERT") | query.ToUpper().StartsWith("UPDATE") | query.ToUpper().StartsWith("DELETE"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                cnn.Open();
                retval = cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }
            return retval;
        }
        public static int ExecuteNonQuery(string query, params SqlParameter[] parameters)
        {
            int retval;
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            try
            {
                if (query.ToUpper().StartsWith("INSERT") | query.ToUpper().StartsWith("UPDATE") | query.ToUpper().StartsWith("DELETE"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                for (int i = 0; i <= parameters.Length - 1; i++)
                {
                    cmd.Parameters.Add(parameters[i]);
                }

                cnn.Open();
                retval = cmd.ExecuteNonQuery();

                cnn.Close();

                if (cmd.Parameters.Count > 0)
                {
                    cmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }

            return retval;
        }
        public static int ExecuteNonQueryWithTrans(string query)
        {
            int retval;
            SqlConnection cnn = new SqlConnection(_conString);
            cnn.Open();
            SqlTransaction trans = cnn.BeginTransaction();
            SqlCommand cmd = new SqlCommand(query, cnn, trans);
            try
            {
                if (query.ToUpper().StartsWith("INSERT") | query.ToUpper().StartsWith("UPDATE") | query.ToUpper().StartsWith("DELETE"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
               
                retval = cmd.ExecuteNonQuery();
                trans.Commit();
            }
            catch (Exception ex)
            {
                trans.Rollback();
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }
            return retval;
        }
        #endregion

        #region ExecuteScalers
        public static object ExecuteScalar(string query)
        {
            object retval;
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            try
            {
                if (query.ToUpper().Contains("DELETE") && query.ToUpper().Contains("UPDATE"))
                {
                    throw new DataException("You don't have permission to access.");
                }
                if (query.ToUpper().StartsWith("SELECT"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                cnn.Open();
                retval = cmd.ExecuteScalar();
                cnn.Close();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }
            return retval;
        }
        public static object ExecuteScalar(string query, params SqlParameter[] parameters)
        {
            object retval;
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            try
            {
                if (query.ToUpper().Contains("DELETE") && query.ToUpper().Contains("UPDATE"))
                {
                    throw new DataException("You don't have permission to access.");
                }
                if (query.ToUpper().StartsWith("SELECT") | query.ToUpper().StartsWith("INSERT"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                for (int i = 0; i <= parameters.Length - 1; i++)
                {
                    cmd.Parameters.Add(parameters[i]);
                }
                cnn.Open();
                retval = cmd.ExecuteScalar();
                cnn.Close();

                if (cmd.Parameters.Count > 0)
                {
                    cmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }
            return retval;
        }
        #endregion

        #region ExecuteReaders
        public static SqlDataReader ExecuteReader(string query)
        {
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            try
            {
                if (!query.ToUpper().Contains("DELETE") && !query.ToUpper().Contains("UPDATE"))
                {
                    if (query.ToUpper().StartsWith("SELECT"))
                    {
                        cmd.CommandType = CommandType.Text;
                        cnn.Open();
                    }
                    else
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cnn.Open();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return cmd.ExecuteReader(CommandBehavior.CloseConnection);
        }
        public static SqlDataReader ExecuteReader(string query, params SqlParameter[] parameters)
        {
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            try
            {
                if (!query.ToUpper().Contains("DELETE") && !query.ToUpper().Contains("UPDATE"))
                {
                    if (query.ToUpper().StartsWith("SELECT"))
                    {
                        cmd.CommandType = CommandType.Text;
                    }
                    else
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                    }
                    for (int i = 0; i <= parameters.Length - 1; i++)
                    {
                        cmd.Parameters.Add(parameters[i]);
                    }
                    cnn.Open();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return cmd.ExecuteReader(CommandBehavior.CloseConnection);
        }

        #endregion

        #region Dataset
        public static DataSet ExecuteDataSet(string query)
        {
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            DataSet ds;
            SqlDataAdapter da;
            try
            {
                if (query.ToUpper().Contains("DELETE") && query.ToUpper().Contains("UPDATE"))
                {
                    throw new DataException("You don't have permission to access.");
                }
                if (query.ToUpper().StartsWith("SELECT"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                da = new SqlDataAdapter();
                da.SelectCommand = cmd;
                ds = new DataSet();
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            { cnn.Dispose(); }
            return ds;
        }
        public static DataSet ExecuteDataSet(string query, params SqlParameter[] parameters)
        {
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            SqlDataAdapter da;
            DataSet ds;

            try
            {
                if (query.ToUpper().Contains("DELETE") && query.ToUpper().Contains("UPDATE"))
                {
                    throw new DataException("You don't have permission to access.");
                }
                if (query.ToUpper().StartsWith("SELECT")|| query.ToUpper().StartsWith("SP_") || query.ToUpper().StartsWith("GET_")) 
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                for (int i = 0; i <= parameters.Length - 1; i++)
                {
                    cmd.Parameters.Add(parameters[i]);
                }
                da = new SqlDataAdapter();
                da.SelectCommand = cmd;
                ds = new DataSet();
                da.Fill(ds);

                if (cmd.Parameters.Count > 0)
                {
                    cmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            { cnn.Dispose(); }
            return ds;
        }
        #endregion

        #region DataTable
        public static DataTable ExecuteDataTable(string query)
        {
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            SqlDataReader dr;
            DataTable dt;
            try
            {
                if (query.ToUpper().Contains("DELETE") && query.ToUpper().Contains("UPDATE"))
                {
                    throw new DataException("You don't have permission to access.");
                }
                if (query.ToUpper().StartsWith("SELECT") || query.ToUpper().StartsWith("SP_"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                cnn.Open();
                dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                dt = new DataTable();
                dt.Load(dr);

                if (cmd.Parameters.Count > 0)
                {
                    cmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }
            return dt;
        }
        public static DataTable ExecuteDataTable(string query, params SqlParameter[] parameters)
        {
            SqlConnection cnn = new SqlConnection(_conString);
            SqlCommand cmd = new SqlCommand(query, cnn);
            SqlDataReader dr;
            DataTable dt;

            try
            {
                if (query.ToUpper().Contains("DELETE") && query.ToUpper().Contains("UPDATE"))
                {
                    throw new DataException("You don't have permission to access.");
                }
                if (query.ToUpper().StartsWith("SELECT"))
                {
                    cmd.CommandType = CommandType.Text;
                }
                else
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                }
                for (int i = 0; i <= parameters.Length - 1; i++)
                {
                    cmd.Parameters.Add(parameters[i]);
                }
                cnn.Open();
                dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                dt = new DataTable();
                dt.Load(dr);

                if (cmd.Parameters.Count > 0)
                {
                    cmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cnn.State == ConnectionState.Open)
                {
                    cnn.Dispose();
                }
            }
            return dt;
        }
        #endregion
    }
}
