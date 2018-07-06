'use strict';

if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function value(_value) {
      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ? len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = _value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}

// function to update a word
var updateWord = function updateWord(word) {
  var wordLetters = '';
  word.split('').forEach(function (letter) {
    wordLetters += '<span class="badge badge-secondary">' + letter + '</span>\n';
  });
  $('#word').html(wordLetters);
};

// function to update score function
var updateScore = function updateScore(newScore) {
  $('#staticScore').val(newScore);
};
// function to update score function
var updateFailTriesCount = function updateFailTriesCount(fails) {
  $('#staticTries').val(fails);
};
// function to show a popover
var showPopover = function showPopover($element, message) {
  $element.popover('dispose');
  $element.popover({
    trigger: 'manual',
    placement: 'top',
    content: message
  }).popover('show');
  var hidePopover = function hidePopover(myLog) {
    $element.popover('hide');
    myLog('Popover hidden');
  };
  setTimeout(function () {
    hidePopover(function (log) {
      console.log(log);
    });
  }, 5 * 1000 /* 5 sec */);
};

var guessLetter = function guessLetter(game) {
  var guessedLetter = $('#inputLetter').val();
  // check the input of the letter
  if (game.isValidLetter(guessedLetter)) {
    // guess letter
    var letterIsGuessed = game.guessLetter(guessedLetter);
    if (letterIsGuessed) {
      // update the view with the new word state
      updateWord(game.getCurrentStateWord());
      // update the score
      updateScore(game.getScore());
      showPopover($('#word'), 'Word updated!');
      $('#inputLetter').val('').focus();
    } else {
      // update the trial count
      updateFailTriesCount(game.getLeftFailTries());
      showPopover($('#inputLetter'), 'The letter was incorrect!');
      $('#inputLetter').focus().select();
    }
    var wordIsGuessed = false; // TODO check if the word is guessed
    var gameIsOver = false; // TODO check if the game is over
    if (wordIsGuessed) {
      // TODO show success message and propose retry
    } else if (gameIsOver) {
      // TODO show game over
    }
  } else {
    showPopover($('#inputLetter'), 'The input is not a valid letter');
    $('#inputLetter').focus().select();
  }
};

function startGame(game) {
  // guess button click handler
  $('#guess').click(function () {
    guessLetter(game);
  });
  // keyup event on the input (detect enter)
  $('#inputLetter').keyup(function (e) {
    if (e.keyCode === 13) {
      // enter detected
      guessLetter(game);
    }
  });
}

// guess the word module
var guessTheWord = function guessTheWord() {
  // "config" options
  var MAX_FAILS = 6;
  var BONUS_PER_LETTER = 5; // bitcoins
  // declare an object for "word list"
  var WORD_LIST = ['JavaScript', 'Office', 'Ness'];
  var nrFails = void 0;
  var score = void 0;
  // keep a reference for the currently selected word
  var selectedWord = void 0;
  // declare an object for the current state of the word
  var currentState = void 0;
  // declare a function that generates a random integer between two numbers
  var getRandomWordPosition = function getRandomWordPosition() {
    return Math.floor(Math.random() * Math.floor(WORD_LIST.length));
  };

  // initialize the guessing game
  var init = function init() {
    // reset game state
    currentState = '';
    nrFails = 0;
    score = 0;
    // randomly pick a word from the word list
    selectedWord = WORD_LIST[getRandomWordPosition()];
    // return the current state of the word
    currentState = new Array(selectedWord.length);
    currentState = currentState.fill('_').join('');
    return currentState;
  };

  // will receive a letter as argument and will return true or false
  var guessLetterInternal = function guessLetterInternal(letter) {
    // implement this function
    var letterMatch = new RegExp(letter, 'ig');
    var matches = selectedWord.match(letterMatch);
    if (matches === null) {
      nrFails += 1;
      return false;
    }
    // get first match
    var match = letterMatch.exec(selectedWord);
    while (match) {
      currentState = currentState.slice(0, match.index) + letter.toUpperCase() + currentState.slice(match.index + 1);
      score += BONUS_PER_LETTER;
      // get next match
      match = letterMatch.exec(selectedWord);
    }
    return true;
  };

  var isValidLetter = function isValidLetter(letter) {
    // implement this function
    return (/^[a-zA-Z]$/.test(letter)
    );
  };

  var getLeftFailTries = function getLeftFailTries() {
    return MAX_FAILS - nrFails;
  };

  // return an object with the functions we want exposed
  return {
    init: init,
    guessLetter: guessLetterInternal,
    isValidLetter: isValidLetter,
    getCurrentStateWord: function getCurrentStateWord() {
      return currentState;
    },

    // es2015
    getScore: function getScore() {
      return score;
    },

    getLeftFailTries: getLeftFailTries
  };
};

// when the page is initialized, init the game and
$(document).ready(function () {
  // declare the game variable
  var game = guessTheWord();

  // initialize the game
  var initialWordState = game.init();

  // update the view with the initial word state
  updateWord(initialWordState);

  // update the fail tries count
  updateFailTriesCount(game.getLeftFailTries());

  startGame(game);
});