using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MimeKit;
using MailKit;
using MailKit.Search;
using MailKit.Net.Imap;
using System.Threading.Tasks;
using System.Data;
using LaylaERP.BAL;
using LaylaERP.Models;
using Newtonsoft.Json;

namespace LaylaERP_v1.Controllers
{
    public class EmailProfileController : Controller
    {
        // GET: EmailProfile
        public ActionResult Inboxprofile()
        {
            try
            {
                FatchMails("I");                 
            }
            catch (Exception ep)
            {
                Console.WriteLine(ep.Message);
            }

            return View();
        }
        public ActionResult Sentprofile()
        {
            try
            {
                FatchMails("S");
                
            }
            catch (Exception ep)
            {
                Console.WriteLine(ep.Message);
            } 
            return View(); 
        }
        public ActionResult Draftprofile()
        {
            try
            {
                FatchMails("D");  
            }
            catch (Exception ep)
            {
                Console.WriteLine(ep.Message);
            }
            return View();
        }
        public ActionResult Compose()
        {             
            return View();
        }
        // Generate an unqiue email file name based on date time
        static string _generateFileName(int sequence)
        {
            DateTime currentDateTime = DateTime.Now;
            return string.Format("{0}-{1:000}-{2:000}.eml", currentDateTime.ToString("yyyyMMddHHmmss", new CultureInfo("en-US")), currentDateTime.Millisecond, sequence);
        }
        static bool IsIncomingMessage(MimeMessage message)
        {
            // Determine if the message is incoming (received) or outgoing (sent)
            // You can customize this logic based on your needs
            // For example, you can check if the "To" header contains your email address
            // and if the "From" header does not contain your email address
            return message.To.Any(recipient => recipient.ToString().Contains("info@new.prosourcediesel.com")) &&
                   !message.From.Any(sender => sender.ToString().Contains("info@new.prosourcediesel.com"));
        }
        static void ListFolders(IMailFolder folder)
        {
            folder.Open(FolderAccess.ReadOnly);
            foreach (var subfolder in folder.GetSubfolders())
            {
                Console.WriteLine(subfolder.Name);
            }
        }


        static void FatchMails(string type)
        {

            DataTable dt = EmailProfileRepository.email_detils(1);
            string server_name = null, user_id = null, password = null, email_address = null;
            int port = 0;bool is_seen = false;
            if (dt != null && dt.Rows.Count > 0)
            {
                server_name = dt.Rows[0]["imap4_server"].ToString();user_id = dt.Rows[0]["imapuser_name"].ToString();password = dt.Rows[0]["imapuser_password"].ToString();port = Convert.ToInt32(dt.Rows[0]["imap_port"].ToString());
            }
            using (var client = new ImapClient())
            {
                client.Connect(server_name, port, true);
                client.Authenticate(user_id, password);
                // The Inbox folder is always available on all IMAP servers...
                IMailFolder mail = null;
                var personal = client.GetFolder(client.PersonalNamespaces[0]);
                // List all folders in the personal namespace (e.g., INBOX, Sent, Drafts, etc.)
                ListFolders(personal);
                if (type == "I")
                    mail = client.Inbox;
                else if (type == "S")
                {
                    mail = personal.GetSubfolder("Sent");
                }
                else
                {
                    mail = personal.GetSubfolder("Drafts");

                }
                mail.Open(FolderAccess.ReadOnly);
                SearchQuery searchQuery = SearchQuery.SentSince(DateTime.Now);
                //var results = mail.Search(SearchQuery.All); // No filter applied, retrieves all emails
                var results = mail.Search(searchQuery);
                var items = mail.Fetch(results, MessageSummaryItems.Full | MessageSummaryItems.BodyStructure).Reverse();
                foreach (var item in items)
                {
                    if (item.Flags.Value.HasFlag(MessageFlags.Seen))
                        is_seen = true;
                    else
                        is_seen = false;
                    var message = mail.GetMessage(item.UniqueId);
                     
                    var fromAddress = message.From[0] as MailboxAddress; 
                    var _body = message.HtmlBody;
                    if (type == "I")
                        email_address = fromAddress.Address;  
                   else
                        email_address = fromAddress.Address;  
                    //bool isIncoming = IsIncomingMessage(message);
                    //if (!string.IsNullOrEmpty(_body))
                    if (_body == null)
                        _body = message.TextBody;
                    int ID = EmailProfileRepository.AddMails(1, email_address, message.Subject, type, is_seen, false, _body, message.TextBody,message.MessageId, message.InReplyTo);

                }
                client.Disconnect(true);
            }
            //return Content("text/plain");
        }
        [HttpGet]
        public JsonResult GetList(JqDataTableModel model)
        {
            string result = string.Empty;
            int TotalRecord = 0;
            try
            {
                FatchMails(model.strValue2);

                DataTable dt = EmailProfileRepository.GetmailList(model.strValue1,model.strValue2, model.strValue3, model.strValue4, model.sSearch, model.iDisplayStart, model.iDisplayLength,  out TotalRecord, model.sSortColName, model.sSortDir_0);
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(new { sEcho = model.sEcho, recordsTotal = TotalRecord, recordsFiltered = TotalRecord, aaData = result }, 0);
        }

        [HttpPost]
        public JsonResult GetmailCount(SearchModel model)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = EmailProfileRepository.GetmailCount();
                result = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            catch { }
            return Json(result, 0);
        }

    }
}