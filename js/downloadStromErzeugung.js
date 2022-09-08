import fs from "fs";
import * as d3 from "d3";
import node_fetch from "node-fetch";
import write from "./write.js";
import { json } from "d3";
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

  console.log(`data: `, data);

  // daily data for each category
  let dataByDay = d3.group(data, (d) => d.date);
}

donwloadStromErzeugung();
