import * as extract from './extract';

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

describe('isSpringTruck() tests', () => {


    test('it should return TRUE if the truckNumber is in the area', () => {
        let truck ='221';
        expect(extract.isSprintTruck(truck)).toBeTruthy(); 
    });

    test('It should return false if the truckNumber is not in the SPRINT_TRUCK array', () => {
        let truck ='000';
        expect(extract.isSprintTruck(truck)).toBeFalsy(); 

    });

    test('It should return FALSE if the truckNmber is undefined', () => {
        let truck =undefined;
        expect(extract.isSprintTruck(truck)).toBeFalsy(); 
    });

    test('It should return FALSE if the truckNmber is an empty string', () => {
        let truck ='';
        expect(extract.isSprintTruck(truck)).toBeFalsy(); 
    });

 
});

