using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CustomerServiceModel
    {
        public long order_id { get; set; }
        public long ticket_id { get; set; }   
        public long user_id { get; set; }
        public string json_data { get; set; }
        public string flag { get; set; }
        public string receipient_email { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public List<CustomerServiceFilesModel> files { get; set; }
    }
    public class CustomerServiceFilesModel
    {
        public string dataURL { get; set; }
        public string name { get; set; }
        public string type { get; set; }
    }
}