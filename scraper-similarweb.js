var axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "results/similarweb.csv",
  header: [
    { id: "site", title: "Website" },
    { id: "pageviews", title: "Pageviews" },
    { id: "bounce_rate", title: "Bounce Rate" },
    { id: "cdn", title: "CDN" },
    { id: "javascript", title: "JavaScript" },
    { id: "a/b_testing", title: "A/B Testing" },
    { id: "ecommerce_platform", title: "Ecommerce Platform" },
    { id: "framework", title: "Framework" },
    { id: "retargeting", title: "Retargeting" },
    { id: "web_hosting", title: "Web Hosting" },
    { id: "web_server", title: "Web Server" },
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
        ".SGTOKEN.SIMILARWEB.COM=GqCqyi1CzQZ_4_GX-_MWPE_6S3pc9vE9hZhdwSSBi-F-MAhxqnlkwM41IB_DpqJtpyU-XalwgiVgPcs-zV4n91cBibNGJaEz8lkSU3YBkX1HJDc2bJS2tBkQIMgWusxfVeHKyPwiFLUxlX1yXSRUt_0Qmy0nAJ37gYdSKAf4J6X2E07y5aaqvTJfbu8js_st55QFe-W5TWyatAY2Kdvj4oHkl7iV8iJirKDLvrbYEOwXKxkFPaS0A1Ys6zTZqyjS01XZkl6UTzvZUKGTUOM2eSng4i0-vmNqRhKdhUZOWOAmpayLihgueirN_Ve2z3t4j4Uukp2cO4TPXDNqCF7sDzZRZtWfS1rjBMObWngLL9MBdTzRik9N93O9956sVUXq1f6FrTTF1KhXIAu9wh1fyblujvqLoqqctYTc6bEGo6lHtnW_AJiOzLHEmjhHZbl3; ",
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
