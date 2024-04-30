const config = require("./config.json");
const fs = require("fs");
const readline = require("readline");
const glob = require("glob");

const readMergedCsv = () => {
  const csv = fs.readFileSync("./CSVFiles/merged.csv", "utf8");
  const IdArray = csv.split("\n");
  const possibleColumns = ["from,to", "to,from"];
  if (!possibleColumns.includes(IdArray[0])) {
    return [];
  }

  IdArray.shift();
  return IdArray;
};

const replaceIdInLine = (line, csvData, ws) => {
  csvData.map((ids) => {
    const [fromId, toId] = ids.split(",");
    const ID_CHECK_REGEX = new RegExp(`\\b${fromId}\\b`);
        
    const fromIdExists = line.search(ID_CHECK_REGEX) >= 0;
    if (fromIdExists) {
          console.log(`Replacing ${fromId} with ${toId}`);
          line = line.replace(fromId, toId);
        }
  });
  ws.write(`${line}\r\n`);
};

const processFile = (file, csvData) => {
console.log(file)

  const ws = fs.createWriteStream(file, {
    flags: "r+",
    defaultEncoding: "utf8",
  });

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
  });

  rl.on("line", (line) => replaceIdInLine(line, csvData, ws));
  rl.on("close", () => ws.close());
};

const execute = () => {
  const csvData = readMergedCsv();

  glob(config.testCasesFolder, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.map((file) => processFile(file, csvData));
  });
};

execute()