import { APP_VERSION } from "../properties.js";
import { MAPS } from "./maps.data.js";
import { CHARACTERS } from "./characters.data.js";
import { getUser, getUserSetting, setStorage, setUser, removeStorage } from "./storage.js";
import { requestWakeLock } from "./wakelock.js";

// UTILS

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function timestampToDateTimeObj(timestamp) {
  // Convertir le timestamp en objet Date
  const dateObj = new Date(timestamp);

  // Extraire les composants de la date
  const year = dateObj.getFullYear();
  // Les mois sont indexés à partir de 0, donc on ajoute 1 pour obtenir le mois correct
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Pour obtenir le format 'MM'
  const day = ('0' + dateObj.getDate()).slice(-2); // Pour obtenir le format 'DD'

  // Extraire les composants de l'heure
  const hours = ('0' + dateObj.getHours()).slice(-2); // Pour obtenir le format 'HH'
  const minutes = ('0' + dateObj.getMinutes()).slice(-2); // Pour obtenir le format 'mm'

  // Construire l'objet avec la date et l'heure formatées
  const dateTimeObj = {
      date: `${day}-${month}-${year.toString()[2]}${year.toString()[3]}`,
      hour: `${hours}:${minutes}`
  };

  return dateTimeObj;
}

/* ========================================================================= */
/* ============================== CONSTANTES =============================== */
/* ========================================================================= */
// Lettres des lignes de la grille
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

const minFishMovement = 16;
const maxFishMovement = 64;

let appVersionClicks = 0;

/* ========================================================================= */
/* ============================ Génération DOM ============================= */
/* ========================================================================= */

/* ############################### Home page ############################### */

const renderHomeTemplate = () => {
  let user = getUser();
  document.getElementById('main').innerHTML = `
  <div id="topArea" class="top-area">
    <span style="width: 90px;"></span>
    <span>la Grand' Pêche</span>
    <button id="settingsButton" style="width: 90px;" onclick="onSettingsClick()"><img src="./medias/images/icons/gear-solid.svg" /></button>
  </div>
    <div id="screenArea" class="screen-area home-screen">
      <div id="homeButtonsArea" class="home-buttons-area">
        <button id="playButton" class="home-screen-button" onclick="onPlayClick()">jouer</button>
        <button id="recordsButton" class="home-screen-button" onclick="onRecordsClick()" ${user.catches.length == 0 ? 'disabled' : ''}>records</button>
        <button id="cabinButton" onclick="onCabinClick()"></button>
      </div>
    </div>
    <div id="buttonsArea" class="buttons-area home-screen">
    </div>
    <span id="versionNumber" style="margin-top: auto; margin-bottom: 2svh; transition: opacity .5s linear;" onclick="onAppVersionClick()">v ${APP_VERSION}</span>
  `;
}

const onAppVersionClick = () => {
  appVersionClicks ++;
  console.log(appVersionClicks);

  if (appVersionClicks == 5) {
    appVersionClicks = 0;
    removeStorage();
    window.location = window.location;
  }
}
window.onAppVersionClick = onAppVersionClick;

