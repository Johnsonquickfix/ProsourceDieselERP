namespace LaylaERP.UTILITIES.BoxPacker
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class WC_Boxpack
    {
        public const string VERSION = "1.0.2";

        private List<WC_Boxpack_Box> boxes;
        private List<WC_Boxpack_Item> items;
        private List<WC_Boxpack_Package> packages;
        private List<WC_Boxpack_Item> cannot_pack;

        private bool prefer_packets = false;

        public WC_Boxpack(Dictionary<string, bool> options = null)
        {
            if (options != null && options.ContainsKey("prefer_packets"))
            {
                prefer_packets = options["prefer_packets"];
            }

            boxes = new List<WC_Boxpack_Box>();
            items = new List<WC_Boxpack_Item>();
        }

        public void ClearItems()
        {
            items.Clear();
        }

        public void ClearBoxes()
        {
            boxes.Clear();
        }

        public void AddItem(double length, double width, double height, double weight, double value = 0, Dictionary<string, string> meta = null)
        {
            items.Add(new WC_Boxpack_Item(length, width, height, weight, value, meta));
        }

        public WC_Boxpack_Box AddBox(double length, double width, double height, double weight = 0, double max_weight = 0.0, string type = "")
        {
            WC_Boxpack_Box newBox = new WC_Boxpack_Box(length, width, height, weight, max_weight, type);
            boxes.Add(newBox);
            return newBox;
        }

        public List<WC_Boxpack_Package> GetPackages()
        {
            return packages ?? new List<WC_Boxpack_Package>();
        }

        public void Pack()
        {
            try
            {
                // We need items
                if (items == null || items.Count == 0) throw new Exception("No items to pack!");
                // Clear packages
                packages = new List<WC_Boxpack_Package>();
                // Order the boxes by volume
                boxes = OrderBoxes(boxes);

                if (boxes == null || boxes.Count == 0)
                {
                    cannot_pack = items;
                    items = new List<WC_Boxpack_Item>();
                }
                // Keep looping until packed
                while (items.Count > 0)
                {
                    items = OrderItems(items);
                    List<WC_Boxpack_Package> possiblePackages = new List<WC_Boxpack_Package>();
                    WC_Boxpack_Package bestPackage = null;
                    // Attempt to pack all items in each box
                    foreach (var box in boxes)
                    {
                        //var _items = items;
                        possiblePackages.Add(box.Pack(items));
                    }
                    // Find the best success rate
                    double bestPercent = 0;
                    foreach (var package in possiblePackages)
                    {
                        if (package.Percent > bestPercent)
                        {
                            bestPercent = package.Percent;
                        }
                    }

                    if (bestPercent == 0)
                    {
                        cannot_pack = items;
                        items = new List<WC_Boxpack_Item>();
                    }
                    else
                    {
                        // Get smallest box with best_percent
                        possiblePackages.Reverse();

                        foreach (var package in possiblePackages)
                        {
                            if (package.Percent == bestPercent)
                            {
                                bestPackage = package;
                                break;// Done packing
                            }
                        }
                        // Update items array
                        items = bestPackage.Unpacked;
                        // Store package
                        packages.Add(bestPackage);
                    }
                }
                // Items we cannot pack (by now) get packaged individually
                if (cannot_pack != null)
                {
                    foreach (var item in cannot_pack)
                    {
                        var package = new WC_Boxpack_Package();
                        package.id = "";
                        package.type = "box";
                        package.weight = item.GetWeight();
                        package.length = item.GetLength();
                        package.width = item.GetWidth();
                        package.height = item.GetHeight();
                        package.value = item.GetValue();
                        //package.Unpacked = true;
                        packages.Add(package);
                    }
                }
            }
            catch (Exception e)
            {
                // Display a packing error for admins
                if (true) // Check for admin privileges here
                {
                    Console.WriteLine("Packing error: " + e.Message);
                }
            }
        }

        private List<WC_Boxpack_Box> OrderBoxes(List<WC_Boxpack_Box> sort)
        {
            if (sort != null && sort.Count > 0)
            {
                sort.Sort(BoxSorting);
            }
            return sort;
        }

        private List<WC_Boxpack_Item> OrderItems(List<WC_Boxpack_Item> sort)
        {
            if (sort != null && sort.Count > 0)
            {
                sort.Sort(ItemSorting);
            }
            return sort;
        }

        public int ItemSorting(WC_Boxpack_Item a, WC_Boxpack_Item b)
        {
            if (a.GetVolume() == b.GetVolume())
            {
                if (a.GetWeight() == b.GetWeight())
                {
                    return 0;
                }
                return (a.GetWeight() < b.GetWeight()) ? 1 : -1;
            }
            return (a.GetVolume() < b.GetVolume()) ? 1 : -1;
        }

        public int BoxSorting(WC_Boxpack_Box a, WC_Boxpack_Box b)
        {
            if (prefer_packets)
            {
                bool aCheaperPackaging = new List<string> { "envelope", "packet" }.Contains(a.GetBoxType());
                bool bCheaperPackaging = new List<string> { "envelope", "packet" }.Contains(b.GetBoxType());

                if (aCheaperPackaging && !bCheaperPackaging)
                {
                    return 1;
                }

                if (bCheaperPackaging && !aCheaperPackaging)
                {
                    return -1;
                }
            }

            if (a.GetVolume() == b.GetVolume())
            {
                if (a.GetMaxWeight() == b.GetMaxWeight())
                {
                    return 0;
                }
                return (a.GetMaxWeight() < b.GetMaxWeight()) ? 1 : -1;
            }
            return (a.GetVolume() < b.GetVolume()) ? 1 : -1;
        }
    }
}