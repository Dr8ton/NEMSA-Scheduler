'use strict';
require('dotenv').config();
import puppeteer from 'puppeteer';

const generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';

export async function getShiftExcelFile(){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 926 });
    await page.goto(generalReportURL);

    console.log(`Attempting to insert credentials : ${process.env.CREWSCHEDULER_COMPANY}`)
    await page.type('#tbCompany', process.env.CREWSCHEDULER_COMPANY);
    await page.type('#tbUserName', process.env.CREWSCHEDULER_LOGIN);
    await page.type('#tbPassword', process.env.CREWSCHEDULER_PASSWORD);

    await page.click('#btnLogin');  

    await page.waitForSelector('#ddlReport');
    await page.select('#ddlReport', '313');
    console.log('report set ');

    await page.waitForSelector('#ddlRegion');
    await page.select('#ddlRegion', '9');
    console.log('region set ');

    await page.waitForSelector('#rbDates');
    await page.click('#rbDates');
    console.log('dates set');


    let today = new Date();
    let nextYear = new Date(today.getFullYear()+1, today.getMonth(), today.getDay());

    await page.waitForSelector('#dpStart_dateInput');
    console.log('start date found');
    await page.type('#dpStart_dateInput', today.toLocaleDateString());
    await page.type('#dpEnd_dateInput', nextYear.toLocaleDateString());

    await page.waitForSelector('#btnExport');
    await page.click('#btnExport');
    console.log('export btn clicked');
    // TODO: return file name/path; 
    //browser.close()
    return browser;  
    
    // TODO: return file name/path; 
};


