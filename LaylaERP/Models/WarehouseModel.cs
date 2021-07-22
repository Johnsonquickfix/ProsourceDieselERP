using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class WarehouseModel
    {
        public int rowid { get; set; }
        public string reff { get; set; }
        public DateTime datec { get; set; }
        public DateTime tms { get; set; }
        public int entity { get; set; }
        public int fk_project { get; set; }
        public string description { get; set; }
        public string lieu { get; set; }
        public string address { get; set; }
        public string zip { get; set; }
        public string town { get; set; }
        public string country { get; set; }
        public int fk_department { get; set; }
        public int fk_pays { get; set; }
        public string phone { get; set; }
        public string fax { get; set; }
        public int statut { get; set; }
        public int fk_user_author { get; set; }
        public string model_pdf { get; set; }
        public string import_key { get; set; }
        public int fk_parent { get; set; }
    }
}