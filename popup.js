document.addEventListener('DOMContentLoaded', function () {
    var jishoButton = document.getElementById('jishoButton');
    jishoButton.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "clickButton"});
        });
    });
});