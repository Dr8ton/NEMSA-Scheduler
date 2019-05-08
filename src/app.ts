import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { addEventToCalendar, clearCalendar, countEventsOnCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";

require('dotenv').config();
const downloadFolderPath = downloadsFolder();

async function main() {
    for (const area of AREAS) {

        //erease previous data from calendar. 
        clearBothCalendarsForThisArea(area);

        //get lists of 
        // TODO: use cache to save calls to DB
        // TODO: use Promise.all
        const emtPreceptors = await getAllActiveEMTPreceptors(area.name);
        const paramedicPreceptors = await getAllActiveParamedicPreceptors(area.name);
        let shiftReport = await downloadReport(area);



        let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors);
        var numberOfShiftsExtracted = Object.keys(SHIFTS).length;
        console.log(`${numberOfShiftsExtracted} shifts extracted`);

        // TODO: break up into emt calendar and P calendar SHIFTS will be an obj with emt and P as childs. 
        START HERE
        for (let shift in SHIFTS.paramedic) {
            console.log(shift);
            // let eventData = {
            //     "eventName": `${SHIFTS[shift].truck} @ ${SHIFTS[shift].location} `,
            //     "description": `Crew: ${SHIFTS[shift].crewOne} Crew: ${SHIFTS[shift].crewTwo}`,
            //     "startTime": `${SHIFTS[shift].startDTG}`,
            //     "endTime": `${SHIFTS[shift].endDTG}`
            // }

            // try {
            //     addEventToCalendar(eventData, area.calendarIds.paramedic);
            // } catch (error) {
            //     console.log("unable to add event to calendar: ", error);
            // }

            // await delay(500);
        }

        // try {
        //     let onCalendar: number = await countEventsOnCalendar(area.calendarIds.paramedic);
        //     console.log(`${onCalendar} events created on calendar`)
        // } catch (error) {
        //     console.log("unable to count number of events on calendar", error)
        // }

        // TODO: Delete file when done. 
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
        let latestFile = getMostRecentFileName(downloadFolderPath);
        await delay(1000);
    }

    browser.close();
    return latestFile;
}
main();