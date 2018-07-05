const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const dbPath = path.join(__dirname, '..', 'data', 'shapes.json');

// Middle ware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// GET "data" route handler
router.route('/shapes').get((req, res) => {
  // read "db" file
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Couldn\'t read DB!');
    }
    res.json(JSON.parse(data));
  });
});

module.exports = router;
