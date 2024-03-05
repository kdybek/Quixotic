function findJMdictLink(result) {
    const links = result.querySelectorAll('a');
    return Array.from(links).filter(link => link.textContent.includes('Edit in JMdict'))[0].href;
}

// Find all results on page
const primaryDiv = document.getElementById('primary');
const results = primaryDiv.querySelectorAll('div.concept_light.clearfix');
console.log(results);

// Add flashcard buttons
for (let result of results) {
    const button = document.createElement("button");
    button.textContent = "Make a flashcard";

    button.addEventListener('click', function() {
        console.log(findJMdictLink(result));
        chrome.runtime.sendMessage({
            action: 'addNote',
            JMdictLink: findJMdictLink(result)
        });
    });

    result.querySelector('div.concept_light-representation').appendChild(button);
}