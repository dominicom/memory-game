const cards = ['udacity', 'google', 'javascript', 'html', 'css', 'slack', 'codepen', 'github'];
const fullStackOfCards = [...cards, ...cards];
const deck = $('.deck');
const card = '.card';
const restart = $('.restart');
const moveCount = $('.moves');
const popup = $('.popup');
const win = $('.win');
const timer = $('.timer');
const stars = $('.score-panel .stars li');
const finalRatingStars = $('.end-score-board .stars li');


let interval;
let rating = 3;
let moves = 0;
let seconds = 0;

let openCards = [];
let matchCards = [];

let message;
let isStarted = false;

//  ---------------------------------------
//  SHUFFLE FUNCTION
//  from http://stackoverflow.com/a/2450976
//  ---------------------------------------

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//  ----------------------
//  ADD CARDS AND MIX THEM
//  ----------------------

function addCards(card) {
  deck.append(`<li class="card"><img class="hide ${card}" src="img/${card}.svg"></li>`);
}
function shuffleCards(randomize) {
  randomize = shuffle(fullStackOfCards);
  randomize.forEach(addCards);
}

//  --------------------------
//  OPEN, CHECK AND MATCH CARD
//  --------------------------

function matched() {
  setTimeout(function(){
    openCards.forEach(function(card){
      card.toggleClass('match');
    });
    openCards = [];
  }, 500);
}


function mismatched() {
  setTimeout(function(){
    openCards.forEach(function(card){
      card.addClass('mismatch');
    });
  }, 500);
  setTimeout(function(){
    openCards.forEach(function(card){
      card.removeClass('mismatch open');
      card.children().toggleClass('hide');
    });
    openCards = [];
  }, 1200);
}


function checkCard(card) {

  // OPEN CARD
  if (openCards.length < 2 && !($(this).hasClass('open')) ) {
    $(this).toggleClass('open');
    $(this).children().toggleClass('hide');
    openCards.push($(this));
  }

  // CHECK CARD IF IS MATCHED OR NOT
  if (openCards.length === 2) {
    if (openCards[0].children().attr('class') === openCards[1].children().attr('class')) {
      matchCards.push($(this).children().attr('class'));
      matched();
    } else {
      mismatched();
    }
    moveCounter();
  }

  // START TIMER
  if (!isStarted) {
    isStarted = true;
    setTimer();
  }

  // ALL STACK MATCHED AND END SCORE EVENT
  if (matchCards.length === 8) {
    setTimeout(function(){
      score();
    }, 1200);
  }
}


// ---------------------------------------
// SCORE, TIMER, START AND END OF THE GAME
// ---------------------------------------

// SCORE
function moveCounter() {
    moves++;
    moveCount.html(moves);
    if (moves === 14 || moves === 25){
      starRating();
    }
}

function setTimer() {
  interval = setInterval(function() {
    seconds++;
    timer.html(seconds);
  }, 1000);
}

function starRating() {
  rating--;
  stars[rating].setAttribute('style','display: none');
  finalRatingStars[rating].setAttribute('style','display: none');
}

// END OF THE GAME
function score() {
  let message = `in ${seconds} seconds and made it with ${moves} moves`;
  popup.removeClass('hide');
  win.html(message);
  clearTimeout(interval);
  restart.click(resetGame);
}

// GAME INITIATION
function gameStart() {
  moveCount.html(moves);
  deck.empty();
  shuffleCards();
  $(card).click(checkCard);
}



//RESET GAME
function resetGame() {
  isStarted = false;
  moves = 0;
  openCards = [];
  matchCards = [];
  seconds = 0;
  rating = 3;
  stars.removeAttr('style');
  finalRatingStars.removeAttr('style');
  clearTimeout(interval);
  timer.html(seconds);
  popup.addClass('hide');
  gameStart();
}



$(function() {
  gameStart();
  restart.click(resetGame);
});



document.addEventListener('dragstart', function(event) {
  event.preventDefault();
});