const openAppCinematic = (isAppOpening) => {
  let user = getUser();
  renderHomeTemplate();

  if (isAppOpening) {
    document.getElementById('cabinButton').setAttribute('disabled', true);
    document.getElementById('topArea').style.opacity = 0;
    document.getElementById('playButton').style.opacity = 0;
    document.getElementById('cabinButton').style.opacity = 0;
    document.getElementById('recordsButton').style.opacity = 0;
    document.getElementById('screenArea').style.opacity = 0;
    document.getElementById('buttonsArea').style.opacity = 0;
    document.getElementById('versionNumber').style.opacity = 0;
  }
  
  if (isAppOpening) {
    document.getElementById('main').style.opacity = 1;
  } else {
    setTimeout(() => {
      document.getElementById('main').style.opacity = 1;
    }, 500);
  }

  if (isAppOpening) {
    setTimeout(() => {
      document.getElementById('screenArea').style.opacity = 1;
      document.getElementById('buttonsArea').style.opacity = 1;
      setTimeout(() => {
        document.getElementById('topArea').style.opacity = 1;
        setTimeout(() => { 
          document.getElementById('playButton').style.opacity = 1;
          setTimeout(() => { 
            document.getElementById('recordsButton').style.opacity = user.catches.length != 0 ? 1 : .5;
            setTimeout(() => {
              document.getElementById('versionNumber').style.opacity = 1;
              document.getElementById('cabinButton').removeAttribute('disabled');
              document.getElementById('cabinButton').style.opacity = 1;
              // Futur bouton paramètres
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }
  
}

const fromHomeToMap = (map) => {
  document.getElementById('main').style.opacity = 0;
  setTimeout(() => {
    if (map != undefined) {
      defineMap(map);
    } else {
      defineCabin();
    }
    setTimeout(() => {
      document.getElementById('main').style.opacity = 1;
    }, 500);
  }, 500);
}

const fromMapToHome = (map) => {
  document.getElementById('main').style.opacity = 0;
  setTimeout(() => {
    openAppCinematic();
    if (map == 'cabin') {
      //
    } else {
      mapMusic.pause();
      mapBackgroundSound.pause();
      menuMusic.currentTime = 0;
    }
  }, 500);
}

const defineCabin = () => {
  document.getElementById('versionNumber').remove();

  document.getElementById('screenArea').innerHTML = '';
  document.getElementById('screenArea').classList.remove('home-screen');
  document.getElementById('screenArea').style.backgroundImage = `url('./medias/images/maps/cabin/cabin-100.gif')`;

  document.getElementById('topArea').innerHTML = `
    <button id="homeButton" onclick="onHomeClick(true)">accueil</button>
    <span>la cabane de<br>M.Wade</span>
    <span class="vivier-button"></span>
  `;

  let user = getUser();

  //console.log(user.catches.length);
  
  document.getElementById('screenArea').innerHTML = `
  <div id="cabinPopup" class="cabin-popup">
  <span>personnage</span>
    <div class="character-selector">
      <div class="character-line">
        <button id="char0" onclick="onCharacterClick(0)" class="character-button ${user.currentCharacter == 0 ? 'selected' : ''}"><img src="./medias/images/characters/fm-front.png" /><span>Louis</span></button>
        <button id="char1" onclick="onCharacterClick(1)" class="character-button ${user.currentCharacter == 1 ? 'selected' : ''}"><img src="./medias/images/characters/fw-front.png" /><span>Sophie</span></button>
      </div>
      <div class="character-line ${user.catches.length >= 100 ? '' : ` disabled d-100`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 200 ? '' : ` disabled d-200`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 300 ? '' : ` disabled d-300`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 400  ? '' : ` disabled d-400`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 500 ? '' : ` disabled d-500`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 600 ? '' : ` disabled d-600`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 700 ? '' : ` disabled d-700`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 800 ? '' : ` disabled d-800`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 900 ? '' : ` disabled d-900`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /></button>
        <button id="char3" onclick="onCharacterClick(3)" class="character-button ${user.currentCharacter == 3 ? 'selected' : ''}" disabled><img src="./medias/images/characters/sa-front.png" /></button>
      </div>
      <div class="character-line ${user.catches.length >= 1000 ? '' : ` disabled d-1000`}">
        <button id="char2" onclick="onCharacterClick(2)" class="character-button ${user.currentCharacter == 2 ? 'selected' : ''}" disabled><img src="./medias/images/characters/ch-front.png" /><span>M. Wade</span></button>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    document.getElementById('cabinPopup').style.opacity = 1;
  }, 1000);
}

const defineMap = (map) => {
  //menuMusic.currentTime = 0;
  menuMusic.pause();
  mapMusic = new Audio(`./medias/music/${currentMap.id}.mp3`);
  mapMusic.loop = true;
  mapMusic.addEventListener("canplaythrough", (event) => {
    if (getUserSetting('mapsMusic').isActive) {
      mapMusic.play();
      mapMusic.volume = .25;
    }
  });
  if (getUserSetting('soundEffects').isActive) {
    mapBackgroundSound = new Audio(`./medias/sounds/calm-water.mp3`);
    mapBackgroundSound.play();
    mapBackgroundSound.loop = true;
  }
  renderBlankTemplate();
  currentMap = map;
  currentPlayerLineLetterIndex = currentMap.spawnLine - 1;
  currentPlayerColumn = currentMap.spawnColumn;
  renderCurrentMap();
  setPlayerSpawn();
  MAP_FISHES = [];
  let rndCell = getRandomSwimmableCellCoordinates();
  generateFish(rndCell.letterIndex, rndCell.column);
  generateFishRandomlyXTimes();
}

/* ############################### Map page ############################### */

const onVivierFishDetailsCloseClick = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  onClosePopupClick();
  onVivierClick();
}
window.onVivierFishDetailsCloseClick = onVivierFishDetailsCloseClick;

const onVivierFishCardClick = (fishId) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }

  let user = getUser();
  let fish = getFishById(fishId);

  let hasBeenCaught = false;
  let bestNotation = 0;
  let bestCatch = '';

  user.catches.forEach(caughtFish => {
    //console.log(caughtFish.fishId);
    if (fish.id == caughtFish.fishId && caughtFish.mapId == currentMap.id) {
      //console.log('has been caught');
      hasBeenCaught = true;
      if (caughtFish.notation == 0 && bestNotation == 0) {
        bestNotation = caughtFish.notation;
        bestCatch = caughtFish;
      }
      if (caughtFish.notation > bestNotation) {
        bestNotation = caughtFish.notation;
        bestCatch = caughtFish;
      }
    }
  });

  const imgSrc = fish.img == '' ? `./medias/images/no-picture.png` : `./medias/images/maps/${fish.img}.png`;

  let popup = document.getElementById('popup');
  popup.innerHTML = `
    <div class="popup-top">
      <span>vivier</span>
      <button class="close-popup-button" onclick="onVivierFishDetailsCloseClick('')">X</button>
    </div>

    <div class="record-fish-card ${hasBeenCaught ? '' : 'uncaught'}">
      <img src="${imgSrc}" />
      <div class="fish-informations">
        <span>${fish.commonName}</span>
        <span><i>${fish.scientificName}</i></span>
      </div>
    ${hasBeenCaught ?  `
      <span class="best-catch-title">
        meilleure prise
      </span>
      <div class="notation-images">${getNotationImages(bestCatch.notation)}</div>
      <div class="date-informations">
          <span>Le ${timestampToDateTimeObj(bestCatch.timestamp).date}</span><span> à ${timestampToDateTimeObj(bestCatch.timestamp).hour}</span>
        </div>
      <div class="fish-records">
        <span>${getFormattedLength(bestCatch.fishLength)}</span> - <span>${getFormattedMass(bestCatch.fishMass)}</span>
      </div>` : ''}
    </div>`;
}
window.onVivierFishCardClick = onVivierFishCardClick;

/* ================================ Top part ================================ */
const renderVivierFishCard = (fish) => {
  let user = getUser();
  let hasBeenCaught = false;
  let bestNotation = 0;

  user.catches.forEach(caughtFish => {
    //console.log(caughtFish.fishId);
    if (fish.id == caughtFish.fishId && caughtFish.mapId == currentMap.id) {
      //console.log('has been caught');
      hasBeenCaught = true;
      if (caughtFish.notation > bestNotation) {
        bestNotation = caughtFish.notation;
      }
    }
  });

  const imgSrc = fish.img == '' ? `./medias/images/no-picture.png` : `./medias/images/maps/${fish.img}.png`;
  return `
    <button class="vivier-fish-card ${hasBeenCaught ? '' : 'uncaught'}" onclick="onVivierFishCardClick('${fish.id}')">
      <img src="${imgSrc}" />
      <div>
        <span>${fish.commonName}</span>
        <span><i>${fish.scientificName}</i></span>
        </div>
        ${hasBeenCaught ?  `<div class="notation-area small">${getNotationImages(bestNotation)}</div>` : ''}
    </button>
  `;
}
/* <span>de ${fish.minLength}cm à ${fish.maxLength}cm</span>
        <span>de ${fish.minMass}g à ${fish.maxMass}g</span> */

const renderMapVivier = () => {
  let txt = '';
  currentMap.fishes.forEach(fish => {
    txt += renderVivierFishCard(fish);
  });
  return `
    <div class="map-vivier">
      ${txt}
    </div>
  `;
}

/* =============================== Cellules =============================== */

const renderScreenCell = (currentScreenLine, currentColumnNumber) => {
  return `
    <div id="${currentScreenLine}${currentColumnNumber}" class="screen-cell" onclick="onCellClick('${currentScreenLine}${currentColumnNumber}')")>
      <span class="cell-name">${currentScreenLine}${currentColumnNumber}</span>
    </div>
  `;
}

const renderScreenLineCells = (currentScreenLine) => {
  let  txt = '';
  for (let index = 1; index < 17; index++) {
    txt += `${renderScreenCell(currentScreenLine, index)}`;
  }
  return txt;
}

const renderScreenLine = (currentScreenLine) => {
  return `
    <div id="line${currentScreenLine}" class="screen-line">
      ${renderScreenLineCells(currentScreenLine)}
    </div>
  `;
}

const renderScreenLines = () => {
  let  txt = '';
  for (let index = 0; index < letters.length; index++) {
    txt += `${renderScreenLine(letters[index])}`;
  }
  return txt;
}

const setTouchEventCross = () => {
  let stillNeedToMove = true;

  // LEFT ------------------
  const crossLeft = document.getElementById('crossLeft');
  let leftTouchEventIntervalId = '';

  crossLeft.addEventListener('touchstart', (event) => {
    event.preventDefault();
    stillNeedToMove = true;
    crossLeft.classList.add('pressed');

    movePlayer('left');

    setTimeout(() => {
      if (stillNeedToMove) {
        leftTouchEventIntervalId = setInterval(() => {
          movePlayer('left');
        }, 100);
      }
    }, 50);
  });

  crossLeft.addEventListener('touchend', (event) => {
    event.preventDefault();
    stillNeedToMove = false;
    clearInterval(leftTouchEventIntervalId);
    crossLeft.classList.remove('pressed');
  });

  // UP ------------------
  const crossUp = document.getElementById('crossUp');
  let upTouchEventIntervalId = '';

  crossUp.addEventListener('touchstart', (event) => {
    event.preventDefault();
    stillNeedToMove = true;
    crossUp.classList.add('pressed');

    movePlayer('up');

    setTimeout(() => {
      if (stillNeedToMove) {
        upTouchEventIntervalId = setInterval(() => {
          movePlayer('up');
        }, 100);
      }
    }, 50);
  });

  crossUp.addEventListener('touchend', (event) => {
    event.preventDefault();
    stillNeedToMove = false;
    clearInterval(upTouchEventIntervalId);
    crossUp.classList.remove('pressed');
  });

  // RIGHT ------------------
  const crossRight = document.getElementById('crossRight');
  let rightTouchEventIntervalId = '';

  crossRight.addEventListener('touchstart', (event) => {
    event.preventDefault();
    stillNeedToMove = true;
    crossRight.classList.add('pressed');

    movePlayer('right');

    setTimeout(() => {
      if (stillNeedToMove) {
        rightTouchEventIntervalId = setInterval(() => {
          movePlayer('right');
        }, 100);
      }
    }, 50);
  });

  crossRight.addEventListener('touchend', (event) => {
    event.preventDefault();
    stillNeedToMove = false;
    clearInterval(rightTouchEventIntervalId);
    crossRight.classList.remove('pressed');
  });

  // RIGHT ------------------
  const crossDown = document.getElementById('crossDown');
  let downTouchEventIntervalId = '';

  crossDown.addEventListener('touchstart', (event) => {
    event.preventDefault();
    stillNeedToMove = true;
    crossDown.classList.add('pressed');

    movePlayer('down');

    setTimeout(() => {
      if (stillNeedToMove) {
        downTouchEventIntervalId = setInterval(() => {
          movePlayer('down');
        }, 100);
      }
    }, 50);
  });

  crossDown.addEventListener('touchend', (event) => {
    event.preventDefault();
    stillNeedToMove = false;
    clearInterval(downTouchEventIntervalId);
    crossDown.classList.remove('pressed');
  });
}

// Render de la grille
const renderBlankTemplate = () => {
  document.getElementById('main').innerHTML = `
  <div id="topArea" class="top-area"></div>
    <div id="screenArea" class="screen-area">
      <div id="player" class="player"></div>
      <div id="over" class="over"></div>
      ${renderScreenLines()}
    </div>
    <div id="buttonsArea" class="buttons-area">
      ${getCrossContainer()}
      ${getHistoryContainer()}
    </div>
  `;
  setTouchEventCross();
}

const getCrossContainer = () => {
  return `
    <div class="cross-container">
      <button id="crossLeft" class="cross-button left" onclick="movePlayer('left')"></button>
      <button id="crossUp" class="cross-button up" onclick="movePlayer('up')"></button>
      <button id="crossRight" class="cross-button right" onclick="movePlayer('right')"></button>
      <button id="crossDown" class="cross-button down" onclick="movePlayer('down')"></button>
    </div>`;
}

const getHistoryContainer = () => {
  return `
    <div class="history-container">
      <span class="title"><span>session</span><span>${currentMapCatches.length}</span></span>
      <div class="history-data">
        ${getHistoryFishCards()}
      </div>
    </div>`;
}

const getHistoryFishCard = (fish) => {
  const completeFish = getFishById(fish.id);
  const imgSrc = completeFish.img == '' ? `./medias/images/no-picture.png` : `./medias/images/maps/${completeFish.img}.png`;
  return `
    <div class="history-fish-card">
      <img src="${imgSrc}" />
      ${fish.isNew ? `<span class="blinking-text">nouveau</span>` : fish.isRecord ? `<span class="blinking-text">record</span>` : ''}
      <div class="notation-area small">${getNotationImages(fish.notation)}</div>
    </div>
  `;
}

const getHistoryFishCards = () => {
  let str = '';
  currentMapCatches.toReversed().forEach(fish => {
    str += getHistoryFishCard(fish);
  });
  return str
}

/* =============================== Map =============================== */

const renderCurrentMap = () => {
  document.getElementById('topArea').innerHTML = `
    <button id="homeButton" onclick="onHomeClick()">accueil</button>
    <span>${currentMap.name}</span>
    <button id="vivierButton" class="vivier-button" onclick="onVivierClick()">vivier</button>`;

  document.getElementById('screenArea').style.backgroundImage = `url('./medias/images/maps/${currentMap.id}/${currentMap.img}.webp')`;
  if (currentMap.imgOver != undefined) {
    document.getElementById('over').style.backgroundImage = `url('./medias/images/maps/${currentMap.id}/${currentMap.imgOver}.webp')`;
  }
  currentMap.walkableCells.forEach(cell => {
    document.getElementById(cell).classList.add('walkable');
  });
  currentMap.swimmableCells.forEach(cell => {
    document.getElementById(cell).classList.add('swimmable');
  });
}

/* =============================== Player =============================== */

const getCurrentPlayerSprites = () => {
  return {
    front: `./medias/images/characters/${currentCharacterId}-front.png`,
    frontRightFoot: `./medias/images/characters/${currentCharacterId}-front-rf.png`,
    frontLeftFoot: `./medias/images/characters/${currentCharacterId}-front-lf.png`,
    back: `./medias/images/characters/${currentCharacterId}-back.png`,
    backRightFoot: `./medias/images/characters/${currentCharacterId}-back-rf.png`,
    backLeftFoot: `./medias/images/characters/${currentCharacterId}-back-lf.png`,
    left: `./medias/images/characters/${currentCharacterId}-left.png`,
    leftMoving: `./medias/images/characters/${currentCharacterId}-left-moving.png`,
    right: `./medias/images/characters/${currentCharacterId}-right.png`,
    rightMoving: `./medias/images/characters/${currentCharacterId}-right-moving.png`,
  }
}

const setPlayerAvailableCell = (cell) => {
  if (cell != null) {
    if (cell.classList.contains('swimmable')) {
      cell.classList.add('selectable');
    } else {
      cell.classList.add('unselectable');
    }
  }
}

const setPlayerAvailableCells = () => {
  // Canne à pêche 1

  let leftCellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 1}`;
  let upCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn}`;
  let rightCellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 1}`;
  let downCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn}`;

  setPlayerAvailableCell(document.getElementById(leftCellId));
  setPlayerAvailableCell(document.getElementById(upCellId));
  setPlayerAvailableCell(document.getElementById(rightCellId));
  setPlayerAvailableCell(document.getElementById(downCellId));

  if (currentRod == 2 || currentRod == 3) {
    // Canne à pêche 2
  
    let left2CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 2}`;
    let leftUpCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn - 1}`;
    let up2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn}`;
    let upRightCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn + 1}`;
    let right2CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 2}`;
    let rightDownCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn + 1}`;
    let down2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn}`;
    let downLeftCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn - 1}`;

    setPlayerAvailableCell(document.getElementById(left2CellId));
    setPlayerAvailableCell(document.getElementById(leftUpCellId));
    setPlayerAvailableCell(document.getElementById(up2CellId));
    setPlayerAvailableCell(document.getElementById(upRightCellId));
    setPlayerAvailableCell(document.getElementById(right2CellId));
    setPlayerAvailableCell(document.getElementById(rightDownCellId));
    setPlayerAvailableCell(document.getElementById(down2CellId));
    setPlayerAvailableCell(document.getElementById(downLeftCellId));

    if (currentRod == 3) {
      // Canne à pêche 3
    
      let left3CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 3}`;
      let left2Up1CellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn - 2}`;
      //let left2Up2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn - 2}`;
      let left1Up2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn - 1}`;
      let up3CellId = `${letters[currentPlayerLineLetterIndex - 3]}${currentPlayerColumn}`;
      let up2Right1CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn + 1}`;
      //let up2Right2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn + 2}`;
      let up1Right2CellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn + 2}`;
      let right3CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 3}`;
      let right2Down1CellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn + 2}`;
      //let right2Down2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn + 2}`;
      let right1Down2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn + 1}`;
      let down3CellId = `${letters[currentPlayerLineLetterIndex + 3]}${currentPlayerColumn}`;
      let down2Left1CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn - 1}`;
     // let down2Left2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn - 2}`;
      let down1Left2CellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn - 2}`;
  
      setPlayerAvailableCell(document.getElementById(left3CellId));
      setPlayerAvailableCell(document.getElementById(left2Up1CellId));
      //setPlayerAvailableCell(document.getElementById(left2Up2CellId));
      setPlayerAvailableCell(document.getElementById(left1Up2CellId));
      setPlayerAvailableCell(document.getElementById(up3CellId));
      setPlayerAvailableCell(document.getElementById(up2Right1CellId));
      //setPlayerAvailableCell(document.getElementById(up2Right2CellId));
      setPlayerAvailableCell(document.getElementById(up1Right2CellId));
      setPlayerAvailableCell(document.getElementById(right3CellId));
      setPlayerAvailableCell(document.getElementById(right2Down1CellId));
      //setPlayerAvailableCell(document.getElementById(right2Down2CellId));
      setPlayerAvailableCell(document.getElementById(right1Down2CellId));
      setPlayerAvailableCell(document.getElementById(down3CellId));
      setPlayerAvailableCell(document.getElementById(down2Left1CellId));
      //setPlayerAvailableCell(document.getElementById(down2Left2CellId));
      setPlayerAvailableCell(document.getElementById(down1Left2CellId));
    }
  }
}

const setPlayerSpawn = () => {
  const PLAYER = document.getElementById('player');
  PLAYER.style.backgroundImage = `url(${currentCharacter.front})`;
  PLAYER.style.top = `calc(${currentPlayerLineLetterIndex} * var(--cell-size))`;
  PLAYER.style.left = `calc(${currentPlayerColumn - 1} * var(--cell-size))`;

  setPlayerAvailableCells();
};

const clearPlayerAvailableCell = (cell) => {
  if (cell != null) {
    cell.classList.remove('selectable');
    cell.classList.remove('unselectable');
    cell.classList.remove('selected');
    cell.classList.remove('touched');
  }
}

const clearPlayerAvailableCells = () => {
  let leftCellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 1}`;
  let upCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn}`;
  let rightCellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 1}`;
  let downCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn}`;

  clearPlayerAvailableCell(document.getElementById(leftCellId));
  clearPlayerAvailableCell(document.getElementById(upCellId));
  clearPlayerAvailableCell(document.getElementById(rightCellId));
  clearPlayerAvailableCell(document.getElementById(downCellId));

  if (currentRod == 2 || currentRod == 3) {
    // Canne à pêche 2
  
    let left2CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 2}`;
    let leftUpCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn - 1}`;
    let up2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn}`;
    let upRightCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn + 1}`;
    let right2CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 2}`;
    let rightDownCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn + 1}`;
    let down2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn}`;
    let downLeftCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn - 1}`;

    clearPlayerAvailableCell(document.getElementById(left2CellId));
    clearPlayerAvailableCell(document.getElementById(leftUpCellId));
    clearPlayerAvailableCell(document.getElementById(up2CellId));
    clearPlayerAvailableCell(document.getElementById(upRightCellId));
    clearPlayerAvailableCell(document.getElementById(right2CellId));
    clearPlayerAvailableCell(document.getElementById(rightDownCellId));
    clearPlayerAvailableCell(document.getElementById(down2CellId));
    clearPlayerAvailableCell(document.getElementById(downLeftCellId));

    if (currentRod == 3) {
      // Canne à pêche 3
    
      let left3CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 3}`;
      let left2Up1CellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn - 2}`;
      //let left2Up2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn - 2}`;
      let left1Up2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn - 1}`;
      let up3CellId = `${letters[currentPlayerLineLetterIndex - 3]}${currentPlayerColumn}`;
      let up2Right1CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn + 1}`;
      //let up2Right2CellId = `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn + 2}`;
      let up1Right2CellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn + 2}`;
      let right3CellId = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 3}`;
      let right2Down1CellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn + 2}`;
      //let right2Down2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn + 2}`;
      let right1Down2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn + 1}`;
      let down3CellId = `${letters[currentPlayerLineLetterIndex + 3]}${currentPlayerColumn}`;
      let down2Left1CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn - 1}`;
      //let down2Left2CellId = `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn - 2}`;
      let down1Left2CellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn - 2}`;
  
      clearPlayerAvailableCell(document.getElementById(left3CellId));
      clearPlayerAvailableCell(document.getElementById(left2Up1CellId));
      //clearPlayerAvailableCell(document.getElementById(left2Up2CellId));
      clearPlayerAvailableCell(document.getElementById(left1Up2CellId));
      clearPlayerAvailableCell(document.getElementById(up3CellId));
      clearPlayerAvailableCell(document.getElementById(up2Right1CellId));
      //clearPlayerAvailableCell(document.getElementById(up2Right2CellId));
      clearPlayerAvailableCell(document.getElementById(up1Right2CellId));
      clearPlayerAvailableCell(document.getElementById(right3CellId));
      clearPlayerAvailableCell(document.getElementById(right2Down1CellId));
      //clearPlayerAvailableCell(document.getElementById(right2Down2CellId));
      clearPlayerAvailableCell(document.getElementById(right1Down2CellId));
      clearPlayerAvailableCell(document.getElementById(down3CellId));
      clearPlayerAvailableCell(document.getElementById(down2Left1CellId));
      //clearPlayerAvailableCell(document.getElementById(down2Left2CellId));
      clearPlayerAvailableCell(document.getElementById(down1Left2CellId));
    }
  }
}

const applyCharacterImgFromSelectedCell = (cellId) => {
  const PLAYER = document.getElementById('player');

  if ( // LEFT ---------------------------------------------
    cellId == `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 1}` ||
    cellId == `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 2}` ||
    cellId == `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 3}` ||
    cellId == `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn - 2}` ||
    cellId == `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn - 2}` 
  ) {
    PLAYER.style.backgroundImage = `url(${currentCharacter.left})`;
  } else if (
    cellId == `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn}` ||
    cellId == `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn}` ||
    cellId == `${letters[currentPlayerLineLetterIndex - 3]}${currentPlayerColumn}` ||
    cellId == `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn - 1}` ||
    cellId == `${letters[currentPlayerLineLetterIndex - 2]}${currentPlayerColumn + 1}` 
  ) {
    PLAYER.style.backgroundImage = `url(${currentCharacter.back})`;
  } else if (
    cellId == `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 1}` ||
    cellId == `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 2}` ||
    cellId == `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 3}` ||
    cellId == `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn + 2}` ||
    cellId == `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn + 2}` 
  ) {
    PLAYER.style.backgroundImage = `url(${currentCharacter.right})`;
  } else if (
    cellId == `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn}` ||
    cellId == `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn}` ||
    cellId == `${letters[currentPlayerLineLetterIndex + 3]}${currentPlayerColumn}` ||
    cellId == `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn + 1}` ||
    cellId == `${letters[currentPlayerLineLetterIndex + 2]}${currentPlayerColumn - 1}` 
  ) {
    PLAYER.style.backgroundImage = `url(${currentCharacter.front})`;
  } else {
    /* leftUpCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn - 1}`;
    upRightCellId = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn + 1}`;
    rightDownCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn + 1}`;
    downLeftCellId = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn - 1}`; */
  }
}

/* =============================== Fish =============================== */

const getRandomSwimmableCellCoordinates = () => {
  let rndCell = currentMap.swimmableCells[randomIntFromInterval(0, currentMap.swimmableCells.length - 1)];
  const letter = rndCell.charAt(0);
  let column = rndCell.substring(1);
  let letterIndex = letters.indexOf(letter);
  return {letterIndex: letterIndex, column: column};
}

const moveFish = (fish, direction) => {

  const checkSelected = (nextCell, FISH) => {
    if (document.getElementById(nextCell).classList.contains('selected')) {
      document.getElementById(nextCell).classList.replace('selected', 'touched');
      fishBiteSound.play();

      clearInterval(fish.intervalId);
      FISH.style.opacity = 1;

      document.getElementById('buttonsArea').innerHTML = ``;

      setTimeout(() => {
        FISH.style.opacity = 0;
        FISH.remove();
        launchBattle(FISH);
      }, 500);
    }
  }
  
  if (!fish.isMoving) {
    fish.isMoving = true;
    const FISH = document.getElementById(`${fish.id}`);
    if (direction == 'left') {
      FISH.style.backgroundImage = `url(${fishImages.left})`;
      if (Number(fish.currentColumn) != 1) {
        let nextCell = `${letters[fish.currentLineLetterIndex]}${Number(fish.currentColumn) - 1}`;
        if (document.getElementById(nextCell).classList.contains('swimmable')) {
          fish.currentColumn = Number(fish.currentColumn) - 1;
          FISH.style.left = `calc(${fish.currentColumn - 1} * var(--cell-size))`;
          checkSelected(nextCell, FISH);
        }
      }
    } else if (direction == 'up') {
      FISH.style.backgroundImage = `url(${fishImages.back})`;
      if (Number(fish.currentLineLetterIndex) != 0) {
        // calcul prochaine cellule
        let nextCell = `${letters[Number(fish.currentLineLetterIndex) - 1]}${fish.currentColumn}`;
        if (document.getElementById(nextCell).classList.contains('swimmable')) {
          fish.currentLineLetterIndex = Number(fish.currentLineLetterIndex) - 1;
          FISH.style.top = `calc(${fish.currentLineLetterIndex} * var(--cell-size))`;
          checkSelected(nextCell, FISH);
        }
      }
    } else if (direction == 'right') {
      FISH.style.backgroundImage = `url(${fishImages.right})`;
      if (Number(fish.currentColumn) != 16) {
        let nextCell = `${letters[fish.currentLineLetterIndex]}${Number(fish.currentColumn) + 1}`;
        if (document.getElementById(nextCell).classList.contains('swimmable')) {    
          fish.currentColumn = Number(fish.currentColumn) + 1;
          FISH.style.left = `calc(${fish.currentColumn - 1} * var(--cell-size))`;
          checkSelected(nextCell, FISH);
        }
      }
    } else if (direction == 'down') {
      FISH.style.backgroundImage = `url(${fishImages.front})`;
      if (Number(fish.currentLineLetterIndex) != 15) {
        let nextCell = `${letters[Number(fish.currentLineLetterIndex) + 1]}${fish.currentColumn}`;
        if (document.getElementById(nextCell).classList.contains('swimmable')) {
          fish.currentLineLetterIndex = Number(fish.currentLineLetterIndex) + 1;
          FISH.style.top = `calc(${fish.currentLineLetterIndex} * var(--cell-size))`;
          checkSelected(nextCell, FISH);
        }
      }
    }
    
    setTimeout(() => {
      fish.isMoving = false;
    }, 200);
  }
};

const randomlyMoveFish = (fish) => {
  let direction = '';
  let rnd = Math.random();

  // AVEC PAUSE
  if (rnd < 0.2) {
    direction = 'left';
  } else if (rnd <= 0.4) {
    direction = 'up';
  } else if (rnd <= 0.6) {
    direction = 'right';
  } else if (rnd <= 0.8) {
    direction = 'down';
  } else {
    direction = 'none';
  }

  // SANS PAUSE
  /* if (rnd < 0.25) {
    direction = 'left';
  } else if (rnd <= 0.5) {
    direction = 'up';
  } else if (rnd <= 0.75) {
    direction = 'right';
  } else {
    direction = 'down';
  } */

  if (direction != 'none') {
    moveFish(fish, direction);
  }
}

const moveFishRandomlyXTimes = (fish, interval, repetitions) => {
  let compteur = 0;
  fish.intervalId = setInterval(() => {
      if (compteur >= repetitions) {
          clearInterval(fish.intervalId);
          document.getElementById(fish.id).remove();
      } else {
          randomlyMoveFish(fish);
          compteur++;
      }
  }, interval);
}

const generateFish = (letterIndex, column) => {
  fishes += 1;
  let fish = {
    id: `fish${fishes}`,
    isMoving: false,
    currentLineLetterIndex: letterIndex,
    currentColumn: column,
    intervalId: '',
  };
  
  document.getElementById('screenArea').innerHTML += `<div id="${fish.id}" class="fish"></div>`;
  
  const FISH = document.getElementById(`${fish.id}`);
  FISH.style.top = `calc(${fish.currentLineLetterIndex} * var(--cell-size))`;
  FISH.style.left = `calc(${fish.currentColumn - 1} * var(--cell-size))`;

  MAP_FISHES.push(fish);
  moveFishRandomlyXTimes(MAP_FISHES[MAP_FISHES.length - 1], 1000, randomIntFromInterval(minFishMovement, maxFishMovement));
}

const generateFishRandomlyXTimes = () => {
  fishGeneration = setInterval(() => {
    let rndCell = getRandomSwimmableCellCoordinates();
    generateFish(rndCell.letterIndex, rndCell.column);
  }, (randomIntFromInterval(7, 14) * 1000)); // POSSIBLE FIX ICI
}

/* =============================== Battle =============================== */

// Génération de poisson aléatoire ---------------------------

const getRandomMapFishType = () => {
  return currentMap.fishes[randomIntFromInterval(0, currentMap.fishes.length - 1)];
};

const getRandomIndividual = (fishType) => {
  let induvidualLength = randomIntFromInterval(fishType.minLength, fishType.maxLength);

  // Définir une relation linéaire entre taille et masse
  const slope = (fishType.maxMass - fishType.minMass) / (fishType.maxLength - fishType.minLength);
  const intercept = fishType.minMass - slope * fishType.minLength;

  // Calculer la masse attendue basée sur la taille
  const expectedMass = slope * induvidualLength + intercept;

  // Ajouter une variabilité à la masse (ici on utilise une variabilité de ±10% de la masse attendue)
  const variability = 0.1; // 10%
  const minMassWithVariability = expectedMass * (1 - variability);
  const maxMassWithVariability = expectedMass * (1 + variability);

  let induvidualMass = randomIntFromInterval(
    Math.max(fishType.minMass, Math.floor(minMassWithVariability)),
    Math.min(fishType.maxMass, Math.ceil(maxMassWithVariability))
  );
  // ----------------

  let lengthPercentage = ((induvidualLength - fishType.minLength) / (fishType.maxLength - fishType.minLength)) * 100;
  let massPercentage = ((induvidualMass - fishType.minMass) / (fishType.maxMass - fishType.minMass)) * 100;

  let lengthNotation = lengthPercentage < 25 ? 0 : lengthPercentage <= 50 ? 1 : lengthPercentage <= 75 ? 2 : 3;
  let massNotation = massPercentage < 25 ? 0 : massPercentage <= 50 ? 1 : massPercentage <= 75 ? 2 : 3;

  let individualNotation = Math.ceil((lengthNotation + massNotation) / 2);

  return {
    id: fishType.id,
    length: induvidualLength,
    mass: induvidualMass,
    notation: individualNotation,
  }
}

const getMapById = (id) => {
  return MAPS.filter((map) => map.id == id)[0];
}

const getFishById = (id) => {
  return currentMap.fishes.filter((fish) => fish.id == id)[0];
}

const getBestCaughtFishInfos = (fishId) => {
  let bestLength = 0;
  let bestMass = 0;
  let user = getUser();

  user.catches.forEach(caughtFish => {
    if (caughtFish.fishId == fishId) {
      if (caughtFish.fishLength > bestLength) {
        bestLength = caughtFish.fishLength;
      }
      if (caughtFish.fishMass > bestMass) {
        bestMass = caughtFish.fishMass;
      }
    }
  });

  return {
    bestLength: bestLength,
    bestMass: bestMass,
  }
}

const getFormattedLength = (rawLength) => {
  let unit = 'cm';
  let length = 0;
  if (rawLength >= 100) {
    unit = 'm';
    length = rawLength / 100;
  } else {
    length = rawLength;
  }
  return `${length} ${unit}`;
}

const getFormattedMass = (rawMass) => {
  let unit = 'g';
  let mass = 0;
  if (rawMass >= 1000000) {
    unit = 't';
    mass = (rawMass / 1000000).toFixed(1);
  } else if (rawMass >= 1000) {
    unit = 'kg';
    mass = (rawMass / 1000).toFixed(2);
  } else {
    mass = rawMass;
  }
  return `${mass} ${unit}`;
}

const getIndividualFishCard = (individualFish, isBestLength, isBestMass, hasAlreadyBeenCaught) => {
  const baseFish = getFishById(individualFish.id);
  const imgSrc = baseFish.img == '' ? `./medias/images/no-picture.png` : `./medias/images/maps/${baseFish.img}.png`;

  return `
    <div class="fish-card">
      ${!hasAlreadyBeenCaught ? `<div class="blinking-text">nouveau</div>` : ''}
      <div class="fish-card-bloc fish-name">
        <span>${baseFish.commonName}</span>
        <span><i>${baseFish.scientificName}</i></span>
      </div>
      <img class="fish-card-img" style="" src="${imgSrc}" />
      <div class="fish-card-bloc">
        <span><span>Taille : ${getFormattedLength(individualFish.length)}</span>${isBestLength && hasAlreadyBeenCaught ? `<span class="blinking-text">record</span>` : ''}</span>
        <span><span>Poids : ${getFormattedMass(individualFish.mass)}</span>${isBestMass && hasAlreadyBeenCaught ? `<span class="blinking-text">record</span>` : ''}</span>
        <div class="notation-area">${getNotationImages(individualFish.notation)}</div>
      </div>
    </div>
  `;
}

const getNotationImages = (notation) => {
  return `
    <img src="${notation > 0 ? './medias/images/icons/star-solid.svg' : './medias/images/icons/star-regular.svg'}" class="${notation > 0 ? 'turned-on' : 'turned-off'}" />
    <img src="${notation > 1 ? './medias/images/icons/star-solid.svg' : './medias/images/icons/star-regular.svg'}" class="${notation > 1 ? 'turned-on' : 'turned-off'}" />
    <img src="${notation > 2 ? './medias/images/icons/star-solid.svg' : './medias/images/icons/star-regular.svg'}" class="${notation > 2 ? 'turned-on' : 'turned-off'}" />
  `;
}

// Battle -------------------------

const launchBattle = () => {
  document.getElementById('vivierButton').setAttribute('disabled', true);
  if (getUserSetting('soundEffects').isActive) {
    rewindRodSound.currentTime = 0;
    rewindRodSound.play();
  }
  isSelected = false;
  clearPlayerAvailableCells();

  document.getElementById('buttonsArea').innerHTML = '';

  // récupération message aléatoire
  const battleMessages = [
    `combat intense en cours !`,
    `remontée en progression...`,
    `ça avance, on lâche rien !`,
    `lutte acharnée en cours !`,
    `on s'accroche, ça tire fort !`,
    `la prise est amorcée !`,
    `ligne tendue, effort constant...`,
    `on tire, encore un peu !`,
    `la bataille est lancée !`,
  ];

  let previousPopup = document.getElementById('popup');
  if (previousPopup != null) {
    previousPopup.remove();
  }

  document.getElementById('main').innerHTML += `
    <div id="popup" class="popup">
      <span>${battleMessages[randomIntFromInterval(0, battleMessages.length - 1)]}</span>
      <div class="progress-container"><div id="progressBar" class="progress-bar"></div></div>
    </div>
  `;

  setTimeout(() => {
    rewindRodSound.pause();
    let rnd = Math.random();
    let justCompletedTheMap = false;
    
    if (rnd > 0.75) { // Bataille foirée --------------------------------------
      if (getUserSetting('soundEffects').isActive) {
        failedBattleSound.play();
      }
      // récupération message aléatoire
      const failMessages = [
        `zut !<br>le poisson s'est enfui...`,
        `mince alors !<br>le poisson a réussi à s'échapper...`,
        `ah, pas de chance !<br>le poisson a filé...`,
        `oh non !<br>le poisson a réussi à s'échapper...`,
        `raté !<br>le poisson s'est libéré...`,
        `oups !<br>le poisson a pris la fuite...`,
        `dommage !<br>le poisson est parti...`,
        `ah, c'est manqué !<br>le poisson a disparu...`,
        `pas cette fois !<br>le poisson s'est échappé...`,
        `tant pis !<br>le poisson a réussi à s'enfuir...`,
        `@#&%$!<br>le poisson a réussi à filer...`,
      ];
      document.getElementById('popup').innerHTML = ``;
      document.getElementById('popup').innerHTML = `
        <span>${failMessages[randomIntFromInterval(0, failMessages.length - 1)]}</span>
      `;
    } else { // Bataille gagnée -----------------------------------------------
      // récupération message aléatoire
      
      const INDIVIDUAL = getRandomIndividual(getRandomMapFishType());

      const previousBest = getBestCaughtFishInfos(INDIVIDUAL.id);
      const isBestLength = INDIVIDUAL.length > previousBest.bestLength;
      const isBestMass = INDIVIDUAL.mass > previousBest.bestMass;

      const hasAlreadyBeenCaught = hasFishAlreadyBeenCaught(INDIVIDUAL.id);

      const hasRecord = !hasAlreadyBeenCaught || isBestLength || isBestMass;

      if (getUserSetting('soundEffects').isActive) {
        if (hasRecord) {
          recordBattleSound.play();
        } else {
          wonBattleSound.play();
        }
      }

      const winMessages = [
        `félicitations !`,
        `bravo !`,
        `bien joué !`,
        `super !`,
        `excellent !`,
        `chapeau !`,
        `magnifique !`,
        `génial !`,
        `impressionnant !`,
        `splendide !`,
        `fantastique !`,
        `incroyable !`,
        `épatant !`,
        `admirable !`,
        `remarquable !`,
        `sensationnel !`,
      ];
      document.getElementById('popup').innerHTML = ``;
      document.getElementById('popup').innerHTML = `
        <span>
          ${hasRecord ? `${winMessages[randomIntFromInterval(0, winMessages.length - 1)]}<br>` : ''}
          vous avez attrapé :
        </span>
        ${getIndividualFishCard(INDIVIDUAL, isBestLength, isBestMass, hasAlreadyBeenCaught)}
      `;

      const STORAGE_INDIVIDUAL = {
        mapId: currentMap.id,
        fishId: INDIVIDUAL.id,
        fishLength: INDIVIDUAL.length,
        fishMass: INDIVIDUAL.mass,
        notation: INDIVIDUAL.notation,
        timestamp: Date.now()
      }

      let user = getUser();
      user.catches.push(STORAGE_INDIVIDUAL);
      setUser(user);

      let mapCatch = {
        id: INDIVIDUAL.id,
        notation: INDIVIDUAL.notation,
        isNew: !hasAlreadyBeenCaught,
        isRecord: isBestLength || isBestMass
      }
      currentMapCatches.push(mapCatch);
      //console.table(currentMapCatches);

      if (!isMapCompleted(currentMap.id) && haveAllMapFishesHaveBeenCaught(currentMap.id)) {
        console.log('Map completed !!)');
        let user = getUser();
        user.completedMaps.push(currentMap.id);
        setUser(user);
        justCompletedTheMap = true;
      }

    }
    setPlayerAvailableCells();
    document.getElementById('buttonsArea').innerHTML = `<button class="continue-button" onclick="${justCompletedTheMap ? `setCompletedMapPopup('${currentMap.id}')` : `continueFishing()`}">continuer</button>`;
  }, 3500);
}

