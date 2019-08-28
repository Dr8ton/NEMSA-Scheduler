"use strict";
exports.__esModule = true;
var xlsx = require('node-xlsx')["default"];
var path_1 = require("path");
var moment_1 = require("moment");
var downloadsFolder = require("downloads-folder");
//TODO: Document this function
function extractShifts(fileName, emts, medics, sprintTrucks) {
    console.log("Extracting shifts");
    var dl = path_1["default"].join(downloadsFolder(), fileName);
    //testing which skips download of file from site. 
    // const testReport = xlsx.parse("report.xlsx", { cellDates: true });
    // let dataFromReport = testReport[0].data
    // //working setup
    var workSheetsFromFile = xlsx.parse(dl, { cellDates: true });
    var dataFromReport = workSheetsFromFile[0].data;
    var shifts = {
        emt: [],
        paramedic: []
    };
    dataFromReport.forEach(function (e) {
        //TODO: sprint trucks from DB
        if (isSprintTruck(sprintTrucks, e[10])) {
            return;
        }
        if (e[1] === 'OS') {
            return;
        }
        var one = e[16] === undefined ? formatEmployeeId(e[15]) : formatEmployeeId(e[16]);
        var two = e[21] === undefined ? formatEmployeeId(e[20]) : formatEmployeeId(e[21]);
        if (alreadyHasStudent(e[6])) {
            if (medics[one] || medics[two]) {
                return;
            }
            else if (emts[one]) {
                console.log(e[6] + " is riding with " + emts[one].firstName + " " + emts[one].lastName + ". Confirm this student is not above the EMT preceptors level. DATE: " + e[4] + " TRUCK: " + e[10]);
                return;
            }
            else if (emts[two]) {
                console.log(e[6] + " is riding with " + emts[two].firstName + " " + emts[two].lastName + ". Confirm this student is not above the EMT preceptors level. DATE: " + e[4] + " TRUCK: " + e[10]);
                return;
            }
            else {
                console.log(e[6] + ": No Preceptor Found Date: " + e[4] + " TRUCK: " + e[10]);
                return;
            }
        }
        // emt branch
        if (emts[one]) {
            shifts.emt.push({
                id: e[0],
                crew: emts[one].firstName + " " + emts[one].lastName,
                location: e[2],
                startDTG: "" + formatDTG(e[4]),
                endDTG: "" + formatDTG(e[5]),
                truck: e[10]
            });
        }
        else if (emts[two]) {
            shifts.emt.push({
                id: e[0],
                crew: emts[two].firstName + " " + emts[two].lastName,
                location: e[2],
                startDTG: "" + formatDTG(e[4]),
                endDTG: "" + formatDTG(e[5]),
                truck: e[10]
            });
        }
        // medic branch
        if (medics[one]) {
            shifts.paramedic.push({
                id: e[0],
                crew: medics[one].firstName + " " + medics[one].lastName,
                location: e[2],
                startDTG: "" + formatDTG(e[4]),
                endDTG: "" + formatDTG(e[5]),
                truck: e[10]
            });
        }
        else if (medics[two]) {
            shifts.paramedic.push({
                id: e[0],
                crew: medics[two].firstName + " " + medics[two].lastName,
                location: e[2],
                startDTG: "" + formatDTG(e[4]),
                endDTG: "" + formatDTG(e[5]),
                truck: e[10]
            });
        }
    });
    console.log("Extraction complete");
    return shifts;
}
exports.extractShifts = extractShifts;
/**
 * Summary. Checks to see if the truck on shift is a sprint truck.
 *
 * Description. Sprint trucks are not transporting units and therefore are typically not allow to carry students.
 *
 * @param {string} num: truck unit number.
 *
 * @returns {boolean} true if the truck is a sprint truck. FALSE if the truck is not a sprint truck.
 */
function isSprintTruck(sprintTrucks, truckNumber) {
    return sprintTrucks.includes(truckNumber);
}
//TODO: Document this function
function alreadyHasStudent(notes) {
    if (notes === undefined) {
        return false;
    }
    else {
        return notes.includes("STUDENT/RIDER:");
    }
}
//TODO: Document this function
function formatEmployeeId(id) {
    if (id === undefined) {
        return "";
    }
    return id.slice(0, 6);
}
//TODO: Document this function
function formatDTG(d) {
    var m = moment_1["default"](d);
    var roundUp = m.second() || m.millisecond() ? m.add(1, 'minute').startOf('minute') : m.startOf('minute');
    return roundUp.toISOString();
}
