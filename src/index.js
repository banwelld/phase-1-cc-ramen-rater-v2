// global variables

const apiAddr = 'http://localhost:3000/ramens';
let idCount;

// main function

function main() {
  addSubmitListener();
  displayRamens();
}

// callback functions

const handleClick = event => {
  const ramen = {...event.target.dataset, image: event.target.src};
  detailUpdate(ramen);
}

const handleSubmit = event => {
  event.preventDefault();
  const ramen = new MenuItem(newRamenData()).render()
  appendToMenu(ramen);
  event.target.reset();
}

// admin functions

function addSubmitListener() {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', handleSubmit)
}

function handleInitialDisplay(serverData) {
  idCount = serverData.length;
  serverData.forEach(ramen => appendToMenu(new MenuItem(ramen).render()));
  detailUpdate(serverData[0]);
}

function appendToMenu(ramen) {
  const ramenMenu = document.getElementById('ramen-menu');
  ramenMenu.append(ramen);
}

function detailUpdate(ramen) {
  document.querySelector('img.detail-image').src = ramen.image;
  document.querySelector('h2.name').innerText = ramen.name;
  document.querySelector('h3.restaurant').innerText = ramen.restaurant;
  document.getElementById('rating-display').innerText = String(ramen.rating);
  document.getElementById('comment-display').innerText = ramen.comment;
}

function newRamenData() {
  const inputNodes = document.querySelectorAll('#new-ramen input:not([type="submit"]), #new-ramen textarea');
  const formData = new FormDataObj(inputNodes);
  formData.id = idCount + 1;
  idCount++;
  return formData;
}

// server interaction functions

function displayRamens() {
  fetch(apiAddr)
    .then(res => res.json())
    .then(data => handleInitialDisplay(data))
}

function getRamenDetail(id) {
  fetch(`${apiAddr}/${id}`)
  .then(res => res.json())
  .then(ramenData => detailUpdate(ramenData))
}

// classes

class MenuItem {
  constructor(data) {
    this.item = document.createElement('img');
    this.item.src = data.image;
    const {image: _, ...datasetObj} = data;
    for (const key in datasetObj) this.item.dataset[key] = datasetObj[key];
    this.item.addEventListener('click', handleClick)
  }
  render() {
    return this.item;
  }
}

class FormDataObj {
  constructor(formData) {
    Array.from(formData).forEach(element => this[element.id.substring(4)] = element.value)
  }
}

document.addEventListener('DOMContentLoaded', main);

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