/* ========================================================================= */
/* ======================= Interactions utilisateur ======================== */
/* ========================================================================= */


/* =============================== Home page =============================== */

const onPlayClick = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  document.getElementById('main').innerHTML += `
    <div id="popup" class="popup home-screen">
      <div class="popup-top">
        <span>destination</span>
        <button class="close-popup-button" onclick="onClosePopupClick()">X</button>
      </div>
      <div class="map-selector">

        <div class="map-group-separator">
          <div class="separator-part"></div>
          <div>campagne</div>
          <div class="separator-part"></div>
        </div>

        <button class="map-group-container deb" onclick="onMapGroupClick('débutant')">
          <span class="title">débutant</span>${isMapCompleted('01-04') ? `<div class="badge check"></div>` : ''}
        </button>

        <button class="map-group-container int" onclick="onMapGroupClick('intermédiaire')" ${isMapCompleted('01-04') ? '' : 'disabled'}>
          <span class="title">intermédiaire</span>${isMapCompleted('02-04') ? `<div class="badge check"></div>` : ''}
        </button>

        <button class="map-group-container ava" onclick="onMapGroupClick('avancé')" ${isMapCompleted('02-04') ? '' : 'disabled'}>
          <span class="title">avancé</span>${isMapCompleted('03-04') ? `<div class="badge check"></div>` : ''}
        </button>

        <button class="map-group-container exp" onclick="onMapGroupClick('expert')" ${isMapCompleted('03-04') ? '' : 'disabled'}>
          <span class="title">expert</span>${isMapCompleted('04-04') ? `<div class="badge check"></div>` : ''}
        </button>

        <!-- ------------------------------------- MAPS BONUS ------------------------------------- -->

        ${isMapCompleted('04-04') ? `
          <div class="map-group-separator">
            <div class="separator-part"></div>
            <div>bonus</div>
            <div class="separator-part"></div>
          </div>

          <div class="map-line">
            <button class="map-button  ${isMapCompleted('05-01') ? `completed` : ''}" onclick="onMapButtonClick(16)">
              <img src="./medias/images/maps/05-01/05-01-fix.webp" />
              <span>la cabane de<br>M. Wade</span>
            </button>
            <button class="map-button ${isMapCompleted('05-02') ? `completed` : ''}" onclick="onMapButtonClick(17)">
              <img src="./medias/images/maps/05-02/05-02-fix.webp" />
              <span>les temps<br>anciens</span>
            </button>
          </div>` : ''}

        <!-- ------------------------------------- EXTENSIONS ------------------------------------- -->
        <div class="map-group-separator">
          <div class="separator-part"></div>
          <div>extensions</div>
          <div class="separator-part"></div>
        </div>

        <div class="map-line">
          <button class="map-button ${isMapCompleted('ext-01') ? `completed` : ''}" onclick="onMapButtonClick(18)">
            <img src="./medias/images/maps/ext-01/ext-01-fix.webp" />
            <span>mer rouge</span>
          </button>
          <button class="map-button ${isMapCompleted('ext-02') ? `completed` : ''}" onclick="onMapButtonClick(19)">
            <img src="./medias/images/maps/ext-02/ext-02-fix.webp" />
            <span>japon</span>
          </button>
        </div>

      </div>
    </div>
  `;
}
window.onPlayClick = onPlayClick;

