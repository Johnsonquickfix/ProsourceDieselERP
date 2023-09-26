namespace LaylaERP.UTILITIES.BoxPacker
{
    using System;
    using System.Collections.Generic;

    public class WC_Boxpack_Box
    {
        private string id = "";
        private double weight;
        private double max_weight = 0;
        private double outer_height;
        private double outer_width;
        private double outer_length;
        private double height;
        private double width;
        private double length;
        private double packed_height;
        private double? maybe_packed_height = null;
        private double packed_width;
        private double? maybe_packed_width = null;
        private double packed_length;
        private double? maybe_packed_length = null;
        private double volume;
        private List<string> valid_types = new List<string> { "box", "tube", "envelope", "packet" };
        private string type = "box";

        public WC_Boxpack_Box(double length, double width, double height, double weight = 0.0, double max_weight = 0.0, string type = "box")
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

        public void SetId(string id)
        {
            this.id = id;
        }

        public void SetVolume(double volume)
        {
            this.volume = volume;
        }

        public string GetBoxType()
        {
            return type;
        }

        public void SetBoxType(string type)
        {
            if (valid_types.Contains(type))
            {
                this.type = type;
            }
        }

        public double GetMaxWeight()
        {
            return max_weight;
        }

        public void SetMaxWeight(double weight)
        {
            max_weight = weight;
        }

        public void SetInnerDimensions(double length, double width, double height)
        {
            List<double> dimensions = new List<double> { length, width, height };
            dimensions.Sort();

            this.length = dimensions[2];
            this.width = dimensions[1];
            this.height = dimensions[0];
        }

        public bool CanFit(WC_Boxpack_Item item)
        {
            switch (type)
            {
                case "tube":
                    bool canFit = (length >= item.GetLength() && width >= item.GetWidth() && height >= item.GetHeight() && item.GetVolume() <= volume) && item.GetLength() >= ((item.GetWidth() + height) * 2);
                    return canFit;
                case "packet":
                    canFit = (packed_length >= item.GetLength() && packed_width >= item.GetWidth() && item.GetVolume() <= volume);
                    if (canFit && item.GetHeight() > packed_height)
                    {
                        maybe_packed_height = item.GetHeight();
                        maybe_packed_length = packed_length - (maybe_packed_height - height);
                        maybe_packed_width = packed_width - (maybe_packed_height - height);
                        canFit = (maybe_packed_height < maybe_packed_width && maybe_packed_length >= item.GetLength() && maybe_packed_width >= item.GetWidth());
                    }
                    return canFit;
                default:
                    return (length >= item.GetLength() && width >= item.GetWidth() && height >= item.GetHeight() && item.GetVolume() <= volume);
            }
        }

        private void ResetPackedDimensions()
        {
            packed_length = length;
            packed_width = width;
            packed_height = height;
        }

        public WC_Boxpack_Package Pack(List<WC_Boxpack_Item> items)
        {
            List<WC_Boxpack_Item> packed = new List<WC_Boxpack_Item>();
            List<WC_Boxpack_Item> unpacked = new List<WC_Boxpack_Item>();
            double packed_weight = weight;
            double packed_volume = 0;
            double packed_value = 0;

            ResetPackedDimensions();

            //while (items.Count > 0)
            foreach (WC_Boxpack_Item item in items)
            {
                //WC_Boxpack_Item item = items[0];
                //items.RemoveAt(0);
                // Check dimensions
                //if (!CanFit(item))
                if (!CanFit(item))
                {
                    unpacked.Add(item);
                    continue;
                }
                // Check max weight
                if ((packed_weight + item.GetWeight()) > max_weight && max_weight > 0)
                {
                    unpacked.Add(item);
                    continue;
                }
                // Check volume
                if ((packed_volume + item.GetVolume()) > volume)
                {
                    unpacked.Add(item);
                    continue;
                }

                packed.Add(item);
                packed_volume += item.GetVolume();
                packed_weight += item.GetWeight();
                packed_value += item.GetValue();

                if (maybe_packed_height != null)
                {
                    packed_height = maybe_packed_height.HasValue ? maybe_packed_height.Value : 0;
                    packed_length = maybe_packed_length.HasValue ? maybe_packed_length.Value : 0;
                    packed_width = maybe_packed_width.HasValue ? maybe_packed_width.Value : 0;
                    maybe_packed_height = null;
                    maybe_packed_length = null;
                    maybe_packed_width = null;
                }
            }

            double unpacked_weight = 0;
            double unpacked_volume = 0;
            foreach (WC_Boxpack_Item item in unpacked)
            {
                unpacked_weight += item.GetWeight();
                unpacked_volume += item.GetVolume();
            }

            WC_Boxpack_Package package = new WC_Boxpack_Package();
            //package.Id = id;
            //package.Type = type;
            //package.Packed = packed;
            //package.Unpacked = unpacked;
            //package.Weight = packed_weight;
            //package.Volume = packed_volume;
            //package.Length = outer_length;
            //package.Width = outer_width;
            //package.Height = outer_height;
            //package.Value = packed_value;

            package.id = id;
            package.type = type;
            package.Packed = packed;
            package.Unpacked = unpacked;
            package.weight = packed_weight;
            package.volume = packed_volume;
            package.length = outer_length;
            package.weight = outer_width;
            package.height = outer_height;
            package.value = packed_value;

            double? packed_weight_ratio = null;
            double? packed_volume_ratio = null;
            double? packed_weight_to_compare = packed_weight - weight;

            if ((packed_weight_to_compare + unpacked_weight) > 0)
            {
                packed_weight_ratio = packed_weight_to_compare / (packed_weight_to_compare + unpacked_weight);
            }
            if ((packed_volume + unpacked_volume) > 0)
            {
                packed_volume_ratio = packed_volume / (packed_volume + unpacked_volume);
            }

            if (packed_weight_ratio == null && packed_volume_ratio == null)
            {
                package.Percent = (packed.Count / (unpacked.Count + packed.Count)) * 100;
            }
            else if (packed_weight_ratio == null)
            {
                package.Percent = packed_volume_ratio.Value * 100;
            }
            else if (packed_volume_ratio == null)
            {
                package.Percent = packed_weight_ratio.Value * 100;
            }
            else
            {
                package.Percent = packed_weight_ratio.Value * packed_volume_ratio.Value * 100;
            }

            return package;
        }

        public double GetVolume()
        {
            //if (volume != 0)
            //{
            //    return volume;
            //}
            //else
            {
                return height * width * length;
            }
        }

        public double GetHeight()
        {
            return height;
        }

        public double GetWidth()
        {
            return width;
        }

        public double GetLength()
        {
            return length;
        }

        public double GetWeight()
        {
            return weight;
        }

        public double GetOuterHeight()
        {
            return outer_height;
        }

        public double GetOuterWidth()
        {
            return outer_width;
        }

        public double GetOuterLength()
        {
            return outer_length;
        }

        public double GetPackedHeight()
        {
            return packed_height;
        }

        public double GetPackedWidth()
        {
            return packed_width;
        }

        public double GetPackedLength()
        {
            return packed_length;
        }
    }
}