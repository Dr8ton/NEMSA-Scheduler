import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { extractShifts } from "./extract";
import { addEventToCalendar, clearCalendar, countEventsOnCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";
var xlsx = require('node-xlsx').default;


require('dotenv').config();
const downloadFolderPath = downloadsFolder();

async function main() {
    for (const area of AREAS) {

        //erease previous data from calendar. 
        clearBothCalendarsForThisArea(area);

        //get lists of 
        // TODO: use cache to save calls to DB
        // TODO: use Promise.all


        //const emtPreceptors = await getAllActiveEMTPreceptors(area.name);
        //const paramedicPreceptors = await getAllActiveParamedicPreceptors(area.name);

        //testing 
        const emtPreceptors = [
            {
                active: true,
                id: '000000'
            },
            {
                active: true,
                firstName: 'Brittany',
                lastName: 'Baham',
                id: '017652'
            },
            {
                active: true,
                firstName: 'Nick',
                lastName: 'Ziegler',
                id: '018823'
            },
            {
                active: true,
                firstName: 'Brandi',
                lastName: 'Hidalgo',
                id: '022725'
            },
            {
                active: true,
                firstName: 'Aaron',
                lastName: 'Brock',
                id: '023205'
            },
            {
                active: true,
                firstName: 'Lynn (Jaimie)',
                lastName: 'Menne',
                id: '023407'
            },
            {
                active: true,
                firstName: 'Carmen',
                lastName: 'Edmonds',
                id: '023943'
            },
            {
                active: true,
                firstName: 'Summer',
                lastName: 'Booth',
                id: '024521'
            },
            {
                active: true,
                firstName: 'David',
                lastName: 'Patterson',
                id: '026049'
            },
            {
                active: true,
                firstName: 'Autum',
                lastName: 'Scharwarth',
                id: '026226'
            },
            {
                active: true,
                firstName: 'Jacob',
                lastName: 'Peterson',
                id: '026417'
            },
            {
                active: true,
                firstName: 'Jonathan',
                lastName: 'Lee',
                id: '026721'
            },
            {
                active: true,
                firstName: 'Charles (Trey)',
                lastName: 'Crouse',
                id: '027207'
            }];
        const paramedicPreceptors = [
            {
                active: true,
                firstName: 'Shannon',
                lastName: 'Gerlinger',
                id: '012073'
            },
            {
                active: true,
                firstName: 'Darren',
                lastName: 'Tanner',
                id: '012862'
            },
            {
                active: true,
                firstName: 'Glen',
                lastName: 'Samuels',
                id: '012897'
            },
            {
                active: true,
                firstName: 'Troy',
                lastName: 'Bellanger',
                id: '014412'
            },
            {
                active: true,
                firstName: 'Chris',
                lastName: 'Harshbarger',
                id: '014853'
            },
            {
                active: true,
                firstName: 'Kevin',
                lastName: 'Thomas',
                id: '014898'
            },
            {
                active: true,
                firstName: 'Markus',
                lastName: 'Jenkins',
                id: '015114'
            },
            {
                active: true,
                firstName: 'Michelle',
                lastName: 'Collins',
                id: '015124'
            },
            {
                active: true,
                firstName: 'Clinton',
                lastName: 'Blades',
                id: '015130'
            },
            {
                active: true,
                firstName: 'Jennifer',
                lastName: 'Battistella',
                id: '015138'
            },
            {
                active: true,
                firstName: 'Michael',
                lastName: 'Waguespak',
                id: '015942'
            },
            {
                active: true,
                firstName: 'Thorn',
                lastName: 'Phillips',
                id: '015963'
            },
            {
                active: true,
                firstName: 'Tabby',
                lastName: 'Valencia',
                id: '016311'
            },
            {
                active: true,
                firstName: 'Candice',
                lastName: 'Ziegler',
                id: '016894'
            },
            {
                active: true,
                firstName: 'Andrew - PT',
                lastName: 'Rhodes',
                id: '017059'
            },
            {
                active: true,
                firstName: 'Steven',
                lastName: 'Brockhoeft',
                id: '017179'
            },
            {
                active: true,
                firstName: 'Jessica',
                lastName: 'Johnson',
                id: '017189'
            },
            {
                active: true,
                firstName: 'Nick',
                lastName: 'Munlin',
                id: '017224'
            },
            {
                active: true,
                firstName: 'Jessica',
                lastName: 'Tardo',
                id: '017462'
            },
            {
                active: true,
                firstName: 'Jimmy',
                lastName: 'Hill',
                id: '017567'
            },
            {
                active: true,
                firstName: 'Crystal',
                lastName: 'Conn',
                id: '017781'
            },
            {
                active: true,
                firstName: 'Billy',
                lastName: 'Albritton',
                id: '017816'
            },
            {
                active: true,
                firstName: 'Matt',
                lastName: 'Primeaux',
                id: '018124'
            },
            {
                active: true,
                firstName: 'Kevin',
                lastName: 'Hopkins',
                id: '018313'
            },
            {
                active: true,
                firstName: 'Max',
                lastName: 'Garrison',
                id: '018919'
            },
            {
                active: true,
                firstName: 'Jade',
                lastName: 'McClendon',
                id: '019471'
            },
            {
                active: true,
                firstName: 'Korey',
                lastName: 'Touchet',
                id: '019852'
            },
            {
                active: true,
                firstName: 'John',
                lastName: 'Fortner',
                id: '020307'
            },
            {
                active: true,
                firstName: 'Eric',
                lastName: 'Hinebaugh',
                id: '020755'
            },
            {
                active: true,
                firstName: 'Drayton',
                lastName: 'Kittel',
                id: '020780'
            },
            {
                active: true,
                firstName: 'Beau',
                lastName: 'Fournier',
                id: '020867'
            },
            {
                active: true,
                firstName: 'Joey',
                lastName: 'Sanchez',
                id: '021879'
            },
            {
                active: true,
                firstName: 'Cameron',
                lastName: 'Watts',
                id: '022194'
            },
            {
                active: true,
                firstName: 'Christine',
                lastName: 'Guise',
                id: '022330'
            },
            {
                active: true,
                firstName: 'David',
                lastName: 'Robertson',
                id: '022593'
            },
            {
                active: true,
                firstName: 'Rebekah',
                lastName: 'Cummings',
                id: '022746'
            },
            {
                active: true,
                firstName: 'Brett',
                lastName: 'Bosarge',
                id: '023491'
            },
            {
                active: true,
                firstName: 'Michael',
                lastName: 'Holland',
                id: '023717'
            },
            {
                active: true,
                firstName: 'Casey',
                lastName: 'Paille',
                id: '023733'
            },
            {
                active: true,
                firstName: 'Dorothy',
                lastName: 'Harper',
                id: '023828'
            },
            {
                active: true,
                firstName: 'Nicholas',
                lastName: 'Bubrig',
                id: '024057'
            },
            {
                active: true,
                firstName: 'Jennifer',
                lastName: 'Comeaux',
                id: '024168'
            }];
        let SHIFTS = extractShifts("Test", emtPreceptors, paramedicPreceptors);

        // let shiftReport = await downloadReport(area);
        // let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors);

        var numberOfShiftsExtracted = Object.keys(SHIFTS).length;
        console.log(`${numberOfShiftsExtracted} shifts extracted`);

        // TODO: break up into emt calendar and P calendar SHIFTS will be an obj with emt and P as childs. 

        for (let shift of SHIFTS.paramedic) {
            console.log(shift.crew);
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