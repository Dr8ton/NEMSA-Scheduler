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
//TODO: Document this function

export function extractShifts(fileName: string, emts: object[], medics: object[]) {
    //TODO: pass in preceptors from DB

    let dl = path.join(downloadsFolder(), fileName);

    //testing
    const testReport = xlsx.parse("report.xlsx", { cellDates: true });
    let dataFromReport = testReport[0].data

    //working setup
    // const workSheetsFromFile = xlsx.parse(dl, { cellDates: true });
    // let dataFromReport = workSheetsFromFile[0].data


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

        let one: string = e[16] === undefined ? formatEmployeeId(e[15]) : formatEmployeeId(e[16]);
        let two: string = e[21] === undefined ? formatEmployeeId(e[20]) : formatEmployeeId(e[21]);



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
    return activePreceptors.some((e: { id: string; }) => e.id === crewId);
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

