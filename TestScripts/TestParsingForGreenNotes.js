/**
 * Purpose: Take the sample dump of keep notes and filter it down to only the green ones
 * 
 */
const fs = require('fs');
const extractGreenNotesAndChildren = require('../Parser/ParseForGreen')
//------------- READ THE FILE, ALL OF IT!
const allFileContents = fs.readFileSync('./Resources/greenNotes.json', 'utf-8');
//------------- PARSE THE FILE!
const allNotes = JSON.parse(allFileContents)


//------------- FILTER TO GREEN NOTES!
extractGreenNotesAndChildren(allNotes);

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);