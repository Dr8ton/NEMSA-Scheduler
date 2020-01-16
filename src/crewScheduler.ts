'use strict';
require('dotenv').config();
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from "fs";

const crew_scheduler = require('../secrets/key.json');

const generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';

/**
 * 
 * @param {number} area - the area that the shifts take place. 
 * @returns {Promise<string[][]>} - resolves to an array of arrays such as: [ '5439411',
    '319 (09hr std crew)',
    'CAD',
    '1/17/2020 12:00:00 AM',
    '1/17/2020 7:30:00 AM',
    '1/17/2020 6:00:00 PM',
    '&nbsp;',t
    '&nbsp;',
    '&nbsp;',
    'True',
    '319',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '017059 Rhodes, A.',
    '1',
    'Taylor, Stephanie',
    '&nbsp;',
    '027676 Demoruelle, N.',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '3',
    '0',
    '0',
    '0',
    '&nbsp;',
    '&nbsp;' ]
 */
export async function scrapeShiftsFromCrewScheduler(area: number): Promise<string[][]> {
    let scrape = await getHTMLFromCrewScheduler(area);
    let scrapedShifts = scrapeShifts(scrape);
    return scrapedShifts;
}

/**
 * lanches puppetter and returns the HTML of the actual schedule as a string
 * 
 * @param region {number} - region of shitfts
 * @returns {string} - html of table
 */
async function getHTMLFromCrewScheduler(region: number): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });
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
    await page.type('#dpStart_dateInput', today.toLocaleDateString());
    await page.type('#dpEnd_dateInput', nextYear.toLocaleDateString());

    await page.waitForSelector('[name=btnGo]');
    await Promise.all([
        page.click('[name=btnGo]'),
        page.waitForNavigation({
            timeout: 30000,
            waitUntil: "networkidle0"
        }),
        page.waitForNavigation({
            timeout: 30000,
            waitUntil: "load"
        }),
        page.waitForNavigation({
            timeout: 30000,
            waitUntil: "domcontentloaded"
        })
    ]);

    const html = await page.$eval('#DataGrid1', (element) => {
        return element.innerHTML
    })
    const htmlAsStirng = `'${html}'`
    browser.close();
    return htmlAsStirng;
}


/**
 * scrapes the html string and returns the shfits as an array of array of individiual shifts
 * 
 * 
 * @param {string} text - html as a string
 * @returns {string[][]} - [][] of shifts 
 */

function scrapeShifts(text: string) {
    const $ = cheerio.load(text, {
        normalizeWhitespace: true,
        xmlMode: true
    });

    const shifts = [];

    let trs = $('tr').each(function (i, elem) {
        let tds = $(this).children('td');
        let shift = [];
        tds.each(function (i, elem) {
            shift.push($(this).text());
        });
        shifts.push(shift);
    });
    return shifts;
}



function writeNewFile(text) {
    fs.writeFile("./dist/test", text, function (err) {
      if (err) {
        return console.log(err);
      }
  
      console.log("The file was saved!");
    });
  }

async function main(){
    let i = await scrapeShiftsFromCrewScheduler(9);
    console.log(i);
}

main(); 
