var xlsx = require('node-xlsx').default;
import path from 'path';
import moment from 'moment';
import downloadsFolder = require('downloads-folder');


//TODO: Document this function

export function sortShifts(scraptedShifts: string[][], emts: object, medics: object, sprintTrucks: string[]) {
    const shifts = {
        emt: [],
        paramedic: []
    }

    scraptedShifts.forEach((e) => {

        //TODO: sprint trucks from DB
        if (isSprintTruck(sprintTrucks, e[10])) {
            return;
        }



        if (e[1] === 'OS') {
            return;
        }

        let one: string = e[16] === '&nbsp;' ? formatEmployeeId(e[15]) : formatEmployeeId(e[16]);
        let two: string = e[21] === '&nbsp;' ? formatEmployeeId(e[20]) : formatEmployeeId(e[21]);

        if (e[6].includes("STUDENT/RIDER:")) {
            console.log(e[6]);
        }

        if (alreadyHasStudent(e[6])) {
            if (medics[one] || medics[two]) {
                return

            } else if (emts[one]) {
                console.log(`${e[6]} is riding with ${emts[one].firstName} ${emts[one].lastName}. Confirm this student is not above the EMT preceptors level. DATE: ${e[4]} TRUCK: ${e[10]}`);
                return;
            } else if (emts[two]) {
                console.log(`${e[6]} is riding with ${emts[two].firstName} ${emts[two].lastName}. Confirm this student is not above the EMT preceptors level. DATE: ${e[4]} TRUCK: ${e[10]}`);
                return;
            } else {
                console.log(`${e[6]}: No Preceptor Found Date: ${e[4]} TRUCK: ${e[10]}`);
                //todo stuck here. 
                return;
            }
        }
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

function isSprintTruck(sprintTrucks: string[], truckNumber: string): boolean {
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

function formatDTG(d: string) {
    return moment(d, "L LTS").toISOString();
}

