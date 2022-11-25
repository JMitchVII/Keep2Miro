/**
 * INDEX.JS
 *
 * PURPOSE: Webserver endpoint defininition.
 *
 * TODO:
 * 1) Make app push keep notes to the Miro board!
 * 1.1) As per: https://developers.miro.com/docs/working-with-sticky-notes-and-tags-with-the-rest-api
 * 1.2) Make the app associate keep notes with a sticky note ID in MIRO
 * 1.3) Make the app store this association somewhere
 * 2) Add a refresh endpoint
 *
 * REVISIONS:
 * 9/12/2022 - Adding Infrastructure for Google Calendar events
 *
 */


// Require the framework and instantiate it
// ----- JSON AND FRAMEWORK REQUIREMENTS
const fs = require('fs');
const fastify = require('fastify')({logger: true})
const extractGreenNotesAndChildren = require('./Parser/ParseForGreen')
const axios = require('axios').default;

//TODO: this should not be a const.
const boardId = 'uXjVOwEgz_A='

const miroService = require('./Service/MiroService')

// cache of the keep application state, this thing is 20MB so we don't want to fetch it every time.
var cache = undefined

// Address off the KeepRest server
const keepRestUrl = 'http://127.0.0.1:5000/All'

// Access token for modifying miro board
var accessToken = undefined

const stickyNoteTemplate = `{
    "data": {
        "content": "CHANGE THIS",
        "shape": "square"
    },
    "style": {
        "fillColor": "green"
    },
    "position": {
        "origin": "center",
        "x": 0,
        "y": 0
    }
}`


/**
 * Route: ROOT
 * Purpose: Health check endpoint, returns a JSON array of all green keep notes.
 */
fastify.get('/', async (request, reply) => {
    if (cache === undefined) {
        try {
            const response = await axios.get(keepRestUrl);
            console.log(response);
            cache = response.data
            return extractGreenNotesAndChildren(response.data)
        } catch (error) {
            console.error(error);
            return error
        }
    } else {
        return extractGreenNotesAndChildren(cache)
    }
})




/** ROUTE NAME: Push
 *  PURPOSE: to upload all green keep notes as Miro sticky notes.
 */
fastify.get('/push', async (request, reply) => {
    // Get green notes from cache
    var greenNotes;
    if (cache === undefined) {
        try {
            const response = await axios.get(keepRestUrl);
            console.log(response);
            cache = response.data
        } catch (error) {
            console.error(error);
            return error
        }
    }
    greenNotes = extractGreenNotesAndChildren(cache)

    // Determine how many notes we're dealing with
    let numNotes = greenNotes.length
    // Parse Green notes into appropriate Sticky note structures
    var notesToCreate = [];
    var index = 0;
    greenNotes.forEach(gn => {
        notesToCreate[index] = JSON.parse(stickyNoteTemplate);
        if (gn.childNodes == undefined) { // if node has no children, can use it's own text.
            notesToCreate[index].data.content = `${gn.title.toUpperCase()}\n${gn.text}`;
        } else { // otherwise we have to harvest it.
            var contentString = "";
            gn.childNodes.forEach(cn => contentString += `- ${cn.text}\n`);
            notesToCreate[index].data.content = `${gn.title} \n ${contentString}`;
        }
        const spacingMultiplier = 200;
        notesToCreate[index].position.x = (index % 10) * spacingMultiplier;
        notesToCreate[index].position.y = (Math.floor(index / 10)) * spacingMultiplier;
        notesToCreate[index]['keepid'] = gn.id;
        index++;
    })

    // Loop though sticky note structure to make requests (apply a delay cause there are A LOT
    var responses = createStickyNotesFromList(notesToCreate);
    // Store corresponding note Ids
    fs.writeFile('responses.json', JSON.stringify(responses), err => console.log(err))
    // inform of progress
    console.info('pushes complete!');
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen({port: 3000})
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()