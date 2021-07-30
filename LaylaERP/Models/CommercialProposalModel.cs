using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class CommercialProposalModel
    {
        public string reff {get;set;}
        public int entity { get; set; }
        public int fk_vendor { get; set; }
        public string datec { get; set; }
        public string datep { get; set; }
        public string fin_validite { get; set; }
        public int fk_user_author { get; set; }
        public int fk_statut { get; set; }
        public double price { get; set; }
        public double remise_percent { get; set; }
        public double remise_absolue { get; set; }
        public double remise { get; set; }
        public int fk_cond_reglement { get; set; }
        public int fk_mode_reglement { get; set; }
        public string note_private { get; set; }
        public string note_public { get; set; }
        public string model_pdf { get; set; }
        public string last_main_doc { get; set; }
        public string date_livraison { get; set; }
        public int fk_shipping_method { get; set; }
        public int fk_warehouseIndex { get; set; }
        public int fk_availability { get; set; }
        public int fk_input_reason { get; set; }
        public int fk_incoterms { get; set; }
        public int IncotermsTypeID { get; set; }
       
    }
}
