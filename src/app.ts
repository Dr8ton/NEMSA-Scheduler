import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { clearCalendars, addShiftToCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";

require('dotenv').config();
const downloadFolderPath = downloadsFolder();


async function main() {
    for (const area of AREAS) {

        clearCalendars(area.calendarIds);

        // TODO: use cache to save calls to DB
        const [emtPreceptors, paramedicPreceptors] = await Promise.all([getAllActiveEMTPreceptors(area.name), getAllActiveParamedicPreceptors(area.name)]);

        let shiftReport = await downloadReport(area);
        let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors);

        buildCalendar(SHIFTS.paramedic, area.calendarIds.paramedic);
        buildCalendar(SHIFTS.emt, area.calendarIds.emt);


        try {
            var pathToShiftReportFile = path.join(downloadFolderPath, shiftReport);
            fs.unlinkSync(pathToShiftReportFile);
        } catch (error) {
            console.log(`unable to delete downloaded file for reason: ${error}`);
        }

    }
}

async function buildCalendar(shifts, calendarId: string) {

    for (let shift of shifts) {
        let eventData = {
            "eventName": `${shift.crew} | ${shift.location} | ${shift.truck} `,
            "description": `Shift ID: ${shift.id}`,
            "startTime": `${shift.startDTG}`,
            "endTime": `${shift.endDTG}`
        }
        addShiftToCalendar(eventData, calendarId);
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
//Returns file
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
    console.log(`Download complete: ${latestFile}`)
    return latestFile;
}
main();