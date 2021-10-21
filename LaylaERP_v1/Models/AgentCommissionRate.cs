using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class AgentCommissionRate
    {
        public int id { get; set; }
        public float AOV_Range1 { get; set; }
        public float AOV_Range2 { get; set; }
        public float Comm_Rate { get; set; }
    }
}