namespace LaylaERP.BAL.qfk
{
    using DAL;
    using HtmlAgilityPack;
    using LaylaERP.Models.qfk.TrackAndIdentify;
    using Newtonsoft.Json;
    using System;
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.Text;

    public class MailTrakingRepository
    {
        public static string AddMailTrakingURL(string html, MailTracking request)
        {
            string open_url = string.Format("{0}/wf/open?upn=", ConfigurationManager.AppSettings["TrakingURL"]),
                click_url = string.Format("{0}/wf/click?upn=", ConfigurationManager.AppSettings["TrakingURL"]);
            try
            {
                string param = Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(request)));
                //Create an instance of HTML document
                HtmlDocument document = new HtmlDocument();
                document.LoadHtml(html);
                var imgNode = HtmlNode.CreateNode(string.Format("<img src=\"{0}{1}\" width=\"1\" height=\"1\" border=\"0\" style=\"height: 1px!important; width: 1px!important; border-width:0!important; margin-top:0!important; margin-bottom:0!important; margin-right:0!important; margin - left:0!important; padding-top:0!important; padding-bottom:0!important; padding-right:0!important; padding-left:0!important\"></a>", open_url, param));
                var body = document.DocumentNode.SelectSingleNode("//body");
                if (body != null) body.AppendChild(imgNode);
                else document.DocumentNode.AppendChild(imgNode); ;
                HtmlNodeCollection a_node = document.DocumentNode.SelectNodes("//a[@href]");
                //if (a_node != null)
                //{
                //    foreach (HtmlNode link in a_node)
                //    {
                //        if (!string.IsNullOrEmpty(link.Attributes["href"].Value) && link.Attributes["href"].Value != "#")
                //        {
                //            var parameters = System.Web.HttpUtility.ParseQueryString(new Uri(link.Attributes["href"].Value).Query);
                //            //request.url = link.Attributes["href"].Value + (!string.IsNullOrEmpty(parameters.ToString()) ? "&" : "?") + "_qkc=" + request.id + (!string.IsNullOrEmpty(request.utm_param) ? "&" : "") + request.utm_param;
                //            //param = Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(request)));
                //            link.Attributes["href"].Value = string.Format("{0}{1}", click_url, param);
                //        }
                //    }
                //}
                return document.DocumentNode.OuterHtml;
            }
            catch { }
            return html;
        }
    }
}