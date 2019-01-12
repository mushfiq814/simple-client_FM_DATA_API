// duration of scroll animation
var scrollDuration = 300;
// paddles
var leftPaddle = document.getElementsByClassName('left-paddle');
var rightPaddle = document.getElementsByClassName('right-paddle');
// get items dimensions
var itemsLength = $('.item').length;
var itemSize = $('.item').outerWidth(true);
// get some relevant size for the paddle triggering point
var paddleMargin = 20;

// get wrapper width
var getMenuWrapperSize = function() {
  return $('.menu-wrapper').outerWidth();
}
var menuWrapperSize = getMenuWrapperSize();
// the wrapper is responsive
$(window).on('resize', function() {
  menuWrapperSize = getMenuWrapperSize();
});
// size of the visible part of the menu is equal as the wrapper size 
var menuVisibleSize = menuWrapperSize;

// get total width of all menu items
var getMenuSize = function() {
  return itemsLength * itemSize;
};
var menuSize = getMenuSize();
// get how much of menu is invisible
var menuInvisibleSize = menuSize - menuWrapperSize;

// get how much have we scrolled to the left
var getMenuPosition = function() {
  return $('.menu').scrollLeft();
};

// finally, what happens when we are actually scrolling the menu
$('.menu').on('scroll', function() {

  // get how much of menu is invisible
  menuInvisibleSize = menuSize - menuWrapperSize;
  // get how much have we scrolled so far
  var menuPosition = getMenuPosition();

  var menuEndOffset = menuInvisibleSize - paddleMargin;

  // show & hide the paddles 
  // depending on scroll position
  if (menuPosition <= paddleMargin) {
    $(leftPaddle).addClass('hidden');
    $(rightPaddle).removeClass('hidden');
  } else if (menuPosition < menuEndOffset) {
    // show both paddles in the middle
    $(leftPaddle).removeClass('hidden');
    $(rightPaddle).removeClass('hidden');
  } else if (menuPosition >= menuEndOffset) {
    $(leftPaddle).removeClass('hidden');
    $(rightPaddle).addClass('hidden');
}

});

// scroll to left
$(rightPaddle).on('click', function(e) {
  e.preventDefault();
  $('.menu').animate( { scrollLeft: menuInvisibleSize}, scrollDuration);
});

// scroll to right
$(leftPaddle).on('click', function(e) {
  e.preventDefault();
  $('.menu').animate( { scrollLeft: '0' }, scrollDuration);
});


// ADD CODE HERE!
const container = document.querySelector(".container");
const leftBtn = document.getElementById('btn-left');
const rightBtn = document.getElementById('btn-right');
let translate = 0;
let n = 8;

// window.onload = () => {
  for (divCreateRecur=0; divCreateRecur<358; divCreateRecur++) {
    var newDiv = document.createElement('div');
    newDiv.classList.add('inner');
    newDiv.innerHTML = n;
    container.appendChild(newDiv);
    n++;
  }
// }

leftBtn.addEventListener("click", function() {
  translate += 200;
  container.style.transform = "translateX(" + translate + "px" + ")";
  console.log(translate);
  showHideBtns(translate)
});

rightBtn.addEventListener("click", function() {
  translate -= 200;
  container.style.transform = "translateX(" + translate + "px" + ")";
  console.log(translate);
  showHideBtns(translate);
});

function showHideBtns(translate) {
  if (translate>=0) { // hide left button
    leftBtn.classList.add('hidden');
    rightBtn.classList.remove('hidden');
  } else if (translate<=-22000) { // hide right button
    rightBtn.classList.add('hidden');
    leftBtn.classList.remove('hidden');
  } else {
    rightBtn.classList.remove('hidden');
    leftBtn.classList.remove('hidden');
  }
}