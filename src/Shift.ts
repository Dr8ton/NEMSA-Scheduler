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
