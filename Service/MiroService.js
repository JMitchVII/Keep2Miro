const sdk = require('api')('@miro-ea/v2.0#33ql1cuxl6zk4s7y');

function createStickyNotesFromList(notesToCreate) {
    var responses = [];
    sdk.auth('eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_IismcDr_6azwvpLR82FaJKwM0SQ');
    notesToCreate.forEach(ntc => {
        sdk.createStickyNoteItem({
            data: {...ntc.data},
            position: {...ntc.position},
            style: {...ntc.style},
        }, {board_id: boardId})
            .then(res => responses.push[{response: res, id: ntc.id}])
            .catch(err => console.error(err));
    })
    return responses;
}

module.exports = {createStickyNotesFromList}