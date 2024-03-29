var axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "results/scraping/temp.csv",
  header: [
    { id: "site", title: "Website" },
    { id: "type", title: "Website Type" },
    { id: "category", title: "Website Category" },
    { id: "pageviews", title: "Pageviews" },
    { id: "bounce_rate", title: "Bounce Rate" },
    { id: "cdn", title: "CDN" },
    { id: "cms", title: "CMS" },
    { id: "advertising", title: "Advertising" },
    { id: "javascript", title: "JavaScript" },
    { id: "a/b_testing", title: "A/B Testing" },
    { id: "ecommerce_platform", title: "Ecommerce Platform" },
    { id: "framework", title: "Framework" },
    { id: "retargeting", title: "Retargeting" },
    { id: "web_hosting", title: "Web Hosting" },
    { id: "web_server", title: "Web Server" },
    { id: "competitor1", title: "Competitor1" },
    { id: "competitor1_pageviews", title: "Pageviews of Competitor1" },
    { id: "competitor1_bounceRate", title: "Bounce Rate of Competitor1" },
    {
      id: "competitor1_uniqueVisitors",
      title: "Monthly unique visitors of Competitor1",
    },
    {
      id: "competitor1_pagesPerVisit",
      title: "Pages Per Visit of Competitor1",
    },
    { id: "competitor1_visitDuration", title: "Visit Duration of Competitor1" },
    { id: "competitor2", title: "Competitor2" },
    { id: "competitor2_pageviews", title: "Pageviews of Competitor2" },
    { id: "competitor2_bounceRate", title: "Bounce Rate of Competitor2" },
    {
      id: "competitor2_uniqueVisitors",
      title: "Monthly unique visitors of Competitor2",
    },
    {
      id: "competitor2_pagesPerVisit",
      title: "Pages Per Visit of Competitor2",
    },
    { id: "competitor2_visitDuration", title: "Visit Duration of Competitor2" },
    { id: "competitor3", title: "Competitor3" },
    { id: "competitor3_pageviews", title: "Pageviews of Competitor3" },
    { id: "competitor3_bounceRate", title: "Bounce Rate of Competitor3" },
    {
      id: "competitor3_uniqueVisitors",
      title: "Monthly unique visitors of Competitor3",
    },
    {
      id: "competitor3_pagesPerVisit",
      title: "Pages Per Visit of Competitor3",
    },
    { id: "competitor3_visitDuration", title: "Visit Duration of Competitor3" },
    { id: "competitor4", title: "Competitor4" },
    { id: "competitor4_pageviews", title: "Pageviews of Competitor4" },
    { id: "competitor4_bounceRate", title: "Bounce Rate of Competitor4" },
    {
      id: "competitor4_uniqueVisitors",
      title: "Monthly unique visitors of Competitor4",
    },
    {
      id: "competitor4_pagesPerVisit",
      title: "Pages Per Visit of Competitor4",
    },
    { id: "competitor4_visitDuration", title: "Visit Duration of Competitor4" },
  ],
});

