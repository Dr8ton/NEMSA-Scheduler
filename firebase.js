
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


// TODO: add firestore service here.
  var config = {
    apiKey: "AIzaSyAt79Jd_GIWsjGKBJkX4nRjd0AlmVfkS2Y",
    authDomain: "nemsa-6c408.firebaseapp.com",
    databaseURL: "https://nemsa-6c408.firebaseio.com",
    projectId: "nemsa-6c408",
    storageBucket: "nemsa-6c408.appspot.com",
    messagingSenderId: "512173906413"
  };
  firebase.initializeApp(config); 
  
  var db = firebase.firestore();



/**
 * adds a PARAMEDIC preceptor to the list of available preceptors
 * 
 * @param {string} num: employee number as STRING. must include leading zero. 
 * @param {string} first: employee's first name
 * @param {string} last: employee's last name
 * @param {boolean} active: whether or not the employee is active
 * 
 * @returns {number}
 */
function addParamedicPreceptor(num, first, last, active){
    var docRef = db.collection('northshore').doc('preceptors').collection('paramedics');

    var data = {
        firstName: first, 
        lastName: last,
        active: active
    };


  
  
  var setMedic = docRef.doc(num).set(data)
    .then(console.log(setMedic));
};



addParamedicPreceptor('987654', 'drayton', 'bruch', true);

