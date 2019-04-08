
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');
import { delay } from "./app";

const googleCredentials = require('../secrets/key.json');

export async function addEventToCalendar(event) {
    let auth = authenticate();
    try {
        await calendar.events.insert({
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
        })

    } catch (error) {
        console.log('unable to add event to calendar: ', error);
    }
}


export async function clearCalendar() {

    let auth = authenticate();
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com'
        })
        e.data.items.forEach(async element => {
            await deleteEvent(auth, element.id);
            delay(500);
        });
    } catch (error) {
        console.log(`unable to clear calendar: ${error}`);
    }

}


async function deleteEvent(auth, eventId: string) {

    var params = {
        auth: auth,
        calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com',
        eventId: eventId,
    };

    await calendar.events.delete(params, function (err) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log('Event deleted.');
    });
}

export async function countEventsOnCalendar(): Promise<number> {

    let auth = authenticate();
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com'
        })
        return e.data.items.length;
    } catch (error) {
        console.log(`unable to count number of events created on calendar: ${error}`);
    }


}

function authenticate() {
    const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[0]
    );

    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });
    return oAuth2Client;
}