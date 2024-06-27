// base API URL

const apiAddr = 'http://localhost:3000/ramens';

// main function

function main() {
  addSubmitListener();
  displayRamens();
}

// classes

class ramenImg {
  constructor(ramenObj) {
    this.image = document.createElement('img');
    this.image.id = `ramen-${ramenObj.id}`;
    this.image.className = 'menu-image';
    this.image.title = `${ramenObj.name} (${ramenObj.restaurant}) :: ${ramenObj.rating}/10`;
    this.image.src = ramenObj.image;
    this.image.addEventListener('click', event => handleClick(event));
  }
  render() {
    return this.image;
  }
}

class submitRamen {
  constructor() {
    this.name = document.getElementById('new-name').value;
    this.restaurant = document.getElementById('new-restaurant').value;
    this.image = document.getElementById('new-image').value;
    this.rating = document.getElementById('new-rating').value;
    this.comment = document.getElementById('new-comment').value;
  }
}

// admin functions

function addSubmitListener() {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', event => handleSubmit(event))
}

function handleDisplay(ramenData) {
  let bestRated;

  for (const ramen of ramenData) {
    if (!bestRated || ramen.rating > bestRated.rating) bestRated = ramen;
    appendImagesToMenu(ramen);
  }

  detailUpdate(bestRated);
}

function handleSubmit(event) {
  event.preventDefault();
  appendImagesToMenu(new submitRamen());
  event.target.reset();
}

function appendImagesToMenu(ramenObj) {
  const ramenMenu = document.getElementById('ramen-menu');
  ramenMenu.appendChild(new ramenImg(ramenObj).render());
}

function detailUpdate(ramenObj) {

  // assign values for the selected option to the corresponding DOM elements

  document.querySelector('img.detail-image').src = ramenObj.image;
  document.querySelector('h2.name').innerText = ramenObj.name;
  document.querySelector('h3.restaurant').innerText = ramenObj.restaurant;
  document.getElementById('rating-display').innerText = ramenObj.rating;
  document.getElementById('comment-display').innerText = ramenObj.comment;
}

// server interaction functions

function displayRamens() {
  fetch(apiAddr)
    .then(res => res.json())
    .then(ramenData => handleDisplay(ramenData))
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
