import * as firebase from "./firebase"; 
import  * as downloadShifts from "./downloadShifts";
// env file 
require('dotenv').config();

async function  main(){
    downloadShifts.getShiftExcelFile(); 
}


function test(){
}




main(); 
