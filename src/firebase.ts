// DOCs - https://firebase.google.com/docs/reference/js/?authuser=0
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var config = {
  apiKey: "AIzaSyAt79Jd_GIWsjGKBJkX4nRjd0AlmVfkS2Y",
  authDomain: "nemsa-6c408.firebaseapp.com",
  databaseURL: "https://nemsa-6c408.firebaseio.com",
  projectId: "nemsa-6c408",
  storageBucket: "nemsa-6c408.appspot.com",
  messagingSenderId: "512173906413"
}

firebase.initializeApp(config);

var db = firebase.firestore();

/**
 * adds a PARAMEDIC preceptor to the list of available preceptors
 * 
 * @param {string} num: employee number as STRING. must include leading zero. 
 * @param {string} first: employee's first name
 * @param {string} last: employee's last name
 * @param {boolean} active: is this an active prector
 * 
 */
export function addParamedicPreceptor(num: string, first: string, last: string, active: boolean): any {
  var docRef = db.collection('northshore').doc('preceptors').collection('paramedics');

  var data = {
    firstName: first,
    lastName: last,
    active: true
  };

  var setMedic = docRef.doc(num).set(data)
}

/**
 * gets all EMT preceptors that are Active . 
 * 
 * @param {string} region -  The region that to request Paramedic Preceptors.This should be the same as the DB https://console.firebase.google.com/
 * 
 * @returns {object} preceptor -   { active: boolean, firstName: string, lastName: string, id: string }
 */
export async function getAllActiveEMTPreceptors(region:string) {
  let emtRef = await db.collection(region).doc('preceptors').collection('emts');
  let activeEmts = await emtRef.where('active', '==', true).get();
  let preceptors = [];

  for (let emt of activeEmts.docs) {
    let x = emt.data();
    x.id = emt.id;
    preceptors.push(x);
  }
  return preceptors;

}

/**
 * gets all {Paramedic} preceptors that are Active . 
 * 
 * @param {string} region -  The region that to request EMT Preceptors.This should be the same as the DB https://console.firebase.google.com/
 * 
 * @returns {object} preceptor -   { active: boolean, firstName: string, lastName: string, id: string }
 */
export async function getAllActiveParamedicPreceptors(region:string) {
  let emtRef = await db.collection(region).doc('preceptors').collection('paramedics');
  let activeEmts = await emtRef.where('active', '==', true).get();
  let preceptors = [];

  for (let emt of activeEmts.docs) {
    let x = emt.data();
    x.id = emt.id;
    preceptors.push(x);
  }
  return preceptors;
}

