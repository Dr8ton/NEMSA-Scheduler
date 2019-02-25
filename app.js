'use strict';

const puppeteer = require('puppeteer');

let crewSchedulerURL = 'https://scheduling.acadian.com/CrewScheduler/LoginCompany.aspx?ReturnUrl=%2fCrewScheduler%2fdefault.aspx';
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(crewSchedulerURL);


    //main login
    await page.type('#tbCompany', 'acadian');
    await page.type('#tbUserName', '020780');
    await page.type('#tbPassword', '1986DraytonKittel');

    await page.click('#btnLogin');  

     const f = await page.frames();
    console.log(f);
    //await browser.close();
})();