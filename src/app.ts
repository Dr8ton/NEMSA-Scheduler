import * as firebase from "./firebase";
import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { SSL_OP_EPHEMERAL_RSA } from "constants";

require('dotenv').config();
const downloadFolderPath = downloadsFolder();

async function main() {
    let numberOfFilesBeforeDownload = fs.readdirSync(downloadFolderPath).length;
    console.log(`Number of files in download folder before download: ${numberOfFilesBeforeDownload}`)

    let browser = await downloadShifts.getShiftExcelFile();
    console.log(`Downloading...`)

    let numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;

    while (numberOfFilesBeforeDownload === numberOfFilesAfterDownload) {
        console.log(`waiting for download to finish`);
        numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;
        await delay(1000);
    }



    let latestFile = getMostRecentFileName(downloadFolderPath);
    console.log(`Latest File: ${latestFile}`);

    while (path.extname(latestFile) != ".xlsx") {
        let latestFile = getMostRecentFileName(downloadFolderPath);
        await delay(1000);
        console.log(`Latest File: ${latestFile}`);
    }
    console.log(`download complete`);
    console.log(`Number of files in download folder after download: ${numberOfFilesAfterDownload}`)

    browser.close();
}

// Return only base file name without dir
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    });
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
async function test() {
    let latestFile = getMostRecentFileName(downloadFolderPath);

    while (path.extname(latestFile) === ".xlsx") {
        let latestFile = getMostRecentFileName(downloadFolderPath);
        console.log(`Latest File: ${latestFile}`);
        await delay(1000);
    }
}

//test();
main();