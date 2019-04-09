
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');

const googleCredentials = require('../secrets/key.json');

export async function addEventToCalendar(event) {
    let auth = authenticate();
    try {
        console.log(`Adding event: ${event.eventName} @ ${event.startTime}`)
        await calendar.events.insert({
            auth: auth,
            calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com',
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


export async function clearCalendar() {

    let auth = authenticate();
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com',
            maxResults: 9999
        })
        console.log(e);
        console.log("list of events: " + e.data.items.length);

        for await (const i of e.data.items) {
            try {
                console.log(`trying to delete: ${i.summary} on ${i.start.dateTime}`);


                var params = {
                    auth: auth,
                    calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com',
                    eventId: i.id,
                };
                await calendar.events.delete(params);

            } catch (error) {
                console.log(`unable to delete: ${i.id}: ${error}`);

            }

        }

    } catch (error) {
        console.log(`unable to clear calendar: ${error}`);
    }

}


export async function countEventsOnCalendar(): Promise<number> {

    let auth = authenticate();
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: 'jk6907osaor1ku6gnh3uput0gc@group.calendar.google.com',
            maxResults: 9999
        })
        console.log(e.data.items.length)
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

