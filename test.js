const { CanvasRenderService } = require("chartjs-node-canvas");
const fs = require("fs");
var Excel = require("exceljs");
var workbook = new Excel.Workbook();

var configuration = {
  type: "line",
  data: {
    labels: [1, 2, 3, 4, 5],
    datasets: [
      {
        label: "First",
        fill: false,
        data: [2478, 5267, 734, 784, 433],
        backgroundColor: "rgba(255, 99, 132, 1)",
        borderColor: "rgba(255,99,132,1)",
      },
      {
        label: "Second",
        fill: false,
        data: [1233, 3467, 7634, 384, 4533],
        backgroundColor: "rgba(162, 99, 132, 1)",
        borderColor: "rgba(162,99,132,1)",
      },
    ],
  },
};

const mkChart = async (params) => {
  console.log(params);
  const canvasRenderService = new CanvasRenderService(400, 400);
  return await canvasRenderService.renderToBuffer(configuration);
};

const test = async () => {
  console.log("TEST");
  await readFiles("results/");
  var image = await mkChart("test");

  console.log("HEllo");
  fs.writeFile("out.png", image, "base64", function (err) {
    console.log(err);
  });
};

const readFiles = (dirname) => {
  let label1 = [],
    label2 = [],
    set1 = [],
    set2 = [];
  return new Promise((resolve, rejects) => {
    fs.readdir(dirname, async function (err, filenames) {
      if (err) {
        console.log(err);
        return;
      }
      for (let key in filenames) {
        var emails = [],
          websites = [],
          sign = false;
        var filename = filenames[key];
        var worksheet = await workbook.csv.readFile(dirname + filename);
        var temp = filename.split("-")[3].split(".")[0];

        var column1 = worksheet.getColumn(1);
        column1.eachCell(function (cell, rowNumber) {
          if (cell.value != null) {
            var temp = cell.value;
            emails.push(temp);
          }
        });
        emails = emails.slice(1);
        let nodes = emails[emails.length - 1];
        if (temp === "part1") {
          if (label1.indexOf(nodes) > -1) {
            sign = true;
          } else {
            label1.push(nodes);
          }
        } else if (temp === "part2") {
          if (label2.indexOf(nodes) > -1) sign = true;
          else label2.push(nodes);
        }
        // console.log(emails.length);
        // console.log(emails);

        var column2 = worksheet.getColumn(3);
        column2.eachCell(function (cell, rowNumber) {
          if (cell.value != null) {
            var temp = cell.value;
            websites.push(temp);
          }
        });
        websites = websites.slice(1);
        // console.log(websites.length);
        // console.log(websites);
        if (!sign) {
          if (temp === "part1") set1.push(websites[0]);
          else if (temp === "part2") set2.push(websites[0]);
        }
      }
      console.log("label1: ", label1);
      console.log("label2: ", label2);
      console.log("set1: ", set1);
      console.log("set2: ", set2);
      configuration.data.labels = label1;
      configuration.data.datasets[0].data = set1;
      configuration.data.datasets[1].data = set2;
      console.log(configuration.data.labels);
      resolve();
    });
  });
};

test();
