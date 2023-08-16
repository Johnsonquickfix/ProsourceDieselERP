﻿using LaylaERP.BAL;
using LaylaERP.DAL;
using LaylaERP.Models;
using LaylaERP.UTILITIES;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
 

namespace LaylaERP_v1.Controllers
{
    public class CMSController : Controller
    {
        // GET: CMS
        public ActionResult List()
        {
            return View();
        }
        public ActionResult Pages()
        {
            return View();
        }
        public ActionResult PostList()
        {
            return View();
        }
        public ActionResult Category()
        {
            return View();
        }
        public ActionResult Shortcode()
        {
            return View();
        }
        public ActionResult Blog()
        {
            return View();
        }
        public ActionResult AddBlog()
        {
            return View();
        }
        public ActionResult Page(int id)
        {
            SqlParameter[] parameters =
               {
                    new SqlParameter("@flag", "PLS"),
                    new SqlParameter("@id", id)

                };
            DataSet ds = SQLHelper.ExecuteDataSet("cms_pagelink_search", parameters);
             string FilePath = Path.Combine(Server.MapPath("~/Templates/Prosource.html"));
              StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();
            string strTemp = string.Empty, _body = string.Empty;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                strTemp = MailText; 
                _body = dr["post_content"] != DBNull.Value ? dr["post_content"].ToString().Trim() : ""; 
                strTemp = strTemp.Replace("{body}", _body); 
            }
            return View((object)strTemp);
        }

        public ActionResult BannerList()
        {

            //DataTable dt = SQLHelper.ExecuteDataTable("select meta_value from wp_postmeta where post_id = 134771 and meta_key = '_product_attributes'");
            //string att = dt.Rows[0]["meta_value"].ToString();
            //Serializer sr = new Serializer();
            //var fd = sr.Deserialize(att);
            //string f = sr.Serialize(dt.Rows[0]["meta_value"].ToString());
           
            //string[] numberStrings1 = ExtractNumbers(dt.Rows[0]["meta_value"].ToString());
            //string numbersString2 = string.Join(",", numberStrings1);
            //string numbersString = "51909,325019";

            //// Split the string into individual numbers
            //string[] numberStrings = numbersString.Split(',');

            //// Convert the numbers to the serialized format
            //List<string> serializedNumbers = new List<string>();
            //for (int i = 0; i < numberStrings.Length; i++)
            //{
            //    int number = int.Parse(numberStrings[i]);
            //    string serializedNumber = $"i:{i};s:{number.ToString().Length}:\"{number}\";";
            //    serializedNumbers.Add(serializedNumber);
            //}

            //// Construct the final serialized string
            //string serializedString = $"a:{numberStrings.Length}:{{{string.Join("", serializedNumbers)}}}";

            //string[] numberStrings1 = ExtractNumbers(serializedString);


            //// Combine the numbers into a comma-separated string
            //string numbersString2 = string.Join(",", numberStrings1);
            return View();
        }

