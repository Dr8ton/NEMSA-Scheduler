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
        let scrapped = [[
            '5257817',
            '221 (12hr std crew)', //sprint truck
            'IN',
            '9/18/2019 12:00:00 AM',
            '9/18/2019 5:30:00 PM',
            '9/19/2019 5:30:00 AM',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            'True',
            '098',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '022593 Robertson, D.',
            '1',
            'Taylor, Stephanie',
            '&nbsp;',
            '022593 Robertson, D.',
            '023205 Brock, A.',
            '1',
            'Taylor, Stephanie',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '3',
            '0',
            '0',
            '0',
            '&nbsp;',
            '&nbsp;']]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(0);
    });

    test('it should reject an Over Staff shift', () => {
        let scrapped = [['5280780',
            'OS', // overstaff shift
            'SLC',
            '9/18/2019 12:00:00 AM',
            '9/18/2019 5:00:00 PM',
            '9/19/2019 5:00:00 AM',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            'False',
            '-',
            '-',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '029056 Hemphill, P.',
            'OS',
            'Taylor, Stephanie',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '1',
            '0',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;']]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(0);
    });

    test('it should reject a Shift if it already has a student', () => {
        let scrapped = [['5257580',
            '196: Night Odd (12hr std crew)',
            'SLC',
            '9/18/2019 12:00:00 AM',
            '9/18/2019 5:00:00 PM',
            '9/19/2019 5:00:00 AM',
            'NOTES: CREW 3: 025784 White, M.; STUDENT/RIDER: M White MDCC #9', //already has student. 
            'M White MDCC #9',
            '&nbsp;',
            'True',
            '196',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '018313 Hopkins, K.',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '026980 Robbins, A.',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '025784 White, M.',
            'CP',
            'Jenkins, Markus',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '&nbsp;',
            '4',
            '0',
            '0',
            '0',
            '0',
            '&nbsp;']]
        expect(extract.findUseableShifts(scrapped)).toHaveLength(0);
    });

    // test('should include shifts that dont have students, are not sprint trucks, and do not have students', () => {
    //     expect(extract.findUseableShifts(scrapped)).toHaveLength(0);


    // });




})
