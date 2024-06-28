// base API URL

const apiAddr = 'http://localhost:3000/ramens';

// main function

function main() {
  addSubmitListener();
  displayRamens();
}

// global variables
let idCount;

// admin functions

function addSubmitListener() {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', event => handleSubmit(event))
}

function handleInitialDisplay(ramenData) {
  idCount = ramenData.length;
  ramenData.forEach(ramen => appendToMenu(ramen))
  detailUpdate(ramenData[0]);
}

function handleSubmit(event) {
  event.preventDefault();
  appendToMenu(buildRamenObj());
  event.target.reset();
}

function appendToMenu(ramen) {
  const ramenMenu = document.getElementById('ramen-menu');
  ramenMenu.appendChild(buildRamenImage(ramen));
}

function detailUpdate(ramen) {

  // assign values for the selected option to the corresponding DOM elements

  document.querySelector('img.detail-image').src = ramen.image;
  document.querySelector('h2.name').innerText = ramen.name;
  document.querySelector('h3.restaurant').innerText = ramen.restaurant;
  document.getElementById('rating-display').innerText = ramen.rating;
  document.getElementById('comment-display').innerText = ramen.comment;
}

// builder functions

function buildRamenImage(ramen) {
  const ramenImage = document.createElement('img');
  ramenImage.id = `ramen-${ramen.id}`;
  ramenImage.src = ramen.image;
  ramenImage.addEventListener('click', event => handleClick(event));
  return ramenImage;
}

function buildRamenObj() {
  const ramenObj = {};
  ramenObj.id = idCount + 1
  ramenObj.name = document.getElementById('new-name').value;
  ramenObj.restaurant = document.getElementById('new-restaurant').value;
  ramenObj.image = document.getElementById('new-image').value;
  ramenObj.rating = document.getElementById('new-rating').value;
  ramenObj.comment = document.getElementById('new-comment').value;
}

// server interaction functions

function displayRamens() {
  fetch(apiAddr)
    .then(res => res.json())
    .then(ramenData => handleInitialDisplay(ramenData))
}

function getRamenDetail(id) {
  fetch(`${apiAddr}/${id}`)
  .then(res => res.json())
  .then(ramenData => detailUpdate(ramenData))
}

// callback functions

const handleClick = (event) => {
  const ramenId = parseInt(event.target.id.slice(6));
  getRamenDetail(ramenId);  
}

document.addEventListener('DOMContentLoaded', main());

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
