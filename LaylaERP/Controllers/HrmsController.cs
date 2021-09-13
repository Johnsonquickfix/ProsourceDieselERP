using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;

namespace LaylaERP.Controllers
{
    public class HrmsController : Controller
    {
        // GET: Employee
        public ActionResult Employee(long id = 0)
        {
            ViewBag.id = id;
            return View();
        }
        public ActionResult EmployeeList()
        {
            return View();
        }

        // GET: Attendance
        public ActionResult Attendance()
        {
            return View();
        }

        // GET: Leave
        public ActionResult Leave()
        {
            return View();
        }

        // GET: Payroll
        public ActionResult Payroll()
        {
            return View();
        }

        // GET: Appraisal
        public ActionResult Appraisal()
        {
            return View();
        }

        // GET: Hrms
        public ActionResult RoleMembership()
        {
            return View();
        }
        public JsonResult GetGroup()
        {
            DataSet ds = HrmsRepository.GetGroup();
            List<SelectListItem> list = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                list.Add(new SelectListItem { Text = dr["Text"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(list, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetDesignation()
        {
            DataSet ds = HrmsRepository.GetDesignation();
            List<SelectListItem> designationlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                designationlist.Add(new SelectListItem { Text = dr["designation"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(designationlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetDepartment()
        {
            DataSet ds = HrmsRepository.GetDepartment();
            List<SelectListItem> designationlist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                designationlist.Add(new SelectListItem { Text = dr["department"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(designationlist, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetEmployeeCode(SearchModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable DT = BAL.HrmsRepository.GetEmployeeCode();
                JSONresult = JsonConvert.SerializeObject(DT);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult AddEmployeeBasicInfo(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditEmployeeBasicInfo(model,model.rowid);
                HrmsRepository.EditEmployeeBasicDetails(model, model.rowid);
                return Json(new { status = true, message = "Data has been Updated successfully!!", url = "", id= model.rowid }, 0);
            }
            else
            {
                int ID = HrmsRepository.AddEmployeeBasicInfo(model);
                if (ID > 0)
                {
                    HrmsRepository.AddEmployeeBasicDetails(model, ID);
                    return Json(new { status = true, message = "Data has been saved successfully!!", url = "", id=ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
        }
        public JsonResult AddEmployeeAdditionalInfo(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditEmployeeAdditionalInfo(model, model.rowid);
                return Json(new { status = true, message = "Employee Info has been Updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }
        public JsonResult AddSalaryInfo(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditSalaryInfo(model, model.rowid);
                return Json(new { status = true, message = "Employee Info has been Updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }
        public JsonResult AddBankInfo(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditBankInfo(model, model.rowid);
                return Json(new { status = true, message = "Bank Info has been Updated successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }
        public JsonResult GetEmployeeList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeeList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult GetEmployeeAttendenceList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeeAttendenceList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult UpdateEmployeeStatus(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                new HrmsRepository().UpdateEmployeeStatus(model);
                return Json(new { status = true, message = "Employee status has been changed successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong!!", url = "", id = 0 }, 0);
            }
        }
        public JsonResult GetEmployeeByID(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeeByID(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public ActionResult EmployeeFileUpload(int fk_emp, HttpPostedFileBase ImageFile)
        {
            try
            {
                HrmsModel model = new HrmsModel();
                if (ImageFile != null)
                {
                    string FileName = Path.GetFileNameWithoutExtension(ImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (ImageFile.ContentLength / 1024).ToString();
                    string FileExtension = Path.GetExtension(ImageFile.FileName);
                    if (FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg")
                    {
                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;
                        DataTable dt = HrmsRepository.GetfileCountdata(fk_emp, FileName);
                        if (dt.Rows.Count > 0)
                        {
                            return Json(new { status = false, message = "File already exist in table", url = "" }, 0);
                        }
                        else
                        {
                            string UploadPath = Path.Combine(Server.MapPath("~/Content/EmployeeLinkedFiles"));
                            UploadPath = UploadPath + "\\";
                            model.ImagePath = UploadPath + FileName;
                            var ImagePath = "~/Content/EmployeeLinkedFiles/" + FileName;
                            ImageFile.SaveAs(model.ImagePath);
                            int resultOne = HrmsRepository.EmployeeFileUpload(fk_emp, FileName, ImagePath, FileExtension, size);
                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        }
                    }
                    else
                    {
                        return Json(new { status = false, message = "File Type " + FileExtension + " Not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        public ActionResult EmployeeProfileUpload(int fk_emp, HttpPostedFileBase EmpImageFile)
        {
            try
            {
                HrmsModel model = new HrmsModel();
                if (EmpImageFile != null)
                {
                    string FileName = Path.GetFileNameWithoutExtension(EmpImageFile.FileName);
                    FileName = Regex.Replace(FileName, @"\s+", "");
                    string size = (EmpImageFile.ContentLength / 1024).ToString();
                    string FileExtension = Path.GetExtension(EmpImageFile.FileName);
                    if (FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg")
                    {
                        FileName = FileName.Trim() + FileExtension;
                        string FileNameForsave = FileName;
                        //DataTable dt = HrmsRepository.GetProfileCountdata(fk_emp, FileName);
                        //if (dt.Rows.Count > 0)
                        //{
                        //    return Json(new { status = false, message = "File already exist in table", url = "" }, 0);
                        //}
                        //else
                        //{
                            string UploadPath = Path.Combine(Server.MapPath("~/Content/EmployeeProfileImage"));
                            UploadPath = UploadPath + "\\";
                            model.ProfileImagePath = UploadPath + FileName;
                            var ImagePath = "~/Content/EmployeeProfileImage/" + FileName;
                            EmpImageFile.SaveAs(model.ProfileImagePath);
                            int resultOne = HrmsRepository.EmployeeProfileUpload(fk_emp, FileName, ImagePath);
                            if (resultOne > 0)
                            {
                                return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
                            }
                            else
                            {
                                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                            }
                        //}
                    }
                    else
                    {
                        return Json(new { status = false, message = "File Type " + FileExtension + " Not allowed", url = "" }, 0);
                    }
                }
                else
                {
                    return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }
        public JsonResult GetEmployeeLinkedFiles(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeeLinkedFiles(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }
        public JsonResult DeleteEmployeeLinkedFiles(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = new HrmsRepository().DeleteEmployeeLinkedFiles(model);
                if (ID > 0)
                    return Json(new { status = true, message = "Employee Linked Files has been deleted successfully!!", url = "", id = ID }, 0);
                else
                    return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Employee info not Found", url = "", id = 0 }, 0);
            }
        }
        public JsonResult AddAttendence(HrmsModel model)
         {
            if (ModelState.IsValid)
            {
                string Empid = model.strValue1;
                string intime = model.strValue2;
                string outtime = model.strValue3;

                if (model.rowid > 0)
                {
                    //new ThirdPartyRepository().EditVendorBasicInfo(model);
                    //return Json(new { status = true, message = "Product account has been updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    int ID = new HrmsRepository().AddAttendence(Empid, intime, outtime);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Attendence has been saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "something went wrong!! Attendence not saved ", url = "", id = 0 }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }

        //My code
        public JsonResult GetLeaveType()
        {
            DataSet ds = HrmsRepository.GetLeaveType();
            List<SelectListItem> leavelist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                leavelist.Add(new SelectListItem { Text = dr["leave_type"].ToString(), Value = dr["leave_code"].ToString() });
            }
            return Json(leavelist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetEmployee()
        {
            DataSet ds = HrmsRepository.GetEmployee();
            List<SelectListItem> employeelist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                employeelist.Add(new SelectListItem { Text = dr["firstname"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(employeelist, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult AddLeave(LeaveModel model)
        {

            int ID = HrmsRepository.AddLeave(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Data has been saved successfully!!", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

    }
}