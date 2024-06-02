class CalendarApi {

  async authenticate() {
    // Placeholder for pre-deploy (set-begin)
    const GoogleOauth = require('../authenticate/googleOauth');
    const googleOauth = new GoogleOauth()
    this.client = await googleOauth.authorize()
    const { google } = require('googleapis');
    this.calendar = google.calendar({version: 'v3', auth: this.client});
    // Placeholder for pre-deploy (set-end)
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  async getUpcomingEvents(firstDate, lastDate) {
    await this.authenticate()

    const request = {
      calendarId: 'primary',
      timeMin: firstDate,
      timeMax: lastDate,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    };
    const response = await this.calendar.events.list(request);

    const events = response.data.items;

    const eventsBlocks = []

    for (const event of events) {
      const eventBlock = {}

      eventBlock['summary'] = event.summary
      eventBlock['startDate'] = event.start.dateTime
      eventBlock['location'] = event.location
      eventBlock['description'] = event.description

      eventsBlocks.push(eventBlock)
    }
    return eventsBlocks
  }
}

module.exports = CalendarApi