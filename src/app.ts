import * as downloadShifts from "./downloadShifts";
import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { sortShifts } from "./extract";
import { clearCalendars, addShiftToCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";
import { scrapeShiftsFromCrewScheduler } from "./downloadShifts";

require('dotenv').config();

async function main() {
    for (const area of AREAS) {


        // TODO: use cache to save calls to DB
        const [emtPreceptors, paramedicPreceptors] = await Promise.all([getAllActiveEMTPreceptors(area.name), getAllActiveParamedicPreceptors(area.name)]);

        const scrapedShifts = await scrapeShiftsFromCrewScheduler(area.crewscheduler.region); 
        let SHIFTS = sortShifts(scrapedShifts, emtPreceptors, paramedicPreceptors, area.sprintTrucks);
        // clearCalendars(area.calendarIds);
        // buildCalendar(SHIFTS.paramedic, area.calendarIds.paramedic, area.stations);
        // buildCalendar(SHIFTS.emt, area.calendarIds.emt, area.stations);

    }
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

function getStationName(listOfStations: object, stationCode: string): string {
    return listOfStations[stationCode];
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();