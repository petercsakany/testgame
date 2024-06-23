const deck = document.getElementById('deck');
const handContainer = document.getElementById('handContainer');
const counterDisplay = document.getElementById('counter');

const suits = ["C", "D", "H", "S"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
let deckArray = [];

for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
    for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
        deckArray.push({
            rank: ranks[rankIndex],
            suit: suits[suitIndex]
        });
    }
}

let handArray = [];
let score = 0;

function getRandomCard() {
    const randomIndex = Math.floor(Math.random() * deckArray.length);
    return deckArray.splice(randomIndex, 1)[0];
}

function dealCard() {
    if (deckArray.length === 0) {
        alert('No more cards in the deck!');
        return;
    }

    const card = getRandomCard();
    const newCard = document.createElement('img');
    newCard.className = 'card';
    newCard.src = `${card.rank}${card.suit}.svg`; // Adjust the path accordingly
    newCard.alt = `${card.rank} of ${card.suit}`;
    handContainer.appendChild(newCard);
    sortHand();
    counterDisplay.textContent = `Cards Dealt: ${++score}`;
}

function sortHand() {
    const cards = Array.from(handContainer.children);
    cards.sort((a, b) => {
        const aValue = ranks.indexOf(a.alt.split(' ')[0]);
        const bValue = ranks.indexOf(b.alt.split(' ')[0]);
        return aValue - bValue;
    });
    cards.forEach(card => handContainer.appendChild(card));
}

deck.addEventListener('click', dealCard);

// Initial setup for the deck
const initialDeckCard = document.createElement('img');
initialDeckCard.className = 'card';
initialDeckCard.src = '2B.svg'; // Path to the back of the card SVG
deck.appendChild(initialDeckCard);
