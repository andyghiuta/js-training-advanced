const sendUpdate = function sendUpdate(response) {
  console.log('Posting message back to main script');
  postMessage(response);
};

let mSelectedWord;
let mCurrentState;

const jobs = {
  init({ selectedWord, currentState }) {
    mSelectedWord = selectedWord;
    mCurrentState = currentState;
  },
  guessLetter({ letter }) {
    const letterMatch = new RegExp(letter, 'ig');
    const matches = mSelectedWord.match(letterMatch);
    if (matches === null) {
      return sendUpdate({ matched: false });
    }
    // get first match
    let match = letterMatch.exec(mSelectedWord);
    let newState = mCurrentState;
    let guessedLetters = 0;
    while (match) {
      newState = newState.slice(0, match.index)
          + letter.toUpperCase()
          + newState.slice(match.index + 1);
      guessedLetters += 1;
      // get next match
      match = letterMatch.exec(mSelectedWord);
    }
    mCurrentState = newState;
    return sendUpdate({ matched: true, guessedLetters, newState });
  },
};

onmessage = function({ data }) {
  console.log('Message received from main script');
  const { job } = data;
  jobs[job](data);
};