using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.UTILITIES
{
    public class CommonDate
    {
        public static DateTime CurrentDate()
        {            
            return DateTime.UtcNow.AddMinutes(-420);
        }
        public static DateTime UtcDate()
        {
            return DateTime.UtcNow;
        }
    }
}