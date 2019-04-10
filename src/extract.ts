var xlsx = require('node-xlsx').default;
import downloadsFolder from 'downloads-folder';
import path from 'path';
import moment from 'moment';

const emtPrecetors = [
    { active: true, id: '000000' },
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
const paramedicPreceptors = [];
//TODO: Document this function

export function extractShifts(fileName: string, emts: object[], medics: object[]) {
    //TODO: pass in preceptors from DB

    let dl = path.join(downloadsFolder(), fileName);

    //testing
    // const testReport = xlsx.parse("report.xlsx", { cellDates: true });
    // let dataFromReport = testReport[0].data

    //working setup
    const workSheetsFromFile = xlsx.parse(dl, { cellDates: true });
    let dataFromReport = workSheetsFromFile[0].data


    let shifts = {
        emt: {},
        paramedic: {}
    }

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



        // emt branch
        if (isActivePreceptor(one, emts)) {
            let key: string = e[0];

            shifts.emt[key] = {
                crew: formatEmployeeId(one),
                location: e[2],
                startDTG: `${formatDTG(e[4])}`,
                endDTG: `${formatDTG(e[5])}`,
                truck: e[10]
            }
        } else if (isActivePreceptor(two, emts)) {
            let key: string = e[0];

            shifts.emt[key] = {
                crew: formatEmployeeId(two),
                location: e[2],
                startDTG: `${formatDTG(e[4])}`,
                endDTG: `${formatDTG(e[5])}`,
                truck: e[10]

            }
        }

        // medic branch
        if (isActivePreceptor(one, medics)) {
            let key: string = e[0];

            shifts.paramedic[key] = {
                crew: formatEmployeeId(one),
                location: e[2],
                startDTG: `${formatDTG(e[4])}`,
                endDTG: `${formatDTG(e[5])}`,
                truck: e[10]
            }
        } else if (isActivePreceptor(two, medics)) {
            let key: string = e[0];

            shifts.paramedic[key] = {
                crew: formatEmployeeId(two),
                location: e[2],
                startDTG: `${formatDTG(e[4])}`,
                endDTG: `${formatDTG(e[5])}`,
                truck: e[10]

            }
        }
    });
    return shifts;
}




//TODO: Document this function

function isActivePreceptor(crewId: string, activePreceptors): boolean {
    return activePreceptors.id.includes(formatEmployeeId(crewId));
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
//TODO: Document this function

function alreadyHasStudent(notes: string): boolean {
    if (notes === undefined) {
        return false;
    } else {
        return notes.includes("STUDENT/RIDER:")
    }
}
//TODO: Document this function

function formatEmployeeId(id: string): string {
    if (id === undefined) {
        return "";
    }
    return id.slice(0, 6);
}
//TODO: Document this function

function formatDTG(d: string) {
    var m = moment(d);
    var roundUp = m.second() || m.millisecond() ? m.add(1, 'minute').startOf('minute') : m.startOf('minute');
    return roundUp.toISOString();
}

