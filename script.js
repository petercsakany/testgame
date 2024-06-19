const cardWidth = 225;  // width of a single card in the sprite sheet
const cardHeight = 315;  // height of a single card in the sprite sheet
const card = document.getElementById('card');

function showAceOfClubs() {
    const aceOfClubsPosition = {
        x: 0,  // first column
        y: 0   // first row
    };
    card.style.backgroundPosition = `-${aceOfClubsPosition.x}px -${aceOfClubsPosition.y}px`;
    card.classList.remove('show'); // Reset the opacity
    setTimeout(() => card.classList.add('show'), 10); // Add show class with a slight delay
}

// Initial call to show the Ace of Clubs
showAceOfClubs();

document.getElementById('dealButton').addEventListener('click', showAceOfClubs);
