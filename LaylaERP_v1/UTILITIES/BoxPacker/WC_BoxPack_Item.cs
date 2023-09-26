namespace LaylaERP.UTILITIES.BoxPacker
{
    using System;
    using System.Collections.Generic;

    public class WC_Boxpack_Item
    {
        public double Weight { get; set; }
        public double Height { get; set; }
        public double Width { get; set; }
        public double Length { get; set; }
        public double Volume { get; set; }
        public double Value { get; set; }
        public Dictionary<string, string> Meta { get; set; }

        public WC_Boxpack_Item(double length, double width, double height, double weight, double value = 0, Dictionary<string, string> meta = null)
        {
            List<double> dimensions = new List<double> { length, width, height };
            dimensions.Sort();

            Length = dimensions[2];
            Width = dimensions[1];
            Height = dimensions[0];

            Volume = Width * Height * Length;
            Weight = weight;
            Value = value;
            Meta = meta ?? new Dictionary<string, string>();
        }

        public double GetVolume()
        {
            return Volume;
        }

        public double GetHeight()
        {
            return Height;
        }

        public double GetWidth()
        {
            return Width;
        }

        public double GetLength()
        {
            return Length;
        }

        public double GetWeight()
        {
            return Weight;
        }

        public double GetValue()
        {
            return Value;
        }

        public string GetMeta(string key = "")
        {
            if (key != "" && Meta.ContainsKey(key))
            {
                return Meta[key];
            }
            else
            {
                return null;
            }
        }

        public Dictionary<string, string> GetAllMeta()
        {
            return Meta;
        }
    }
}