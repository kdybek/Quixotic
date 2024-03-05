function enterJMDict() {

}

//---------------------------------------------------------
//-------------------------Main----------------------------
//---------------------------------------------------------

// Find all results on page
const elements = document.querySelectorAll('div.concept_light clearfix');

// Add flashcard buttons
for (let element of elements) {
    const button = document.createElement("button");
    button.textContent = "Make a flashcard";

    button.addEventListener('click', function() {
        const kanji = element.querySelector('.text').textContent;
        console.log(kanji);

        const furigana_raw = element.querySelectorAll('[class$="-up kanji"]');
        const furigana = Array.from(furigana_raw).map(function(f) {
            return f.textContent;
        });
        console.log(furigana);

        chrome.runtime.sendMessage({ action: 'addNote', args: { kanji, furigana } });
    });

    element.appendChild(button);
}