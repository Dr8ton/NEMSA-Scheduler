'use strict';

const puppeteer = require('puppeteer');
require('dotenv').config();

//let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/LoginCompany.aspx?ReturnUrl=%2fCrewScheduler%2fdefault.aspx';
let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/Main.aspx'; 
let generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 926 });
    await page.goto(generalReportURL);


    //main login
    var credentials = process.env.CREWSCHEDULER_CREDENTIALS; 
    console.log(credentials);
    await page.type('#tbCompany', process.env.CREWSCHEDULER_CREDENTIALS.company);
    await page.type('#tbUserName', process.env.CREWSCHEDULER_CREDENTIALS.login);
    await page.type('#tbPassword', process.env.CREWSCHEDULER_CREDENTIALS.password);

    await page.click('#btnLogin');  

//find and click general report


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

    const response = await page.waitForNavigation({waitUntil:'networkidle2'});
    console.log("load finished")

})();


