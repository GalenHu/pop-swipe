"use strict";

let tinderContainer = document.querySelector(".tinder");
let allCards = document.querySelectorAll(".tinder--card");
let nope = document.getElementById("nope");
let love = document.getElementById("love");

const createCard = (name, description, imgSrc) => {
  const waifuCard = document.createElement("div");
  waifuCard.classList.add("tinder--card");

  const waifuImage = document.createElement("img");
  waifuImage.src = imgSrc;

  const waifuName = document.createElement("h3");
  waifuName.innerText = name;

  const waifuDesc = document.createElement("p");
  waifuDesc.innerHTML = description;

  waifuCard.appendChild(waifuImage);
  waifuCard.appendChild(waifuName);
  waifuCard.appendChild(waifuDesc);

  return waifuCard;
};

const tinderCards = document.getElementById("tinderCards");
for (let index = 0; index < 5; index++) {
  const url =
    "https://s4.anilist.co/file/anilistcdn/character/large/b121635-x3rT0I5xKaDu.png";
  const waifuCard = createCard("Kawaii nee-san", "she coot tho", url);
  tinderCards.appendChild(waifuCard);
}

/* <div class="tinder--card">
<img src="https://placeimg.com/600/300/people">
<h3>Demo card 1</h3>
<p>This is a demo for Tinder like swipe cards</p>
</div> */

function initCards(card, index) {
  let newCards = document.querySelectorAll(".tinder--card:not(.removed)");

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform =
      "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add("loaded");
}

allCards = document.querySelectorAll(".tinder--card");
initCards();

allCards.forEach(function (el) {
  let hammertime = new Hammer(el);

  hammertime.on("pan", function (event) {
    el.classList.add("moving");
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);
    tinderContainer.classList.toggle("tinder_nope", event.deltaX < 0);

    let xMulti = event.deltaX * 0.03;
    let yMulti = event.deltaY / 80;
    let rotate = xMulti * yMulti;

    event.target.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
  });

  hammertime.on("panend", function (event) {
    el.classList.remove("moving");
    tinderContainer.classList.remove("tinder_love");
    tinderContainer.classList.remove("tinder_nope");

    let moveOutWidth = document.body.clientWidth;
    let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle("removed", !keep);

    if (keep) {
      event.target.style.transform = "";
    } else {
      let endX = Math.max(
        Math.abs(event.velocityX) * moveOutWidth,
        moveOutWidth
      );
      let toX = event.deltaX > 0 ? endX : -endX;
      let endY = Math.abs(event.velocityY) * moveOutWidth;
      let toY = event.deltaY > 0 ? endY : -endY;
      toY += event.deltaY;
      let xMulti = event.deltaX * 0.03;
      let yMulti = event.deltaY / 80;
      let rotate = xMulti * yMulti;

      event.target.style.transform = `translate(${toX}px, ${toY}px) rotate(${rotate}deg)`;
      initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {
    let cards = document.querySelectorAll(".tinder--card:not(.removed)");
    let moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    let card = cards[0];

    card.classList.add("removed");

    if (love) {
      card.style.transform =
        "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
    } else {
      card.style.transform =
        "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
    }

    initCards();

    event.preventDefault();
  };
}

const nopeListener = createButtonListener(false);
const loveListener = createButtonListener(true);

nope.addEventListener("click", nopeListener);
love.addEventListener("click", loveListener);
