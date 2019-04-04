/*
 * A Firebase Cloud Function that uses Google OAuth2 to 
 * manage a Google user's calendar.
 * 
 * @Author: Scott McCartney
 * @Twitter: @skittlesMc9
 * @Github: https://github.com/scott-mccartney/google-calendar-cloud-function
 */
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2; 
const calendar = google.calendar('v3');

const googleCredentials = require('../secrets/key.json');

const ERROR_RESPONSE = {
    status: "500",
    message: "There was an error adding an event to your Google calendar"
};


function addEvent(event, auth) {
    return new Promise(function(resolve, reject) {
        calendar.events.insert({
            auth: auth,
            calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com',
            resource: {
                'summary': event.eventName,
                'description': event.description,
                'start': {
                    'dateTime': event.startTime,

                },
                'end': {
                    'dateTime': event.endTime,

                },
            },
        }, (err, res) => {
            if (err) {
                console.log('Rejecting because of error');
                reject(err);
            }
            console.log('Request successful');
            resolve(res.data);
        });
    });
}

export function addEventToCalendar(event:object){
    // let eventData = {
    //     "eventName": "Test Event",
    //     "description": "This is a sample description",
    //     "startTime": "2019-04-14T21:59:59.999Z",
    //     "endTime": "2019-04-15T09:59:59.999Z"
    //   }

    // const eventData = {
    //     eventName: request.body.eventName,
    //     description: request.body.description,
    //     startTime: request.body.startTime,
    //     endTime: request.body.endTime
    // };
    const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[0]
    );

    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });

    addEvent(event, oAuth2Client);
};

