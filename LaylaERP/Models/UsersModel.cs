using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class UsersModel : PaggingModel
    {
        public string user_status { get; set; }
        public string Search { get; set; }
    }
}