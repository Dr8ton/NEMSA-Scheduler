
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');

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
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: calId,
            maxResults: 9999
        })

        for await (const i of e.data.items) {
            try {
                console.log(`trying to delete: ${i.summary} on ${i.start.dateTime}`);


                var params = {
                    auth: auth,
                    calendarId: calId,
                    eventId: i.id,
                };
                await calendar.events.delete(params);

            } catch (error) {
                console.log(`unable to delete: ${i.summary} on ${i.start.dateTime}: ${error}`);

            }

        }

    } catch (error) {
        console.log(`unable to clear calendar: ${error}`);
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

