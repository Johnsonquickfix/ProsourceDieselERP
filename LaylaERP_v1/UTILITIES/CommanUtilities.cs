namespace LaylaERP.UTILITIES
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;


    public class OperatorModel
    {
        public long UserID { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public string EmailID { get; set; }
        public string UserType { get; set; }
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public string GetUrl { get; set; }
        public bool AuthorizeNet { get; set; }
        public bool Paypal { get; set; }
        public bool AmazonPay { get; set; }
        public bool Podium { get; set; }
        public bool CreditCustomer { get; set; }
        public string SenderEmailID { get; set; }
        public string sender_name { get; set; }
        public string GlobalEmail { get; set; }
        public string SenderEmailPwd { get; set; }
        public string SMTPServerName { get; set; }
        public string SMTPServerPortNo { get; set; }
        public bool SSL { get; set; }
        public string LoginIPAddress { get; set; }
        public string LoginMacAddress { get; set; }
        public string LoginToken { get; set; }
        public string PaypalClientId { get; set; }
        public string PaypalSecret { get; set; }
        public string PaypalSellerAccount { get; set; }
        public string AuthorizeAPILogin { get; set; }
        public string AuthorizeTransKey { get; set; }
        public string AuthorizeKey { get; set; }
        public string AmazonAPIId { get; set; }
        public string AmazonUser { get; set; }
        public string AmazonPwd { get; set; }
        public string TaxjarAPIId { get; set; }
        public string TaxjarUser { get; set; }
        public string TaxjarPwd { get; set; }
        public string podiumAPIKey { get; set; }
        public string podiumSecretKey { get; set; }
        public string podium_code { get; set; }
        public string podium_refresh_code { get; set; }

        // For Entity info
        public string CompanyName { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string address { get; set; }
        public string address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string postal_code { get; set; }
        public string country_code_phone { get; set; }
        public string phone_type { get; set; }
        public string user_mobile { get; set; }
        public string email { get; set; }
        public string website { get; set; }
        public string logo_url { get; set; }
        public string additional_notes { get; set; }
        public string po_email { get; set; }
        public int login_company_id { get; set; }
        public string user_companyid { get; set; }
        /// <summary>
        /// Public Klaviyo Clone API Key
        /// </summary>
        public string public_api_key { get; set; }
    }
    [Serializable]
    public class CommanUtilities
    {
        public static CommanUtilities Provider
        {
            get { return new CommanUtilities(); }
        }
        private string LoginUserKey = "LaylaERP_2021";
        private string LoginProvider = "Cookie";
        //private string LoginProvider = "Session";
        public OperatorModel GetCurrent()
        {
            OperatorModel operatorModel = new OperatorModel();
            if (LoginProvider == "Cookie")
            {
                if (!string.IsNullOrEmpty(WebHelper.GetCookie(LoginUserKey).ToString()))
                    operatorModel = Decrypt(WebHelper.GetCookie(LoginUserKey).ToString()).ToObject<OperatorModel>();
                else
                {
                    HttpContext.Current.Response.Write("<script language='javascript'> {alert('Session expired please login again.');top.window.location.href = top.window.location.origin + '/Home/Login' }</script>");
                }
            }
            else
            {
                operatorModel = Decrypt(WebHelper.GetSession(LoginUserKey).ToString()).ToObject<OperatorModel>();
            }
            return operatorModel;
        }
        public void AddCurrent(OperatorModel operatorModel)
        {
            if (LoginProvider == "Cookie")
            {
                WebHelper.WriteCookie(LoginUserKey, Encrypt(operatorModel.ToJson()), 480);
            }
            else
            {
                WebHelper.WriteSession(LoginUserKey, Encrypt(operatorModel.ToJson()));
            }
            //WebHelper.WriteCookie("MSP_mac", Md5.md5(Net.GetMacByNetworkInterface().ToJson(), 32));
            //WebHelper.WriteCookie("LaylaERP_licence", Licence.GetLicence());
        }
        public void RemoveCurrent()
        {
            if (LoginProvider == "Cookie")
            {
                WebHelper.RemoveCookie(LoginUserKey.Trim());
            }
            else
            {
                WebHelper.RemoveSession(LoginUserKey.Trim());
            }
        }

        /// <summary>
        /// Validate OTP
        /// </summary>
        public void AddOTP(int OTPValue)
        {
            WebHelper.WriteCookie("laylaERP_user_validate", Encrypt(OTPValue.ToString()), 10);
        }
        public string GetOTP()
        {
            string OTPValue = string.Empty;
            if (!string.IsNullOrEmpty(WebHelper.GetCookie("laylaERP_user_validate").ToString()))
                OTPValue = Decrypt(WebHelper.GetCookie("laylaERP_user_validate").ToString());
            return OTPValue;
        }

        #region Security Encryption
        private static string DESKey = "@LaylaERP_desencrypt_2021";
        #region ======== Encryption ========
        /// <summary>
        /// encryption
        /// </summary>
        /// <param name="Text"></param>
        /// <returns></returns>
        static string Encrypt(string Text)
        {
            return Encrypt(Text, DESKey);
        }
        /// <summary> 
        ///Encrypt data
        /// </summary> 
        /// <param name="Text"></param> 
        /// <param name="sKey"></param> 
        /// <returns></returns> 
        static string Encrypt(string Text, string sKey)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray;
            inputByteArray = Encoding.Default.GetBytes(Text);
            des.Key = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
            des.IV = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                ret.AppendFormat("{0:X2}", b);
            }
            return ret.ToString();
        }

        #endregion

        #region ======== Decrypt ========
        /// <summary>
        /// Decrypt
        /// </summary>
        /// <param name="Text"></param>
        /// <returns></returns>
        static string Decrypt(string Text)
        {
            if (!string.IsNullOrEmpty(Text))
            {
                return Decrypt(Text, DESKey);
            }
            else
            {
                return "";
            }
        }
        /// <summary> 
        /// Decrypt the data
        /// </summary> 
        /// <param name="Text"></param> 
        /// <param name="sKey"></param> 
        /// <returns></returns> 
        static string Decrypt(string Text, string sKey)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            int len;
            len = Text.Length / 2;
            byte[] inputByteArray = new byte[len];
            int x, i;
            for (x = 0; x < len; x++)
            {
                i = Convert.ToInt32(Text.Substring(x * 2, 2), 16);
                inputByteArray[x] = (byte)i;
            }
            des.Key = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
            des.IV = ASCIIEncoding.ASCII.GetBytes(System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sKey, "md5").Substring(0, 8));
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            return Encoding.Default.GetString(ms.ToArray());
        }

        #endregion
        #endregion
    }
    public class WebHelper
    {
        #region Session operation
        /// <summary>
        /// Write Session
        /// </summary>
        /// <typeparam name="T">Session key type</typeparam>
        /// <param name="key">Session key name</param>
        /// <param name="value">Session key</param>
        public static void WriteSession<T>(string key, T value)
        {
            if (string.IsNullOrEmpty(key))
                return;
            HttpContext.Current.Session[key] = value;
        }

        /// <summary>
        /// Write Session
        /// </summary>
        /// <param name="key">Session key name</param>
        /// <param name="value">Session key</param>
        public static void WriteSession(string key, string value)
        {
            WriteSession<string>(key, value);
        }

        /// <summary>
        /// Read the value of Session
        /// </summary>
        /// <param name="key">Session key name</param>        
        public static string GetSession(string key)
        {
            if (string.IsNullOrEmpty(key))
                return string.Empty;
            return HttpContext.Current.Session[key] as string;
        }
        /// <summary>
        /// Delete the specified Session
        /// </summary>
        /// <param name="key">Session key name</param>
        public static void RemoveSession(string key)
        {
            if (string.IsNullOrEmpty(key))
                return;
            HttpContext.Current.Session.Contents.Remove(key);
        }

        #endregion

        #region Cookie operation
        /// <summary>
        /// Write cookie value
        /// </summary>
        /// <param name="strName">name</param>
        /// <param name="strValue">value</param>
        public static void WriteCookie(string strName, string strValue)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[strName];
            if (cookie == null)
            {
                cookie = new HttpCookie(strName);
            }
            cookie.Value = strValue;
            HttpContext.Current.Response.AppendCookie(cookie);
        }
        /// <summary>
        /// Write cookie value
        /// </summary>
        /// <param name="strName">name</param>
        /// <param name="strValue">value</param>
        /// <param name="strValue">Expiration time (minutes)</param>
        public static void WriteCookie(string strName, string strValue, int expires)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[strName];
            if (cookie == null)
            {
                cookie = new HttpCookie(strName);
            }
            else
            {
                HttpContext.Current.Response.Cookies.Remove(strName);
                cookie = new HttpCookie(strName);
            }
            //cookie.Domain = HttpContext.Current.Request.Url.Host;
            cookie.Value = strValue;
            cookie.Expires = DateTime.Now.AddMinutes(expires);
            cookie.HttpOnly = true;
            cookie.Path = "/";
            HttpContext.Current.Response.AppendCookie(cookie);
            HttpContext.Current.Response.SetCookie(cookie);
        }
        /// <summary>
        /// Read cookie value
        /// </summary>
        /// <param name="strName">Name</param>
        /// <returns>cookie value</returns>
        public static string GetCookie(string strName)
        {
            if (HttpContext.Current.Request.Cookies != null && HttpContext.Current.Request.Cookies[strName] != null)
            {
                return HttpContext.Current.Request.Cookies[strName].Value.ToString();
            }
            return "";
        }
        /// <summary>
        /// Delete the cookie object
        /// </summary>
        /// <param name="CookiesName">Cookie object name</param>
        public static void RemoveCookie(string CookiesName)
        {
            HttpCookie objCookie = new HttpCookie(CookiesName.Trim());
            objCookie.Expires = DateTime.Now.AddYears(-5);
            HttpContext.Current.Response.Cookies.Add(objCookie);
        }
        #endregion
    }
    public static class Json
    {
        public static object ToJson(this string Json)
        {
            return Json == null ? null : JsonConvert.DeserializeObject(Json);
        }
        public static string ToJson(this object obj)
        {
            var timeConverter = new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd HH:mm:ss" };
            return JsonConvert.SerializeObject(obj, timeConverter);
        }
        public static string ToJson(this object obj, string datetimeformats)
        {
            var timeConverter = new IsoDateTimeConverter { DateTimeFormat = datetimeformats };
            return JsonConvert.SerializeObject(obj, timeConverter);
        }
        public static T ToObject<T>(this string Json)
        {
            return Json == null ? default(T) : JsonConvert.DeserializeObject<T>(Json);
        }
        public static List<T> ToList<T>(this string Json)
        {
            return Json == null ? null : JsonConvert.DeserializeObject<List<T>>(Json);
        }
        public static DataTable ToTable(this string Json)
        {
            return Json == null ? null : JsonConvert.DeserializeObject<DataTable>(Json);
        }
        public static JObject ToJObject(this string Json)
        {
            return Json == null ? JObject.Parse("{}") : JObject.Parse(Json.Replace("&nbsp;", ""));
        }
    }
}