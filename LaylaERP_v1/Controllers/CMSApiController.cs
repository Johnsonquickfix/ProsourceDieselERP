﻿namespace LaylaERP_v1.Controllers
{
    using System;
    using System.Collections.Generic;
    using static LaylaERP.Models.Export_Details;
    using LaylaERP.BAL;
    using System.Data;
    using System.Web.Http;
    using System.Net;
    using Newtonsoft.Json;
    using System.Dynamic;
    using System.Linq;
    using Newtonsoft.Json.Linq;
    using QuickfixSearch.Models.Product;
    using System.Text.RegularExpressions;

    [RoutePrefix("cmsapi")]
    public class CMSApiController : ApiController
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
        [HttpGet, Route("get-banner/{app_key}/{entity_id}")]
        public IHttpActionResult Getbanner(string app_key, string entity_id, int per_page = 10, int page = 0, string post_status = "publish", string sort = "id", string direction = "desc")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                {


                    return BadRequest("Bad Request");
                }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        return BadRequest("invalid app key");
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getapi(entity_id, app_key, post_status, per_page.ToString(), page.ToString(), sort, direction, "BLS");
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            //List<BannerModel> ReviewList = new List<BannerModel>();
                            List<Dictionary<String, Object>> ReviewList = new List<Dictionary<string, object>>();
                            Dictionary<String, Object> row;
                            //for (int i = 0; i < balResult.Rows.Count; i++)
                            foreach (DataRow dr in balResult.Rows)
                            {
                                row = new Dictionary<string, object>();
                                row.Add("ID", dr["ID"]);
                                row.Add("post_content", dr["post_content"]);
                                row.Add("post_title", dr["post_title"]);
                                row.Add("post_author", dr["post_author"]);
                                row.Add("user_login", dr["user_login"]);
                                row.Add("entity_id", dr["entity_id"]);
                                row.Add("post_date", dr["post_date"]);
                                row.Add("total", dr["total"]);
                                row.Add("_edit_last", dr["_edit_last"]);
                                row.Add("_edit_lock", dr["_edit_lock"]);
                                row.Add("_for_mobile", dr["_for_mobile"]);
                                row.Add("_thumbnail_id", dr["_thumbnail_id"]);
                                row.Add("for_mobile", dr["for_mobile"]);
                                row.Add("InnerExcludeGlobalBanner", dr["InnerExcludeGlobalBanner"]);
                                row.Add("image", new { name = dr["InnerPageBannerImage"], width = dr["Bannerimagewidth"], height = dr["Bannerimageheight"] });
                                row.Add("menu_order", dr["menu_order"]);
                                row.Add("InnerPageBannerLink", dr["InnerPageBannerLink"]);
                                row.Add("InnerPageBannerSelection", dr["InnerPageBannerSelection"]);
                                row.Add("InnerPageBannerTitle", dr["InnerPageBannerTitle"]);
                                row.Add("InnerPageBannerType", dr["InnerPageBannerType"]);
                                row.Add("remove_schema_page_specific", dr["remove_schema_page_specific"]);
                                row.Add("slide_template", dr["slide_template"]);
                                ReviewList.Add(row);

                                //BannerModel Review = new BannerModel();
                                //Review.id = balResult.Rows[i]["ID"].ToString();
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                //Review.post_title = balResult.Rows[i]["post_title"].ToString();
                                //Review.post_author = balResult.Rows[i]["post_author"].ToString();
                                //Review.user_login = balResult.Rows[i]["user_login"].ToString();
                                //Review.entity_id = balResult.Rows[i]["entity_id"].ToString();
                                //Review.post_date = balResult.Rows[i]["post_date"].ToString();
                                //Review.total = balResult.Rows[i]["total"].ToString();
                                //Review._edit_last = balResult.Rows[i]["_edit_last"].ToString();
                                //Review._edit_lock = balResult.Rows[i]["_edit_lock"].ToString();
                                //Review._for_mobile = balResult.Rows[i]["_for_mobile"].ToString();
                                //Review._thumbnail_id = balResult.Rows[i]["_thumbnail_id"].ToString();
                                //Review.for_mobile = balResult.Rows[i]["for_mobile"].ToString();
                                //Review.InnerExcludeGlobalBanner = balResult.Rows[i]["InnerExcludeGlobalBanner"].ToString();
                                //Review.BannerImage = balResult.Rows[i]["InnerPageBannerImage"].ToString();
                                //Review.Bannerimage_width = balResult.Rows[i]["Bannerimagewidth"].ToString();
                                //Review.Bannerimage_height = balResult.Rows[i]["Bannerimageheight"].ToString();
                                //Review.Banner_order = balResult.Rows[i]["menu_order"].ToString();
                                //Review.InnerPageBannerLink = balResult.Rows[i]["InnerPageBannerLink"].ToString();
                                //Review.InnerPageBannerSelection = balResult.Rows[i]["InnerPageBannerSelection"].ToString();
                                //Review.InnerPageBannerTitle = balResult.Rows[i]["InnerPageBannerTitle"].ToString();
                                //Review.InnerPageBannerType = balResult.Rows[i]["InnerPageBannerType"].ToString();
                                //Review.remove_schema_page_specific = balResult.Rows[i]["remove_schema_page_specific"].ToString();
                                //Review.slide_template = balResult.Rows[i]["slide_template"].ToString();
                                ////Review.star_distribution = JsonConvert.DeserializeObject(balResult.Rows[i]["star_distribution"].ToString());
                                //ReviewList.Add(Review);
                            }

                            //return Json(ReviewList);
                            // return Json(ReviewList, JsonRequestBehavior.AllowGet);
                            return Ok(ReviewList);

                        }
                        else
                        {
                            //return Json("[]", JsonRequestBehavior.AllowGet);
                            return Ok("[]");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });

                return BadRequest("Bad Request");
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
        [HttpGet, Route("get-pages/{app_key}/{entity_id}")]
        public IHttpActionResult Getpages(string app_key, string entity_id, int per_page = 10, int page = 0, string post_name = "", string post_status = "publish", string sort = "id", string direction = "desc")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                {
                    //return new HttpStatusCodeResult(400, "Bad Request");
                    return BadRequest("Bad Request");
                }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        //return Json("invalid app key", JsonRequestBehavior.AllowGet);
                        return BadRequest("invalid app key");
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getpageapi(entity_id, app_key, post_status, per_page.ToString(), page.ToString(), sort, direction, "PLS", post_name);
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
                                Review.post_name = balResult.Rows[i]["post_name"].ToString();
                                Review.entity_id = balResult.Rows[i]["entity_id"].ToString();
                                Review.entity = balResult.Rows[i]["CompanyName"].ToString();
                                Review.post_date = balResult.Rows[i]["post_date"].ToString();
                                Review.post_parent = balResult.Rows[i]["post_parent"].ToString();
                                Review.order = balResult.Rows[i]["menu_order"].ToString();
                                ImageModel image = new ImageModel
                                {
                                    width = balResult.Rows[i]["bwidth"].ToString(),
                                    height = balResult.Rows[i]["bheight"].ToString(),
                                    name = balResult.Rows[i]["upload_ad_image"].ToString(),

                                };
                                OtherImageModel OtherImageModel = new OtherImageModel
                                {
                                    width = balResult.Rows[i]["fwidth"].ToString(),
                                    height = balResult.Rows[i]["fheight"].ToString(),
                                    name = balResult.Rows[i]["featured_image_url"].ToString(),

                                };
                                Review.upload_ad_image = image;
                                Review.featured_image_url = OtherImageModel;
                                Review.short_description = balResult.Rows[i]["short_description"].ToString();

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
                                // return Json(ReviewList[0], JsonRequestBehavior.AllowGet);
                                return Ok(ReviewList[0]);
                            }
                            else
                            {
                                // return Json(ReviewList, JsonRequestBehavior.AllowGet);
                                return Ok(ReviewList);
                            }

                        }
                        else
                        {
                            //return Json("[]", JsonRequestBehavior.AllowGet);
                            return Ok("[]");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }

        [HttpGet, Route("get-post/{app_key}/{entity_id}")]
        public IHttpActionResult Getpost(string app_key, string entity_id, int per_page = 10, int page = 0, string post_name = "", string post_status = "publish", string sort = "id", string direction = "desc")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                {
                    //return new HttpStatusCodeResult(400, "Bad Request"); 
                    return BadRequest("Bad Request");
                }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        // return Json("invalid app key", JsonRequestBehavior.AllowGet);
                        return BadRequest("invalid app key");
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getpageapi(entity_id, app_key, post_status, per_page.ToString(), page.ToString(), sort, direction, "PST", post_name);
                        List<Category> categoryList = new List<Category>();

                        // First pass: Create a dictionary to hold category ID and index mapping
                        Dictionary<int, int> categoryIndexMap = new Dictionary<int, int>();

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
                                Review.post_name = balResult.Rows[i]["post_name"].ToString();

                                ImageModel image = new ImageModel
                                {
                                    width = balResult.Rows[i]["bwidth"].ToString(),
                                    height = balResult.Rows[i]["bheight"].ToString(),
                                    name = balResult.Rows[i]["single_image_url"].ToString(),

                                };
                                OtherImageModel OtherImageModel = new OtherImageModel
                                {
                                    width = balResult.Rows[i]["fwidth"].ToString(),
                                    height = balResult.Rows[i]["fheight"].ToString(),
                                    name = balResult.Rows[i]["featured_image_url"].ToString(),

                                };

                                Review.single_image_url = image;
                                Review.featured_image_url = OtherImageModel;

                                //   Review.single_image_url = balResult.Rows[i]["single_image_url"].ToString();
                                // Review.featured_image_url = balResult.Rows[i]["featured_image_url"].ToString();
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
                                var balcategory = CMSRepository.Getcategory(balResult.Rows[i]["ID"].ToString());
                                List<Category> categoryHierarchy = BuildCategoryHierarchy(0, balcategory, // Assuming this DataTable contains category data
                                    categoryIndexMap);

                                // Review.categories = categoryHierarchy;
                                if (categoryHierarchy.Count == 1)
                                {
                                    //Review.categories = categoryHierarchy;
                                    //List<Category> wrappedCategories = new List<Category> { Review.categories[0] };
                                    //Review.categories = wrappedCategories;
                                    //ReviewList.Add(Review);
                                    // Clear any existing categories
                                    Review.categories = new List<Category> { categoryHierarchy[0] };
                                    // Review.categories = Review.categories[0];
                                }
                                else
                                {
                                    Review.categories = categoryHierarchy;
                                }

                                ReviewList.Add(Review);

                            }

                            //return Json(ReviewList);
                            // return Json(ReviewList, JsonRequestBehavior.AllowGet);
                            if (ReviewList.Count == 1)
                            {
                                return Ok(ReviewList[0]);
                            }
                            else
                            {
                                return Ok(ReviewList);
                            }

                        }
                        else
                        {
                            return Ok("[]");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }

        public List<Category> BuildCategoryHierarchy(int categoryId, DataTable categoryData, Dictionary<int, int> categoryIndexMap)
        {
            List<Category> categories = new List<Category>();

            foreach (DataRow row in categoryData.Rows)
            {
                int category_id = Convert.ToInt32(row["term_id"]);
                //int parent_id = Convert.ToInt32(row["parent_id"]);
                string name = row["name"].ToString();
                string slug = row["slug"].ToString();
                //int count = Convert.ToInt32(row["count"]);
                //if (parent_id == categoryId)
                //{
                Category category = new Category
                {
                    category_id = category_id,
                    //parent_id = parent_id,
                    name = name,
                    slug = slug,
                    // count = count,
                    //subcategories = BuildCategoryHierarchy(category_id, categoryData, categoryIndexMap)
                };
                categories.Add(category);
                //}
            }
            return categories;
        }

        [HttpGet, Route("get-store/{app_key}/{entity_id}")]
        public IHttpActionResult Getstore(string app_key, string entity_id)
        {
            try
            {

                if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                    return BadRequest("invalid app key");
                else
                {
                    string msg = string.Empty;
                    var balResult = CMSRepository.Getapi(entity_id, app_key, "publish", "10", "0", "entity", "desc", "STOR");
                    int total = balResult.Rows.Count;
                    if (total > 0)
                    {
                        dynamic obj = new List<dynamic>();
                        Dictionary<String, Object> row;
                        //List<StoreModel> ReviewList = new List<StoreModel>();
                        for (int i = 0; i < balResult.Rows.Count; i++)
                        {
                            row = new Dictionary<string, object>();
                            row.Add("store_id", balResult.Rows[i]["entity"]);
                            row.Add("store_name", balResult.Rows[i]["CompanyName"]);
                            row.Add("image", new
                            {
                                name = balResult.Rows[i]["logo_url"].ToString(),
                                width = balResult.Rows[i]["img_width"].ToString(),
                                height = balResult.Rows[i]["img_height"].ToString(),
                                filesize = 0
                            });
                            row.Add("mobile", balResult.Rows[i]["user_mobile"]);
                            row.Add("email", balResult.Rows[i]["email"]);
                            row.Add("address", balResult.Rows[i]["address"]);
                            row.Add("total", balResult.Rows[i]["total"]);
                            obj.Add(row);
                            //StoreModel Review = new StoreModel();
                            //Review.store_id = balResult.Rows[i]["entity"].ToString();
                            //Review.store_name = balResult.Rows[i]["CompanyName"].ToString();
                            //Review.logo_url = balResult.Rows[i]["logo_url"].ToString();
                            //Review.img_width = balResult.Rows[i]["img_width"].ToString();
                            //Review.img_height = balResult.Rows[i]["img_height"].ToString();
                            //Review.mobile = balResult.Rows[i]["user_mobile"].ToString();
                            //Review.email = balResult.Rows[i]["email"].ToString();
                            //Review.address = balResult.Rows[i]["address"].ToString();
                            //Review.total = balResult.Rows[i]["total"].ToString();
                            //ReviewList.Add(Review);
                        }
                        //return Json(ReviewList, JsonRequestBehavior.AllowGet); 
                        if (obj.Count == 1) return Ok(obj[0]);
                        else return Ok(obj);
                    }
                    else
                    {
                        return Ok("[]");
                    }
                }

            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }

        /// <summary>
        /// Get Blog
        /// </summary>
        /// <param name="app_key"></param>
        /// <param name="entity_id"></param>
        /// <param name="per_page"></param>
        /// <param name="page"></param>
        /// <param name="post_status"></param>
        /// <param name="sort"></param>
        /// <param name="direction"></param>
        /// <returns></returns>
        [HttpGet, Route("get-blog/{app_key}/{entity_id}")]
        public IHttpActionResult Getblog(string app_key, string entity_id, string per_page, string page, string post_name, string post_status, string sort, string direction)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || string.IsNullOrEmpty(entity_id))
                { return BadRequest("Bad Request"); }
                else
                {
                    if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                        return BadRequest("invalid app key");
                    else
                    {
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getpageapi(entity_id, app_key, post_status, per_page, page, sort, direction, "BLG", post_name);
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<BlogModel> ReviewList = new List<BlogModel>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                                BlogModel Review = new BlogModel();
                                Review.id = balResult.Rows[i]["ID"].ToString();
                                Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_title = balResult.Rows[i]["post_title"].ToString();
                                Review.post_author = balResult.Rows[i]["post_author"].ToString();
                                Review.user_login = balResult.Rows[i]["user_login"].ToString();
                                Review.entity_id = balResult.Rows[i]["entity_id"].ToString();
                                Review.entity = balResult.Rows[i]["CompanyName"].ToString();
                                Review.post_date = balResult.Rows[i]["post_date"].ToString();
                                Review.upload_ad_image = balResult.Rows[i]["upload_ad_image"].ToString();
                                Review.short_description = balResult.Rows[i]["short_description"].ToString();
                                Review.featured_image_url = balResult.Rows[i]["featured_image_url"].ToString();
                                Review.total = balResult.Rows[i]["total"].ToString();
                                //Review.star_distribution = JsonConvert.DeserializeObject(balResult.Rows[i]["star_distribution"].ToString());
                                ImageModel image = new ImageModel
                                {
                                    width = balResult.Rows[i]["bwidth"].ToString(),
                                    height = balResult.Rows[i]["bheight"].ToString(),
                                    name = balResult.Rows[i]["upload_ad_image"].ToString(),
                                };
                                OtherImageModel OtherImageModel = new OtherImageModel
                                {
                                    width = balResult.Rows[i]["fwidth"].ToString(),
                                    height = balResult.Rows[i]["fheight"].ToString(),
                                    name = balResult.Rows[i]["featured_image_url"].ToString(),
                                };
                                Review.image = image;
                                Review.other_image = OtherImageModel;
                                ReviewList.Add(Review);
                            }

                            //return Json(ReviewList);                            
                            if (ReviewList.Count == 1)
                            {
                                return Ok(ReviewList[0]);
                            }
                            else
                            {
                                return Ok(ReviewList);
                            }

                        }
                        else
                        {
                            return Ok("[]");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //return BadRequest(new { error = "application_error", error_description = ex.Message });
                return BadRequest("Bad Request");
            }
        }

        [HttpGet, Route("menu-items/{app_key}/{entity_id}")]
        public IHttpActionResult MenuItems(string app_key, long entity_id = 0, long menu_term_id = 0)
        {
            try
            {
                if (entity_id == 1) menu_term_id = 61873;
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (menu_term_id == 0)
                {
                    return Ok(new { message = "Menu term id required", status = 500, code = "SUCCESS", data = new List<string>() });
                }
                else
                {
                    string msg = string.Empty;
                    List<dynamic> categoryList = new List<dynamic>();
                    //level 1
                    DataTable tb1 = CMSRepository.GetMenuItems("category-menu", entity_id, menu_term_id, 0);
                    foreach (DataRow item in tb1.Rows)
                    {
                        string menu_item_url = "";
                        if (item["menu_item_url"] != DBNull.Value)
                        {
                            menu_item_url = item["menu_item_url"].ToString().Replace("(^https?://)", "");
                        }
                        var l1 = new
                        {
                            post_name = item["menu_item_url"].ToString().Equals("custom") ? menu_item_url : item["post_name"].ToString(),
                            post_title = item["post_title"].ToString(),
                            term_id = Convert.ToInt64(item["ID"].ToString()),
                            name = !string.IsNullOrEmpty(item["menu_name"].ToString()) ? item["menu_name"].ToString() : item["post_title"].ToString(),
                            slug = !string.IsNullOrEmpty(item["menu_name"].ToString()) ? item["menu_slug"].ToString() : item["post_name"].ToString(),
                            type = item["menu_type"].ToString(),
                            subcat = new List<dynamic>(),
                            //image = string.Empty,image_meta = string.Empty
                            image = new
                            {
                                width = !string.IsNullOrEmpty(item["file_width"].ToString()) ? Convert.ToInt64(item["file_width"].ToString()) : 0,
                                height = !string.IsNullOrEmpty(item["file_height"].ToString()) ? Convert.ToInt64(item["file_height"].ToString()) : 0,
                                file = item["file_name"].ToString(),
                                filesize = !string.IsNullOrEmpty(item["file_size"].ToString()) ? Convert.ToDouble(item["file_size"].ToString()) : 0,
                            }
                        };

                        //level 2
                        DataTable tb2 = CMSRepository.GetMenuItems("category-menu", entity_id, menu_term_id, l1.term_id);
                        foreach (DataRow item1 in tb2.Rows)
                        {
                            var l2 = new
                            {
                                term_id = Convert.ToInt64(item1["ID"].ToString()),
                                name = item1["menu_name"].ToString(),
                                slug = item1["menu_slug"].ToString(),
                                subcat = new List<dynamic>(),
                                image = new
                                {
                                    width = !string.IsNullOrEmpty(item1["file_width"].ToString()) ? Convert.ToInt64(item1["file_width"].ToString()) : 0,
                                    height = !string.IsNullOrEmpty(item1["file_height"].ToString()) ? Convert.ToInt64(item1["file_height"].ToString()) : 0,
                                    file = item1["file_name"].ToString(),
                                    filesize = !string.IsNullOrEmpty(item1["file_size"].ToString()) ? Convert.ToDouble(item1["file_size"].ToString()) : 0,
                                }
                            };
                            //level 3
                            DataTable tb3 = CMSRepository.GetMenuItems("category-menu", entity_id, menu_term_id, l2.term_id);
                            foreach (DataRow item2 in tb3.Rows)
                            {
                                var l3 = new
                                {
                                    term_id = Convert.ToInt64(item2["ID"].ToString()),
                                    name = item2["menu_name"].ToString(),
                                    slug = item2["menu_slug"].ToString(),
                                    subcat = new List<dynamic>(),
                                    image = new
                                    {
                                        width = !string.IsNullOrEmpty(item2["file_width"].ToString()) ? Convert.ToInt64(item2["file_width"].ToString()) : 0,
                                        height = !string.IsNullOrEmpty(item2["file_height"].ToString()) ? Convert.ToInt64(item2["file_height"].ToString()) : 0,
                                        file = item2["file_name"].ToString(),
                                        filesize = !string.IsNullOrEmpty(item2["file_size"].ToString()) ? Convert.ToDouble(item2["file_size"].ToString()) : 0,
                                    }
                                };
                                l2.subcat.Add(l3);
                            }
                            l1.subcat.Add(l2);
                        }

                        categoryList.Add(l1);
                    }
                    return Ok(new { message = "Menu items retrived successfully", status = 200, code = "SUCCESS", data = categoryList });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("slug-type/{app_key}/{entity_id}")]
        public IHttpActionResult SlugType(string app_key, long entity_id = 0, string parent_cat = "", string slug = "")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (string.IsNullOrEmpty(slug))
                {
                    return Ok(new { message = "Required query param 'slug'", status = 500, code = "SUCCESS", data = new List<string>() });
                }
                else
                {
                    dynamic obj = new ExpandoObject();
                    //term_main
                    DataSet ds = CMSRepository.GetPageItems("slug-type", entity_id, parent_cat, slug);
                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        obj.term_id = item["term_id"] != DBNull.Value ? Convert.ToInt64(item["term_id"].ToString()) : 0;
                        obj.taxonomy = item["taxonomy"].ToString().Trim();
                        obj.page_type = item["page_type"].ToString().Trim();
                    }
                    if (obj.term_id > 0) return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = obj });
                    else return Ok(new { message = "Invalid data.", status = 500, code = "FAIL", data = new { } });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("page-items/{app_key}/{entity_id}")]
        public IHttpActionResult PageItems(string app_key, long entity_id = 0, string parent_cat = "", string slug = "")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (string.IsNullOrEmpty(slug))
                {
                    return Ok(new { message = "Required query param 'slug'", status = 500, code = "SUCCESS", data = new List<string>() });
                }
                else
                {
                    dynamic obj = new ExpandoObject();
                    //term_main
                    DataSet ds = CMSRepository.GetPageItems("url-details", entity_id, parent_cat, slug);
                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        obj.page_type = item["page_type"].ToString().Trim();
                        obj.term_main = new ExpandoObject();
                        obj.term_main.term_id = item["term_id"] != DBNull.Value ? Convert.ToInt64(item["term_id"].ToString()) : 0;
                        obj.term_main.parent = item["parent"] != DBNull.Value ? Convert.ToInt64(item["parent"].ToString()) : 0;
                        obj.term_main.name = item["name"].ToString();
                        obj.term_main.slug = item["slug"].ToString();
                        obj.term_main.description = item["description"].ToString();
                        obj.term_main.short_description = !string.IsNullOrEmpty(item["description"].ToString()) ? item["description"].ToString().Substring(0, 150) : "";
                        obj.term_main.categories = !string.IsNullOrEmpty(item["categories"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(item["categories"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}");
                        obj.term_main.image = new
                        {
                            width = !string.IsNullOrEmpty(item["file_width"].ToString()) ? Convert.ToInt64(item["file_width"].ToString()) : 0,
                            height = !string.IsNullOrEmpty(item["file_height"].ToString()) ? Convert.ToInt64(item["file_height"].ToString()) : 0,
                            name = item["file_name"].ToString(),
                            filesize = !string.IsNullOrEmpty(item["file_size"].ToString()) ? Convert.ToDouble(item["file_size"].ToString()) : 0,
                        };
                    }
                    if (obj.page_type == "product_cat")
                    {
                        Dictionary<String, Object> row;
                        DataRow[] rows = ds.Tables[1].Select("level = 0", "name");
                        obj.child_categories = new List<dynamic>();
                        foreach (DataRow dr in rows)
                        {
                            row = new Dictionary<String, Object>();
                            row.Add("term_id", dr["term_id"]);
                            row.Add("parent", dr["parent"]);
                            row.Add("name", dr["name"]);
                            row.Add("slug", dr["slug"]);
                            row.Add("description", "description");
                            Dictionary<String, Object> img = new Dictionary<String, Object>();
                            string meta = dr["image"] != DBNull.Value ? dr["image"].ToString() : "{}";
                            JObject keyValues = JObject.Parse(meta);
                            if (keyValues.Count == 0)
                            {
                                img.Add("name", ""); img.Add("height", 0); img.Add("width", 0); img.Add("filesize", 0);
                            }
                            else
                            {
                                foreach (var item in keyValues)
                                {
                                    if (item.Key.Equals("_file_name")) img.Add("name", dr["_file_name"]);
                                    else if (item.Key.Equals("_file_height")) img.Add("height", dr["_file_height"]);
                                    else if (item.Key.Equals("_file_width")) img.Add("width", dr["_file_width"]);
                                    else if (item.Key.Equals("_file_size")) img.Add("filesize", dr["_file_size"]);
                                }
                            }
                            row.Add("image", img);
                            //Dictionary<String, Object> img = new Dictionary<String, Object>();
                            //img.Add("name", dr["file_name"]);
                            //img.Add("height", dr["file_height"]);
                            //img.Add("width", dr["file_width"]);
                            //img.Add("filesize", dr["file_size"]);
                            //row.Add("image", img);
                            List<Dictionary<string, object>> list2 = GetSubCategory(ds.Tables[1], Convert.ToInt64(dr["term_id"]));
                            row.Add("child_categories", list2);
                            obj.child_categories.Add(row);
                        }
                    }
                    else if (obj.page_type == "product_list")
                    {
                        Dictionary<String, Object> row;
                        obj.products = new List<dynamic>();
                        foreach (DataRow dr in ds.Tables[1].Rows)
                        {
                            row = new Dictionary<String, Object>();
                            row.Add("ID", dr["ID"]);
                            row.Add("post_name", dr["post_name"]);
                            row.Add("post_title", dr["post_title"]);
                            string meta = dr["meta"] != DBNull.Value ? dr["meta"].ToString() : "{}";
                            JObject keyValues = JObject.Parse(meta);
                            foreach (var item in keyValues) row.Add(item.Key, item.Value);
                            Dictionary<String, Object> img = new Dictionary<String, Object>();
                            meta = dr["image"] != DBNull.Value ? dr["image"].ToString() : "{}";
                            keyValues = JObject.Parse(meta);
                            if (keyValues.Count == 0)
                            {
                                img.Add("name", ""); img.Add("height", 0); img.Add("width", 0); img.Add("filesize", 0);
                            }
                            else
                            {
                                foreach (var item in keyValues)
                                {
                                    if (item.Key.Equals("_file_name")) img.Add("name", dr["_file_name"]);
                                    else if (item.Key.Equals("_file_height")) img.Add("height", dr["_file_height"]);
                                    else if (item.Key.Equals("_file_width")) img.Add("width", dr["_file_width"]);
                                    else if (item.Key.Equals("_file_size")) img.Add("filesize", dr["_file_size"]);
                                }
                            }
                            row.Add("image", img);
                            //Dictionary<String, Object> img = new Dictionary<String, Object>();
                            //img.Add("name", dr["file_name"]);
                            //img.Add("height", dr["file_height"]);
                            //img.Add("width", dr["file_width"]);
                            //img.Add("filesize", dr["file_size"]);
                            //row.Add("image", img);
                            obj.products.Add(row);
                        }
                    }
                    return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = obj });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        public static List<Dictionary<string, object>> GetSubCategory(DataTable DT, long ParentID)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            Dictionary<String, Object> row;
            DataRow[] rows = DT.Select("[parent] = " + ParentID.ToString(), "name");
            foreach (DataRow dr in rows)
            {
                row = new Dictionary<String, Object>();
                row.Add("term_id", dr["term_id"]);
                row.Add("parent", dr["parent"]);
                row.Add("name", dr["name"]);
                row.Add("slug", dr["slug"]);
                row.Add("description", "description");
                Dictionary<String, Object> img = new Dictionary<String, Object>();
                string meta = dr["image"] != DBNull.Value ? dr["image"].ToString() : "{}";
                JObject keyValues = JObject.Parse(meta);
                if (keyValues.Count == 0)
                {
                    img.Add("name", ""); img.Add("height", 0); img.Add("width", 0); img.Add("filesize", 0);
                }
                else
                {
                    foreach (var item in keyValues)
                    {
                        if (item.Key.Equals("_file_name")) img.Add("name", dr["_file_name"]);
                        else if (item.Key.Equals("_file_height")) img.Add("height", dr["_file_height"]);
                        else if (item.Key.Equals("_file_width")) img.Add("width", dr["_file_width"]);
                        else if (item.Key.Equals("_file_size")) img.Add("filesize", dr["_file_size"]);
                    }
                }
                row.Add("image", img);
                //Dictionary<String, Object> img = new Dictionary<String, Object>();
                //img.Add("name", dr["file_name"]);
                //img.Add("height", dr["file_height"]);
                //img.Add("width", dr["file_width"]);
                //img.Add("filesize", dr["file_size"]);
                //row.Add("image", img);
                List<Dictionary<string, object>> list2 = GetSubCategory(DT, Convert.ToInt64(dr["term_id"]));
                row.Add("child_categories", list2);
                list.Add(row);
            }
            return list;
        }
        [HttpPost, Route("products/filter/{app_key}/{entity_id}")]
        public IHttpActionResult ProductsFilter(string app_key, long entity_id, ProductFilterRequest flter)
        {
            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (flter == null)
                {
                    return Ok(new { message = "Required param 'cat_slug'", status = 500, code = "SUCCESS", data = new List<string>() });
                }
                else if (string.IsNullOrEmpty(flter.taxonomy.cat_slug))
                {
                    return Ok(new { message = "Required param 'cat_slug'", status = 500, code = "SUCCESS", data = new List<string>() });
                }
                else
                {
                    JObject original_o = JObject.FromObject(new { _sku = "", _price = "", _regular_price = "", _sale_price = "", _core_price = "", _manage_stock = "", _stock_status = "", _stock = "", _backorders = "", _weight = "", _height = "", _width = "", _length = "", _tax_status = "" });
                    dynamic obj = new ExpandoObject(); int overall_count = 0;
                    //term_main
                    DataSet ds = CMSRepository.GetPageItems("products-filter", entity_id, string.Empty, flter.taxonomy.cat_slug, flter.limit, flter.page);
                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        obj.term_id = item["term_id"] != DBNull.Value ? Convert.ToInt64(item["term_id"].ToString()) : 0;
                        obj.term_taxonomy_name = item["taxonomy"].ToString();

                        obj.term_main = new ExpandoObject();
                        obj.term_main.term_id = item["term_id"] != DBNull.Value ? Convert.ToInt64(item["term_id"].ToString()) : 0;
                        obj.term_main.name = item["name"].ToString();
                        obj.term_main.slug = item["slug"].ToString();
                        obj.term_main.description = item["description"].ToString();
                        obj.term_main.categories = !string.IsNullOrEmpty(item["categories"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(item["categories"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}");
                        obj.term_main.image = new
                        {
                            width = !string.IsNullOrEmpty(item["file_width"].ToString()) ? Convert.ToInt64(item["file_width"].ToString()) : 0,
                            height = !string.IsNullOrEmpty(item["file_height"].ToString()) ? Convert.ToInt64(item["file_height"].ToString()) : 0,
                            file = item["file_name"].ToString(),
                            filesize = !string.IsNullOrEmpty(item["file_size"].ToString()) ? Convert.ToDouble(item["file_size"].ToString()) : 0,
                        };
                        obj.child_categories = !string.IsNullOrEmpty(item["child_categories"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(item["child_categories"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
                    }
                    Dictionary<String, Object> row;
                    obj.products = new List<dynamic>();
                    foreach (DataRow dr in ds.Tables[1].Rows)
                    {
                        overall_count = dr["overall_count"] != DBNull.Value ? Convert.ToInt32(dr["overall_count"].ToString()) : 0;

                        row = new Dictionary<String, Object>();
                        row.Add("ID", dr["ID"]);
                        row.Add("post_name", dr["post_name"]);
                        row.Add("post_title", dr["post_title"]);
                        //Postmeta
                        row.Add("product_type", dr["product_type"]);
                        row.Add("yoast_title", dr["yoast_title"]);
                        row.Add("yoast_description", dr["yoast_description"]);
                        row.Add("sku", dr["sku"]);
                        row.Add("regular_price", dr["regular_price"]);
                        row.Add("sale_price", dr["sale_price"]);
                        row.Add("manage_stock", dr["_manage_stock"]);
                        row.Add("backorders", dr["_backorders"]);
                        row.Add("stock", dr["_stock"]);
                        row.Add("stock_status", dr["_stock_status"]);
                        row.Add("children", dr["_children"]);
                        row.Add("core_price", dr["core_price"]);
                        row.Add("weight", dr["weight"]);
                        row.Add("length", dr["length"]);
                        row.Add("width", dr["width"]);
                        row.Add("height", dr["height"]);
                        row.Add("tax_status", dr["tax_status"]);

                        if (dr["product_type"].ToString().Equals("variable"))
                        {
                            double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                            row.Add("price_range", new { min = parsed.Min(), max = parsed.Max() });
                            row.Add("price", string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max()));
                        }
                        else if (dr["product_type"].ToString().Equals("grouped"))
                        {
                            double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                            row.Add("price_range", new { min = parsed.Min(), max = parsed.Max() });
                            row.Add("price", string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max()));
                        }
                        else { row.Add("price", dr["price"]); }
                        row.Add("wholesale_details", "");

                        Dictionary<String, Object> img = new Dictionary<String, Object>();
                        string meta = dr["image"] != DBNull.Value ? dr["image"].ToString() : "{}";
                        JObject keyValues = JObject.Parse(meta);
                        if (keyValues.Count == 0)
                        {
                            img.Add("name", ""); img.Add("height", 0); img.Add("width", 0); img.Add("filesize", 0);
                        }
                        else
                        {
                            foreach (var item in keyValues)
                            {
                                if (item.Key.Equals("_file_name")) img.Add("name", dr["_file_name"]);
                                else if (item.Key.Equals("_file_height")) img.Add("height", dr["_file_height"]);
                                else if (item.Key.Equals("_file_width")) img.Add("width", dr["_file_width"]);
                                else if (item.Key.Equals("_file_size")) img.Add("filesize", dr["_file_size"]);
                            }
                        }
                        row.Add("image", img);
                        //row.Add("categories", !string.IsNullOrEmpty(dr["categories"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(dr["categories"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}"));
                        //row.Add("tags", !string.IsNullOrEmpty(dr["tags"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(dr["tags"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}"));
                        //if (!string.IsNullOrEmpty(dr["attributes"].ToString()))
                        //{
                        //    var _att = serializer.Deserialize(dr["attributes"].ToString());
                        //    row.Add("attributes", _att);
                        //}
                        obj.products.Add(row);
                    }
                    //pagination
                    obj.pagination = new ExpandoObject();
                    obj.pagination.item_count = overall_count;
                    obj.pagination.total_pages = Convert.ToInt32(Math.Ceiling((overall_count + 0.00) / flter.limit));
                    obj.pagination.per_page = flter.limit;
                    obj.pagination.page = flter.page;

                    return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = obj });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet, Route("product/{app_key}/{entity_id}")]
        public IHttpActionResult ProductDetails(string app_key, long entity_id, string slug = "")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "You are not authorized to access this page.");
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                    //return Content(HttpStatusCode.Unauthorized, "invalid app key.");
                }
                else if (string.IsNullOrEmpty(slug))
                {
                    return Ok(new { message = "Required query param 'slug'", status = 500, code = "Internal Server Error", data = new List<string>() });
                }
                else
                {
                    LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                    dynamic obj = new ExpandoObject();
                    //term_main
                    DataSet ds = CMSRepository.GetPageItems("products-detail", entity_id, string.Empty, slug, 0, 0);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            //Post
                            obj.ID = dr["ID"];
                            obj.post_name = dr["post_name"];
                            obj.post_title = dr["post_title"];
                            obj.post_content = dr["post_content"];
                            obj.post_excerpt = dr["post_excerpt"];
                            //
                            obj.product_type = dr["product_type"];
                            //Postmeta
                            obj.yoast_title = dr["yoast_title"];
                            obj.yoast_description = dr["yoast_description"];
                            obj.sku = dr["sku"];
                            obj.regular_price = dr["regular_price"];
                            obj.sale_price = dr["sale_price"];
                            obj.manage_stock = dr["manage_stock"];
                            obj.backorders = dr["backorders"];
                            obj.stock = dr["stock"];
                            obj.stock_status = dr["stock_status"];
                            obj.children = dr["children"];
                            obj.core_price = dr["core_price"];
                            obj.weight = dr["weight"];
                            obj.length = dr["length"];
                            obj.width = dr["width"];
                            obj.height = dr["height"];
                            obj.weight_unit = dr["weight_unit"];
                            obj.dimension_unit = dr["dimension_unit"];
                            obj.tax_status = dr["tax_status"];
                            if (dr["product_type"].ToString().Equals("variable"))
                            {
                                double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                                obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                                obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                            }
                            else if (dr["product_type"].ToString().Equals("grouped"))
                            {
                                double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                                obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                                obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                            }
                            else { obj.price = dr["price"]; }
                            obj.wholesale_details = "";
                            Dictionary<String, Object> img = new Dictionary<String, Object>();
                            string meta = dr["image"] != DBNull.Value ? dr["image"].ToString() : "{}";
                            JObject keyValues = JObject.Parse(meta);
                            if (keyValues.Count == 0)
                            {
                                obj.image = new { name = "", height = 0, width = 0, filesize = 0 };
                            }
                            else
                            {
                                obj.image = new { name = keyValues["_file_name"], height = keyValues["_file_height"], width = keyValues["_file_width"], filesize = keyValues["_file_size"] };
                            }

                            obj.galData = new List<dynamic>();
                            meta = dr["galData"] != DBNull.Value ? dr["galData"].ToString() : "[]";
                            //JArray jArray = JArray.Parse(meta);
                            //foreach (JToken jToken in jArray)
                            //{
                            //    obj.galData.Add(new { name = jToken["_file_name"], height = jToken["_file_height"], width = jToken["_file_width"], filesize = jToken["_file_size"] , thumbnail_name = jToken["_thumb_file_name"] , medium_name = jToken["_medium_file_name"] , large_name = jToken["_large_file_name"] });
                            //}

                            obj.categories = !string.IsNullOrEmpty(dr["categories"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(dr["categories"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
                            obj.tags = !string.IsNullOrEmpty(dr["tags"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(dr["tags"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
                            if (!string.IsNullOrEmpty(dr["attributes"].ToString()))
                            {
                                List<dynamic> _attributes = new List<dynamic>();
                                System.Collections.Hashtable _att = serializer.Deserialize(dr["attributes"].ToString()) as System.Collections.Hashtable;
                                foreach (System.Collections.DictionaryEntry att in _att)
                                {
                                    System.Collections.Hashtable _att_value = (System.Collections.Hashtable)att.Value;
                                    DataRow[] rows = ds.Tables[2].Select("attribute_name = '" + att.Key.ToString().Replace("pa_", "") + "'", "");
                                    if (_att_value["is_taxonomy"].ToString().Equals("1"))
                                    {
                                        if (rows.Length > 0) _attributes.Add(new { is_taxonomy = _att_value["is_taxonomy"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = rows[0]["attribute_label"], attribute_type = rows[0]["attribute_type"], option = (!string.IsNullOrEmpty(rows[0]["term"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(rows[0]["term"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]")) });
                                        else _attributes.Add(new { is_taxonomy = _att_value["is_taxonomy"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = new List<dynamic>() });
                                    }
                                    else
                                    {
                                        if (rows.Length > 0) _attributes.Add(new { is_taxonomy = 0, is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = (!string.IsNullOrEmpty(rows[0]["term"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(rows[0]["term"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]")) });
                                        else _attributes.Add(new { is_taxonomy = 0, is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = new List<dynamic>() });
                                    }
                                }
                                obj.attributes = _attributes;
                            }
                        }
                        if (obj.product_type == "variable")
                        {
                            obj.variations = new List<dynamic>();
                            foreach (DataRow dr in ds.Tables[1].Rows)
                            {
                                var vr = new
                                {
                                    ID = dr["ID"],
                                    post_name = dr["post_name"],
                                    post_title = dr["post_title"],
                                    product_type = dr["product_type"],
                                    //Postmeta
                                    sku = dr["sku"],
                                    price = dr["price"],
                                    regular_price = dr["regular_price"],
                                    sale_price = dr["sale_price"],
                                    manage_stock = dr["manage_stock"],
                                    backorders = dr["backorders"],
                                    stock = dr["stock"],
                                    stock_status = dr["stock_status"],
                                    core_price = dr["core_price"],
                                    weight = dr["weight"],
                                    length = dr["length"],
                                    width = dr["width"],
                                    height = dr["height"],
                                    tax_status = dr["tax_status"],
                                    image = new { name = dr["img"], height = 0, width = 0, filesize = 0 }
                                };
                                obj.variations.Add(vr);
                            }
                        }
                        return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = obj });
                    }
                    else
                        return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}