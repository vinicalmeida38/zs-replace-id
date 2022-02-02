const json = require("./testCasesKey.json");
const config = require("./config.json");
const fs = require("fs");
const readline = require("readline");
const glob = require("glob");

const replaceId = () => {
  glob(config.testCasesFolder, (err, files) => {
      files.map((file) => {
        const ws = fs.createWriteStream(file, {
            flags: "r+",
            defaultEncoding: "utf8",
          });
      
          const rl = readline.createInterface({
            input: fs.createReadStream(file),
          });
      
          rl.on("line", (line) => {
            json.testCasesKey.map((testCase) => {
              let regex = new RegExp("\\" + "b" + testCase.BEESSI + "\\" +"b")
              if (line.search(regex) >= 0) {
                console.log(`Replacing ${testCase.BEESSI}`);
                line = line.replace(testCase.BEESSI, testCase.BEESPAE);
              }
            });
            ws.write(line + '\n');
          });
      
          rl.on("close", function () {
            ws.close();
          });
      })
  
  });
};

replaceId();
