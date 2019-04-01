var fb = require("./firebase.js");
var xlsx = require('node-xlsx').default;


const workSheetsFromFile = xlsx.parse(`../../../../Downloads/Daily Schedule (RAW) (1).xlsx`);


let dataFromReport = workSheetsFromFile[0].data

// var columns = {};
// for (var i = 0; i < oFullResponse.results.length; i++) {
//     var key = oFullResponse.results[i].label;
//     columns[key] = {
//         sortable: true,
//         resizeable: true
//     };
// }

export function extractShifts() {

    let shifts = {};

    dataFromReport.forEach((e) => {
        if (isSprintTruck(e[10])) {
            return;
        }

        if (alreadyHasStudent(e[6])) {
            return;
        }

        let one: string = e[16] === undefined ? e[15] : e[16];
        let two: string = e[21] === undefined ? e[20] : e[21];

        if (!isActiveEMTPreceptor(one) && !isActiveParamedicPreceptor(one) && !isActiveParamedicPreceptor(two) && !isActiveEMTPreceptor(two)) {
            return;
        }

        let key: string = e[0];
        shifts[key] = {
            crewOne: one,
            crewTwo: two,
            location: e[2],
            startDTG: e[4],
            endDTG: e[5],
            truck: e[10]
        }

        // TODO: Maybe skip creating shift object and just create calendar event?
    });

    return shifts;
}


// TODO: work the spreadsheet


//'SchedShiftID',0, unique ID of shift
//  'ShiftName',1, truck full name
//  'LocationCode',2 station

//  'ShiftDate',3 date but not time of start or finish
//  'StartTime',4 DTG that shift starts
//  'EndTime',5 DTG that the shift ends
//  'Notes',6 STUDENT/RIDER: ${student}

//  PlannedRes1, 10 truck number 

//  'PlannedRes2',15, crewOne
//  'ActualRes2',16 replacedOne

//  'PlannedRes3',20, crewTwo
//  'ActualRes3',21, replacedTwo




/**
 * Summary. Checks for acitve PARAMEDIC preceptor. 
 * 
 * Description. Not all employees are preceptors and not all preceptors are available to have students. This checks against the list of PARAMEDIC preceptors to see if they are both a PARAMEDIC preceptor and active. 
 * 
 * @param {string} employeeNumber: employee's number from the schedule. 
 * 
 * @returns {boolean} true if the employee is an active PARAMEDIC preceptor. FALSE if the employee is not BOTH a PARAMEDIC preceptor and active. 
 */
function isActiveParamedicPreceptor(empNumber: string) {
    // TODO: expand logic in isActiveParamedicPreceptor();
    return true;
}

/**
 * Summary. Checks for acitve EMT preceptor. 
 * 
 * Description. Not all employees are EMT preceptors and not all EMT preceptors are available to have students. This checks against the list of EMT preceptors to see if they are both an EMT preceptor and active. 
 * 
 * @param {string} employeeNumber: employee's number from the schedule. 
 * 
 * @returns {boolean} true if the employee is an active EMT preceptor. FALSE if the employee is not BOTH an EMT preceptor and active. 
*/
function isActiveEMTPreceptor(empNumber: string): boolean {
    // TODO: expand logic in isActiveEMTPrectpror(); 
    return true;
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
        "227"
    ]

    return sprintTrucks.includes(truckNumber);
}

function alreadyHasStudent(notes: string): boolean {
    return notes.includes("STUDENT/RIDER:")
}


let currentShifts = extractShifts();
console.log(currentShifts); 