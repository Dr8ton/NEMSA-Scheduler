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
var bottleneck_1 = require("bottleneck");
var google = require('googleapis').google;
var OAuth2 = google.auth.OAuth2;
var calendar = google.calendar('v3');
var googleCredentials = require('../secrets/key.json');
var limiter1 = new bottleneck_1["default"]({
    maxConcurrent: 10,
    minTime: 500
});
function clearCalendars(calendarIds) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, calendars, _i, calendars_1, calendarId, listOfEvents, _a, listOfEvents_1, event_1, params;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    auth = authenticate();
                    calendars = Object.values(calendarIds);
                    _i = 0, calendars_1 = calendars;
                    _b.label = 1;
                case 1:
                    if (!(_i < calendars_1.length)) return [3 /*break*/, 4];
                    calendarId = calendars_1[_i];
                    return [4 /*yield*/, getListOfEvents(calendarId)];
                case 2:
                    listOfEvents = _b.sent();
                    for (_a = 0, listOfEvents_1 = listOfEvents; _a < listOfEvents_1.length; _a++) {
                        event_1 = listOfEvents_1[_a];
                        params = {
                            auth: auth,
                            calendarId: calendarId,
                            eventId: event_1.id
                        };
                        removeShiftFromCalendar(params);
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.clearCalendars = clearCalendars;
function getListOfEvents(calendarId) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, listOfEvents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = authenticate();
                    return [4 /*yield*/, calendar.events.list({
                            auth: auth,
                            calendarId: calendarId,
                            maxResults: 9999,
                            singleEvents: true
                        })];
                case 1:
                    listOfEvents = _a.sent();
                    return [2 /*return*/, listOfEvents.data.items];
            }
        });
    });
}
exports.getListOfEvents = getListOfEvents;
function removeShiftFromCalendar(data) {
    try {
        limiter1.schedule(function (p) { return calendar.events["delete"](p); }, data);
    }
    catch (error) {
        console.log("Unable to schedule even with Bottlneck: " + error);
    }
}
function addShiftToCalendar(data, calendarId) {
    //   console.log(`adding shift to Bootleneck: ${data}`)
    limiter1.schedule(function () { return addEventToCalendar(data, calendarId); }, data, calendarId);
}
exports.addShiftToCalendar = addShiftToCalendar;
//TODO: Document this function
function addEventToCalendar(event, calId) {
    var auth = authenticate();
    try {
        //  console.log(`Adding event: ${event.eventName} @ ${event.startTime}`)
        return calendar.events.insert({
            auth: auth,
            calendarId: calId,
            resource: {
                'summary': event.eventName,
                'description': event.description,
                'start': {
                    'dateTime': event.startTime
                },
                'end': {
                    'dateTime': event.endTime
                }
            }
        });
    }
    catch (error) {
        console.log('unable to add event to calendar: ', error);
    }
}
//TODO: Document this function
function countEventsOnCalendar(calId) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, e, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = authenticate();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, calendar.events.list({
                            auth: auth,
                            calendarId: calId,
                            maxResults: 9999
                        })];
                case 2:
                    e = _a.sent();
                    return [2 /*return*/, e.data.items.length];
                case 3:
                    error_1 = _a.sent();
                    console.log("unable to count number of events created on calendar: " + error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.countEventsOnCalendar = countEventsOnCalendar;
//TODO: Document this function
function authenticate() {
    var oAuth2Client = new OAuth2(googleCredentials.web.client_id, googleCredentials.web.client_secret, googleCredentials.web.redirect_uris[0]);
    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });
    return oAuth2Client;
}
