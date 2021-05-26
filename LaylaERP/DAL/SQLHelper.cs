namespace LaylaERP.DAL
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Data;
    using MySql.Data.MySqlClient;


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
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
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
        public static int ExecuteNonQuery(string query, params MySqlParameter[] parameters)
        {
            int retval;
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
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
        #endregion

        #region ExecuteScalers
        public static object ExecuteScalar(string query)
        {
            object retval;
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
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
        public static object ExecuteScalar(string query, params MySqlParameter[] parameters)
        {
            object retval;
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
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
        public static MySqlDataReader ExecuteReader(string query)
        {
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
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
        public static MySqlDataReader ExecuteReader(string query, params MySqlParameter[] parameters)
        {
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
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
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
            DataSet ds;
            MySqlDataAdapter da;
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
                da = new MySqlDataAdapter();
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
        public static DataSet ExecuteDataSet(string query, params MySqlParameter[] parameters)
        {
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
            MySqlDataAdapter da;
            DataSet ds;

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
                da = new MySqlDataAdapter();
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
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
            MySqlDataReader dr;
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
        public static DataTable ExecuteDataTable(string query, params MySqlParameter[] parameters)
        {
            MySqlConnection cnn = new MySqlConnection(_conString);
            MySqlCommand cmd = new MySqlCommand(query, cnn);
            MySqlDataReader dr;
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
