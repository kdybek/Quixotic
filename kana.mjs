function parseKana(text) {
    let textWithoutAnnotations = text.replace(/\[[^\]]*\]/g, ''); // Doesn't work with nested []
    return textWithoutAnnotations.split(';');
}

function findWritings(html) {
    const textarea = html.getElementById('kanj');

    if (!textarea) {
        console.log('No writings were found');
        return [];
    }

    let text = textarea.value;
    return parseKana(text);
}

function findReadings(html) {
    const textarea = html.getElementsByName('rdng')[0];

    if (!textarea) {
        console.log('No readings were found');
        return [];
    }

    let text = textarea.value;
    return parseKana(text);
}

async function getJMdictHTML(link) {
    let response = await fetch(link.href);

    return response.text();
}

export function extractFromJMdict(link) {
    const html = getJMdictHTML(link);
    console.log(html);

    return [findWritings(html), findReadings(html)];
}