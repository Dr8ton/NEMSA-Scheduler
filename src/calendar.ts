let google = require('googleapis')
let keys = require("../secrets/calkey.json");
const { JWT } = require('google-auth-library');

function authenticate() {
    // configure a JWT auth client
    let jwtClient = new JWT(
        keys.client_email,
        null,
        keys.private_key,
        ['https://www.googleapis.com/auth/calendar']);
    //authenticate request
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Successfully connected!");
        }
    });
}
async function test() {
    //Google Calendar API
    let calendar = google.calendar('v3');
    let events = await calendar.events.list({ calendarId: 'primary' });
    console.log(events);
}
authenticate();
test();
/*
calendar.events.list({
   auth: jwtClient,
   calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com'
}, function (err, response) {
   if (err) {
       console.log('The API returned an error: ' + err);
       return;
   }
   var events = response.items;
   if (events.length == 0) {
       console.log('No events found.');
   } else {
       console.log('Event from Google Calendar:');
       for (let event of response.items) {
           console.log('Event name: %s, Creator name: %s, Create date: %s', event.summary, event.creator.displayName, event.start.date);
       }
   }
});
*/