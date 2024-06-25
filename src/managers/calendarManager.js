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

      eventBlock['id'] = event.getId()
      eventBlock['summary'] = event.getSummary()
      eventBlock['startDate'] = event.getStartTime()
      eventBlock['location'] = event.getLocation()
      eventBlock['description'] = event.getDescription()

      eventsBlocks.push(eventBlock)
    }
    return eventsBlocks
  }

  notify(recipient, subject, body, options = {noReply: true}) {
    const emailOptions = options;
    emailOptions.noReply = true;

    const emailStr = `
    <!DOCTYPE html>
    <html>

    <head>
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
            }

            h2 {
                font-size: 24px;
                color: #333;
                margin-bottom: 10px;
                position: relative;
                z-index: 2;
            }

            p {
                font-size: 16px;
                color: #666;
                margin: 0;
                position: relative;
                z-index: 2;
            }

            .header {
                text-align: center;
                color: #80242b;
                border-top: 5px solid;
                border-bottom: 5px solid;
                margin-top: 5px;
                padding: 18px 5px;
            }

            .header_logo {
                width: 80px;
                height: 80px;
                background-size: cover;
                background-repeat: no-repeat;
                display: inline-block;
                vertical-align: middle;
            }

            .header_txt {
                font-size: 26px;
                font-family: sans-serif;
                font-weight: bold;
                color: #80242b;
                display: inline-block;
                vertical-align: middle;
                margin-left: 10px;
            }

            .proc-section-wrap {
                background-color: white;
                max-width: 640px;
                margin-left: auto;
                margin-right: auto;
                padding: 40px;
            }

            .footer {
                padding: 10px 5px;
                color: #80242b;
                font-size: 14px;
                text-align: center;
                border-top: 5px solid;
                border-bottom: 5px solid;
                margin-top: 10px;
            }

            .pFooter {
                font-size: 16px;
                color: #80242b;
                margin: 0;
                position: relative;
                z-index: 2;
            }
        </style>
    </head>

    <body>
        <div class="header">
            <div class="header_logo"></div>
            <div class="header_txt">Luz dos Bichos</div>
        </div>

        <div class="proc-section-wrap">${body}</div>

        <div class="footer">
            <p class="pFooter"> Luz dos Bichos</p>
        </div>
    </body>

    </html>
        `;

    emailOptions.htmlBody = emailStr;
    MailApp.sendEmail(recipient, subject, emailStr, emailOptions);
  }

  async insertAttendees(atividades) {
    if (this.local) {
      return
    }
        
    const usrEmail = Session.getActiveUser().getEmail()
    const calendar = CalendarApp.getCalendarById(usrEmail)

    for (const atividade of atividades) {
      const event = calendar.getEventById(atividade['ID EVENTO']);  
      
      const emailsGuests = atividade['RESPONSÁVEL']
      if (!emailsGuests) continue
      event.addGuest(emailsGuests)

      const emailStr = `
        <h3> Atividade Disponibilizada </h3>
        
        <h4> Informações da atividade : </h4>

        <p> Atividade: ${atividade['ATIVIDADE']}</p>
        <p> Descrição: ${atividade['DESCRIÇÃO']}</p>
        <p> Local: ${atividade['LOCAL']}</p>
        <p> Data e hora: ${atividade['DATA']} ${atividade['HORA']}</p>

      `;

      this.notify(emailsGuests, atividade['ATIVIDADE'], emailStr)
    }
  }
}

module.exports = CalendarManager;