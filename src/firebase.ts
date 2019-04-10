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
 * @returns {?} TODO: what does this method return???
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
// FIXME
export async function getAllActiveEMTPreceptors() {
  let emtRef = await db.collection('northshore').doc('preceptors').collection('emts');
  let activeEmts = await emtRef.where('active', '==', true).get();
  let preceptors = [];

  for (let emt of activeEmts.docs) {
    let x = emt.data();
    x.id = emt.id;
    preceptors.push(x);
  }
  return preceptors;

}


export async function getAllActiveParamedicPreceptors() {
  let emtRef = await db.collection('northshore').doc('preceptors').collection('paramedics');
  let activeEmts = await emtRef.where('active', '==', true).get();
  let preceptors = [];

  for (let emt of activeEmts.docs) {
    let x = emt.data();
    x.id = emt.id;
    preceptors.push(x);
  }
  console.log(preceptors);
  return preceptors;
}

// export async function getAllActivePreceptors() {
//   let p = await getAllActiveParamedicPreceptors();
//   let e = await getAllActiveEMTPreceptors();
//   let preceptors: string[] = p.concat(e);
//   return preceptors;
// }

