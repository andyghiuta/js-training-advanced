'use strict';

// TODO 1. Create more shapes. EG: Square, Line, Arc, Text
// TODO 2. Extend the objects with a method that validates the input parameters and prompts the user
// TODO 3. Load the objects from the "database"
// TODO 4. Save the objects in the "database"
var canvas = document.getElementById('drawing');
var canvasDiv = document.getElementById('drawingCnt');
function resize() {
  canvas.width = canvasDiv.offsetWidth * (2 / 3);
  canvas.height = canvas.width * (2 / 3);
}
resize();

var ctx = canvas.getContext('2d');

// Shape "constructor"
function Shape(x, y) {
  var fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(0, 0, 200, 0.5)';

  this.x = x;
  this.y = y;
  this.fill = fill;
}
// the function that draws the shape
Shape.prototype.draw = function draw() {
  var _this = this;

  window.requestAnimationFrame(function () {
    return _this.drawFrame();
  });
};
// extend the drawFrame
Shape.prototype.drawFrame = function drawFrame() {
  // actual drawing logic
  // to be implemented in each shape type
  throw new Error('Implement this function in your shape type');
};

// Circle "constructor"
function Circle(x, y, r) {
  var fill = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'rgba(0, 0, 200, 0.5)';

  // call the shape constructor
  Shape.call(this, x, y);
  this.r = r;
}
// Circle extends Shape
Circle.prototype = Object.create(Shape.prototype);
// extend the drawFrame
Circle.prototype.drawFrame = function drawFrame() {
  // fill with a blue color, 50% opacity
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  // an arc starting at x/y position, "r"px radius, start at 0, end at PI*2 (end of the circle)
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); // Outer circle
  ctx.fill();
};

// Rectangle "constructor"
function Rectangle(x, y, width, height) {
  var fill = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'rgba(0, 0, 200, 0.5)';

  // call the shape constructor
  Shape.call(this, x, y, fill);
  this.width = width;
  this.height = height;
}
// Circle extends Shape
Rectangle.prototype = Object.create(Shape.prototype);
// extend the drawFrame
Rectangle.prototype.drawFrame = function drawFrame() {
  // fill with a blue color, 50% opacity
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  // an arc starting at x/y position, "r"px radius, start at 0, end at PI*2 (end of the circle)
  ctx.rect(this.x, this.y, this.width, this.height); // Outer circle
  ctx.fill();
};

// factory
function createShape(shape) {
  switch (shape.type) {
    case 'Circle':
      return new Circle(shape.x, shape.y, shape.r);
    case 'Rectangle':
      return new Rectangle(shape.x, shape.y, shape.width, shape.height);
    default:
      throw new Error('Shape type \'' + shape.type + '\' constructor not handled in factory');
  }
}

var simulateTimeout = void 0;
function retrieveAllTheShapes(callback) {
  clearTimeout(simulateTimeout);
  // simulate an http call to retrieve shapes
  simulateTimeout = setTimeout(function () {
    // create some demo shapeds
    var shapes = [{
      type: 'Circle',
      x: 30,
      y: 60,
      r: 30
    }, {
      type: 'Circle',
      x: 60,
      y: 30,
      r: 30
    }, {
      type: 'Circle',
      x: 90,
      y: 60,
      r: 30
    }, {
      type: 'Circle',
      x: 60,
      y: 90,
      r: 30
    }, {
      type: 'Rectangle',
      x: 100,
      y: 100,
      width: 40,
      height: 50
    }, {
      type: 'Rectangle',
      x: 110,
      y: 110,
      width: 50,
      height: 40
    }];

    callback(shapes);
  } /* , 5 * 1000 */);
}

var drawAllTheShapes = function drawAllTheShapes() {
  toggleProgress(true);
  var doneCallback = function doneCallback(shapes) {
    shapes.forEach(function (shape) {
      var shapeObject = createShape(shape);
      shapeObject.draw();
    });
    toggleProgress(false);
  };
  retrieveAllTheShapes(doneCallback);
};

drawAllTheShapes();

// add window resize listener
window.addEventListener('resize', function () {
  // this will update the canvas with/height, which will also redraw it, so we need to redraw all the shapes
  resize();
  drawAllTheShapes();
}, false);

function toggleProgress(show) {
  document.getElementById('loading').classList.toggle('d-none', !show);
}

var addShapeBtn = document.getElementById('addShape');
// add event listener on the select type
var shapeTypeSelect = document.getElementById('type');
shapeTypeSelect.addEventListener('change', function typeChange() {
  // hide all "attr" rows
  var allAttrs = document.querySelectorAll('.attr');
  allAttrs.forEach(function (item) {
    item.classList.add('d-none');
  });
  // show the selected one
  var shapeAttr = document.getElementById('attr' + this.value);
  if (shapeAttr) {
    shapeAttr.classList.remove('d-none');
    addShapeBtn.classList.remove('d-none');
  } else {
    addShapeBtn.classList.add('d-none');
  }
}, false);

// add event listener on the button
addShapeBtn.addEventListener('click', function () {
  // read the shape position
  var x = document.getElementById('x').value;
  var y = document.getElementById('y').value;
  switch (shapeTypeSelect.value) {
    case 'Circle':
      // circle also has a radius
      var r = document.getElementById('circleR').value;
      // create and draw the shape
      new Circle(x, y, r).draw();
      break;
    default:
  }
}, false);