const onMapGroupCloseClick = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  onClosePopupClick();
  onPlayClick();
}
window.onMapGroupCloseClick = onMapGroupCloseClick;

const getMapGroupMapSelector = (groupName) => {
  switch (groupName) {
    case 'débutant': return `
      <div class="map-line">
        <button class="map-button ${isMapCompleted('01-01') ? `completed` : ''}" onclick="onMapButtonClick(0)">
          <img src="./medias/images/maps/01-01/01-01-fix.webp" />
          <span>europe</span>
        </button>
        <button class="map-button ${isMapCompleted('01-02') ? `completed` : ''}" onclick="onMapButtonClick(1)"
          ${isMapCompleted('01-01')
            ? `>
              <img src="./medias/images/maps/01-02/01-02-fix.webp" />
              <span>amérique<br>du nord</span>
            ` 
            : `disabled>
              <img src="./medias/images/maps/01-02/01-02-fix.webp" />
              <span>???</span>
            `
          }
        </button>
      </div>

      <div class="map-line">
        <button class="map-button ${isMapCompleted('01-03') ? `completed` : ''}" onclick="onMapButtonClick(2)"
          ${isMapCompleted('01-02')
            ? `>
              <img src="./medias/images/maps/01-03/01-03-fix.webp" />
              <span>côte<br>méditerranéenne</span>
            ` 
            : `disabled>
              <img src="./medias/images/maps/01-03/01-03-fix.webp" />
              <span>???</span>
            `
          }
        </button>
        <button class="map-button ${isMapCompleted('01-04') ? `completed` : ''}" onclick="onMapButtonClick(3)"
        ${isMapCompleted('01-03')
          ? `>
            <img src="./medias/images/maps/01-04/01-04-fix.webp" />
            <span>grande barrière<br>de corail</span>
          ` 
          : `disabled>
            <img src="./medias/images/maps/01-04/01-04-fix.webp" />
            <span>???</span>
          `
        }
        </button>
      </div>`;

  case 'intermédiaire': return `
    <div class="map-line">
      <button class="map-button ${isMapCompleted('02-01') ? `completed` : ''}" onclick="onMapButtonClick(4)"
      ${isMapCompleted('01-04')
        ? `>
          <img src="./medias/images/maps/02-01/02-01-fix.webp" />
          <span>lac tanganyiaka</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/02-01/02-01-fix.webp" />
          <span>???</span>
        `
      }
      </button>
      <button class="map-button ${isMapCompleted('02-02') ? `completed` : ''}" onclick="onMapButtonClick(5)"
      ${isMapCompleted('02-01')
        ? `>
          <img src="./medias/images/maps/02-02/02-02-fix.webp" />
          <span>caraïbes</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/02-02/02-02-fix.webp" />
          <span>???</span>
        `
      }
      </button>
    </div>

    <div class="map-line">
      <button class="map-button ${isMapCompleted('02-03') ? `completed` : ''}" onclick="onMapButtonClick(6)"
      ${isMapCompleted('02-02')
        ? `>
          <img src="./medias/images/maps/02-03/02-03-fix.webp" />
          <span>rio paranà</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/02-03/02-03-fix.webp" />
          <span>???</span>
        `
      }
      </button>
      <button class="map-button ${isMapCompleted('02-04') ? `completed` : ''}" onclick="onMapButtonClick(7)"
      ${isMapCompleted('02-03') 
        ? `>
          <img src="./medias/images/maps/02-04/02-04-fix.webp" />
          <span>lac baïkal</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/02-04/02-04-fix.webp" />
          <span>???</span>
        `
      }
      </button>
    </div>`;

  case 'avancé': return `
    <div class="map-line">
      <button class="map-button ${isMapCompleted('03-01') ? `completed` : ''}" onclick="onMapButtonClick(8)"
      ${isMapCompleted('02-04')
        ? `>
          <img src="./medias/images/maps/03-01/03-01-fix.webp" />
          <span>océan<br>pacifique sud</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/03-01/03-01-fix.webp" />
          <span>???</span>
        `
      }
      </button>
      <button class="map-button ${isMapCompleted('03-02') ? `completed` : ''}" onclick="onMapButtonClick(9)"
      ${isMapCompleted('03-01')
        ? `>
          <img src="./medias/images/maps/03-02/03-02-fix.webp" />
          <span>congo</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/03-02/03-02-fix.webp" />
          <span>???</span>
        `
      }
      </button>
    </div>

    <div class="map-line">
      <button class="map-button ${isMapCompleted('03-03') ? `completed` : ''}" onclick="onMapButtonClick(10)"
      ${isMapCompleted('03-02')
        ? `>
          <img src="./medias/images/maps/03-03/03-03-fix.webp" />
          <span>océan indien</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/03-03/03-03-fix.webp" />
          <span>???</span>
        `
      }
      </button>
      <button class="map-button ${isMapCompleted('03-04') ? `completed` : ''}" onclick="onMapButtonClick(11)"
      ${isMapCompleted('03-03')
        ? `>
          <img src="./medias/images/maps/03-04/03-04-fix.webp" />
          <span>amazone</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/03-04/03-04-fix.webp" />
          <span>???</span>
        `
      }
      </button>
    </div>`;
  
  case 'expert': return `
    <div class="map-line">
      <button class="map-button ${isMapCompleted('04-01') ? `completed` : ''}" onclick="onMapButtonClick(12)"
      ${isMapCompleted('03-04')
        ? `>
          <img src="./medias/images/maps/04-01/04-01-fix.webp" />
          <span>océan<br>atlantique nord</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/04-01/04-01-fix.webp" />
          <span>???</span>
        `
      }
      </button>
      <button class="map-button ${isMapCompleted('04-02') ? `completed` : ''}" onclick="onMapButtonClick(13)"
      ${isMapCompleted('04-01') ? `>
          <img src="./medias/images/maps/04-02/04-02-fix.webp" />
          <span>mekong</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/04-02/04-02-fix.webp" />
          <span>???</span>
        `
      }
      </button>
    </div>

    <div class="map-line">
      <button class="map-button ${isMapCompleted('04-03') ? `completed` : ''}" onclick="onMapButtonClick(14)"
      ${isMapCompleted('04-02')
        ? `>
          <img src="./medias/images/maps/04-03/04-03-fix.webp" />
          <span>océan austral</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/04-03/04-03-fix.webp" />
          <span>???</span>
        `
      }
      </button>
      <button class="map-button ${isMapCompleted('04-04') ? `completed` : ''}" onclick="onMapButtonClick(15)"
      ${isMapCompleted('04-03')
        ? `>
          <img src="./medias/images/maps/04-04/04-04-fix.webp" />
          <span>fosse des<br>mariannes</span>
        ` 
        : `disabled>
          <img src="./medias/images/maps/04-04/04-04-fix.webp" />
          <span>???</span>
        `
      }
      </button>
    </div>`; 
    default: return ``;
  }
}

