var xlsx = require('node-xlsx').default;
import downloadsFolder from 'downloads-folder';
import path from 'path';
import moment from 'moment';


export function extractShifts(fileName:string) {
    //TODO: pass in preceptors
    let preceptors = ['012073',
        '012862',
        '012897',
        '014412',
        '014853',
        '014898',
        '015114',
        '015124',
        '015130',
        '015138',
        '015942',
        '015963',
        '016311',
        '016894',
        '017059',
        '017179',
        '017189',
        '017224',
        '017462',
        '017567',
        '017652',
        '017781',
        '017816',
        '018124',
        '018313',
        '018823',
        '018919',
        '019471',
        '019852',
        '020307',
        '020755',
        '020780',
        '020867',
        '021879',
        '022194',
        '022330',
        '022593',
        '022725',
        '022746',
        '023205',
        '023407',
        '023491',
        '023717',
        '023733',
        '023828',
        '023943',
        '024057',
        '024168',
        '024521',
        '026049',
        '026226',
        '026417',
        '026721',
        '027207',
        '000000',
        '017652',
        '018823',
        '022725',
        '023205',
        '023407',
        '023943',
        '024521',
        '026049',
        '026226',
        '026417',
        '026721',
        '027207'];
   // TODO: pass in file name; 
        let dl = path.join(downloadsFolder(), fileName);
    const workSheetsFromFile = xlsx.parse(dl, { cellDates: true });
    let dataFromReport = workSheetsFromFile[0].data

    let shifts = {};

    dataFromReport.forEach((e) => {
//TODO: sprint trucks from DB
        if (isSprintTruck(e[10])) {
            return;
        }

        if (alreadyHasStudent(e[6])) {
            return;
        }

        if (e[1] === 'OS') {
            return;
        }

        let one: string = e[16] === undefined ? e[15] : e[16];
        let two: string = e[21] === undefined ? e[20] : e[21];

        if (!isActivePreceptor(one, preceptors) && !isActivePreceptor(two, preceptors)) {
            return;
        }

        let key: string = e[0];

        shifts[key] = {
            crewOne: formatEmployeeId(one),
            crewTwo: formatEmployeeId(two),
            location: e[2],
            startDTG: `${moment.utc(e[4])}`, // UTC time zone
            endDTG: `${moment.utc(e[5])}`, // UTC time zone
            truck: e[10]
        }
        https://github.com/moment/moment/issues/3256
    });
    console.log(shifts); 
    return shifts;
}

//'SchedShiftID',0, unique ID of shift
//  'ShiftName',1, truck full name
//  'LocationCode',2 station

//  'ShiftDate',3 date but not time of start or finish
//  'StartTime',4 DTG that shift starts
//  'EndTime',5 DTG that the shift ends
//  'Notes',6 STUDENT/RIDER: ${student}

//  PlannedRes1, 10 truck number 

//  'PlannedRes2',15, crewOne
//  'ActualRes2',16 replacedOne

//  'PlannedRes3',20, crewTwo
//  'ActualRes3',21, replacedTwo



function isActivePreceptor(crewId: string, activePreceptors: string[]): boolean {
    return activePreceptors.includes(formatEmployeeId(crewId));
}

/**
 * Summary. Checks to see if the truck on shift is a sprint truck. 
 * 
 * Description. Sprint trucks are not transporting units and therefore are typically not allow to carry students. 
 * 
 * @param {string} num: truck unit number. 
 * 
 * @returns {boolean} true if the truck is a sprint truck. FALSE if the truck is not a sprint truck. 
 */

function isSprintTruck(truckNumber: string): boolean {

    //TODO: add this to DB so that this can scale to other areas

    let sprintTrucks = [
        "221",
        "219",
        "226",
        "227"
    ]

    return sprintTrucks.includes(truckNumber);
}

function alreadyHasStudent(notes: string): boolean {
    if (notes === undefined) {
        return false;
    } else {
        return notes.includes("STUDENT/RIDER:")
    }
}

function formatEmployeeId(id: string): string {
    if (id === undefined) {
        return "";
    }
    return id.slice(0, 6);
}