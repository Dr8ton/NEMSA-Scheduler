import fs from 'fs';
import downloadsFolder from 'downloads-folder';
import path from 'path';
import _ from 'underscore';
import { findUseableShifts } from "./extract";
import { clearCalendars, addShiftToCalendar } from "./cal";
import { getAllActiveEMTPreceptors, getAllActiveParamedicPreceptors } from "./firebase";
import { AREAS } from "./AREAS";
import { scrapeShiftsFromCrewScheduler } from "./crewScheduler";
import { error } from "util";
import { Shift } from "./Shift";

require('dotenv').config();

async function main() {
    for (const area of AREAS) {


        // TODO: use cache to save calls to DB
        const [emtPreceptors, paramedicPreceptors] = await Promise.all([getAllActiveEMTPreceptors(area.name), getAllActiveParamedicPreceptors(area.name)]);

        const scrapedShifts = await scrapeShiftsFromCrewScheduler(area.crewscheduler.region);
        let allPossibleShifts = findUseableShifts(scrapedShifts);
        let emtShifts: Shift[] = allPossibleShifts.filter(isPreceptorOnShift, Object.keys(emtPreceptors));
        let paramedicShifts: Shift[] = allPossibleShifts.filter(isPreceptorOnShift, Object.keys(paramedicPreceptors));
        //TODO: start here
        // clearCalendars(area.calendarIds);
        // buildCalendar(paramedicShifts, area.calendarIds.paramedic, area.stations, paramedicPreceptors);
        // buildCalendar(emtShifts, area.calendarIds.emt, area.stations, emtPreceptors);
    }
}



export async function buildCalendar(shifts: Shift[], calendarId: string, stations: object, preceptors: any) {

    for (let shift of shifts) {

        let preceptor;

        if (preceptors[shift.crewOne]) {
            preceptor = preceptors[shift.crewOne];
        } else if (preceptors[shift.crewTwo]) {
            preceptor = preceptors[shift.crewTwo];
        } else {
            throw new Error("unable to find preceptor after filtered for preceptors: " + error);
        }

        let location = getStationName(stations, shift.location);
        let eventData = {
            //TODO: need to work on event names. 
            "eventName": `${preceptor.firstName} ${preceptor.lastName} | ${location} | ${shift.truck} `,
            "description": `Shift ID: ${shift.id}`,
            "startTime": `${shift.startDTG}`,
            "endTime": `${shift.endDTG}`
        }
        addShiftToCalendar(eventData, calendarId);
    }
}

export function getStationName(listOfStations: object, stationCode: string): string {
    return listOfStations[stationCode];
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isPreceptorOnShift(shift: Shift) {
    let first: boolean = this.includes(shift.crewOne);
    let second: boolean = this.includes(shift.crewTwo);
    return (first || second);
}


main();