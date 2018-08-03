const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);
// TODO for saving a file use fs.writeFile

const router = express.Router();

const circlesDbPath = path.join(__dirname, '..', 'data', 'circles.json');
const rectanglesDbPath = path.join(__dirname, '..', 'data', 'rectangles.json');

const asyncHandler = require('../middleware/async.js');

// Middle ware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// GET "data" route handler
router.route('/shapes').get(asyncHandler(async (req, res) => {
  try {
    // read "db" file
    const circlesP = readFile(circlesDbPath, 'utf8');
    const rectanglesP = readFile(rectanglesDbPath, 'utf8');
    const [circles, rectangles] = await Promise.all([circlesP, rectanglesP]);
    res.json(JSON.parse(circles).concat(JSON.parse(rectangles)));
  } catch (err) {
    console.error(`Cannot read file ${circlesDbPath}. Error:`, err);
    res.status(500).json({ error: 'Couldn\'t read DB!' });
  }
}));

module.exports = router;
