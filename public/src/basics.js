/**
 * Comments
 */

// a one line comment

/* this is a longer,
   multi-line comment
 */

// (uncomment this line to see a SyntaxError)
// /* You can't, however, /* nest comments */ SyntaxError */

/**
 * Declarations
 */
var a;
// Declares a variable, optionally initializing it to a value.
let i;
// Declares a block-scoped, local variable, optionally initializing it to a value.
const myConst = 8;

// Declares a block-scoped, read-only named constant.
var a;
console.log('The value of a is ' + a); // The value of a is undefined
console.log('The value of c is ' + c); // Uncaught ReferenceError: c is not defined

/**
 * Scope & Hoisting
 */

// var declarations are hoisted (moved) at the top of the file/scope, hence the following is true
console.log('The value of b is ' + b); // The value of b is undefined
var b = 1;

var b;
console.log('The value of b is ' + b); // The value of b is undefined
b = 1;

// let declaration is not hoisted
let x;
console.log('The value of x is ' + x); // The value of x is undefined

console.log('The value of y is ' + y); // Uncaught ReferenceError: y is not defined
let y;

// let has block scope
if (true) {
  let y = 5;
}

console.log(y);  // ReferenceError: y is not defined

// var does not
if (true) {
  var t = 5;
}
console.log(t);  // x is 5

// functions have their own scope, as oposed to conditional or loop statements
var myvar = 'my value';

(function() {
  console.log(myvar); // undefined
  var myvar = 'local value';
})(); // IIF = Imediatelly Invoked Function


/**
 * Data Types
 */

// Primitives
var bool = true; // boolean
var nullable = null; // null
var notDefined = undefined; // undefined
var myNumber = 1; // number
var myFloat = 1.1 // also number
var myString = 'some text'; // string
var myString1 = "some other text"; // string
var stringInt = `this is a string with variable ${myNumber}`;

// Objects

var myObject = {
  property: '1',
  otherProp: 2
};
var myObject1 = new Object('value');
var myObject2 = ['1', 2]; // array


/**
 * Conditional statements
 *
 */

// IF
if (myObject.property === '2') {
  // statement_1;
} else if (myObject2[0] === '2') {
  // statement_2;
} else {
  // statement_last;
}

// Switch
var fruittype = 'Shoes';
switch (fruittype) {
  case 'Oranges':
    console.log('Oranges are $0.59 a pound.');
    break;
  case 'Apples':
    console.log('Apples are $0.32 a pound.');
    break;
  case 'Bananas':
    console.log('Bananas are $0.48 a pound.');
    break;
  case 'Cherries':
    console.log('Cherries are $3.00 a pound.');
    break;
  case 'Mangoes':
    console.log('Mangoes are $0.56 a pound.');
    break;
  case 'Papayas':
    console.log('Mangoes and papayas are $2.79 a pound.');
    break;
  default:
    console.log('Sorry, we are out of ' + fruittype + '.');
}
console.log('Is there anything else you\'d like?');
try {
  throw 'myException'; // generates an exception
}
catch (e) {
  // statements to handle any exceptions
  logMyErrors(e); // pass exception object to error handler
} finally {

}


/**
 * Loops and iterations
 */

// For
var step;
for (step = 0; step < 5; step++) {
  // Runs 5 times, with values of step 0 through 4.
  console.log('Walking east one step');
}

// do..while
// var i = 0;
do {
  i += 1;
  console.log(i);
} while (i < 5);

// while
var n = 0;
// var x = 0;
while (n < 3) {
  n++;
  x += n;
}


/**
 * Functions
 */

/* Function declaration */
(function(){

  foo(); // "bar"

  function foo() {
    console.log('bar');
    /* Function expression */

    baz(); // TypeError: baz is not a function

    var baz = function() {
      console.log('bar2');
    };
  }
})();


var factorial = function fac(n) {
  console.log("T" + T);
  return n < 2 ? 1 : n * fac(n - 1);
};

console.log(factorial(3));

// A function has the return type of the value returned and can be different
var returnSomethingOfMyType = function(variable) {
  if ('number' === typeof variable) {
    return 0;
  } else if ('string' === typeof variable) {
    return 'Some string';
  } else if ('object' === typeof variable) {
    return { a: 1 };
  }
}
console.log(returnSomethingOfMyType(1));
console.log(returnSomethingOfMyType('s'));
console.log(returnSomethingOfMyType({}));


