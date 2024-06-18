const cardWidth = 121;  // width of a single card in the sprite sheet
const cardHeight = 177;  // height of a single card in the sprite sheet
const card = document.getElementById('card');

function getRandomCardPosition() {
    const columns = 13;  // number of columns in the sprite sheet
    const rows = 4;  // number of rows in the sprite sheet (not including the last row with one card)

    const randomColumn = Math.floor(Math.random() * columns);
    const randomRow = Math.floor(Math.random() * rows);

    return {
        x: randomColumn * cardWidth,
        y: randomRow * cardHeight
    };
}

function dealCard() {
    const { x, y } = getRandomCardPosition();
    card.style.backgroundPosition = `-${x}px -${y}px`;
    card.classList.remove('show'); // Reset the opacity
    setTimeout(() => card.classList.add('show'), 10); // Add show class with a slight delay
}

// Initial call to show some cards
dealCard();

document.getElementById('dealButton').addEventListener('click', dealCard);
