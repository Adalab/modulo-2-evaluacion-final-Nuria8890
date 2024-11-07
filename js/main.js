"use strict";

const button = document.querySelector(".js-button");
const input = document.querySelector(".js-input");
const results = document.querySelector(".js-results");

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

        results.innerHTML += `
        <li>
            <img
              src=${urlImage}
              alt=""
            />
            <p>${titleSerie}</p>
          </li>
        `;
      }
    });
};

button.addEventListener("click", handleSearch);
