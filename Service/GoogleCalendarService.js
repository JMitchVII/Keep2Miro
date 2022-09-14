/**
 * GoogleCalendarUtils.js
 * PURPOSE: Enscapulate the funtionality required to talk to the google Calendar API for making / retrieving events
 * TODO: 
 * 1) Enscapulate this as a class that will last the lifetime of the application to provide Calendar services.
 * 
 * @type {{isAbsolute?: function(string): boolean, posix?: *, sep?: string, basename?: function(string, string=): string, resolve?: function(...[Array<string>]): string, join?: function(...[Array<string>]): string, extname?: function(string): string, win32?: *, parse?: function(string): {root: string, dir: string, base: string, ext: string, name: string}, delimiter?: string, dirname?: function(string): string, normalize?: function(string): string, relative?: function(string, string): string, format?: function({root?: string, dir?: string, base?: string, ext?: string, name?: string}): string}}
 */ 



// ----- GOOGLE CALENDAR AUTH REQUIREMENTS
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const fs = require('fs');

// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/calendar.events']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = /*path.join(process.cwd(), 'token.json');*/ 'D:\\Cherry\\Keep2Miro\\Service\\token.json';
const CREDENTIALS_PATH = /*path.join(process.cwd(), 'credentials.json');*/ 'D:\\Cherry\\Keep2Miro\\Service\\credentials.json';

// Template google quickstart fuction for retrieving credentials
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

// Template google quickstart function to serialize Calendar Auth token
async function saveCredentials(client) {
    const content = await fs.promises.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.promises.writeFile(TOKEN_PATH, payload);
}

// Template google function for Authorization
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

// Example google function for listing events
async function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
    });
}

module.exports = {authorize, saveCredentials, loadSavedCredentialsIfExist,listEvents}

