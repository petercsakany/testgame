(function() {
    const drawPile = document.getElementById('drawPile');
    const discardPile = document.getElementById('discardPile');
    const faceUpContainer = document.getElementById('faceUpContainer');
    const inHandContainer = document.getElementById('inHandContainer');
    const startGameButton = document.getElementById('startGameButton');
    const resetGameButton = document.getElementById('resetGameButton');

    const suits = ["C", "D", "H", "S"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    let deckArray = [];
    resetGameButton.disabled = true;

    function initializeDeck() {
        deckArray = [];
        for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
            for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
                deckArray.push({
                    rank: ranks[rankIndex],
                    suit: suits[suitIndex]
                });
            }
        }
        shuffle(deckArray);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let faceDownArray = [];
    let faceUpArray = [];
    let inHandArray = [];
    let discardedArray = [];
    let gameStarted = false;

    function getRandomCard() {
        const randomIndex = Math.floor(Math.random() * deckArray.length);
        return deckArray.splice(randomIndex, 1)[0];
    }

    function initialDeal() {
        faceDownArray = [];
        faceUpArray = [];
        inHandArray = [];
        discardedArray = [];
        for (let i = 0; i < 12; i++) {
            const card = getRandomCard();
            if (i < 4) {
                faceDownArray.push(card); // Deal 4 cards face-down
            } else {
                inHandArray.push(card); // Deal the remaining 8 cards to hand
                addCardToContainer(card, inHandContainer, true);
            }
        }
        sortHand();
        gameStarted = true;
        startGameButton.disabled = true;
        resetGameButton.disabled = false;
    }

    function dealCard() {
        if (!gameStarted) {
            alert('The game has not started yet!');
            return;
        }
        if (discardedArray.length < 1) {
            alert('You need to discard a card first!');
            return;
        }

        if (deckArray.length === 0) {
            alert('No more cards in the deck!');
            return;
        }

        const card = getRandomCard();
        inHandArray.push(card);
        addCardToContainer(card, inHandContainer, true);
        sortHand();
    }

    function addCardToContainer(card, container, isInHand) {
        const newCard = document.createElement('img');
        newCard.className = 'card';
        newCard.src = `${card.rank}${card.suit}.svg`;
        newCard.alt = `${card.rank} of ${card.suit}`;
        if (isInHand) {
            newCard.addEventListener('click', () => discardCard(card, newCard));
        }
        container.appendChild(newCard);
    }

    function discardCard(card, cardElement) {
        if (inHandArray.includes(card)) {
            if (faceUpArray.length < 4) {
                faceUpArray.push(card);
                inHandArray = inHandArray.filter(c => c !== card);
                faceUpContainer.appendChild(cardElement);
                cardElement.removeEventListener('click', () => discardCard(card, cardElement));
            } else {
                inHandArray = inHandArray.filter(c => c !== card);
                discardedArray.push(card);
                cardElement.classList.add('discard-animation');
                cardElement.addEventListener('animationend', () => {
                    discardPile.innerHTML = ''; // Clear the discard pile
                    const discardCard = document.createElement('img');
                    discardCard.className = 'card';
                    discardCard.src = `${card.rank}${card.suit}.svg`;
                    discardCard.alt = `${card.rank} of ${card.suit}`;
                    discardPile.appendChild(discardCard);
                    cardElement.remove(); // Remove card from container
                });
            }
        }
    }

    function sortHand() {
        inHandArray.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
        inHandContainer.innerHTML = ''; // Clear current hand display
        inHandArray.forEach(card => addCardToContainer(card, inHandContainer, true));
    }

    function resetGame() {
        // Empty the hand and discard pile
        faceUpContainer.innerHTML = '';
        inHandContainer.innerHTML = '';
        discardPile.innerHTML = '';
        
        // Reset the drawing pile by shuffling the cards
        initializeDeck();
        
        // Reset face-down, face-up, in-hand, and discarded arrays
        faceDownArray = [];
        faceUpArray = [];
        inHandArray = [];
        discardedArray = [];
        
        // Reset initial deck image
        const initialDeckCard = document.createElement('img');
        initialDeckCard.className = 'pile';
        initialDeckCard.src = '2B.svg'; // Path to the back of the card SVG
        drawPile.innerHTML = ''; // Clear existing draw pile
        drawPile.appendChild(initialDeckCard);
        
        // Reset initial discard pile image
        const initialDiscardCard = document.createElement('img');
        initialDiscardCard.className = 'pile';
        initialDiscardCard.src = '1B.svg'; // Path to the empty discard pile SVG
        discardPile.appendChild(initialDiscardCard);

        // Reset game started status
        gameStarted = false;
        startGameButton.disabled = false; // Reactivate the start game button
    }

    startGameButton.addEventListener('click', initialDeal);
    resetGameButton.addEventListener('click', resetGame);

    drawPile.addEventListener('click', dealCard);

    // Initial setup for the deck
    initializeDeck();
    const initialDeckCard = document.createElement('img');
    initialDeckCard.className = 'pile';
    initialDeckCard.src = '2B.svg'; // Path to the back of the card SVG
    drawPile.appendChild(initialDeckCard);

    // Initial setup for the discard pile
    const initialDiscardCard = document.createElement('img');
    initialDiscardCard.className = 'pile';
    initialDiscardCard.src = '1B.svg'; // Path to the empty discard pile SVG
    discardPile.appendChild(initialDiscardCard);
})(this);
