const puppeteer = require("puppeteer")
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "out.csv",
  header: [
    { id: "company_name", title: "Company Name" },
    { id: "company_website", title: "Company Website" },
    { id: "company_description", title: "Company Description" },
    { id: "company_address", title: "Company Address" },
    { id: "company_city", title: "Company City State" },
    { id: "company_country", title: "Company Country" },
    { id: "verticals_serviced", title: "Verticals Serviced" },
    { id: "clients", title: "Clients" },
    { id: "rating", title: "Rating" },
    { id: "review_count", title: "Review Count" },
  ],
})

const url = "https://partners.bigcommerce.com/directory/";

const fetchData = async () => {
  browser = await puppeteer.launch({
    defaultViewport: null,
    headless: false,
    // userDataDir: "./puppeteer_data",
    // ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreHTTPSErrors: false,
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "image") {
      req.abort();
    } else {
      req.continue();
    }
  });
  let totalPages;
  await page.goto(url)
  await page.waitForSelector("#Locator_BodyContent_ResultsContainer")
  try {
    totalPages = await page.evaluate(() => {
      let temp = document.querySelector('div.col-sm-3.mktPaginationTopLeft')
      let total_counts = parseInt(temp.querySelector('b').textContent.replace(/\D/g, ""))
      return Math.ceil(total_counts/15)
    })
  } catch{
  } finally {
    // await page.close()
  }
  let data = [], cnt = 0, err = 0

  for (let j = 0; j < totalPages; j++) {
    console.log(j)
    await page.goto(url + `search?p=${j}`)
    await page.waitForSelector("#Locator_BodyContent_ResultsContainer")
    try {
      prepare = await page.evaluate(() => {
        let names = document.querySelectorAll(".panel-body")
        let com_names = []
        for(let name of names) {
          com_names.push(name.querySelector("h3").textContent)
        }
        let items = document.querySelectorAll("div.panel-heading.flex-center-vertically.text-center")
        let profiles = []
        for(let item of items) {
          profiles.push(item.querySelector('a').getAttribute('href'))
        }
        let descs = document.querySelectorAll("p.short-desc")
        let descriptions = []
        for(let desc of descs) {
          descriptions.push(desc.textContent.replace(/\n/g, '').replace(/\r/g, '').trim())
        }
        let reviews = document.querySelectorAll('#ratingsReviews')
        let ratings = [], review_counts = []
        for(let review of reviews) {
          ratings.push(review.querySelector('span.pr-snippet-rating-decimal.pr-rounded').textContent)
          review_counts.push(review.querySelector('p.pr-snippet-review-count').textContent.replace(/\D/g, ""))
        }
        return {com_names, profiles, descriptions, ratings, review_counts}     
      })
      for (let i = 0; i < prepare.profiles.length; i++) {
        let middata = {}
        middata["company_name"] = prepare.com_names[i]
        middata["company_description"] = prepare.descriptions[i]
        middata["rating"] = prepare.ratings[i]
        middata["review_count"] = parseInt(prepare.review_counts[i])
        await page.goto('https://partners.bigcommerce.com' + prepare.profiles[i])
        await page.waitForSelector("section.inner-content-wrapper")
        try {
          details = await page.evaluate(() => {
            let website = document.querySelector("p.details-website").querySelector("a").getAttribute('href')
            let address = document.querySelectorAll("p.details-title")[3].nextElementSibling.textContent.split("\n")
            let com_address = address[1].trim()
            let city = address[3].trim()
            let country = address[4].trim()
            let verticals = []
            document.querySelectorAll(".vertical-item").forEach(item => {
              verticals.push(item.textContent.slice(2))
            })
            let clients = []
            document.querySelectorAll(".client-logo-container").forEach(item => {
              clients.push(item.querySelector("a").getAttribute("title"))
            })
            return {website, com_address, city, country, verticals, clients}
          })
          middata["company_website"] = details.website
          middata["company_address"] = details.com_address
          middata["company_city"] = details.city
          middata["company_country"] = details.country
          middata["verticals_serviced"] = details.verticals
          middata["clients"] = details.clients
        } catch {
          if (err > 5) {
            err =0
          } else {
            i = i - 1
            err = err + 1
          }
        } finally {
        }
        data.push(middata)
      }
    } catch {
      console.log("error")
      if (cnt > 5) {
        cnt =0
      } else {
        j = j - 1
        cnt = cnt + 1
      }
    } finally {}
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
