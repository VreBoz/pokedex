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

let pokemonList;                                                    // Variable zur Speicherung der Pokemon-Liste
let allpkmn;                                                        // Variable zur Speicherung aller Pokemon-Namen
let allURL;                                                         // Variable zur Speicherung aller Pokemon-URLs
let pokemonIndex = 0;
let pokemonImages = [];
let allTypes = [];

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
  await renderPokemonInfo();
  bgSwich();                                             // Funktion aufrufen, um die Pokemon-Namen anzuzeigen
  document.getElementById('load-more-btn').addEventListener('click', handleLoadMore);
}

// Funktion zum Laden der individuellen Pokemon-Daten
async function loadIndividuallyPokemon() {
  for (let i = 0; i < allURL.length; i++) {
    let url = allURL[i];                                            // Aktuelle Pokemon-URL auswählen
    // console.log('URL:', url);                                       // Ausgabe der aktuellen URL
    let response = await fetch(url);                                // API-Anfrage für das individuelle Pokemon senden und auf die Antwort warten
    let data = await response.json();                               // JSON-Daten der API-Antwort extrahieren
    let pokemonImage = data['sprites']['other']['dream_world']['front_default']; // Hier wird das entsprechende Bild für das Pokemon abgerufen
    pokemonImages.push(pokemonImage);                               // Das Bild wird dem Array hinzugefügt
    // console.log('API response:', pokemonImage);                     // Ausgabe des Bildes für das individuelle Pokemon
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
    bgSwich();

    let typesHTML = '';
    for (let j = 0; j < pokemonTypes.length; j++) {
      typesHTML += `<span id="type-color" class="pkmn-type">${pokemonTypes[j]}</span>`;
    }

    pokemonInfo += `
  <div id="b-g-swich" class="pkmn-name-img" data-type="${pokemonTypes[0]}">
    <h3>${capitalized}</h3>
    <img id="pokemon-icons" src="${pokemonImage}" alt="${capitalized}">
    <div>
      ${typesHTML}
    </div>
  </div>`;
  }

  container.innerHTML = pokemonInfo;
  bgSwich();
}

function bgSwich() {
  // Definiere eine Farbtabelle für verschiedene Pokemon-Typen
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
}

function handleLoadMore() {
  pokemonIndex += 40;
  renderPokemonInfo();
}

// Funktion zum Großschreiben des ersten Buchstabens eines Strings
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);    
}