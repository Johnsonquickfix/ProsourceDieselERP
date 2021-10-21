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
        public DateTime datep { get; set; }
        public int fin_validite { get; set; }
        public int fk_user_author { get; set; }
        public int fk_statut { get; set; }
        public double price { get; set; }
        public double payment_term { get; set; }
        public double balance { get; set; }
        public double payment_type { get; set; }
        public int fk_cond_reglement { get; set; }
        public int fk_mode_reglement { get; set; }
        public string note_private { get; set; }
        public string note_public { get; set; }
        public string model_pdf { get; set; }
        public string last_main_doc { get; set; }
        public DateTime date_delivery { get; set; }
        public int fk_shipping_method { get; set; }
        public int fk_warehouseIndex { get; set; }
        public int fk_availability { get; set; }
        public int fk_input_reason { get; set; }
        public int fk_incoterms { get; set; }
        public int IncotermsTypeID { get; set; }
        public int VendorTypeID { get; set; }
        public string location_incoterms { get; set; }
        public int rowid { get; set; }
        public int validity_duration { get; set; }

    }
}
