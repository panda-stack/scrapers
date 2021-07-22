var Excel = require("exceljs");
var workbook = new Excel.Workbook();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const axios = require("axios");

workbook.xlsx.readFile("customers.xlsm").then(function () {
  var emails = [],
    websites = [];
  var worksheet = workbook.getWorksheet(1);
  var column1 = worksheet.getColumn(4);
  column1.eachCell(function (cell, rowNumber) {
    if (cell.value != null) {
      var temp = cell.value;
      emails.push(temp);
    }
  });
  emails = emails.slice(1);
  console.log(emails.length);
  var column2 = worksheet.getColumn(11);
  column2.eachCell(function (cell, rowNumber) {
    if (cell.value != null) {
      var temp = cell.value
        .replace(/https:\/\//g, "")
        .replace(/http:\/\//g, "")
        .split("/")[0];
      websites.push(temp);
    }
  });
  websites = websites.slice(1);
  console.log(websites.length);

  write(emails, websites);
});

const csvWriter = createCsvWriter({
  path: "result.csv",
  header: [
    { id: "email", title: "Email" },
    { id: "website", title: "Website" },
    { id: "industry", title: "Industry" },
    { id: "job_company_name", title: "Name" },
    { id: "job_company_website", title: "Website" },
    { id: "job_company_size", title: "Size" },
    { id: "job_company_founded", title: "Founded" },
    { id: "job_company_industry", title: "Industry" },
    { id: "job_company_linkedin_url", title: "LinkedIn URL" },
    { id: "job_company_linkedin_id", title: "LinkedIn ID" },
    { id: "job_company_facebook_url", title: "Facebook URL" },
    { id: "job_company_twitter_url", title: "Twitter URL" },
    { id: "job_company_location_name", title: "Location Name" },
    { id: "job_company_location_locality", title: "Location Locality" },
    { id: "job_company_location_metro", title: "Location Metro" },
    { id: "job_company_location_region", title: "Location Region" },
    { id: "job_company_location_country", title: "Location Country" },
    { id: "current_company", title: "Current Company" },
    { id: "current_company_size", title: "Current Company Size" },
    { id: "current_company_industry", title: "Current Company Industry" },
    { id: "wappalyzer", title: "wappalyzer" },
    { id: "builtwith", title: "builtwith" },
    { id: "website_traffic", title: "website traffic" },
    { id: "pagespeed_insights", title: "Page Speed" },
    { id: "estimated_num_employees", title: "Estimated Employees" },
    { id: "annual_revenue_printed", title: "Annual Revenue Printed" },
    { id: "annual_revenue", title: "Annual Revenue" },
    { id: "CLS", title: "CLS" },
    { id: "FID", title: "FID" },
    { id: "LCP", title: "LCP" },
    { id: "headless", title: "Headless" },
    { id: "is_modern", title: "Is Modern" },
    { id: "modern", title: "Modern" },
    { id: "is_cms", title: "Is CMS" },
    { id: "cms", title: "CMS" },
    { id: "is_cart", title: "Is Cart" },
    { id: "shopping_cart", title: "Shopping Cart" },
    { id: "cdn", title: "CDN" },
  ],
});

const write = async (emails, websites) => {
  let data = await fetchData(emails, websites);
  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
};

const fetchData = async (emails, websites) => {
  let data = [];
  for (let i = 0; i < websites.length; i++) {
    let middata = await getData(emails[i], websites[i]);
    let temp = { email: emails[i], website: websites[i], ...middata };
    data.push(temp);
  }
  return data;
};

const getData = async (email, website) => {
  const api_company =
    "https://api.peopledatalabs.com/v5/company/enrich?api_key=d7cb2f0f65739231e3944f81d30870f8aad69ff81bd9838afcfe57d3ab38913e";

  try {
    const res = await axios.get(`${api_company}&website=${website}`);
    try {
      const data = await convert_company(res.data, email, website);
      return data;
    } catch (err) {}
  } catch (error) {
    let domain = email.split("@")[1];
    if (isCompany(domain)) {
      try {
        const res = await axios.get(`${api_company}&website=${domain}`);
        const new_data = await convert_company(res.data, email, website);
        return new_data;
      } catch (e) {
        console.log("=====================================>", website);
        return {};
      }
    } else {
      return {};
    }
  }
};

const isCompany = (domain) => {
  const excludedMails = [
    "protonmail",
    "zoho",
    "outlook",
    "gmail",
    "icloud",
    "yahoo",
    "aol",
    "gmx",
    "yandex",
    "hotmail",
    "mail",
    "sina",
    "tutanota",
  ];

  let dot_split = domain.split(".");
  for (let i = 0; i < dot_split.length; i++) {
    if (excludedMails.includes(dot_split[i])) {
      return false;
    }
  }
  return true;
};

const convert_company = async (data, email, website) => {
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
  let new_data = await enrichment(temp, email);

  return new_data;
};

const enrichment = async (data, email) => {
  let new_data = data;
  new_data.wappalyzer = null;
  new_data.builtwith = null;
  new_data.website_traffic = null;
  new_data.pagespeed_insights = null;
  new_data.estimated_num_employees = null;
  new_data.annual_revenue_printed = null;
  new_data.annual_revenue = null;

  let domain = email.split("@")[1];
  if (
    new_data.job_company_website === undefined ||
    new_data.job_company_website === null
  ) {
    if (isCompany(domain)) new_data.job_company_website = domain;
  }

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
      await axios
        .get(
          `https://api.apollo.io/v1/organizations/enrich?api_key=hwZog2ZLdAackA9IdoRTZg&domain=${website}`
        )
        .then((resp) => {
          if (resp.data.organization) {
            new_data.estimated_num_employees =
              resp.data.organization.estimated_num_employees;
            new_data.annual_revenue_printed =
              resp.data.organization.annual_revenue_printed;
            new_data.annual_revenue = resp.data.organization.annual_revenue;
          }
        });
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
