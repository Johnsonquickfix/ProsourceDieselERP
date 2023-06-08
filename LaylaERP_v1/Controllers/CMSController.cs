using LaylaERP.BAL;
using LaylaERP.DAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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

        public JsonResult CreatePages(HttpPostedFileBase ImageFile, string ID, string post_title, string post_content, string entity_id, string SEO, string Content, HttpPostedFileBase FeaturedFile)
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
                        entity = CMSRepository.CreatePage("U", ID, post_title, post_content, FileName, entity_id,SEO,Content, featuerimg);
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
                        entity = CMSRepository.CreatePage("I", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg);
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
                    return Json(new { status = false, message = "Please upload file", url = "Pages" }, 0);
                else
                {
                    if (FeaturedFile != null)
                    {
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
                        entity = CMSRepository.CreatePage("UF", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg);
                    }
                    else
                    {
                        entity = CMSRepository.CreatePage("UP", ID, post_title, post_content, FileName, entity_id, SEO, Content, featuerimg);
                    }
                    return Json(new { status = true, message = "Update successfully", url = "Pages" }, 0);
                }
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

        public JsonResult CreateBanner(HttpPostedFileBase ImageFile, string ID, string post_title, string bannerurl, string entity_id, string type,string btypeof, HttpPostedFileBase FeaturedFile)
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
            bannerurl = HttpUtility.UrlDecode(bannerurl);

            string numbersString = type;
            string[] numberStrings = numbersString.Split(',');

            // Convert the numbers to the serialized format
            List<string> serializedNumbers = new List<string>();
            for (int i = 0; i < numberStrings.Length; i++)
            {
                int number = int.Parse(numberStrings[i]);
                string serializedNumber = $"i:{i};s:{number.ToString().Length}:\"{number}\";";
                serializedNumbers.Add(serializedNumber);
            }

            // Construct the final serialized string
            string serializedString = $"a:{numberStrings.Length}:{{{string.Join("", serializedNumbers)}}}";

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
                        entity = CMSRepository.CreateBanner("U", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString,  featuerimg);
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
                        entity = CMSRepository.CreateBanner("I", ID, post_title, bannerurl, FileName, entity_id,  btypeof, serializedString, featuerimg);
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
                    return Json(new { status = false, message = "Please upload file", url = "Pages" }, 0);
                else
                {
                    if (FeaturedFile != null)
                    {
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
                        entity = CMSRepository.CreateBanner("UF", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString, featuerimg);
                    }
                    else
                    {
                        entity = CMSRepository.CreateBanner("UP", ID, post_title, bannerurl, FileName, entity_id, btypeof, serializedString, featuerimg);
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


    }
}