const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use(require(path.join(__dirname, 'routes', 'drawing.js')));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
