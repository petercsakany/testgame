const cardWidth = 225;  // width of a single card in the sprite sheet
const cardHeight = 315;  // height of a single card in the sprite sheet
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
  card.style.backgroundImage = 'url("card_back.svg")'; // Set back image initially
  card.classList.remove('show'); // Reset the opacity

  setTimeout(() => {
    card.style.backgroundPosition = `-${x}px -${y}px`; // Set specific card position
    card.style.backgroundImage = 'url("cards2.png")'; // Switch to front image
    card.classList.add('show'); // Add show class with a slight delay
  }, 10);
}

// Initial call to show some cards
dealCard();

document.getElementById('dealButton').addEventListener('click', dealCard);

