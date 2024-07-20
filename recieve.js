//Twilio Function

exports.handler = (context, event, callback) => {

  // Create a new messaging response object
  const twiml = new Twilio.twiml.MessagingResponse();

  const ical = require('ical');
  const fs = require('fs');
  const moment = require('moment-timezone');
  const title = 'See your next block in Shad2024 Waterloo :)';
  finalRes = "Default Response, please contact Richard. X.";

  maintenance = false;

  if(maintenance){
    twiml.message("under maintenance, please checkback");
    return callback(null, twiml);
  }

  console.log("check1");

  const openFile = Runtime.getAssets()['/calendarShad.ics'].open;

  const file = openFile();
    // Parse the ICS file
    const events = ical.parseICS(file);
    const now = new Date();

    // Filter events to get only those in the future
    const futureEvents = Object.values(events).filter(event => {
      return event.start && event.start > now;
    });

    // Sort future events by start date
    futureEvents.sort((a, b) => a.start - b.start);
  console.log("check3");

    // Get the next event
    const nextEvent = futureEvents[0];

    if (nextEvent) {
      const start = moment(nextEvent.start).tz('America/Toronto');
      const end = moment(nextEvent.end).tz('America/Toronto');
  console.log("check4");
    
    finalRes = `Next Event: ${nextEvent.summary || 'No Title'} Start: ${start.format('h:mmA')} to ${end.format('h:mmA')}`;
    console.log(finalRes);
    } else {
      console.log('No upcoming events found.');
      finalRes = 'No upcoming events found.';
    }
  console.log("check5");

  
  // Use any of the Node.js SDK methods, such as `message`, to compose a response
  twiml.message(finalRes);

  
  // Return the TwiML as the second argument to `callback`
  // This will render the response as XML in reply to the webhook request
  return callback(null, twiml);
};
