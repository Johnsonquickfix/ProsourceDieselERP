namespace LaylaERP.UTILITIES
{
    using System.Collections.Generic;
    using System.Net;
    using System.Net.NetworkInformation;
    using System.Net.Sockets;
    using System.Text;
    using System.Web;

    public class Net
    {
        #region Ip (Get Ip)
        /// <summary>
        /// Get Ip
        /// </summary>
        public static string Ip
        {
            get
            {
                var result = string.Empty;
                if (HttpContext.Current != null)
                    result = GetWebClientIp();
                if (string.IsNullOrEmpty(result))
                    result = GetLanIp();
                return result;
            }
        }

        /// <summary>
        /// Get the Ip for the web client
        /// </summary>
        private static string GetWebClientIp()
        {
            var ip = GetWebRemoteIp();
            foreach (var hostAddress in Dns.GetHostAddresses(ip))
            {
                if (hostAddress.AddressFamily == AddressFamily.InterNetwork)
                    return hostAddress.ToString();
            }
            return string.Empty;
        }

        /// <summary>
        /// Get Web Remote Ip
        /// </summary>
        private static string GetWebRemoteIp()
        {
            return HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        }

        /// <summary>
        /// Get LAN IP
        /// </summary>
        private static string GetLanIp()
        {
            foreach (var hostAddress in Dns.GetHostAddresses(Dns.GetHostName()))
            {
                if (hostAddress.AddressFamily == AddressFamily.InterNetwork)
                    return hostAddress.ToString();
            }
            return string.Empty;
        }

        #endregion

        #region Host (get the host name)

        /// <summary>
        /// Get the host name
        /// </summary>
        public static string Host
        {
            get
            {
                return HttpContext.Current == null ? Dns.GetHostName() : GetWebClientHostName();
            }
        }

        /// <summary>
        /// Get the web client host name
        /// </summary>
        private static string GetWebClientHostName()
        {
            if (!HttpContext.Current.Request.IsLocal)
                return string.Empty;
            var ip = GetWebRemoteIp();
            var result = Dns.GetHostEntry(IPAddress.Parse(ip)).HostName;
            if (result == "localhost.localdomain")
                result = Dns.GetHostName();
            return result;
        }

        #endregion

        #region Get the mac address
        /// <summary>
        /// Returns an object that describes the network interface on the local computer (network interface, also known as a network adapter).
        /// </summary>
        /// <returns></returns>
        public static NetworkInterface[] NetCardInfo()
        {
            return NetworkInterface.GetAllNetworkInterfaces();
        }
        ///<summary>
        /// Read network card Mac through NetworkInterface
        ///</summary>
        ///<returns></returns>
        public static List<string> GetMacByNetworkInterface()
        {
            List<string> macs = new List<string>();
            NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface ni in interfaces)
            {
                macs.Add(ni.GetPhysicalAddress().ToString());
            }
            return macs;
        }
        #endregion

        #region Ip City (Get Ip City)
        /// <summary>
        /// Get IP address information
        /// </summary>
        /// <param name="ip"></param>
        /// <returns></returns>
        //public static string GetLocation(string ip)
        //{
        //    string res = "";
        //    try
        //    {
        //        string url = "http://apis.juhe.cn/ip/ip2addr?ip=" + ip + "&dtype=json&key=b39857e36bee7a305d55cdb113a9d725";
        //        res = HttpMethods.HttpGet(url);
        //        var resjson = res.ToObject<objex>();
        //        res = resjson.result.area + " " + resjson.result.location;
        //    }
        //    catch
        //    {
        //        res = "";
        //    }
        //    if (!string.IsNullOrEmpty(res))
        //    {
        //        return res;
        //    }
        //    try
        //    {
        //        string url = "https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=" + ip + "&resource_id=6006&ie=utf8&oe=gbk&format=json";
        //        res = HttpMethods.HttpGet(url, Encoding.GetEncoding("GBK"));
        //        var resjson = res.ToObject<obj>();
        //        res = resjson.data[0].location;
        //    }
        //    catch
        //    {
        //        res = "";
        //    }
        //    return res;
        //}
        /// <summary>
        /// Baidu interface
        /// </summary>
        public class obj
        {
            public List<dataone> data { get; set; }
        }
        public class dataone
        {
            public string location { get; set; }
        }
        /// <summary>
        /// Aggregate data
        /// </summary>
        public class objex
        {
            public string resultcode { get; set; }
            public dataoneex result { get; set; }
            public string reason { get; set; }
            public string error_code { get; set; }
        }
        public class dataoneex
        {
            public string area { get; set; }
            public string location { get; set; }
        }
        #endregion

        #region Browser (Get Browser Information)
        /// <summary>
        /// Get browser information
        /// </summary>
        public static string Browser
        {
            get
            {
                if (HttpContext.Current == null)
                    return string.Empty;
                var browser = HttpContext.Current.Request.Browser;
                return string.Format("{0} {1}", browser.Browser, browser.Version);
            }
        }
        /// <summary>
        /// Get browser information with Details
        /// </summary>
        public static string BrowserInfo
        {
            get
            {
                if (HttpContext.Current == null)
                    return string.Empty;
                var browser = HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"].Trim();
                return string.Format("{0}", browser);
            }
        }
        #endregion
    }    
}
