using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP_v1.BAL
{
    public class ImportOrderaffirmModel
    {
        public string order_id { get; set; }
        public string transaction_id { get; set; }
        public string charge_created_date { get; set; }
        public string event_type { get; set; }
        public string charge_id { get; set; }        
        public decimal total_settled { get; set; }
        public decimal fees { get; set; }
    }
}