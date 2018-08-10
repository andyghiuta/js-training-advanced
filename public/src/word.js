if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value(value) {
      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      const O = Object(this);

      // Steps 3-5.
      const len = O.length >>> 0;

      // Steps 6-7.
      const start = arguments[1];
      const relativeStart = start >> 0;

      // Step 8.
      let k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      const end = arguments[2];
      const relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      const final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    },
  });
}

// function to update a word
const updateWord = function (word) {
  let wordLetters = '';
  word.split('').forEach((letter) => {
    wordLetters += `<span class="badge badge-secondary">${letter}</span>\n`;
  });
  $('#word').html(wordLetters);
};

// function to update score function
const updateScore = function (newScore) {
  $('#staticScore').val(newScore);
};
// function to update score function
const updateFailTriesCount = function (fails) {
  $('#staticTries').val(fails);
};
// function to show a popover
const showPopover = function ($element, message) {
  $element.popover('dispose');
  $element.popover({
    trigger: 'manual',
    placement: 'top',
    content: message,
  }).popover('show');
  const hidePopover = function (myLog) {
    $element.popover('hide');
    myLog('Popover hidden');
  };
  setTimeout(() => {
    hidePopover((log) => {
      console.log(log);
    });
  }, 5 * 1000 /* 5 sec */);
};

const guessLetter = function (game) {
  const guessedLetter = $('#inputLetter').val();
  // check the input of the letter
  if (game.isValidLetter(guessedLetter)) {
    // guess letter
    game.guessLetter(guessedLetter, (letterIsGuessed) => {
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
      const wordIsGuessed = false; // TODO check if the word is guessed
      const gameIsOver = false; // TODO check if the game is over
      if (wordIsGuessed) {
        // TODO show success message and propose retry
      } else if (gameIsOver) {
        // TODO show game over
      }
    });
  } else {
    showPopover($('#inputLetter'), 'The input is not a valid letter');
    $('#inputLetter').focus().select();
  }
};

function startGame(game) {
  // guess button click handler
  $('#guess').click(() => {
    guessLetter(game);
  });
  // keyup event on the input (detect enter)
  $('#inputLetter').keyup((e) => {
    if (e.keyCode === 13) {
      // enter detected
      guessLetter(game);
    }
  });
}

// guess the word module
const guessTheWord = function () {
  // "config" options
  const MAX_FAILS = 6;
  const BONUS_PER_LETTER = 5; // bitcoins
  // declare an object for "word list"
  const WORD_LIST = ['JavaScript', 'Office', 'Ness'];
  let nrFails;
  let score;
  // keep a reference for the currently selected word
  let selectedWord;
  // declare an object for the current state of the word
  let currentState;
  const myWorker = new SharedWorker('src/word-shared-worker.js');
  // declare a function that generates a random integer between two numbers
  const getRandomWordPosition = function () {
    return Math.floor(Math.random() * Math.floor(WORD_LIST.length));
  };

  // initialize the guessing game
  const init = function (callback) {
    // reset game state
    currentState = '';
    nrFails = 0;
    score = 0;
    myWorker.port.postMessage({ job: 'readState' });
    myWorker.port.onmessage = ({ data: { mSelectedWord, mCurrentState } }) => {
      if (mSelectedWord) {
        selectedWord = mSelectedWord;
        currentState = mCurrentState;
      } else {
        // randomly pick a word from the word list
        selectedWord = WORD_LIST[getRandomWordPosition()];
        // return the current state of the word
        currentState = new Array(selectedWord.length);
        currentState = currentState.fill('_').join('');
        myWorker.port.postMessage({ job: 'init', selectedWord, currentState });
      }
      callback(currentState);
    };
  };

  // will receive a letter as argument and will return true or false
  const guessLetterInternal = function (letter, callback) {
    myWorker.port.postMessage({
      job: 'guessLetter', letter, selectedWord, currentState,
    });
    myWorker.port.onmessage = function guessLetterMessage({
      data: { matched, guessedLetters, newState },
    }) {
      if (matched) {
        score += BONUS_PER_LETTER * guessedLetters;
        currentState = newState;
        callback(true);
      } else {
        nrFails += 1;
        callback(false);
      }
    };
  };

  const isValidLetter = function (letter) {
    // implement this function
    return /^[a-zA-Z]$/.test(letter);
  };

  const getLeftFailTries = () => MAX_FAILS - nrFails;

  // return an object with the functions we want exposed
  return {
    init,
    guessLetter: guessLetterInternal,
    isValidLetter,
    getCurrentStateWord() {
      return currentState;
    },
    // es2015
    getScore() {
      return score;
    },
    getLeftFailTries,
  };
};

// when the page is initialized, init the game and
$(document).ready(() => {
  // declare the game variable
  const game = guessTheWord();

  // initialize the game
  game.init((initialWordState) => {
    // update the view with the initial word state
    updateWord(initialWordState);

    // update the fail tries count
    updateFailTriesCount(game.getLeftFailTries());
    startGame(game);
  });
});
