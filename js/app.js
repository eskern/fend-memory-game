/*
 * Author: Emily Kern
 * Resources: Matthew Cranford'd walkthrough,
 *            w3schools.com to recall syntax and properties
 */

var moves = 0;
var faceUp = [];
const deck = document.querySelector('.deck');

function addMove(num){
  moves++;
  const moveCount = document.querySelector('.moves');
  moveCount.innerHTML = num;
}

/*
 * Logic: If the clicked target is a card,
 * and there aren't already two cards face up,
 * and the clicked card isn't already face up in any capacity
 */
function isValid(clicked){
  return(clicked.classList.contains('card') &&
  faceUp.length < 2 && !faceUp.includes(clicked) &&
  !clicked.classList.contains('match'));
}

/*
 * Flips card over
 */
function flipCard(toFlip){
  // Note: no need for '.' because this concerns classes, anyway
  toFlip.classList.toggle('open');
  toFlip.classList.toggle('show');
}

/*
 * Checks if the selected cards match
 */
function checkMatch(faceUp){
  return(faceUp[0].firstElementChild.className ===
    faceUp[1].firstElementChild.className);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * Adds star rating
 */
function starScore(){
  if(moves === 12 || moves === 18){
    removeStar();
  }
}

/*
 * Star removal helper function
 */
function removeStar(){
  // Gets us a list of the star elements, rather than, say, just the parent
  const stars = document.querySelectorAll('.stars li');
  for (star of stars){
    if(star.style.display != 'none'){
      star.style.display = 'none';
      break;
    }
  }
}

function game(){
  // A parent of class .deck with children of element type li
  const cardsInit = Array.from(document.querySelectorAll('.card'));
  const shuffled = shuffle(cardsInit);
  for(card of shuffled){
    deck.appendChild(card);
  }

  /*
   * Create a list that holds all of your cards!
   * My understanding: non-matched cards have .open and .show classes
   * Matching cards have the class .match
   * We can toggle which classes are on/off when a card is clicked
   * and if there is indeed a match
   */
  deck.addEventListener('click', function(){
  const clickedCard = event.target;
  if(isValid(clickedCard)){
    flipCard(clickedCard);
    faceUp.push(clickedCard);
    if(faceUp.length === 2){
      addMove(moves);
      if(checkMatch(faceUp)){
        faceUp[0].classList.toggle('match');
        faceUp[1].classList.toggle('match');
        faceUp = [];
      }
      else{
        setTimeout(function flipOver(){
          flipCard(faceUp[0]);
          flipCard(faceUp[1]);
          faceUp = [];
        }, 1000);
      }
      starScore();
    }
  }});
}
game();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
