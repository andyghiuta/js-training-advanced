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

  const visibleMessage = this.errWrapper.classList.length;

  if(this.show) {
    this.appendTo.appendChild(this.errWrapper);
    this.appendTo.classList.add('err');
  }else{
   //this.appendTo.removeChild(this.errWrapper);
    if(this.errWrapper.length){
      this.appendTo.removeChild(this.errWrapper);
    }
    this.appendTo.classList.remove('err');
  }
};


Shape.prototype.validateShape = function validateShape(shapeAttr){

  shapeAttr.push(x);
  shapeAttr.push(y);
  let noErrors = true;


  shapeAttr.forEach((element)=>{
    console.log(element.getAttribute('data-required'));

    if(element.value == ''){
      let showErr = new showError(element.getAttribute('data-err').split('|')[0], element.parentElement);
      showErr.validateShape();
      noErrors = false;
    }else{
      let showErr = new showError(element.getAttribute('data-err').split('|')[0], element.parentElement, false);
      showErr.validateShape();
    }

  if(noErrors){
      if(element.getAttribute('data-required') !== null){

        if(isNaN(element.value)){
          let showErr = new showError(element.getAttribute('data-err').split('|')[1], element.parentElement);
          showErr.validateShape();
          noErrors = false;
        }else{
          let showErr = new showError(element.getAttribute('data-err').split('|')[1], element.parentElement, false);
          showErr.validateShape();
        }
      }
    }
  });

  return noErrors;
};
