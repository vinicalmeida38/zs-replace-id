const Papa = require("papaparse");
const fs = require("fs");
const config = require("./config.json");

const columnsToBeCompared = ["Name"];

function isMatch(fromCSVRow, toCSVRow) {
  for (let prop in toCSVRow) {
    if (!columnsToBeCompared.includes(prop)) continue;
    if (toCSVRow.hasOwnProperty(prop)) {
      if (fromCSVRow[prop] !== toCSVRow[prop]) {
        return false;
      }
    }
  }
  return true;
}

function compareData(originProject, targetProject) {
  const result = [];

  originProject.forEach((item1) => {
    targetProject.forEach((item2) => {
      const hasIds = !!item1?.Key && !!item2?.Key;
      if (hasIds && isMatch(item1, item2)) {
        result.push({ from: item1.Key, to: item2.Key });
      }
    });
  });

  console.log(`Found ${result.length} Zephyr keys to be replaced.`);
  return result;
}

const getOriginToTargetKeyComparison = () => {
  const originProjectCSV = fs.readFileSync(config.originProjectCSVPath, "utf8");
  const targetProjectCSV = fs.readFileSync(config.targetProjectCSVPath, "utf8");

  const originProject = Papa.parse(originProjectCSV, { header: true }).data;
  const targetProject = Papa.parse(targetProjectCSV, { header: true }).data;

  const data = compareData(originProject, targetProject);
  return data;
};

module.exports = { getOriginToTargetKeyComparison };
