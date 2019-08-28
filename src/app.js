"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var downloadShifts = require("./downloadShifts");
var cal_1 = require("./cal");
var AREAS_1 = require("./AREAS");
require('dotenv').config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, AREAS_2, area, shiftReport;
        return __generator(this, function (_a) {
            for (_i = 0, AREAS_2 = AREAS_1.AREAS; _i < AREAS_2.length; _i++) {
                area = AREAS_2[_i];
                shiftReport = void 0;
                // TODO: use cache to save calls to DB
                // const [emtPreceptors, paramedicPreceptors] = await Promise.all([getAllActiveEMTPreceptors(area.name), getAllActiveParamedicPreceptors(area.name)]);
                // let SHIFTS = extractShifts(shiftReport, emtPreceptors, paramedicPreceptors, area.sprintTrucks);
                cal_1.clearCalendars(area.calendarIds);
                //   buildCalendar(SHIFTS.paramedic, area.calendarIds.paramedic, area.stations);
                //   buildCalendar(SHIFTS.emt, area.calendarIds.emt, area.stations);
            }
            return [2 /*return*/];
        });
    });
}
function getStationName(listOfStations, stationCode) {
    return listOfStations[stationCode];
}
function buildCalendar(shifts, calendarId, stations) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, shifts_1, shift, location_1, eventData;
        return __generator(this, function (_a) {
            for (_i = 0, shifts_1 = shifts; _i < shifts_1.length; _i++) {
                shift = shifts_1[_i];
                location_1 = getStationName(stations, shift.location);
                eventData = {
                    "eventName": shift.crew + " | " + location_1 + " | " + shift.truck + " ",
                    "description": "Shift ID: " + shift.id,
                    "startTime": "" + shift.startDTG,
                    "endTime": "" + shift.endDTG
                };
                cal_1.addShiftToCalendar(eventData, calendarId);
            }
            return [2 /*return*/];
        });
    });
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.delay = delay;
//Returns file
function downloadReport(area) {
    return __awaiter(this, void 0, void 0, function () {
        var browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, downloadShifts.getShiftExcelFile(area.crewscheduler.region)];
                case 1:
                    browser = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
