const express = require('express');
const path = require('path');
const drawingRoutes = require('./routes/drawing.js');

const app = express();

function test() {
  console.log(123);
}
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(drawingRoutes);

app.get('/test', (req, res) => {
  test();
  res.json({ ok: true });
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
