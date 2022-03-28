var XLSX = require("xlsx");
var fs = require("fs");
const json2csv = require("json2csv");
const axios = require("axios");

var workbook = XLSX.readFile("input/AMER.xlsx");
var sheet_name_list = workbook.SheetNames;

var worksheet = workbook.Sheets[sheet_name_list[0]];
var originHeaders = {};
var originData = [],
  dataArray = [];
const new_columns = [
  "industry",
  "job_company_name",
  "job_company_website",
  "job_company_size",
  "job_company_founded",
  "job_company_industry",
  "job_company_linkedin_url",
  "job_company_linkedin_id",
  "job_company_facebook_url",
  "job_company_twitter_url",
  "job_company_location_name",
  "job_company_location_locality",
  "job_company_location_metro",
  "job_company_location_region",
  "job_company_location_country",
  "current_company",
  "current_company_size",
  "current_company_industry",
  "wappalyzer",
  "builtwith",
  "website_traffic",
  "pagespeed_insights",
  "estimated_num_employees",
  "annual_revenue_printed",
  "annual_revenue",
  "CLS",
  "FID",
  "LCP",
  "headless",
  "is_modern",
  "modern",
  "is_cms",
  "cms",
  "is_cart",
  "shopping_cart",
  "cdn",
];

for (z in worksheet) {
  if (z[0] === "!") continue;

  //parse out the column, row, and value
  var tt = 0;
  for (var i = 0; i < z.length; i++) {
    if (!isNaN(z[i])) {
      tt = i;
      break;
    }
  }
  var col = z.substring(0, tt);
  var row = parseInt(z.substring(tt));
  var value = worksheet[z].v;
  //store header names
  if (row == 1 && value) {
    originHeaders[col] = value;
    continue;
  }

  if (!originData[row]) originData[row] = {};
  originData[row][originHeaders[col]] = value;
}
//drop those first two rows which are empty
originData.shift();
originData.shift();
// console.log(data[0]);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const write = async () => {
  for (let i = 0; i < originData.length; i++) {
    let data = originData[i];
    if (!data) continue;
    let new_data = {};
    if (data.Website != null) {
      var website = data.Website.replace(/https:\/\//g, "")
        .replace(/http:\/\//g, "")
        .split("/")[0];
      console.log("website==>", website);
      await sleep(12000);
      new_data = await getData(website);
    }
    new_columns.map((item) => {
      data[item] = new_data[item];
    });
    dataArray.push(data);
  }
  var result = json2csv.parse(dataArray, {
    fields: [...Object.values(originHeaders), ...new_columns],
  });
  fs.writeFileSync("results/amer.csv", result);
};

const getData = async (website) => {
  const api_company =
    "https://api.peopledatalabs.com/v5/company/enrich?api_key=d7cb2f0f65739231e3944f81d30870f8aad69ff81bd9838afcfe57d3ab38913e";

  try {
    console.log("before");
    const res = await axios.get(`${api_company}&website=${website}`);
    console.log("after");
    try {
      const data = await convert_company(res.data, website);
      return data;
    } catch (err) {}
  } catch (error) {
    console.log("first", error);
    return {};
  }
};

const convert_company = async (data, website) => {
  let temp = {};
  temp.industry = data.industry;
  temp.job_company_name = data.name;
  temp.job_company_website = website ? website : data.website;
  temp.job_company_size = data.size;
  temp.job_company_founded = data.founded;
  temp.job_company_industry = data.industry;
  temp.job_company_linkedin_url = data.linkedin_url;
  temp.job_company_linkedin_id = data.linkedin_id;
  temp.job_company_facebook_url = data.facebook_url;
  temp.job_company_twitter_url = data.twitter_url;
  temp.job_company_location_name = data.location?.name;
  temp.job_company_location_locality = data.location?.locality;
  temp.job_company_location_metro = data.location?.metro;
  temp.job_company_location_region = data.location?.region;
  temp.job_company_location_country = data.location?.country;
  temp.current_company = data.name;
  temp.current_company_size = data.size;
  temp.current_company_industry = data.industry;
  let new_data = await enrichment(temp);

  return new_data;
};

const enrichment = async (data) => {
  let new_data = data;
  new_data.wappalyzer = null;
  new_data.builtwith = null;
  new_data.website_traffic = null;
  new_data.pagespeed_insights = null;
  new_data.estimated_num_employees = null;
  new_data.annual_revenue_printed = null;
  new_data.annual_revenue = null;

  if (
    new_data.job_company_website !== undefined &&
    new_data.job_company_website !== null
  ) {
    let website = new_data.job_company_website,
      full_domain = "";
    new_data.wappalyzer = `www.wappalyzer.com/lookup/${website}`;
    new_data.builtwith = `builtwith.com/${website}`;
    new_data.website_traffic = `www.similarweb.com/website/${website}`;
    new_data.pagespeed_insights = `developers.google.com/speed/pagespeed/insights/?url=${website}`;

    try {
      const resp = await axios.get(
        `https://api.apollo.io/v1/organizations/enrich?api_key=hwZog2ZLdAackA9IdoRTZg&domain=${website}`
      );

      if (resp.data.organization) {
        new_data.estimated_num_employees =
          resp.data.organization.estimated_num_employees;
        new_data.annual_revenue_printed =
          resp.data.organization.annual_revenue_printed;
        new_data.annual_revenue = resp.data.organization.annual_revenue;
      }
    } catch (error) {}

    try {
      await axios
        .get(
          `https://jianxing-chao-api-default.moovweb-edge.io/api/convert/cwv?domain=${website}`
        )
        .then((resp) => {
          new_data.CLS = resp.data.CLS;
          new_data.FID = resp.data.FID;
          new_data.LCP = resp.data.LCP;
          full_domain = resp.data.domain;
        });
    } catch (error) {}

    try {
      await axios
        .get(
          `https://jianxing-chao-api-default.moovweb-edge.io/api/technology?domain=${website}`
        )
        .then((resp) => {
          new_data.headless = resp.data.headless;
          new_data.is_modern = resp.data.is_modern;
          new_data.modern = resp.data.modern;
          new_data.is_cms = resp.data.is_cms;
          new_data.cms = resp.data.cms;
          new_data.is_cart = resp.data.is_cart;
          new_data.shopping_cart = resp.data.shopping_cart;
          new_data.cdn = resp.data.cdn;
        });
    } catch (error) {}
  }

  return new_data;
};

write();

// var result = json2csv.parse(dataArray, {
//   fields: Object.keys(dataArray[0]),
// });
// fs.writeFileSync("results/apac.csv", result);
