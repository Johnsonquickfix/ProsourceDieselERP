using System;
using System.Collections.Generic; 
using System.Web.Mvc; 
using static LaylaERP.Models.Export_Details;
using LaylaERP.BAL;
 

namespace LaylaERP_v1.Controllers
{
    public class CMSApiController : Controller
    {
        /// <summary>
        /// API for banner
        /// </summary>
        /// <param name="app_key"></param>
        /// <param name="entity_id"></param>
        /// <param name="per_page"></param>
        /// <param name="page"></param>
        /// <param name="post_status"></param>
        /// <param name="sort"></param>
        /// <param name="direction"></param>
        /// <returns></returns>
        [Route("get-banner/{app_key}/{entity_id}")]
        public ActionResult Getbanner(string app_key, string entity_id, string per_page, string page, string post_status, string sort, string direction)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                {  return new HttpStatusCodeResult(400, "Bad Request"); }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")                         
                          return Json("invalid app key", JsonRequestBehavior.AllowGet);
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getapi(entity_id, app_key, post_status, per_page, page, sort, direction, "BLS");
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
                                Review.BannerImage = balResult.Rows[i]["InnerPageBannerImage"].ToString();
                                Review.Bannerimage_width = balResult.Rows[i]["Bannerimagewidth"].ToString();
                                Review.Bannerimage_height = balResult.Rows[i]["Bannerimageheight"].ToString();
                                Review.Banner_order = balResult.Rows[i]["menu_order"].ToString();
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
            }      
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return new HttpStatusCodeResult(400, "Bad Request");
            }
        }

        /// <summary>
        /// API for Pages
        /// </summary>
        /// <param name="app_key"></param>
        /// <param name="entity_id"></param>
        /// <param name="per_page"></param>
        /// <param name="page"></param>
        /// <param name="post_status"></param>
        /// <param name="sort"></param>
        /// <param name="direction"></param>
        /// <returns></returns>
        [Route("get-pages/{app_key}/{entity_id}")]
        public ActionResult Getpages(string app_key, string entity_id, string per_page, string page, string post_status, string sort, string direction)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                { return new HttpStatusCodeResult(400, "Bad Request"); }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        return Json("invalid app key", JsonRequestBehavior.AllowGet);
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getpageapi(entity_id, app_key, post_status, per_page, page, sort, direction, "PLS");
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<PagesModel> ReviewList = new List<PagesModel>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                                PagesModel Review = new PagesModel();
                                Review.id = balResult.Rows[i]["ID"].ToString();
                                Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_title = balResult.Rows[i]["post_title"].ToString();
                                Review.post_author = balResult.Rows[i]["post_author"].ToString();
                                Review.user_login = balResult.Rows[i]["user_login"].ToString();
                                Review.entity_id = balResult.Rows[i]["entity_id"].ToString();
                                Review.entity = balResult.Rows[i]["CompanyName"].ToString();
                                Review.post_date = balResult.Rows[i]["post_date"].ToString();
                                Review.post_parent = balResult.Rows[i]["post_parent"].ToString();
                                Review.order = balResult.Rows[i]["menu_order"].ToString();
                                Review.upload_ad_image = balResult.Rows[i]["upload_ad_image"].ToString();
                                Review.short_description = balResult.Rows[i]["short_description"].ToString();
                                Review.featured_image_url = balResult.Rows[i]["featured_image_url"].ToString();
                                Review._yoast_wpseo_focuskw = balResult.Rows[i]["_yoast_wpseo_focuskw"].ToString();
                                Review._yoast_wpseo_metadesc = balResult.Rows[i]["_yoast_wpseo_metadesc"].ToString();
                                Review._yoast_wpseo_title = balResult.Rows[i]["_yoast_wpseo_title"].ToString();
                                Review._yoast_wpseo_keywordsynonyms = balResult.Rows[i]["_yoast_wpseo_keywordsynonyms"].ToString();
                                Review._yoast_wpseo_focuskeywords = balResult.Rows[i]["_yoast_wpseo_focuskeywords"].ToString();
                                //Review._wp_page_template = balResult.Rows[i]["_wp_page_template"].ToString();
                                Review._gmk = balResult.Rows[i]["_gmk"].ToString();
                                Review._comment = balResult.Rows[i]["_comment"].ToString();
                                Review.total = balResult.Rows[i]["total"].ToString();
                                //Review.star_distribution = JsonConvert.DeserializeObject(balResult.Rows[i]["star_distribution"].ToString());
                                ReviewList.Add(Review);
                            }

                            //return Json(ReviewList);                            
                            if (ReviewList.Count == 1)
                            {                                
                                return Json(ReviewList[0], JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                return Json(ReviewList, JsonRequestBehavior.AllowGet);
                            }                            

                        }
                        else
                        {
                            return Json("[]", JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return new HttpStatusCodeResult(400, "Bad Request");
            }
        }

        [Route("get-post/{app_key}/{entity_id}")]
        public ActionResult Getpost(string app_key, string entity_id, string per_page, string page, string post_status, string sort, string direction)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                { return new HttpStatusCodeResult(400, "Bad Request"); }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        return Json("invalid app key", JsonRequestBehavior.AllowGet);
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getapi(entity_id, app_key, post_status, per_page, page, sort, direction, "PST");
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<PostModel> ReviewList = new List<PostModel>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                                PostModel Review = new PostModel();
                                Review.id = balResult.Rows[i]["ID"].ToString();
                                Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_title = balResult.Rows[i]["post_title"].ToString();
                                Review.post_author = balResult.Rows[i]["post_author"].ToString();
                                Review.user_login = balResult.Rows[i]["user_login"].ToString();
                                Review.entity_id = balResult.Rows[i]["entity_id"].ToString();
                                Review.entity = balResult.Rows[i]["CompanyName"].ToString();
                                Review.post_date = balResult.Rows[i]["post_date"].ToString();
                                Review.category = balResult.Rows[i]["category"].ToString();
                                //Review.order = balResult.Rows[i]["menu_order"].ToString();
                                Review.single_image_url = balResult.Rows[i]["single_image_url"].ToString();
                                Review.featured_image_url = balResult.Rows[i]["featured_image_url"].ToString();
                                Review._yoast_wpseo_focuskw = balResult.Rows[i]["_yoast_wpseo_focuskw"].ToString();
                                Review._yoast_wpseo_metadesc = balResult.Rows[i]["_yoast_wpseo_metadesc"].ToString();
                                Review._yoast_wpseo_title = balResult.Rows[i]["_yoast_wpseo_title"].ToString();
                                Review._yoast_wpseo_keywordsynonyms = balResult.Rows[i]["_yoast_wpseo_keywordsynonyms"].ToString();
                                Review._yoast_wpseo_focuskeywords = balResult.Rows[i]["_yoast_wpseo_focuskeywords"].ToString();
                                //Review._wp_page_template = balResult.Rows[i]["_wp_page_template"].ToString();
                                //Review._gmk = balResult.Rows[i]["_gmk"].ToString();
                                //Review._comment = balResult.Rows[i]["_comment"].ToString();
                                Review.total = balResult.Rows[i]["total"].ToString();
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
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return new HttpStatusCodeResult(400, "Bad Request");
            }
        }

        [Route("get-store/{app_key}/{entity_id}")]
        public ActionResult Getstore(string app_key, string entity_id)
        {
            try
            {
                
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        return Json("invalid app key", JsonRequestBehavior.AllowGet);
                    else 
                    { 
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getapi(entity_id, app_key, "publish", "10", "0", "entity", "desc", "STOR");
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<StoreModel> ReviewList = new List<StoreModel>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                               StoreModel Review = new StoreModel();
                                Review.store_id = balResult.Rows[i]["entity"].ToString();
                                Review.store_name = balResult.Rows[i]["CompanyName"].ToString();
                                Review.logo_url = balResult.Rows[i]["logo_url"].ToString();
                                Review.img_width = balResult.Rows[i]["img_width"].ToString();
                                Review.img_height = balResult.Rows[i]["img_height"].ToString();
                                Review.mobile = balResult.Rows[i]["user_mobile"].ToString();
                                Review.email = balResult.Rows[i]["email"].ToString();
                                Review.address = balResult.Rows[i]["address"].ToString();
                                Review.total = balResult.Rows[i]["total"].ToString();
                                ReviewList.Add(Review);
                            } 
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