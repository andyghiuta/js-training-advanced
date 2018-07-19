# Functional programming

## Pure functions

### The definition of a pure function

1. The function always returns the same result if the same arguments are passed in. It does not depend on any state, or data, change during a program’s execution. It must only depend on its input arguments.
2. The function does not produce any observable side effects such as network requests, input and output devices, or data mutation.

### What Are Observable Side Effects?
An observable side effect is any interaction with the outside world from within a function. That could be anything from changing a variable that exists outside the function, to calling another method from within a function.

Side effects include, but are not limited to:

- Making a HTTP request
- Mutating data
- Printing to a screen or console
- DOM Query/Manipulation
- Math.random()
- Getting the current time

### Pure Function Example In JavaScript

```javascript
function priceAfterTax(productPrice) {
 return (productPrice * 0.20) + productPrice;
}
```

### Impure Function Example In JavaScript

```javascript
var tax = 20;
function calculateTax(productPrice) {
 return (productPrice * (tax/100)) + productPrice; 
}
```


## Higher order functions

Functions that operate on other functions, either by taking them as arguments or by returning them, are called higher-order functions. Since we have already seen that functions are regular values, there is nothing particularly remarkable about the fact that such functions exist. The term comes from mathematics, where the distinction between functions and other values is taken more seriously.

Higher-order functions allow us to abstract over actions, not just values. They come in several forms. For example, you can have functions that create new functions.

Example 
```javascript
function greaterThan(n) {
	// return a function
	return m => m > n;
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true

function reduce(array, combine, start) {
	let current = start;
	for (let element of array) {
		current = combine(current, element);
	}
	return current;
}

console.log(reduce([1, 2, 3, 4], (a, b) => a + b, 0));
// → 10
```

## Composition
Higher-order functions start to shine when you need to compose operations. As an example, let’s write code that finds the average year of origin for living and dead scripts in the data set.

```javascript
function average(array) {
	return array.reduce((a, b) => a + b) / array.length;
}

console.log(
	average(
		[8,9,10,11,12]
			.filter(greaterThan10)
			.map(priceAfterTax)
	)
);
```

## Immutability
Mutating data can produce code that’s hard to read and error prone. For primitive values (like numbers and strings), it is pretty easy to write ‘immutable’ code, because primitive values cannot be mutated themselves. Variables containing primitive types always point to the actual value. If you pass it to another variable, the other variable get’s a fresh copy of that value.

Objects (and arrays) are a different story, they are passed by reference. This means that if you would pass an object to another variable, they will both refer to the same object. If you would then mutate the object from either variable, they will both reflect the changes.

Example:

```javascript
const person = {
	name: 'John',
	age: 28
}
const newPerson = person
newPerson.age = 30
console.log(newPerson === person) // true
console.log(person) // { name: 'John', age: 30 }
```

Instead of passing the object and mutating it, we will be better off creating a completely new object:

```javascript
const person = {
	name: 'John',
	age: 28
}
const newPerson = Object.assign({}, person, {
	age: 30
})
console.log(newPerson === person) // false
console.log(person) // { name: 'John', age: 28 }
console.log(newPerson) // { name: 'John', age: 30 }

// OR spread operator (...)

const newPerson2 = {
	...person,
	age: 30
};

const characters = [ 'Obi-Wan', 'Vader', 'Luke' ]
const otherCharacters = [ 'Yoda', 'Finn' ]
const moreCharacters = [ ...characters, ...otherCharacters ]
```

How does this apply to functional programming? A good practice is to never mutate the original object, always return a new object. A bad example:

```javascript
const items = [{ price: 10 }, {price: 15}, {price: 20}];
const itemsWithTax = items.map(item => {
	item.price = priceAfterTax(item.price);
	return item
});
console.log(itemsWithTax); // [{"price":12},{"price":18},{"price":24}]
console.log(items); // [{"price":12},{"price":18},{"price":24}] // WUT?
```

A correct implementation would be:

```javascript
const items = [{ price: 10 }, {price: 15}, {price: 20}];
const itemsWithTax = items.map(item => {
	return Object.assign({}, item, {price: priceAfterTax(item.price)})
});
console.log(itemsWithTax); // [{"price":12},{"price":18},{"price":24}]
console.log(items); // [{"price":10},{"price":15},{"price":20}]
```

## Imperative vs declarative
Functional programming is a declarative paradigm, meaning that the program logic is expressed without explicitly describing the flow control.

Imperative programs spend lines of code describing the specific steps used to achieve the desired results — the flow control: How to do things.

Declarative programs abstract the flow control process, and instead spend lines of code describing the data flow: What to do. The how gets abstracted away.

For example, this imperative mapping takes an array of numbers and returns a new array with each number multiplied by 2:

```javascript
const doubleMap = numbers => {
	const doubled = [];
	for (let i = 0; i < numbers.length; i++) {
		doubled.push(numbers[i] * 2);
	}
	return doubled;
};

console.log(doubleMap([2, 3, 4])); // [4, 6, 8]
```
This declarative mapping does the same thing, but abstracts the flow control away using the functional Array.prototype.map() utility, which allows you to more clearly express the flow of data:

```javascript
const doubleMap = numbers => numbers.map(n => n * 2);

console.log(doubleMap([2, 3, 4])); // [4, 6, 8]
```

Imperative code frequently utilizes statements. A statement is a piece of code which performs some action. Examples of commonly used statements include `for`, `if`, `switch`, `throw`, etc

Declarative code relies more on expressions. An expression is a piece of code which evaluates to some value. Expressions are usually some combination of function calls, values, and operators which are evaluated to produce the resulting value.

These are all examples of expressions
```javascript
2 * 2
doubleMap([2, 3, 4])
Math.max(4, 3, 2)
```

Credits:
https://developer.mozilla.org/en-US/docs/Web/JavaScript
https://eloquentjavascript.net/
https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c
