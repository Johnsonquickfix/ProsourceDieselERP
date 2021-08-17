using LaylaERP.DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using LaylaERP.Models;

namespace LaylaERP.BAL
{
    public class WarehouseRepository
    {
        public static DataTable GetWarehouseDetail(SearchModel model)
        {
            string strwhr = " where status= '"+model.strValue1+"'";
            DataTable dtr = new DataTable();
            try
            {
                
                string strquery = "SELECT rowid, ref,entity,description,lieu,concat(address,' ',town,' ',country,' ',zip)as address,phone,fax,if(status=0,'Inactive','Active')as status,warehouse_type,concat(cor_address,' ',cor_city,' ',cor_country,' ',cor_zip)as addressinfo FROM wp_warehouse";
                if(!string.IsNullOrEmpty(model.strValue1))
                {
                    strquery += strwhr;
                }
               
                dtr = SQLHelper.ExecuteDataTable(strquery);
              
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddWarehouse(WarehouseModel model)
        {
            try
            {
                string strsql = "insert into wp_warehouse(ref,datec,lieu,description,address,zip,town,country,phone,fax,statut,address1,city,status,warehouse_type,email)" +
                    " values(@ref,@datec,@lieu,@description,@address,@zip,@town,@country,@phone,@fax,@statut,@address1,@city,@status,@warehouse_type,@email);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@datec",Convert.ToDateTime(DateTime.UtcNow.ToString("yyyy-MM-dd"))),
                    new MySqlParameter("@lieu", model.lieu),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@address", model.address),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@town", model.town),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@fax", model.fax),
                    new MySqlParameter("@statut", model.statut),
                    new MySqlParameter("@address1", model.address1),
                    new MySqlParameter("@city", model.city),
                    new MySqlParameter("@status",model.status),
                    new MySqlParameter("@warehouse_type",model.warehouse_type),
                    new MySqlParameter("@email",model.email),

                    //Additional Info

                    //new MySqlParameter("@cor_phone", model.cor_phone),
                    //new MySqlParameter("@cor_address", model.cor_address),
                    //new MySqlParameter("@cor_address1", model.cor_address1),
                    //new MySqlParameter("@cor_city", model.cor_city),
                    //new MySqlParameter("@cor_state", model.cor_state),
                    //new MySqlParameter("@cor_zip", model.cor_zip),
                    //new MySqlParameter("@cor_country", model.cor_country),
                    //new MySqlParameter("@note_public", model.note_public),
                    //new MySqlParameter("@note_private", model.note_private),
                   

    };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetWarehouseID(int rowid)
        {
            DataTable dt = new DataTable();

            try
            {

                string strSql = "SELECT rowid,ref,entity,description,lieu,phone,fax,if(statut=0,'Close','Open')as statut, address, zip, " +
                    "town, country, address1, city, status, warehouse_type, cor_phone, cor_address, cor_address1, cor_city, cor_state, cor_zip," +
                    "cor_country, note_public, note_private, email FROM wp_warehouse where rowid=" + rowid + "";
                DataSet ds = SQLHelper.ExecuteDataSet(strSql);
                dt = ds.Tables[0];

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt;
        }

        public static int Updatewarehouses(WarehouseModel model)
        {
            try
            {
                string strsql = "update wp_warehouse set ref=@ref, lieu=@lieu, description=@description, address=@address, zip=@zip, town=@town, country=@country, phone=@phone, fax=@fax, statut=@statut," +
                    " address1=@address1, city=@city, status=@status, warehouse_type=@warehouse_type, " +
                    " email=@email  where rowid in(" + model.rowid + ")";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@ref", model.reff),
                    new MySqlParameter("@lieu", model.lieu),
                    new MySqlParameter("@description", model.description),
                    new MySqlParameter("@address", model.address),
                    new MySqlParameter("@zip", model.zip),
                    new MySqlParameter("@town", model.town),
                    new MySqlParameter("@country", model.country),
                    new MySqlParameter("@phone", model.phone),
                    new MySqlParameter("@fax", model.fax),
                    new MySqlParameter("@statut", model.statut),
                    new MySqlParameter("@address1", model.address1),
                    new MySqlParameter("@city", model.city),
                    new MySqlParameter("@status",model.status),
                    new MySqlParameter("@warehouse_type",model.warehouse_type),
                     new MySqlParameter("@email",model.email),
                    //additional info
                    //new MySqlParameter("@cor_phone", model.cor_phone),
                    //new MySqlParameter("@cor_address", model.cor_address),
                    //new MySqlParameter("@cor_address1", model.cor_address1),
                    //new MySqlParameter("@cor_city", model.cor_city),
                    //new MySqlParameter("@cor_state", model.cor_state),
                    //new MySqlParameter("@cor_zip", model.cor_zip),
                    //new MySqlParameter("@cor_country", model.cor_country),
                    //new MySqlParameter("@note_public", model.note_public),
                    //new MySqlParameter("@note_private", model.note_private),
            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetSourceWarehouse()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "select rowid, ref from wp_warehouse where status='1' order by rowid desc";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetProduct()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT DISTINCT post.id,ps.ID pr_id, CONCAT(post.post_title, ' (', COALESCE(psku.meta_value, ''), ') - ', LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt, ''), 'Size:', ''), 'Color:', ''))) as post_title, psr.meta_value as sale_price, pr.meta_value reg_price,"
                              + "  CONCAT(post.id, '$', COALESCE(ps.id, 0)) r_id FROM wp_posts as post"
                              + "  INNER join wp_postmeta psr1 on psr1.post_id = post.ID"
                              + "  LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                              + "  left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                              + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                              + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_sale_price'"
                              + "  WHERE post.post_type = 'product' AND post.post_status = 'publish' AND CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value, '') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt, ''), 'Size:', ''), 'Color:', ''))) like '%%%'"
                              + " ORDER BY post.ID";
                dtr = SQLHelper.ExecuteDataTable(strquery);

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddMouvement(WarehouseModel model)
        {
            try
            {
                string strsql = "insert into wp_stock_mouvement(datem,fk_product,fk_entrepot,value,type_mouvement,label,inventorycode,price,fk_origin) values(@datem,@fk_product,@fk_entrepot,-1*@value,1,@label,@inventorycode,@price,0);SELECT LAST_INSERT_ID();";
                string strsql1 = " insert into wp_stock_mouvement(datem,fk_product,fk_entrepot,value,type_mouvement,label,inventorycode,price,fk_origin) values(@datem,@fk_product,@fk_entrepottarget,@value,0,@label,@inventorycode,@price,0);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                { 
                    new MySqlParameter("@datem", Convert.ToDateTime(DateTime.UtcNow.ToString())),
                    new MySqlParameter("@fk_product", model.fk_product),
                    new MySqlParameter("@fk_entrepot", model.fk_entrepot),
                    new MySqlParameter("@value", model.value),
                    new MySqlParameter("@price", model.price),
                    //new MySqlParameter("@type_mouvement", model.type_mouvement),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@inventorycode", model.inventorycode),
                    new MySqlParameter("@fk_entrepottarget", model.fk_entrepottarget),
                    

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql+strsql1, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetProductDetails(int product_id)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT DISTINCT post.id,ps.ID pr_id,CONCAT(post.post_title, ' (' , COALESCE(psku.meta_value,'') , ') - ' ,LTRIM(REPLACE(REPLACE(COALESCE(ps.post_excerpt,''),'Size:', ''),'Color:', ''))) as post_title"
                            + " , COALESCE(pr.meta_value, 0) reg_price,COALESCE(psr.meta_value, 0) sale_price FROM wp_posts as post"
                            + " LEFT OUTER JOIN wp_posts ps ON ps.post_parent = post.id and ps.post_type LIKE 'product_variation'"
                            + " left outer join wp_postmeta psku on psku.post_id = ps.id and psku.meta_key = '_sku'"
                            + " left outer join wp_postmeta pr on pr.post_id = ps.id and pr.meta_key = '_regular_price'"
                            + " left outer join wp_postmeta psr on psr.post_id = COALESCE(ps.id, post.id) and psr.meta_key = '_sale_price'"
                            + " WHERE post.post_type = 'product' and ps.ID = " + product_id+"";
                dtr = SQLHelper.ExecuteDataTable(strquery);

            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetStockMouvment()
        {
            
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT wsm.rowid as ref, post.post_title as product, wsm.datem as date,ww.ref as warehouse, wsm.inventorycode as invcode," 
                                  + "wsm.label as label,wsm.value,concat('$',format(wsm.price,2)) as price FROM wp_stock_mouvement wsm, wp_warehouse ww, wp_posts post where ww.rowid = wsm.fk_entrepot and post.id = wsm.fk_product";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetStockAtDate(WarehouseModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT post.post_title as ref, wsm.label as label,sum(wsm.value) as stockatdate, concat('$', format(price * sum(wsm.value), 2)) as inputvalue,concat('$', format(price * sum(wsm.value), 2)) as sellvalue, sum(wsm.value) as currentstock"
                                  + " FROM wp_stock_mouvement wsm, wp_warehouse ww, wp_posts post where ww.rowid=wsm.fk_entrepot and wsm.fk_entrepot = '" + model.fk_entrepot + "' and post.id = wsm.fk_product and wsm.fk_product = '" + model.fk_product + "' and Date(wsm.datem) = '" + model.mydate + "'";
                //string strquery = "SELECT post.post_title as ref, wsm.label as label,wsm.value as stockatdate, wsm.value as inputvalue,wsm.value as sellvalue, wsm.value as currentstock"
                                 // + " FROM wp_stock_mouvement wsm, wp_warehouse ww, wp_posts post where wsm.fk_entrepot = '" + model.fk_entrepot + "' and ww.rowid = '" + model.fk_entrepot + "' and post.id = wsm.fk_product and wsm.fk_product = '" + model.fk_product + "' and Date(wsm.datem) = '" + model.mydate + "'";
                dtr = SQLHelper.ExecuteDataTable(strquery);
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static DataTable GetWarehouseByVendor(string userstatus, string searchid, int pageno, int pagesize, out int totalrows, string SortCol = "id", string SortDir = "DESC")
        {
            DataTable dt = new DataTable();
            totalrows = 0;
            try
            {
                string strWhr = string.Empty;

                string strSql = "SELECT v.rowid as rowid, v.name as vname, w.ref as wname, concat(v.address,' ',v.town,' ',v.fk_state,' ',v.zip,' ',v.fk_country) as Vaddress, concat(w.address,' ',w.city,' ',w.town,' ',w.zip,' ',w.country) as waddress, v.phone as phone FROM wp_VendorSetting vs"
                                + " inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid"
                                + " inner join wp_vendor v on v.rowid = vs.VendorID where 1=1";
                if (!string.IsNullOrEmpty(searchid))
                {
                    //strWhr += " and (email like '%" + searchid + "%' OR user_nicename='%" + searchid + "%' OR ID='%" + searchid + "%' OR nom like '%" + searchid + "%')";
                }
                if (userstatus != null)
                {
                    strWhr += " and (status='" + userstatus + "') ";
                }
                strSql += strWhr + string.Format(" order by {0} {1} LIMIT {2}, {3}", SortCol, SortDir, pageno.ToString(), pagesize.ToString());

                strSql += "; SELECT ceil(Count(v.rowid)/" + pagesize.ToString() + ") TotalPage,Count(v.rowid) TotalRecord FROM wp_VendorSetting vs inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid inner join wp_vendor v on v.rowid = vs.VendorID" + strWhr.ToString();

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

        public static DataTable Getvendorwarehouse(SearchModel model)
        {
            string strWhr = " where w.rowid='"+model.strValue1+"'";
            DataTable dtr = new DataTable();
            try
            {
                
                string strSql = "SELECT v.rowid as rowid, v.name as vname, w.ref as wname, concat(v.address,' ',v.town,' ',v.fk_state,' ',v.zip,' ',v.fk_country) as Vaddress, v.phone as phone FROM wp_VendorWarehouse vs"
                               + " inner JOIN wp_warehouse w on vs.WarehouseID = w.rowid"
                              + " inner join wp_vendor v on v.rowid = vs.VendorID";
                 if(!string.IsNullOrEmpty(model.strValue1))
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

        public static DataSet GetWarehouse()
        {
            DataSet DS = new DataSet();
            try
            {
                DS = SQLHelper.ExecuteDataSet("Select rowid, ref from wp_warehouse where status='1' order by rowid ");
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }

        public static int Updatewarehousesinfo(WarehouseModel model)
        {
            try
            {
                string strsql = "update wp_warehouse set " +
                    "cor_phone=@cor_phone, cor_address=@cor_address," +
                    "cor_address1=@cor_address1, cor_city=@cor_city, cor_state=@cor_state, cor_zip=@cor_zip, cor_country=@cor_country, note_public=@note_public, note_private=@note_private  where rowid in(" + model.rowid + ")";
                MySqlParameter[] para =
               {
                    //additional info
                    new MySqlParameter("@cor_phone", model.cor_phone),
                    new MySqlParameter("@cor_address", model.cor_address),
                    new MySqlParameter("@cor_address1", model.cor_address1),
                    new MySqlParameter("@cor_city", model.cor_city),
                    new MySqlParameter("@cor_state", model.cor_state),
                    new MySqlParameter("@cor_zip", model.cor_zip),
                    new MySqlParameter("@cor_country", model.cor_country),
                    new MySqlParameter("@note_public", model.note_public),
                    new MySqlParameter("@note_private", model.note_private),
            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


        public static int AddCurrentstock(WarehouseModel model)
        {
            try
            {
                string strsql = "insert into wp_stock_mouvement(datem,fk_product,fk_entrepot,value,type_mouvement,label,price,fk_origin,eatby,sellby,serial) " +
                    "values(@datem,@fk_product,@fk_entrepot,@value,0,@label,@price,0,@eatby,@sellby,@serial);SELECT LAST_INSERT_ID();";
                
                MySqlParameter[] para =
                {
                    new MySqlParameter("@datem", Convert.ToDateTime(DateTime.UtcNow.ToString())),
                    new MySqlParameter("@fk_product", model.fk_product),
                    new MySqlParameter("@fk_entrepot", model.fk_entrepot),
                    new MySqlParameter("@value", model.value),
                    new MySqlParameter("@price", model.price),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@eatby", model.eatby),
                    new MySqlParameter("@sellby", model.sellby),
                     new MySqlParameter("@serial", model.serial),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetCurrentStock(WarehouseModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT wsm.rowid as ref, post.post_title as product, LEFT(CAST(wsm.datem AS DATE), 10) as date,ww.ref as warehouse, wsm.inventorycode as invcode," +
                                   " wsm.label as label,wsm.value,concat('$', format(wsm.price, 2)) as price FROM wp_stock_mouvement wsm, wp_warehouse ww, wp_posts post where ww.rowid = wsm.fk_entrepot and post.id = wsm.fk_product and wsm.fk_entrepot = '"+model.fk_entrepot+"'";


                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int AddTransferStock(WarehouseModel model)
        {
           
            try
            {
                string strsql = "insert into wp_stock_mouvement(datem,fk_product,fk_entrepot,value,type_mouvement,label,inventorycode,price,fk_origin,eatby,sellby,serial) values(@datem,@fk_product,@fk_entrepot,-1*@value,1,@label,@inventorycode,@price,0,@eatby,@sellby,@serial);SELECT LAST_INSERT_ID();";
                string strsql1 = " insert into wp_stock_mouvement(datem,fk_product,fk_entrepot,value,type_mouvement,label,inventorycode,price,fk_origin,eatby,sellby,serial) values(@datem,@fk_product,@fk_entrepottarget,@value,0,@label,@inventorycode,@price,0,@eatby,@sellby,@serial);SELECT LAST_INSERT_ID();";
                MySqlParameter[] para =
                {
                    new MySqlParameter("@datem", Convert.ToDateTime(DateTime.UtcNow.ToString())),
                    new MySqlParameter("@fk_product", model.fk_product),
                    new MySqlParameter("@fk_entrepot", model.fk_entrepot),
                     new MySqlParameter("@fk_entrepottarget", model.fk_entrepottarget),
                    new MySqlParameter("@value", model.value),
                    new MySqlParameter("@price", model.price),
                    //new MySqlParameter("@type_mouvement", model.type_mouvement),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@inventorycode", model.inventorycode),
                    new MySqlParameter("@eatby", model.eatby),
                    new MySqlParameter("@sellby",model.sellby),
                    new MySqlParameter("@serial",model.serial),

                };
                int result = Convert.ToInt32(SQLHelper.ExecuteScalar(strsql + strsql1, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }


        public static DataTable GetCurrentStock1(SearchModel model)
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT rowid,label,fk_product,LEFT(CAST(eatby AS DATE), 10) as eatby,LEFT(CAST(sellby AS DATE), 10) as sellby,serial,value,price,fk_entrepot,inventorycode from wp_stock_mouvement where rowid='" + model.strValue1 + "'";


                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

        public static int UpdateCorrectstock(WarehouseModel model)
        {
            try
            {
                string strsql = "update wp_stock_mouvement set " +
                    "fk_product=@fk_product, value=@value, label=@label, eatby=@eatby, sellby=@sellby, serial=@serial, price=@price" +
                     " where rowid in(" + model.searchid + ")";
                MySqlParameter[] para =
               {
                    //additional info
                   new MySqlParameter("@fk_product", model.fk_product),
                    new MySqlParameter("@fk_entrepot", model.fk_entrepot),
                    new MySqlParameter("@value", model.value),
                    new MySqlParameter("@price", model.price),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@eatby", model.eatby),
                    new MySqlParameter("@sellby", model.sellby),
                    new MySqlParameter("@serial", model.serial),
            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static int UpdateTranferstock(WarehouseModel model)
        {
           
            try
            {
                string strsql = "update wp_stock_mouvement set " +
                    "fk_product=@fk_product, value=@value, label=@label, eatby=@eatby, sellby=@sellby, serial=@serial, price=@price, inventorycode=@inventorycode" +
                     " where rowid in(" + model.searchtransferid + ")";
                MySqlParameter[] para =
               {
                    //additional info
                   new MySqlParameter("@fk_product", model.fk_product),
                    new MySqlParameter("@fk_entrepot", model.fk_entrepot),
                    new MySqlParameter("@value", model.value),
                    new MySqlParameter("@price", model.price),
                    new MySqlParameter("@label", model.label),
                    new MySqlParameter("@eatby", model.eatby),
                    new MySqlParameter("@sellby", model.sellby),
                    new MySqlParameter("@serial", model.serial),
                    new MySqlParameter("@inventorycode",model.inventorycode),
            };
                int result = Convert.ToInt32(SQLHelper.ExecuteNonQuery(strsql, para));
                return result;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

        public static DataTable GetProductWarehouse()
        {
            DataTable dtr = new DataTable();
            try
            {
                string strquery = "SELECT ww.ref as warehouse, post.post_title as product,concat(ww.address,' ',ww.city,' ',ww.town,' ',ww.zip,' ',ww.country) as address FROM wp_warehouse ww, wp_posts post, product_warehouse p WHERE"
                                   + " ww.rowid = p.fk_warehouse and post.ID = p.fk_product";
                DataSet ds = SQLHelper.ExecuteDataSet(strquery);
                dtr = ds.Tables[0];
            }
            catch (Exception ex)
            { throw ex; }
            return dtr;
        }

    }
}
