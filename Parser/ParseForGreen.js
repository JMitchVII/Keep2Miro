/**
 * Purpose: Extract green notes and their children from a JSON dump
 * of the entire Keep state.
 */

module.exports = function extractGreenNotesAndChildren(allNotes) {
    let greenNotes = allNotes['nodes'].filter(n => n.color === "GREEN")
    //------------- COLLECT THE CHILDREN!
    //---- FETCH THEIR IDs
    let greenNoteIds = greenNotes.map(gn => gn['id'])
    //---- POPULATE THE NOTES WITH THEIR CHILDREN
    let childNodes = allNotes['nodes'].filter(n => n['parentId'] != undefined && n['parentId'] !== 'root')
    greenNoteIds.forEach(gnid => {
        //TODO: careful of type coersion here
        let children = childNodes.filter(ch => ch.parentId == gnid)
        greenNotes.filter(gn => gn['id'] == gnid)[0]['childNodes'] = children
    })
    return greenNotes
}

