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

});
