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

function parseJapanese(text) {
    let textWithoutAnnotations = text.replace(/\[[^\]]*\]/g, ''); // Doesn't work with nested []
    return textWithoutAnnotations.split(';');
}

function extractFromTextareaByName(html, name) {
    // That's pretty ugly, but converting a string to a document in this environment
    // would require too much effort and be an overkill
    const regex = new RegExp(`<textarea[^>]*name="${name}"[^>]*>([\\s\\S]*?)</textarea>`);
    const match = regex.exec(html);

    if (!match) {
        console.log(`No content was found in the textarea named ${name}`);
        return '';
    }

    return match[1];
}

async function getJMdictHTML(link) {
    let response = await fetch(link);

    return response.text();
}

class Anki { // Intended to be a singleton
    constructor(deck, model) {
        this.deck = deck;
        this.model = model;
    }

    async invoke(action, version, params) {
        return await postData('http://localhost:8765', {
            action: action,
            version: version,
            params: params,
        });
    }

    checkResponse(response) {
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

    addNote(front, back) {
        this.invoke(
            'addNote', 6, {
                note: {
                    deckName: this.deck,
                    modelName: this.model,
                    fields: {
                        Front: front,
                        Back: back
                    },
                    tag: 'quixotic'
                }
            })
            .then(response => {
                console.log(response);
                this.checkResponse(response);
            });
    }
}

const g_anki = new Anki('test', 'Basic');

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'addNote') {
        console.log('making a flashcard');

        getJMdictHTML(message.JMdictLink)
            .then(html =>
                g_anki.addNote(parseJapanese(extractFromTextareaByName(html, 'kanj'))[0],
                    parseJapanese(extractFromTextareaByName(html, 'rdng'))[0]))
            .catch(error => console.error(error));
    }
});
