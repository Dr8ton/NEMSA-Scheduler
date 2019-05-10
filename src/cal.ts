
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');
import Bottleneck from "bottleneck";
import { AREAS } from "./AREAS";

const googleCredentials = require('../secrets/key.json');
//TODO: Document this function
export async function addEventToCalendar(event, calId: string) {
    let auth = authenticate();
    try {
        console.log(`Adding event: ${event.eventName} @ ${event.startTime}`)
        await calendar.events.insert({
            auth: auth,
            calendarId: calId,
            resource: {
                // TODO : Change name to Truck @ LOC w/ Preceptor Name
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

//TODO: Document this function
export async function clearCalendar(calId: string) {
    let auth = authenticate();

    const limiter = new Bottleneck({
        maxConcurrent: 10,
        minTime: 300
    });

    let listOfEvents = await calendar.events.list({
        auth: auth,
        calendarId: calId,
        maxResults: 9999
    })

    for (const i of listOfEvents.data.items) {
        var params = {
            auth: auth,
            calendarId: calId,
            eventId: i.id,
        };

        limiter.schedule(p => calendar.events.delete(p), params);
    }

}

//TODO: Document this function

export async function countEventsOnCalendar(calId: string): Promise<number> {

    let auth = authenticate();
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: calId,
            maxResults: 9999
        })
        console.log(e.data.items.length)
        return e.data.items.length;
    } catch (error) {
        console.log(`unable to count number of events created on calendar: ${error}`);
    }


}
//TODO: Document this function

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

try {
    clearCalendarTest("5u7af47v5pf8v165ae54r53h98@group.calendar.google.com");
} catch (error) {
    console.log(`broken: ${error}`);
}
