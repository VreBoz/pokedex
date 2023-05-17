let pokemonList;                                                    // Variable zur Speicherung der Pokemon-Liste
let allpkmn;                                                        // Variable zur Speicherung aller Pokemon-Namen
let allURL;                                                         // Variable zur Speicherung aller Pokemon-URLs
let pokemonIndex = 0;
let pokemonImages = [];
let pokemonTypes = [];

// Funktion zum Laden der Pokemon-Daten
async function loadPokemon() {
  let url = 'https://pokeapi.co/api/v2/pokemon?limit=494&offset=0'; // API-URL für die Pokemon-Liste
  let response = await fetch(url);                                  // API-Anfrage senden und auf die Antwort warten
  pokemonList = await response.json();                              // JSON-Daten der API-Antwort extrahieren
  allpkmn = pokemonList['results'];                                 // Alle Pokemon-Namen aus den JSON-Daten extrahieren
  allURL = allpkmn.map(pkmn => pkmn['url']);                        // Alle Pokemon-URLs aus den JSON-Daten extrahieren
  console.log('Loaded Pokemon', allpkmn);                           // Ausgabe der geladenen Pokemon-Namen

  await loadIndividuallyPokemon();                                  // Funktion aufrufen, um die individuellen Pokemon-Daten zu laden
  renderPokemonInfo();                                              // Funktion aufrufen, um die Pokemon-Namen anzuzeigen
  document.getElementById('load-more-btn').addEventListener('click', handleLoadMore);
}

// Funktion zum Laden der individuellen Pokemon-Daten
async function loadIndividuallyPokemon() {
  for (let i = 0; i < allURL.length; i++) {
    let url = allURL[i];                                            // Aktuelle Pokemon-URL auswählen
    console.log('URL:', url);                                       // Ausgabe der aktuellen URL
    let response = await fetch(url);                                // API-Anfrage für das individuelle Pokemon senden und auf die Antwort warten
    let data = await response.json();                               // JSON-Daten der API-Antwort extrahieren
    let pokemonImage = data['sprites']['other']['dream_world']['front_default']; // Hier wird das entsprechende Bild für das Pokemon abgerufen
    pokemonImages.push(pokemonImage);                               // Das Bild wird dem Array hinzugefügt
    console.log('API response:', pokemonImage);                     // Ausgabe des Bildes für das individuelle Pokemon
  }
}

// Funktion zur Darstellung der Pokemon-Namen auf der Seite
function renderPokemonInfo() {
  let container = document.getElementById('pokemonName');
  let pokemonInfo = container.innerHTML;                             // Vorherige Pokemon-Informationen beibehalten

  for (let i = pokemonIndex; i < pokemonIndex + 40 && i < allpkmn.length; i++) {
    const pkmn = allpkmn[i];
    const capitalized = capitalizeFirstLetter(pkmn['name']);
    const pokemonImage = pokemonImages[i];                            // Hier wird das entsprechende Bild für das Pokemon aus dem Array abgerufen

    pokemonInfo += `
      <div class="pkmn-name-img">
        <h3>${capitalized}</h3>
        <img id="pokemon-icons" src="${pokemonImage}" alt="${capitalized}">
        <div>
          <span class="pkmn-type">grass</span>
          <span class="pkmn-type">fire</span>
        </div>
      </div>`;
  }

  container.innerHTML = pokemonInfo;
}

function handleLoadMore() {
  pokemonIndex += 40;
  renderPokemonInfo();
}

// Funktion zum Großschreiben des ersten Buchstabens eines Strings
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);    
}