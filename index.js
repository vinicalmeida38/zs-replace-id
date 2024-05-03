const config = require("./config.json");
const fs = require("fs");
const readline = require("readline");
const os = require("os");
const { scanProjectFiles } = require("./ getProjectFilesAndReplaceIds");
const {
  getKeyToKeyComparison,
  getOriginToTargetKeyComparison,
} = require("./zephyrCsvUtils");


const ORIGIN_TO_TARGET_KEY_COMPARISON = getOriginToTargetKeyComparison();

const processLineFunction = (writeStream, line) => {
  ORIGIN_TO_TARGET_KEY_COMPARISON.map((keys) => {
    const { from, to } = keys;
    const [fromProjectId, fromId] = from.split("-");
    const [toProjectId, toId] = to.split("-");
    const FROM_ID_CHECK_REGEX = new RegExp(`${fromId}`);

    const fromIdExists = line.search(FROM_ID_CHECK_REGEX) >= 0;
    if (fromIdExists) {
      console.log(`Replacing ${fromId} with ${toId}`);
      line = line.replace(fromId, toId);
      line = line.replace(fromProjectId, toProjectId);
    }
  });
    writeStream.write(`${line}${os.EOL}`);

};

const processFile = (file) => {
  const writeStream = fs.createWriteStream(file, {
    flags: "r+",
    defaultEncoding: "utf8",
  });

  const readLine = readline.createInterface({
    input: fs.createReadStream(file), 
  });

  readLine.on("line", (line) => processLineFunction(writeStream, line));
  readLine.on("close", () => writeStream.close());
};

const execute = () => {
  scanProjectFiles(processFile);
};

execute();
