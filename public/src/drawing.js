// TODO 1. Create more shapes. EG: Square, Line, Arc, Text
// TODO 2. Extend the objects with a method that validates the input parameters and prompts the user
// TODO 3. Load the objects from the "database"
// TODO 4. Save the objects in the "database"
const canvas = document.getElementById('drawing');
const canvasDiv = document.getElementById('drawingCnt');
function resize() {
  canvas.width = canvasDiv.offsetWidth * (2 / 3);
  canvas.height = canvas.width * (2 / 3);
}
resize();

const ctx = canvas.getContext('2d');

// Shape "constructor"
function Shape(x, y, fill = 'rgba(0, 0, 200, 0.5)') {
  this.x = x;
  this.y = y;
  this.fill = fill;
  this.draw = function draw() {
    window.requestAnimationFrame(() => this.drawFrame());
  };
}
// the function that draws the shape
// Shape.prototype.draw = function draw() {
//   window.requestAnimationFrame(() => this.drawFrame());
// };
// extend the drawFrame
Shape.prototype.drawFrame = function drawFrame() {
  // actual drawing logic
  // to be implemented in each shape type
  throw new Error('Implement this function in your shape type');
};

// Circle "constructor"
function Circle(x, y, r, fill = 'rgba(0, 0, 200, 0.5)') {
  // call the shape constructor
  Shape.call(this, x, y); // .apply(this, [x, y])
  this.r = r;
}

// Circle extends Shape
Circle.prototype = Object.create(Shape.prototype);
// re-assigning constructor
Circle.prototype.constructor = Circle;

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
function Rectangle(x, y, width, height, fill = 'rgba(0, 0, 200, 0.5)') {
  // call the shape constructor
  Shape.call(this, x, y, fill);
  this.width = width;
  this.height = height;
}
// Circle extends Shape
Rectangle.prototype = Object.create(Shape.prototype);
// re-assigning constructor
Rectangle.prototype.constructor = Rectangle;
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
    case 'Square':
      return new Rectangle(shape.x, shape.y, shape.size, shape.size);
    default:
      throw new Error(`Shape type '${shape.type}' constructor not handled in factory`);
  }
}

let simulateTimeout;
const shapes = [{
  type: 'Circle',
  x: 30,
  y: 60,
  r: 30,
}, {
  type: 'Circle',
  x: 60,
  y: 30,
  r: 30,
}, {
  type: 'Circle',
  x: 90,
  y: 60,
  r: 30,
}, {
  type: 'Circle',
  x: 60,
  y: 90,
  r: 30,
}, {
  type: 'Rectangle',
  x: 100,
  y: 100,
  width: 40,
  height: 50,
}
// TODO Uncomment this object for the initial draw to work
/*, {
  type: 'Rectangle',
  x: 110,
  y: 110,
  width: 50,
  height: 40,
}*/];

function retrieveAllTheShapes(successCallback, failCallback) {
  clearTimeout(simulateTimeout);
  // simulate an http call to retrieve shapes
  simulateTimeout = setTimeout(() => {
    // perform some checks
    if (shapes.length < 6) {
      failCallback('Unexpected number of shapes');
    } else {
      successCallback(shapes);
    }
  }, 2 * 1000);
}

function toggleProgress(show, doneCallback, failCallback) {
  if (!document.getElementById('loading')) {
    failCallback('Not found!');
  } else {
    document.getElementById('loading').classList.toggle('d-none', !show);
    doneCallback(`The progress was ${show ? 'shown' : 'hidden'}`);
  }
}

const drawAllTheShapes = function (doneCallback) {
  toggleProgress(true, (toggleResponse) => {
    console.log(toggleResponse);
    // retrieve the shapes, passing success and fail callbacks
    retrieveAllTheShapes((shapesResponse) => {
      shapesResponse.forEach((shape) => {
        const shapeObject = createShape(shape);
        shapeObject.draw();
      });
      toggleProgress(false, (toggleResponse2) => {
        console.log(toggleResponse2);
        doneCallback('All the shapes were drawn');
      });
    }, (err) => {
      toggleProgress(false, (toggleResponse3) => {
        console.log(toggleResponse3);
        alert(err);
      });
    });
  });
};

drawAllTheShapes((finalResponse) => {
  console.log(finalResponse);
});

// add window resize listener
window.addEventListener('resize', () => {
  // this will update the canvas with/height, which will also redraw it,
  // so we need to redraw all the shapes
  resize();
  console.log('resize');
  drawAllTheShapes((finalResponse) => {
    console.log(finalResponse);
  });
}, false);

const addShapeBtn = document.getElementById('addShape');
// add event listener on the select type
const shapeTypeSelect = document.getElementById('type');
shapeTypeSelect.addEventListener('change', function typeChange() {
  // hide all "attr" rows
  const allAttrs = document.querySelectorAll('.attr');
  allAttrs.forEach((item) => {
    item.classList.add('d-none');
  });
  // show the selected one
  const shapeAttr = document.getElementById(`attr${this.value}`);
  if (shapeAttr) {
    shapeAttr.classList.remove('d-none');
    addShapeBtn.classList.remove('d-none');
  } else {
    addShapeBtn.classList.add('d-none');
  }
}, false);

// add event listener on the button
addShapeBtn.addEventListener('click', () => {
  // read the shape position
  const x = document.getElementById('x').value;
  const y = document.getElementById('y').value;
  const shapeAttr = {
    type: shapeTypeSelect.value,
    x,
    y,
  };
  // get the params for the selected type
  const attrs = document.querySelectorAll(`[name^="${shapeTypeSelect.value}"]`);
  attrs.forEach((node) => {
    const { value } = node;
    let { name } = node;
    // get only the part that we're interested in
    name = name.replace(/^(.*\[(.*)\])$/, '$2');
    shapeAttr[name] = value;
  });
  const shape = createShape(shapeAttr);
  shape.draw();
}, false);

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}, false);
