'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const puppeteer = require('puppeteer');
//let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/LoginCompany.aspx?ReturnUrl=%2fCrewScheduler%2fdefault.aspx';
let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/Main.aspx';
let generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';
function getShiftExcelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({ headless: false });
        const page = yield browser.newPage();
        yield page.setViewport({ width: 900, height: 926 });
        yield page.goto(generalReportURL);
        //main login
        var credentials = process.env.CREWSCHEDULER_CREDENTIALS;
        console.log(credentials);
        yield page.type('#tbCompany', process.env.CREWSCHEDULER_COMPANY);
        yield page.type('#tbUserName', process.env.CREWSCHEDULER_LOGIN);
        yield page.type('#tbPassword', process.env.CREWSCHEDULER_PASSWORD);
        yield page.click('#btnLogin');
        //find and click general report
        yield page.waitForSelector('#ddlReport');
        yield page.select('#ddlReport', '313');
        console.log('report set ');
        yield page.waitForSelector('#ddlRegion');
        yield page.select('#ddlRegion', '9');
        console.log('region set ');
        yield page.waitForSelector('#rbDates');
        yield page.click('#rbDates');
        console.log('dates set');
        let today = new Date();
        let nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDay());
        yield page.waitForSelector('#dpStart_dateInput');
        console.log('start date found');
        yield page.type('#dpStart_dateInput', today.toLocaleDateString());
        yield page.type('#dpEnd_dateInput', nextYear.toLocaleDateString());
        yield page.waitForSelector('#btnExport');
        yield page.click('#btnExport');
        console.log('export btn clicked');
        const response = yield page.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log("load finished");
        browser.close();
    });
}
exports.getShiftExcelFile = getShiftExcelFile;
;
//# sourceMappingURL=downloadShifts.js.map