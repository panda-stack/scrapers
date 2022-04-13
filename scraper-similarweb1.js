var axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "results/scraping/similarweb_industry17.csv",
  header: [
    { id: "site", title: "Website" },
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
    pageSize: 500,
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
        companyHeadquarter: {
          inclusion: "includeOnly",
          codes: [840],
        },
        totalPageViews: {
          from: 1000000,
        },
        technologies: [
          {
            inclusion: "includeOnly",
            parentCategories: ["ECommerce"],
            categories: [],
            technologies: [],
          },
        ],
        categoryFilter: {
          inclusion: "includeOnly",
          values: [
            "Lifestyle/Beauty_and_Cosmetics",
            "Lifestyle/Gifts_and_Flowers",
            "Lifestyle/Jewelry_and_Luxury_Products",
            "Lifestyle/Weddings",
          ],
        },
      },
    },
    device: "Total",
    excludeUserLeads: false,
  });

  const config = {
    method: "post",
    url: "https://pro.similarweb.com/api/sales-leads-generator/v2/leads",
    headers: {
      cookie:
        ".SGTOKEN.SIMILARWEB.COM=IiLu8yFZ00Vx1-oIUEzsQt5diqGJWUZB2A6D0O5KHTt1nvvXf9xp1nv3EtfjZambnVceGDFHu-QBU6j-wciQodUoBNLqJqsONla9AiWkhacnY7SJFSIZnoxPF5pbqf7zoXZYktw4_M4qXoV6ZQQS4gXVGIxdvs8H62XbObxcfMEUjz9VFbxBMLmdWeUFkIA-8jmypHJHXrC5QUj5EfTSv5GciHwUYNNHb5_-37o4H9EpX3J_pQ1Gk9i5GNP7VT7xvFbVa8uI7uiTjG_qKgvoTFF3JpAyFgr6dlqRZDyW-GKkYx-ozPTKCjHmqFs_2k_QqNSrSi_hNKoRd_PLoFvildpzMqQQuHxPfJVAYy6tl_JURSGjz_jNMnOyv1z_ZAtRyFfOiV3Fpenemka0FKT3EkW7Z4yd1yH1t6VsQY2pYJ4h1vrKa8FIm6WRajtAd7ew;",
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
            ".SGTOKEN.SIMILARWEB.COM=IiLu8yFZ00Vx1-oIUEzsQt5diqGJWUZB2A6D0O5KHTt1nvvXf9xp1nv3EtfjZambnVceGDFHu-QBU6j-wciQodUoBNLqJqsONla9AiWkhacnY7SJFSIZnoxPF5pbqf7zoXZYktw4_M4qXoV6ZQQS4gXVGIxdvs8H62XbObxcfMEUjz9VFbxBMLmdWeUFkIA-8jmypHJHXrC5QUj5EfTSv5GciHwUYNNHb5_-37o4H9EpX3J_pQ1Gk9i5GNP7VT7xvFbVa8uI7uiTjG_qKgvoTFF3JpAyFgr6dlqRZDyW-GKkYx-ozPTKCjHmqFs_2k_QqNSrSi_hNKoRd_PLoFvildpzMqQQuHxPfJVAYy6tl_JURSGjz_jNMnOyv1z_ZAtRyFfOiV3Fpenemka0FKT3EkW7Z4yd1yH1t6VsQY2pYJ4h1vrKa8FIm6WRajtAd7ew;",
        },
      };
      const competitors = await axios(config1);
      if (competitors.data.length > 0) {
        let keys = "";
        for (let i = 0; i < competitors.data.length; i++) {
          middata[`competitor${i + 1}`] = competitors.data[i].Domain;
          keys += competitors.data[i].Domain + "%2C";
        }
        keys = keys.slice(0, keys.length - 3);
        var config2 = {
          method: "get",
          url: `https://pro.similarweb.com/widgetApi/WebsiteOverview/EngagementOverview/Table?ShouldGetVerifiedData=false&country=999&from=2021%7C12%7C01&includeLeaders=true&includeSubDomains=true&isWindow=false&keys=${keys}&timeGranularity=Monthly&to=2022%7C02%7C28&webSource=Total`,
          headers: {
            "content-type": "application/json",
            cookie:
              ".SGTOKEN.SIMILARWEB.COM=IiLu8yFZ00Vx1-oIUEzsQt5diqGJWUZB2A6D0O5KHTt1nvvXf9xp1nv3EtfjZambnVceGDFHu-QBU6j-wciQodUoBNLqJqsONla9AiWkhacnY7SJFSIZnoxPF5pbqf7zoXZYktw4_M4qXoV6ZQQS4gXVGIxdvs8H62XbObxcfMEUjz9VFbxBMLmdWeUFkIA-8jmypHJHXrC5QUj5EfTSv5GciHwUYNNHb5_-37o4H9EpX3J_pQ1Gk9i5GNP7VT7xvFbVa8uI7uiTjG_qKgvoTFF3JpAyFgr6dlqRZDyW-GKkYx-ozPTKCjHmqFs_2k_QqNSrSi_hNKoRd_PLoFvildpzMqQQuHxPfJVAYy6tl_JURSGjz_jNMnOyv1z_ZAtRyFfOiV3Fpenemka0FKT3EkW7Z4yd1yH1t6VsQY2pYJ4h1vrKa8FIm6WRajtAd7ew;",
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
