import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { addEventToCalendar, clearCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";
import Bottleneck from "bottleneck";


require('dotenv').config();
const downloadFolderPath = downloadsFolder();

async function main() {
    for (const area of AREAS) {

        //erease previous data from calendar. 
        clearBothCalendarsForThisArea(area);

        // TODO: use cache to save calls to DB
        // TODO: use Promise.all
        // https://hackernoon.com/async-await-essentials-for-production-loops-control-flows-limits-23eb40f171bd


        const emtPreceptors = await getAllActiveEMTPreceptors(area.name);
        const paramedicPreceptors = await getAllActiveParamedicPreceptors(area.name);

        //testing 

        // Production
        let shiftReport = await downloadReport(area);
        let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors);


        buildCalendar(SHIFTS.paramedic, area.calendarIds.paramedic);

        buildCalendar(SHIFTS.emt, area.calendarIds.emt);


        // TODO: Delete file when done. 
    }
}

async function buildCalendar(shifts, calendarId: string) {

    const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 1000
    });

    for (let shift of shifts) {
        let eventData = {
            "eventName": `${shift.crew} | ${shift.location} | ${shift.truck} `,
            "description": `Shift ID: ${shift.id}`,
            "startTime": `${shift.startDTG}`,
            "endTime": `${shift.endDTG}`
        }

        limiter.schedule(() =>{return addEventToCalendar(eventData, calendarId)}, eventData, calendarId);


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

async function clearBothCalendarsForThisArea(area) {
    await clearCalendar(area.calendarIds.emt);
    await clearCalendar(area.calendarIds.paramedic);
}

async function downloadReport(area) {
    let numberOfFilesBeforeDownload = fs.readdirSync(downloadFolderPath).length;
    let browser = await downloadShifts.getShiftExcelFile(area.crewscheduler.region);
    let numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;

    while (numberOfFilesBeforeDownload === numberOfFilesAfterDownload) {
        console.log(`waiting for download to finish`);
        numberOfFilesAfterDownload = fs.readdirSync(downloadFolderPath).length;
        await delay(1000);
    }

    let latestFile = getMostRecentFileName(downloadFolderPath);

    while (path.extname(latestFile) != ".xlsx") {
        await delay(1000);
    }

    browser.close();
    return latestFile;
}
main();