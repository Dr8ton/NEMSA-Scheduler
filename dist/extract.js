var fb = require("./firebase.js");
var xlsx = require('node-xlsx').default;
const workSheetsFromFile = xlsx.parse(`Daily.xlsx`);
let dataFromReport = workSheetsFromFile[0].data;
let shifts = [];
//dataFromReport.forEach((e) => {
//    if(isSprintTruck(e[10])){
//        continue;
//    }
//    
//    if(crewOne || crewTwo are preceptors){
//        Append to shifts
//    }
//    
//    
//    });
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
function isActiveParamedicPreceptor() {
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
function isActiveEMTPreceptor() {
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
function isSprintTruck(truckNumber) {
    //TODO: add this to DB so that this can scale to other areas
    let sprintTrucks = [
        "221",
        "219",
        "226",
        "227"
    ];
    return sprintTrucks.includes(truckNumber);
}
console.log();
//# sourceMappingURL=extract.js.map