"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
function addParamedicPreceptor(num, first, last, active) {
    var docRef = db.collection('northshore').doc('preceptors').collection('paramedics');
    var data = {
        firstName: first,
        lastName: last,
        active: true
    };
    var setMedic = docRef.doc(num).set(data);
}
exports.addParamedicPreceptor = addParamedicPreceptor;
/**
 * returns an ACTIVE Paramedic preceptor.
 * It is on the user to check to make sure the preceptor is active.
 *
 * @param {string} employeeId: employee number as STRING. must include leading zero.
 *
 * @returns {object} returns object that is in preceptor docuemtent ex: {active: TRUE, firstName: "John", lastName: "Smith"}
 * If no preceptor found then returns undefinded.
 */
function getParamedicPreceptor(employeeId) {
    var docRef = db.collection('northshore').doc('preceptors').collection('paramedics').doc(employeeId);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            console.log(doc.data());
            return doc.data();
        }
        else {
            // doc.data() will be undefined in this case
            return 'Doc not found';
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}
exports.getParamedicPreceptor = getParamedicPreceptor;
/**
 * returns an ACTIVE EMT preceptor.
 * It is on the user to check to make sure the preceptor is active.
 *
 * @param {string} employeeId: employee number as STRING. must include leading zero.
 *
 * @returns {object} returns object that is in preceptor docuemtent ex: {active: TRUE, firstName: "John", lastName: "Smith"}
 * If no preceptor found then returns undefinded.
 */
function getEmtPreceptor(employeeId) {
    var docRef = db.collection('northshore').doc('preceptors').collection('emts').doc(employeeId);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            return doc.data();
        }
        else {
            // doc.data() will be undefined in this case
            return undefined;
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}
exports.getEmtPreceptor = getEmtPreceptor;
function getAllParamedicPreceptors() {
    var medicRef = db.collection('northshore').doc('preceptors').collection('paramedics');
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
exports.getAllParamedicPreceptors = getAllParamedicPreceptors;
/**
 * Summary. returns all preceptors (EMT and P) that are active.
 *
 * Description. searches the DB and returns an array of employee numbers as strings from preceptors that are active.
 *
 * @returns {string[]}. returns an array of strings that are active preceptors.
 */
function getAllActivePreceptors() {
    return __awaiter(this, void 0, void 0, function* () {
        var medicRef = yield db.collection('northshore').doc('preceptors').collection('paramedics');
        var p = [];
        var query = yield medicRef.where('active', '==', true).get()
            .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                p.push(doc.data());
            });
        })
            .catch(err => {
            console.log('Error getting documents', err);
        });
        return p;
    });
}
exports.getAllActivePreceptors = getAllActivePreceptors;
function logIt(message) {
    console.log(message);
}
exports.logIt = logIt;
let d = getAllActivePreceptors();
console.log(d);
//# sourceMappingURL=firebase.js.map