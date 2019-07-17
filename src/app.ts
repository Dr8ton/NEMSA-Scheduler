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

        let shiftReport: any;

        // TODO: use cache to save calls to DB
        const [emtPreceptors, paramedicPreceptors] = await Promise.all([getAllActiveEMTPreceptors(area.name), getAllActiveParamedicPreceptors(area.name)]);
        try {
            shiftReport = await downloadReport(area);
        } catch (error) {
            throw new Error("unable to download shift report: " + error)
        }

        let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors, area.sprintTrucks);
        clearCalendars(area.calendarIds);
        buildCalendar(SHIFTS.paramedic, area.calendarIds.paramedic, area.stations);
        buildCalendar(SHIFTS.emt, area.calendarIds.emt, area.stations);


        try {
            var pathToShiftReportFile = path.join(downloadFolderPath, shiftReport);
            fs.unlinkSync(pathToShiftReportFile);
        } catch (error) {
            console.log(`unable to delete downloaded file for reason: ${error}`);
        }

    }
}

function getStationName(listOfStations: object, stationCode: string): string {
    return listOfStations[stationCode];
}
async function buildCalendar(shifts, calendarId: string, stations: object) {

    for (let shift of shifts) {

        let location = getStationName(stations, shift.location);
        let eventData = {
            "eventName": `${shift.crew} | ${location} | ${shift.truck} `,
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