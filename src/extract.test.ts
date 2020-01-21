import * as extract from './extract';

describe('isSpringTruck() tests', () => {


    test('it should return TRUE if the truckNumber is in the area', () => {
        let truck = '221';
        expect(extract.isSprintTruck(truck)).toBeTruthy();
    });

    test('It should return false if the truckNumber is not in the SPRINT_TRUCK array', () => {
        let truck = '000';
        expect(extract.isSprintTruck(truck)).toBeFalsy();

    });

    test('It should return FALSE if the truckNmber is undefined', () => {
        let truck = undefined;
        expect(extract.isSprintTruck(truck)).toBeFalsy();
    });

    test('It should return FALSE if the truckNmber is an empty string', () => {
        let truck = '';
        expect(extract.isSprintTruck(truck)).toBeFalsy();
    });


});

describe('alreadyHasStudent() tests', () => {

    test('It should return FALSE if the input is UNDEFINED', () => {
        let notes = undefined;
        expect(extract.alreadyHasStudent(notes)).toBeFalsy();
    });

    test('It should return FALSE if the input is "&nbsp;"', () => {
        let notes = '&nbsp;';
        expect(extract.alreadyHasStudent(notes)).toBeFalsy();
    });

    test('It should return FALSE if their is a sting value without "STUDENT/RIDER:"', () => {
        let notes = 'NOTES: Use 94 truck and gear tonight';
        expect(extract.alreadyHasStudent(notes)).toBeFalsy();
    });

    test('It should return TRUE if "STUDENT/RIDER:" is in the middle of the string', () => {
        let notes = "NOTES: CREW 3: 027645 Nickens, J.; STUDENT/RIDER: J Nickens MDCC #12";
        expect(extract.alreadyHasStudent(notes)).toBeTruthy();
    });

    test('It should return TRUE if "STUDENT/RIDER:" is in the front of the string', () => {
        let notes = "STUDENT/RIDER: NEMSA P Student (Casey Aloi)";
        expect(extract.alreadyHasStudent(notes)).toBeTruthy();
    });

});

describe('formatEmployeeId() tests', () => {

    test('It should return a six letter string', () => {
        let id = '123456789'
        let result = extract.formatEmployeeId(id);
        expect(result.length).toEqual(6);
    });

    test('It should return an empty string if the input was undefind', () => {
        let id = undefined
        let result = extract.formatEmployeeId(id);
        expect(result).toEqual('');
    });

    test('It should return an empty string if the input was an empty string', () => {
        let id = ''
        let result = extract.formatEmployeeId(id);
        expect(result).toEqual('');
    });
});

describe('getActualCrewMember() tests', () => {

    test('It should return the original value if replacement value is an empty string', () => {
        let original = 'originalCrewMember';
        let replacement = '';
        expect(extract.getActualCrewMember(original, replacement)).toEqual(original);
    });

    test('It should return original value if replacement value is "&nbsp;"', () => {
        let original = 'originalCrewMember';
        let replacement = '&nbsp;';
        expect(extract.getActualCrewMember(original, replacement)).toEqual(original);
    });

    test('It should return the replacement value if replacement value is any other string', () => {
        let original = 'originalCrewMember';
        let replacement = 'this could literally be anything';
        expect(extract.getActualCrewMember(original, replacement)).toBe(replacement);
    });

});

describe('findUseableShifts()', () => {

    test('It should filter out a shift if it has a sprit truck', () => {
        let scrapped = [{
            shiftID: '5439521',
            shiftName: '221 pm (12hr Sprint)',
            startTime: '1/22/2020 4:00:00 PM',
            endTime: '1/23/2020 4:00:00 AM',
            notes: '&nbsp;', //  no student
            truckNumber: '221', // sprint truck
            crewOne: '&nbsp;',
            crewOneReplacement: '014898 Thomas, K.',
            crewTwo: '&nbsp;',
            crewTwoReplacement: '&nbsp;'
        }]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(0);
    });

    test('it should reject an Over Staff (OS) shift', () => {
        let scrapped = [{
            shiftID: '5439201',
            shiftName: 'OS',
            startTime: '1/21/2020 5:00:00 PM',
            endTime: '1/22/2020 5:00:00 AM',
            notes: '&nbsp;',
            truckNumber: '302',
            crewOne: '023491 Bosarge, B.',
            crewOneReplacement: '&nbsp;',
            crewTwo: '024884 Spicuzza, C.',
            crewTwoReplacement: '&nbsp;'
        }]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(0);
    });

    test('it should reject a Shift if it already has a student', () => {
        let scrapped = [{
            shiftID: '5439169',
            shiftName: '95:Ngt E (12hr std crew)',
            startTime: '1/22/2020 4:00:00 PM',
            endTime: '1/23/2020 4:00:00 AM',
            notes:
                'NOTES: CREW 3: 027242 Frank, J.; STUDENT/RIDER: J Frank MDCC #7',
            truckNumber: '095',
            crewOne: '023943 Edmonds, C.',
            crewOneReplacement: '&nbsp;',
            crewTwo: '026104 Sibley, R.',
            crewTwoReplacement: '&nbsp;'
        }]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(0);
    });

    test('should include shifts that dont have students, are not sprint trucks, and do not have students', () => {
        let scrapped = [
            {
                shiftID: '5439328',
                shiftName: 'XB718 (12hr Basic Crew)',
                startTime: '1/22/2020 11:00:00 AM',
                endTime: '1/22/2020 11:00:00 PM',
                notes: 'NOTES: CS 2 gear',
                truckNumber: 'XB718',
                crewOne: '&nbsp;',
                crewOneReplacement: '027634 Smith, B.',
                crewTwo: '&nbsp;',
                crewTwoReplacement: '029588 Blythe, A.'
            }]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(1);


    });




})