const onMapGroupClick = (groupName) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  onClosePopupClick();
  document.getElementById('main').innerHTML += `
    <div id="popup" class="popup home-screen">
      <div class="popup-top">
        <span>${groupName}</span>
        <button class="close-popup-button" onclick="onMapGroupCloseClick()">X</button>
      </div>
      <div class="map-selector">
        ${getMapGroupMapSelector(groupName)}
      </div>
    </div>
  `;
}
window.onMapGroupClick = onMapGroupClick;

const onSettingsClick = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  document.getElementById('main').innerHTML += `
    <div id="popup" class="popup home-screen">
      <div class="popup-top">
        <span>paramètres</span>
        <button class="close-popup-button" onclick="onClosePopupClick()">X</button>
      </div>
      <div class="settings-display">
        ${renderSettings()}
      </div>
    </div>
  `;
}
window.onSettingsClick = onSettingsClick;

const onCharacterClick = (characterIndex) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  let user = getUser();
  
  document.getElementById(`char${user.currentCharacter}`).classList.remove('selected');
  document.getElementById(`char${characterIndex}`).classList.add('selected');
  
  user.currentCharacter = characterIndex;
  setUser(user);

  currentCharacterId = CHARACTERS[characterIndex];
  currentCharacter = getCurrentPlayerSprites();
}
window.onCharacterClick = onCharacterClick;

