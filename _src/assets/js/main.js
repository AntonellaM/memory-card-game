'use strict';

const selectEl = document.querySelector('.cards__select');
const cardsSectionEl = document.querySelector('.cards');

if (localStorage.numberOfCards) {
  selectEl.value = localStorage.getItem('numberOfCards');
  getCards(selectEl.value);
}

function rotateCard(event) {
  const image = event.currentTarget.querySelector('.card__image');
  const defaultImage = event.currentTarget.querySelector('.card__image--default');
  if (image.classList.contains('hide')) {
    image.classList.remove('hide');
    image.parentElement.setAttribute('data-state', 'opened');
    defaultImage.classList.add('hide');
  } else {
    image.classList.add('hide');
    image.parentElement.setAttribute('data-state', 'closed');
    defaultImage.classList.remove('hide');
  }
}

function findCards() {
  const cardsFlipped = document.querySelectorAll(`div[data-state="opened"]`);
  return cardsFlipped;
}

function removeDataState(element) {
  element.setAttribute('data-state', 'closed');
}
  
function flipCardsBack(firstElement, secondElement) {
  firstElement.firstChild.classList.add('hide');
  firstElement.firstChild.nextElementSibling.classList.remove('hide');
  secondElement.firstChild.classList.add('hide');
  secondElement.firstChild.nextElementSibling.classList.remove('hide');
}
  
function letCardsUp(element) {
  element.querySelector('.card__image').classList.remove('hide');
}

function cardClickHandler(event) {
  rotateCard(event);
  const cardsFlipped = findCards();

  if (cardsFlipped.length === 2) {
    if (cardsFlipped[0].dataset.pair !== cardsFlipped[1].dataset.pair) {
      cardsFlipped.forEach(removeDataState);
      setTimeout(flipCardsBack, 1500, cardsFlipped[0], cardsFlipped[1]);

    } else {
      cardsFlipped.forEach(removeDataState);
      cardsFlipped.forEach(letCardsUp);
      cardsFlipped[0].removeEventListener('click', cardClickHandler);
      cardsFlipped[1].removeEventListener('click', cardClickHandler);
    }
  }
}

function createCard(object) {
  const cardEl = document.createElement('div');
  const imageEl = document.createElement('img');
  const imageDefaultEl = document.createElement('img');

  cardEl.classList.add('card');
  cardEl.setAttribute('data-pair', `${object.pair}`);
  cardEl.setAttribute('data-state', 'closed');

  imageEl.classList.add('card__image');
  imageEl.classList.add('hide');
  imageEl.setAttribute('style', `background-image: url(${object.image})`);

  imageDefaultEl.classList.add('card__image--default');
  imageDefaultEl.setAttribute('style', `background-image: url(https://via.placeholder.com/160x195/30d9c4/ffffff/?text=ADALAB)`);

  cardsSectionEl.appendChild(cardEl);
  cardEl.appendChild(imageEl);
  cardEl.appendChild(imageDefaultEl);

  return cardEl;
}

function getCards(number) {
  fetch(`https://raw.githubusercontent.com/Adalab/cards-data/master/${number}.json`)
    .then(response => response.json())
    .then(function (data) {
      cardsSectionEl.innerHTML = '';
      for (const element of data) {
        const card = createCard(element);
        card.addEventListener('click', cardClickHandler);   
      }
    });
}

function getSelectValue(event) {
  getCards(event.currentTarget.value);
  localStorage.setItem('numberOfCards', event.currentTarget.value);
}

selectEl.addEventListener('click', getSelectValue);