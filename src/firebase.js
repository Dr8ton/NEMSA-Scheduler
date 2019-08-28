"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// DOCs - https://firebase.google.com/docs/reference/js/?authuser=0
var firebase = require("firebase");
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
 * gets all {EMT} preceptors that are Active .
 *
 * @param {string} region -  The region that to request EMT Preceptors.This should be the same as the DB https://console.firebase.google.com/
 *
 * @returns {object} preceptor -    '000000': { active: true, firstName: 'jonn', lastName: 'smith' },
 */
function getAllActiveEMTPreceptors(region) {
    return __awaiter(this, void 0, void 0, function () {
        var emtRef, activeEmts, preceptors, _i, _a, emt;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.collection(region).doc('preceptors').collection('emts')];
                case 1:
                    emtRef = _b.sent();
                    return [4 /*yield*/, emtRef.where('active', '==', true).get()];
                case 2:
                    activeEmts = _b.sent();
                    preceptors = {};
                    for (_i = 0, _a = activeEmts.docs; _i < _a.length; _i++) {
                        emt = _a[_i];
                        preceptors[emt.id] = emt.data();
                    }
                    return [2 /*return*/, preceptors];
            }
        });
    });
}
exports.getAllActiveEMTPreceptors = getAllActiveEMTPreceptors;
/**
 * gets all {Paramedic} preceptors that are Active .
 *
 * @param {string} region -  The region that to request Paramedic Preceptors.This should be the same as the DB https://console.firebase.google.com/
 *
 * @returns {object} preceptor -    '000000': { active: true, firstName: 'jonn', lastName: 'smith' },
 */
function getAllActiveParamedicPreceptors(region) {
    return __awaiter(this, void 0, void 0, function () {
        var emtRef, activeEmts, preceptors, _i, _a, emt;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.collection(region).doc('preceptors').collection('paramedics')];
                case 1:
                    emtRef = _b.sent();
                    return [4 /*yield*/, emtRef.where('active', '==', true).get()];
                case 2:
                    activeEmts = _b.sent();
                    preceptors = {};
                    for (_i = 0, _a = activeEmts.docs; _i < _a.length; _i++) {
                        emt = _a[_i];
                        preceptors[emt.id] = emt.data();
                    }
                    return [2 /*return*/, preceptors];
            }
        });
    });
}
exports.getAllActiveParamedicPreceptors = getAllActiveParamedicPreceptors;
