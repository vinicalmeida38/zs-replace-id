const json = require('./testCasesKey.json');
const config = require('./config.json');
const fs = require('fs');
const readline = require('readline');
const glob = require('glob');

const replaceId = () => {
  glob(config.testCasesFolder, (err, files) => {
    files.map((file) => {
      const ws = fs.createWriteStream(file, {
        flags: 'r+',
        defaultEncoding: 'utf8',
      });

      const rl = readline.createInterface({
        input: fs.createReadStream(file),
      });

      rl.on('line', (line) => {
        json.testCasesKey.map((testCase) => {
          const regex = new RegExp('\\' + 'b' + testCase.BEESPAE + '\\' + 'b');
          if (line.search(regex) >= 0) {
            console.log(`Replacing ${testCase.BEESPAE}`);
            line = line.replace(testCase.BEESPAE, testCase.BEESQM);
          }
        });
        ws.write(`${line}\r\n`);
      });

      rl.on('close', () => {
        ws.close();
      });
    });
  });
};

replaceId();