// Closure
var pet = function(name) {   // The outer function defines a variable called "name"
  var age = 2;
  var getName = function() {
    return name + " of age" + age;             // The inner function has access to the "name" variable of the outer
                             //function
  }
  return getName;            // Return the inner function, thereby exposing it to outer scopes
}
myPet = pet('Vivie');

myPet();                     // Returns "Vivie"

// OR
var createPet = function(name) {
  var sex;

  return {
    setName: function(newName) {
      name = newName;
    },

    getName: function() {
      return name;
    },

    getSex: function() {
      // NSFW
      return sex;
    },

    setSex: function(newSex) {
      if(typeof newSex === 'string' && (newSex.toLowerCase() === 'male' ||
        newSex.toLowerCase() === 'female')) {
        sex = newSex;
      }
    }
  }
}

var pet = createPet('Vivie');
pet.getName();                  // Vivie

pet.setName('Oliver');
pet.setSex('male');
pet.getSex();                   // male
pet.getName();                  // Oliver


// function "arguments"

function addMultipleNr() {
  let sum = 0;
  for (var i=0; i<arguments.length; i++) {
    sum += parseInt(arguments[i], 10); // ensure it's int
  }
  return sum;
}
console.log(addMultipleNr(2, 3));
console.log(addMultipleNr(2, 3, 4));
console.log(addMultipleNr(2, 3, 4, 5));

// function default parameters
function multiply(a, b = 2) {
  return a * b;
}

multiply(5); // 10
multiply(5, 3); // 15


// Arrow functions
var a = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium'
];
// "long" function
var getLengthLong = function(s) { return s.length; };
var a2 = a.map(getLengthLong);

console.log(a2); // logs [8, 6, 7, 9]
// "short" function
var getLengthArrow = (s, d) => { getLengthArrow(1); return s.length; };
var a3 = a.map(getLengthArrow);

console.log(a3); // logs [8, 6, 7, 9]


// Objects

// Lexical "this"
function Person() {
  // The Person() constructor defines `this` as itself.
  this.age = 0;

  setInterval(function growUp() {
    // In nonstrict mode, the growUp() function defines `this`
    // as the global object, which is different from the `this`
    // defined by the Person() constructor.
    this.age++;
  }, 1000);
}

var p = new Person();

// show the age after 3 seconds - should show "3", but actually returns 0
setTimeout(function() {
  console.log(p.age);
}, 3000);

// Fix:
function Person() {
  // keep a reference to "this" in a varable scoped to the object/function
  var that = this;
  that.age = 0;

  setInterval(function growUp() {
    // The callback refers to the `that` variable of which
    // the value is the expected object.
    that.age++;
  }, 1000);
}

var p1 = new Person();

function Person() {
  // keep a reference to "this" in a varable scoped to the object/function
  this.age = 0;

  setInterval(() => {
    // The callback refers to the `that` variable of which
    // the value is the expected object.
    this.age++;
  }, 1000);

  Object.assign(this, {
    "sex": "male"
  });

  // this.sex = "male";
}

// show the age after 3 seconds - will show "3"
setTimeout(function() {
  console.log(p1.age);
}, 3000);

// Another way to declare an object
var person = {
  name: {
    first: 'Bob',
    last: 'Smith'
  },
  age: 32,
  gender: 'male',
  interests: ['music', 'skiing'],
  bio: function() {
    alert(this.name[0] + ' ' + this.name[1] + ' is ' + this.age + ' years old. He likes ' + this.interests[0] + ' and ' + this.interests[1] + '.');
  },
  greeting: function() {
    alert('Hi! I\'m ' + this.name[0] + '.');
  }
};
person.name.first; // or person['name']['first'], person.name['first'], person.['name'].first // dot/bracket notations
person.age;
person.interests[1];
person.bio();
person.greeting();


// setting members
person.age = 45;
var nameVar = 'name'
person[nameVar]['la-st'] = 'Cratchit';
// show them
person.age
person['name']['last']

// extending objects
var object1 = {
  a: 'a',
  b: 'b',
};

var object2 = Object.assign({}, object1, {
  b: 'b1',
  c: 'c'
})
