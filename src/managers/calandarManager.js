const CalendarApi = require("../externals/calendarApi");

class CalendarManager {
  constructor(localDevSwitch = true) {
    this.local = localDevSwitch;
  }

  async getUpcomingEvents(firstDate = new Date(), timespan = 7) {

    const lastDate = new Date(new Date().setDate(firstDate.getDate() + timespan))

    if (this.local) {
      const calendarApi = new CalendarApi()
      const firstDateStr = firstDate.toISOString()
      const lastDateStr = lastDate.toISOString()
      return calendarApi.getUpcomingEvents(firstDateStr, lastDateStr)
    }

    const events = CalendarApp.getEvents(firstDate, lastDate)

    const eventsBlocks = []

    for (const event of events) {
      const eventBlock = {}

      eventBlock['summary'] = event.getSummary()
      eventBlock['startDate'] = event.getStartTime()
      eventBlock['location'] = event.getLocation()
      eventBlock['description'] = event.getDescription()

      eventsBlocks.push(eventBlock)
    }
    return eventsBlocks
  }
}

module.exports = CalendarManager;