import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { addEventToCalendar } from "./cal";

//import {extractShifts} from './extract'; 

require('dotenv').config();
const downloadFolderPath = downloadsFolder();

async function main() {
 
      let numberOfFilesBeforeDownload = fs.readdirSync(downloadFolderPath).length;
       let browser = await downloadShifts.getShiftExcelFile();
       let numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;
   
       while (numberOfFilesBeforeDownload === numberOfFilesAfterDownload) {
           console.log(`waiting for download to finish`);
           numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;
           await delay(1000);
       }
   
       let latestFile = getMostRecentFileName(downloadFolderPath);
       console.log(latestFile);
   
       while (path.extname(latestFile) != ".xlsx") {
           let latestFile = getMostRecentFileName(downloadFolderPath);
           await delay(1000);
       }
   
       browser.close();
   
       
       let SHIFTS = extractShifts(latestFile); 

    // const SHIFTS = {
    //     '5043461':
    //     {
    //         crewOne: '019471',
    //         crewTwo: '027634',
    //         location: 'CAD',
    //         startDTG: '2019-04-08T12:00:00.000Z',
    //         endDTG: '2019-04-09T00:00:00.000Z',
    //         truck: '310'
    //     },
    //     '5043462':
    //     {
    //         crewOne: '019471',
    //         crewTwo: '027634',
    //         location: 'CAD',
    //         startDTG: '2019-04-09T12:00:00.000Z',
    //         endDTG: '2019-04-10T00:00:00.000Z',
    //         truck: '310'
    //     },
    //     '5043463':
    //     {
    //         crewOne: '019471',
    //         crewTwo: '027634',
    //         location: 'CAD',
    //         startDTG: '2019-04-12T12:00:00.000Z',
    //         endDTG: '2019-04-13T00:00:00.000Z',
    //         truck: '310'
    //     },
    //     '5043466':
    //     {
    //         crewOne: '019471',
    //         crewTwo: '027634',
    //         location: 'CAD',
    //         startDTG: "2019-04-17T12:00:00.000Z",
    //         endDTG: "2019-04-18T00:00:00.000Z",
    //         truck: '310'
    //     }
    // }

    for (let shift in SHIFTS) {

        let eventData = {
            "eventName": `${SHIFTS[shift].truck} @ ${SHIFTS[shift].location} `,
            "description": `Crew: ${SHIFTS[shift].crewOne} Crew: ${SHIFTS[shift].crewTwo}`,
            "startTime": `${SHIFTS[shift].startDTG}`,
            "endTime": `${SHIFTS[shift].endDTG}`
        }
        console.log(eventData); 
      //  addEventToCalendar(eventData);
    }
}

/**
 * shift 
 *   '5046930':
   { crewOne: '014898',
     crewTwo: '027434',
     location: 'SLC',
     startDTG: 2019-04-14T21:59:59.999Z,
     endDTG: 2019-04-15T09:59:59.999Z,
     truck: 'X701' },
 
     event
         // let eventData = {
    //     "eventName": "Test Event",
    //     "description": "This is a sample description",
    //     "startTime": "2019-04-14T21:59:59.999Z",
    //     "endTime": "2019-04-15T09:59:59.999Z"
    //   }
 
 */




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
    return new Promise(resolve => setTimeout(resolve, ms));
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