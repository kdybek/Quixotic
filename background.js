async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

async function ankiInvoke(action, version, params) {
    return await postData('http://localhost:8765', {
        action: action,
        version: version,
        params: params,
    });
}

function ankiCheckResponse(response) {
    if (Object.getOwnPropertyNames(response).length !== 2) {
        throw new Error('response has an unexpected number of fields');
    }
    if (!response.hasOwnProperty('error')) {
        throw new Error('response is missing required error field');
    }
    if (!response.hasOwnProperty('result')) {
        throw new Error('response is missing required result field');
    }
    if (response.error) {
        throw new Error(response.error);
    }
}

function ankiAddNote(deck, model, front, back) {
    return ankiInvoke('addNote', 6,
        { note: {
            deckName: deck,
            modelName: model,
            fields: {
                Front: front,
                Back: back
            },
            tag: 'quixotic'
        }
        })
}

function convert(kanji, furigana) {
    let str = '';

    for (let f of furigana) {
        str += f;
    }

    return str;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'addNote') {
        console.log('making a flashcard');

        const kanji = message.args.kanji;
        const furigana = message.args.furigana;

        ankiAddNote('test', 'Basic', kanji, convert(kanji, furigana))
            .then(response => {
                ankiCheckResponse(response);
                console.log(response);
            })
            .catch(error => console.error('An error occurred:', error));
    }
});