var xlsx = require('node-xlsx').default;
import path from 'path';
import moment from 'moment';
import downloadsFolder = require('downloads-folder');


//TODO: Document this function

export function extractShifts(fileName: string, emts:object, medics: object) {

    let dl = path.join(downloadsFolder(), fileName);

    //testing
    // const testReport = xlsx.parse("report.xlsx", { cellDates: true });
    // let dataFromReport = testReport[0].data

    // //working setup
    const workSheetsFromFile = xlsx.parse(dl, { cellDates: true });
    let dataFromReport = workSheetsFromFile[0].data


    let shifts = {
        emt: [],
        paramedic: []
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

        if (emts[one]) {
            shifts.emt.push(
                {
                    id: e[0],
                    crew: `${emts[one].firstName} ${emts[one].lastName}`, // TODO: format this as a name not as number. 
                    location: e[2],
                    startDTG: `${formatDTG(e[4])}`,
                    endDTG: `${formatDTG(e[5])}`,
                    truck: e[10]
                });
        } else if (emts[two]) {
            shifts.emt.push(
                {
                    id: e[0],
                    crew: `${emts[two].firstName} ${emts[two].lastName}`, // TODO: format this as a name not as number. 
                    location: e[2],
                    startDTG: `${formatDTG(e[4])}`,
                    endDTG: `${formatDTG(e[5])}`,
                    truck: e[10]
                });
        }

        // medic branch

        if (medics[one]) {
            shifts.paramedic.push(
                {
                    id: e[0],
                    crew: `${medics[one].firstName} ${medics[one].lastName}`, // TODO: format this as a name not as number. 
                    location: e[2],
                    startDTG: `${formatDTG(e[4])}`,
                    endDTG: `${formatDTG(e[5])}`,
                    truck: e[10]
                });
        } else if (medics[two]) {
            shifts.paramedic.push(
                {
                    id: e[0],
                    crew: `${medics[two].firstName} ${medics[two].lastName}`, // TODO: format this as a name not as number. 
                    location: e[2],
                    startDTG: `${formatDTG(e[4])}`,
                    endDTG: `${formatDTG(e[5])}`,
                    truck: e[10]
                });
        }
    });
    return shifts;
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
        "227",
        "300"
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

