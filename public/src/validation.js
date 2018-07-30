function showError() {
  //empty constructor here
}

showError.prototype = Object.create(Shape.prototype);
showError.prototype.constructor = showError;

showError.prototype.appendErrorMsg = function appendErrorMsg(message, appendTo) {

  this.message = message;
  this.appendTo = appendTo;

  this.errWrapper = document.createElement('div');
  this.errWrapper.classList.add('error-message');
  this.errWrapper.innerHTML = this.message;

  this.removeErrorMsg(this.appendTo);
  this.appendTo.appendChild(this.errWrapper);
  this.appendTo.classList.add('err');
};

showError.prototype.removeErrorMsg = function removeErrorMsg(element) {
  if (element.classList.contains('err')) {
    Object.values(element.children).forEach(child => {

      //getting the one and only child with error (didn't rely on DOMNode array)
      if(child.getAttribute('class') == 'error-message'){
        element.removeChild(child)
        element.classList.remove('err')
      }
    });
   }
};

Shape.prototype.validateShape = function validateShape(shapeAttr) {

  //Need to get the x and y somehow
  shapeAttr.push(x);
  shapeAttr.push(y);

  let noErrors = true;
  let errInstance = new showError();

  shapeAttr.forEach((element) => {
    if (element.value == '') {
      //errInstance.appendErrorMsg(element.getAttribute('data-err').split('|')[0], element.parentElement);
      errInstance.appendErrorMsg(element.getAttribute('data-err').split('|')[0], element.parentElement);
      noErrors = false;
    }else if(isNaN(element.value) && element.getAttribute('data-required')){
      errInstance.appendErrorMsg(element.getAttribute('data-err').split('|')[1], element.parentElement);
      noErrors = false;
    }else{
      errInstance.removeErrorMsg(element.parentElement);
    }
  });

  return noErrors;
};
