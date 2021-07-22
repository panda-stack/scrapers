var axios = require('axios')
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "hubspot.csv",
  header: [
    { id: "company_name", title: "Company Name" },
    { id: "company_website", title: "Company Website" }
  ],
})

const fetchData = async () => {
  var data = JSON.stringify([{"sortFields":["PARTNER_TIER_DESC","PARTNER_TYPE_ASC","REVIEW_COUNT_DESC","OLDEST"]}]);

  var config = {
    method: 'post',
    url: 'https://api.hubspot.com/ecosystem/public/v1/profiles/search?hs_static_app=ecosystem-marketplace-solutions-ui&hs_static_app_version=1.2072',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  var total_counts = await axios(config)
    .then(resp => resp.data[0].total)
    .catch(error => error);

  console.log(total_counts)
  var count = Math.ceil(total_counts/100)
  let result = []
  for (let i = 0; i < 25; i++) {
    console.log(i)
    data = JSON.stringify([{"sortFields":["PARTNER_TIER_DESC","PARTNER_TYPE_ASC","REVIEW_COUNT_DESC","OLDEST"], "limit": 100, "offset": i * 100}])
    config.data = data
    let items = await axios(config)
      .then(resp => resp.data[0].items)
      .catch(error => error)
    for (let item of items) {
      let middata = {}
      middata["company_name"] = item.name
      middata["company_website"] = await axios(`https://api.hubspot.com/ecosystem/public/v1/profiles/details?hs_static_app=ecosystem-marketplace-solutions-ui&hs_static_app_version=1.2072&slug=${item.slug}&published=true`)
        .then(resp => resp.data.websiteUrl)
      result.push(middata)
    }
  }
  return result
}

const write = async () => {
  let data = await fetchData();
  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
};
write();
