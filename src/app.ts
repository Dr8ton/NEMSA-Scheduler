import * as firebase from "./firebase"; 
import  * as downloadShifts from "./downloadShifts";
require('dotenv').config();

async function  main(){
    let browswer = await downloadShifts.getShiftExcelFile(); 
    browswer.close(); 
}


function test(){
}




main(); 
