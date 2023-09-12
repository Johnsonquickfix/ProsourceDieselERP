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

namespace LaylaERP_v1.Controllers
{
    public class EmailProfileController : Controller
    {
        // GET: EmailProfile
        public async Task<ActionResult> Inboxprofile()
        {
            try
            {
                // Create a folder named "inbox" under current directory
                // to save the email retrieved.
                string localInbox = string.Format("{0}inbox", Request.MapPath("~"));
                // If the folder is not existed, create it.
                if (!Directory.Exists(localInbox))
                {
                    Directory.CreateDirectory(localInbox);
                }

                using (var client = new ImapClient())
                {
                    // Create app password in Google account
                    // https://support.google.com/accounts/answer/185833?hl=en
                    // Gmail IMAP4 server is "imap.gmail.com"
                    client.Connect("imap.gmail.com", 993, true);

                    client.Authenticate("david.quickfix1@gmail.com", "beukxoqkukghwzvp");

                    // The Inbox folder is always available on all IMAP servers...
                    var inbox = client.Inbox;
                    inbox.Open(FolderAccess.ReadOnly);
                    //SearchQuery searchQuery = SearchQuery.FromContains("christison.quickfix@gmail.com").And(SearchQuery.SentSince(DateTime.Now.AddDays(-1)));
                    SearchQuery searchQuery = SearchQuery.SubjectContains("Test Mail 1");
                    var results = await inbox.SearchAsync(searchQuery);
                    foreach (var uniqueId in results)
                    {
                        var message = client.Inbox.GetMessage(uniqueId);
                        Console.WriteLine("Subject: {0}", message.Subject);
                        DateTime currentDateTime = DateTime.Now;
                        // Generate an unqiue email file name based on date time.
                        string fileName = string.Format("{0:000}-{1}-{2:000}.eml", uniqueId, currentDateTime.ToString("yyyyMMddHHmmss", new CultureInfo("en-US")), currentDateTime.Millisecond); 
                        string fullPath = string.Format("{0}\\{1}", localInbox, fileName);

                        // Save email to local disk
                        //message.WriteTo(fullPath);
                    }

                    //Console.WriteLine("Total messages: {0}", inbox.Count);
                    //Console.WriteLine("Recent messages: {0}", inbox.Recent);

                    //foreach (var uniqueId in results.UniqueIds)
                    //{
                    //    var message = client.Inbox.GetMessage(uniqueId);
                    //    Console.WriteLine("Subject: {0}", message.Subject);
                    //}

                    client.Disconnect(true);
                }

                


                //// Create app password in Google account
                //// https://support.google.com/accounts/answer/185833?hl=en
                //// Gmail IMAP4 server is "imap.gmail.com"
                //MailServer oServer = new MailServer("imap.gmail.com", "david.quickfix1@gmail.com", "beukxoqkukghwzvp", ServerProtocol.Imap4);

                //// Hotmail/MSN IMAP4 server is "outlook.office365.com"
                //// MailServer oServer = new MailServer("outlook.office365.com", "yourid@domain", "your password or app password", ServerProtocol.Imap4);

                //// Yahoo IMAP server is "imap.mail.yahoo.com"
                //// MailServer oServer = new MailServer("imap.mail.yahoo.com", "myid@yahoo.com", "yourpassword", ServerProtocol.Imap4);

                //// Enable SSL connection.
                //oServer.SSLConnection = true;

                //// Set 993 SSL port
                //oServer.Port = 993;

                //MailClient oClient = new MailClient("TryIt");

                //oClient.Connect(oServer);

                //// search emails that have:
                //// unread/new flag and received datetime is from now to latest 12 months
                //// and sender contains "support" and subject contains "test"

                //oClient.GetMailInfosParam.Reset();
                ////oClient.GetMailInfosParam.GetMailInfosOptions |= GetMailInfosOptionType.NewOnly;
                ////oClient.GetMailInfosParam.GetMailInfosOptions |= GetMailInfosOptionType.DateRange;
                ////oClient.GetMailInfosParam.GetMailInfosOptions |= GetMailInfosOptionType.OrderByDateTime;

                //oClient.GetMailInfosParam.SubjectContains = "Test Mail 1";
                ////oClient.GetMailInfosParam.SenderContains = "christison.quickfix@gmail.com";
                ////oClient.GetMailInfosParam.DateRange.SINCE = System.DateTime.Now.AddDays(-1);
                ////oClient.GetMailInfosParam.DateRange.BEFORE = System.DateTime.Now;

                //MailInfo[] infos = oClient.GetMailInfos();
                //Console.WriteLine("Total {0} email(s)\r\n", infos.Length);
                //for (int i = 0; i < infos.Length; i++)
                //{
                //    MailInfo info = infos[i];
                //    Console.WriteLine("Index: {0}; Size: {1}; UIDL: {2}", info.Index, info.Size, info.UIDL);

                //    // Receive email from IMAP4 server
                //    Mail oMail = oClient.GetMail(info);

                //    Console.WriteLine("From: {0}", oMail.From.ToString());
                //    Console.WriteLine("Subject: {0}\r\n", oMail.Subject);

                //    // Generate an unqiue email file name based on date time.
                //    string fileName = _generateFileName(i + 1);
                //    string fullPath = string.Format("{0}\\{1}", localInbox, fileName);

                //    // Save email to local disk
                //    oMail.SaveAs(fullPath, true);

                //    // Mark email as deleted from IMAP4 server.
                //    //oClient.Delete(info);
                //}

                //// Quit and expunge emails marked as deleted from IMAP4 server.
                //oClient.Quit();
                //Console.WriteLine("Completed!");
            }
            catch (Exception ep)
            {
                Console.WriteLine(ep.Message);
            }

            return View();
        }
        public ActionResult Sentprofile()
        {
            return View();
        }
        public ActionResult Draftprofile()
        {
            return View();
        }
        // Generate an unqiue email file name based on date time
        static string _generateFileName(int sequence)
        {
            DateTime currentDateTime = DateTime.Now;
            return string.Format("{0}-{1:000}-{2:000}.eml", currentDateTime.ToString("yyyyMMddHHmmss", new CultureInfo("en-US")), currentDateTime.Millisecond, sequence);
        }
    }
}