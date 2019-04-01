import * as firebase from "./firebase"; 
import  * as downloadShifts from "./downloadShifts";
require('dotenv').config();

async function  main(){
    let browser = await downloadShifts.getShiftExcelFile(); 
    browser.close(); 
}


function test(){
}




main(); 
