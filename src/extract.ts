var xlsx = require('node-xlsx').default;
import moment from 'moment';
import { Shift } from "./Shift";


export function findUseableShifts(scraptedShifts: string[][], sprintTrucks: string[]) {
    const shifts: Shift[] = [];
    // const shifts = {
    //     emt: Shift[],
    //     paramedic: Shift[]
    // }

    scraptedShifts.forEach((e) => {

        //TODO: sprint trucks from DB
        if (isSprintTruck(sprintTrucks, e[10])) {return}
        if (e[1] === 'OS') { return }
        if (alreadyHasStudent(e[6])) { return }

        let one: string = getActualCrewMember(e[15], e[16]);
        let two: string = getActualCrewMember(e[20], e[21]);
        let start: string = formatDTG(e[4]);
        let end: string = formatDTG(e[5]);

        shifts.push(new Shift(e[0], one, two, e[2], start, end, e[10], e[6]));

    });
    return shifts;
}

// emt branch

//         if (emts[one]) {
//             shifts.emt.push(
//                 {
//                     id: e[0],
//                     crew: `${emts[one].firstName} ${emts[one].lastName}`, // TODO: format this as a name not as number. 
//                     location: e[2],
//                     startDTG: `${formatDTG(e[4])}`,
//                     endDTG: `${formatDTG(e[5])}`,
//                     truck: e[10]
//                 });
//         } else if (emts[two]) {
//             shifts.emt.push(
//                 {
//                     id: e[0],
//                     crew: `${emts[two].firstName} ${emts[two].lastName}`, // TODO: format this as a name not as number. 
//                     location: e[2],
//                     startDTG: `${formatDTG(e[4])}`,
//                     endDTG: `${formatDTG(e[5])}`,
//                     truck: e[10]
//                 });
//         }

//         // medic branch

//         if (medics[one]) {
//             shifts.paramedic.push(
//                 {
//                     id: e[0],
//                     crew: `${medics[one].firstName} ${medics[one].lastName}`, // TODO: format this as a name not as number. 
//                     location: e[2],
//                     startDTG: `${formatDTG(e[4])}`,
//                     endDTG: `${formatDTG(e[5])}`,
//                     truck: e[10]
//                 });
//         } else if (medics[two]) {
//             shifts.paramedic.push(
//                 {
//                     id: e[0],
//                     crew: `${medics[two].firstName} ${medics[two].lastName}`, // TODO: format this as a name not as number. 
//                     location: e[2],
//                     startDTG: `${formatDTG(e[4])}`,
//                     endDTG: `${formatDTG(e[5])}`,
//                     truck: e[10]
//                 });
//         }
//     });
//     return shifts;
// }

function isSprintTruck(sprintTrucks: string[], truckNumber: string): boolean {
    return sprintTrucks.includes(truckNumber);
}

export function alreadyHasStudent(notes: string): boolean {
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

function getActualCrewMember(original: string, replacement: string) {
    if (replacement === '&nbsp;') {
        return formatEmployeeId(original);
    } else {
        return formatEmployeeId(replacement)
    }
}