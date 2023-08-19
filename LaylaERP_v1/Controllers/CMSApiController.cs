namespace LaylaERP_v1.Controllers
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
    using Newtonsoft.Json.Linq;

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
                                    file = balResult.Rows[i]["upload_ad_image"].ToString(),

                                };
                                OtherImageModel OtherImageModel = new OtherImageModel
                                {
                                    width = balResult.Rows[i]["fwidth"].ToString(),
                                    height = balResult.Rows[i]["fheight"].ToString(),
                                    file = balResult.Rows[i]["featured_image_url"].ToString(),

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
                                    file = balResult.Rows[i]["single_image_url"].ToString(),

                                };
                                OtherImageModel OtherImageModel = new OtherImageModel
                                {
                                    width = balResult.Rows[i]["fwidth"].ToString(),
                                    height = balResult.Rows[i]["fheight"].ToString(),
                                    file = balResult.Rows[i]["featured_image_url"].ToString(),

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
                        //return Json(ReviewList, JsonRequestBehavior.AllowGet); 
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
                                    file = balResult.Rows[i]["upload_ad_image"].ToString(),

                                };
                                OtherImageModel OtherImageModel = new OtherImageModel
                                {
                                    width = balResult.Rows[i]["fwidth"].ToString(),
                                    height = balResult.Rows[i]["fheight"].ToString(),
                                    file = balResult.Rows[i]["featured_image_url"].ToString(),

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
                            file = item["file_name"].ToString(),
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
                            img.Add("file_name", dr["file_name"]);
                            img.Add("file_height", dr["file_height"]);
                            img.Add("file_width", dr["file_width"]);
                            img.Add("file_size", dr["file_size"]);
                            row.Add("image", img);
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
                            Dictionary<String, Object>  img = new Dictionary<String, Object>();
                            img.Add("file_name", dr["file_name"]);
                            img.Add("file_height", dr["file_height"]);
                            img.Add("file_width", dr["file_width"]);
                            img.Add("file_size", dr["file_size"]);
                            row.Add("image", img);
                            obj.products.Add(row);
                        }
                    }
                    return Ok(new { message = "Successfull", status = 200, code = "SUCCESS", data = obj });
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
                img.Add("file_name", dr["file_name"]);
                img.Add("file_height", dr["file_height"]);
                img.Add("file_width", dr["file_width"]);
                img.Add("file_size", dr["file_size"]);
                row.Add("image", img);
                List<Dictionary<string, object>> list2 = GetSubCategory(DT, Convert.ToInt64(dr["term_id"]));
                row.Add("child_categories", list2);
                list.Add(row);
            }
            return list;
        }
    }
}