const onMapButtonClick = (mapIndex) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  currentMap = MAPS[mapIndex];
  fromHomeToMap(MAPS[mapIndex]);
}
window.onMapButtonClick = onMapButtonClick;

const getRecordFish = (mapId, fishId) => {
  let user = getUser();
  const allFishes = [];
  user.catches.forEach(fish => {
    if (fish.mapId == mapId && fish.fishId == fishId) {
      allFishes.push(fish);
    }
  });
  if (allFishes.length != 0) {
    allFishes.sort((a, b) => {
      if (a.fishMass < b.fishMass)
        return 1;
      if (a.fishMass > b.fishMass )
        return -1;
      return 0;
    });
    return allFishes[0];
  }
  return {
    mapId: '0',
    fishId: '0',
    fishLength: 0,
    fishMass: 0,
    notation: 0,
    timestamp: 0
  }
}

const getMapRecords = (mapId) => {
  const MAP = getMapById(mapId);
  let allFishes = [];
  MAP.fishes.forEach(fish => {
    const recordFish = getRecordFish(mapId, fish.id);
    if (recordFish.fishId != 0) {
      allFishes.push(recordFish);
    }
  });
  if (allFishes.length != 0) {
    //console.log(allFishes.length);
    //console.table(allFishes);
    allFishes.sort((a, b) => {
      if (a.fishMass < b.fishMass)
        return 1;
      if (a.fishMass > b.fishMass )
        return -1;
      return 0;
    });
    //console.table(allFishes);
  }
  return allFishes;
}

const getFishRecordCard = (fish) => {
  const FISH = getFishById(fish.fishId);
  const path = FISH.img == '' ? `./medias/images/no-picture.png` : `./medias/images/maps/${fish.mapId}/fishes/${fish.fishId}.png`;
  const date = timestampToDateTimeObj(fish.timestamp);
  return `
    <div class="record-fish-card">
      <img src="${path}" />
      <div class="fish-informations">
        <span>${getFishById(fish.fishId).commonName}</span>
        <span><i>${getFishById(fish.fishId).scientificName}</i></span>
      </div>
      <div class="fish-records">
      <span>${getFormattedLength(fish.fishLength)}</span>
      <span>${getFormattedMass(fish.fishMass)}</span>
      </div>
      <div class="right-area">
        <div class="notation-images">${getNotationImages(fish.notation)}</div>
        <div class="date-informations">
          <span>${date.date}</span>
          <span>${date.hour}</span>
        </div>
      </div>
    </div>
  `;
}

const getMapRecordCards = (mapId) => {
  const MAP = getMapById(mapId);
  let str = '';
  let str2 = '';
  const mapRecordCatches = getMapRecords(mapId);
  if (mapRecordCatches.length != 0) {
    mapRecordCatches.forEach(fish => {
      str += getFishRecordCard(fish);
    });

    str2 = `
      <div>
        <span>${MAP.name}</span>
        <div class="record-fishes-container">
          ${str}
        </div>
      </div>
    `;
  }
  
  return str2;
}

const getMapsRecordsCards = () => {
  let str = '';
  MAPS.forEach(map => {
    str += getMapRecordCards(map.id);
  });
  return str;
}

