import fs from "fs";
import * as d3 from "d3";
import _ from "lodash";
import node_fetch from "node-fetch";
import { group } from "console";
global.fetch = node_fetch;

// Formatting Date functions
const makeDay = (date) => {
  return String(date.getDate()).padStart(2, "0");
};
const makeMonth = (date) => String(date.getMonth() + 1).padStart(2, "0");
const makeYear = (date) => date.getFullYear();

export default async function donwloadStromErzeugung() {
  //   let outDir = process.env.CACHE_DIR + "/international";
  const outDir = "output";
  const outPath = `${outDir}/stromerzeugungOE.csv`;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const TODAY = new Date();
  const DAY = makeDay(TODAY);
  const MONTH = makeMonth(TODAY);
  const YEAR = makeYear(TODAY);
  const DATE_FORMATTED = `${YEAR}-${MONTH}-${DAY}`;

  const url = `https://transparency.apg.at/transparency-api/api/v1/Download/AGPT/German/M15/2022-08-29T000000/${DATE_FORMATTED}T000000/AGPT_2022-08-28T22_00_00Z_${DATE_FORMATTED}T22_00_00Z_60M_de_${DATE_FORMATTED}T15_40_08Z.csv`;

  // Fetch data
  let data = await d3.dsv(";", url);

  // format data
  data = data.map((e) => {
    return {
      ...e,
      date: e["Zeit von [CET/CEST]"].slice(0, 10),
    };
  });

  let groupedByDate = _.groupBy(data, (d) => d.date);

  //
  // GROUPED BY DATE
  //
  // {
  //   dateN: [
  //     {
  //       time1:
  //       gas: ...
  //     },
  //     {
  //       time2:
  //       gas: ...
  //     }
  //   ],
  //   dateN+1: [
  //     {
  //       time1:
  //       gas: ...
  //     },
  //     {
  //       time2:
  //       gas: ...
  //     }
  //   ]
  // }

  // the keys are the dates
  let keys = Object.keys(groupedByDate);

  let res = keys.map((d) => {
    // d is a single date...

    // valsOneDay is an array of Objects of 15 Minute intervals on that day
    let valsOneDay = groupedByDate[d];

    // get enery-types from the first fifteen minutes object
    let types = Object.keys(valsOneDay[0]);
    let dateObj = types.reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {});

    // for each timestamp add the values to the dateObj-Object
    valsOneDay.forEach((d, i) => {
      let typesOneTime = Object.keys(d);
      typesOneTime.forEach((t) => {
        let val = d[t];
        dateObj[t][i] = val;
      });
    });

    return dateObj;
  });

  let dates = res
    .map((e) => e.date[0])
    .reduce((acc, curr) => {
      acc[curr] = {};
      return acc;
    }, {});

  res.forEach((d, i) => {
    let date = d.date[0];
    let types = Object.keys(d);
    types.forEach((t, j) => {
      if (j == 0 || j == 1 || j === types.length - 1) {
        let val = d[t][0];
        dates[date][t] = val;
      } else {
        let val = d[t].reduce((acc, curr) => {
          curr = parseInt(curr.replace(",", "."));
          return acc + curr;
        }, 0);
        dates[date][t] = val;
      }
    });
  });
  console.log(`dates`, dates);
}

donwloadStromErzeugung();
