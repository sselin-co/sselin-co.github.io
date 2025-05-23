const fullText = 'https://sselin.co';
const target = document.getElementById('typed');
const greyUntil = 8; // Length of 'https://'
let index = 0;

function typeChar() {
    if (index <= fullText.length) {
        const before = fullText.slice(0, index);
        const greyPart = `<span class="grey">${before.slice(0, greyUntil)}</span>`;
        const restPart = before.slice(greyUntil);
        target.innerHTML = greyPart + restPart;
        index++;
        setTimeout(typeChar, 100);
    }
}

typeChar();