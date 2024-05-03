const config = require("./config.json");
const fs = require("fs");
const readline = require("readline");
const glob = require("glob");

/**
 * Scan project files from path provided inside config.json
 * @param {file} processFile
 *
 */
const scanProjectFiles = (processFile) => {
  glob(config.testCasesFolder, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => processFile(file));
  });
};

module.exports = { scanProjectFiles };
