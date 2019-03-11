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
  };
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
function addParamedicPreceptor(num: string, first: string, last: string, active: boolean){
    var docRef = db.collection('northshore').doc('preceptors').collection('paramedics');

    var data = {
        firstName: first, 
        lastName: last,
        active: true
    };
    
    var setMedic = docRef.doc(num).set(data)
    .then(console.log(setMedic));
}

/**
 * returns an ACTIVE Paramedic preceptor. 
 * It is on the user to check to make sure the preceptor is active.
 * 
 * @param {string} employeeId: employee number as STRING. must include leading zero. 
 * 
 * @returns {object} returns object that is in preceptor docuemtent ex: {active: TRUE, firstName: "John", lastName: "Smith"} 
 * If no preceptor found then returns undefinded. 
 */
function getParamedicPreceptor(employeeId){
    var docRef = db.collection('northshore').doc('preceptors').collection('paramedics').doc(employeeId);  

    
    
   docRef.get().then(function(doc) {
        if (doc.exists) {
            return doc.data();
        } else {
            // doc.data() will be undefined in this case
            return undefined; 
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

/**
 * returns an ACTIVE EMT preceptor. 
 * It is on the user to check to make sure the preceptor is active.
 * 
 * @param {string} employeeId: employee number as STRING. must include leading zero. 
 * 
 * @returns {object} returns object that is in preceptor docuemtent ex: {active: TRUE, firstName: "John", lastName: "Smith"} 
 * If no preceptor found then returns undefinded. 
 */
function getEmtPreceptor(employeeId){
    var docRef = db.collection('northshore').doc('preceptors').collection('emts').doc(employeeId);  
    
   docRef.get().then(function(doc) {
        if (doc.exists) {
            return doc.data();
        } else {
            // doc.data() will be undefined in this case
            return undefined; 
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


function getAllParamedicPreceptors(){
    var medicRef = db.collection('northshore').doc('preceptors').collection('emts');
    var allMedics = medicRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

}
getAllParamedicPreceptors();
