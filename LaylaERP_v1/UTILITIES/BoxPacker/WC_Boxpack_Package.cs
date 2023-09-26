namespace LaylaERP.UTILITIES.BoxPacker
{
    using System;
    using System.Collections.Generic;

    public class WC_Boxpack_Package
    {
        public string id = "";
        public double weight;
        public double max_weight = 0;
        public double outer_height;
        public double outer_width;
        public double outer_length;
        public double height;
        public double width;
        public double length;
        public double packed_height;
        public double? maybe_packed_height = null;
        public double packed_width;
        public double? maybe_packed_width = null;
        public double packed_length;
        public double? maybe_packed_length = null;
        public double volume;
        public double value;
        public double Percent { get; set; }
        public List<WC_Boxpack_Item> Unpacked { get; set; }
        public List<WC_Boxpack_Item> Packed { get; set; }
        public List<string> valid_types = new List<string> { "box", "tube", "envelope", "packet" };
        public string type = "box";

        public WC_Boxpack_Package() { }
        public WC_Boxpack_Package(double length, double width, double height, double weight = 0.0, double max_weight = 0.0, string type = "box")
        {
            List<double> dimensions = new List<double> { length, width, height };
            dimensions.Sort();

            outer_length = this.length = dimensions[2];
            outer_width = this.width = dimensions[1];
            outer_height = this.height = dimensions[0];
            this.weight = weight;
            this.max_weight = max_weight;

            if (valid_types.Contains(type))
            {
                this.type = type;
            }
        }

    }
}