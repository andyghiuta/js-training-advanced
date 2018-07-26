

function showError(message, appendTo, show = true){
  this.message = message;
  this.appendTo = appendTo;
  this.show = show;
  this.errWrapper = document.createElement('div');
  this.errWrapper.classList.add('error-message');
  this.errWrapper.innerHTML = this.message;
}

showError.prototype = Object.create(Shape.prototype);
showError.prototype.constructor = showError;

showError.prototype.validateShape = function validateShape(){
  this.appendTo.appendChild(this.errWrapper);
  this.appendTo.classList.add('err');
};


Circle.prototype.validateShape = function validateShape(circleAttr){
  console.log(this)
  const showErr = new showError();

  Object.keys(circleAttr).forEach((key)=>{
    //console.log(key, circleAttr[key]);
    //eval(key).parentElement.showError();
    //showErr.validateShape('provide x', eval(key).parentElement ? eval(key).parentElement !== undefined : '')

  });

  function getMessage(element){
    return element.getAttribute('data-err');
  }

  if(circleAttr.x == ''){
    const showErr = new showError(getMessage(x), x.parentElement, true);
    showErr.validateShape();
  }else{
    const showErr = new showError(getMessage(y), x.parentElement, false);
    showErr.validateShape();
  }
  if(circleAttr.y == ''){
    const showErr = new showError(getMessage(y), y.parentElement, true);
    showErr.validateShape();
  }

  if(circleAttr.r == ''){
    const showErr = new showError(getMessage(circleAttr.r), eval(circleAttr).r.parentElement, true);
    showErr.validateShape();
  }
};
