using LaylaERP.BAL;
using LaylaERP.DAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static LaylaERP.Models.Export_Details;

namespace LaylaERP_v1.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        public ActionResult Index(int id)
        {

            SqlParameter[] parameters =
               {
                    new SqlParameter("@flag", "PLS"),
                    new SqlParameter("@id", id)

                };
            DataSet ds = SQLHelper.ExecuteDataSet("cms_pagelink_search", parameters);

            string FilePath = Path.Combine(Server.MapPath("~/Templates/ProductReviewReminder.html"));

            //string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\ProductReviewReminder.html";
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();

            //string base_url = string.Empty, appkey = string.Empty, strFromName = string.Empty, strFromMail = string.Empty, strReplyTo = string.Empty, app_email = string.Empty, app_password = string.Empty, host = string.Empty, portno = string.Empty;
            //bool enableSsl = false;
            ////string vendor_email = string.Empty;
            ////string SenderEmailID = string.Empty, SenderEmailPwd = string.Empty, SMTPServerName = string.Empty;
            ////int SMTPServerPortNo = 587; bool SSL = false;
            //foreach (DataRow dr in ds.Tables[0].Rows)
            //{
            //    base_url = (dr["base_url"] != Convert.DBNull) ? dr["base_url"].ToString() : "";
            //    appkey = (dr["appkey"] != Convert.DBNull) ? dr["appkey"].ToString() : "";
            //    strFromName = (dr["from_name"] != Convert.DBNull) ? dr["from_name"].ToString() : "";
            //    strFromMail = (dr["app_email"] != Convert.DBNull) ? dr["app_email"].ToString() : "";
            //    strReplyTo = (dr["reply_email"] != Convert.DBNull) ? dr["reply_email"].ToString() : "";
            //    app_password = (dr["app_password"] != Convert.DBNull) ? dr["app_password"].ToString() : "";
            //    host = (dr["host"] != Convert.DBNull) ? dr["host"].ToString() : "";
            //    enableSsl = (dr["enableSsl"] != Convert.DBNull) ? Convert.ToBoolean(dr["enableSsl"]) : false;
            //    portno = (dr["portno"] != Convert.DBNull) ? dr["portno"].ToString() : "";
            //}
            string str_meta = string.Empty, order_product_id = string.Empty, domain_name = string.Empty, strTemp = string.Empty, to_email = string.Empty, _subject = string.Empty, _body = string.Empty, _signature = string.Empty, _other_product = string.Empty, mail_language = string.Empty;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                strTemp = MailText;
                //order_product_id = dr["order_product_id"] != DBNull.Value ? dr["order_product_id"].ToString().Trim() : "";
                //to_email = dr["email"] != DBNull.Value ? dr["email"].ToString().Trim() : "";
                //domain_name = dr["product_name"] != DBNull.Value ? dr["product_name"].ToString().Trim() : "";
                //_subject = dr["mail_subject"] != DBNull.Value ? dr["mail_subject"].ToString().Trim() : "";
                _body = dr["post_content"] != DBNull.Value ? dr["post_content"].ToString().Trim() : "";
                //_signature = dr["email_signature"] != DBNull.Value ? dr["email_signature"].ToString().Trim() : "";
                //_other_product = dr["other_product"] != DBNull.Value ? dr["other_product"].ToString().Trim() : "";
                //mail_language = to_email;

                //strTemp = strTemp.Replace("{base_url}", base_url);
                strTemp = strTemp.Replace("{body}", _body);
                //strTemp = strTemp.Replace("{domain_name}", domain_name);
                //strTemp = strTemp.Replace("{email_signature}", _signature);
                //strTemp = strTemp.Replace("{reviewer_token}", order_product_id);
                //strTemp = strTemp.Replace("{appkey}", appkey);
                //strTemp = strTemp.Replace("{mail_language}", mail_language);
                //strTemp = strTemp.Replace("{other_product}", _other_product);

            }
            return View((object)strTemp);
        }

        [Route("get-banner/{app_key}/{entity_id}")]
        public ActionResult Getbanner(string app_key, string entity_id, string per_page, string page, string post_status, string sort, string direction)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                {
                    //return BadRequest(new { error = "invalid_request", error_description = "product id and client_secret and score is required " });
                    return new HttpStatusCodeResult(400, "Bad Request");
                }
                else
                {
                    string msg = string.Empty;
                    var balResult = CMSRepository.Getbanner(entity_id, app_key, post_status, per_page, page, sort, direction);
                    int total = balResult.Rows.Count;
                    if (total > 0)
                    {
                        List<BannerModel> ReviewList = new List<BannerModel>();
                        for (int i = 0; i < balResult.Rows.Count; i++)
                        {
                            BannerModel Review = new BannerModel();
                            Review.id = balResult.Rows[i]["ID"].ToString();
                            Review.post_content = balResult.Rows[i]["post_content"].ToString();
                            Review.post_title = balResult.Rows[i]["post_title"].ToString();
                            Review.post_author = balResult.Rows[i]["post_author"].ToString();
                            Review.user_login = balResult.Rows[i]["user_login"].ToString();
                            Review.entity_id = balResult.Rows[i]["entity_id"].ToString();
                            Review.post_date = balResult.Rows[i]["post_date"].ToString();
                            Review.total = balResult.Rows[i]["total"].ToString();
                            Review._edit_last = balResult.Rows[i]["_edit_last"].ToString();
                            Review._edit_lock = balResult.Rows[i]["_edit_lock"].ToString();
                            Review._for_mobile = balResult.Rows[i]["_for_mobile"].ToString();
                            Review._thumbnail_id = balResult.Rows[i]["_thumbnail_id"].ToString(); 
                            Review.for_mobile = balResult.Rows[i]["for_mobile"].ToString();
                            Review.InnerExcludeGlobalBanner = balResult.Rows[i]["InnerExcludeGlobalBanner"].ToString();
                            Review.InnerPageBannerImage = balResult.Rows[i]["InnerPageBannerImage"].ToString();
                            Review.InnerPageBannerLink = balResult.Rows[i]["InnerPageBannerLink"].ToString();
                            Review.InnerPageBannerSelection = balResult.Rows[i]["InnerPageBannerSelection"].ToString();
                            Review.InnerPageBannerTitle = balResult.Rows[i]["InnerPageBannerTitle"].ToString();
                            Review.InnerPageBannerType = balResult.Rows[i]["InnerPageBannerType"].ToString();
                            Review.remove_schema_page_specific = balResult.Rows[i]["remove_schema_page_specific"].ToString();
                            Review.slide_template = balResult.Rows[i]["slide_template"].ToString();
                            //Review.star_distribution = JsonConvert.DeserializeObject(balResult.Rows[i]["star_distribution"].ToString());
                            ReviewList.Add(Review);
                        }

                        //return Json(ReviewList);
                        return Json(ReviewList, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json("[]", JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return new HttpStatusCodeResult(400, "Bad Request");
            }
        }
    }
}