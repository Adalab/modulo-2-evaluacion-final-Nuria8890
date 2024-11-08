const search = document.querySelector(".js-submit");
const reset = document.querySelector(".js-reset");
const input = document.querySelector(".js-input");
const form = document.querySelector(".js-form");
const results = document.querySelector(".js-results");
const favorites = document.querySelector(".js-favorites");
let seriesToPaint = [];
let favoritesSeries = [];

// Ejercicio 1: Búsqueda
/* Cuando hago click en el botón buscar
    - Recoger el valor del input
      - Hacer la solicitud al servidor con ese valor
        - Por cada serie recogida, pintar una tarjeta con la imagen y el título
          - Si no hay imagen, poner: "https://via.placeholder.com/100x100/f08080/add8e6/?text=NoImage"
*/

const paintinCard = (series) => {
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
    <li class="js-serie ${thisSerieIsFavorite}" id=${serie.id}>
      <img class="img__results"
        src=${serie.urlImage}
        alt="${serie.title}"
      />
      <p class="results__p">${serie.title}</p>
    </li>
    `;
  }
};

// Ejercicio 2: favoritos

/*Cuando ya he pintado las series
  - Al hacer click en cada serie
    - añadir una clase que marque la serie
    - crear una variable de series favoritas
      - pintar esa variable en el listado de favoritos
  - Si vuelvo a hacer click en una serie que ya se encuentra en el listado de favoritos, que no la vuelva a añadir a ese listado
*/

const paintinCardFavorites = (series) => {
  favorites.innerHTML = "";
  for (const serie of series) {
    favorites.innerHTML += `
    <li class="li__favorites js-serie" id=${serie.id}>
      <img class="img__favorites"
        src=${serie.urlImage}
        alt="${serie.title}"
      />
      <p class="favorites__p">${serie.title}</p>
    </li>
    `;
  }
};

// Ejercicio 3: almacenamiento local

const saveLocalStorage = (series) => {
  console.log("para el localStorage, series es", series);
  localStorage.setItem("favoriteSeries", JSON.stringify(series));
};

const handleFavorites = (event) => {
  const serieClicked = event.currentTarget;
  const idSerieClicked = parseInt(event.currentTarget.id);

  console.log("estoy en handeFavorites, idSerieClicked es", idSerieClicked);

  const idSerieInFavorite = favoritesSeries.findIndex(
    (favoriteSerie) => favoriteSerie.id === idSerieClicked
  );
  console.log("idSerieInFavorite es", idSerieInFavorite);
  if (idSerieInFavorite !== -1) {
    favoritesSeries.splice(idSerieInFavorite, 1);
    serieClicked.classList.remove("favorite__serie");
    paintinCardFavorites(favoritesSeries);
    saveLocalStorage(favoritesSeries);
  } else {
    serieClicked.classList.add("favorite__serie");
    const serieToAddFavorite = seriesToPaint.find((serie) => {
      return serie.id === idSerieClicked;
    });

    favoritesSeries.push(serieToAddFavorite);
    console.log("favoritesSeries es", favoritesSeries);

    paintinCardFavorites(favoritesSeries);
    saveLocalStorage(favoritesSeries);
  }
};

const addFavoritesSeries = () => {
  const seriesSelected = document.querySelectorAll(".js-serie");
  for (const serieSelected of seriesSelected) {
    serieSelected.addEventListener("click", handleFavorites);
  }
};

// Ejercicio 1: Búsqueda

const handleSearch = (event) => {
  event.preventDefault();
  const inputValue = input.value;

  fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      const serverSeries = data.data;
      seriesToPaint = [];
      for (const serie of serverSeries) {
        // Si no hay imagen en el listado, pinta la imagen de TV, sino, pinta la imagen que viene en el listado
        const urlImage =
          serie.images.jpg.image_url ===
          "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
            ? "https://via.placeholder.com/100x100/f08080/add8e6/?text=NoImage"
            : serie.images.jpg.image_url;

        const title = serie.title;
        const id = serie.mal_id;

        // Creo un nuevo array donde incluyo solo los datos que necesito para pintar las series
        seriesToPaint.push({
          urlImage,
          title,
          id,
        });
      }
      paintinCard(seriesToPaint);
      addFavoritesSeries();
    });
};

search.addEventListener("click", handleSearch);

//  Ejercicio 3: almacenamiento local
/*Cuando se recargue la página
  - La lista de favoritos tiene que ser visible
*/

const checkLocalStorage = () => {
  const cache = JSON.parse(localStorage.getItem("favoriteSeries"));

  if (cache !== null) {
    favoritesSeries = cache;
    paintinCardFavorites(cache);
  }
};
checkLocalStorage();

const handleReset = () => {
  results.innerHTML = "";
  // form.reset();
};

reset.addEventListener("click", handleReset);
