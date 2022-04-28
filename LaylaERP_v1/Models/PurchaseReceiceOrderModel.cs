using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LaylaERP.Models
{
    public class PurchaseReceiceOrderModel : PaggingModel
    {
        
        public long RowID { get; set; }
        public string PONo { get; set; }
        public long VendorID { get; set; }
        public string VendorBillNo { get; set; }
        public int PaymentTerms { get; set; }
        public int Balancedays { get; set; }
        public int PaymentType { get; set; }
        public int WarehouseID { get; set; }
        public int WarehousepoID { get; set; }
        public string Planneddateofdelivery { get; set; }
        public int IncotermsTypeID { get; set; }
        public int Status { get; set; }
        public string NotePrivate { get; set; }
        public string NotePublic { get; set; }
        public int IncotermType { get; set; }
        public string Incoterms { get; set; }
        public string user_status { get; set; }
        public long LoginID { get; set; }
        public string Search { get; set; }
        public double total_tva { get; set; }
        public double discount { get; set; }
        public double localtax1 { get; set; }
        public double localtax2 { get; set; }
        public double total_ht { get; set; }
        public double total_ttc { get; set; }
        public long IDRec { get; set; }
        public int fk_status { get; set; }
        public double total_avgcost { get; set; }
        public List<PurchaseReceiceOrderProductsModel> PurchaseOrderProducts { get; set; }
    }

    public class PurchaseReceiceOrderProductsModel
    {
        public long rowid { get; set; }
        public long fk_purchase { get; set; }
        public long fk_parent_line { get; set; }
        public long fk_product { get; set; }
        public string product_sku { get; set; }
        public string product_label { get; set; }
        public string description { get; set; }
        public string vat_src_code { get; set; }
        public decimal tva_tx { get; set; }
        public decimal localtax1_tx { get; set; }
        public string localtax1_type { get; set; }
        public decimal localtax2_tx { get; set; }
        public string localtax2_type { get; set; }
        public decimal qty { get; set; }
        public decimal Recqty { get; set; }
        public decimal discount_percent { get; set; }
        public decimal discount { get; set; }
        public decimal subprice { get; set; }
        public decimal total_ht { get; set; }
        public decimal total_tva { get; set; }
        public decimal total_localtax1 { get; set; }
        public decimal total_localtax2 { get; set; }
        public decimal total_ttc { get; set; }
        public int product_type { get; set; }
        public int info_bits { get; set; }
        public int special_code { get; set; }
        public int rang { get; set; }
        public string date_start { get; set; }
        public string date_end { get; set; }
        public decimal Remqty { get; set; }
        public decimal ItemRemqty { get; set; }
        public double total_avgcost { get; set; }
    }
}