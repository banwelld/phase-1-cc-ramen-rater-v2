// GLOBAL VARIABLES

const serverUrl = 'http://localhost:3000/ramens';
let idCount;

// CALLBACK FUNCTIONS

// menu item click
const handleClick = event => {
  const ramenData = event.target.dataset;
  const ramenImgUrl = event.target.src;
  const ramen = {...ramenData, image: ramenImgUrl};
  handleAllDetails(ramen);
}

const handleSubmitNew = event => {
  event.preventDefault();
  const ramen = new FormDataObj(event.target.id);
  const ramenElement = new MenuElement(ramen).render();
  pushNewRamen(ramen);
  appendToMenu(ramenElement);
  event.target.reset();
}

const handleSubmitEdit = event => {
  event.preventDefault();
  const edits = new FormDataObj(event.target.id);
  pushEdits(edits);
  handleEdits(edits);
  event.target.reset();
}

// ADMIN FUNCTIONS

function addSubmitListener() {
  const newForm = document.getElementById('new-ramen');
  newForm.addEventListener('submit', handleSubmitNew);

  const editForm = document.getElementById('edit-ramen');
  editForm.addEventListener('submit', handleSubmitEdit);
}

function handleInitialDisplay(serverData) {
  idCount = serverData.length;
  serverData.forEach(ramen => appendToMenu(new MenuElement(ramen).render()));
  handleAllDetails(serverData[0]);
}

function appendToMenu(ramenElement) {
  const ramenMenu = document.getElementById('ramen-menu');
  ramenMenu.append(ramenElement);
}

function handleAllDetails(ramen) {
  updateRamenDetails(ramen);
  updateRatingDetails(ramen);
}

function handleEdits(edits) {
  updateRatingDetails(edits);
  updateMenuItemDetails(edits);
}

function updateRamenDetails({id, name, restaurant, image}) {
  const ramenImg = document.querySelector('img.detail-image');
  const imgDesc = `${name} :: ${restaurant}`;
  ramenImg.src = image;
  ramenImg.alt = imgDesc;
  ramenImg.title = imgDesc;
  ramenImg.dataset.id = id;
  document.querySelector('h2.name').innerText = name;
  document.querySelector('h3.restaurant').innerText = restaurant;
}

function updateRatingDetails({rating, comment}) {
  document.getElementById('rating-display').innerText = rating;
  document.getElementById('comment-display').innerText = comment;
}

function updateMenuItemDetails({rating, comment}) {
  const ramenId = document.querySelector('img.detail-image').dataset.id;
  const menuItem = document.querySelector(`[data-id="${ramenId}"]`);
  menuItem.dataset.rating = rating;
  menuItem.dataset.comment = comment;
}

const ensureDataType = string => isNaN(Number(string)) ? string : Number(string);

// SERVER INTERACTION FUNCTIONS

function displayRamens() {
  fetch(serverUrl)
    .then(res => {
      if (!res.ok) {
      throw new Error('Server response not OK: ', res.statusText);
      } else {
      return res.json();
      }
    })
    .then(res => handleInitialDisplay(res))
    .catch(error => console.log('Error in GET operation: ', error))
}

function pushNewRamen(ramenData) {
  const serverData = new ServerObj('POST', ramenData);
  fetch(serverUrl, serverData)
    .then(res => {
      if (!res.ok) {
       throw new Error('Server response not OK: ', res.statusText);
      } else {
      return res.json();
      }
    })
    .then(res => console.log('Success! ', res))
    .catch(error => console.log('Error in POST operation: ', error))
}

function pushEdits(ramenData) {
  const serverData = new ServerObj('PATCH', ramenData);
  fetch(`${serverUrl}/${ramenData.id}`, serverData)
    .then(res => {
      if (!res.ok) {
      throw new Error('Server response not OK: ', res.statusText);
      } else {
      return res.json();
      }
    })
    .then(res => console.log('Success! ', res))
    .catch(error => console.log('Error in PATCH operation: ', error))
}

// CLASSES

class MenuElement {
  constructor(ramen) {
    const imgDesc = `${ramen.name} :: ${ramen.restaurant}`;
    this.item = document.createElement('img');
    this.item.src = ramen.image;
    this.item.alt = imgDesc;
    this.item.title = imgDesc;

    // declare variable datasetObj and populate with all ramen data except for image
    const {image: _, ...datasetObj} = ramen;

    for (const key in datasetObj) this.item.dataset[key] = datasetObj[key];
    this.item.addEventListener('click', handleClick)
  }
  render() {
    return this.item;
  }
}

class FormDataObj {
  constructor(formId) {
    const nodeList = document.querySelectorAll(`#${formId} input:not([type="submit"]), #${formId} textarea`);
    Array.from(nodeList).forEach(element => this[element.id.substring(4)] = ensureDataType(element.value));

    // append id to objects with less than 5 keys (edits)
    if (Object.keys(this).length < 5) this.id = document.querySelector('#ramen-detail img').dataset.id;
  }
}

class ServerObj {
  constructor(method, ramenData) {
    this.method = method;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.body = JSON.stringify(ramenData);
  }
}

// INITIALIZATION FUNCTION

function main() {
  addSubmitListener();
  displayRamens();
}

// INITIALIZATION EVENT LISTENER

document.addEventListener('DOMContentLoaded', main);

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
