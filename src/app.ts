import * as firebase from "./firebase"; 

// env file 
require('dotenv').config();

async function  main(){
    let drayton = await firebase.process_tasks('020780');
    console.log(drayton);
}







main(); 