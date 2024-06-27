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

// admin functions

function addSubmitListener() {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', event => handleClick(event))
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
    .then(ramenData => {
      let bestRated;
      for (const ramen of ramenData) {
        if (!bestRated || ramen.rating > bestRated.rating) bestRated = ramen;
        appendImagesToMenu(ramen);
      }
      detailUpdate(bestRated);
    })
}

// callback functions

const handleClick = (ramen) => {
  // Add code
}

document.addEventListener('DOMContentLoaded', main());

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
