using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP_v1.Controllers
{
    public class EntityController : Controller
    {
        // GET: Entity
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CreateNew()
        {
            return View();
        }
        
        public JsonResult GetData(string rolepass)
        {
            EntityRepositry.ShowDetails(rolepass);
            return Json(new { data = EntityRepositry.entitylist }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CreateEntity(HttpPostedFileBase ImageFile, string ID, string Emailuser, string companyname, string FirstName, string LastName, string address, string country, string Countrycode, string Phone, string Zipcode, string City, string State, string Website, string LogoUrl, string AdditionalNotes, string base_url, string po_emailval,string address2)
        {
            var ImagePath = "";
            //var ImagePaththum = "";
            int entity = 0;
            string FileName = "";
            string pathimage = "";
            //string FileNamethumb = "";
            string FileExtension = "";
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

                    string UploadPath = Path.Combine(Server.MapPath("~/Content/Entity"));
                    UploadPath = UploadPath + "\\";
                    pathimage = UploadPath + FileName;
                    // model.ImagePathOut = UploadPath + FileNamethumb;
                    if (FileName == "")
                    {
                        FileName = "default.png";
                    }
                    ImagePath = "~/Content/Entity/" + FileName;
                    //ImagePaththum = "~/Content/Entity/" + FileNamethumb;
                    ImageFile.SaveAs(pathimage);
                    if (Convert.ToInt32(ID) > 0)
                    {
                        entity = EntityRepositry.CreateEntity("U", ID, Emailuser, companyname, FirstName, LastName, address, country, Countrycode, Phone, Zipcode, City, State, Website, FileName, AdditionalNotes, base_url, po_emailval, address2);
                        if (entity > 0)
                        {
                            return Json(new { status = true, message = "Update successfully.", url = "Entity", id = ID }, 0);
                        }
                        else
                        {
                            return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                        }
                    }
                    else
                    {
                        DataTable cmname = new DataTable();
                        cmname = EntityRepositry.Getentitycount(companyname);
                        if (Convert.ToInt32(cmname.Rows[0]["Countid"]) == 0)
                        {
                            entity = EntityRepositry.CreateEntity("I", ID, Emailuser, companyname, FirstName, LastName, address, country, Countrycode, Phone, Zipcode, City, State, Website, FileName, AdditionalNotes, base_url, po_emailval, address2);
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
                            return Json(new { status = false, message = "company name already exists", url = "" }, 0);
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
                if (Convert.ToInt16(ID) == 0)
                    return Json(new { status = false, message = "Please upload file", url = "Entity" }, 0);
                else
                {
                    entity = EntityRepositry.CreateEntity("UP", ID, Emailuser, companyname, FirstName, LastName, address, country, Countrycode, Phone, Zipcode, City, State, Website, FileName, AdditionalNotes, base_url, po_emailval, address2);

                    return Json(new { status = true, message = "Update successfully", url = "Entity" }, 0);
                }
            }

        }

        public JsonResult GetDataByID(entityDetails model)
        {
            string JSONresult = string.Empty;
            try
            {

                DataTable dt = EntityRepositry.GetDataByID(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult ActiveEntity(entityDetails model)
        {
            string entiryid = model.address;
            string status = model.status;
            if (entiryid != "")
            {
                EntityRepositry.ActiveEntity(entiryid, status);
                return Json(new { status = true, message = "Enity status change successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }
    }
}