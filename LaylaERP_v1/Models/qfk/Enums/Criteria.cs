namespace LaylaERP.Models.qfk.Enums
{
    using System.Collections.Generic;

    public class Criteria
    {
        public class KeySets
        {
            public string value { get; set; }
            public string label { get; set; }
            public bool selected { get; set; }
            public bool disabled { get; set; }
        }
        public static Dictionary<string, string> CriteriaType()
        {
            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("customer-statistic-value", "What someone has done (or not done)");
            pairs.Add("customer-attribute", "Properties about someone");
            pairs.Add("customer-location", "If someone is or is not within the EU (GDPR)");
            //pairs.Add("customer-location", "If someone is or is not within the country");
            //pairs.Add("-", "Someone's proximity to a location");
            pairs.Add("customer-group-membership", "If someone is in or not in a list");
            pairs.Add("customer-exclusion", "If someone is or is not suppressed for email");
            //pairs.Add("-", "If someone is or is not consented to receive SMS");
            //pairs.Add("-", "Predictive analytics about someone");
            return pairs;
        }
        public static List<KeySets> CriteriaOperator(string CriteriaType = "all")
        {
            List<KeySets> pairs = new List<KeySets>();
            if (CriteriaType.ToLower().Trim().Equals("customer-statistic-value"))
            {
                pairs.Add(new KeySets { value= "gt-zero", label = "at least once", selected = true });
                pairs.Add(new KeySets { value = "eq-zero", label = "zero times" });
                pairs.Add(new KeySets { value = "eq", label = "equals"});
                pairs.Add(new KeySets { value = "neq", label = "doesn't equal" });
                pairs.Add(new KeySets { value = "gte", label = "is at least" });
                pairs.Add(new KeySets { value = "gt", label = "is greater than" });
                pairs.Add(new KeySets { value = "lt", label = "is less than" });
                pairs.Add(new KeySets { value = "lte", label = "is at most" });
            }
            else if(CriteriaType.ToLower().Trim().Equals("customer-location") || CriteriaType.ToLower().Trim().Equals("customer-group-membership"))
            {
                pairs.Add(new KeySets { value = "eq", label = "is", selected = true });
                pairs.Add(new KeySets { value = "neq", label = "is not" });
            }
            else if (CriteriaType.ToLower().Trim().Equals("customer-attribute"))
            {
                pairs.Add(new KeySets { value = "eq", label = "equals", selected = true });
                pairs.Add(new KeySets { value = "neq", label = "doesn't equal" });
                pairs.Add(new KeySets { value = "contains", label = "contains" });
                pairs.Add(new KeySets { value = "ncontains", label = "doesn't contain" });
                pairs.Add(new KeySets { value = "in", label = "is in" });
                pairs.Add(new KeySets { value = "nin", label = "is not in" });
                pairs.Add(new KeySets { value = "starts-with", label = "starts with" });
                pairs.Add(new KeySets { value = "nstarts-with", label = "doesn't start with" });
                pairs.Add(new KeySets { value = "ends-with", label = "ends with" });
                pairs.Add(new KeySets { value = "nends-with", label = "doesn't ends with" });
                pairs.Add(new KeySets { value = "exists", label = "is set" });
                pairs.Add(new KeySets { value = "nexists", label = "is not set" });
            }
            else
            {
                pairs.Add(new KeySets { value = "eq", label = "is", selected = true });
                pairs.Add(new KeySets { value = "neq", label = "is not" });
            }
            //at least once, zero times, equals, doesn't equal, is at least, is greater than, is less than, is at most
            return pairs;
        }
        public static List<KeySets> CriteriaTimeframe(string CriteriaType = "all")
        {
            List<KeySets> pairs = new List<KeySets>();
            if (CriteriaType.ToLower().Trim().Equals("customer-statistic-value"))
            {
                pairs.Add(new KeySets { value = "alltime", label = "over all time", selected = true });
                pairs.Add(new KeySets { value = "in-the-last", label = "in the last" });
                pairs.Add(new KeySets { value = "between", label = "between" });
                pairs.Add(new KeySets { value = "before", label = "before" });
                pairs.Add(new KeySets { value = "after", label = "after" });
                pairs.Add(new KeySets { value = "between-static", label = "between dates" });
            }
            else if (CriteriaType.ToLower().Trim().Equals("customer-group-membership"))
            {
                pairs.Add(new KeySets { value = "in-the-last", label = "in the last", selected = true });
                pairs.Add(new KeySets { value = "more-than", label = "more than" });
                pairs.Add(new KeySets { value = "at-least", label = "at least" });
                pairs.Add(new KeySets { value = "between", label = "between" });
                pairs.Add(new KeySets { value = "before", label = "before" });
                pairs.Add(new KeySets { value = "after", label = "after" });
                pairs.Add(new KeySets { value = "between-static", label = "between dates" });
            }
            else
            {
                pairs.Add(new KeySets { value = "alltime", label = "over all time", selected = true });
                pairs.Add(new KeySets { value = "in-the-last", label = "in the last" });
                pairs.Add(new KeySets { value = "more-than", label = "more than" });
                pairs.Add(new KeySets { value = "at-least", label = "at least" });
                pairs.Add(new KeySets { value = "between", label = "between" });
                pairs.Add(new KeySets { value = "before", label = "before" });
                pairs.Add(new KeySets { value = "after", label = "after" });
                pairs.Add(new KeySets { value = "between-static", label = "between dates" });
            }
            return pairs;
        }
        public static List<KeySets> CriteriaUnit()
        {
            List<KeySets> pairs = new List<KeySets>();
            pairs.Add(new KeySets { value = "hour", label = "hours" });
            pairs.Add(new KeySets { value = "day", label = "days", selected = true });
            pairs.Add(new KeySets { value = "week", label = "weeks"});
            return pairs;
        }

        public static List<KeySets> CriteriaRegion()
        {
            List<KeySets> pairs = new List<KeySets>();
            pairs.Add(new KeySets { value = "EUROPEAN_UNION", label = "European Union" });
            pairs.Add(new KeySets { value = "UNITED_STATES", label = "United States", selected = true });
            return pairs;
        }
    }
}