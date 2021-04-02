const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "clutch1.csv",
  header: [
    { id: "company", title: "Company" },
    { id: "categories", title: "Categories" },
    { id: "description", title: "Description" },
    { id: "focus", title: "Focus" },
    { id: "website", title: "Website" },
    { id: "profile", title: "Profile" },
    { id: "revenue", title: "Revenue" },
    { id: "rate", title: "Rate" },
    { id: "employees", title: "Employees" },
    { id: "location", title: "Location" },
  ],
})

const url = "https://clutch.co/developers/ecommerce";
const prfbase = "https://clutch.co";

const fetchData = async () => {
  const resp = await axios(url)
  let temp = cheerio.load(resp.data)
  const total_counts = parseInt(temp(".tabs-info").text().replace(/\D/g, ""));
  const totalPages = Math.ceil(total_counts/50);
  let data = [];

  for (let j = 0; j < totalPages; j++) {
    const res = await axios(url + `?page=${j}`)
    let html = res.data;
    let $ = cheerio.load(html);
    let items = $(".provider-row");
    let descs = $(".col-md-3.provider-info__description");
    let info = $(".provider-info--header");
    let focuses = $(".chart-label.hidden-xs");
    let detail = $(".provider-info__details");
    let providerdetails = $(".provider-detail");
    for (let i = 0; i < items.length; i++) {
      let middata = {};
      middata["company"] = $(info[i]).find("h3").find("a").text().replace(/\n/g, '').replace(/\r/g, '').trim();
      middata["categories"] = $(info[i]).find("p").text().replace(/\n/g, '').replace(/\r/g, '').trim();
      middata["description"] = $(descs[i]).find("blockquote").text().replace(/\n/g, '').replace(/\r/g, '').trim();
      middata["focus"] = $(focuses[i]).text().replace(/\n/g, ' ').trim();
      let detailModules = $(detail[i])
        .find(".module-list")
        .find(".list-item");
      middata["revenue"] = $(detailModules[0]).find("span").text();
      middata["rate"] = $(detailModules[1]).find("span").text();
      middata["employees"] = '="' + $(detailModules[2]).find("span").text() + '"';
      middata["location"] = $(detailModules[3]).find("span").text();
      let profiles = $(providerdetails[i]).find("li");
      middata["website"] = $(profiles[0]).find("a").attr("href");
      middata["profile"] = prfbase + $(profiles[1]).find("a").attr("href");
      data.push(middata);
    }
  }
  return data
}

const write = async () => {
  let data = await fetchData();
  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
};
write();
