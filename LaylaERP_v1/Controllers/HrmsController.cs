using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
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
        public ActionResult AttendanceReport()
        {
            return View();
        }

        // GET: Leave
        public ActionResult Leave()
        {
            DataTable dt = LeaveRepository.GetSelectEmployeeID();
            if (dt.Rows.Count > 0)
            {
                ViewBag.empid = dt.Rows[0]["rowid"];
            }
            return View();
        }

        //GET: Grant Leave
        public ActionResult ListGrantLeave()
        {
            return View();
        }
        public ActionResult EditGrantLeave()
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
        //GET: configuration
        public ActionResult configuration()
        {
            return View();
        }
        public ActionResult ConfigurationList()
        {
            return View();
        }
        public ActionResult LeaveListForAdmin()
        {
            return View();
        }

        public ActionResult EditConfigurationList(long id)
        {
            ViewBag.id = id;
            DataTable dt = HrmsConfigurationRepository.SelectConfiguration(id);
            ViewBag.emptype = dt.Rows[0]["emp_type"];
            return View();
        }
        //Get HRA
        public ActionResult HRA()
        {
            return View();
        }
        public ActionResult EditHRA()
        {
            return View();
        }
        //Get DA
        public ActionResult Da()
        {
            return View();
        }
        public ActionResult DaEdit()
        {
            return View();
        }
        public ActionResult Designation()
        {
            return View();
        }
        public ActionResult Department()
        {
            return View();
        }
        public ActionResult LeaveMaster()
        {
            return View();
        }

        public ActionResult Configsetup()
        {
            DataTable dt = HrmsConfigurationRepository.SelectConfigSetting();
            if (dt.Rows.Count > 0)
            {
                ViewBag.id = dt.Rows[0]["rowid"];
            }
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
            byte[] image =  System.IO.File.ReadAllBytes(Server.MapPath("~/Content/EmployeeProfileImage/default.png"));
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditEmployeeBasicInfo(model, model.rowid);
                HrmsRepository.EditEmployeeBasicDetails(model, model.rowid);
                HrmsRepository.UpdateNewEmployeeasUser(model);
                UpdateEmployeeMetaData(model, model.userid);
                return Json(new { status = true, message = "Data Updated successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                DataTable dt = HrmsRepository.AddNewEmployeeasUser(model, image);
                if (Convert.ToInt32(dt.Rows[0]["userid"]) > 0)
                {
                    AddEmployeeMetaData(model, Convert.ToInt32(dt.Rows[0]["userid"]));
                    int ID = HrmsRepository.AddEmployeeBasicInfo(model, Convert.ToInt32(dt.Rows[0]["userid"]));
                    if (ID > 0)
                    {
                        HrmsRepository.AddEmployeeBasicDetails(model, ID);
                        HrmsRepository.AddConfiguration(model, ID);
                    }
                    return Json(new { status = true, message = "Data saved successfully!!", url = "", id = ID }, 0);
                }
                else
                {
                    return Json(new { status = false, message = dt.Rows[0]["ErrorMessage"], url = "" }, 0);
                }
            }
        }

        public JsonResult AddEmployeeAdditionalInfo(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                int ID = HrmsRepository.EditEmployeeAdditionalInfo(model, model.rowid);
                return Json(new { status = true, message = "Employee Info Updated successfully!!", url = "" }, 0);
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
                return Json(new { status = true, message = "Employee Info Updated successfully!!", url = "" }, 0);
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
                return Json(new { status = true, message = "Bank Info Updated successfully!!", url = "" }, 0);
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
                DataTable dt = HrmsRepository.GetEmployeeAttendenceList(model.strValue1, model.strValue2, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetAttendanceReport(JqDataTableModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = HrmsRepository.GetAttendanceReport(model.strValue1, model.strValue2);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { aaData = result }, 0);
        }
        public JsonResult UpdateEmployeeStatus(HrmsModel model)
        {
            if (model.rowid > 0)
            {
                new HrmsRepository().UpdateEmployeeStatus(model);
                return Json(new { status = true, message = "Employee status changed successfully!!", url = "", id = model.rowid }, 0);
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
        public ActionResult EmployeeProfileUpload(HrmsModel model)
        {
            try
            {

                int resultOne = HrmsRepository.EmployeeProfileUpload(model);
                if (resultOne > 0)
                {
                    return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
                }
                else
                {
                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }

        }

        //public ActionResult EmployeeProfileUpload(int fk_emp, HttpPostedFileBase EmpImageFile, byte[] Picture)
        //{
        //    try
        //    {
        //        HrmsModel model = new HrmsModel();
        //        if (EmpImageFile != null)
        //        {
        //            string FileName = Path.GetFileNameWithoutExtension(EmpImageFile.FileName);
        //            FileName = Regex.Replace(FileName, @"\s+", "");
        //            string size = (EmpImageFile.ContentLength / 1024).ToString();
        //            string FileExtension = Path.GetExtension(EmpImageFile.FileName);
        //            if (FileExtension == ".pdf" || FileExtension == ".doc" || FileExtension == ".docx" || FileExtension == ".png" || FileExtension == ".jpg" || FileExtension == ".jpeg")
        //            {
        //                FileName = FileName.Trim() + FileExtension;
        //                string FileNameForsave = FileName;
        //                //DataTable dt = HrmsRepository.GetProfileCountdata(fk_emp, FileName);
        //                //if (dt.Rows.Count > 0)
        //                //{
        //                //    return Json(new { status = false, message = "File already exist in table", url = "" }, 0);
        //                //}
        //                //else
        //                //{

        //                string UploadPath = Path.Combine(Server.MapPath("~/Content/EmployeeProfileImage"));
        //                UploadPath = UploadPath + "\\";
        //                model.ProfileImagePath = UploadPath + FileName;
        //                var ImagePath = "~/Content/EmployeeProfileImage/" + FileName;

        //                EmpImageFile.SaveAs(model.ProfileImagePath);

        //                int resultOne = HrmsRepository.EmployeeProfileUpload(fk_emp, FileName, ImagePath, Picture);
        //                if (resultOne > 0)
        //                {
        //                    return Json(new { status = true, message = "File Upload successfully!!", url = "" }, 0);
        //                }
        //                else
        //                {
        //                    return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        //                }
        //                //}
        //            }
        //            else
        //            {
        //                return Json(new { status = false, message = "File Type " + FileExtension + " Not allowed", url = "" }, 0);
        //            }
        //        }
        //        else
        //        {
        //            return Json(new { status = false, message = "Please attach a document", url = "" }, 0);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
        //    }

        //}
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
                    return Json(new { status = true, message = "Employee Linked Files deleted successfully!!", url = "", id = ID }, 0);
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
                    //return Json(new { status = true, message = "Product account updated successfully!!", url = "", id = model.rowid }, 0);
                }
                else
                {
                    int ID = new HrmsRepository().AddAttendence(Empid, intime, outtime, model.strValue4, model.strValue5);
                    if (ID > 0)
                    {
                        return Json(new { status = true, message = "Attendence saved successfully!!", url = "", id = ID }, 0);
                    }
                    else
                    {
                        return Json(new { status = false, message = "something went wrong!! Attendence not saved ", url = "", id = 0 }, 0);
                    }
                }
            }
            return Json(new { status = false, message = "Invalid Details", url = "", id = 0 }, 0);
        }
        public JsonResult AbsentEmployee(List<AttendenceModel> model)
        {
            int ID = new HrmsRepository().AbsentEmployee(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Employee Absent saved successfully!!", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "something went wrong!! Attendence not saved ", url = "", id = 0 }, 0);
            }
        }

        //My code
        public JsonResult GetLeaveType()
        {
            DataSet ds = HrmsRepository.GetLeaveType();
            List<SelectListItem> leavelist = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                leavelist.Add(new SelectListItem { Text = dr["leave_type"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(leavelist, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetEmployee(string fkuser)
        {
            DataSet ds = HrmsRepository.GetEmployee(fkuser);
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

                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult LeaveList(string fkuser)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsRepository.GetLeaveList(fkuser);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetLeaveListSelect(LeaveModel model)
        {

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsRepository.GetLeaveListSelect(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult UpdateLeave(LeaveModel model)
        {

            if (model.rowid > 0)
            {
                HrmsRepository.UpdateLeave(model);
                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetGrantLeaveList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = LeaveRepository.GetGrantLeaveList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult ChangeLeaveStatus(LeaveModel model)
        {
            string strID = model.strVal;
            if (!string.IsNullOrEmpty(strID))
            {
                LeaveRepository.ChangeLeaveStatus(model, strID);
                return Json(new { status = true, message = "Status Changed successfully!!", url = "" }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Something went wrong", url = "" }, 0);
            }

        }

        public JsonResult SelectGrantLeave(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.SelectGrantLeave(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult UpdateGrantLeave(LeaveModel model)
        {

            if (model.rowid > 0)
            {
                LeaveRepository.UpdateGrantLeave(model);
                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        //Bind Dropdown for configuration
        public JsonResult GetEmployeeCodeForConfig(int rowid)
        {
            DataSet ds = HrmsConfigurationRepository.GetEmployeeCode(rowid);
            List<SelectListItem> employeecode = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                employeecode.Add(new SelectListItem { Text = dr["emp_number"].ToString(), Value = dr["fk_emp"].ToString() });
            }
            return Json(employeecode, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetEmployeeNameForConfig(string id)
        {
            //DataSet ds = HrmsConfigurationRepository.GetEmployeeName(id);
            //List<SelectListItem> employeename = new List<SelectListItem>();
            //foreach (DataRow dr in ds.Tables[0].Rows)
            //{
            //    employeename.Add(new SelectListItem { Text = dr["name"].ToString(), Value = dr["rowid"].ToString() });
            //}
            //return Json(employeename, JsonRequestBehavior.AllowGet);

            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.GetEmployeeName(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);

        }

        public JsonResult GetEmployeeTypeForConfig(string id)
        {
            DataSet ds = HrmsConfigurationRepository.GetEmployeeType();
            List<SelectListItem> employeetype = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                employeetype.Add(new SelectListItem { Text = dr["type"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(employeetype, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetAccountingTypeForConfig()
        {
            DataSet ds = HrmsConfigurationRepository.GetAccountingType();
            List<SelectListItem> accountingtype = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                accountingtype.Add(new SelectListItem { Text = dr["label"].ToString(), Value = dr["account_number"].ToString() });
            }
            return Json(accountingtype, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetWorkTypeForConfig()
        {
            DataSet ds = HrmsConfigurationRepository.GetWorkType();
            List<SelectListItem> worktype = new List<SelectListItem>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                worktype.Add(new SelectListItem { Text = dr["designation"].ToString(), Value = dr["rowid"].ToString() });
            }
            return Json(worktype, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult AddConfiguration(HrmsConfigurationModel model)
        {
            int ID = HrmsConfigurationRepository.AddConfiguration(model);
            if (ID > 0)
            {

                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = ID }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetConfigList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = HrmsConfigurationRepository.GetConfigList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult SelectConguration(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.SelectConfiguration(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        [HttpPost]
        public JsonResult UpdateConfiguration(HrmsConfigurationModel model)
        {

            if (model.rowid > 0)
            {
                HrmsConfigurationRepository.UpdateConfiguration(model);
                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult SelectDAList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.SelectDAList();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult AddHRADetails(HrmsConfigurationModel model)
        {
            int ID = HrmsConfigurationRepository.AddHRADetails(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetHRAList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.GetHRAList();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult SelectHRAList(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.SelectHRAList(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult UpdateHRA(HrmsConfigurationModel model)
        {
            if (model.rowid > 0)
            {
                HrmsConfigurationRepository.UpdateHRA(model);
                return Json(new { status = true, message = "Data saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult HRAValue(long basic)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.HRAValue(basic);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult AddDaDetails(DaModel model)
        {
            int ID = DaRepository.AddDaDetails(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "DA Data saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetDaList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = DaRepository.GetDaList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult SelectDa(long id)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = DaRepository.SelectDa(id);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        [HttpPost]
        public JsonResult UpdateDA(DaModel model)
        {
            if (model.rowid > 0)
            {
                DaRepository.UpdateDA(model);
                return Json(new { status = true, message = "DA Data has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetSelectEmployeeID()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetSelectEmployeeID();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetLeaveCalculation(string i)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetLeaveCalculation(i);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetPendingLeaveList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = LeaveRepository.GetPendingLeaveList(model.strValue2, model.strValue3, model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        public JsonResult GetRejectedLeaveList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = LeaveRepository.GetRejectedLeaveList(model.strValue1, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex) { throw ex; }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, iTotalRecords = TotalRecord, iTotalDisplayRecords = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult UpdateConfigSetting(empconfigsetting model)
        {
            if (model.rowid > 0)
            {
                HrmsConfigurationRepository.UpdateConfigSetting(model);
                return Json(new { status = true, message = "Configuration has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetConfigSetting()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.SelectConfigSetting();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        public JsonResult GetDA()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = HrmsConfigurationRepository.GetDA();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }


        public JsonResult GetEmployeePayrollList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                DataTable dt = HrmsRepository.GetEmployeePayrollList(model.strValue1, model.strValue2, model.strValue3, model.sSearch, model.iDisplayStart, model.iDisplayLength, out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt);
            }
            catch { }
            //return Json(JSONresult, 0);
            return Json(0);
        }

        [HttpPost]
        public JsonResult AddDesignation(DesignationModel model)
        {
            int ID = LeaveRepository.AddDesignation(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Designation has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetDesignationList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetDesignationList();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetDesignationById(DesignationModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetDesignationById(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult UpdateDesignation(DesignationModel model)
        {
            if (model.rowid > 0)
            {
                LeaveRepository.UpdateDesignation(model);
                return Json(new { status = true, message = "Designation has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        [HttpPost]
        public JsonResult AddDepartment(DepartmentModel model)
        {
            int ID = LeaveRepository.AddDeprtment(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Department has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetDepartmentList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetDepartmentList();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }
        public JsonResult GetDepartmentById(DepartmentModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetDepartmentById(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult UpdateDepartment(DepartmentModel model)
        {
            if (model.rowid > 0)
            {
                LeaveRepository.UpdateDepartment(model);
                return Json(new { status = true, message = "Department has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        [HttpPost]
        public JsonResult AddMasterLeave(DesignationModel model)
        {
            int ID = LeaveRepository.AddDesignation(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Designation has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetLeaveMasterList()
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetLeaveMasterList();
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult AddLeaveType(LeaveTypeModel model)
        {
            int ID = LeaveRepository.AddLeaveType(model);
            if (ID > 0)
            {
                return Json(new { status = true, message = "Leave Type has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        public JsonResult GetLeaveTypeById(LeaveTypeModel model)
        {
            string JSONresult = string.Empty;
            try
            {
                DataTable dt = LeaveRepository.GetLeaveTypeById(model);
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            catch { }
            return Json(JSONresult, 0);
        }

        [HttpPost]
        public JsonResult UpdateLeaveType(LeaveTypeModel model)
        {
            if (model.rowid > 0)
            {
                LeaveRepository.UpdateLeaveType(model);
                return Json(new { status = true, message = "Leave Type has been saved successfully!!", url = "", id = model.rowid }, 0);
            }
            else
            {
                return Json(new { status = false, message = "Invalid Details", url = "" }, 0);
            }
        }

        private void AddEmployeeMetaData(HrmsModel model, long id)
        {
            string[] varQueryArr1 = new string[11];
            string[] varFieldsName = new string[11] { "first_name", "last_name", "wp_capabilities", "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode", "insperity_id" };
            string[] varFieldsValue = new string[11] { model.firstname, model.lastname, "employee", model.address1, model.country, model.phone, model.address2, model.city, model.state, model.zipcode, model.insperity_id };
            for (int n = 0; n < 11; n++)
            {
                HrmsRepository.AddUserEmployeeMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }

        private void UpdateEmployeeMetaData(HrmsModel model, long id)
        {
            string[] varQueryArr1 = new string[11];
            string[] varFieldsName = new string[11] { "first_name", "last_name", "wp_capabilities", "billing_address_1", "billing_country", "billing_phone", "billing_address_2", "billing_city", "billing_state", "billing_postcode", "insperity_id" };
            string[] varFieldsValue = new string[11] { model.firstname, model.lastname, "employee", model.address1, model.country, model.phone, model.address2, model.city, model.state, model.zipcode, model.insperity_id };
            for (int n = 0; n < 11; n++)
            {
                HrmsRepository.UpdateUserEmployeeMetaData(model, id, varFieldsName[n], varFieldsValue[n]);
            }
        }
    }
}
