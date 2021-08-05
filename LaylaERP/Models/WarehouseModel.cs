﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class WarehouseModel: PaggingModel
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
        public string city { get; set; }
        public string country { get; set; }
        public int fk_department { get; set; }
        public int fk_pays { get; set; }
        public string phone { get; set; }
        public string fax { get; set; }
        public int statut { get; set; }
        public int fk_user_author { get; set; }
        public string model_pdf { get; set; }
        public string import_key { get; set; }
        public string address1 { get; set; }
        public int fk_parent { get; set; }
        public int status { get; set; }
        public string user_status { get; set; }
        public string Search { get; set; }



        //movement models

        public int fk_product { get; set; }
        public int fk_entrepot { get; set; }
        public double value { get; set; }
        public int price { get; set; }
        public int type_mouvement { get; set; }
        public string label { get; set; }
        public string inventorycode { get; set; }
        public int fk_projet { get; set; }
        public int fk_origin { get; set; }
        public string origintype { get; set; }
        public string fk_entrepottarget { get; set; }
        public int product_price { get; set; }

        //new 
        public string mydate { get; set; }

    }
}