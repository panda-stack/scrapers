var csv = require("csv-parser");
var fs = require("fs");
const json2csv = require("json2csv");
const axios = require("axios");

var dataArray = [],
  originData = [];

const new_columns = [
  "CLS",
  "CLS_status",
  "FID",
  "FID_status",
  "LCP",
  "LCP_status",
  "CWV_status",
];

fs.createReadStream("input/cwvs.csv")
  .pipe(csv())
  .on("data", function (data) {
    originData.push(data);
  })
  .on("end", function () {
    write();
  });

const write = async () => {
  for (let i = 0; i < originData.length; i++) {
    let data = originData[i];
    let new_data = {};
    if (data.Website != null) {
      var website = data.Website.replace(/https:\/\//g, "")
        .replace(/http:\/\//g, "")
        .split("/")[0];
      console.log("website==>", website);

      let res = await axios
        .get(
          `https://team1-3y-api-default.layer0-limelight.link/api/convert/cwv?domain=${website}`
        )
        .then((resp) => resp.data)
        .catch((err) => null);

      if (res != "Request failed with status code 404") {
        let pass_cwvs = 0;
        new_data.LCP = res.LCP;
        if (parseFloat(res.LCP) > 75) {
          new_data.LCP_status = "PASS";
          pass_cwvs++;
        } else {
          new_data.LCP_status = "FAIL";
        }
        new_data.CLS = res.CLS;
        if (parseFloat(res.CLS) > 75) {
          new_data.CLS_status = "PASS";
          pass_cwvs++;
        } else {
          new_data.CLS_status = "FAIL";
        }
        new_data.FID = res.FID;
        if (parseFloat(res.FID) > 75) {
          new_data.FID_status = "PASS";
          pass_cwvs++;
        } else {
          new_data.FID_status = "FAIL";
        }
        if (pass_cwvs == 3) new_data.CWV_status = "PASS";
        else new_data.CWV_status = "FAIL";
      }
    }

    new_columns.map((item) => {
      data[item] = new_data[item];
    });
    dataArray.push(data);
  }
  var result = json2csv.parse(dataArray, {
    fields: Object.keys(dataArray[0]),
  });
  fs.writeFileSync("results/cwvs.csv", result);
};