const onRecordsClick = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  let user = getUser();
  let firstFish = user.catches[0];
  const date = timestampToDateTimeObj(firstFish.timestamp);
  document.getElementById('main').innerHTML += `
    <div id="popup" class="popup home-screen">
      <div class="popup-top">
        <span>records</span>
        <button class="close-popup-button" onclick="onClosePopupClick()">X</button>
      </div>
      <div class="records-display">
        <div class="total-catches">
          <span>prises totales</span>
          <span>${user.catches.length} poissons attrapés<br>depuis le ${date.date} à ${date.hour}</span>
        </div>
        <span>meilleures prises</span>
        <div class="maps-container">
          ${getMapsRecordsCards()}
        </div>

      </div>
    </div>
  `;
}
window.onRecordsClick = onRecordsClick;

const onCabinClick = () => {
  //console.log('click cabin');
  fromHomeToMap();
}
window.onCabinClick = onCabinClick;

const onClosePopupClick = (popupName) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  if (popupName != 'fishCard') {
    document.getElementById('popup').remove();
  } else {

  }

  if (popupName == 'home' || popupName == 'vivier') {
    document.getElementById('vivierButton').removeAttribute('disabled');
    document.getElementById('homeButton').removeAttribute('disabled');
  }
}
window.onClosePopupClick = onClosePopupClick;

/* =============================== Map page =============================== */

// Top part -----------------------------------------
const onHomeClick = (isFromCabin) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }

  if (isFromCabin == true) {
    leaveMap('cabin');
  } else {
    let previousPopup = document.getElementById('popup');
    if (previousPopup != null) {
      previousPopup.remove();
    }
  
    document.getElementById('vivierButton').setAttribute('disabled', true);
    document.getElementById('homeButton').setAttribute('disabled', true);
  
    document.getElementById('main').innerHTML += `
      <div id="popup" class="popup goto-home">
        <div class="popup-top">
          <span>retour à l'accueil</span>
          <button class="close-popup-button" onclick="onClosePopupClick('home')">X</button>
        </div>
        <div>
          <span>voulez-vous vraiment retourner à l'accueil ?</span>
          <div>
            <button onclick="onClosePopupClick('home')">non</button>
            <button onclick="leaveMap()">oui</button>
          </div>
        </div>
      </div>
    `;
    setTouchEventCross();
  }
}
window.onHomeClick = onHomeClick;

const leaveMap = (map) => {
  isSelected = false;
  MAP_FISHES.forEach(fish => {
    clearInterval(fish.intervalId);
  });
  clearInterval(fishGeneration);
  MAP_FISHES = [];
  currentMapCatches = [];
  fromMapToHome(map);
}
window.leaveMap = leaveMap;

const onVivierClick = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  //console.table(currentMap.fishes);
  document.getElementById('vivierButton').setAttribute('disabled', true);
  document.getElementById('main').innerHTML += `
    <div id="popup" class="popup vivier">
      <div class="popup-top">
        <span>vivier</span>
        <button class="close-popup-button" onclick="onClosePopupClick('vivier')">X</button>
      </div>
      ${renderMapVivier()}
    </div>
  `;
  if (document.getElementById('crossLeft') != null) {
    setTouchEventCross();
  }
}
window.onVivierClick = onVivierClick;

