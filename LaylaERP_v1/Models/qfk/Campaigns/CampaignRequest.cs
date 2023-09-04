namespace LaylaERP.Models.qfk.Campaigns
{
    using System;
    using System.Collections.Generic;

    public class CampaignRequest
    {
        public long campaign_id { get; set; } = 0;
        public string campaign_name { get; set; } = string.Empty;
        public DateTime? campaign_date { get; set; } = null;
        public int campaign_type { get; set; } = 1;
        public int campaign_status { get; set; } = 1;
        public DateTime? campaign_send_time { get; set; } = null;
        public bool is_smart_sending { get; set; } = true;
        public bool add_variation_utm { get; set; } = false;
        public bool is_paused { get; set; } = false;
        public bool is_campaign_still_sending { get; set; } = false;
        public bool is_cancelled_campaign_partially_sent { get; set; } = false;
        public bool is_add_unsubscribe { get; set; } = false;
        public bool is_add_utm { get; set; } = false;
        public string utm_source { get; set; } = string.Empty;
        public string utm_medium { get; set; } = string.Empty;
        public string utm_campaign { get; set; } = string.Empty;
        public string utm_id { get; set; } = string.Empty;
        public string utm_term { get; set; } = string.Empty;
        public CampaignContent content { get; set; } = new CampaignContent();
        public CampaignAudiences audiences { get; set; } = new CampaignAudiences();
        public ContentData contentdata { get; set; } = new ContentData();
        public Organization organization { get; set; } = new Organization();
        public List<CampaignProfile> profiles { get; set; } = new List<CampaignProfile>();
        public DateTime? created { get; set; } = null;
        public DateTime? updated { get; set; } = null;
        public string action { get; set; } = string.Empty;
    }

    public class CampaignContent
    {
        public string subject { get; set; } = string.Empty;
        public string preview_text { get; set; } = string.Empty;
        public string from_label { get; set; } = string.Empty;
        public string from_email { get; set; } = string.Empty;
        public string reply_to_email { get; set; } = string.Empty;
        public string content_type { get; set; } = string.Empty;
        public long template_id { get; set; } = 0;
        public DateTime? send_time { get; set; } = null;
    }

    public class CampaignAudiences
    {
        public List<long> group_ids { get; set; }
    }

    public class CampaignProfile
    {
        public string id { get; set; }
        public string profiles_id { get; set; }
        public string mail_status { get; set; }
        public string email { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
    }

    public class ContentType
    {
        public const string Text = "text";

        public const string HTML = "html";

        public const string Email = "email";
    }
    public class ContentData
    {
        public long campaign_id { get; set; } = 0;
        public string data_json { get; set; } = string.Empty;
        public string data_html { get; set; } = string.Empty;
    }

    public class Organization
    {
        public string name { get; set; }
        public string full_address { get; set; }
        public string url { get; set; }
    }
}