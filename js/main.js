const search = document.querySelector(".js-submit");
const reset = document.querySelector(".js-reset");
const deleteFavorites = document.querySelector(".js-deleteFavorites");
const input = document.querySelector(".js-input");
const results = document.querySelector(".js-results");
const favorites = document.querySelector(".js-favorites");
let searchedSeries = [];
let favoritesSeries = [];

// 1º Chequea el localStorage para comprobar si existen series guardadas en caché y las pinta.
function checkLocalStorage() {
  const cache = JSON.parse(localStorage.getItem("favoriteSeries"));

  if (cache !== null) {
    favoritesSeries = cache;
    paintinCardFavorites(cache);
  }
}
checkLocalStorage();

// Esta función se usa al cargar la página y cuando hago click en una serie que quiero que sea favorita
function paintinCardFavorites(series) {
  favorites.innerHTML = "";
  for (const serie of series) {
    favorites.innerHTML += `
    <li class="favorites__li js-serie" id=${serie.id}>
      <img class="favorites__img"
        src=${serie.urlImage}
        alt="${serie.title}"
      />
      <p class="favorites__p">${serie.title}</p>
    </li>
    `;
  }
}

// 2º Al hacer click en buscar, descarga las series de la API y las pinta.
search.addEventListener("click", handleSearch);

function handleSearch(event) {
  event.preventDefault();
  const inputValue = input.value;

  fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      const serverSeries = data.data;
      searchedSeries = [];
      for (const serie of serverSeries) {
        // Si no hay imagen en el listado, pinta una imagen por defecto, sino, pinta la imagen que viene en el listado.
        const urlImage =
          serie.images.jpg.image_url ===
          "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
            ? "https://via.placeholder.com/100x100/f08080/add8e6/?text=NoImage"
            : serie.images.jpg.image_url;

        const title = serie.title;
        const id = serie.mal_id;

        // Creo un nuevo array donde incluyo solo los datos que necesito para pintar las series
        searchedSeries.push({
          urlImage,
          title,
          id,
        });
      }
      paintinCard(searchedSeries);
      addEventListenerToAllSeriesPainted();
    });
}

function paintinCard(series) {
  results.innerHTML = "";

  for (const serie of series) {
    let thisSerieIsFavorite = "";

    if (
      favoritesSeries.find((serieFavorite) => {
        return serie.id === serieFavorite.id;
      }) !== undefined
    ) {
      thisSerieIsFavorite = "favorite__serie";
    }

    results.innerHTML += `
    <li class="results__li js-serie ${thisSerieIsFavorite}" id=${serie.id}>
      <img class="results__img"
        src=${serie.urlImage}
        alt="${serie.title}"
      />
      <p class="results__p">${serie.title}</p>
    </li>
    `;
  }
}

// 3º Puedo seleccionar varias series como favoritas y guardarlas en caché
function addEventListenerToAllSeriesPainted() {
  const seriesSelected = document.querySelectorAll(".js-serie");
  for (const serieSelected of seriesSelected) {
    serieSelected.addEventListener("click", handleFavorites);
  }
}

function handleFavorites(event) {
  const serieClicked = event.currentTarget;
  const idSerieClicked = parseInt(event.currentTarget.id);

  // Compruebo si la serie ha sido guardada previamente, y saco la posición en el array
  const idSerieInFavorite = favoritesSeries.findIndex(
    (favoriteSerie) => favoriteSerie.id === idSerieClicked,
  );

  // Si la serie está guardada como favorita, la borra al hacer click
  if (idSerieInFavorite !== -1) {
    // elimino la serie clickada del array
    favoritesSeries.splice(idSerieInFavorite, 1);

    serieClicked.classList.remove("favorite__serie");
  } else {
    // Si la serie NO está guardada como favorita, la guarda al hacer click

    // localizo la serie en el array que he conseguido de la API
    const serieToAddFavorite = searchedSeries.find((serie) => {
      return serie.id === idSerieClicked;
    });
    // añado la serie clickada al array
    favoritesSeries.push(serieToAddFavorite);

    serieClicked.classList.add("favorite__serie");
  }

  paintinCardFavorites(favoritesSeries);
  saveLocalStorage(favoritesSeries);
}

// Cuando clicko en una serie que quiero que sea favorita, la guardo en caché.
function saveLocalStorage(series) {
  localStorage.setItem("favoriteSeries", JSON.stringify(series));
}

// Cuando hago click en el botón de "reset", solo se borra la búsqueda
reset.addEventListener("click", handleReset);

function handleReset() {
  results.innerHTML = "";
}

// Cuando hago click en el botón "eliminar series favoritas", borro las series de la página, del caché y del array
deleteFavorites.addEventListener("click", handleDeleteFavorites);

function handleDeleteFavorites() {
  favorites.innerHTML = "";
  localStorage.removeItem("favoriteSeries");
  favoritesSeries = [];
}
