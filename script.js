const cardWidth = 72;  // width of a single card in the sprite sheet
const cardHeight = 96;  // height of a single card in the sprite sheet
const cardContainer = document.getElementById('cardContainer');

function getRandomCardPosition() {
    const columns = 13;  // number of columns in the sprite sheet
    const rows = 5;  // number of rows in the sprite sheet

    const randomColumn = Math.floor(Math.random() * columns);
    const randomRow = Math.floor(Math.random() * rows);

    return {
        x: randomColumn * cardWidth,
        y: randomRow * cardHeight
    };
}

function dealCards() {
    for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`card${i}`);
        const { x, y } = getRandomCardPosition();
        card.style.backgroundPosition = `-${x}px -${y}px`;
    }
}

document.getElementById('dealButton').addEventListener('click', dealCards);
