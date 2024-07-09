(function () {
    // DOM Elements
    const drawPile = document.getElementById('drawPile');
    const discardPile = document.getElementById('discardPile');
    const faceUpContainer = document.getElementById('faceUpContainer');
    const inHandContainer = document.getElementById('inHandContainer');
    const aiFaceUpContainer = document.getElementById('aiFaceUpContainer');
    const startGameButton = document.getElementById('startGameButton');
    const resetGameButton = document.getElementById('resetGameButton');
    const initialDeckCard = document.createElement('img');
    const initialDiscardCard = document.createElement('img');
    let turnText = document.getElementById('turnText');

    // Event Listeners
    startGameButton.addEventListener('click', initialDeal);
    resetGameButton.addEventListener('click', resetGame);
    //drawPile.addEventListener('click', dealCard);

    // Game Constants
    const suits = ["C", "D", "H", "S"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    resetGameButton.disabled = true;
    let gameStarted = false;
    let currentTurn = ''; // 'player' or 'ai'
    let firstTurn = true;

    // Game State Arrays
    let deckArray = [];
    let discardedArray = [];
    let faceDownArray = [];
    let faceUpArray = [];
    let inHandArray = [];
    let aiFaceDownArray = [];
    let aiFaceUpArray = [];
    let aiInHandArray = [];

    resetGame();

    // Initialize the deck
    function initializeDeck() {
        console.log('initialize deck');
        deckArray = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                deckArray.push({ rank, suit });
            });
        });
        shuffle(deckArray);
    }

    // Initial deal of cards
    function initialDeal() {
        console.log('initial deal');
        faceDownArray = [];
        faceDownArray = [];
        inHandArray = [];
        aiFaceDownArray = [];
        aiFaceUpArray = [];
        aiInHandArray = [];

        for (let i = 0; i < 24; i++) {
            const card = getRandomCard();
            if (i < 4) {
                faceDownArray.push(card); // Deal 4 cards face-down to the player
            } else if (i < 12) {
                inHandArray.push(card); // Deal 8 cards to the player's hand
                addCardToContainer(card, inHandContainer, true);
            } else if (i < 16) {
                aiFaceDownArray.push(card); // Deal 4 cards face-down to AI
            } else {
                aiInHandArray.push(card); // Deal 8 cards to AI's hand
            }
        }
        // Sort AI's face-up cards to pick the 4 highest ranked ones
        aiInHandArray.sort((a, b) => ranks.indexOf(b.rank) - ranks.indexOf(a.rank));
        aiFaceUpArray = aiInHandArray.slice(0, 4);
        aiInHandArray = aiInHandArray.slice(4);

        // Display AI's face-up cards
        aiFaceUpContainer.innerHTML = '';
        aiFaceUpArray.forEach(card => addCardToContainer(card, aiFaceUpContainer, false));

        setTimeout(() => {
            sortHand();
        }, 1000);

        const startingPlayer = determineStartingPlayer();
        currentTurn = startingPlayer;
        console.log('current turn: ' + currentTurn);

        gameStarted = true;
        startGameButton.disabled = true;
        resetGameButton.disabled = false;
        nextTurn();
    }

    // Reset the game
    function resetGame() {
        console.log('reset');
        // Empty the hand and discard pile
        faceUpContainer.innerHTML = '';
        inHandContainer.innerHTML = '';
        aiFaceUpContainer.innerHTML = '';
        drawPile.innerHTML = '';
        discardPile.innerHTML = '';

        // Reset the drawing pile by shuffling the cards
        initializeDeck();

        // Reset face-down, face-up, in-hand, and discarded arrays
        discardedArray = [];
        faceDownArray = [];
        faceDownArray = [];
        inHandArray = [];
        aiFaceDownArray = [];
        aiFaceUpArray = [];
        aiInHandArray = [];

        // Reset initial deck image
        initialDeckCard.className = 'pile';
        initialDeckCard.src = '2B.svg';
        drawPile.appendChild(initialDeckCard);

        // Reset initial discard pile image
        initialDiscardCard.className = 'pile';
        initialDiscardCard.src = '1B.svg';
        discardPile.appendChild(initialDiscardCard);

        // Reset game started status
        gameStarted = false;
        startGameButton.disabled = false;
        firstTurn = true;
        turnText.innerHTML = '';
    }

    // Handling turns
    function nextTurn() {
        console.log('next turn');
        if (firstTurn) {
            firstTurn = false;
        }
        if (currentTurn === 'player') {
            turnText.innerHTML = 'Player turn';
        } else {
            turnText.innerHTML = 'AI turn';
            setTimeout(() => {
                aiTurn();
                currentTurn = 'player';
                nextTurn();
            }, 1500); // Simulate AI thinking time
        }
    }

    function aiTurn() {
        if (currentTurn === 'ai') {
            const lastDiscardedCard = discardedArray[discardedArray.length - 1];
            console.log('aihand: ' + JSON.stringify(aiInHandArray));
            // Find valid moves: same rank or next higher card
            let validMoves = aiInHandArray.filter(card => {
                return isValidMove(card);
            });
            console.log('valid moves: ' + JSON.stringify(validMoves));

            if (validMoves.length === 0) {
                alert('AI has to take the discard pile.');
                dealCard('ai', true);
                return;
            }

            // If there's no last discarded card, sort by rank
            if (!lastDiscardedCard) {
                validMoves.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
            } else {
                // Sort valid moves by the closest higher rank
                validMoves.sort((a, b) => {
                    return (ranks.indexOf(a.rank) - ranks.indexOf(lastDiscardedCard.rank)) - (ranks.indexOf(b.rank) - ranks.indexOf(lastDiscardedCard.rank));
                });
            }

            const selectedCard = validMoves[0]; // AI selects the closest higher valid card
            console.log('selected card: ' + JSON.stringify(selectedCard));
            const cardIndex = aiInHandArray.indexOf(selectedCard);
            aiInHandArray.splice(cardIndex, 1); // Remove the selected card from AI's hand
            discardedArray.push(selectedCard); // Add the card to the discard pile

            const cardElement = document.createElement('img');
            cardElement.className = 'card';
            cardElement.src = `${selectedCard.rank}${selectedCard.suit}.svg`;
            cardElement.alt = `${selectedCard.rank} of ${selectedCard.suit}`;
            discardPile.innerHTML = '';
            discardPile.appendChild(cardElement);
            if (aiInHandArray.length < 4) { dealCard('ai', false) };
        }
    }

    // Validate the player's move
    function isValidMove(card) {
        if (firstTurn) return true;
        if (discardedArray.length === 0) return true; // Any card can be played first
        const lastDiscardedCard = discardedArray[discardedArray.length - 1];
        if (card.rank === '2' || card.rank === '10') return true; // 2 and 10 can be played on any card
        let isValid = ranks.indexOf(card.rank) >= ranks.indexOf(lastDiscardedCard.rank);
        console.log('valid card: ' + JSON.stringify(card) + ' ' + isValid);
        return isValid;
    }

    // Deal a card to the player
    function dealCard(player, penalty) {
        console.log('deck: ' + deckArray.length);
        if (!gameStarted) {
            alert('The game has not started yet!');
            return;
        }
        if (discardedArray.length < 1) {
            return;
        }

        if (deckArray.length === 0) {
            alert('No more cards in the deck!');
            return;
        }
        if (!penalty) {
            const card = getRandomCard();
            if (player == 'player') {
                inHandArray.push(card);
                addCardToContainer(card, inHandContainer, true, true);
                setTimeout(() => {
                    sortHand();
                }, 1000);
            }
            if (player == 'ai') {
                aiInHandArray.push(card);
            }
        }
        else {
            discardedArray.forEach((penaltyCard) => {
                if (player == 'player') {
                    inHandArray.push(penaltyCard);
                    addCardToContainer(penaltyCard, inHandContainer, true, true);
                }
                else if (player == 'ai') {
                    aiInHandArray.push(penaltyCard);
                }
            });
            sortHand();
            discardedArray = [];
            discardPile.innerHTML = '';
        }
    }

    /** Discards a card.
     @param {Object} card - The card object.
     @param {HTMLElement} cardElement - The HTML element representing the card.
    */
    function discardCard(card, cardElement) {
        if (inHandArray.includes(card)) {
            if (faceUpArray.length < 4) {
                faceUpArray.push(card);
                inHandArray = inHandArray.filter(c => c !== card);
                faceUpContainer.appendChild(cardElement);
                cardElement.removeEventListener('click', () => discardCard(card, cardElement));
            } else {
                if (currentTurn !== 'player') return;
                let validMoves = inHandArray.filter(card => {
                    return isValidMove(card);
                });
                console.log('player moves: ' + JSON.stringify(validMoves));
                if (validMoves.length === 0) {
                    alert('You have to take the discard pile.');
                    dealCard('player', true);
                    return;
                }
                else {
                    if (isValidMove(card)) {
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
                        if (inHandArray.length < 4) { dealCard('player', false) };
                        currentTurn = 'ai';
                        nextTurn(); // Switch to AI's turn
                    } else {
                        alert('Invalid move! You must play a card of the same rank or higher.');
                    }
                }
            }
        }
    }

    // Shuffle the deck
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Add a card to a container
    function addCardToContainer(card, container, isInHand, animate = false) {
        const newCard = document.createElement('img');
        newCard.className = 'card';
        if (animate) {
            newCard.classList.add('fade-in'); // Add fade-in class only if animate is true
        }
        newCard.src = `${card.rank}${card.suit}.svg`;
        newCard.alt = `${card.rank} of ${card.suit}`;
        if (isInHand) {
            newCard.addEventListener('click', () => discardCard(card, newCard));
        }
        container.appendChild(newCard);

        // Remove the fade-in class after the animation ends
        if (animate) {
            newCard.addEventListener('animationend', () => {
                newCard.classList.remove('fade-in');
            });
        }
    }

    // Get a random card from the deck
    function getRandomCard() {
        const randomIndex = Math.floor(Math.random() * deckArray.length);
        return deckArray.splice(randomIndex, 1)[0];
    }

    // Sort the player's hand
    function sortHand() {
        inHandArray.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
        inHandContainer.innerHTML = ''; // Clear current hand display
        inHandArray.forEach(card => addCardToContainer(card, inHandContainer, true, false));
    }

    // Find the lowest valid starting card
    function findLowestValidStartingCard(hand) {
        // Exclude 2, 5, and 10
        const validRanks = ranks.filter(rank => !['2', '5', '10'].includes(rank));
        for (const rank of validRanks) {
            if (hand.some(card => card.rank === rank)) {
                return rank;
            }
        }
        return null; // No valid starting card found
    }

    // Determine the starting player
    function determineStartingPlayer() {
        // Check for a 3 in both hands
        const playerHasThree = inHandArray.some(card => card.rank === '3');
        const aiHasThree = aiInHandArray.some(card => card.rank === '3');

        if (playerHasThree && !aiHasThree) {
            return 'player';
        } else if (!playerHasThree && aiHasThree) {
            return 'ai';
        }

        // If both or neither have a 3, find the lowest valid starting card
        const playerLowestCard = findLowestValidStartingCard(inHandArray);
        const aiLowestCard = findLowestValidStartingCard(aiInHandArray);

        if (ranks.indexOf(playerLowestCard) < ranks.indexOf(aiLowestCard)) {
            return `player`;
        } else if (ranks.indexOf(playerLowestCard) > ranks.indexOf(aiLowestCard)) {
            return `ai`;
        }

        // If both have the same lowest card or no valid card, human player starts
        return `player`;
    }

})();