        public ActionResult Post()
        {
            DataTable dt = new DataTable();
            // dt = BAL.ProductRepository.GetProductcategoriesList();
            string id = "";
            dt = CMSRepository.GetParentCategory(id);
            List<SelectListItem> usertype = new List<SelectListItem>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                usertype.Add(new SelectListItem
                {
                    Value = dt.Rows[i]["ID"].ToString(),
                    Text = space(Convert.ToInt32(dt.Rows[i]["level"])) + dt.Rows[i]["name"].ToString()

                });
            }
            ViewBag.product = usertype.Select(N => new SelectListItem { Text = N.Text, Value = N.Value.ToString() });
            return View();
            
        }
        public ActionResult Posts(int id)
        {
            SqlParameter[] parameters =
               {
                    new SqlParameter("@flag", "POS"),
                    new SqlParameter("@id", id)

                };
            DataSet ds = SQLHelper.ExecuteDataSet("cms_pagelink_search", parameters);
            string FilePath = Path.Combine(Server.MapPath("~/Templates/Prosource.html"));
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();
            string strTemp = string.Empty, _body = string.Empty;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                strTemp = MailText;
                _body = dr["post_content"] != DBNull.Value ? dr["post_content"].ToString().Trim() : "";
                strTemp = strTemp.Replace("{body}", _body);
            }
            return View((object)strTemp);
        }
        public string space(int noOfSpaces)
        {
            //try
            //{
            string returnValue = string.Empty;
            string space = "#";
            for (var index = 0; index < noOfSpaces; index++)
            {
                returnValue += space;
            }
            //}
            //catch { }
            return returnValue;
        }

        static string[] ExtractNumbers(string serializedString)
        {
            var matches = Regex.Matches(serializedString, @"""([^""]+)""");
            string[] numberStrings = new string[matches.Count];

            for (int i = 0; i < matches.Count; i++)
            {
                numberStrings[i] = matches[i].Groups[1].Value;
            }

            return numberStrings;
        }
        public ActionResult Banner()
        {
            return View();
        }

        public ActionResult Mediagallery()
        {
            return View();
        }
        public ActionResult AddMedia()
        {
            return View();
        }

        public ActionResult Banners(int id)
        {
            SqlParameter[] parameters =
               {
                    new SqlParameter("@flag", "banner"),
                    new SqlParameter("@id", id)

                };
            DataSet ds = SQLHelper.ExecuteDataSet("cms_pagelink_search", parameters);
            string FilePath = Path.Combine(Server.MapPath("~/Templates/Banner.html"));
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();
            string strTemp = string.Empty, _body = string.Empty;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                strTemp = MailText;
                _body = dr["post_content"] != DBNull.Value ? dr["post_content"].ToString().Trim() : "";
                strTemp = strTemp.Replace("{body}", _body);
            }
            return View((object)strTemp);
        }
        [HttpPost]
        public JsonResult GetCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = CMSRepository.GetCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult GetList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            { 
                DataTable dt = CMSRepository.GetList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented); 
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetDataByID(int ID)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CMSRepository.GetDataByID(ID);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult CreatePages(HttpPostedFileBase ImageFile, string ID, string post_title, string post_content, string entity_id, string SEO, string Content, HttpPostedFileBase FeaturedFile, string fcsskey, string seotitle, string metades, string slug, string keylist, string synlist, string parent_id, string template, string order, string gmtkeyword, string comment, string shortdic)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string featuerimg = "";
            string pathimage = "";
            string futherpathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
            string FeatuerFileExtension = "";
            //string encodedHtml = "%3Cp%3Ehi%20this%20is%26nbsp%3B%3C%2Fp%3E%0D%0A%3Cp%3Etest%3C%2Fp%3E%0D%0A%3Cp%3Eeditore%20save%3C%2Fp%3E";
            post_content = HttpUtility.UrlDecode(post_content);

            int fheight = 0;
            int fwidth = 0;
            int bheight = 0;
            int bwidth = 0;
            DataTable dt = CMSRepository.Getpages(Convert.ToInt32(ID), slug,Convert.ToInt32(entity_id));
            if (dt.Rows.Count == 0)
            {
                //string decodedHtml = HttpUtility.UrlDecode(post_content);
                if (ImageFile != null)
                {
                    using (Image image = Image.FromStream(ImageFile.InputStream, true, true))
                    {
                        // Get the height and width
                        bheight = image.Height;
                        bwidth = image.Width;
                    }

                    FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    FileExtension = Path.GetExtension(ImageFile.FileName);
                    // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                    if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                        FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;
                        string UploadPath = Path.Combine(Server.MapPath("~/Content/Pages/PageBannerLink"));
                        UploadPath = UploadPath + "\\";
                        pathimage = UploadPath + FileName;
                        // model.ImagePathOut = UploadPath + FileNamethumb;
                        if (FileName == "")
                        {
                            FileName = "default.png";
                        }
                        ImagePath = "~/Content/Pages/PageBannerLink/" + FileName;
                        //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                        ImageFile.SaveAs(pathimage);
                        if (FeaturedFile != null)
                        {
                            using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                            {
                                // Get the height and width
                                fheight = image.Height;
                                fwidth = image.Width;
                            }

                            featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                            featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                            FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                            featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                            string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Pages/Featured"));
                            FutcherUploadPath = FutcherUploadPath + "\\";
                            futherpathimage = FutcherUploadPath + featuerimg;
                            if (featuerimg == "")
                            {
                                featuerimg = "default.png";
                            }
                            FeaturedFile.SaveAs(futherpathimage);
                        }
                        else
                        {

                            featuerimg = "";
                        }

                        if (Convert.ToInt32(ID) > 0)
                        {
                            entity = CMSRepository.CreatePage("U", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, parent_id, template, order, gmtkeyword, comment, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                            if (entity > 0)
                            {
                                return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        }
                        else
                        {
                            entity = CMSRepository.CreatePage("I", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, parent_id, template, order, gmtkeyword, comment, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                            if (entity > 0)
                            {
                                return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                    }
                }
                else
                {
                    if (Convert.ToInt64(ID) == 0)
                    {
                        if (FeaturedFile != null)
                        {
                            using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                            {
                                // Get the height and width
                                fheight = image.Height;
                                fwidth = image.Width;
                            }
                            featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                            featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                            FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                            featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                            string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Pages/Featured"));
                            FutcherUploadPath = FutcherUploadPath + "\\";
                            futherpathimage = FutcherUploadPath + featuerimg;
                            if (featuerimg == "")
                            {
                                featuerimg = "default.png";
                            }
                            FeaturedFile.SaveAs(futherpathimage);
                        }
                        else
                        {

                            featuerimg = "";
                        }
                        entity = CMSRepository.CreatePage("I", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, parent_id, template, order, gmtkeyword, comment, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                    else
                    {
                        if (FeaturedFile != null)
                        {
                            using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                            {
                                // Get the height and width
                                fheight = image.Height;
                                fwidth = image.Width;
                            }

                            featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                            featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                            FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                            featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                            string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Pages/Featured"));
                            FutcherUploadPath = FutcherUploadPath + "\\";
                            futherpathimage = FutcherUploadPath + featuerimg;
                            if (featuerimg == "")
                            {
                                featuerimg = "default.png";
                            }
                            FeaturedFile.SaveAs(futherpathimage);
                            entity = CMSRepository.CreatePage("UF", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, parent_id, template, order, gmtkeyword, comment, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        }
                        else
                        {
                            entity = CMSRepository.CreatePage("UP", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, parent_id, template, order, gmtkeyword, comment, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        }
                        return Json(new { status = true, message = "Update successfully", url = "Pages" }, 0);
                    }
                }

            }
            else
            {
                return Json(new { status = false, message = "Slug must be unique", url = "" }, 0);
            } 
        }


        [HttpPost]
        public JsonResult GetBannerCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = CMSRepository.GetBannerCount();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult GetBannerList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = CMSRepository.GetBannerList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetBannerDataByID(int ID)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CMSRepository.GetBannerDataByID(ID);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult CreateBanner(HttpPostedFileBase ImageFile, string ID, string post_title, string bannerurl, string entity_id, string type,string btypeof, HttpPostedFileBase FeaturedFile, string menu_order)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string featuerimg = "";
            string pathimage = "";
            string futherpathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
            string FeatuerFileExtension = "";
            int height = 0;
            int width = 0;
            //string encodedHtml = "%3Cp%3Ehi%20this%20is%26nbsp%3B%3C%2Fp%3E%0D%0A%3Cp%3Etest%3C%2Fp%3E%0D%0A%3Cp%3Eeditore%20save%3C%2Fp%3E";
            bannerurl = HttpUtility.UrlDecode(bannerurl);
            string serializedString = "";
            if (!string.IsNullOrEmpty(type))
            {

                string numbersString = type;
                string[] numberStrings = numbersString.Split(',');

                // Convert the numbers to the serialized format
                List<string> serializedNumbers = new List<string>();
                for (int i = 0; i < numberStrings.Length; i++)
                {
                    if (numberStrings[i] != null || numberStrings[i] != "")
                    {
                        int number = int.Parse(numberStrings[i]);
                        string serializedNumber = $"i:{i};s:{number.ToString().Length}:\"{number}\";";
                        serializedNumbers.Add(serializedNumber);
                    }
                }

                // Construct the final serialized string
                serializedString = $"a:{numberStrings.Length}:{{{string.Join("", serializedNumbers)}}}";
            }
            //string decodedHtml = HttpUtility.UrlDecode(post_content);
            if (ImageFile != null)
            {
                FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                FileName = Regex.Replace(FileName, @"\s+", "");  
                string size = (ImageFile.ContentLength / 1024).ToString();
                FileExtension = Path.GetExtension(ImageFile.FileName); 
                // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                {
                    //FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                    FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;
                     string UploadPath = Path.Combine(Server.MapPath("~/Content/Banner/MobileBanner"));
                     UploadPath = UploadPath + "\\";
                    pathimage = UploadPath + FileName;
                    // model.ImagePathOut = UploadPath + FileNamethumb; 
                    if (FileName == "")
                    {
                        FileName = "default.png";
                    }
                    ImagePath = "~/Content/Banner/MobileBanner/" + FileName;
                    //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                    ImageFile.SaveAs(pathimage);

                    if (FeaturedFile != null)
                    {

                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            height = image.Height;
                            width = image.Width; 
                        }
                       featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Banner/Featured"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage); 
                    }
                    else
                    {

                        featuerimg = "";
                    }

                    if (Convert.ToInt32(ID) > 0)
                    {
                        entity = CMSRepository.CreateBanner("U", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString,  featuerimg, height.ToString(),width.ToString(), menu_order);
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                    else
                    {
                        entity = CMSRepository.CreateBanner("I", ID, post_title, bannerurl, FileName, entity_id,  btypeof, serializedString, featuerimg, height.ToString(), width.ToString(), menu_order);
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                }
                else
                {
                    return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                }
            }
            else
            {
                if (Convert.ToInt64(ID) == 0)
                {
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            height = image.Height;
                            width = image.Width;
                        }
                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Banner/Featured"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                    }
                    else
                    {

                        featuerimg = "";
                    }
                    entity = CMSRepository.CreateBanner("I", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString, featuerimg, height.ToString(), width.ToString(), menu_order);
                    if (entity > 0)
                    {
                        return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                } 
                else
                {
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            height = image.Height;
                            width = image.Width;
                        }
                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Banner/Featured"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                        entity = CMSRepository.CreateBanner("UF", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString, featuerimg, height.ToString(), width.ToString(), menu_order);
                    }
                    else
                    {
                        entity = CMSRepository.CreateBanner("UP", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString, featuerimg, height.ToString(), width.ToString(), menu_order);
                    }
                    return Json(new { status = true, message = "Update successfully", url = "Pages" }, 0);
                }
            }

        }

        public JsonResult GetpageData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CMSRepository.GetpageData(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetcategoryData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CMSRepository.GetcategoryData(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult GetPostCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = CMSRepository.GetPostCount();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

        [HttpGet]
        public JsonResult GetPostList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = CMSRepository.GetPostList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetPostDataByID(int ID)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CMSRepository.GetPostDataByID(ID);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        private void Add_term(string CategoryID, int ID)
        {            
            string CommaStr = CategoryID;
            if (!string.IsNullOrEmpty(CommaStr))
            {
                var myarray = CommaStr.Split(',');
                for (var i = 0; i < myarray.Length; i++)
                {
                    ProductRepository.Add_term(Convert.ToInt32(myarray[i]), ID);
                    ProductRepository.update_countinc(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));

                }
            }
        }

        private void update_term(string CategoryID, int ID)
        {
            update_countdes(CategoryID, ID);
            delete_term(CategoryID, ID); 
            string CommaStr = CategoryID;
            var myarray = CommaStr.Split(',');
            for (var i = 0; i < myarray.Length; i++)
            {
                if (string.IsNullOrEmpty(myarray[i]) || myarray[i] == "undefined" || myarray[i] == "")
                { }
                else
                {
                    ProductRepository.Add_term(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                    ProductRepository.update_countinc(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                }
            }
        }
        private void update_countdes(string CategoryID, long ID)
        {
            string CommaStr = new CMSRepository().GetCountforupdate(ID);

            var myarray = CommaStr.Split(',');

            for (var i = 0; i < myarray.Length; i++)
            {
                if (myarray[i] == "")
                {

                }
                else
                {
                    ProductRepository.update_count(Convert.ToInt32(myarray[i]), Convert.ToInt32(ID));
                }
            }
        }
        private void delete_term(string CategoryID, long ID)
        {
            ProductRepository.Edit_term(0, Convert.ToInt32(ID));           
        }

        public JsonResult CreatePost(HttpPostedFileBase ImageFile, string ID, string post_title, string post_content, string entity_id, string category, HttpPostedFileBase FeaturedFile, string fcsskey, string seotitle, string metades, string slug, string keylist, string synlist)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string featuerimg = "";
            string pathimage = "";
            string futherpathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
            string FeatuerFileExtension = "";
            //string encodedHtml = "%3Cp%3Ehi%20this%20is%26nbsp%3B%3C%2Fp%3E%0D%0A%3Cp%3Etest%3C%2Fp%3E%0D%0A%3Cp%3Eeditore%20save%3C%2Fp%3E";
            post_content = HttpUtility.UrlDecode(post_content);

            int fheight = 0;
            int fwidth = 0;
            int bheight = 0;
            int bwidth = 0;

            DataTable dt = CMSRepository.Getpost(Convert.ToInt32(ID), slug, Convert.ToInt32(entity_id));
            if (dt.Rows.Count == 0)
            {

                //string decodedHtml = HttpUtility.UrlDecode(post_content);
                if (ImageFile != null)
            {
                using (Image image = Image.FromStream(ImageFile.InputStream, true, true))
                {
                    // Get the height and width
                    bheight = image.Height;
                    bwidth = image.Width;
                }

                FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                FileName = Regex.Replace(FileName, @"\s+", "");  
                string size = (ImageFile.ContentLength / 1024).ToString();
                FileExtension = Path.GetExtension(ImageFile.FileName);

                // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                {
                    //FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                    FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

                    string UploadPath = Path.Combine(Server.MapPath("~/Content/Post/SingalImage"));

                    UploadPath = UploadPath + "\\";
                    pathimage = UploadPath + FileName;
                    // model.ImagePathOut = UploadPath + FileNamethumb;

                    if (FileName == "")
                    {
                        FileName = "default.png";
                    }
                    ImagePath = "~/Content/Post/SingalImage/" + FileName;
                    //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                    ImageFile.SaveAs(pathimage);

                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            fheight = image.Height;
                            fwidth = image.Width;
                        }

                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Post/Featured"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                    }
                    else
                    {

                        featuerimg = "";
                    }

                    if (Convert.ToInt32(ID) > 0)
                    {
                        entity = CMSRepository.CreatePost("U", ID, post_title, post_content, FileName, entity_id, category, featuerimg, fcsskey, seotitle, metades, slug, keylist,synlist, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        update_term(category, Convert.ToInt32(ID));
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                    else
                    {
                        entity = CMSRepository.CreatePost("I", ID, post_title, post_content, FileName, entity_id, category, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        Add_term(category, Convert.ToInt32(entity));
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                }
                else
                {
                    return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                }
            }
               else
            {
                if (Convert.ToInt64(ID) == 0)
                {
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            fheight = image.Height;
                            fwidth = image.Width;
                        }

                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Post/Featured"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                    }
                    else
                    {

                        featuerimg = "";
                    }

                    entity = CMSRepository.CreatePost("I", ID, post_title, post_content, FileName, entity_id, category, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                    Add_term(category, Convert.ToInt32(entity));
                    if (entity > 0)
                    {
                        return Json(new { status = true, message = "Update successfully.", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
                else
                {
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            fheight = image.Height;
                            fwidth = image.Width;
                        }

                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Post/Featured"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                        entity = CMSRepository.CreatePost("UF", ID, post_title, post_content, FileName, entity_id, category, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        update_term(category, Convert.ToInt32(ID));
                    }
                    else
                    {
                        entity = CMSRepository.CreatePost("UP", ID, post_title, post_content, FileName, entity_id, category, featuerimg, fcsskey, seotitle, metades, slug, keylist, synlist, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        update_term(category, Convert.ToInt32(ID));
                    }
                    return Json(new { status = true, message = "Update successfully", url = "Pages" }, 0);
                }
            }
            }
            else
            {
                return Json(new { status = false, message = "Slug must be unique", url = "" }, 0);
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Post Categories~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        public JsonResult GetParentCategory(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CMSRepository.ParentCategory(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetParentCategoryList(string id)
        {
            DataTable ds = CMSRepository.GetParentCategoryList(id);
            string JSONresult = JsonConvert.SerializeObject(ds);
            return Json(JSONresult, 0);
        }
        public JsonResult CategoryList(ProductCategoryModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                long id = model.term_id;
                string urid = "";
                if (model.user_status != "")
                    urid = model.user_status;
                string searchid = model.Search;
                DataTable dt = CMSRepository.CategoryList(id, urid, searchid, model.PageNo, model.PageSize, out TotalRecord, model.SortCol, model.SortDir);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetCategoryByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = CMSRepository.GetCategoryByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { } 
            return Json(JSONresult, 0);
        }

        public JsonResult AddProductCategory(ProductCategoryModel model, HttpPostedFileBase ImageFile, string name, string slug, string parent, string ParentText, string description)
        {
           
            string checkname = new ProductRepository().GetName(name);
            string checknameonEdit = new ProductRepository().GetNameonEdit(name, model.term_id);
            if (ParentText.ToLower() == name.ToLower())
            {
                return Json(new { status = false, message = "Parent and category can not be same. Please select another parent category.", url = "", id = 0 }, 0);
            }
            if (model.term_id == 0 && checkname.ToLower() == name.ToLower())
            {
                return Json(new { status = false, message = "Category already exists", url = "", id = 0 }, 0);
            }
            else if (model.term_id > 0 && checknameonEdit.ToLower() == name.ToLower())
            {
                return Json(new { status = false, message = "Category already exists", url = "", id = 0 }, 0);
            }
            else
            {
               
                if (model.term_id > 0)
                {
                    UserActivityLog.WriteDbLog(LogType.Submit, "Update post category (" + name + ")", "/CMS/PostCategories" + ", " + Net.BrowserInfo);

                    //ProductRepository.EditPostMeta(thumbnailID, ImagePath, FileName);
                    new CMSRepository().EditPostCategory(model, name, slug, parent, description, 0);
                    return Json(new { status = true, message = "Product category updated successfully!!", url = "", id = model.term_id }, 0);
                }
                else
                {

                    int ID = new ProductRepository().AddProductCategory(model, name, slug);
                    if (ID > 0)
                    {
                        UserActivityLog.WriteDbLog(LogType.Submit, "Add new post category (" + name + ")", "/CMS/PostCategories" + ", " + Net.BrowserInfo);
                        //int thumbnailID = ProductRepository.AddImage(FileName, ImagePath, FileExtension);
                        //ProductRepository.postmeta(thumbnailID, ImagePath);
                        new CMSRepository().AddPostCategoryDesc(model, ID, 0);
                        return Json(new { status = true, message = "Post category saved successfully!!", url = "" }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
                    }
                }
            }

        }

        public JsonResult DeleteCategorywithProduct(ProductCategoryModel model)
        {
            string termID = model.strVal;
            if (termID != "")
            {
                int ProductID = new CMSRepository().DeleteProductfromCategory(termID);
                int ID = new CMSRepository().DeleteProductCategory(termID);
                if (ID > 0)
                {

                    return Json(new { status = true, message = "Post category deleted successfully!!", url = "", id = ID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Post category not Found", url = "", id = 0 }, 0);
            }
        }

        public JsonResult DeleteProductCategory(ProductCategoryModel model)
        {
            string termID = model.strVal;
            if (termID != "")
            {
                int ID = new CMSRepository().DeleteProductCategory(termID);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "Post category deleted successfully!!", url = "", id = ID }, 0);
                }
                else
                    return Json(new { status = false, message = "Invalid details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Post category not Found", url = "", id = 0 }, 0);
            }
        }

        //-----------------------Short Code -------------------------------------------------------- 

        public JsonResult Getshortcode(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = CMSRepository.Getshortcode(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult Addshortcode(string code,string disc,string id)
        {
            try
            {
                disc = HttpUtility.UrlDecode(disc);
                int ID = CMSRepository.Addshortcode(code, disc,id);
                if (ID > 0)
                {
                    return Json(new { status = true, message = "saved successfully.", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
            catch (Exception ex) { return Json(new { status = false, message = ex.Message, url = "" }, 0); }
        }
        [HttpPost]
        public JsonResult Selectshortcode(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CMSRepository.Selectshortcode(model.strValue1);
                JSONresult = JsonConvert.SerializeObject(DT, Formatting.Indented);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetPageAttributes()
        {
            string user_companyid = CommanUtilities.Provider.GetCurrent().user_companyid;
            DataSet ds = CMSRepository.Getparentpage(user_companyid);
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["post_title"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPageAttributesByID(int id)
        {
            //string user_companyid = CommanUtilities.Provider.GetCurrent().user_companyid;
            DataSet ds = CMSRepository.Getparentpagebyid(id);
            List<SelectListItem> productlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                productlist.Add(new SelectListItem { Text = dr["post_title"].ToString(), Value = dr["ID"].ToString() });
            }
            return Json(productlist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetpagebannerData(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = CMSRepository.GetpagebannerData(model.strValue1,Convert.ToInt32(model.strValue2));
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult ChangeBannerstatus(OrderPostStatusModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                CMSRepository or = new CMSRepository();
                or.ChangeBannerstatus(model, strID);
                return Json(new { status = true, message = "Banner stats update successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        [HttpGet]
        public JsonResult GetMediaList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = CMSRepository.GetMediaList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }
        public JsonResult CreateMediagallery(IEnumerable<HttpPostedFileBase> ImageFiles, string ID, string entity_id)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string featuerimg = "";
            string pathimage = "";
            string futherpathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
            string FeatuerFileExtension = "";
            int height = 0;
            int width = 0;
            double sizeInKB = 0;
            string dimensions = "";
            foreach (var ImageFile in ImageFiles)
            {
                if (ImageFile != null && ImageFile.ContentLength > 0)
                {
                    using (Image image = Image.FromStream(ImageFile.InputStream, true, true))
                    {
                        // Get the height and width
                        height = image.Height;
                        width = image.Width;
                        long sizeInBytes = ImageFile.ContentLength;
                        sizeInKB = sizeInBytes / 1024.0;
                        //dimensions = $"{width} by {height} pixels";
                    }

                    FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    string file_size = sizeInKB.ToString();
                    FileExtension = Path.GetExtension(ImageFile.FileName); 
                    // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                    if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                    {
                        //FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                        FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

                        int currentYear = DateTime.Now.Year;
                        int currentMonth = DateTime.Now.Month;
                        string yearFolderPath = Path.Combine(Server.MapPath("~/Content/Media"), currentYear.ToString());
                        string monthFolderPath = Path.Combine(yearFolderPath, currentMonth.ToString("00"));

                        // Check if the year folder exists, if not, create it
                        if (!Directory.Exists(yearFolderPath))
                        {
                            Directory.CreateDirectory(yearFolderPath);
                        }

                        // Check if the month folder exists, if not, create it
                        if (!Directory.Exists(monthFolderPath))
                        {
                            Directory.CreateDirectory(monthFolderPath);
                        }

                        //string UploadPath = Path.Combine(Server.MapPath("~/Content/Media"));
                        string UploadPath = monthFolderPath + "\\";
                        pathimage = UploadPath + FileName;
                        // model.ImagePathOut = UploadPath + FileNamethumb; 
                        if (FileName == "")
                        {
                            FileName = "default.png";
                        }
                        ImagePath = "~/Content/Media/" + FileName;

                        string fileNamethumb = UploadPath + "thumb_" + FileName;
                        string fileNameMedium = UploadPath + "medium_" + FileName;
                        string fileNameLarge = UploadPath + "large_" + FileName;

                        //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                        ImageFile.SaveAs(pathimage);

                        // Create thumbnail and save it
                        string thumbnailPath = Path.Combine(UploadPath, fileNamethumb);
                        CreateThumbnail(pathimage, thumbnailPath, 1024, 1024);

                        // Create medium-sized image and save it
                        string mediumPath = Path.Combine(UploadPath, fileNameMedium);
                        CreateResizedImage(pathimage, mediumPath, 2048, 2048);

                        // Create large-sized image and save it
                        string largePath = Path.Combine(UploadPath, fileNameLarge);
                        CreateResizedImage(pathimage, largePath, 4096, 4096);

                        if (Convert.ToInt32(ID) > 0)
                        {
                            entity = CMSRepository.AddMedia("U", ID, currentYear + "/" + currentMonth.ToString("00") + "/" + FileName, entity_id, height.ToString(), width.ToString(), file_size, FileExtension, currentYear + "/" + currentMonth.ToString("00") + "/" + "thumb_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "medium_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "large_" + FileName, FileName);
                            //if (entity > 0)
                            //{
                            //    return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
                            //}
                            //else
                            //{
                            //    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            //}
                        }
                        else
                        {
                            entity = CMSRepository.AddMedia("I", ID, currentYear + "/" + currentMonth.ToString("00") + "/" + FileName, entity_id, height.ToString(), width.ToString(), file_size, FileExtension, currentYear + "/" + currentMonth.ToString("00") + "/" + "thumb_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "medium_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "large_" + FileName, FileName);
                            //if (entity > 0)
                            //{
                            //    return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                            //}
                            //else
                            //{
                            //    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            //}
                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                    }
                }
                else
                {
                    return Json(new { status = false, message = "Upload media file", url = "" }, 0);
                }
            }
            if(Convert.ToInt16(ID) > 0)
              return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
            else
              return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
        }

        public JsonResult CreateMediagalleryold(HttpPostedFileBase ImageFile, string ID,  string entity_id)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string featuerimg = "";
            string pathimage = "";
            string futherpathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
            string FeatuerFileExtension = "";
            int height = 0;
            int width = 0;
            double sizeInKB=0;
            string dimensions = "";

            //string decodedHtml = HttpUtility.UrlDecode(post_content);
            if (ImageFile != null)
            {
                using (Image image = Image.FromStream(ImageFile.InputStream, true, true))
                {
                    // Get the height and width
                    height = image.Height;
                    width = image.Width;
                    long sizeInBytes = ImageFile.ContentLength;
                    sizeInKB = sizeInBytes / 1024.0;
                    //dimensions = $"{width} by {height} pixels";
                }

                FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                FileName = Regex.Replace(FileName, @"\s+", "");
                string size = (ImageFile.ContentLength / 1024).ToString();
                string file_size = sizeInKB.ToString();
                FileExtension = Path.GetExtension(ImageFile.FileName);

            



                // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                {
                    //FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                    FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;

                    int currentYear = DateTime.Now.Year;
                    int currentMonth = DateTime.Now.Month;
                    string yearFolderPath = Path.Combine(Server.MapPath("~/Content/Media"), currentYear.ToString());
                    string monthFolderPath = Path.Combine(yearFolderPath, currentMonth.ToString("00"));

                    // Check if the year folder exists, if not, create it
                    if (!Directory.Exists(yearFolderPath))
                    {
                        Directory.CreateDirectory(yearFolderPath);
                    }

                    // Check if the month folder exists, if not, create it
                    if (!Directory.Exists(monthFolderPath))
                    {
                        Directory.CreateDirectory(monthFolderPath);
                    }


                    //string UploadPath = Path.Combine(Server.MapPath("~/Content/Media"));
                    string UploadPath = monthFolderPath + "\\";
                    pathimage = UploadPath + FileName;
                    // model.ImagePathOut = UploadPath + FileNamethumb; 
                    if (FileName == "")
                    {
                        FileName = "default.png";
                    }
                    ImagePath = "~/Content/Media/" + FileName;


                    string fileNamethumb = UploadPath + "thumb_" + FileName;  
                    string fileNameMedium = UploadPath + "medium_" + FileName;   
                    string fileNameLarge = UploadPath + "large_" + FileName;  

                    //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                    ImageFile.SaveAs(pathimage); 

                    // Create thumbnail and save it
                    string thumbnailPath = Path.Combine(UploadPath, fileNamethumb);
                    CreateThumbnail(pathimage, thumbnailPath, 1024, 1024);

                    // Create medium-sized image and save it
                    string mediumPath = Path.Combine(UploadPath, fileNameMedium);
                    CreateResizedImage(pathimage, mediumPath, 2048, 2048);

                    // Create large-sized image and save it
                    string largePath = Path.Combine(UploadPath, fileNameLarge);
                    CreateResizedImage(pathimage, largePath, 4096, 4096); 

                    if (Convert.ToInt32(ID) > 0)
                    {
                        entity = CMSRepository.AddMedia("U", ID, currentYear+"/"+ currentMonth.ToString("00")+ "/" + FileName, entity_id,  height.ToString(), width.ToString(), file_size, FileExtension, currentYear + "/" + currentMonth.ToString("00") + "/"+ "thumb_"  + FileName, currentYear + "/" + currentMonth.ToString("00") + "/"  +"medium_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "large_"  + FileName, FileName);
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                    else
                    {
                        entity = CMSRepository.AddMedia("I", ID, currentYear + "/" + currentMonth.ToString("00") + "/" + FileName, entity_id, height.ToString(), width.ToString(), file_size, FileExtension, currentYear + "/" + currentMonth.ToString("00") + "/" + "thumb_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "medium_" + FileName, currentYear + "/" + currentMonth.ToString("00") + "/" + "large_" + FileName, FileName);
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                }
                else
                {
                    return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                }
            }
            else
            {
                //if (Convert.ToInt64(ID) == 0)
                //{ 
                 return Json(new { status = false, message = "Upload media file", url = "" }, 0); 
                //}
                //else
                //{
                     
                //    entity = CMSRepository.AddMedia("UP", ID, FileName, entity_id, height.ToString(), width.ToString(), file_size, FileExtension);

                //    return Json(new { status = true, message = "Update successfully", url = "Pages" }, 0);
                //}
            }

        }


        // Helper method to create a thumbnail of the image
        private void CreateThumbnail(string sourceImagePath, string destinationImagePath, int width, int height)
        {
            using (Image image = Image.FromFile(sourceImagePath))
            using (Image thumbnail = image.GetThumbnailImage(width, height, () => false, IntPtr.Zero))
            {
                thumbnail.Save(destinationImagePath);
            }
        }

        // Helper method to create a resized version of the image
        private void CreateResizedImage(string sourceImagePath, string destinationImagePath, int maxWidth, int maxHeight)
        {
            using (Image image = Image.FromFile(sourceImagePath))
            {
                int newWidth, newHeight;

                if (image.Width > image.Height)
                {
                    newWidth = maxWidth;
                    newHeight = (int)((float)image.Height / image.Width * maxWidth);
                }
                else
                {
                    newHeight = maxHeight;
                    newWidth = (int)((float)image.Width / image.Height * maxHeight);
                }

                using (Image resizedImage = new Bitmap(newWidth, newHeight))
                using (Graphics graphics = Graphics.FromImage(resizedImage))
                {
                    graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    graphics.DrawImage(image, 0, 0, newWidth, newHeight);
                    resizedImage.Save(destinationImagePath);
                }
            }
        }
        private void CreateResizedImagetest(string sourceImagePath, string destinationImagePath, int maxWidth, int maxHeight)
        {
            using (Image image = Image.FromFile(sourceImagePath))
            {
                int newWidth, newHeight;

                if (image.Width > image.Height)
                {
                    newWidth = Math.Min(maxWidth, image.Width);
                    newHeight = (int)((float)image.Height / image.Width * newWidth);
                }
                else
                {
                    newHeight = Math.Min(maxHeight, image.Height);
                    newWidth = (int)((float)image.Width / image.Height * newHeight);
                }

                using (Image resizedImage = new Bitmap(newWidth, newHeight))
                using (Graphics graphics = Graphics.FromImage(resizedImage))
                {
                    graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    graphics.DrawImage(image, 0, 0, newWidth, newHeight);
                    resizedImage.Save(destinationImagePath);
                }
            }
        }
        public JsonResult GetMediagalleryByID(int ID)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CMSRepository.GetMediaDataByID(ID);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult GetBlogCounts(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = CMSRepository.GetBlogCounts();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }
        [HttpGet]
        public JsonResult GetBlogList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = CMSRepository.GetBlogList(model.strValue1, model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        public JsonResult CreateBlog(HttpPostedFileBase ImageFile, string ID, string post_title, string post_content, string entity_id, HttpPostedFileBase FeaturedFile, string shortdic)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string featuerimg = "";
            string pathimage = "";
            string futherpathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
            string FeatuerFileExtension = "";
            //string encodedHtml = "%3Cp%3Ehi%20this%20is%26nbsp%3B%3C%2Fp%3E%0D%0A%3Cp%3Etest%3C%2Fp%3E%0D%0A%3Cp%3Eeditore%20save%3C%2Fp%3E";
            post_content = HttpUtility.UrlDecode(post_content);
            int fheight = 0;
            int fwidth = 0;
            int bheight = 0;
            int bwidth = 0;

            //string decodedHtml = HttpUtility.UrlDecode(post_content);
            if (ImageFile != null)
            {
                using (Image image = Image.FromStream(ImageFile.InputStream, true, true))
                {
                    // Get the height and width
                    bheight = image.Height;
                    bwidth = image.Width;
                }

                FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                FileName = Regex.Replace(FileName, @"\s+", "");
                string size = (ImageFile.ContentLength / 1024).ToString();
                FileExtension = Path.GetExtension(ImageFile.FileName);
                // if (FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".bmp")
                if (FileExtension == ".png" || FileExtension == ".PNG" || FileExtension == ".JPG" || FileExtension == ".jpg" || FileExtension == ".jpeg" || FileExtension == ".JPEG" || FileExtension == ".bmp" || FileExtension == ".BMP")
                {
                    //FileNamethumb = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + "_thumb" + FileExtension;
                    FileName = DateTime.Now.ToString("MMddyyhhmmss") + "-" + FileName.Trim() + FileExtension;
                    string UploadPath = Path.Combine(Server.MapPath("~/Content/Blog/Banner"));
                    UploadPath = UploadPath + "\\";
                    pathimage = UploadPath + FileName;
                    // model.ImagePathOut = UploadPath + FileNamethumb;
                    if (FileName == "")
                    {
                        FileName = "default.png";
                    }
                    ImagePath = "~/Content/Blog/Banner/" + FileName;
                    //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                    ImageFile.SaveAs(pathimage);
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            fheight = image.Height;
                            fwidth = image.Width;
                        }

                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Blog/Other"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                    }
                    else
                    {

                        featuerimg = "";
                    }

                    if (Convert.ToInt32(ID) > 0)
                    {
                        entity = CMSRepository.CreateBlog("U", ID, post_title, post_content, FileName, entity_id, featuerimg, shortdic, bheight.ToString(),bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Update successfully.", url = "Pages", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                    else
                    {
                        entity = CMSRepository.CreateBlog("I", ID, post_title, post_content, FileName, entity_id, featuerimg, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                }
                else
                {
                    return Json(new { status = false, message = "File formate " + FileExtension + " is not allowed!!", url = "" }, 0);

                }
            }
            else
            {
                if (Convert.ToInt64(ID) == 0)
                {
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            fheight = image.Height;
                            fwidth = image.Width;
                        }
                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Blog/Other"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                    }
                    else
                    {

                        featuerimg = "";
                    }
                    entity = CMSRepository.CreateBlog("I", ID, post_title, post_content, FileName, entity_id, featuerimg, shortdic  ,bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                    if (entity > 0)
                    {
                        return Json(new { status = true, message = "Save successfully.", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                    }
                }
                else
                {
                    if (FeaturedFile != null)
                    {
                        using (Image image = Image.FromStream(FeaturedFile.InputStream, true, true))
                        {
                            // Get the height and width
                            fheight = image.Height;
                            fwidth = image.Width;
                        }
                        featuerimg = Path.GetFileNameWithoutExtension(FeaturedFile.FileName);
                        featuerimg = Regex.Replace(featuerimg, @"\s+", "");
                        FeatuerFileExtension = Path.GetExtension(FeaturedFile.FileName);
                        featuerimg = DateTime.Now.ToString("MMddyyhhmmss") + "-" + featuerimg.Trim() + FeatuerFileExtension;
                        string FutcherUploadPath = Path.Combine(Server.MapPath("~/Content/Blog/Other"));
                        FutcherUploadPath = FutcherUploadPath + "\\";
                        futherpathimage = FutcherUploadPath + featuerimg;
                        if (featuerimg == "")
                        {
                            featuerimg = "default.png";
                        }
                        FeaturedFile.SaveAs(futherpathimage);
                        entity = CMSRepository.CreateBlog("UF", ID, post_title, post_content, FileName, entity_id, featuerimg, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                    }
                    else
                    {
                        entity = CMSRepository.CreateBlog("UP", ID, post_title, post_content, FileName, entity_id, featuerimg, shortdic, bheight.ToString(), bwidth.ToString(), fheight.ToString(), fwidth.ToString());
                    }
                    return Json(new { status = true, message = "Update successfully", url = "Pages" }, 0);
                }
            }

        }

        public JsonResult GetDataBlogByID(int ID)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = CMSRepository.GetDataBlogByID(ID);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult Changepagestatus(OrderPostStatusModel model)
        {
            string strID = model.strVal;
            if (strID != "")
            {
                CMSRepository or = new CMSRepository();
                or.Changepagestatus(model, strID);
                return Json(new { status = true, message = "status update successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
    }
}