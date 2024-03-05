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

export function addNote(deck, model, front, back) {
    let response = ankiInvoke(
        'addNote', 6, {
            note: {
                deckName: deck,
                modelName: model,
                fields: {
                    Front: front,
                    Back: back
                },
                tag: 'quixotic'
            }
        })

    ankiCheckResponse(response);
    return response;
}