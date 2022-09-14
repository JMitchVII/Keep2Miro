const service = require('../../../Service/GoogleCalendarService')
// Run sample Authorization
service.authorize().then(service.listEvents).catch(console.error);