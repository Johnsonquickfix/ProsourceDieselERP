namespace LaylaERP.BAL.qfk
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using DAL;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.IO;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web;
    using System.Windows.Forms;

    public class EmailTemplatesRepository
    {
        public static string TemplateAdd(string flag, long company_id, long user_id, long id, string json_data, string html_data)
        {
            string str = "{}";
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", flag),
                    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                    id > 0 ? new SqlParameter("@id",id) : new SqlParameter("@id",DBNull.Value),
                    user_id > 0 ? new SqlParameter("@user_id",user_id) : new SqlParameter("@user_id", DBNull.Value),
                    !string.IsNullOrEmpty(json_data) ? new SqlParameter("@json_data",json_data) :  new SqlParameter("@json_data",DBNull.Value),
                    !string.IsNullOrEmpty(html_data) ? new SqlParameter("@html_data",html_data) :  new SqlParameter("@html_data",DBNull.Value),
                };
                str = SQLHelper.ExecuteReaderReturnJSON("qfk_templates_search", parameters).ToString();
                try
                {
                    if (!string.IsNullOrEmpty(html_data))
                    {
                        var _json = JsonConvert.DeserializeObject<JObject>(str);
                        ConvertHtmlToImage(_json["id"].ToString(), (_json["thumbnail_url"] != null ? _json["thumbnail_url"].ToString() : ""), html_data);
                    }
                }
                catch { }
            }
            catch { throw; }
            return str;
        }

        public static DataTable TemplatesList(long company_id, string search, int pageno, int pagesize, string sortcol = "created_on", string sortdir = "desc", string flag = "lists")
        {
            DataTable dt;
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag",flag),
                    new SqlParameter("@company_id", company_id),
                    !string.IsNullOrEmpty(search) ? new SqlParameter("@search", search) : new SqlParameter("@search", DBNull.Value),
                    new SqlParameter("@pageno", pageno),
                    new SqlParameter("@pagesize", pagesize),
                    new SqlParameter("@sortcol", sortcol),
                    new SqlParameter("@sortdir", sortdir)
                };
                dt = SQLHelper.ExecuteDataTable("qfk_templates_search", parameters);
            }
            catch { throw; }
            return dt;
        }

        public static DataTable Templateinfo(long company_id, long id)
        {
            DataTable dataTable = new DataTable();
            try
            {
                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "get"),
                    company_id > 0 ? new SqlParameter("@company_id",company_id) : new SqlParameter("@company_id",DBNull.Value),
                    id > 0 ? new SqlParameter("@id",id) : new SqlParameter("@id",DBNull.Value),
                };
                dataTable = SQLHelper.ExecuteDataTable("qfk_templates_search", parameters);
            }
            catch { throw; }
            return dataTable;
        }

        public static void ConvertHtmlToImage(string id, string image_url, string sHTML)
        {
            string path = HttpContext.Current.Server.MapPath(@"/Uploads/Template"), file_name = string.Format("{0}.png", id);
            //file_name = string.Format("{0}.Png", Guid.NewGuid())
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            if (File.Exists(HttpContext.Current.Server.MapPath(image_url))) File.Delete(HttpContext.Current.Server.MapPath(image_url));

            var th = new Thread(() =>
            {
                var webB = new WebBrowser();
                webB.ScrollBarsEnabled = false;
                webB.IsWebBrowserContextMenuEnabled = true;
                webB.AllowNavigation = true;
                webB.DocumentCompleted += webBrowserDocumentCompleted;
                webB.DocumentText = sHTML;
                webB.Name = string.Format("{0}/{1}", path, file_name);
                webB.AccessibleDescription = string.Format("/Uploads/Template/{0}", file_name);
                webB.AccessibleName = id;
                webB.Width = 800;
                webB.Height = 10000;
                Application.Run();
            });
            th.SetApartmentState(ApartmentState.STA);
            th.Start();
            Task.Run(() => th);
            Task.WaitAll();
        }
        static void webBrowserDocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            var webB = (WebBrowser)sender;
            //int w = 100, h = 100;
            var w = webB.Document.Body.ScrollRectangle.Width;
            var h = webB.Document.Body.ScrollRectangle.Height;
            using (Bitmap bitmap = new Bitmap(w, h))
            {
                webB.DrawToBitmap(bitmap, new Rectangle(0, 0, bitmap.Width, bitmap.Height));
                bitmap.Save(webB.Name, ImageFormat.Jpeg);

                SqlParameter[] parameters =
                {
                    new SqlParameter("@flag", "image"),
                    new SqlParameter("@id",webB.AccessibleName),
                    new SqlParameter("@html_data",webB.AccessibleDescription)
                };
                SQLHelper.ExecuteReaderReturnJSON("qfk_templates_search", parameters).ToString();
            }
        }
    }
}