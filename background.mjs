import * as anki from './anki.mjs';
import * as kana from './kana.mjs';

/*chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'addNote') {
        console.log('making a flashcard');

            let [writing, reading] = kana.extractFromJMdict(message.JMdictLink)
                .catch(error => console.error(error));

            anki.addNote('test', 'Basic', writing[0], reading[0])
                .then(response => console.log(response))
                .catch(error => console.error(error));
    }
});*/

let [writing, reading] = kana.extractFromJMdict('https://www.edrdg.org/jmwsgi/edform.py?svc=jmdict&sid=&q=1360820&a=2')
    .catch(error => console.error(error));

anki.addNote('test', 'Basic', writing[0], reading[0])
    .then(response => console.log(response))
    .catch(error => console.error(error));