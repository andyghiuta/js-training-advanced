const sendUpdate = function sendUpdate(port, response) {
  console.log('Posting message back to main script');
  port.postMessage(response);
};

let mSelectedWord;
let mCurrentState;

const jobs = {
  readState(port) {
    sendUpdate(port, {
      mSelectedWord,
      mCurrentState,
    });
  },
  init(port, { selectedWord, currentState }) {
    mSelectedWord = selectedWord;
    mCurrentState = currentState;
  },
  guessLetter(port, { letter }) {
    const letterMatch = new RegExp(letter, 'ig');
    const matches = mSelectedWord.match(letterMatch);
    if (matches === null) {
      return sendUpdate(port, { matched: false });
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
    return sendUpdate(port, { matched: true, guessedLetters, newState });
  },
};

onconnect = ({ ports: [port] }) => {
  console.log('onconnect');
  port.addEventListener('message', ({ data }) => {
    console.log('Message received from main script');
    const { job } = data;
    jobs[job](port, data);
  });

  // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
  port.start();
};
