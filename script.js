const pokmnTypesBg = [
  'grass',
  'fire',
  'water',
  'electric',
  'bug',
  'normal',
  'flying',
  'poison',
  'ground',
  'rock',
  'fighting',
  'psychic',
  'ghost',
  'ice',
  'dragon',
  'fairy',
  'steel',
  'dark',
  'electric/flying',
  'water/flying'
];

let typeColors = {
  grass: 'rgba(123, 206, 82, 0.8)',       // Grün
  fire: 'rgba(247, 82, 49, 0.8)',        // Rot
  water: 'rgba(57, 156, 255, 0.8)',       // Blau
  electric: 'rgba(255, 198, 49, 0.8)',  // Gelb
  bug: 'rgba(173, 189, 33, 0.8)',       // Dunkelgelb
  normal: 'rgba(173, 165, 148, 0.8)',  // Grau
  flying: 'rgba(156, 173, 247, 0.8)',        // Schwarz
  poison: 'rgba(181, 90, 165, 0.8)',    // Violett
  ground: 'rgba(214, 181, 90, 0.8)',    // Braun
  rock: 'rgba(189, 165, 90, 0.8)',      // Braun
  fighting: 'rgba(165, 82, 57, 0.8)',    // Dunkelrot
  psychic: 'rgba(255, 115, 165, 0.8)',   // Pink
  ghost: 'rgba(99, 99, 181, 0.8)',     // Violett
  ice: 'rgba(90, 206, 231, 0.8)',       // Hellblau
  dragon: 'rgba(123, 99, 231, 0.8)',     // Indigo
  fairy: 'rgba(230, 165, 230, 0.8)',   // Rosa
  steel: 'rgba(173, 173, 198, 0.8)',   // Silber
  dark: 'rgba(115, 90, 74, 0.8)'          // Schwarz
  // Weitere Typen und Farben hier hinzufügen
};

let typeColorsBig = {
  grass: 'rgb(123, 206, 82)', // Grün
  fire: 'rgb(247, 82, 49)', // Rot
  water: 'rgb(57, 156, 255)', // Blau
  electric: 'rgb(255, 198, 49)', // Gelb
  bug: 'rgb(173, 189, 33)', // Dunkelgelb
  normal: 'rgb(173, 165, 148)', // Grau
  flying: 'rgb(156, 173, 247)', // Schwarz
  poison: 'rgb(181, 90, 165)', // Violett
  ground: 'rgb(214, 181, 90)', // Braun
  rock: 'rgb(189, 165, 90)', // Braun
  fighting: 'rgb(165, 82, 57)', // Dunkelrot
  psychic: 'rgb(255, 115, 165)', // Pink
  ghost: 'rgb(99, 99, 181)', // Violett
  ice: 'rgb(90, 206, 231)', // Hellblau
  dragon: 'rgb(123, 99, 231)', // Indigo
  fairy: 'rgb(230, 165, 230)', // Rosa
  steel: 'rgb(173, 173, 198)', // Silber
  dark: 'rgb(115, 90, 74)' // Schwarz
  // Weitere Typen und Farben hier hinzufügen
  };

let pokemonList;                                                    // Variable zur Speicherung der Pokemon-Liste
let allpkmn;                                                        // Variable zur Speicherung aller Pokemon-Namen
let allURL;                                                         // Variable zur Speicherung aller Pokemon-URLs
let pokemonIndex = 0;
let pokemonImages = [];
let allTypes = [];
let allIds = [];

// Funktion zum Laden der Pokemon-Daten
async function loadPokemon() {
  let url = 'https://pokeapi.co/api/v2/pokemon?limit=494&offset=0'; // API-URL für die Pokemon-Liste
  let response = await fetch(url);                                  // API-Anfrage senden und auf die Antwort warten
  pokemonList = await response.json();                              // JSON-Daten der API-Antwort extrahieren
  allpkmn = pokemonList['results'];                                 // Alle Pokemon-Namen aus den JSON-Daten extrahieren
  allURL = allpkmn.map(pkmn => pkmn['url']);                        // Alle Pokemon-URLs aus den JSON-Daten extrahieren
  // console.log('Loaded Pokemon', allpkmn);                           // Ausgabe der geladenen Pokemon-Namen

  await loadIndividuallyPokemon();                                  // Funktion aufrufen, um die individuellen Pokemon-Daten zu laden
  await loadAllTypes();
  renderPokemonInfo();
  bgSwich();                                             // Funktion aufrufen, um die Pokemon-Namen anzuzeigen
  document.getElementById('load-more-btn').addEventListener('click', handleLoadMore);
  document.getElementById('load-more-btn').style.display = "block";
}

