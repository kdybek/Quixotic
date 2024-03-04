async function addAFlashcard(deck, front, back) {
    const response = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'addNote',
            params: {
                note: {
                    deckName: deck,
                    modelName: 'Basic',
                    fields: {
                        Front: front,
                        Back: back,
                    },
                    options: {
                        allowDuplicate: false,
                    },
                },
            },
        }),
    })

    return await response.json();
}

function convert(kanji, furigana) {
    var str = '';

    for (let f of furigana) {
        str += f;
    }

    return str;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'makeAFlashcard') {
        console.log('making a flashcard');

        const kanji = message.args.kanji;
        const furigana = message.args.furigana;

        addAFlashcard('test', kanji, convert(kanji, furigana))
            .then(data => console.log(data))
            .catch(error => console.error('An error occurred:', error));
    }
});