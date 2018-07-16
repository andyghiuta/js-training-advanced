// TODO 1. Create more shapes. EG: Square, Line, Arc, Text
// TODO 2. Extend the objects with a method that validates the input parameters and prompts the user
// DONE 3. Load the objects from the "database"
// TODO 3.1. Load shapes from two different "databses" and join the lists
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

function Line(x, y, x2, y2,  stroke, fill = 'rgba(0, 0, 200, 0.5)'){
  Shape.call(this, x, y, fill);
  this.x2 = x2;
  this.y2 = y2;
  this.stroke = stroke;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.drawFrame = function drawFrame() {
  ctx.strokeStyle = this.fill;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x2, this.y2);
  ctx.lineWidth = this.stroke;
  ctx.stroke();
};

function Ark(x, y, angleStart, angleEnd,  radius){
  Shape.call(this, x, y);
  this.angleStart   = angleStart;
  this.angleEnd     = angleEnd;
  this.radius       = radius;
}

Ark.prototype = Object.create(Shape.prototype);
Ark.prototype.constructor = Ark;


Ark.prototype.drawFrame = function drawFrame(){
  ctx.strokeStyle = this.fill;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.angleStart, this.angleEnd, this.radius * Math.PI);
  ctx.stroke();
};

function Text(x, y, text, fill){
  Shape.call(this, x, y, fill);
  this.text = text;
}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;
Text.prototype.drawFrame = function drawFrame(){
  ctx.font = "30px Arial";
  ctx.fillStyle = this.fill;
  ctx.fillText(this.text, this.x, this.y);
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
    case 'Line':
      return new Line(shape.x, shape.y, shape.x2, shape.y2, shape.stroke);
      break;
    case 'Ark':
      return new Ark(shape.x, shape.y, shape.angleStart, shape.angleEnd, shape.radius);
      break;
    case 'Text':
      return new Text(shape.x, shape.y, shape.text);
      break;
    default:
      throw new Error(`Shape type '${shape.type}' constructor not handled in factory`);
  }
}

function showError(message, appendTo){
  this.message = message;
  this.appendTo = appendTo;
}

showError.prototype = Object.create(Shape.prototype);
showError.prototype.constructor = showError;

showError.prototype.drawFrame = function drawFrame(){
  const trigger = document.querySelector('#addShape');
  trigger.addEventListener('click', ()=>{
    console.log(this);
  });
};

function retrieveAllTheShapes() {
  return axios.get('/shapes');
}

function toggleProgress(show) {
  return new Promise((resolve, reject) => {
    if (!document.getElementById('loading')) {
      reject(new Error('Not found!'));
    } else {
      document.getElementById('loading').classList.toggle('d-none', !show);
      resolve(`The progress was ${show ? 'shown' : 'hidden'}`);
    }
  });
}

const drawAllTheShapes = async function (doneCallback) {
  try {
    const togglePromise = toggleProgress(true);
    const togglePromise2 = toggleProgress(false);
    const togglePromise3 = toggleProgress(true);
    // retrieve the shapes, passing success and fail callbacks
    const [r1, ...arr] = await Promise.all([togglePromise, togglePromise2, togglePromise3]);
    const {data: [firstElement, ...allOther]} = await retrieveAllTheShapes();
    
    const firstShape = createShape(firstElement);
    firstShape.draw();
    
    allOther.forEach((shape) => {
      const shapeObject = createShape(shape);
      shapeObject.draw();
    });
    doneCallback('All the shapes were drawn.');
  } catch (error) {
    console.log(error);
  } finally {
    toggleProgress(false);
  }
};

drawAllTheShapes((finalResponse) => {
  console.log(finalResponse);
})
  .then(() => {
    console.log('next');
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

const errTemplate = (message)=>{
  return `<span>${message}</span>`;
};

function showErrMessages(field, message){
  
    /*console.log(field.parentNode);
    field.parentNode.appendChild(`<span>${message}</span>`, field);
    return errTemplate(message, field);*/
    
    //errTemplate(message).appendTo(field)
  console.log(field.parentNode)
  document.querySelector(field.parentNode).appendChild(errTemplate(message))
  
}

// add event listener on the button
addShapeBtn.addEventListener('click', () => {
  // read the shape position
  const x = document.getElementById('x').value;
  const y = document.getElementById('y').value;
  
  const shapeAttr = { type: shapeTypeSelect.value, x, y };
  
  // get the params for the selected type
  const attrs = document.querySelectorAll(`[name^="${shapeTypeSelect.value}"]`);
  
  
  attrs.forEach((node) => {
    if(node.value == ""){
      showErrMessages(node, node.dataset.err);
      //console.log(node.dataset.err);
      return;
    }else {
      const {value} = node;
      let {name} = node;
      // get only the part that we're interested in
      name = name.replace(/^(.*\[(.*)\])$/, '$2');
      shapeAttr[name] = value;
    }
  });
  
  const shape = createShape(shapeAttr);
  shape.draw();
}, false);

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}, false);

