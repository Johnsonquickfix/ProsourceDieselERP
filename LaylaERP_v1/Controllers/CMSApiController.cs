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
    using System.Web;
    using System.Text;
    using System.Threading.Tasks;
    using LaylaERP.UTILITIES;
    using System.IO;

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
                                //row.Add("post_content", dr["post_content"]);
                                row.Add("post_content", !string.IsNullOrEmpty(dr["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(dr["post_content"].ToString())) : "");
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
                        //dynamic obj = new List<dynamic>();
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getpageapi(entity_id, app_key, post_status, per_page.ToString(), page.ToString(), sort, direction, "PLS", post_name);
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<PagesModel> ReviewList = new List<PagesModel>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                                PagesModel Review = new PagesModel();
                                var jsonArray = JArray.Parse(balResult.Rows[i]["bannerimg"].ToString());

                                if (jsonArray.Count == 1)
                                {
                                    var jsonObject = jsonArray[0] as JObject;
                                    if (jsonObject != null && jsonObject["json_data"] is JArray jsonData)
                                    {
                                        var bannerImages = jsonData
                                            .Select(item =>
                                            {
                                                var name = item.Value<string>("name");
                                                var height = item.Value<string>("height");
                                                var width = item.Value<string>("width");
                                                return new
                                                {
                                                    name,
                                                    height,
                                                    width
                                                };
                                            }).ToList();
                                        if (bannerImages.Count > 0)
                                            Review._bannerimage = bannerImages;
                                        else
                                            Review._bannerimage = new object[0];
                                        // Now, bannerImages should contain your data
                                    }
                                    else
                                    {
                                        Review._bannerimage = new object[0];
                                    }
                                }
                                else
                                    Review._bannerimage = "[]";

                                Review.id = balResult.Rows[i]["ID"].ToString();
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_content = !string.IsNullOrEmpty(balResult.Rows[i]["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(balResult.Rows[i]["post_content"].ToString())) : "";
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
                            //if (ReviewList.Count == 1)
                            //{
                            //    // return Json(ReviewList[0], JsonRequestBehavior.AllowGet);
                            //    return Ok(ReviewList[0]);
                            //}
                            //else
                            //{
                            // return Json(ReviewList, JsonRequestBehavior.AllowGet);
                            return Ok(ReviewList);
                            //}

                        }
                        else
                        {
                            //return Json("[]", JsonRequestBehavior.AllowGet);
                            return Ok(new object[0]);
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
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_content = !string.IsNullOrEmpty(balResult.Rows[i]["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(balResult.Rows[i]["post_content"].ToString())) : "";
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
                                long p_catecogy = Convert.ToInt64(balResult.Rows[i]["primary_category"].ToString());
                                List<Category> categoryHierarchy = BuildCategoryHierarchy(p_catecogy, balcategory, // Assuming this DataTable contains category data
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
                            //if (ReviewList.Count == 1)
                            //{
                            //    return Ok(ReviewList[0]);
                            //}
                            //else
                            //{
                            return Ok(ReviewList);
                            //}

                        }
                        else
                        {
                            return Ok(new object[0]);
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

        public List<Category> BuildCategoryHierarchy(long categoryId, DataTable categoryData, Dictionary<int, int> categoryIndexMap)
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
                bool primary = false;
                if (category_id == categoryId)
                    primary = true;
                //else
                // primary = false;
                Category category = new Category
                {
                    category_id = category_id,
                    //parent_id = parent_id,
                    name = name,
                    slug = slug,
                    primary = primary
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
                            row.Add("slug", balResult.Rows[i]["slug"]);
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
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_content = !string.IsNullOrEmpty(balResult.Rows[i]["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(balResult.Rows[i]["post_content"].ToString())) : "";
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
                else if (slug.ToString().ToLower().Equals("shop"))
                {
                    return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = new { term_id = 0, taxonomy = "shop", page_type = "product_filter" } });
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
                        obj.term_main.description = !string.IsNullOrEmpty(item["description"].ToString()) ? item["description"].ToString() : "";
                        obj.term_main.short_description = !string.IsNullOrEmpty(item["description"].ToString()) ? item["description"].ToString().Substring(0, 150) : "";
                        //obj.term_main.description = !string.IsNullOrEmpty(item["description"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(item["description"].ToString())) : "";
                        //obj.term_main.short_description = !string.IsNullOrEmpty(item["description"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(item["description"].ToString())).Substring(0, 150) : "";
                        obj.term_main.categories = !string.IsNullOrEmpty(item["categories"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(item["categories"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}");
                        obj.term_main.image = new
                        {
                            width = !string.IsNullOrEmpty(item["file_width"].ToString()) ? Convert.ToInt64(item["file_width"].ToString()) : 0,
                            height = !string.IsNullOrEmpty(item["file_height"].ToString()) ? Convert.ToInt64(item["file_height"].ToString()) : 0,
                            name = item["file_name"].ToString(),
                            filesize = !string.IsNullOrEmpty(item["file_size"].ToString()) ? Convert.ToDouble(item["file_size"].ToString()) : 0,
                        };
                        //obj.term_main.bannar = !string.IsNullOrEmpty(item["bannar"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(item["bannar"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}");
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
                            if (!string.IsNullOrEmpty(dr["description"].ToString())) row.Add("description", dr["description"].ToString());
                            //if (!string.IsNullOrEmpty(dr["description"].ToString())) row.Add("description", Encoding.UTF8.GetString(Encoding.Default.GetBytes(dr["description"].ToString())));
                            else row.Add("description", "");
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
                                    if (item.Key.Equals("_file_name")) img.Add("name", item.Value);
                                    else if (item.Key.Equals("_file_height")) img.Add("height", item.Value);
                                    else if (item.Key.Equals("_file_width")) img.Add("width", item.Value);
                                    else if (item.Key.Equals("_file_size")) img.Add("filesize", item.Value);
                                }
                            }
                            row.Add("image", img);
                            //if (dr["bannar"] != DBNull.Value)
                            //    row.Add("bannar", JsonConvert.DeserializeObject(dr["bannar"].ToString()));
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
                                    if (item.Key.Equals("_file_name")) img.Add("name", item.Value);
                                    else if (item.Key.Equals("_file_height")) img.Add("height", item.Value);
                                    else if (item.Key.Equals("_file_width")) img.Add("width", item.Value);
                                    else if (item.Key.Equals("_file_size")) img.Add("filesize", item.Value);
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
                        if (item.Key.Equals("_file_name")) img.Add("name", item.Value);
                        else if (item.Key.Equals("_file_height")) img.Add("height", item.Value);
                        else if (item.Key.Equals("_file_width")) img.Add("width", item.Value);
                        else if (item.Key.Equals("_file_size")) img.Add("filesize", item.Value);
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
                    System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                    long user_id = 0;
                    if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;

                    JObject original_o = JObject.FromObject(new { _sku = "", _price = "", _regular_price = "", _sale_price = "", _core_price = "", _manage_stock = "", _stock_status = "", _stock = "", _backorders = "", _weight = "", _height = "", _width = "", _length = "", _tax_status = "" });
                    dynamic obj = new ExpandoObject(); int overall_count = 0;
                    dynamic obj_filter = new ExpandoObject();
                    if (flter.taxonomy != null)
                    {
                        Dictionary<String, String> _meta = new Dictionary<String, String>();
                        if (flter.taxonomy.product_cat != null) _meta.Add("product_cat", string.Join(",", flter.taxonomy.product_cat));
                        if (flter.taxonomy.product_tag != null) _meta.Add("product_tag", string.Join(",", flter.taxonomy.product_tag));
                        if (flter.taxonomy.product_type != null) _meta.Add("product_type", string.Format("'{0}'", string.Join("','", flter.taxonomy.product_type)));
                        if (flter.taxonomy.pa_brand != null) _meta.Add("pa_brand", string.Format("'{0}'", string.Join("','", flter.taxonomy.pa_brand)));
                        if (flter.taxonomy.pa_engine != null) _meta.Add("pa_engine", string.Format("'{0}'", string.Join("','", flter.taxonomy.pa_engine)));
                        if (flter.taxonomy.pa_make != null) _meta.Add("pa_make", string.Format("'{0}'", string.Join("','", flter.taxonomy.pa_make)));
                        if (flter.taxonomy.pa_model != null) _meta.Add("pa_model", string.Format("'{0}'", string.Join("','", flter.taxonomy.pa_model)));
                        obj_filter.taxonomy = _meta;
                    }
                    if (flter.postmeta != null)
                    {
                        Dictionary<String, object> _meta = new Dictionary<String, object>();
                        if (flter.postmeta.stock_status != null) _meta.Add("_stock_status", string.Format("'{0}'", string.Join("','", flter.postmeta.stock_status)));
                        if (flter.postmeta.ratenreview_average_score != null) _meta.Add("_ratenreview_average_score", string.Format("'{0}'", string.Join("','", flter.postmeta.ratenreview_average_score)));
                        if (flter.postmeta.price != null) _meta.Add("_price", new { min = flter.postmeta.price.Min(), max = flter.postmeta.price.Max() });
                        obj_filter.postmeta = _meta;
                    }
                    if (flter.sort_by != null) obj_filter.sort_by = flter.sort_by;
                    obj.page_type = "product_filter";
                    DataSet ds = CMSRepository.GetPageItems("products-filter", entity_id, string.Empty, flter.taxonomy.cat_slug, JsonConvert.SerializeObject(obj_filter), flter.limit, flter.page, user_id);
                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        obj.term_id = item["term_id"] != DBNull.Value ? Convert.ToInt64(item["term_id"].ToString()) : 0;
                        obj.term_taxonomy_name = item["taxonomy"].ToString();

                        obj.term_main = new ExpandoObject();
                        obj.term_main.term_id = item["term_id"] != DBNull.Value ? Convert.ToInt64(item["term_id"].ToString()) : 0;
                        obj.term_main.name = item["name"].ToString();
                        obj.term_main.slug = item["slug"].ToString();
                        obj.term_main.description = item["description"].ToString();
                        obj.term_main.short_description = !string.IsNullOrEmpty(item["description"].ToString()) ? item["description"].ToString().Substring(0, 150) : "";
                        //obj.term_main.description = !string.IsNullOrEmpty(item["description"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(item["description"].ToString())) : "";
                        //obj.term_main.short_description = !string.IsNullOrEmpty(item["description"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(item["description"].ToString())).Substring(0, 150) : "";
                        obj.term_main.categories = !string.IsNullOrEmpty(item["categories"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(item["categories"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}");
                        obj.term_main.image = new
                        {
                            width = !string.IsNullOrEmpty(item["file_width"].ToString()) ? Convert.ToInt64(item["file_width"].ToString()) : 0,
                            height = !string.IsNullOrEmpty(item["file_height"].ToString()) ? Convert.ToInt64(item["file_height"].ToString()) : 0,
                            name = item["file_name"].ToString(),
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
                        row.Add("product_type", (dr["product_type"] != DBNull.Value ? dr["product_type"] : "simple"));
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
                        row.Add("total_review", dr["total_review"]);
                        row.Add("average_score", dr["average_score"]);
                        row.Add("brand", dr["brand"]);

                        if (dr["product_type"].ToString().Equals("variable"))
                        {
                            double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                            if (parsed.Length > 0)
                            {
                                row.Add("price_range", new { min = parsed.Min(), max = parsed.Max() });
                                if (parsed.Min() != parsed.Max()) row.Add("price", string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max()));
                                else row.Add("price", string.Format("${0:0.00}", parsed.Min()));
                            }
                            else
                            { row.Add("price_range", new { min = 0, max = 0 }); row.Add("price", string.Format("${0:0.00} - ${1:0.00}", 0, 0)); }
                        }
                        else if (dr["product_type"].ToString().Equals("grouped"))
                        {
                            double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                            if (parsed.Length > 0)
                            {
                                row.Add("price_range", new { min = parsed.Min(), max = parsed.Max() });
                                if (parsed.Min() != parsed.Max()) row.Add("price", string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max()));
                                else row.Add("price", string.Format("${0:0.00}", parsed.Min()));
                            }
                            else
                            { row.Add("price_range", new { min = 0, max = 0 }); row.Add("price", string.Format("${0:0.00} - ${1:0.00}", 0, 0)); }
                        }
                        else
                        {
                            decimal _price = dr["price"] != DBNull.Value ? Convert.ToDecimal(dr["price"]) : 0;
                            row.Add("price", _price);
                            // Get wholesale details by product_id, user_id
                            decimal _wholesale_discount = dr["wholesale_price"] != DBNull.Value ? Convert.ToDecimal(dr["wholesale_price"]) : 0;
                            List<dynamic> _wholesale_range = new List<dynamic>();
                            if (_wholesale_discount > 0)
                            {
                                row.Add("wholesale", new { price = _wholesale_discount });
                            }
                            else
                            {
                                _wholesale_discount = dr["cat_wholesale_discount"] != DBNull.Value ? Convert.ToDecimal(dr["cat_wholesale_discount"]) : 0;
                                if (_wholesale_discount > 0 && _price > 0)
                                {
                                    row.Add("wholesale", new { price = _price - (_price * _wholesale_discount) / 100 });
                                }
                            }
                        }
                        //row.Add("wholesale_details", "");

                        Dictionary<String, Object> img = new Dictionary<String, Object>();
                        string meta = dr["image"] != DBNull.Value ? dr["image"].ToString() : "{}";
                        JObject keyValues = JObject.Parse(meta);
                        if (keyValues.Count == 0)
                        {
                            row.Add("image", new { name = "", height = 0, width = 0, filesize = 0 });
                        }
                        else
                        {
                            row.Add("image", new { name = keyValues["_file_name"], height = keyValues["_file_height"], width = keyValues["_file_width"], filesize = keyValues["_file_size"] });
                        }
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
        [HttpGet, Route("products/filter-tag/{app_key}/{entity_id}")]
        public IHttpActionResult ProductsFilterTags(string app_key, long entity_id, string slug = "")
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
                    System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                    long user_id = 0;
                    if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;

                    LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                    dynamic obj = new List<dynamic>();
                    //term_main
                    DataSet ds = CMSRepository.GetPageItems("filter-schema", entity_id, string.Empty, slug, 0, 0, user_id);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            obj.Add(new
                            {
                                name = dr["name"],
                                title = dr["title"],
                                type = dr["type"],
                                items = dr["items"] != DBNull.Value ? JsonConvert.DeserializeObject<List<dynamic>>(dr["items"].ToString()) : new List<dynamic>()
                            });
                            //obj.name = dr["name"];
                            //obj.title = dr["title"];
                            //obj.type = dr["type"];
                            //obj.items = dr["items"] != DBNull.Value ? JsonConvert.DeserializeObject<List<dynamic>>(dr["items"].ToString()) : new List<dynamic>();
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
        [HttpGet, Route("product/{app_key}/{entity_id}")]
        public async Task<IHttpActionResult> ProductDetails(string app_key, long entity_id, string slug = "")
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
                    System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                    long user_id = 0; string session_id = string.Empty, email = string.Empty;
                    if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                    if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                    if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();

                    LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                    dynamic obj = new ExpandoObject();
                    List<string> _categories = new List<string>();
                    System.Collections.ArrayList _child = new System.Collections.ArrayList();
                    //term_main
                    DataSet ds = CMSRepository.GetPageItems("products-detail", entity_id, string.Empty, slug, 0, 0, user_id);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            //Post
                            obj.ID = dr["ID"];
                            obj.post_name = dr["post_name"];
                            obj.post_title = dr["post_title"];
                            //obj.post_content = !string.IsNullOrEmpty(dr["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(dr["post_content"].ToString())) : "";
                            obj.post_content = dr["post_content"];
                            obj.post_excerpt = dr["post_excerpt"];
                            //
                            obj.product_type = dr["product_type"] != DBNull.Value ? dr["product_type"] : "simple";
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
                            obj.total_review = dr["total_review"];
                            obj.average_score = dr["average_score"];
                            if (dr["product_type"].ToString().Equals("variable"))
                            {
                                double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                                obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                                obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                            }
                            else if (dr["product_type"].ToString().Equals("grouped"))
                            {
                                _child = serializer.Deserialize(dr["children"].ToString()) as System.Collections.ArrayList;
                                double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                                if (parsed.Length > 0)
                                {
                                    obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                                    obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                                }
                                else obj.price = 0;
                            }
                            else
                            {
                                decimal _price = dr["price"] != DBNull.Value ? (!string.IsNullOrEmpty(dr["price"].ToString()) ? Convert.ToDecimal(dr["price"]) : 0) : 0;
                                obj.price = _price;
                                // Get wholesale details by product_id, user_id
                                decimal _wholesale_discount = dr["wholesale_price"] != DBNull.Value ? Convert.ToDecimal(dr["wholesale_price"]) : 0;
                                List<dynamic> _wholesale_range = new List<dynamic>();
                                if (_wholesale_discount > 0)
                                {
                                    System.Collections.IEnumerable _att = serializer.Deserialize(dr["wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                    foreach (System.Collections.Hashtable _r in _att)
                                    {
                                        if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                        {
                                            int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                            decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                            _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                        }
                                    }
                                    obj.wholesale = new { price = _wholesale_discount, range = _wholesale_range };
                                }
                                else
                                {
                                    _wholesale_discount = dr["cat_wholesale_discount"] != DBNull.Value ? Convert.ToDecimal(dr["cat_wholesale_discount"]) : 0;
                                    if (_wholesale_discount > 0 && _price > 0)
                                    {
                                        System.Collections.IEnumerable _att = serializer.Deserialize(dr["cat_wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                        foreach (System.Collections.Hashtable _r in _att)
                                        {
                                            if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                            {
                                                int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                                decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                                _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                            }
                                        }
                                        obj.wholesale = new { price = _price - (_price * _wholesale_discount) / 100, range = _wholesale_range };
                                    }
                                }
                            }
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

                            obj.galData = dr["galData"] != DBNull.Value ? JsonConvert.DeserializeObject<List<dynamic>>(dr["galData"].ToString()) : new List<dynamic>();
                            obj.categories = !string.IsNullOrEmpty(dr["categories"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(dr["categories"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
                            _categories = !string.IsNullOrEmpty(dr["product_cat"].ToString()) ? JsonConvert.DeserializeObject<List<string>>(dr["product_cat"].ToString()) : JsonConvert.DeserializeObject<List<string>>("[]");
                            obj.tags = !string.IsNullOrEmpty(dr["tags"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(dr["tags"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
                            if (!string.IsNullOrEmpty(dr["attributes"].ToString()))
                            {
                                List<dynamic> _attributes = new List<dynamic>();
                                System.Collections.Hashtable _att = serializer.Deserialize(dr["attributes"].ToString()) as System.Collections.Hashtable;

                                if (_att != null)
                                {
                                    foreach (System.Collections.DictionaryEntry att in _att)
                                    {
                                        System.Collections.Hashtable _att_value = (System.Collections.Hashtable)att.Value;
                                        DataRow[] rows = ds.Tables[2].Select("attribute_name = '" + att.Key.ToString().Replace("pa_", "") + "'", "");
                                        if (_att_value["is_taxonomy"].ToString().Equals("1"))
                                        {
                                            if (rows.Length > 0) _attributes.Add(new { position = _att_value["position"], is_visible = _att_value["is_visible"], is_taxonomy = _att_value["is_taxonomy"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = rows[0]["attribute_label"], attribute_type = rows[0]["attribute_type"], option = (!string.IsNullOrEmpty(rows[0]["term"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(rows[0]["term"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]")) });
                                            else _attributes.Add(new { position = _att_value["position"], is_visible = _att_value["is_visible"], is_taxonomy = _att_value["is_taxonomy"], is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = new List<dynamic>() });
                                        }
                                        else
                                        {
                                            var _option = new List<dynamic>();
                                            var _o = _att_value["value"].ToString().Split('|');
                                            foreach (var s in _o) { _option.Add(new { term_id = 0, name = s.Trim(), slug = s.Trim() }); };
                                            _attributes.Add(new { position = _att_value["position"], is_visible = _att_value["is_visible"], is_taxonomy = 0, is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = _option });
                                        }
                                    }
                                }
                                obj.attributes = _attributes;
                            }
                            obj.brand = dr["brand"];
                            obj.technical_document = dr["technical_document"] != DBNull.Value ? JsonConvert.DeserializeObject<List<dynamic>>(dr["technical_document"].ToString()) : new List<dynamic>();
                        }
                        obj.vehicle_fitment = ds.Tables[3];
                        if (obj.product_type != null)
                        {
                            if (obj.product_type == "variable")
                            {
                                obj.variations = new List<dynamic>();
                                foreach (DataRow dr in ds.Tables[1].Rows)
                                {
                                    decimal _price = dr["price"] != DBNull.Value ? (!string.IsNullOrEmpty(dr["price"].ToString()) ? Convert.ToDecimal(dr["price"]) : 0) : 0;
                                    // Get wholesale details by product_id, user_id
                                    decimal _wholesale_discount = dr["wholesale_price"] != DBNull.Value ? (!string.IsNullOrEmpty(dr["wholesale_price"].ToString()) ? Convert.ToDecimal(dr["wholesale_price"]) : 0) : 0;
                                    List<dynamic> _wholesale_range = new List<dynamic>();
                                    if (_wholesale_discount > 0)
                                    {
                                        System.Collections.IEnumerable _att = serializer.Deserialize(dr["wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                        foreach (System.Collections.Hashtable _r in _att)
                                        {
                                            if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                            {
                                                int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                                decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                                _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                            }
                                        }
                                        obj.wholesale = new { price = _wholesale_discount, range = _wholesale_range };
                                    }
                                    else
                                    {
                                        _wholesale_discount = dr["cat_wholesale_discount"] != DBNull.Value ? Convert.ToDecimal(dr["cat_wholesale_discount"]) : 0;
                                        if (_wholesale_discount > 0 && _price > 0)
                                        {
                                            System.Collections.IEnumerable _att = serializer.Deserialize(dr["cat_wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                            foreach (System.Collections.Hashtable _r in _att)
                                            {
                                                if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                                {
                                                    int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                                    decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                                    _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                                }
                                            }
                                            obj.wholesale = new { price = _price - (_price * _wholesale_discount) / 100, range = _wholesale_range };
                                        }
                                    }

                                    var vr = new
                                    {
                                        ID = dr["ID"],
                                        post_name = dr["post_name"],
                                        post_title = dr["post_title"],
                                        product_type = dr["product_type"],
                                        //Postmeta
                                        sku = dr["sku"],
                                        price = dr["price"],
                                        wholesale = new { price = _wholesale_discount },
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
                                        image = new { name = dr["img"], height = 0, width = 0, filesize = 0 },
                                        attributes = !string.IsNullOrEmpty(dr["attributes"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(dr["attributes"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}")
                                    };
                                    obj.variations.Add(vr);
                                }
                            }
                            else if (obj.product_type == "grouped")
                            {
                                obj.children = new List<dynamic>();
                                foreach (var child in _child)
                                {
                                    dynamic _o = GetGroupProductDetails(entity_id, Convert.ToInt64(child.ToString()), user_id);
                                    if (_o != null) obj.children.Add(_o);
                                }
                            }
                        }
                        ///Push to klavio
                        if (!string.IsNullOrEmpty(email))
                        {
                            clsKlaviyoData klaviyoData = new clsKlaviyoData();
                            klaviyoData.data = new clsKlaviyoData.clsPodiumEvent() { type = "event", attributes = new Dictionary<string, object>() };
                            //"Started Checkout", "johnson.quickfix@gmail.com"
                            var _metric = new { data = new { type = "metric", attributes = new { name = "Viewed Product" } } };
                            var _profile = new { data = new { type = "profile", attributes = new { email = email } } };
                            var _properties = new Dictionary<string, object>();
                            _properties.Add("$use_ip", true); _properties.Add("$is_session_activity", true);
                            _properties.Add("title", obj.post_title);
                            _properties.Add("ItemId", obj.ID);
                            _properties.Add("productID", obj.ID);
                            _properties.Add("variantId", obj.ID);
                            _properties.Add("categories", _categories);
                            _properties.Add("imageUrl", obj.image.name);
                            _properties.Add("url", obj.post_name);
                            _properties.Add("metadata", new { price = obj.price });
                            //_properties.Add("$service", "erp-woocommerce");
                            var _attributes = new { properties = _properties, metric = _metric, profile = _profile };
                            klaviyoData.data.attributes.Add("properties", _properties);
                            klaviyoData.data.attributes.Add("metric", _metric);
                            klaviyoData.data.attributes.Add("profile", _profile);
                            await LaylaERP.UTILITIES.clsKlaviyo.TrackProfileActivity(klaviyoData);
                        }
                        //await TrackStartedCheckout(email, obj);
                        //Request.Headers.Add("Content-Type", "application/json; charset=utf-8");
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
        public static dynamic GetGroupProductDetails(long entity_id, long id, long user_id = 0)
        {
            dynamic obj = new ExpandoObject();
            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataSet ds = CMSRepository.GetProductDetails("products-detail", entity_id, id, user_id);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        //Post
                        obj.ID = dr["ID"];
                        obj.post_name = dr["post_name"];
                        obj.post_title = dr["post_title"];
                        //obj.post_content = !string.IsNullOrEmpty(dr["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(dr["post_content"].ToString())) : "";
                        //obj.post_excerpt = dr["post_excerpt"];
                        obj.product_type = dr["product_type"] != DBNull.Value ? dr["product_type"] : "simple";
                        //Postmeta
                        //obj.yoast_title = dr["yoast_title"];
                        //obj.yoast_description = dr["yoast_description"];
                        obj.sku = dr["sku"];
                        obj.regular_price = dr["regular_price"];
                        obj.sale_price = dr["sale_price"];
                        obj.manage_stock = dr["manage_stock"];
                        obj.backorders = dr["backorders"];
                        obj.stock = dr["stock"];
                        obj.stock_status = dr["stock_status"];
                        //obj.children = dr["children"];
                        //obj.core_price = dr["core_price"];
                        //obj.weight = dr["weight"];
                        //obj.length = dr["length"];
                        //obj.width = dr["width"];
                        //obj.height = dr["height"];
                        //obj.weight_unit = dr["weight_unit"];
                        //obj.dimension_unit = dr["dimension_unit"];
                        //obj.tax_status = dr["tax_status"];
                        //obj.total_review = dr["total_review"];
                        //obj.average_score = dr["average_score"];
                        if (dr["product_type"].ToString().Equals("variable"))
                        {
                            double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                            obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                            obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                        }
                        else
                        {
                            decimal _price = dr["price"] != DBNull.Value ? Convert.ToDecimal(dr["price"]) : 0;
                            obj.price = _price;
                            // Get wholesale details by product_id, user_id
                            decimal _wholesale_discount = dr["wholesale_price"] != DBNull.Value ? Convert.ToDecimal(dr["wholesale_price"]) : 0;
                            List<dynamic> _wholesale_range = new List<dynamic>();
                            if (_wholesale_discount > 0)
                            {
                                System.Collections.IEnumerable _att = serializer.Deserialize(dr["wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                foreach (System.Collections.Hashtable _r in _att)
                                {
                                    if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                    {
                                        int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                        decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                        _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                    }
                                }
                                obj.wholesale = new { price = _wholesale_discount, range = _wholesale_range };
                            }
                            else
                            {
                                _wholesale_discount = dr["cat_wholesale_discount"] != DBNull.Value ? Convert.ToDecimal(dr["cat_wholesale_discount"]) : 0;
                                if (_wholesale_discount > 0 && _price > 0)
                                {
                                    System.Collections.IEnumerable _att = serializer.Deserialize(dr["cat_wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                    foreach (System.Collections.Hashtable _r in _att)
                                    {
                                        if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                        {
                                            int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                            decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                            _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                        }
                                    }
                                    obj.wholesale = new { price = _price - (_price * _wholesale_discount) / 100, range = _wholesale_range };
                                }
                            }
                        }
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

                        obj.galData = dr["galData"] != DBNull.Value ? JsonConvert.DeserializeObject<List<dynamic>>(dr["galData"].ToString()) : new List<dynamic>();
                        //obj.categories = !string.IsNullOrEmpty(dr["categories"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(dr["categories"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
                        //obj.tags = !string.IsNullOrEmpty(dr["tags"].ToString()) ? JsonConvert.DeserializeObject<List<dynamic>>(dr["tags"].ToString()) : JsonConvert.DeserializeObject<List<dynamic>>("[]");
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
                                    var _option = new List<dynamic>();
                                    var _o = _att_value["value"].ToString().Split('|');
                                    foreach (var s in _o) { _option.Add(new { term_id = 0, name = s.Trim(), slug = s.Trim() }); };
                                    _attributes.Add(new { is_taxonomy = 0, is_variation = _att_value["is_variation"], taxonomy_name = att.Key, display_name = _att_value["name"], attribute_type = "select", option = _option });
                                }
                            }
                            obj.attributes = _attributes;
                        }
                        obj.brand = dr["brand"];
                    }
                    //obj.vehicle_fitment = ds.Tables[3];
                    if (obj.product_type != null)
                    {
                        if (obj.product_type == "variable")
                        {
                            obj.variations = new List<dynamic>();
                            foreach (DataRow dr in ds.Tables[1].Rows)
                            {
                                decimal _price = dr["price"] != DBNull.Value ? Convert.ToDecimal(dr["price"]) : 0;
                                // Get wholesale details by product_id, user_id
                                decimal _wholesale_discount = dr["wholesale_price"] != DBNull.Value ? Convert.ToDecimal(dr["wholesale_price"]) : 0;
                                List<dynamic> _wholesale_range = new List<dynamic>();
                                if (_wholesale_discount > 0)
                                {
                                    System.Collections.IEnumerable _att = serializer.Deserialize(dr["wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                    foreach (System.Collections.Hashtable _r in _att)
                                    {
                                        if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                        {
                                            int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                            decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                            _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                        }
                                    }
                                    obj.wholesale = new { price = _wholesale_discount, range = _wholesale_range };
                                }
                                else
                                {
                                    _wholesale_discount = dr["cat_wholesale_discount"] != DBNull.Value ? Convert.ToDecimal(dr["cat_wholesale_discount"]) : 0;
                                    if (_wholesale_discount > 0 && _price > 0)
                                    {
                                        System.Collections.IEnumerable _att = serializer.Deserialize(dr["cat_wholesale_rule_mapping"].ToString()) as System.Collections.IEnumerable;
                                        foreach (System.Collections.Hashtable _r in _att)
                                        {
                                            if (_r["wholesale-role"].ToString().ToLower() == dr["wholesale_role"].ToString().ToLower())
                                            {
                                                int _start_qty = _r["start-qty"] != DBNull.Value ? Convert.ToInt32(_r["start-qty"].ToString()) : 0, _end_qty = !string.IsNullOrEmpty(_r["end-qty"].ToString()) ? Convert.ToInt32(_r["end-qty"].ToString()) : 0;
                                                decimal _wholesale_discount_range = _r["wholesale-discount"] != DBNull.Value ? Convert.ToDecimal(_r["wholesale-discount"].ToString()) : 0;
                                                _wholesale_range.Add(new { start_qty = _start_qty, end_qty = _end_qty, price = _price - (_price * _wholesale_discount_range) / 100 });
                                            }
                                        }
                                        obj.wholesale = new { price = _price - (_price * _wholesale_discount) / 100, range = _wholesale_range };
                                    }
                                }

                                var vr = new
                                {
                                    ID = dr["ID"],
                                    //post_name = dr["post_name"],
                                    post_title = dr["post_title"],
                                    product_type = dr["product_type"],
                                    //Postmeta
                                    sku = dr["sku"],
                                    price = dr["price"],
                                    wholesale = new { price = _wholesale_discount },
                                    regular_price = dr["regular_price"],
                                    sale_price = dr["sale_price"],
                                    manage_stock = dr["manage_stock"],
                                    backorders = dr["backorders"],
                                    stock = dr["stock"],
                                    stock_status = dr["stock_status"],
                                    core_price = dr["core_price"],
                                    //weight = dr["weight"],
                                    //length = dr["length"],
                                    //width = dr["width"],
                                    //height = dr["height"],
                                    //tax_status = dr["tax_status"],
                                    image = new { name = dr["img"], height = 0, width = 0, filesize = 0 },
                                    attributes = !string.IsNullOrEmpty(dr["attributes"].ToString()) ? JsonConvert.DeserializeObject<dynamic>(dr["attributes"].ToString()) : JsonConvert.DeserializeObject<dynamic>("{}")
                                };
                                obj.variations.Add(vr);
                            }
                        }
                    }
                }
            }
            catch { }//(Exception ex) { return ex; }
            return obj;
        }

        [HttpGet, Route("topsell/{app_key}/{entity_id}")]
        public IHttpActionResult ProductTopSell(string app_key, long entity_id)
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
                else
                {
                    dynamic obj = new List<dynamic>();
                    DataSet ds = CMSRepository.GetPageItems("topsell-products", entity_id, string.Empty, string.Empty, 0, 0);
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            obj.Add(new
                            {
                                term_id = dr["term_id"],
                                name = dr["name"],
                                slug = dr["slug"],
                                products = dr["products"] != DBNull.Value ? JsonConvert.DeserializeObject<List<dynamic>>(dr["products"].ToString()) : new List<dynamic>()
                            });
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
        [HttpGet, Route("brand/{app_key}/{entity_id}")]
        public IHttpActionResult ProductBrand(string app_key, long entity_id, long parent_id = 0)
        {
            try
            {
                if (parent_id == 0) parent_id = 70263;
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
                else
                {
                    dynamic obj = new List<dynamic>();
                    IDictionary<string, List<dynamic>> pairs = new Dictionary<string, List<dynamic>>();
                    DataTable dt = CMSRepository.GetMenuItems("brand", entity_id, 0, parent_id);
                    if (dt.Rows.Count > 0)
                    {
                        for (char letter = 'A'; letter <= 'Z'; letter++)
                        {
                            pairs.Add(letter.ToString(), new List<dynamic>());
                        }
                        foreach (DataRow dr in dt.Rows)
                        {
                            string _key = dr["name"].ToString().ToUpper().Substring(0, 1);
                            if (pairs.ContainsKey(_key))
                            {
                                pairs[_key].Add(new
                                {
                                    term_id = dr["term_id"],
                                    parent = dr["parent"],
                                    count = dr["count"],
                                    name = dr["name"],
                                    slug = dr["slug"],
                                    image = new { name = dr["img"], height = 0, width = 0, filesize = 0 }
                                });
                            }
                        }
                        return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = pairs });
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

        /// <summary>
        /// get category page (product_cat) or filter page (product_filter)
        /// </summary>
        /// <param name="app_key"></param>
        /// <param name="entity_id"></param>
        /// <param name="parent_cat"></param>
        /// <param name="slug"></param>
        /// <returns></returns>
        [HttpPost, Route("v1/category/{app_key}/{entity_id}")]
        public IHttpActionResult CategoryPageData(string app_key, ProductFilterRequest filter, long entity_id = 0, string parent_cat = "", string slug = "")
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (string.IsNullOrEmpty(slug)) return Ok(new { message = "Required query param 'slug'", status = 500, code = "SUCCESS", data = new List<string>() });
                //else if (slug.ToString().ToLower().Equals("shop")) return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = new { term_id = 0, taxonomy = "shop", page_type = "product_filter" } });
                else
                {
                    System.Net.Http.Headers.HttpRequestHeaders headers = this.Request.Headers;
                    long user_id = 0; string session_id = string.Empty, email = string.Empty;
                    if (headers.Contains("X-User-Id")) user_id = !string.IsNullOrEmpty(headers.GetValues("X-User-Id").First()) ? Convert.ToInt64(headers.GetValues("X-User-Id").First()) : 0;
                    if (headers.Contains("X-Cart-Session-Id")) session_id = headers.GetValues("X-Cart-Session-Id").First();
                    if (headers.Contains("X-email")) email = headers.GetValues("X-email").First();

                    dynamic obj = new ExpandoObject();
                    string page_type = string.Empty;
                    if (slug.ToString().ToLower().Equals("shop")) page_type = "product_filter";
                    else
                    {
                        DataSet ds = CMSRepository.GetPageItems("slug-type", entity_id, parent_cat, slug);
                        foreach (DataRow item in ds.Tables[0].Rows) page_type = item["page_type"].ToString().Trim();
                    }
                    if (page_type == "product_cat") { return PageItems(app_key, entity_id, parent_cat, slug); }
                    else if (page_type == "product_filter")
                    {
                        if (filter == null) filter = new ProductFilterRequest();
                        //ProductFilterRequest filter = new ProductFilterRequest() { taxonomy = { cat_slug = slug }, sort_by = "title-asc", limit = 24, page = 1 };
                        //ProductFilterRequest filter = new ProductFilterRequest();
                        if (filter.taxonomy == null)
                        {
                            filter.taxonomy = new ProductTaxonomyRequest() { cat_slug = slug };
                            //filter.sort_by = "title-asc"; filter.limit = 24; filter.page = 1;
                        }
                        else if (string.IsNullOrEmpty(filter.taxonomy.cat_slug))
                        {
                            filter.taxonomy.cat_slug = slug;
                            //filter.taxonomy = new ProductTaxonomyRequest() { cat_slug = slug };
                            //filter.sort_by = "title-asc"; filter.limit = 24; filter.page = 1;
                        }
                        return ProductsFilter(app_key, entity_id, filter);
                    }
                    else return Ok(new { message = "Invalid data.", status = 500, code = "FAIL", data = new { } });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("v1/menus/{app_key}/{entity_id}")]
        public IHttpActionResult GetMenu(string app_key, long entity_id = 0, long menu_term_id = 0)
        {
            try
            {
                //VehicleFitment();
                if (entity_id == 1) menu_term_id = 61873;
                if (string.IsNullOrEmpty(app_key) || entity_id == 0) return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65") return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                else if (menu_term_id == 0) return Ok(new { message = "Menu term id required", status = 500, code = "SUCCESS", data = new List<string>() });
                else
                {
                    string json = ReadJsonFile(AppContext.BaseDirectory, string.Format("manus_{0}", entity_id));
                    JArray records = JArray.Parse(json);
                    return Ok(new { message = "Menu items retrived successfully", status = 200, code = "SUCCESS", data = records });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("v1/topsell/{app_key}/{entity_id}")]
        public IHttpActionResult ProductTopSell_v1(string app_key, long entity_id)
        {
            try
            {
                if (string.IsNullOrEmpty(app_key) || entity_id == 0)
                {
                    return Ok(new { message = "You are not authorized to access this page.", status = 401, code = "Unauthorized", data = new List<string>() });
                }
                else if (app_key != "88B4A278-4A14-4A8E-A8C6-6A6463C46C65")
                {
                    return Ok(new { message = "invalid app key.", status = 401, code = "Unauthorized", data = new List<string>() });
                }
                else
                {
                    string json = ReadJsonFile(AppContext.BaseDirectory, string.Format("topsell_{0}", entity_id));
                    JArray records = JArray.Parse(json);
                    foreach (JToken pitem in records)
                    {
                        foreach (JToken item in pitem["products"])
                        {
                            var _type = item.SelectToken("product_type").Value<string>();
                            if (_type.Equals("variable"))
                            {
                                double[] parsed = Array.ConvertAll(item["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                                item["price"] = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                            }
                        }
                    }
                    //if (dr["product_type"].ToString().Equals("variable"))
                    //{
                    //    double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                    //    obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                    //    obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                    //}
                    //else if (dr["product_type"].ToString().Equals("grouped"))
                    //{
                    //    double[] parsed = Array.ConvertAll(dr["price"].ToString().Split(new[] { ',', }, StringSplitOptions.RemoveEmptyEntries), Double.Parse);
                    //    obj.price = string.Format("${0:0.00} - ${1:0.00}", parsed.Min(), parsed.Max());
                    //    obj.price_range = new { min = parsed.Min(), max = parsed.Max() };
                    //}
                    //else
                    //{
                    //    decimal _price = dr["price"] != DBNull.Value ? Convert.ToDecimal(dr["price"]) : 0;
                    //    obj.price = _price;
                    //}
                    if (records.Count > 0) return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = records });
                    else return Ok(new { message = "Not Found", status = 404, code = "Not Found", data = new { } });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public static string ReadJsonFile(string filePath, string fileName)
        {
            if (filePath is null) throw new ArgumentNullException(nameof(filePath));
            if (fileName is null) throw new ArgumentNullException(nameof(fileName));

            string appPath = string.Format(@"{0}json\{1}.json", filePath, fileName);
            return System.IO.File.ReadAllText(appPath, System.Text.Encoding.UTF8);
        }
        /// <summary>
        /// contact-us insert
        /// </summary>
        /// <param name="app_key"></param>
        /// <param name="entity_id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost, Route("contact-us/{app_key}/{entity_id}")]
        public IHttpActionResult cmscontactus(string app_key, long entity_id, dynamic model)
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
                else if (model == null)
                {
                    return Ok(new { message = "Required param 'name'", status = 500, code = "SUCCESS", data = new List<string>() });
                }
                else
                {
                    string json = JsonConvert.SerializeObject(model);

                    // Deserialize the JSON string into a dynamic object
                    dynamic dynamicData = JsonConvert.DeserializeObject(json);
                    // Now you can access the properties of dynamicData
                    string name = dynamicData.name;
                    string email = dynamicData.email;
                    string subject = dynamicData.subject;
                    string suggestions = dynamicData.suggestions;
                    DataTable dt = CMSRepository.cmscontactus(name, email, subject, suggestions, entity_id);

                    if (dt.Rows.Count > 0)
                    {
                        string fileName = "contactus.html";
                        string FilePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Templates"), fileName);
                        //string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\contactus.html";
                        StreamReader str = new StreamReader(FilePath);
                        string MailText = str.ReadToEnd();
                        str.Close();

                        //MailText = MailText.Replace("{email}", email);
                        MailText = MailText.Replace("{Name}", name);
                        //MailText = MailText.Replace("{referral_link}", obj.referral_link);
                        if (email != null)
                        {

                            string strTemp = MailText.Replace("{upn}", "1");
                            SendEmail.PushEmails("noreply", email, string.Empty, email, "Thanks for contacting us!", strTemp);
                            //SendEmail.PushEmails(recipient, subject, editorcontent, attachments);
                        }
                    }

                    if (dt.Rows.Count > 0)
                        return Ok(new { message = "Success", status = 200, code = "SUCCESS", data = dt.Rows[0]["id"].ToString() });
                    else
                        return Ok(new { message = "Invalid data.", status = 500, code = "FAIL", data = new { } });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet, Route("get-post-slug/{app_key}/{entity_id}")]
        public IHttpActionResult Getpostslug(string app_key, string entity_id, string post_name = "")
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
                        var balResult = CMSRepository.Getpageslugapi(entity_id, app_key, "PST", post_name);
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
                                Review.post_content = !string.IsNullOrEmpty(balResult.Rows[i]["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(balResult.Rows[i]["post_content"].ToString())) : "";
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
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
                                long p_catecogy = Convert.ToInt64(balResult.Rows[i]["primary_category"].ToString());
                                var balcategory = CMSRepository.Getcategory(balResult.Rows[i]["ID"].ToString());
                                List<Category> categoryHierarchy = BuildCategoryHierarchy(p_catecogy, balcategory, // Assuming this DataTable contains category data
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
                            return Ok(new object[0]);
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

        [HttpGet, Route("get-pages-slug/{app_key}/{entity_id}")]
        public IHttpActionResult Getpagesslug(string app_key, string entity_id, string post_name = "")
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
                        //dynamic obj = new List<dynamic>();
                        string msg = string.Empty;
                        var balResult = CMSRepository.Getpageapi(entity_id, app_key, "PLS", post_name);
                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<PagesModel> ReviewList = new List<PagesModel>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                                PagesModel Review = new PagesModel();
                                var jsonArray = JArray.Parse(balResult.Rows[i]["bannerimg"].ToString());

                                if (jsonArray.Count == 1)
                                {
                                    var jsonObject = jsonArray[0] as JObject;
                                    if (jsonObject != null && jsonObject["json_data"] is JArray jsonData)
                                    {
                                        var bannerImages = jsonData
                                            .Select(item =>
                                            {
                                                var name = item.Value<string>("name");
                                                var height = item.Value<string>("height");
                                                var width = item.Value<string>("width");
                                                return new
                                                {
                                                    name,
                                                    height,
                                                    width
                                                };
                                            }).ToList();
                                        if (bannerImages.Count > 0)
                                            Review._bannerimage = bannerImages;
                                        else
                                            Review._bannerimage = new object[0];
                                        // Now, bannerImages should contain your data
                                    }
                                    else
                                    {
                                        Review._bannerimage = new object[0];
                                    }
                                }
                                else
                                    Review._bannerimage = "[]";

                                Review.id = balResult.Rows[i]["ID"].ToString();
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_content = !string.IsNullOrEmpty(balResult.Rows[i]["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(balResult.Rows[i]["post_content"].ToString())) : "";
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
                            return Ok(new object[0]);
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

        [HttpGet, Route("get-post-category/{app_key}/{entity_id}")]
        public IHttpActionResult Getpostcategory(string app_key, string entity_id, int per_page = 10, int page = 0, string post_name = "", string post_status = "publish", string sort = "id", string direction = "desc")
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
                        var balResult = CMSRepository.Getpostcategory(entity_id, app_key, post_status, per_page.ToString(), page.ToString(), sort, direction, "PST", post_name);

                        int total = balResult.Rows.Count;
                        if (total > 0)
                        {
                            List<dynamic> ReviewList = new List<dynamic>();
                            for (int i = 0; i < balResult.Rows.Count; i++)
                            {
                                dynamic Review = new ExpandoObject();
                                //PostModel Review = new PostModel();
                                Review.id = balResult.Rows[i]["ID"].ToString();
                                Review.name = balResult.Rows[i]["name"].ToString();
                                Review.slug = balResult.Rows[i]["slug"].ToString();
                                ReviewList.Add(Review);
                            }
                            return Ok(ReviewList);
                        }
                        else
                        {
                            return Ok(new object[0]);
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


        [HttpGet, Route("get-category-post/{app_key}/{entity_id}")]
        public IHttpActionResult Getcategorywisepost(string app_key, string entity_id, int per_page = 10, int page = 0, string post_name = "", string post_status = "publish", string sort = "id", string direction = "desc")
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
                        var balResult = CMSRepository.Getcategorywisepost(entity_id, app_key, post_status, per_page.ToString(), page.ToString(), sort, direction, "PST", post_name);
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
                                //Review.post_content = balResult.Rows[i]["post_content"].ToString();
                                Review.post_content = !string.IsNullOrEmpty(balResult.Rows[i]["post_content"].ToString()) ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(balResult.Rows[i]["post_content"].ToString())) : "";
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
                                Review._yoast_wpseo_focuskw = balResult.Rows[i]["_yoast_wpseo_focuskw"].ToString();
                                Review._yoast_wpseo_metadesc = balResult.Rows[i]["_yoast_wpseo_metadesc"].ToString();
                                Review._yoast_wpseo_title = balResult.Rows[i]["_yoast_wpseo_title"].ToString();
                                Review._yoast_wpseo_keywordsynonyms = balResult.Rows[i]["_yoast_wpseo_keywordsynonyms"].ToString();
                                Review._yoast_wpseo_focuskeywords = balResult.Rows[i]["_yoast_wpseo_focuskeywords"].ToString();
                                Review.total = balResult.Rows[i]["total"].ToString();
                                //Review.star_distribution = JsonConvert.DeserializeObject(balResult.Rows[i]["star_distribution"].ToString());
                                var balcategory = CMSRepository.Getcategory(balResult.Rows[i]["ID"].ToString());
                                long p_catecogy = Convert.ToInt64(balResult.Rows[i]["primary_category"].ToString());
                                List<Category> categoryHierarchy = BuildCategoryHierarchy(p_catecogy, balcategory, // Assuming this DataTable contains category data
                                    categoryIndexMap);

                                // Review.categories = categoryHierarchy;
                                if (categoryHierarchy.Count == 1)
                                {
                                    Review.categories = new List<Category> { categoryHierarchy[0] };
                                }
                                else
                                {
                                    Review.categories = categoryHierarchy;
                                }

                                ReviewList.Add(Review);

                            }
                            return Ok(ReviewList);

                        }
                        else
                        {
                            return Ok(new object[0]);
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

        public static void VehicleFitment()
        {
            try
            {
                LaylaERP.UTILITIES.Serializer serializer = new LaylaERP.UTILITIES.Serializer();
                DataTable dt = LaylaERP.DAL.MYSQLHelper.ExecuteDataTable("SELECT p.id FROM wp_posts p WHERE id IN (98861) and p.post_type = 'product'");
                foreach (DataRow dr in dt.Rows)
                {
                    List<dynamic> _attributes = new List<dynamic>();
                    System.Collections.Hashtable _att = serializer.Deserialize(dr["meta_value"].ToString()) as System.Collections.Hashtable;

                }
            }
            catch (Exception ex) { }
        }
    }
}