# Replace Zephyr Scale Keys


## Overview

This project consists of a Node.js script, this script is designed to update ZephyrScale keys in a repository when test cases have been migrated from one project to another. It compares the origin project's keys with the new target project's keys and replaces any mentions of these keys in the code files. This ensures that your pipelines automation continues to function correctly and smoothly.

## Code Structure

The code is organized into three files:

- `getProjectFilesAndReplaceIds.js`: This file contains the function `scanProjectFiles` which scans project files from a given directory and processes each file using a specified function.
- `zephyrCsvUtils.js`: This file reads and parses data from two CSV files (origin project and target project) and compares the data based on specified columns. It returns an array of matched pairs of keys from the two CSV files.
- `processFiles.js`: This is the main script that uses functions from the other files to read, process, and rewrite project files based on the comparison results from the CSV files.

## Prerequisites

- Node.js and npm must be installed on your machine. You can download them from the [official website](https://nodejs.org/).
- Make sure you have all the required dependencies installed. You can find them in the `package.json` file. To install them, run:

    ```shell
    npm install
    ```

## Usage

To run the script:

1. **Configure the `config.json` file**: In the `config.json` file, set the `testCasesFolder` property to the path of the directory containing the project files you want to process. For example:
    - For Java: `"testCasesFolder": "../path-to-repository/**/*.java"`
    - For Cypress: `"testCasesFolder": "../path-to-repository/**/*.cy"`
    - For Typescript: `"testCasesFolder": "../path-to-repository/**/*.cy"`
    - For any of the above: `"testCasesFolder": "../path-to-repository/**/*.{java,ts,cy}"`

2. **Prepare CSV files**: Follow these steps to obtain and prepare the CSV files:
    - Access your Jira project and navigate to the Zephyr Project. In the Test Case tab, export all the test cases of your project as an Excel file.
    - Convert the Excel file into a CSV file and rename it to `originProject.csv`.
    - Make sure you have already migrated the test cases in the ZephyrScale app to the new project.
    - Go to the new/target project in ZephyrScale and export the test cases as Excel. Convert the file to CSV format and rename it to `targetProject.csv`.
    - Move both CSV files into the `./CSVFiles` folder in the code directory.

3. **Run the script**: Execute the script using the following command:

    ```shell
    node index.js
    ```

    Alternatively, if you have yarn installed, you can run:

    ```shell
    yarn replace-ids
    ```

The script will process each file in the specified directory, replacing identifiers in the files based on the comparison between the origin and target project CSV files.

## Notes

- The script uses the `Papa` library for CSV parsing and the `fs` and `readline` modules for file I/O.
- The script maintains the original line endings (LF or CRLF) of the files during processing.
- Make sure the `config.json` file is set up correctly to point to the desired project files directory.