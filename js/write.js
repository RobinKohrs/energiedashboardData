import fs from "fs";
const fsP = fs.promises;
import { createArrayCsvWriter } from "csv-writer";

async function writeJson(FILEPATH, CONTENT) {
  if (!FILEPATH.startsWith(process.env.CACHE_DIR))
    FILEPATH = process.env.CACHE_DIR + "/" + FILEPATH;
  if (!FILEPATH.endsWith(".json")) FILEPATH = FILEPATH + ".json";

  if (typeof CONTENT === "object" && CONTENT !== null) {
    try {
      return fsP.writeFile(FILEPATH, JSON.stringify(CONTENT));
    } catch (e) {
      console.error("Error occured while writing JSON!", err);
    }
  } else if (typeof CONTENT === "string") {
    return fsP.writeFile(FILEPATH, CONTENT);
  }
}

async function writeCsv(FILEPATH, CONTENT) {
  if (!FILEPATH.startsWith(process.env.CACHE_DIR))
    FILEPATH = process.env.CACHE_DIR + "/" + FILEPATH;
  if (!FILEPATH.endsWith(".csv")) FILEPATH = FILEPATH + ".csv";

  if (Array.isArray(CONTENT)) {
    try {
      const csvWriter = createArrayCsvWriter({
        header: CONTENT[0],
        path: FILEPATH,
      });

      return csvWriter.writeRecords(CONTENT.slice(1));
    } catch (e) {
      console.error("Error occured while writing CSV!", err);
    }
  } else if (typeof CONTENT === "string") {
    return fsP.writeFile(FILEPATH, CONTENT);
  }
}

export default {
  json: writeJson,
  csv: writeCsv,
};
