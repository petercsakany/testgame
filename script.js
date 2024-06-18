const cardElements = document.querySelectorAll(".card");
const dealButton = document.getElementById("deal-button");

// Replace these values with the actual width and height of a card in the sprite sheet
const cardWidth = 100;
const cardHeight = 150;

// Function to get a random card position from the sprite sheet
function getRandomCardPosition() {
  const suitIndex = Math.floor(Math.random() * 4); // 0-3 for suits
  const cardIndex = Math.floor(Math.random() * 13); // 0-12 for cards

  const xPosition = suitIndex * cardWidth;
  const yPosition = cardIndex * cardHeight;

  return `-${xPosition}px -${yPosition}px`;
}

// Function to deal cards (just visual for now)
function dealCards() {
  cardElements.forEach((card) => {
    card.style.backgroundImage = "url('cards.png')"; // Reset background
    card.style.backgroundPosition = getRandomCardPosition();
  });
}

dealButton.addEventListener("click", dealCards);
