let _globalNumOfDaysCreated = 1;
let _nodesCreated = 0;

// generate divs when scrolling
document.getElementById("scroll-content").addEventListener("scroll", function () {
  var newDiv = document.createElement("div");
  newDiv.classList.add('inner');
  newDiv.innerHTML = "node " + _globalNumOfDaysCreated;
  document.getElementById("scroll-content").appendChild(newDiv);
  _globalNumOfDaysCreated++;
  _nodesCreated++;
  console.log(`Nodes: ${_nodesCreated}`);
});

const container = document.querySelector(".scroller");
const leftBtn = document.getElementById('btn-left');
const rightBtn = document.getElementById('btn-right');
let translate = 0;

leftBtn.addEventListener("click", function() {
  translate += 200;
  container.style.transform = "translateX(" + translate + "px" + ")";
});

rightBtn.addEventListener("click", function() {
  translate -= 200;
  container.style.transform = "translateX(" + translate + "px" + ")";
});

// generate divs until end of page width reached
// var checkForNewDiv = function () {
//   var lastDiv = document.querySelector("#scroll-content > div:last-child"); // last created element
//   var maindiv = document.querySelector("#scroll-content"); // container
//   var lastDivOffset = lastDiv.offsetLeft + lastDiv.clientWidth;
//   var pageOffset = maindiv.offsetLeft + maindiv.clientWidth;
//   console.log(`lastDivOffset ${lastDivOffset}`);
//   console.log(`pageOffset ${pageOffset}`);
  
//   if (pageOffset > lastDivOffset - 10) {
//     var newDiv = document.createElement("div");
//     newDiv.classList.add('inner');
//     newDiv.innerHTML = "node " + _globalNumOfDaysCreated;
//     document.getElementById("scroll-content").appendChild(newDiv);
//     _globalNumOfDaysCreated++;
//     _nodesCreated++;
//     console.log(`Nodes: ${_nodesCreated}`)
//     checkForNewDiv();
//   }
// };

// checkForNewDiv();