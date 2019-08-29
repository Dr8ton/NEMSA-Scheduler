'use strict';
require('dotenv').config();
import fs from 'fs';
import puppeteer, { Browser } from 'puppeteer';
import { delay } from './app';
import * as cheerio from 'cheerio';

enum Shift {
  Id = 0,
  ShiftName = 1,
  StationCode = 2,
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
const oneTD = `'<tbody><tr style="color:Black;background-color:White;">
<td>5257734</td><td>XB813 (12hr Basic Crew)</td><td>CAD</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 8:00:00 AM</td><td>9/19/2019 8:00:00 PM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>Xb813</td><td>Xb813</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>028763 Keller, K.</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>029223 Thibodeaux, E.</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr></tbody>'`
const htmlData = `'<tbody><tr style="color:Black;background-color:White;">
<td>5257734</td><td>XB813 (12hr Basic Crew)</td><td>CAD</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 8:00:00 AM</td><td>9/19/2019 8:00:00 PM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>Xb813</td><td>Xb813</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>028763 Keller, K.</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>029223 Thibodeaux, E.</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:#EEEEEE;">
<td>5257701</td><td>99 (10hr std crew)</td><td>IN</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 9:00:00 AM</td><td>9/19/2019 7:00:00 PM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>099</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>017462 Tardo, J.</td><td>015942 Waguespack, M.</td><td>FL</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>023407 Menne, J.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:White;">
<td>5257744</td><td>XB811 (12hr Basic Crew)</td><td>SLC</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 9:00:00 AM</td><td>9/19/2019 9:00:00 PM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>Xb817</td><td>Xb817</td><td>E</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>014061 Breland, K.</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>029178 Billiot, A.</td><td>AE</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:#EEEEEE;">
<td>5257515</td><td>92: Power E (12hr std crew)</td><td>HA</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 10:00:00 AM</td><td>9/19/2019 10:00:00 PM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>092</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>023794 Ragoonath, V.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>024521 Booth, S.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:White;">
<td>5257522</td><td>308 Even (12hr std crew)</td><td>CAD</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 11:00:00 AM</td><td>9/19/2019 11:00:00 PM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>308</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>021283 DiMaggio, C.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>028954 McClendon, A.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:#EEEEEE;">
<td>5257543</td><td>307 Day E (12hr std crew)</td><td>SLC</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 12:00:00 PM</td><td>9/20/2019 12:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>307</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>023909 Campbell, K.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>025230 Sanchez, J.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:White;">
<td>5257915</td><td>221 pm (12hr Sprint)</td><td>SLC</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 4:00:00 PM</td><td>9/20/2019 4:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>221</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>017816 Albritton, B.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>2</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:#EEEEEE;">
<td>5257929</td><td>226 Night Even (12hr Sprint)</td><td>FOL</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 4:00:00 PM</td><td>9/20/2019 4:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>226</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>015676 Silas, S.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>2</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:White;">
<td>5257557</td><td>304: Ngt E (12hr std crew)</td><td>SLC</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 4:00:00 PM</td><td>9/20/2019 4:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>304</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>014901 Webb, B.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>027624 Hover, H.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:#EEEEEE;">
<td>5257564</td><td>95:Ngt E (12hr std crew)</td><td>HA</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 4:00:00 PM</td><td>9/20/2019 4:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>095</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>023943 Edmonds, C.</td><td>022524 Pounds, L.</td><td>V</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>026104 Sibley, R.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:White;">
<td>5257581</td><td>196: Night Odd (12hr std crew)</td><td>SLC</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 5:00:00 PM</td><td>9/20/2019 5:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>196</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>018313 Hopkins, K.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>026980 Robbins, A.</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>0</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td>
</tr><tr style="color:Black;background-color:#EEEEEE;">
<td>5257849</td><td>219 (12hr Sprint)</td><td>CAD</td><td>9/19/2019 12:00:00 AM</td><td>9/19/2019 5:00:00 PM</td><td>9/20/2019 5:00:00 AM</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>True</td><td>219</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>012897 Samuels, G.</td><td>1</td><td>Taylor, Stephanie</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>2</td><td>0</td><td>0</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
</tr>
</tbody>''`
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
      timeout: 15000,
      waitUntil: "networkidle0"
    }),
    page.waitForNavigation({
      timeout: 15000,
      waitUntil: "load"
    }),
    page.waitForNavigation({
      timeout: 15000,
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
    let tds = $(this).children('td');
    let shift = [];
    tds.each(function (i, elem) {
     shift.push($(this).text()); 
    });
    shifts.push(shift);
  });
}
async function main() {
  //let scrape = await getHTMLFromCrewScheduler(9);
  scrapeShifts(htmlData);
}

main();
