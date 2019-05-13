import Bottleneck from "bottleneck";

const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');

const googleCredentials = require('../secrets/key.json');

const limiter1 = new Bottleneck({
    maxConcurrent: 10,
    minTime: 500
});


export async function clearCalendars(calendarIds) {
    let auth = authenticate();
    let calendars:string[] = Object.values(calendarIds); 
    for (const calendarId of calendars) {
        let listOfEvents:object[] = await getListOfEvents(calendarId); 
        for (const event of listOfEvents) {
            var params = {
                auth: auth,
                calendarId: calendarId,
                eventId: event.id,
            };
            removeShiftFromCalendar(params); 
        }
    }
}

export async function getListOfEvents(calendarId: string): Promise<[]> {
    let auth = authenticate();

    let listOfEvents = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        maxResults: 9999
    })

    return listOfEvents.data.items;
}

function removeShiftFromCalendar(data){
    try {
      //  console.log(`Bottlneck delete shift`)
        limiter1.schedule(p => calendar.events.delete(p), data);

    } catch (error) {
       // console.log(`Unable to delete event: ${error}`)
    }
}


export function addShiftToCalendar(data, calendarId: string) {
 //   console.log(`adding shift to Bootleneck: ${data}`)
    limiter1.schedule(() => { return addEventToCalendar(data, calendarId) }, data, calendarId);
}

//TODO: Document this function
function addEventToCalendar(event, calId: string) {
    let auth = authenticate();
    try {
      //  console.log(`Adding event: ${event.eventName} @ ${event.startTime}`)
        return calendar.events.insert({
            auth: auth,
            calendarId: calId,
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


//TODO: Document this function
export async function countEventsOnCalendar(calId: string): Promise<number> {

    let auth = authenticate();
    try {
        let e = await calendar.events.list({
            auth: auth,
            calendarId: calId,
            maxResults: 9999
        })
   //     console.log(e.data.items.length)
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

