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

const processLineFunction = (line, lineEnding) => {
  ORIGIN_TO_TARGET_KEY_COMPARISON.forEach((keys) => {
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

  // Return the processed line with the appropriate line ending
  return `${line}${lineEnding}`;
};

const processFile = (file) => {
  // Read the entire file and process each line
  const readStream = fs.createReadStream(file);
  const readLine = readline.createInterface({
    input: readStream,
  });

  const processedLines = [];
  const buffer = fs.readFileSync(file);
  const lineEnding = buffer.includes("\r\n") ? "\r\n" : "\n";

  readLine.on("line", (line) => {
    // Process each line using processLineFunction and collect the result
    const processedLine = processLineFunction(line, lineEnding);
    processedLines.push(processedLine);
  });

  readLine.on("close", () => {
    // Once all lines have been processed, write them back to the file
    const writeStream = fs.createWriteStream(file, {
      flags: "w",
      defaultEncoding: "utf8",
    });

    processedLines.forEach((line) => {
      writeStream.write(line);
    });

    writeStream.end();
  });
};

const execute = () => {
  scanProjectFiles(processFile);
};

execute();
