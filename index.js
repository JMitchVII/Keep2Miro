/**
 * INDEX.JS
 * 
 * purpose, provide file server definitions
 */

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const extractGreenNotesAndChildren = require('./Parser/ParseForGreen')
const axios = require('axios').default;
// cache of the keep application state, this thing is 20MB so we don't want to fetch it every time.
var cache = undefined

// Declare root route
fastify.get('/', async (request, reply) => {
    if(cache === undefined) {
        try {
            const response = await axios.get('http://127.0.0.1:5000/All');
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

// Run the server!
const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()