var xlsx = require('node-xlsx').default;
import moment from 'moment';
import { Shift } from "./Shift";
import { SPRINT_TRUCKS } from "./AREAS";

export function findUseableShifts(scraptedShifts: object[], allPreceptors: PreceptorList) {
    const shifts: Shift[] = [];

    scraptedShifts.forEach((e: PotentialShift) => {

        if (isSprintTruck(e.truckNumber)) { return }
        if (e.shiftName === 'OS') { return }
        if (e.shiftName === 'os') { return }
        if (alreadyHasStudent(e.notes)) {
            isThereAPreceptorOnThisShift(e, allPreceptors)
            return
        }
        if (e.truckNumber === '-') { return };

        let one: string = formatEmployeeId(getActualCrewMember(e.crewOne, e.crewOneReplacement));
        let two: string = formatEmployeeId(getActualCrewMember(e.crewTwo, e.crewTwoReplacement));
        let start: string = formatDTG(e.startTime);
        let end: string = formatDTG(e.endTime);

        shifts.push(new Shift(e.shiftId, one, two, e.station, start, end, e.truckNumber, e.notes));


    });

    return shifts;
}

export function isSprintTruck(truckNumber: string): boolean {
    return SPRINT_TRUCKS.includes(truckNumber);
}

export function alreadyHasStudent(notes: string): boolean {
    if (notes === undefined) {
        return false;
    } else {
        return notes.includes("STUDENT/RIDER:")
    }
}

export function formatEmployeeId(id: string): string {
    if (id === undefined) {
        return "";
    }
    return id.slice(0, 6);
}

function formatDTG(d: string) {
    return moment(d, "L LTS").toISOString();
}

export function getActualCrewMember(original: string, replacement: string) {
    if (replacement === '' || replacement === '&nbsp;') {
        return original;
    } else {
        return replacement
    }
}
export function isThereAPreceptorOnThisShift(shift: PotentialShift, allPreceptors: PreceptorList) {
    let preceptorIdNumbers =  Object.keys(allPreceptors);

    let first: boolean = preceptorIdNumbers.includes(formatEmployeeId(shift.crewOne));
    let second: boolean = preceptorIdNumbers.includes(formatEmployeeId(shift.crewTwo));
    let third  : boolean = preceptorIdNumbers.includes(formatEmployeeId(shift.crewOneReplacement));
    let fourth: boolean = preceptorIdNumbers.includes(formatEmployeeId(shift.crewTwoReplacement));

    if (!first || !second || !third || !fourth){console.log(`Preceptor not found: Truck ${shift.truckNumber} ${shift.startTime}`)};
}




