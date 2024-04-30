const Papa = require('papaparse');
const fs = require('fs');

// Read CSV files
let csvData1 = fs.readFileSync('./CSVFiles/AudienceCustomService.csv', 'utf8');
let csvData2 = fs.readFileSync('./CSVFiles/BEESOQA.csv', 'utf8');

// 1 caso somente
// csvData1 = fs.readFileSync('./CSVFiles/test/test1From.csv', 'utf8');
// csvData2 = fs.readFileSync('./CSVFiles/test/test1To.csv', 'utf8');

// file do projeto
csvData1 = fs.readFileSync('./CSVFiles/test/test2From.csv', 'utf8');
csvData2 = fs.readFileSync('./CSVFiles/test/test2To.csv', 'utf8');

// Parse CSV data
const data1 = Papa.parse(csvData1, { header: true }).data;
const data2 = Papa.parse(csvData2, { header: true }).data;

const ignoredColumns = ['Key','Status','Folder','Component','Owner','Team Name','Test Type'];
function isMatch(item1, item2) {
    for (let prop in item2) {
        // console.log({prop})
        if(ignoredColumns.includes(prop)) continue;
        if (item2.hasOwnProperty(prop)) {
            // console.log({prop, item1: item1[prop], item2: item2[prop]})
            if (item1[prop] !== item2[prop]) {
                return false;
            }
        }
    }
    return true;
}

function compareData(data1, data2) {
    const result = [];

    data1.forEach((item1) => {
        data2.forEach((item2) => {
            if (isMatch(item1, item2)) {
                if( item1.Key === 'BEESQM-T55764' && (item2.Key === 'BEESOQA-T9'  || item2.Key === '')) {
                    console.log({item1, item2})
                }
                result.push({from:item1.Key,to:item2.Key});
            }
        });
    });

    return result;
}


const matchedData = compareData(data1, data2);

// console.log(matchedData);