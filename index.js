const config = require("./config.json");
const fs = require("fs");
const readline = require("readline");
const glob = require("glob");
const { scanProjectFiles } = require("./ getProjectFilesAndReplaceIds");
const { getKeyToKeyComparison, getOriginToTargetKeyComparison } = require("./zephyrCsvUtils");

const ORIGIN_TO_TARGET_KEY_COMPARISON = getOriginToTargetKeyComparison()

const processLineFunction = (writeStream,line) => {
  ORIGIN_TO_TARGET_KEY_COMPARISON.map((keys) => {
  const {from: fromId,to:toId} = keys
  console.log(keys)
  const FROM_ID_CHECK_REGEX = new RegExp(`\\b${fromId}\\b`);

  const fromIdExists = line.search(FROM_ID_CHECK_REGEX) >= 0;
  if (fromIdExists) {
    console.log(`Replacing ${fromId} with ${toId}`);
    line = line.replace(fromId, toId);
  }
});
writeStream.write(`${line}\n`);
};

const processFile = (file) => {

  const writeStream = fs.createWriteStream(file, {
    flags: "r+",
    defaultEncoding: "utf8",
  });

  const readLine = readline.createInterface({
    input: fs.createReadStream(file),
  });

  readLine.on("line", (line) => processLineFunction(writeStream,line));
  readLine.on("close", () => writeStream.close());
};



const execute = () => {
  scanProjectFiles(processFile)
};


execute()