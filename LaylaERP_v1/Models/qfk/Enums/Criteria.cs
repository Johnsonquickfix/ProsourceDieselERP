namespace LaylaERP.Models.qfk.Enums
{
    using System.Collections.Generic;

    public class Criteria
    {
        public static Dictionary<string, string> CriteriaType()
        {
            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("customer-statistic-value", "What someone has done (or not done)"); 
            pairs.Add("customer-attribute", "Properties about someone");
            //pairs.Add("customer-location", "If someone is or is not within the EU (GDPR)");
            pairs.Add("customer-location", "If someone is or is not within the country");
            //pairs.Add("-", "Someone's proximity to a location");
            pairs.Add("customer-group-membership", "If someone is in or not in a list");
            pairs.Add("customer-exclusion", "If someone is or is not suppressed for email");
            //pairs.Add("-", "If someone is or is not consented to receive SMS");
            //pairs.Add("-", "Predictive analytics about someone");
            return pairs;
        }
        public static Dictionary<string, string> CriteriaOperator()
        {
            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("eq", "is");
            pairs.Add("neq", "is not");
            return pairs;
        }
        public static Dictionary<string, string> CriteriaTimeframe()
        {
            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("in-the-last", "in the last");
            pairs.Add("more-than", "more than");
            pairs.Add("at-least", "at least");
            pairs.Add("between", "between");
            pairs.Add("before", "before");
            pairs.Add("after", "after");
            pairs.Add("between-static", "between dates");
            return pairs;
        }
        public static Dictionary<string, string> CriteriaUnit()
        {
            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("hour", "hours");
            pairs.Add("day", "days");
            pairs.Add("week", "weeks");
            return pairs;
        }
    }
}