import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { addEventToCalendar, clearCalendar, countEventsOnCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";
import { build } from "node-xlsx";
var xlsx = require('node-xlsx').default;


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
/*
        const emtPreceptors =
        {
            '000000': { active: true },
            '017652': { active: true, firstName: 'Brittany', lastName: 'Baham' },
            '018823': { active: true, firstName: 'Nick', lastName: 'Ziegler' },
            '022725': { active: true, firstName: 'Brandi', lastName: 'Hidalgo' },
            '023205': { active: true, firstName: 'Aaron', lastName: 'Brock' },
            '023407':
                { active: true, firstName: 'Lynn (Jaimie)', lastName: 'Menne' },
            '023943': { active: true, firstName: 'Carmen', lastName: 'Edmonds' },
            '024521': { active: true, firstName: 'Summer', lastName: 'Booth' },
            '026049': { active: true, firstName: 'David', lastName: 'Patterson' },
            '026226': { active: true, firstName: 'Autum', lastName: 'Scharwarth' },
            '026417': { active: true, firstName: 'Jacob', lastName: 'Peterson' },
            '026721': { active: true, firstName: 'Jonathan', lastName: 'Lee' },
            '027207':
                { active: true, firstName: 'Charles (Trey)', lastName: 'Crouse' }
        };
        const paramedicPreceptors =
        {
            '012073': { active: true, firstName: 'Shannon', lastName: 'Gerlinger' },
            '012862': { active: true, firstName: 'Darren', lastName: 'Tanner' },
            '012897': { active: true, firstName: 'Glen', lastName: 'Samuels' },
            '014412': { active: true, firstName: 'Troy', lastName: 'Bellanger' },
            '014853':
                { active: true, firstName: 'Chris', lastName: 'Harshbarger' },
            '014898': { active: true, firstName: 'Kevin', lastName: 'Thomas' },
            '015114': { active: true, firstName: 'Markus', lastName: 'Jenkins' },
            '015124': { active: true, firstName: 'Michelle', lastName: 'Collins' },
            '015130': { active: true, firstName: 'Clinton', lastName: 'Blades' },
            '015138':
                { active: true, firstName: 'Jennifer', lastName: 'Battistella' },
            '015942':
                { active: true, firstName: 'Michael', lastName: 'Waguespak' },
            '015963': { active: true, firstName: 'Thorn', lastName: 'Phillips' },
            '016311': { active: true, firstName: 'Tabby', lastName: 'Valencia' },
            '016894': { active: true, firstName: 'Candice', lastName: 'Ziegler' },
            '017059':
                { active: true, firstName: 'Andrew - PT', lastName: 'Rhodes' },
            '017179':
                { active: true, firstName: 'Steven', lastName: 'Brockhoeft' },
            '017189': { active: true, firstName: 'Jessica', lastName: 'Johnson' },
            '017224': { active: true, firstName: 'Nick', lastName: 'Munlin' },
            '017462': { active: true, firstName: 'Jessica', lastName: 'Tardo' },
            '017567': { active: true, firstName: 'Jimmy', lastName: 'Hill' },
            '017781': { active: true, firstName: 'Crystal', lastName: 'Conn' },
            '017816': { active: true, firstName: 'Billy', lastName: 'Albritton' },
            '018124': { active: true, firstName: 'Matt', lastName: 'Primeaux' },
            '018313': { active: true, firstName: 'Kevin', lastName: 'Hopkins' },
            '018919': { active: true, firstName: 'Max', lastName: 'Garrison' },
            '019471': { active: true, firstName: 'Jade', lastName: 'McClendon' },
            '019852': { active: true, firstName: 'Korey', lastName: 'Touchet' },
            '020307': { active: true, firstName: 'John', lastName: 'Fortner' },
            '020755': { active: true, firstName: 'Eric', lastName: 'Hinebaugh' },
            '020780': { active: true, firstName: 'Drayton', lastName: 'Kittel' },
            '020867': { active: true, firstName: 'Beau', lastName: 'Fournier' },
            '021879': { active: true, firstName: 'Joey', lastName: 'Sanchez' },
            '022194': { active: true, firstName: 'Cameron', lastName: 'Watts' },
            '022330': { active: true, firstName: 'Christine', lastName: 'Guise' },
            '022593': { active: true, firstName: 'David', lastName: 'Robertson' },
            '022746': { active: true, firstName: 'Rebekah', lastName: 'Cummings' },
            '023491': { active: true, firstName: 'Brett', lastName: 'Bosarge' },
            '023717': { active: true, firstName: 'Michael', lastName: 'Holland' },
            '023733': { active: true, firstName: 'Casey', lastName: 'Paille' },
            '023828': { active: true, firstName: 'Dorothy', lastName: 'Harper' },
            '024057': { active: true, firstName: 'Nicholas', lastName: 'Bubrig' },
            '024168': { active: true, firstName: 'Jennifer', lastName: 'Comeaux' }
        };
        let SHIFTS = extractShifts("Test", emtPreceptors, paramedicPreceptors);
*/
        // Production
        let shiftReport = await downloadReport(area);
        let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors);

        var numberOfShiftsExtracted = Object.keys(SHIFTS).length;

        buildCalendar(SHIFTS.paramedic, area.calendarIds.paramedic);

        buildCalendar(SHIFTS.emt, area.calendarIds.emt);

     
        // TODO: Delete file when done. 
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

        try {
            addEventToCalendar(eventData, calendarId);
        } catch (error) {
            console.log("unable to add event to calendar: ", error);
        }
        await delay(500);
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