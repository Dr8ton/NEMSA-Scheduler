import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { addEventToCalendar, clearCalendar, countEventsOnCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";

require('dotenv').config();
const downloadFolderPath = downloadsFolder();

async function main() {

    //erease previous data from calendar. 
    await clearCalendar();

    //get lists of preceptors
    const emtPreceptors = await getAllActiveEMTPreceptors();
    const paramedicPreceptors = await getAllActiveParamedicPreceptors();
    // FIXME
    // const allPreceptors = mergeAllActivePreceptors(emtPreceptors, paramedicPreceptors);

    //download shift report
    let numberOfFilesBeforeDownload = fs.readdirSync(downloadFolderPath).length;
    let browser = await downloadShifts.getShiftExcelFile();
    let numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;

    while (numberOfFilesBeforeDownload === numberOfFilesAfterDownload) {
        console.log(`waiting for download to finish`);
        numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;
        await delay(1000);
    }

    let latestFile = getMostRecentFileName(downloadFolderPath);

    while (path.extname(latestFile) != ".xlsx") {
        let latestFile = getMostRecentFileName(downloadFolderPath);
        await delay(1000);
    }

    browser.close();


    let SHIFTS = extractShifts(latestFile);
    var numberOfShiftsExtracted = Object.keys(SHIFTS).length;
    console.log(`${numberOfShiftsExtracted} shifts extracted`);


    for (let shift in SHIFTS) {

        let eventData = {
            "eventName": `${SHIFTS[shift].truck} @ ${SHIFTS[shift].location} `,
            "description": `Crew: ${SHIFTS[shift].crewOne} Crew: ${SHIFTS[shift].crewTwo}`,
            "startTime": `${SHIFTS[shift].startDTG}`,
            "endTime": `${SHIFTS[shift].endDTG}`
        }

        try {
            addEventToCalendar(eventData);
        } catch (error) {
            console.log("unable to add event to calendar: ", error);
        }

        await delay(500);
    }

    try {
        let onCalendar: number = await countEventsOnCalendar();
        console.log(`${onCalendar} events created on calendar`)
    } catch (error) {
        console.log("unable to count number of events on calendar", error)
    }

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

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mergeAllActivePreceptors(e: string[], p: string[]): string[] {
    let allPreceptors: string[] = p.concat(e);
    return allPreceptors;
}

//test();
main();