'use strict';

const puppeteer = require('puppeteer');

//let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/LoginCompany.aspx?ReturnUrl=%2fCrewScheduler%2fdefault.aspx';
let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/Main.aspx'; 
let generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 926 });
    await page.goto(generalReportURL);


    //main login
    await page.type('#tbCompany', 'acadian');
    await page.type('#tbUserName', '020780');
    await page.type('#tbPassword', '1986DraytonKittel');

    await page.click('#btnLogin');  

//find and click general report


    await page.waitForSelector('#ddlReport');
    await page.select('#ddlReport', '313');

    await page.waitForSelector('#ddlRegion');
    await page.select('#ddlRegion', '9');
})();

