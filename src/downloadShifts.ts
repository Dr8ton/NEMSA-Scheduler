'use strict';
require('dotenv').config();
import puppeteer, { Browser } from 'puppeteer';
import { delay } from './app';
const crew_scheduler = require('../secrets/key.json');

const generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';
/**
 * This will download the report from https://scheduling.acadian.com/CrewScheduler/MainMenu.aspx
 * General Reports > Report : Daily Schedule (RAW)
 * From todays date until one year from todays date. 
 * 
 * @param {number} region - the number of the HTML <select> option for the Region. Should be passed area.crewscheduler.region as an argument. 
 * 
 * @returns {Browser} browser - returns the browswer object so that it can be cloased after the download has completed. 
 */
export async function getShiftExcelFile(region: number) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 926 });
    await page.goto(generalReportURL);

    await page.type('#tbCompany', crew_scheduler.crew_scheduler.company);
    await page.type('#tbUserName', crew_scheduler.crew_scheduler.username);
    await page.type('#tbPassword', crew_scheduler.crew_scheduler.password);
    await page.click('#btnLogin');

    await page.waitForSelector('#ddlReport');
    await page.select('#ddlReport', '313');

    await page.waitForSelector('#ddlRegion');
    await page.select('#ddlRegion', region.toString());

    await page.waitForSelector('#rbDates');
    await page.click('#rbDates');

    let today = new Date();
    let nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDay());

    await page.waitForSelector('#dpStart_dateInput');
    delay(3000);// FIXME : Can I delete this?
    await page.type('#dpStart_dateInput', today.toLocaleDateString());
    delay(3000);// FIXME : Can I delete this?
    await page.type('#dpEnd_dateInput', nextYear.toLocaleDateString());
    delay(3000);// FIXME : Can I delete this?

    return browser;
};


