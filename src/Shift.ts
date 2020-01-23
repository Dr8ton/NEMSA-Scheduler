/**
 *  id: '5461762',
    crewOne: '017462',
    crewTwo: '029731',
    location: 'IN',
    startDTG: '2020-02-04T15:00:00.000Z',
    endDTG: '2020-02-05T01:00:00.000Z',
    truck: '099',
    notes: '&nbsp;' },
 */

export class Shift {
    id: string;
    crewOne: string;
    crewTwo: string;
    location: string;
    startDTG: string;
    endDTG: string;
    truck: string;
    notes: string;

    constructor(
        id: string,
        crewOne: string,
        crewTwo: string,
        location: string,
        startDTG: string,
        endDTG: string,
        truck: string,
        notes: string, ) {
        this.id = id;
        this.crewOne = crewOne;
        this.crewTwo = crewTwo;
        this.location = location;
        this.startDTG = startDTG;
        this.endDTG = endDTG;
        this.truck = truck;
        this.notes = notes;
    }
}
