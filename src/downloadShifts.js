'use strict';
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
require('dotenv').config();
var puppeteer_1 = require("puppeteer");
var crew_scheduler = require('../secrets/key.json');
var generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';
/**
 * This will download the report from https://scheduling.acadian.com/CrewScheduler/MainMenu.aspx
 * General Reports > Report : Daily Schedule (RAW)
 * From todays date until one year from todays date.
 *
 * @param {number} region - the number of the HTML <select> option for the Region. Should be passed area.crewscheduler.region as an argument.
 *
 * @returns {Browser} browser - returns the browswer object so that it can be cloased after the download has completed.
 */
function getShiftExcelFile(region) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, today, nextYear, selector, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1["default"].launch({ headless: false })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.setViewport({ width: 900, height: 926 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.goto(generalReportURL)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.type('#tbCompany', crew_scheduler.crew_scheduler.company)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.type('#tbUserName', crew_scheduler.crew_scheduler.username)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.type('#tbPassword', crew_scheduler.crew_scheduler.password)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, page.click('#btnLogin')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#ddlReport')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, page.select('#ddlReport', '313')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#ddlRegion')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, page.select('#ddlRegion', region.toString())];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#rbDates')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, page.click('#rbDates')];
                case 14:
                    _a.sent();
                    today = new Date();
                    nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDay());
                    return [4 /*yield*/, page.waitForSelector('#dpStart_dateInput')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, page.type('#dpStart_dateInput', today.toLocaleDateString())];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, page.type('#dpEnd_dateInput', nextYear.toLocaleDateString())];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('[name=btnGo]')];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, page.click('[name=btnGo]')];
                case 19:
                    _a.sent();
                    console.log("before eval");
                    selector = '#DataGrid1 > tbody > tr';
                    return [4 /*yield*/, page.content()];
                case 20:
                    html = _a.sent();
                    console.log(html);
                    console.log("after eval");
                    return [2 /*return*/];
            }
        });
    });
}
exports.getShiftExcelFile = getShiftExcelFile;
getShiftExcelFile(9);
