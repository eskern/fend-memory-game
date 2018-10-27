/*
 * Author: Emily Kern
 * Resources: Matthew Cranford'd walkthrough,
 *            w3schools.com to recall syntax and properties
 */

var moves = 0;
var faceUp = [];
const deck = document.querySelector('.deck');
let clockOff = true;
let time = 0;
let clock;
let matches = 0;
const TOTAL_PAIRS = 8;

function addMove(){
  moves++;
  const moveCount = document.querySelector('.moves');
  moveCount.innerHTML = moves;
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

/*
 * Adding clock/timer functionality
 */
function startClock(){
  clock = setInterval(function(){
    time++;
    displayTime();
  }, 1000);
}

/*
 * Stops the clock when the game is over
 */
function stopClock(){
  clearInterval(clock);
}

/*
 * Formats and shows time passed since the start of the game
 */
function displayTime(){
  const timer = document.querySelector('.clock');
  var minutes = Math.floor(time/60);
  var seconds = time%60;
  if(seconds < 10){
    timer.innerHTML = `${minutes}:0${seconds}`;
  }
  else{
    timer.innerHTML = `${minutes}:${seconds}`;
  }
}

/*
 * Toggles the modal so that it shows up at the right time
 */
function toggleModal(){
  const modal = document.querySelector('.modal__background');
  modal.classList.toggle('hide');
}

/*
 * Adds data to the modal
 */
 function modalStats(){
   const timeStat = document.querySelector('.modal__time');
   const clockTime = document.querySelector('.clock').innerHTML;
   const moveStat = document.querySelector('.modal__moves');
   const starsStat = document.querySelector('.modal__stars');
   const stars = getStars();
   timeStat.innerHTML = `Time = ${clockTime}`;
   moveStat.innerHTML = `Moves = ${moves}`;
   starsStat.innerHTML = `Stars = ${stars}`;
 }

 /*
  * A way to calculate how many stars the player has
  */
function getStars(){
  // we want a list to incrememnt over
  stars = document.querySelectorAll('.stars li');
  count = 0;
  for(star of stars){
    if(star.style.display != 'none'){
      count++;
    }
  }
  return count;
}

function resetTime(){
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves(){
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars(){
  const starList = document.querySelectorAll('.stars li');
  for(star of starList){
    star.style.display = 'inline';
  }
}

/*
 * Resets game and stats
 */
function resetGame(){
  resetTime();
  resetMoves();
  resetStars();
  game();
}

/*
 * Resets game after a gameOver() -- NOT when clicking the retry button
 */
function replay(){
  resetGame();
  toggleModal();
}

function shuffleDeck(){
  // A parent of class .deck with children of element type li
  const cardsInit = Array.from(document.querySelectorAll('.card'));
  const shuffled = shuffle(cardsInit);
  for(card of shuffled){
    deck.appendChild(card);
  }
}

function gameOver(){

  stopClock();
  modalStats();
  toggleModal();
}

/*
 * Flip all cards over
 */
function resetCards(){
  const cards = document.querySelectorAll('.card');
  for(let card of cards){
    card.className = 'card';
  }
}

/*
 * main game method
 */
function game(){
  shuffleDeck();
  resetCards();
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
    if(clockOff){
      clockOff = false;
      startClock();
    }
    flipCard(clickedCard);
    faceUp.push(clickedCard);
    if(faceUp.length === 2){
      addMove();
      if(checkMatch(faceUp)){
        faceUp[0].classList.toggle('match');
        faceUp[1].classList.toggle('match');
        matches++;
        faceUp = [];
        if(matches === TOTAL_PAIRS){
          gameOver();
        }
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
  }
  });
}
game();

document.querySelector('.modal__cancel').addEventListener('click', function(){
  toggleModal();
});
document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal__replay').addEventListener('click', replay);
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
