const puppeteer = require("puppeteer")
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "out.csv",
  header: [
    { id: "company_name", title: "Company Name" },
    { id: "company_website", title: "Company Website" }
  ],
})

const url = "https://ecosystem.hubspot.com/marketplace/solutions";

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
  await page.waitForSelector("div.UICardGrid__CardGrid-sc-1z11f6b-0")
  try {
    totalPages = await page.evaluate(() => {
      let temp = document.querySelector('span.private-big').textContent.split("of")
      let total_counts = parseInt(temp[1].replace(/\D/g, ""))
      return Math.ceil(total_counts/45)
    })
  } catch{
  } finally {
    // await page.close()
  }
  let data = [], cnt = 0

  for (let j = 1; j < 2; j++) {
    console.log(j)
    await page.goto(url + `/page/${j}`)
    await page.waitForSelector("div.UICardGrid__CardGrid-sc-1z11f6b-0")
    try {
      details = await page.evaluate(() => {
        let items = document.querySelector('div.UICardGrid__CardGrid-sc-1z11f6b-0').querySelectorAll('a')
        let profiles = []
        for(let item of items) {
          profiles.push(item.getAttribute('href'))
        }
        return profiles     
      })
      for (let i = 0; i < details.length; i++) {
        let middata = {}
        await page.goto('https://ecosystem.hubspot.com' + details[i])
        await page.waitForSelector("div.MainSection-sc-91lyhu-0.gdlRKr")
        try {
          profile = await page.evaluate(() => {
            let website = document.querySelectorAll("a.uiLinkDark")[1].getAttribute('href')
            let title = document.querySelector("h1.Heading-byq8cq-0.H1-sc-1e4jozh-0").textContent.trim()
            return {title, website}
          })
          middata["company_name"] = profile.title
          middata["company_website"] = profile.website
        } catch {
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
