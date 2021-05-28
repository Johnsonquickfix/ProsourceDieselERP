using Dapper;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CustomerRepository
    {
        private MySqlConnection Con;
        private string _con;

        public CustomerRepository()
        {
            Connection();
        }
        private void Connection()
        {
            _con = ConfigurationManager.ConnectionStrings["constr"].ToString();
            Con = new MySqlConnection(_con);
            if (Con.State == System.Data.ConnectionState.Open)
            {
                Con.Close();
            }
            Con.Open();
        }
        public CustomerModel AddNewCustomer(CustomerModel model)
        {
            try
            {
                DynamicParameters Para = new DynamicParameters();
                Para.Add("@user_login", model.user_nicename);
                Para.Add("@user_nicename", model.user_nicename);
                Para.Add("@user_email", model.user_email);
                Para.Add("@user_registered", Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd")));
                Para.Add("@display_name", model.user_nicename);
                Para.Add("@user_image", "None");


                var list = SqlMapper.Query<CustomerModel>(Con, "insert into wp_users(user_login,user_nicename, user_email, user_registered, display_name, user_image)values(@user_login,@user_nicename, @user_email, @user_registered, @display_name, @user_image); select LAST_INSERT_ID() as ID;", Para, commandType: CommandType.Text).FirstOrDefault();
                if (list.ID>0)
                {
                    return list;
                }
                else
                {
                    return list;
                }
            }
            catch (Exception E)
            {
                return model;
            }
        }
        public CustomerModel AddUserMetaData(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                DynamicParameters Para = new DynamicParameters();
                Para.Add("@user_id", id);
                Para.Add("@meta_key", varFieldsName);
                Para.Add("@meta_value", varFieldsValue);

                var list = SqlMapper.Query<CustomerModel>(Con, "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;", Para, commandType: CommandType.Text).FirstOrDefault();
                if (list.ID > 0)
                {
                    return list;
                }
                else
                {
                    return list;
                }
            }
            catch (Exception E)
            {
                return model;
            }
        }

        public CustomerModel AddUserMetaDataBillingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                DynamicParameters Para = new DynamicParameters();
                Para.Add("@user_id", id);
                Para.Add("@meta_key", varFieldsName);
                Para.Add("@meta_value", varFieldsValue);

                var list = SqlMapper.Query<CustomerModel>(Con, "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;", Para, commandType: CommandType.Text).FirstOrDefault();
                if (list.ID > 0)
                {
                    return list;
                }
                else
                {
                    return list;
                }
            }
            catch (Exception E)
            {
                return model;
            }
        }

        public CustomerModel AddUserMetaDataShippingAddress(CustomerModel model, long id, string varFieldsName, string varFieldsValue)
        {
            try
            {
                DynamicParameters Para = new DynamicParameters();
                Para.Add("@user_id", id);
                Para.Add("@meta_key", varFieldsName);
                Para.Add("@meta_value", varFieldsValue);

                var list = SqlMapper.Query<CustomerModel>(Con, "INSERT INTO wp_usermeta(user_id,meta_key,meta_value) VALUES(user_id,@meta_key,@meta_value); select LAST_INSERT_ID() as ID;", Para, commandType: CommandType.Text).FirstOrDefault();
                if (list.ID > 0)
                {
                    return list;
                }
                else
                {
                    return list;
                }
            }
            catch (Exception E)
            {
                return model;
            }
        }
    }
}