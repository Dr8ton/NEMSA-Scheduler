'use strict';
require('dotenv').config();
import fs from 'fs';
import puppeteer, { Browser } from 'puppeteer';
import { delay } from './app';
import * as cheerio from 'cheerio';

enum Shift {
  Id = 0,
  ShiftName = 1,
  LocationCode = 2,
  ShiftDate = 3,
  StartTime = 4,
  EndTime = 5,
  Notes = 6,
  TruckNumber = 10,
  CrewOne = 15,
  ReplacedOne = 16,
  CrewTwo = 20,
  ReplacedTwo = 21
}


const crew_scheduler = require('../secrets/key.json');

const generalReportURL = 'https://scheduling.acadian.com/CrewScheduler/ReportsCrystal.aspx?category=general';

export async function getHTMLFromCrewScheduler(region: number): Promise<string> {
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
  await page.type('#dpStart_dateInput', today.toLocaleDateString());
  await page.type('#dpEnd_dateInput', nextYear.toLocaleDateString());

  await page.waitForSelector('[name=btnGo]');
  await Promise.all([
    page.click('[name=btnGo]'),
    page.waitForNavigation({
      timeout: 10000,
      waitUntil: "networkidle0"
    }),
    page.waitForNavigation({
      timeout: 10000,
      waitUntil: "load"
    }),
    page.waitForNavigation({
      timeout: 10000,
      waitUntil: "domcontentloaded"
    })
  ]);

  const selector = '#DataGrid1 > tbody > tr';

  const html = await page.$eval('#DataGrid1', (element) => {
    return element.innerHTML
  })
  const htmlAsStirng = `'${html}'`
  // const html = await page.content();

  return htmlAsStirng;
}



export function scrapeShifts(text: string) {
  const $ = cheerio.load(text, {
    normalizeWhitespace: true,
    xmlMode: true
  });
  const shifts = [];

  let trs = $('tr').each(function (i, elem) {
    shifts[i] = $(this).children().text();
  });

  console.log(shifts)

}
async function main() {
  let scrape = await getHTMLFromCrewScheduler(9);
  scrapeShifts(scrape);
}

function writeNewFile(text: string) {
  fs.writeFile("./dist/test", text, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

main();

//Todo: add enums from readme file under source. then connect that with .get() from cheerio
https://www.raymondcamden.com/2016/11/30/scraping-a-web-page-in-node-with-cheerio