async function loadPokemonId() {
  
}

// Funktion zum Laden der individuellen Pokemon-Daten
async function loadIndividuallyPokemon() {
  for (let i = 0; i < allURL.length; i++) {
    let url = allURL[i];  // Aktuelle Pokemon-URL auswählen
    // console.log('URL:', url);  // Ausgabe der aktuellen URL (auskommentiert)

    let response = await fetch(url);  // API-Anfrage für das individuelle Pokemon senden und auf die Antwort warten
    let data = await response.json();  // JSON-Daten der API-Antwort extrahieren

    let pokemonImage = data['sprites']['other']['dream_world']['front_default'];  // Hier wird das entsprechende Bild für das Pokemon abgerufen
    pokemonImages.push(pokemonImage);  // Das Bild wird dem Array hinzugefügt

    let id = String(data['id']).padStart(3, '0');  // Pokemon-ID im gewünschten Format generieren und als String speichern
    allIds.push(id);  // Pokemon-ID zum Array hinzufügen

    // console.log('all ids:', allIds);  // Ausgabe der IDs (auskommentiert)
  }
}

async function loadAllTypes() {
  for (let i = 0; i < allURL.length; i++) {
    let url = allURL[i];
    let response = await fetch(url);
    let data = await response.json();
    let pokemonTypes = data['types'];

    let types = [];
    for (let j = 0; j < pokemonTypes.length; j++) {
      let type = pokemonTypes[j].type.name;
      types.push(type);
    }
    allTypes.push(types);
    
  }
}

// Funktion zur Darstellung der Pokemon-Namen auf der Seite
function renderPokemonInfo() {
  let container = document.getElementById('pokemonName');
  let pokemonInfo = container.innerHTML;

  for (let i = pokemonIndex; i < pokemonIndex + 40 && i < allpkmn.length; i++) {
    const pkmn = allpkmn[i];
    const capitalized = capitalizeFirstLetter(pkmn['name']);
    const pokemonImage = pokemonImages[i];
    const pokemonTypes = allTypes[i]; // Die entsprechenden Typen für das Pokemon abrufen
    const pokemonIds = allIds[i];
    

    let typesHTML = '';
    for (let j = 0; j < pokemonTypes.length; j++) {
      typesHTML += `<span id="type-color" class="pkmn-type">${pokemonTypes[j]}</span>`;
    }

    pokemonInfo += `
  <div id="b-g-swich${i}" class="pkmn-name-img" data-type="${pokemonTypes[0]}" onclick="renderBigPokemonCard('${i}','${capitalized}','${pokemonImage}','${pokemonIds}',)">
  
    <h3>${capitalized}</h3>
    <img id="pokemon-icons" src="${pokemonImage}" alt="${capitalized}">
    <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM5.07089 13C5.55612 16.3923 8.47353 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H14.8293C14.4174 14.1652 13.3062 15 12 15C10.6938 15 9.58251 14.1652 9.17068 13H5.07089ZM18.9291 11C18.4439 7.60771 15.5265 5 12 5C8.47353 5 5.55612 7.60771 5.07089 11H9.17068C9.58251 9.83481 10.6938 9 12 9C13.3062 9 14.4174 9.83481 14.8293 11H18.9291ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
</svg>
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
   <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
   <path d="M3 12h6"></path>
   <path d="M15 12h6"></path>
</svg>
    <div class="type-div">
      ${typesHTML}
    </div>
    <div>
      <p class="id-nr">#${pokemonIds}</p>
    </div>
  </div>`;
  }

  container.innerHTML = pokemonInfo;
  bgSwich();
}

