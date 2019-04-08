'use strict';
require('dotenv').config();
import puppeteer from 'puppeteer';
import { delay } from './app';

const generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';

export async function getShiftExcelFile(){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 926 });
    await page.goto(generalReportURL);

    await page.type('#tbCompany', process.env.CREWSCHEDULER_COMPANY);
    await page.type('#tbUserName', process.env.CREWSCHEDULER_LOGIN);
    await page.type('#tbPassword', process.env.CREWSCHEDULER_PASSWORD);

    await page.click('#btnLogin');  

    await page.waitForSelector('#ddlReport');
    await page.select('#ddlReport', '313');

    await page.waitForSelector('#ddlRegion');
    await page.select('#ddlRegion', '9');

    await page.waitForSelector('#rbDates');
    await page.click('#rbDates');

    let today = new Date();
    let nextYear = new Date(today.getFullYear()+1, today.getMonth(), today.getDay());

    await page.waitForSelector('#dpStart_dateInput');
    delay(3000);
    await page.type('#dpStart_dateInput', today.toLocaleDateString());
    delay(3000);
    await page.type('#dpEnd_dateInput', nextYear.toLocaleDateString());
    delay(3000);

    await page.waitForSelector('#btnExport');
    await page.click('#btnExport');

    return browser;  
    };


