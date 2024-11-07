"use strict";

const button = document.querySelector(".js-button");
const input = document.querySelector(".js-input");
const results = document.querySelector(".js-results");
const favorites = document.querySelector(".js-favorites");
let seriesData = [];
let favoritesSeries = [];

const renderSeries = (series) => {
  for (const serie of series) {
    results.innerHTML += `
        <li class="js-serie" id=${serie.idSerie}>
            <img
              src=${serie.urlImage}
              alt=""
            />
            <p>${serie.titleSerie}</p>
          </li>
        `;
  }
};

const renderSeriesFavorites = (series) => {
  favorites.innerHTML = "";
  for (const serie of series) {
    favorites.innerHTML += `
        <li class="js-serie" id=${serie.idSerie}>
            <img
              src=${serie.urlImage}
              alt=""
            />
            <p>${serie.titleSerie}</p>
          </li>
        `;
  }
};

const addFavoritesSeries = () => {
  const seriesSelected = document.querySelectorAll(".js-serie");
  for (const serieSelected of seriesSelected) {
    serieSelected.addEventListener("click", handleFavorites);
  }
};

const saveLocalStorage = (series) => {
  console.log("para el localStorage, series es", series);
  localStorage.setItem("favoriteSeries", JSON.stringify(series));
};

const handleFavorites = (event) => {
  // console.log("event.currentTarget", event.currentTarget);
  const serieClicked = event.currentTarget;
  const idSerieClicked = parseInt(event.currentTarget.id);
  // console.log("typeof idSerieClicked", typeof idSerieClicked);
  // console.log("idSerieClicked", idSerieClicked);
  serieClicked.classList.toggle("favorite__serie");

  const serieToAddFavorite = seriesData.find((serie) => {
    // console.log("idSerie es", serie.idSerie);
    return serie.idSerie === idSerieClicked;
  });
  favoritesSeries.push(serieToAddFavorite);
  console.log("favoritesSeries es", favoritesSeries);

  renderSeriesFavorites(favoritesSeries);
  saveLocalStorage(favoritesSeries);
};

const handleSearch = () => {
  const inputValue = input.value;

  fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log("data es", data);
      const series = data.data;
      // console.log("series es", series);

      for (const serie of series) {
        /*Cuántas páginas hay
        const totalPages = data.pagination.items.total;
        const seriePerPage = data.pagination.items.per_page;
        const pages = Math.ceil(totalPages / seriePerPage);
        console.log("Hay", pages, "páginas");
        */

        // Si no hay imagen en el listado, pinta la imagen de TV, sino, pinta la imagen que viene en el listado
        const urlImage =
          serie.images.jpg.image_url ===
          "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
            ? "https://via.placeholder.com/210x295/ffffff/666666/?text=TV"
            : serie.images.jpg.image_url;

        const titleSerie = serie.title;
        const idSerie = serie.mal_id;
        seriesData.push({
          urlImage,
          titleSerie,
          idSerie,
        });
      }
      console.log("seriesData es:", seriesData);
      renderSeries(seriesData);
      addFavoritesSeries();
    });
};

button.addEventListener("click", handleSearch);

const checkLocalStorage = () => {
  const cache = JSON.parse(localStorage.getItem("favoriteSeries"));
  console.log("cache es", cache);

  if (cache !== null) {
    favoritesSeries = cache;
    renderSeriesFavorites(cache);
  }
};
checkLocalStorage();