function renderBigPokemonCard(i,capitalized,pokemonImage,pokemonIds,) {
  let bigCard = document.getElementById('big-card');
  let pokemonTypes = allTypes[i]
  
  bigCard.innerHTML = '';
  let typesHTML = '';
    for (let j = 0; j < pokemonTypes.length; j++) {
      typesHTML += `<span id="type-color" class="pkmn-type">${pokemonTypes[j]}</span>`;
      
    }
    console.log(pokemonTypes);

  
  
    bigCard.innerHTML = `
    <div class="bgTwo" data-type="${pokemonTypes[0]}">
    <div class="like-close">
      <img  onclick="hidePkmnBg()" class="icon-width" src="./img/icons8-schließen-67.png" alt="">
      <img class="icon-width" src="./img/heart-white.png" alt="">
    </div>
    <svg class="big-SVG" width="300px" height="300px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM5.07089 13C5.55612 16.3923 8.47353 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H14.8293C14.4174 14.1652 13.3062 15 12 15C10.6938 15 9.58251 14.1652 9.17068 13H5.07089ZM18.9291 11C18.4439 7.60771 15.5265 5 12 5C8.47353 5 5.55612 7.60771 5.07089 11H9.17068C9.58251 9.83481 10.6938 9 12 9C13.3062 9 14.4174 9.83481 14.8293 11H18.9291ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
    </svg>

    
    <img  class="img-absolute" src="${pokemonImage}" alt="${capitalized}">
    <div class="info-div">
      <div>
        <h3>${capitalized}</h3>
        <div>${typesHTML}</div>
      </div>
      <p class="id-nr">#${pokemonIds}</p>
    </div>
    
  </div>

    `
  
  document.getElementById('pkmn-bg').classList.remove('d-none');
  bgSwichCard();
  // bigCard.innerHTML = pokemonInfo;


}

function hidePkmnBg() {
  document.getElementById('pkmn-bg').classList.add('d-none')
}


function bgSwich() {
  // Definiere eine Farbtabelle für verschiedene Pokemon-Typen
  

  // Alle Elemente mit der Klasse 'pkmn-name-img' auswählen
  let pokemonElements = document.getElementsByClassName('pkmn-name-img');
  
  // Schleife über alle ausgewählten Elemente
  for (let i = 0; i < pokemonElements.length; i++) {
    let pokemonElement = pokemonElements[i];
    let type = pokemonElement.dataset.type; // Den Pokemon-Typ aus dem 'data-type'-Attribut des Elements abrufen

    // Überprüfen, ob der Typ in der Farbtabelle vorhanden ist
    if (typeColors.hasOwnProperty(type)) {
      let bgColor = typeColors[type]; // Die Hintergrundfarbe für den Typ aus der Farbtabelle abrufen
      pokemonElement.style.backgroundColor = bgColor; // Die Hintergrundfarbe des Elements setzen
    }
  }
  bgSwichCard();
}

function bgSwichCard() {
  // Definiere eine Farbtabelle für verschiedene Pokemon-Typen
  

  // Alle Elemente mit der Klasse 'big-card' auswählen
  let pokemonElements = document.getElementsByClassName('bgTwo');
  
  // Schleife über alle ausgewählten Elemente
  for (let i = 0; i < pokemonElements.length; i++) {
    let pokemonElement = pokemonElements[i];
    let type = pokemonElement.dataset.type; // Den Pokemon-Typ aus dem 'data-type'-Attribut des Elements abrufen

    // Überprüfen, ob der Typ in der Farbtabelle vorhanden ist
    if (typeColorsBig.hasOwnProperty(type)) {
      let bgColor = typeColorsBig[type]; // Die Hintergrundfarbe für den Typ aus der Farbtabelle abrufen
      pokemonElement.style.backgroundColor = bgColor; // Die Hintergrundfarbe des Elements setzen
    }
  }
}

function handleLoadMore() {
  pokemonIndex += 40;
  renderPokemonInfo();
}

// Funktion zum Großschreiben des ersten Buchstabens eines Strings
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);    
}