const fetchData = async () => {
  let result = [];
  const data = JSON.stringify({
    isNewOnly: false,
    asc: false,
    orderBy: "visits",
    page: 0,
    pageSize: 50,
    columns: [
      {
        alias: "site",
        type: "regular",
        name: "site",
      },
      {
        alias: "country",
        type: "regular",
        name: "country",
      },
      {
        alias: "pageviews",
        type: "regular",
        name: "pageviews",
      },
      {
        alias: "company_country",
        type: "regular",
        name: "company_country",
      },
      {
        alias: "bounce_rate",
        type: "regular",
        name: "bounce_rate",
      },
      {
        alias: "techSubCategory:A/B Testing",
        type: "techSubCategory",
        name: "A/B Testing",
      },
      {
        alias: "techSubCategory:ECommerce Platforms",
        type: "techSubCategory",
        name: "ECommerce Platforms",
      },
      {
        alias: "techSubCategory:Framework",
        type: "techSubCategory",
        name: "Framework",
      },
      {
        alias: "techSubCategory:Retargeting",
        type: "techSubCategory",
        name: "Retargeting",
      },
      {
        alias: "techCategory:JavaScript",
        type: "techCategory",
        name: "JavaScript",
      },
      {
        alias: "techSubCategory:Web Hosting",
        type: "techSubCategory",
        name: "Web Hosting",
      },
      {
        alias: "techSubCategory:Web Server",
        type: "techSubCategory",
        name: "Web Server",
      },
      {
        alias: "techCategory:Content Delivery Network",
        type: "techCategory",
        name: "Content Delivery Network",
      },
      {
        alias: "techCategory:Content Management System",
        type: "techCategory",
        name: "Content Management System",
      },
      {
        alias: "techCategory:Advertising",
        type: "techCategory",
        name: "Advertising",
      },
      {
        alias: "site_category",
        type: "regular",
        name: "site_category",
      },
      {
        alias: "favicon",
        type: "regular",
        name: "favicon",
      },
      {
        alias: "is_new",
        type: "regular",
        name: "is_new",
      },
    ],
    queryFilters: {
      contactsFilters: {},
      leadsFilters: {
        countries: [840],
        monthlyVisits: {
          from: 150000,
        },
        websiteType: {
          type: "advertiser",
          inclusion: "includeOnly",
        },
      },
    },
    device: "Total",
    excludeUserLeads: false,
  });

  const config = {
    method: "post",
    url: "https://pro.similarweb.com/sales-api/leads-generator/v2/leads",
    headers: {
      cookie:
        ".SGTOKEN.SIMILARWEB.COM=IiLu8yFZ00Vx1-oIUEzsQiENtoD6M5M6FLY5XItvca-Xhw5B_Gix3-9V_mO0lEuncGJBu1wO8iDiKbMoET9k99UGHpzX7uJ4yrm_G_4saZ_UJsqm4rcpv7Je1v8lVdq86lML86D_xBjOchM13I1UnAasNssnqs6-X7jqQ_fn5eLwmsh6Cx20nlO2oogWn_IuVDA9z-xhhdU9cYrbqaFZQc8ybC2wok_wSeQ0U3PAXmwS-lt7OlV7AgjKTUmj79pcyfjARoWZe6wNDVbZH0Kdg5K1jcMRSMyOMvyGp_sLPEE8zh6iKa99o5ATixYEu_o02mixgEyZgNiPqQFgItWkzRwuk7oi_uLYNtaijReTTnZx0VVMln9fDnGISPRLjODRtQ0WS7qETNZqd-syN7ZdaLXTEObqk9XAwVTiLRjj40TJ8Pgri2Ou2KyNUXsZwC_v;",
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const items = await axios(config);
    console.log(items.data.rows.length);
    for (let item of items.data.rows) {
      let middata = {};
      middata["site"] = item.site;
      middata["type"] = "advertiser";
      middata["category"] = item.site_category;
      middata["pageviews"] = item.pageviews;
      middata["bounce_rate"] = item.bounce_rate;
      middata["cdn"] = item["techCategory:Content Delivery Network"].join(", ");
      middata["javascript"] = item["techCategory:JavaScript"].join(", ");
      middata["a/b_testing"] = item["techSubCategory:A/B Testing"].join(", ");
      middata["ecommerce_platform"] =
        item["techSubCategory:ECommerce Platforms"].join(", ");
      middata["framework"] = item["techSubCategory:Framework"].join(", ");
      middata["retargeting"] = item["techSubCategory:Retargeting"].join(", ");
      middata["web_hosting"] = item["techSubCategory:Web Hosting"].join(", ");
      middata["web_server"] = item["techSubCategory:Web Server"].join(", ");
      middata["cms"] =
        item["techCategory:Content Management System"].join(", ");
      middata["advertising"] = item["techCategory:Advertising"].join(", ");
      var config1 = {
        method: "get",
        url: `https://pro.similarweb.com/api/WebsiteOverview/getsimilarsites?key=${item.site}&limit=4`,
        headers: {
          "content-type": "application/json",
          cookie:
            ".SGTOKEN.SIMILARWEB.COM=IiLu8yFZ00Vx1-oIUEzsQiENtoD6M5M6FLY5XItvca-Xhw5B_Gix3-9V_mO0lEuncGJBu1wO8iDiKbMoET9k99UGHpzX7uJ4yrm_G_4saZ_UJsqm4rcpv7Je1v8lVdq86lML86D_xBjOchM13I1UnAasNssnqs6-X7jqQ_fn5eLwmsh6Cx20nlO2oogWn_IuVDA9z-xhhdU9cYrbqaFZQc8ybC2wok_wSeQ0U3PAXmwS-lt7OlV7AgjKTUmj79pcyfjARoWZe6wNDVbZH0Kdg5K1jcMRSMyOMvyGp_sLPEE8zh6iKa99o5ATixYEu_o02mixgEyZgNiPqQFgItWkzRwuk7oi_uLYNtaijReTTnZx0VVMln9fDnGISPRLjODRtQ0WS7qETNZqd-syN7ZdaLXTEObqk9XAwVTiLRjj40TJ8Pgri2Ou2KyNUXsZwC_v;",
        },
      };
      const competitors = await axios(config1);
      if (competitors.data.length > 0) {
        let keys = "";
        for (let i = 0; i < competitors.data.length; i++) {
          middata[`competitor${i + 1}`] = competitors.data[i].Domain;
          if (item.site === "andersonadvisors.com" && i === 3) continue;
          keys += competitors.data[i].Domain + "%2C";
        }
        keys = keys.slice(0, keys.length - 3);
        var config2 = {
          method: "get",
          url: `https://pro.similarweb.com/widgetApi/WebsiteOverview/EngagementOverview/Table?ShouldGetVerifiedData=false&country=999&from=2021%7C12%7C01&includeLeaders=true&includeSubDomains=true&isWindow=false&keys=${keys}&timeGranularity=Monthly&to=2022%7C02%7C28&webSource=Total`,
          headers: {
            "content-type": "application/json",
            cookie:
              ".SGTOKEN.SIMILARWEB.COM=IiLu8yFZ00Vx1-oIUEzsQiENtoD6M5M6FLY5XItvca-Xhw5B_Gix3-9V_mO0lEuncGJBu1wO8iDiKbMoET9k99UGHpzX7uJ4yrm_G_4saZ_UJsqm4rcpv7Je1v8lVdq86lML86D_xBjOchM13I1UnAasNssnqs6-X7jqQ_fn5eLwmsh6Cx20nlO2oogWn_IuVDA9z-xhhdU9cYrbqaFZQc8ybC2wok_wSeQ0U3PAXmwS-lt7OlV7AgjKTUmj79pcyfjARoWZe6wNDVbZH0Kdg5K1jcMRSMyOMvyGp_sLPEE8zh6iKa99o5ATixYEu_o02mixgEyZgNiPqQFgItWkzRwuk7oi_uLYNtaijReTTnZx0VVMln9fDnGISPRLjODRtQ0WS7qETNZqd-syN7ZdaLXTEObqk9XAwVTiLRjj40TJ8Pgri2Ou2KyNUXsZwC_v;",
          },
        };
        const competitorsRes = await axios(config2);
        const competitorsData = competitorsRes.data.Data;
        for (let i = 0; i < competitorsData.length; i++) {
          middata[`competitor${i + 1}_pageviews`] =
            competitorsData[i].AvgMonthVisits.Value;
          middata[`competitor${i + 1}_bounceRate`] =
            competitorsData[i].BounceRate.Value;
          middata[`competitor${i + 1}_uniqueVisitors`] =
            competitorsData[i].UniqueUsers.Value;
          middata[`competitor${i + 1}_pagesPerVisit`] =
            competitorsData[i].PagesPerVisit.Value;
          middata[`competitor${i + 1}_visitDuration`] =
            competitorsData[i].AvgVisitDuration.Value;
        }
      }
      result.push(middata);
    }
  } catch (error) {
    console.log("error===>", error);
  }

  return result;
};

const write = async () => {
  let data = await fetchData();
  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
};
write();