// Screen -------------------------------------------
const movePlayer = (direction) => {
  if (!isPlayerMoving) {
    isPlayerMoving = true;
    const PLAYER = document.getElementById('player');
    clearPlayerAvailableCells();
    if (direction == 'left') {
      PLAYER.style.backgroundImage = `url(${currentCharacter.leftMoving})`;
      setTimeout(() => {
        PLAYER.style.backgroundImage = `url(${currentCharacter.left})`;
      }, 200);
      if (currentPlayerColumn != 1) {
        let nextCell = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn - 1}`;
        if (document.getElementById(nextCell).classList.contains('walkable')) {
          currentPlayerColumn -= 1;
          PLAYER.style.left = `calc(${currentPlayerColumn - 1} * var(--cell-size))`;
        }
      }
    } else if (direction == 'up') {
      if (isOnRightFoot) {
        isOnRightFoot = false;
        PLAYER.style.backgroundImage = `url(${currentCharacter.backLeftFoot})`;
      } else {
        isOnRightFoot = true;
        PLAYER.style.backgroundImage = `url(${currentCharacter.backRightFoot})`;
      }
      setTimeout(() => {
        PLAYER.style.backgroundImage = `url(${currentCharacter.back})`;
      }, 200);
      if (currentPlayerLineLetterIndex != 0) {
        // calcul prochaine cellule
        let nextCell = `${letters[currentPlayerLineLetterIndex - 1]}${currentPlayerColumn}`;
        if (document.getElementById(nextCell).classList.contains('walkable')) {
          currentPlayerLineLetterIndex -= 1;
          PLAYER.style.top = `calc(${currentPlayerLineLetterIndex} * var(--cell-size))`;
        }
      }
    } else if (direction == 'right') {
      PLAYER.style.backgroundImage = `url(${currentCharacter.rightMoving})`;
      setTimeout(() => {
        PLAYER.style.backgroundImage = `url(${currentCharacter.right})`;
      }, 200);
      if (currentPlayerColumn != 16) {
        let nextCell = `${letters[currentPlayerLineLetterIndex]}${currentPlayerColumn + 1}`;
        if (document.getElementById(nextCell).classList.contains('walkable')) {    
          currentPlayerColumn += 1;
          PLAYER.style.left = `calc(${currentPlayerColumn - 1} * var(--cell-size))`;
        }
      }
    } else if (direction == 'down') {
      if (isOnRightFoot) {
        isOnRightFoot = false;
        PLAYER.style.backgroundImage = `url(${currentCharacter.frontLeftFoot})`;
      } else {
        isOnRightFoot = true;
        PLAYER.style.backgroundImage = `url(${currentCharacter.frontRightFoot})`;
      }
      setTimeout(() => {
        PLAYER.style.backgroundImage = `url(${currentCharacter.front})`;
      }, 200);
      if (currentPlayerLineLetterIndex != 15) {
        let nextCell = `${letters[currentPlayerLineLetterIndex + 1]}${currentPlayerColumn}`;
        if (document.getElementById(nextCell).classList.contains('walkable')) {
          currentPlayerLineLetterIndex += 1;
          PLAYER.style.top = `calc(${currentPlayerLineLetterIndex} * var(--cell-size))`;
        }
      }
    }
    
    setTimeout(() => {
      isPlayerMoving = false;
      setPlayerAvailableCells();
    }, 200);
  }
}
window.movePlayer = movePlayer;

const onCellClick = (cellId) => {
  //console.log(cellId);
  const CELL = document.getElementById(cellId);

  if (CELL.classList.contains('selected')) {
    abortFishing(cellId);
    isSelected = false;
  } else if (CELL.classList.contains('selectable')) {
    let previouslySelectedCellArray = document.getElementsByClassName('selected');
    let previouslySelectedCell = previouslySelectedCellArray[0];
    //console.log(previouslySelectedCell);
    if (previouslySelectedCell != undefined) {
      previouslySelectedCell.classList.replace('selected', 'selectable')
    }
    CELL.classList.replace('selectable', 'selected');
    if (getUserSetting('soundEffects').isActive) {
      launchRodSound.play();
    }
    isSelected = true;

    applyCharacterImgFromSelectedCell(cellId);

    document.getElementById('buttonsArea').innerHTML = '';
    document.getElementById('buttonsArea').innerHTML = `<button class="abort-button" onclick="abortFishing('${cellId}')">annuler</button>`;
  }
}
window.onCellClick = onCellClick;

const abortFishing = (cellId) => {
  //console.log(cellId);
  if (isSelected) {
    if (getUserSetting('soundEffects').isActive) {
      cancelFishingSound.play();
    }
    const CELL = document.getElementById(cellId);
    if (CELL.classList.contains('selected')) {
      CELL.classList.replace('selected', 'selectable');
      isSelected = false;
      document.getElementById('buttonsArea').innerHTML = '';
      document.getElementById('buttonsArea').innerHTML = `
      ${getCrossContainer()}
      ${getHistoryContainer()}`;
      setTouchEventCross();
    }
  }
}
window.abortFishing = abortFishing;

const continueFishing = () => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  isSelected = false;
  document.getElementById('buttonsArea').innerHTML = '';
  document.getElementById('buttonsArea').innerHTML = `
    ${getCrossContainer()}
    ${getHistoryContainer()}
  `;
  setPlayerAvailableCells();
  setTouchEventCross();
  document.getElementById('popup').remove();
  document.getElementById('vivierButton').removeAttribute('disabled');
}
window.continueFishing = continueFishing;

const setCompletedMapPopup = (completedMapId, isUnlock) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  let user = getUser();
  console.log(completedMapId);
  let previousPopup = document.getElementById('popup');
  if (previousPopup != null) {
    previousPopup.remove();
  };
  if (completedMapId == '01-04') {
    user.currentRod = 2;
    setUser(user);
    currentRod = 2;
  } else if (completedMapId == '03-04') {
    user.currentRod = 3;
    setUser(user);
    currentRod = 3;
  };
  
  document.getElementById('main').innerHTML += `
  <div id="popup" class="popup">
    <span>félicitations</span>
    <div class="completed-bloc"><span>vous avez attrapé toutes les espèces de poisson disponibles sur cette carte !</span></div>
    ${ completedMapId == '01-04' ? 
      `<div class="completed-bloc"><span>vous avez complété toutes les cartes la catégorie débutants !</span></div>` : ''
    }
    ${ completedMapId == '02-04' ? 
      `<div class="completed-bloc"><span>vous avez complété toutes les cartes la catégorie intermédiaire !</span></div>` : ''
    }
    ${ completedMapId == '03-04' ? 
      `<div class="completed-bloc"><span>vous avez complété toutes les cartes la catégorie avancé !</span></div>` : ''
    }
    ${ completedMapId == '04-04' ? 
      `<div class="completed-bloc"><span>vous avez complété toutes les cartes la catégorie expert !</span></div>`: ''
    }
    ${
      completedMapId == '01-01' || completedMapId == '01-02' || completedMapId == '01-03' ||
      completedMapId == '02-01' || completedMapId == '02-02' || completedMapId == '02-03' ||
      completedMapId == '03-01' || completedMapId == '03-02' || completedMapId == '03-03' ||
      completedMapId == '04-01' || completedMapId == '04-02' || completedMapId == '04-03'
      ? `<div class="completed-bloc"><span>Vous avez déverrouillé la prochaine carte de cette catégorie !</span></div>`
      : ''
    }
  </div>`;
  
  if (completedMapId == '01-04' ||
    completedMapId == '02-04' ||
    completedMapId == '03-04' ||
    completedMapId == '04-04') {
    document.getElementById('buttonsArea').innerHTML = `<button class="continue-button" onclick="setRewardsPopup('${completedMapId}')">récompense(s)</button>`;
  } else {
    document.getElementById('buttonsArea').innerHTML = `<button class="continue-button" onclick="continueFishing()">continuer</button>`;
  }
}
window.setCompletedMapPopup = setCompletedMapPopup;

const setRewardsPopup = (completedMapId) => {
  if (getUserSetting('soundEffects').isActive) {
    buttonClickSound.play();
  }
  console.log(completedMapId);
  let previousPopup = document.getElementById('popup');
  if (previousPopup != null) {
    previousPopup.remove();
  };

  if (completedMapId == '04-04') {
    if (getUserSetting('soundEffects').isActive) {
      finishedGameSound.play();
    }
  }
  
  document.getElementById('main').innerHTML += `
  <div id="popup" class="popup">
    <span>félicitations</span>
    ${ completedMapId == '01-04' 
      ? `<div class="completed-bloc"><span>vous avez déverrouillé la catégorie intermédiaire !</span></div>` : ''
    } ${ completedMapId == '01-04-unlock'
      ? `<div class="completed-bloc">
          <span>vous avez déverrouillé</span>
          <img class="rod-2" src="./medias/images/fishing-rod.png"/>
          <span>la canne à pêche de niveau 2 !</span>
        </div>` : ''
    }

    ${ completedMapId == '02-04' 
      ? `<div class="completed-bloc"><span>vous avez déverrouillé la catégorie avancé !</span></div>` : ''
    } ${ completedMapId == '02-04-unlock' 
      ? `<div class="completed-bloc"><span>vous avez déverrouillé ????? !</span></div>` : ''
    }

    ${ completedMapId == '03-04' 
      ? `<div class="completed-bloc"><span>vous avez déverrouillé la catégorie expert !</span></div>` : ''
    } ${ completedMapId == '03-04-unlock' 
      ? `<div class="completed-bloc">
          <span>vous avez déverrouillé</span>
          <img class="rod-3" src="./medias/images/fishing-rod.png"/>
          <span>la canne à pêche de niveau 3 !</span>
        </div>` : ''
    }

    ${ completedMapId == '04-04'
      ? `
        <div class="completed-bloc"><span>vous avez complété toutes les catégories de la campagne de la Grand' Pêche !</span></div>
        <div class="completed-bloc"><span>vous êtes l'élite de la pêche mondiale !</span></div>` : ''
    } ${ completedMapId == '04-04-unlock' 
      ? `<div class="completed-bloc"><span>vous avez déverrouillé les cartes bonus de la Grand' Pêche !</span></div>` : ''
    }
  </div>`;
  
  if (completedMapId == '01-04' ||
    completedMapId == '02-04' ||
    completedMapId == '03-04' ||
    completedMapId == '04-04') {
    document.getElementById('buttonsArea').innerHTML = `<button class="continue-button" onclick="setRewardsPopup('${completedMapId}-unlock')">continuer</button>`;
  } else {
    document.getElementById('buttonsArea').innerHTML = `<button class="continue-button" onclick="continueFishing()">continuer</button>`;
  }
}
window.setRewardsPopup = setRewardsPopup;

/* ========================================================================= */
/* =============================== SETTINGS ================================ */
/* ========================================================================= */

const renderSettingsGroup = (settingsGroup) => {
  let str = `
  <div id="settingsGroup${settingsGroup.id}" class="settings-group">
      <span class="settings-group-name">${settingsGroup.name}</span>`;

  settingsGroup.settings.forEach(setting => {
      str += `
      <div class="setting-tile">
          <div class="setting-label-area">
              <span class="setting-label">${setting.name}</span>
          </div>
          <div class="setting-switch-area">
              <label class="switch" for="${setting.id}">
                  <input id="${setting.id}" type="checkbox"
                      onclick="handleCheck('${setting.id}')" ${setting.isActive ? "checked" : ""} />
                  <span class="slider round"></span>
              </label>
          </div>    
      </div>`;
  });
  str += `</div>`;
  return str;
}
const renderSettings = () => {
  let user = getUser();
  let str = '';
  user.settings.forEach(settingsGroup => {
    str += renderSettingsGroup(settingsGroup);
  });
  return str;
}

const handleCheck = (id) => {
  let user = getUser();

  user.settings.forEach(settingsGroups => {
      settingsGroups.settings.forEach(setting => {
          if (`${setting.id}`== id) {
              setting.isActive = document.getElementById(id).checked;
              if (setting.id == 'keepScreenAwake') {
                setTimeout(() => {
                  window.location = window.location;
                }, 300); 
              }
              if (setting.id == 'menuMusic') {
                  if (setting.isActive) {
                      if (menuMusic.duration > 0 && !menuMusic.paused) {
                          console.log('Music is aldrady playing');
                      } else {
                          menuMusic.play();
                      }
                  } else {
                      if (menuMusic.duration > 0 && !menuMusic.paused) {
                          menuMusic.pause();
                      }
                  }
              }
              if (setting.id == 'mapsMusic') {
                /* if (setting.isActive) {
                    if (mapMusic.duration > 0 && !mapMusic.paused) {
                        console.log('Music is aldrady playing');
                    } else {
                        mapMusic.play();
                    }
                } else {
                    if (mapMusic.duration > 0 && !mapMusic.paused) {
                        mapMusic.pause();
                    }
                } */
            }
          }
      });
  });

  setUser(user);
};
window.handleCheck = handleCheck;

const sortFishesByScientificName = (fishes) => {
  //console.table(fishes);
  fishes.sort((a, b) => {
    if (a.scientificName < b.scientificName)
      return -1;
    if (a.scientificName > b.scientificName )
        return 1;
    return 0;
  });
  //console.table(fishes);
  return fishes;
}

/* ========================================================================= */
/* =============================== EXECUTION =============================== */
/* ========================================================================= */

setStorage();
if (getUserSetting('keepScreenAwake').isActive) { await requestWakeLock(); }

const USER = getUser();
let map17Fishes = [];
for (let index = 0; index < 16; index++) {
  const map = MAPS[index];
  map.fishes.forEach(fish => {
    map17Fishes.push(fish);
  });
}
MAPS[16].fishes = sortFishesByScientificName(map17Fishes);

MAPS.forEach(map => {
  map.fishes = sortFishesByScientificName(map.fishes);
});
//console.table(MAPS[16].fishes);

let currentMap = MAPS[0];
let currentMapCatches = [];
let currentRod = USER.currentRod;

let isSelected = false;
let fishGeneration = '';

let currentCharacterId = CHARACTERS[USER.currentCharacter];
let currentPlayerLineLetterIndex = currentMap.spawnLine - 1;
let currentPlayerColumn = currentMap.spawnColumn;

let isPlayerMoving = false;
let currentCharacter = getCurrentPlayerSprites();
let isOnRightFoot = true;

let fishes = 0;
let MAP_FISHES = [];
const fishImages = {
  front: `./medias/images/characters/fish-front.webp`,
  back: `./medias/images/characters/fish-back.webp`,
  left: `./medias/images/characters/fish-left.webp`,
  right: `./medias/images/characters/fish-right.webp`,
};

openAppCinematic(true);

// Sounds -------------------------------------------------
const buttonClickSound = new Audio('./medias/sounds/click.mp3');
buttonClickSound.volume = .25;
const fishBiteSound = new Audio('./medias/sounds/splash-loud.mp3');
const rewindRodSound = new Audio('./medias/sounds/remontee.mp3');
const failedBattleSound = new Audio('./medias/sounds/fail2.mp3');
const wonBattleSound = new Audio('./medias/sounds/success1.mp3');
const recordBattleSound = new Audio('./medias/sounds/success2.mp3');
const launchRodSound = new Audio('./medias/sounds/splash3.mp3');
const cancelFishingSound = new Audio('./medias/sounds/cancel.mp3');
const finishedGameSound = new Audio('./medias/sounds/success2.mp3'); // TODO

// Music --------------------------------------------------
const menuMusic = new Audio('./medias/music/home2.mp3');
menuMusic.loop = true;
menuMusic.volume = .25;
menuMusic.addEventListener("canplaythrough", (event) => {
  if (getUserSetting('menuMusic').isActive) {
    menuMusic.play();
  }
});
let mapMusic = new Audio('./medias/music/home2.mp3');
mapMusic.loop = true;
let mapBackgroundSound = new Audio('./medias/music/home2.mp3');
mapBackgroundSound.loop = true;

// ------------------------------------------------------------------------------------

const hasFishAlreadyBeenCaught = (fishId) => {
  let hasBeenCaught = false;
  let user = getUser();
  
  user.catches.forEach(caughtFish => {
    if (caughtFish.fishId == fishId && caughtFish.mapId == currentMap.id) {
      hasBeenCaught =  true;
    }
  });

  return hasBeenCaught;
}

const haveAllMapFishesHaveBeenCaught = (mapId) => {
  let mapToAnalyse = '';
  MAPS.forEach(map => {
    if (map.id == mapId) {
      mapToAnalyse = map;
    }
  });

  let uncaught = 0;

  mapToAnalyse.fishes.forEach(mapFish => {
    if (!hasFishAlreadyBeenCaught(mapFish.id)) {
      uncaught += 1;
    }
  });

  return uncaught == 0;
}

const isMapCompleted = (mapId) => {
  let isCompleted = false;
  let user = getUser();

  user.completedMaps.forEach(completedMap => {
    if (completedMap == mapId) {
      isCompleted =  true;
    }
  });
  return isCompleted;
}





